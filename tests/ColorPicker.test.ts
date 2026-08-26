import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, ref } from 'vue';
import { describe, expect, it } from 'vitest';
import AlphaSlider from '../src/components/ColorPicker/AlphaSlider.vue';
import ColorArea from '../src/components/ColorPicker/ColorArea.vue';
import ColorPicker from '../src/components/ColorPicker/ColorPicker.vue';
import ColorSlider from '../src/components/ColorPicker/ColorSlider.vue';

const red = { h: 0, s: 1, v: 1, a: 1 };

describe('ColorPicker family', () => {
  it('provides controlled color and forwards child updates through the picker', async () => {
    const wrapper = mount(ColorPicker, {
      props: { modelValue: red },
      slots: { default: () => h(ColorSlider, { channel: 'hue', 'aria-label': 'Hue' }) },
    });
    const input = wrapper.get('input');
    input.element.value = '120';
    await input.trigger('input');

    expect(wrapper.emitted('update:modelValue')).toEqual([[{ h: 120, s: 1, v: 1, a: 1 }]]);
    expect(wrapper.emitted('change')?.[0]?.[1]).toEqual({ color: { h: 120, s: 1, v: 1, a: 1 } });
    expect(input.element.valueAsNumber).toBe(0);
  });

  it('clamps color channels in controlled and uncontrolled controls', async () => {
    const area = mount(ColorArea, { props: { defaultValue: { h: 500, s: -1, v: 2, a: -2 } } });
    expect(area.attributes('style')).toContain('--fui-ColorArea--x: 0%');
    expect(area.attributes('style')).toContain('--fui-ColorArea--y: 100%');

    const slider = mount(ColorSlider, {
      props: { modelValue: { h: -50, s: 2, v: -1, a: 4 }, channel: 'saturation' },
    });
    expect(slider.get('input').element.valueAsNumber).toBe(100);
    await slider.setProps({ modelValue: { h: 90, s: -4, v: 0.5, a: 0.5 } });
    expect(slider.get('input').element.valueAsNumber).toBe(0);
  });

  it('updates the color area with keyboard arrows, shift steps, and axis tabindex', async () => {
    const wrapper = mount(ColorArea, { props: { defaultValue: { h: 10, s: 0.5, v: 0.5 } } });
    const inputs = wrapper.findAll('input');

    await inputs[0]!.trigger('keydown', { key: 'ArrowRight' });
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toMatchObject({ s: 0.51, v: 0.5 });

    await inputs[0]!.trigger('keydown', { key: 'ArrowUp', shiftKey: true });
    expect(wrapper.emitted('update:modelValue')?.[1]?.[0]).toMatchObject({ s: 0.51, v: 0.6 });
    expect(inputs[0]!.attributes('tabindex')).toBe('-1');
    expect(inputs[1]!.attributes('tabindex')).toBe('0');
  });

  it('reverses horizontal area keyboard behavior in RTL', async () => {
    const host = document.createElement('div');
    host.dir = 'rtl';
    document.body.append(host);
    const wrapper = mount(ColorArea, {
      attachTo: host,
      props: { defaultValue: { h: 10, s: 0.5, v: 0.5 } },
    });
    await wrapper.get('input').trigger('keydown', { key: 'ArrowRight' });
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toMatchObject({ s: 0.49 });
    wrapper.unmount();
    host.remove();
  });

  it('maps pointer coordinates, clamps outside values, and supports RTL', async () => {
    const wrapper = mount(ColorArea, {
      attachTo: document.body,
      props: { defaultValue: red },
    });
    Object.defineProperty(wrapper.element, 'getBoundingClientRect', {
      value: () => ({ left: 10, top: 20, width: 200, height: 100, right: 210, bottom: 120 }),
    });
    await wrapper.trigger('pointerdown', { button: 0, pointerId: 1, clientX: 160, clientY: 45 });
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toMatchObject({ s: 0.75, v: 0.75 });
    await wrapper.trigger('pointermove', { pointerId: 1, clientX: 400, clientY: 400 });
    expect(wrapper.emitted('update:modelValue')?.[1]?.[0]).toMatchObject({ s: 1, v: 0 });
    wrapper.unmount();

    const rtlHost = document.createElement('div');
    rtlHost.dir = 'rtl';
    document.body.append(rtlHost);
    const rtl = mount(ColorArea, { attachTo: rtlHost });
    Object.defineProperty(rtl.element, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 100, height: 100, right: 100, bottom: 100 }),
    });
    await rtl.trigger('pointerdown', { button: 0, pointerId: 2, clientX: 25, clientY: 50 });
    expect(rtl.emitted('update:modelValue')?.[0]?.[0]).toMatchObject({ s: 0.75, v: 0.5 });
    rtl.unmount();
    rtlHost.remove();
  });

  it('supports hue, saturation, value, vertical, and disabled slider states', async () => {
    const hue = mount(ColorSlider, {
      props: { defaultValue: red },
      attrs: { 'aria-label': 'Hue' },
    });
    const saturation = mount(ColorSlider, { props: { channel: 'saturation', defaultValue: red } });
    const value = mount(ColorSlider, {
      props: { channel: 'value', vertical: true, disabled: true },
    });

    expect(hue.get('input').attributes()).toMatchObject({ min: '0', max: '360', step: '1' });
    saturation.get('input').element.value = '25';
    await saturation.get('input').trigger('input');
    expect(saturation.emitted('update:modelValue')?.[0]?.[0]).toMatchObject({ s: 0.25 });
    expect(value.classes()).toContain('fui-ColorSlider--vertical');
    expect(value.get('input').attributes('aria-orientation')).toBe('vertical');
    expect(value.get('input').attributes('disabled')).toBeDefined();
  });

  it('supports opacity and transparency alpha semantics', async () => {
    const opacity = mount(AlphaSlider, { props: { defaultValue: { ...red, a: 0.7 } } });
    expect(opacity.get('input').element.valueAsNumber).toBe(70);
    opacity.get('input').element.value = '30';
    await opacity.get('input').trigger('input');
    expect(opacity.emitted('update:modelValue')?.[0]?.[0]).toMatchObject({ a: 0.3 });

    const transparency = mount(AlphaSlider, {
      props: { transparency: true, defaultValue: { ...red, a: 0.7 } },
    });
    expect(transparency.get('input').element.valueAsNumber).toBe(30);
    transparency.get('input').element.value = '80';
    await transparency.get('input').trigger('input');
    expect(transparency.emitted('update:modelValue')?.[0]?.[0]).toMatchObject({ a: 0.2 });
  });

  it('maintains picker-controlled color until the parent updates', async () => {
    const color = ref(red);
    const Fixture = defineComponent({
      setup: () => () =>
        h(
          ColorPicker,
          { modelValue: color.value },
          {
            default: () => h(ColorArea, { 'aria-label': 'Area' }),
          },
        ),
    });
    const wrapper = mount(Fixture);
    const saturation = wrapper.get<HTMLInputElement>('input[aria-label="Saturation"]');
    saturation.element.value = '25';
    await saturation.trigger('input');
    expect(saturation.element.valueAsNumber).toBe(100);
    color.value = { ...red, s: 0.25 };
    await nextTick();
    expect(saturation.element.valueAsNumber).toBe(25);
  });

  it('routes classes/styles to visual roots and native attributes to slider inputs', () => {
    const slider = mount(ColorSlider, {
      props: { channel: 'value', shape: 'square' },
      attrs: {
        class: 'custom',
        style: 'width: 30rem',
        id: 'value-control',
        name: 'value',
        'aria-label': 'Value',
      },
    });
    expect(slider.classes()).toContain('custom');
    expect(slider.attributes('style')).toContain('width: 30rem');
    expect(slider.get('input').attributes()).toMatchObject({
      id: 'value-control',
      name: 'value',
      'aria-label': 'Value',
    });
  });
});
