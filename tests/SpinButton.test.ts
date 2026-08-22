import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Field from '../src/components/Field/Field.vue';
import SpinButton from '../src/components/SpinButton/SpinButton.vue';

afterEach(() => {
  document.body.innerHTML = '';
  vi.useRealTimers();
});

const inputOf = (wrapper: ReturnType<typeof mount>) =>
  wrapper.get<HTMLInputElement>('input[role="spinbutton"]');
const buttonsOf = (wrapper: ReturnType<typeof mount>) => wrapper.findAll('button');

async function pressButton(button: ReturnType<ReturnType<typeof mount>['get']>) {
  await button.trigger('mousedown', { button: 0 });
  await button.trigger('mouseup');
}

describe('FSpinButton', () => {
  it('renders the accessible released defaults', () => {
    const wrapper = mount(SpinButton);
    const input = inputOf(wrapper);
    const [increment, decrement] = buttonsOf(wrapper);

    expect(input.attributes('type')).toBe('text');
    expect(input.attributes('autocomplete')).toBe('off');
    expect(input.element.value).toBe('0');
    expect(input.attributes('aria-valuenow')).toBe('0');
    expect(increment.attributes('aria-label')).toBe('Increment value');
    expect(decrement.attributes('aria-label')).toBe('Decrement value');
    expect(increment.attributes('tabindex')).toBe('-1');
    expect(decrement.attributes('tabindex')).toBe('-1');
    expect(wrapper.classes()).toContain('fui-SpinButton--outline');
    expect(wrapper.classes()).toContain('fui-SpinButton--medium');
  });

  it('supports uncontrolled numeric and null defaults initialized once', async () => {
    const wrapper = mount(SpinButton, { props: { defaultValue: 1.25, precision: 2 } });
    expect(inputOf(wrapper).element.value).toBe('1.25');

    await wrapper.setProps({ defaultValue: 9 });
    expect(inputOf(wrapper).element.value).toBe('1.25');

    const empty = mount(SpinButton, { props: { defaultValue: null } });
    expect(inputOf(empty).element.value).toBe('');
    expect(inputOf(empty).attributes('aria-valuenow')).toBeUndefined();
  });

  it('supports controlled value and displayValue with silent prop updates', async () => {
    const wrapper = mount(SpinButton, { props: { modelValue: 1, displayValue: '$1.00' } });
    const input = inputOf(wrapper);

    expect(input.element.value).toBe('$1.00');
    expect(input.attributes('aria-valuetext')).toBe('$1.00');
    await wrapper.setProps({ modelValue: 2, displayValue: '$2.00' });
    expect(input.element.value).toBe('$2.00');
    expect(wrapper.emitted('change')).toBeUndefined();
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('ignores displayValue when uncontrolled and preserves explicit aria-valuetext', () => {
    const uncontrolled = mount(SpinButton, {
      props: { defaultValue: 1, displayValue: '$1.00' },
    });
    expect(inputOf(uncontrolled).element.value).toBe('1');
    expect(inputOf(uncontrolled).attributes('aria-valuetext')).toBeUndefined();

    const controlled = mount(SpinButton, {
      props: { modelValue: 1, displayValue: '$1.00' },
      attrs: { 'aria-valuetext': 'one dollar' },
    });
    expect(inputOf(controlled).attributes('aria-valuetext')).toBe('one dollar');
  });

  it('treats an explicitly bound undefined modelValue as controlled empty', async () => {
    const wrapper = mount(SpinButton, {
      props: { modelValue: undefined, defaultValue: 7 },
    });
    const input = inputOf(wrapper);

    expect(input.element.value).toBe('');
    await pressButton(buttonsOf(wrapper)[0]);
    await nextTick();

    expect(wrapper.emitted('update:modelValue')).toEqual([[1]]);
    expect(input.element.value).toBe('');
  });

  it('rounds with explicit precision and step-derived decimal precision', async () => {
    const explicit = mount(SpinButton, { props: { defaultValue: 1.23456, precision: 2 } });
    expect(inputOf(explicit).element.value).toBe('1.23');

    const derived = mount(SpinButton, { props: { defaultValue: 0.1, step: 0.2 } });
    await pressButton(buttonsOf(derived)[0]);
    expect(inputOf(derived).element.value).toBe('0.3');
    expect(derived.emitted('change')?.[0]?.[1]).toEqual({ value: 0.3 });

    const trailing = mount(SpinButton, { props: { defaultValue: 1234, step: 300 } });
    expect(inputOf(trailing).element.value).toBe('1234');
    await pressButton(buttonsOf(trailing)[0]);
    expect(inputOf(trailing).element.value).toBe('1534');
  });

  it('steps with buttons exactly once and clamps at bounds', async () => {
    const wrapper = mount(SpinButton, {
      props: { defaultValue: 1, min: 0, max: 2 },
    });
    const [increment, decrement] = buttonsOf(wrapper);

    await pressButton(increment);
    expect(inputOf(wrapper).element.value).toBe('2');
    expect(increment.attributes('disabled')).toBeDefined();
    expect(wrapper.emitted('update:modelValue')).toEqual([[2]]);
    expect(wrapper.emitted('change')).toHaveLength(1);

    await pressButton(increment);
    expect(wrapper.emitted('change')).toHaveLength(1);
    await pressButton(decrement);
    expect(inputOf(wrapper).element.value).toBe('1');
    expect(wrapper.emitted('change')).toHaveLength(2);
  });

  it('uses min as the null step origin and respects decrement direction', async () => {
    const up = mount(SpinButton, { props: { defaultValue: null, min: 5 } });
    await pressButton(buttonsOf(up)[0]);
    expect(inputOf(up).element.value).toBe('6');

    const down = mount(SpinButton, { props: { defaultValue: null, min: 5 } });
    await pressButton(buttonsOf(down)[1]);
    expect(inputOf(down).element.value).toBe('5');
  });

  it('supports Arrow, Page, Home, and End keyboard commits', async () => {
    const wrapper = mount(SpinButton, {
      props: { defaultValue: 5, min: 0, max: 20, step: 2, stepPage: 10 },
    });
    const input = inputOf(wrapper);

    await input.trigger('keydown', { key: 'ArrowUp' });
    expect(input.element.value).toBe('7');
    expect(buttonsOf(wrapper)[0].classes()).toContain('fui-SpinButton__button--active');
    await input.trigger('keyup', { key: 'ArrowUp' });

    await input.trigger('keydown', { key: 'ArrowDown' });
    expect(input.element.value).toBe('5');
    await input.trigger('keydown', { key: 'PageUp' });
    expect(input.element.value).toBe('15');
    await input.trigger('keydown', { key: 'PageDown' });
    expect(input.element.value).toBe('5');
    await input.trigger('keydown', { key: 'Home' });
    expect(input.element.value).toBe('0');
    await input.trigger('keydown', { key: 'End' });
    expect(input.element.value).toBe('20');
    expect(wrapper.emitted('change')).toHaveLength(6);
  });

  it('does not use shifted Home/End or absent bounds', async () => {
    const wrapper = mount(SpinButton, { props: { defaultValue: 5 } });
    const input = inputOf(wrapper);
    await input.trigger('keydown', { key: 'Home' });
    await input.trigger('keydown', { key: 'End' });
    await wrapper.setProps({ min: 0, max: 10 });
    await input.trigger('keydown', { key: 'Home', shiftKey: true });
    await input.trigger('keydown', { key: 'End', shiftKey: true });
    expect(input.element.value).toBe('5');
    expect(wrapper.emitted('change')).toBeUndefined();
  });

  it('keeps typing intermediate, updates aria-valuenow, and commits once on blur', async () => {
    const wrapper = mount(SpinButton, { props: { defaultValue: 1 } });
    const input = inputOf(wrapper);

    input.element.value = '123';
    await input.trigger('input');
    expect(input.element.value).toBe('123');
    expect(input.attributes('aria-valuenow')).toBe('123');
    expect(wrapper.emitted('change')).toBeUndefined();

    await input.trigger('blur');
    expect(input.element.value).toBe('123');
    expect(wrapper.emitted('update:modelValue')).toEqual([[123]]);
    expect(wrapper.emitted('change')?.[0]?.[1]).toEqual({ displayValue: '123' });
  });

  it('commits typed controlled display text then rolls the DOM back', async () => {
    const wrapper = mount(SpinButton, { props: { modelValue: 1 } });
    const input = inputOf(wrapper);
    input.element.value = '123';
    await input.trigger('input');
    await input.trigger('keydown', { key: 'Enter' });
    await nextTick();

    expect(wrapper.emitted('update:modelValue')).toEqual([[123]]);
    expect(wrapper.emitted('change')?.[0]?.[1]).toEqual({ displayValue: '123' });
    expect(input.element.value).toBe('1');
  });

  it('accepts arbitrary text, keeps the last numeric value, and Escape cancels', async () => {
    const wrapper = mount(SpinButton, { props: { defaultValue: 1 } });
    const input = inputOf(wrapper);

    input.element.value = 'cats';
    await input.trigger('input');
    await input.trigger('blur');
    expect(wrapper.emitted('update:modelValue')).toEqual([[1]]);
    expect(wrapper.emitted('change')?.[0]?.[1]).toEqual({ displayValue: 'cats' });
    expect(input.element.value).toBe('1');

    input.element.value = '99';
    await input.trigger('input');
    await input.trigger('keydown', { key: 'Escape' });
    await nextTick();
    expect(input.element.value).toBe('1');
    expect(wrapper.emitted('change')).toHaveLength(1);
  });

  it('steps from parsed editing text and falls back to the current number', async () => {
    const parsed = mount(SpinButton, { props: { defaultValue: 1 } });
    const parsedInput = inputOf(parsed);
    parsedInput.element.value = '123';
    await parsedInput.trigger('input');
    await parsedInput.trigger('keydown', { key: 'ArrowUp' });
    expect(parsedInput.element.value).toBe('124');
    expect(parsed.emitted('change')?.[0]?.[1]).toEqual({ value: 124 });

    const fallback = mount(SpinButton, { props: { defaultValue: 1 } });
    const fallbackInput = inputOf(fallback);
    fallbackInput.element.value = 'kittens';
    await fallbackInput.trigger('input');
    await fallbackInput.trigger('keydown', { key: 'ArrowUp' });
    expect(fallbackInput.element.value).toBe('2');
  });

  it('uses edited numeric text for button stepping without an extra text commit', async () => {
    const wrapper = mount(SpinButton, { props: { defaultValue: 1 } });
    const input = inputOf(wrapper);
    input.element.value = '10';
    await input.trigger('input');
    await pressButton(buttonsOf(wrapper)[0]);

    expect(input.element.value).toBe('11');
    expect(wrapper.emitted('change')).toHaveLength(1);
    expect(wrapper.emitted('change')?.[0]?.[1]).toEqual({ value: 11 });
  });

  it('does not change the value on wheel and keeps button mousedown focus on input', async () => {
    const wrapper = mount(SpinButton, { attachTo: document.body, props: { defaultValue: 1 } });
    const input = inputOf(wrapper);
    input.element.focus();
    await input.trigger('wheel', { deltaY: -100 });
    expect(input.element.value).toBe('1');
    expect(wrapper.emitted('change')).toBeUndefined();

    await buttonsOf(wrapper)[0].trigger('mousedown', { button: 0 });
    expect(document.activeElement).toBe(input.element);
    await buttonsOf(wrapper)[0].trigger('mouseup');
  });

  it('routes root class/style and native form/ARIA attrs deliberately', () => {
    const wrapper = mount(SpinButton, {
      attrs: {
        class: 'custom-root',
        style: 'width: 18rem',
        id: 'quantity',
        name: 'quantity',
        required: true,
        placeholder: 'Amount',
        inputmode: 'decimal',
        'aria-label': 'Quantity',
        'data-control': 'spin',
      },
    });
    const input = inputOf(wrapper);

    expect(wrapper.classes()).toContain('custom-root');
    expect(wrapper.attributes('style')).toContain('width: 18rem');
    expect(wrapper.attributes('name')).toBeUndefined();
    expect(input.attributes('id')).toBe('quantity');
    expect(input.attributes('name')).toBe('quantity');
    expect(input.attributes('required')).toBeDefined();
    expect(input.attributes('placeholder')).toBe('Amount');
    expect(input.attributes('inputmode')).toBe('decimal');
    expect(input.attributes('aria-label')).toBe('Quantity');
    expect(input.attributes('data-control')).toBe('spin');
  });

  it('does not allow attrs to override managed semantics', () => {
    const wrapper = mount(SpinButton, {
      props: { modelValue: 2, min: 0, max: 10 },
      attrs: {
        value: '99',
        type: 'number',
        role: 'textbox',
        min: '-10',
        max: '100',
        step: '5',
        'aria-valuenow': '99',
      },
    });
    const input = inputOf(wrapper);
    expect(input.element.value).toBe('2');
    expect(input.attributes('type')).toBe('text');
    expect(input.attributes('role')).toBe('spinbutton');
    expect(input.attributes('min')).toBeUndefined();
    expect(input.attributes('max')).toBeUndefined();
    expect(input.attributes('step')).toBeUndefined();
    expect(input.attributes('aria-valuenow')).toBe('2');
  });

  it('preserves supported native input listeners while managing commits', async () => {
    const onInput = vi.fn();
    const onBlur = vi.fn();
    const onKeydown = vi.fn();
    const onKeyup = vi.fn();
    const onWheel = vi.fn();
    const wrapper = mount(SpinButton, {
      props: { defaultValue: 1 },
      attrs: { onInput, onBlur, onKeydown, onKeyup, onWheel },
    });
    const input = inputOf(wrapper);

    input.element.value = '2';
    await input.trigger('input');
    await input.trigger('keydown', { key: 'Enter' });
    await input.trigger('keyup', { key: 'Enter' });
    await input.trigger('wheel', { deltaY: 1 });
    await input.trigger('blur');

    expect(onInput).toHaveBeenCalledOnce();
    expect(onKeydown).toHaveBeenCalledOnce();
    expect(onKeyup).toHaveBeenCalledOnce();
    expect(onWheel).toHaveBeenCalledOnce();
    expect(onBlur).toHaveBeenCalledOnce();
    expect(wrapper.emitted('change')).toHaveLength(1);
  });

  it('warns once per invalid min/max update and leaves stepping unclamped', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const wrapper = mount(SpinButton, {
      props: { defaultValue: 5, min: 10, max: 0 },
    });

    expect(error).toHaveBeenCalledOnce();
    await pressButton(buttonsOf(wrapper)[0]);
    expect(inputOf(wrapper).element.value).toBe('6');

    await wrapper.setProps({ min: 20 });
    expect(error).toHaveBeenCalledTimes(2);
    error.mockRestore();
  });

  it('uses native disabled and readOnly semantics', async () => {
    const disabled = mount(SpinButton, { props: { defaultValue: 1, disabled: true } });
    expect(inputOf(disabled).attributes('disabled')).toBeDefined();
    expect(buttonsOf(disabled).every((button) => button.attributes('disabled') !== undefined)).toBe(
      true,
    );

    const readonly = mount(SpinButton, { props: { defaultValue: 1, readOnly: true } });
    expect(inputOf(readonly).attributes('readonly')).toBeDefined();
    expect(buttonsOf(readonly).every((button) => button.attributes('disabled') !== undefined)).toBe(
      true,
    );
    await inputOf(readonly).trigger('keydown', { key: 'ArrowUp' });
    expect(inputOf(readonly).element.value).toBe('1');
    expect(readonly.emitted('change')).toBeUndefined();
  });

  it('restores uncontrolled defaults and controlled values on form reset', async () => {
    const uncontrolled = mount({
      components: { SpinButton },
      template: '<form><SpinButton :default-value="2" /></form>',
    });
    await pressButton(uncontrolled.findAll('button')[0]);
    expect(uncontrolled.get('input').element.value).toBe('3');
    uncontrolled.get('form').element.dispatchEvent(new Event('reset'));
    await new Promise((resolve) => setTimeout(resolve));
    await nextTick();
    expect(uncontrolled.get('input').element.value).toBe('2');

    const controlled = mount({
      components: { SpinButton },
      template: '<form><SpinButton :model-value="4" /></form>',
    });
    controlled.get('input').element.value = '99';
    controlled.get('form').element.dispatchEvent(new Event('reset'));
    await new Promise((resolve) => setTimeout(resolve));
    await nextTick();
    expect(controlled.get('input').element.value).toBe('4');
    expect(controlled.findComponent(SpinButton).emitted('change')).toBeUndefined();
  });

  it('submits current uncontrolled values and controlled display values as form data', async () => {
    const uncontrolled = mount({
      components: { SpinButton },
      template: '<form><SpinButton name="amount" :default-value="2" /></form>',
    });
    await pressButton(uncontrolled.findAll('button')[0]);
    expect(new FormData(uncontrolled.get('form').element).get('amount')).toBe('3');

    const controlled = mount({
      components: { SpinButton },
      template: '<form><SpinButton name="price" :model-value="2" display-value="$2.00" /></form>',
    });
    expect(new FormData(controlled.get('form').element).get('price')).toBe('$2.00');
  });

  it('integrates with Field label, descriptions, required, invalid, and size', () => {
    const wrapper = mount(Field, {
      props: {
        label: 'Quantity',
        hint: 'Whole cases',
        validationMessage: 'Required',
        required: true,
        size: 'small',
      },
      slots: { default: () => h(SpinButton) },
    });
    const input = wrapper.get('input[role="spinbutton"]');
    expect(wrapper.get('label').attributes('for')).toBe(input.attributes('id'));
    expect(input.attributes('required')).toBeDefined();
    expect(input.attributes('aria-invalid')).toBe('true');
    expect(input.attributes('aria-describedby')?.split(' ')).toHaveLength(2);
    expect(wrapper.get('.fui-SpinButton').classes()).toContain('fui-SpinButton--small');
    expect(wrapper.get('.fui-SpinButton').classes()).toContain('fui-SpinButton--invalid');
  });

  it.each([
    ['outline', 'medium'],
    ['underline', 'small'],
    ['filled-darker', 'medium'],
    ['filled-lighter', 'small'],
  ] as const)('supports %s appearance and %s size', (appearance, size) => {
    const wrapper = mount(SpinButton, { props: { appearance, size } });
    expect(wrapper.classes()).toContain(`fui-SpinButton--${appearance}`);
    expect(wrapper.classes()).toContain(`fui-SpinButton--${size}`);
  });

  it('exposes the native input and focus operation', () => {
    const wrapper = mount(SpinButton, { attachTo: document.body });
    const exposed = wrapper.vm as unknown as { element: HTMLInputElement; focus: () => void };
    const input = inputOf(wrapper).element;
    const focus = vi.spyOn(input, 'focus');
    expect(exposed.element).toBe(input);
    exposed.focus();
    expect(focus).toHaveBeenCalledOnce();
  });
});
