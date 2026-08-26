import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, ref } from 'vue';
import { describe, expect, it } from 'vitest';
import ColorSwatch from '../src/components/SwatchPicker/ColorSwatch.vue';
import EmptySwatch from '../src/components/SwatchPicker/EmptySwatch.vue';
import ImageSwatch from '../src/components/SwatchPicker/ImageSwatch.vue';
import SwatchPicker from '../src/components/SwatchPicker/SwatchPicker.vue';
import SwatchPickerRow from '../src/components/SwatchPicker/SwatchPickerRow.vue';

function rowFixture(props: Record<string, unknown> = {}) {
  return mount(SwatchPicker, {
    props,
    attrs: { 'aria-label': 'Colors' },
    slots: {
      default: () => [
        h(ColorSwatch, { value: 'red', color: '#f00', 'aria-label': 'Red' }),
        h(ColorSwatch, { value: 'green', color: '#0f0', 'aria-label': 'Green' }),
        h(ImageSwatch, { value: 'texture', src: 'texture.png', 'aria-label': 'Texture' }),
        h(EmptySwatch, { 'aria-label': 'Add color' }),
      ],
    },
  });
}

describe('SwatchPicker family', () => {
  it('renders row radiogroup semantics, defaults, and roving tabindex', async () => {
    const wrapper = rowFixture({ defaultValue: 'green' });
    await nextTick();
    await Promise.resolve();
    const buttons = wrapper.findAll('button');
    expect(wrapper.attributes('role')).toBe('radiogroup');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['fui-SwatchPicker--row', 'fui-SwatchPicker--spacing-medium']),
    );
    expect(buttons[0]!.attributes()).toMatchObject({
      role: 'radio',
      'aria-checked': 'false',
      tabindex: '-1',
    });
    expect(buttons[1]!.attributes()).toMatchObject({
      role: 'radio',
      'aria-checked': 'true',
      tabindex: '0',
    });
    expect(buttons[2]!.attributes('aria-checked')).toBe('false');
    expect(buttons[3]!.attributes('aria-checked')).toBe('false');
  });

  it('supports uncontrolled and controlled selection events', async () => {
    const uncontrolled = rowFixture();
    await uncontrolled.findAll('button')[1]!.trigger('click');
    expect(uncontrolled.emitted('update:modelValue')).toEqual([['green']]);
    expect(uncontrolled.emitted('selectionChange')?.[0]?.[1]).toEqual({
      selectedValue: 'green',
      selectedSwatch: '#0f0',
    });
    expect(uncontrolled.findAll('button')[1]!.attributes('aria-checked')).toBe('true');

    const controlled = rowFixture({ modelValue: 'red' });
    await controlled.findAll('button')[1]!.trigger('click');
    expect(controlled.emitted('update:modelValue')).toEqual([['green']]);
    expect(controlled.findAll('button')[0]!.attributes('aria-checked')).toBe('true');
    expect(controlled.findAll('button')[1]!.attributes('aria-checked')).toBe('false');
  });

  it('recognizes explicitly bound undefined as controlled', async () => {
    const wrapper = rowFixture({ modelValue: undefined, defaultValue: 'red' });
    await wrapper.findAll('button')[1]!.trigger('click');
    expect(wrapper.findAll('button')[0]!.attributes('aria-checked')).toBe('false');
    expect(wrapper.findAll('button')[1]!.attributes('aria-checked')).toBe('false');
  });

  it('uses circular arrow navigation, skips disabled swatches, and supports Home/End', async () => {
    const wrapper = mount(SwatchPicker, {
      attachTo: document.body,
      slots: {
        default: () => [
          h(ColorSwatch, { value: 'red', color: '#f00', 'aria-label': 'Red' }),
          h(ColorSwatch, { value: 'green', color: '#0f0', disabled: true, 'aria-label': 'Green' }),
          h(ColorSwatch, { value: 'blue', color: '#00f', 'aria-label': 'Blue' }),
        ],
      },
    });
    await nextTick();
    const buttons = wrapper.findAll('button');
    buttons[0]!.element.focus();
    await buttons[0]!.trigger('keydown', { key: 'ArrowRight' });
    expect(document.activeElement).toBe(buttons[2]!.element);
    await buttons[2]!.trigger('keydown', { key: 'ArrowRight' });
    expect(document.activeElement).toBe(buttons[0]!.element);
    await buttons[0]!.trigger('keydown', { key: 'End' });
    expect(document.activeElement).toBe(buttons[2]!.element);
    await buttons[2]!.trigger('keydown', { key: 'Home' });
    expect(document.activeElement).toBe(buttons[0]!.element);
    wrapper.unmount();
  });

  it('reverses horizontal arrow navigation in RTL', async () => {
    const host = document.createElement('div');
    host.dir = 'rtl';
    document.body.append(host);
    const wrapper = mount(SwatchPicker, {
      attachTo: host,
      props: { defaultValue: 'green' },
      slots: {
        default: () => [
          h(ColorSwatch, { value: 'red', color: '#f00', 'aria-label': 'Red' }),
          h(ColorSwatch, { value: 'green', color: '#0f0', 'aria-label': 'Green' }),
          h(ImageSwatch, { value: 'texture', src: 'texture.png', 'aria-label': 'Texture' }),
        ],
      },
    });
    await nextTick();
    const buttons = wrapper.findAll('button');
    buttons[1]!.element.focus();
    await buttons[1]!.trigger('keydown', { key: 'ArrowRight' });
    expect(document.activeElement).toBe(buttons[0]!.element);
    wrapper.unmount();
    host.remove();
  });

  it('supports grid roles and preserves columns between rows', async () => {
    const wrapper = mount(SwatchPicker, {
      attachTo: document.body,
      props: { layout: 'grid', defaultValue: 'b' },
      attrs: { 'aria-label': 'Grid colors' },
      slots: {
        default: () => [
          h(SwatchPickerRow, {}, () => [
            h(ColorSwatch, { value: 'a', color: '#111', 'aria-label': 'A' }),
            h(ColorSwatch, { value: 'b', color: '#222', 'aria-label': 'B' }),
          ]),
          h(SwatchPickerRow, {}, () => [
            h(ColorSwatch, { value: 'c', color: '#333', 'aria-label': 'C' }),
            h(ColorSwatch, { value: 'd', color: '#444', 'aria-label': 'D' }),
          ]),
        ],
      },
    });
    await nextTick();
    const buttons = wrapper.findAll('button');
    expect(wrapper.attributes('role')).toBe('grid');
    expect(wrapper.findAll('[role="row"]')).toHaveLength(2);
    expect(buttons[1]!.attributes()).toMatchObject({ role: 'gridcell', 'aria-selected': 'true' });
    buttons[1]!.element.focus();
    await buttons[1]!.trigger('keydown', { key: 'ArrowDown' });
    expect(document.activeElement).toBe(buttons[3]!.element);
    wrapper.unmount();
  });

  it('applies picker size/shape/spacing and permits local overrides', () => {
    const wrapper = mount(SwatchPicker, {
      props: { size: 'large', shape: 'circular', spacing: 'small' },
      slots: {
        default: () => [
          h(ColorSwatch, { value: 'red', color: '#f00' }),
          h(ImageSwatch, { value: 'image', src: 'image.png', size: 'small', shape: 'rounded' }),
          h(EmptySwatch),
        ],
      },
    });
    expect(wrapper.classes()).toContain('fui-SwatchPicker--spacing-small');
    expect(wrapper.find('.fui-ColorSwatch').classes()).toEqual(
      expect.arrayContaining(['fui-Swatch--large', 'fui-Swatch--circular']),
    );
    expect(wrapper.find('.fui-ImageSwatch').classes()).toEqual(
      expect.arrayContaining(['fui-Swatch--small', 'fui-Swatch--rounded']),
    );
    expect(wrapper.find('.fui-EmptySwatch').classes()).toEqual(
      expect.arrayContaining(['fui-Swatch--large', 'fui-Swatch--circular']),
    );
  });

  it('does not select disabled or empty swatches', async () => {
    const wrapper = mount(SwatchPicker, {
      slots: {
        default: () => [
          h(ColorSwatch, { value: 'red', color: '#f00', disabled: true }),
          h(EmptySwatch),
        ],
      },
    });
    const buttons = wrapper.findAll('button');
    await buttons[0]!.trigger('click');
    await buttons[1]!.trigger('click');
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    expect(buttons[0]!.attributes('disabled')).toBeDefined();
  });

  it('updates controlled values without emitting prop-only events', async () => {
    const selected = ref('red');
    const Fixture = defineComponent({
      setup: () => () =>
        h(
          SwatchPicker,
          { modelValue: selected.value },
          {
            default: () => [
              h(ColorSwatch, { value: 'red', color: '#f00' }),
              h(ColorSwatch, { value: 'green', color: '#0f0' }),
            ],
          },
        ),
    });
    const wrapper = mount(Fixture);
    selected.value = 'green';
    await nextTick();
    expect(wrapper.findAll('button')[1]!.attributes('aria-checked')).toBe('true');
    expect(wrapper.findComponent(SwatchPicker).emitted('update:modelValue')).toBeUndefined();
  });
});
