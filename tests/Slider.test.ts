import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import Field from '../src/components/Field/Field.vue';
import Slider from '../src/components/Slider/Slider.vue';

describe('FSlider', () => {
  it('renders the upstream DOM and defaults', () => {
    const wrapper = mount(Slider);
    const input = wrapper.get('input[type="range"]');

    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['fui-Slider', 'fui-Slider--medium', 'fui-Slider--horizontal']),
    );
    expect(input.attributes()).toMatchObject({ min: '0', max: '100', step: '1' });
    expect((input.element as HTMLInputElement).valueAsNumber).toBe(0);
    expect(wrapper.find('.fui-Slider__rail').exists()).toBe(true);
    expect(wrapper.find('.fui-Slider__thumb').exists()).toBe(true);
  });

  it('supports uncontrolled values, native step normalization, and one update per input', async () => {
    const wrapper = mount(Slider, {
      props: { defaultValue: 5, min: 0, max: 20, step: 5 },
    });
    const input = wrapper.get('input');

    expect(input.element.valueAsNumber).toBe(5);
    input.element.value = '13';
    await input.trigger('input');

    expect(input.element.valueAsNumber).toBe(15);
    expect(wrapper.emitted('update:modelValue')).toEqual([[15]]);
    expect(wrapper.emitted('input')?.[0]?.[1]).toEqual({ value: 15 });
    expect(wrapper.attributes('style')).toContain('--fui-Slider--progress: 75%');
    expect(wrapper.attributes('style')).toContain('--fui-Slider--steps-percent: 25%');
  });

  it('clamps initial, controlled, and updated values to min and max', async () => {
    const uncontrolled = mount(Slider, { props: { defaultValue: 200, max: 80 } });
    const controlled = mount(Slider, { props: { modelValue: -20, min: 10, max: 80 } });

    expect(uncontrolled.get('input').element.valueAsNumber).toBe(80);
    expect(controlled.get('input').element.valueAsNumber).toBe(10);

    await controlled.setProps({ modelValue: 200 });
    expect(controlled.get('input').element.valueAsNumber).toBe(80);
  });

  it('supports controlled values with immediate DOM rollback', async () => {
    const wrapper = mount(Slider, { props: { modelValue: 25 } });
    const input = wrapper.get('input');

    input.element.value = '70';
    await input.trigger('input');

    expect(wrapper.emitted('update:modelValue')).toEqual([[70]]);
    expect(wrapper.emitted('input')?.[0]?.[1]).toEqual({ value: 70 });
    expect(input.element.valueAsNumber).toBe(25);

    await wrapper.setProps({ modelValue: 70 });
    expect(input.element.valueAsNumber).toBe(70);
  });

  it('treats explicitly bound undefined modelValue as controlled', async () => {
    const wrapper = mount(Slider, {
      props: { modelValue: undefined, defaultValue: 40 },
    });
    const input = wrapper.get('input');

    expect(input.element.valueAsNumber).toBe(0);
    input.element.value = '50';
    await input.trigger('input');

    expect(wrapper.emitted('update:modelValue')).toEqual([[50]]);
    expect(input.element.valueAsNumber).toBe(0);
  });

  it('initializes defaultValue once', async () => {
    const wrapper = mount(Slider, { props: { defaultValue: 20 } });
    const input = wrapper.get('input');

    input.element.value = '60';
    await input.trigger('input');
    await wrapper.setProps({ defaultValue: 10 });

    expect(input.element.valueAsNumber).toBe(60);
  });

  it('emits native input and change events exactly once with typed data', async () => {
    const wrapper = mount(Slider);
    const input = wrapper.get('input');

    input.element.value = '40';
    await input.trigger('input');
    await input.trigger('change');

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted('input')).toHaveLength(1);
    expect(wrapper.emitted('input')?.[0]?.[0]).toBeInstanceOf(Event);
    expect(wrapper.emitted('input')?.[0]?.[1]).toEqual({ value: 40 });
    expect(wrapper.emitted('change')).toHaveLength(1);
    expect(wrapper.emitted('change')?.[0]?.[1]).toEqual({ value: 40 });
  });

  it('does not emit interaction events for prop-only updates', async () => {
    const wrapper = mount(Slider, { props: { modelValue: 10 } });

    await wrapper.setProps({ modelValue: 30 });

    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    expect(wrapper.emitted('input')).toBeUndefined();
    expect(wrapper.emitted('change')).toBeUndefined();
  });

  it('routes class and style to root and native/form/ARIA attrs to input', () => {
    const wrapper = mount(Slider, {
      props: { min: 10, max: 90, step: 10 },
      attrs: {
        class: 'custom-slider',
        style: 'width: 18rem',
        id: 'volume',
        name: 'volume',
        form: 'settings',
        list: 'volume-values',
        required: true,
        tabindex: '3',
        'aria-label': 'Volume',
        'data-control': 'slider',
      },
    });
    const input = wrapper.get('input');

    expect(wrapper.classes()).toContain('custom-slider');
    expect(wrapper.attributes('style')).toContain('width: 18rem');
    expect(input.attributes()).toMatchObject({
      id: 'volume',
      name: 'volume',
      form: 'settings',
      list: 'volume-values',
      required: '',
      tabindex: '3',
      'aria-label': 'Volume',
      'data-control': 'slider',
      min: '10',
      max: '90',
      step: '10',
    });
    expect(wrapper.attributes('name')).toBeUndefined();
  });

  it('integrates with Field IDs, descriptions, labels, invalid state, and size', () => {
    const wrapper = mount(Field, {
      props: {
        label: 'Volume',
        hint: 'Choose a comfortable level',
        validationMessage: 'Volume is invalid',
        required: true,
        size: 'small',
      },
      slots: { default: () => h(Slider) },
    });
    const input = wrapper.get('input');
    const slider = wrapper.get('.fui-Slider');

    expect(input.attributes('id')).toBe(wrapper.get('label').attributes('for'));
    expect(input.attributes('aria-describedby')?.split(' ')).toHaveLength(2);
    expect(input.attributes('aria-invalid')).toBe('true');
    expect(input.attributes('aria-required')).toBe('true');
    expect(input.attributes('required')).toBeUndefined();
    expect(slider.classes()).toContain('fui-Slider--small');
    expect(slider.classes()).toContain('fui-Slider--invalid');
  });

  it('preserves explicit Field control overrides', () => {
    const wrapper = mount(Field, {
      props: { label: 'Volume', validationMessage: 'Invalid', required: true, size: 'small' },
      slots: {
        default: () =>
          h(Slider, {
            id: 'explicit-volume',
            size: 'medium',
            'aria-invalid': 'false',
            'aria-required': 'false',
            'aria-describedby': 'external-help',
          }),
      },
    });
    const input = wrapper.get('input');

    expect(input.attributes('id')).toBe('explicit-volume');
    expect(input.attributes('aria-invalid')).toBe('false');
    expect(input.attributes('aria-required')).toBe('false');
    expect(input.attributes('aria-describedby')).toContain('external-help');
    expect(wrapper.get('.fui-Slider').classes()).toContain('fui-Slider--medium');
  });

  it('reflects orientation, RTL state, sizes, disabled, and invalid variants', () => {
    const horizontal = mount(Slider, {
      props: { size: 'small' },
      attrs: { dir: 'rtl', 'aria-invalid': 'true' },
    });
    const vertical = mount(Slider, { props: { vertical: true, disabled: true } });

    expect(horizontal.classes()).toEqual(
      expect.arrayContaining([
        'fui-Slider--small',
        'fui-Slider--horizontal',
        'fui-Slider--invalid',
      ]),
    );
    expect(horizontal.get('input').attributes('dir')).toBe('rtl');
    expect(horizontal.attributes('style')).toContain('--fui-Slider--direction: 90deg');
    expect(vertical.classes()).toEqual(
      expect.arrayContaining([
        'fui-Slider--medium',
        'fui-Slider--vertical',
        'fui-Slider--disabled',
      ]),
    );
    expect(vertical.get('input').attributes('orient')).toBe('vertical');
    expect(vertical.get('input').attributes('disabled')).toBeDefined();
    expect(vertical.attributes('style')).toContain('--fui-Slider--direction: 0deg');
  });

  it('uses native form data and excludes disabled controls', async () => {
    const host = document.createElement('div');
    document.body.append(host);
    const wrapper = mount(
      {
        components: { Slider },
        template:
          '<form><Slider name="volume" :default-value="35" /><Slider name="disabled" :default-value="90" disabled /></form>',
      },
      { attachTo: host },
    );
    await nextTick();
    const form = wrapper.get('form').element;
    const data = new FormData(form);

    expect(data.get('volume')).toBe('35');
    expect(data.has('disabled')).toBe(false);
    host.remove();
  });

  it('synchronizes uncontrolled and controlled values after native form reset', async () => {
    vi.useFakeTimers();
    const host = document.createElement('div');
    document.body.append(host);
    const ResetFixture = defineComponent({
      setup: () => () =>
        h('form', [
          h(Slider, { class: 'uncontrolled', defaultValue: 20 }),
          h(Slider, { class: 'controlled', modelValue: 40 }),
        ]),
    });
    const wrapper = mount(ResetFixture, { attachTo: host });
    const inputs = wrapper.findAll('input');
    expect(inputs[1]!.element.valueAsNumber).toBe(40);

    inputs[0]!.element.value = '70';
    await inputs[0]!.trigger('input');
    inputs[1]!.element.value = '80';
    await inputs[1]!.trigger('input');
    wrapper.get('form').element.reset();
    await vi.runAllTimersAsync();
    await nextTick();

    expect(inputs[0]!.element.valueAsNumber).toBe(20);
    expect(inputs[1]!.element.valueAsNumber).toBe(40);
    vi.useRealTimers();
    host.remove();
  });

  it('exposes the native input and focus method', () => {
    const wrapper = mount(Slider, { attachTo: document.body });
    const vm = wrapper.vm as unknown as {
      element: HTMLInputElement;
      focus: () => void;
    };
    const input = wrapper.get('input').element;
    const focus = vi.spyOn(input, 'focus');

    expect(vm.element).toBe(input);
    vm.focus();
    expect(focus).toHaveBeenCalledOnce();
  });
});
