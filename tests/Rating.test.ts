import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, ref } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import Field from '../src/components/Field/Field.vue';
import Rating from '../src/components/Rating/Rating.vue';
import RatingDisplay from '../src/components/RatingDisplay/RatingDisplay.vue';
import RatingItem from '../src/components/RatingItem/RatingItem.vue';

function checkedValues(wrapper: ReturnType<typeof mount>): number[] {
  return wrapper
    .findAll<HTMLInputElement>('input[type="radio"]')
    .filter((input) => input.element.checked)
    .map((input) => Number(input.element.value));
}

const ratingItemCss = readFileSync(
  resolve(process.cwd(), 'src/components/RatingItem/ratingItem.css'),
  'utf8',
);
const ratingDisplayCss = readFileSync(
  resolve(process.cwd(), 'src/components/RatingDisplay/ratingDisplay.css'),
  'utf8',
);

describe('FRating family', () => {
  it('renders released defaults as a five-item radiogroup with a stable generated name', async () => {
    const wrapper = mount(Rating, { attrs: { 'aria-label': 'Product rating' } });
    const inputs = wrapper.findAll('input[type="radio"]');

    expect(wrapper.attributes('role')).toBe('radiogroup');
    expect(wrapper.attributes('aria-label')).toBe('Product rating');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['fui-Rating', 'fui-Rating--neutral', 'fui-Rating--extra-large']),
    );
    expect(wrapper.findAllComponents(RatingItem)).toHaveLength(5);
    expect(inputs).toHaveLength(5);
    expect(inputs.map((input) => input.attributes('value'))).toEqual(['1', '2', '3', '4', '5']);
    expect(new Set(inputs.map((input) => input.attributes('name'))).size).toBe(1);
    const initialName = inputs[0].attributes('name');
    await wrapper.setProps({ color: 'brand' });
    expect(wrapper.get('input').attributes('name')).toBe(initialName);
  });

  it('supports uncontrolled initialization once and user selection with exact events', async () => {
    const wrapper = mount(Rating, { props: { defaultValue: 3 } });
    expect(checkedValues(wrapper)).toEqual([3]);

    await wrapper.setProps({ defaultValue: 1 });
    expect(checkedValues(wrapper)).toEqual([3]);

    await wrapper.get('input[value="4"]').setValue(true);
    expect(checkedValues(wrapper)).toEqual([4]);
    expect(wrapper.emitted('update:modelValue')).toEqual([[4]]);
    expect(wrapper.emitted('change')).toHaveLength(1);
    expect(wrapper.emitted('change')?.[0]?.[1]).toEqual({ value: 4 });
  });

  it('keeps controlled values until parent update, treats explicit undefined as controlled, and stays silent on props', async () => {
    const wrapper = mount(Rating, { props: { modelValue: 2, defaultValue: 4 } });
    expect(checkedValues(wrapper)).toEqual([2]);

    await wrapper.get('input[value="4"]').setValue(true);
    await nextTick();
    expect(checkedValues(wrapper)).toEqual([2]);
    expect(wrapper.emitted('update:modelValue')).toEqual([[4]]);
    expect(wrapper.emitted('change')).toHaveLength(1);

    await wrapper.setProps({ modelValue: 4 });
    expect(checkedValues(wrapper)).toEqual([4]);
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted('change')).toHaveLength(1);

    const kebab = mount(Rating, { props: { 'model-value': 2 } });
    expect(checkedValues(kebab)).toEqual([2]);

    const empty = mount(Rating, { props: { modelValue: undefined, defaultValue: 3 } });
    expect(checkedValues(empty)).toEqual([]);
    await empty.get('input[value="2"]').setValue(true);
    await nextTick();
    expect(checkedValues(empty)).toEqual([]);
    expect(empty.emitted('update:modelValue')).toEqual([[2]]);
  });

  it('does not emit when selecting the current value', async () => {
    const wrapper = mount(Rating, { props: { defaultValue: 3 } });
    await wrapper.get('input[value="3"]').trigger('change');
    expect(wrapper.emitted('change')).toBeUndefined();
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('renders half precision inputs, decimal labels, selection, and preview rollback', async () => {
    const wrapper = mount(Rating, {
      props: { step: 0.5, defaultValue: 2.5, itemLabel: (value) => `${value} stars` },
    });
    const inputs = wrapper.findAll('input[type="radio"]');

    expect(inputs).toHaveLength(10);
    expect(inputs.slice(0, 4).map((input) => input.attributes('value'))).toEqual([
      '0.5',
      '1',
      '1.5',
      '2',
    ]);
    expect(wrapper.get('input[value="2.5"]').attributes('aria-label')).toBe('2.5 stars');
    expect(checkedValues(wrapper)).toEqual([2.5]);
    expect(wrapper.findAllComponents(RatingItem)[2].classes()).toContain(
      'fui-RatingItem--fill-half',
    );

    await wrapper.get('input[value="4.5"]').trigger('mouseover');
    expect(wrapper.classes()).toContain('fui-Rating--previewing');
    expect(wrapper.findAllComponents(RatingItem)[4].classes()).toContain(
      'fui-RatingItem--fill-half',
    );
    await wrapper.trigger('mouseleave');
    expect(wrapper.classes()).not.toContain('fui-Rating--previewing');
    expect(wrapper.findAllComponents(RatingItem)[2].classes()).toContain(
      'fui-RatingItem--fill-half',
    );
  });

  it('uses native radio keyboard navigation and supports RTL without physical CSS positioning', async () => {
    const wrapper = mount(Rating, {
      attachTo: document.body,
      attrs: { dir: 'rtl', 'aria-label': 'RTL rating' },
      props: { defaultValue: 2 },
    });
    const second = wrapper.get<HTMLInputElement>('input[value="2"]');
    second.element.focus();
    await second.trigger('keydown', { key: 'ArrowLeft' });

    expect(second.element).toBe(document.activeElement);
    expect(wrapper.attributes('dir')).toBe('rtl');
    expect(ratingItemCss).toContain('inset-inline-start');
    expect(ratingItemCss).toContain('inset-inline-end');
    expect(ratingDisplayCss).toContain('margin-inline-start');
    wrapper.unmount();
  });

  it('supports explicit max, size, color, names, classes, styles, and protected root semantics', () => {
    const wrapper = mount(Rating, {
      props: { max: 3, size: 'small', color: 'marigold', name: 'score' },
      attrs: {
        class: 'custom-rating',
        style: 'margin: 2px',
        role: 'slider',
        title: 'Score',
      },
    });

    expect(wrapper.findAllComponents(RatingItem)).toHaveLength(3);
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['fui-Rating--small', 'fui-Rating--marigold', 'custom-rating']),
    );
    expect(wrapper.attributes('style')).toContain('margin: 2px');
    expect(wrapper.attributes('role')).toBe('radiogroup');
    expect(wrapper.attributes('title')).toBe('Score');
    expect(wrapper.findAll('input').map((input) => input.attributes('name'))).toEqual([
      'score',
      'score',
      'score',
    ]);
  });

  it('supports disabled and read-only display without user changes', async () => {
    const disabled = mount(Rating, { props: { defaultValue: 2, disabled: true } });
    expect(disabled.attributes('aria-disabled')).toBe('true');
    expect(
      disabled.findAll('input').every((input) => input.attributes('disabled') !== undefined),
    ).toBe(true);
    await disabled.get('input[value="4"]').trigger('change');
    expect(disabled.emitted('change')).toBeUndefined();

    const readOnly = mount(Rating, { props: { defaultValue: 2, readOnly: true } });
    expect(readOnly.attributes('aria-readonly')).toBe('true');
    expect(readOnly.findAll('input')).toHaveLength(0);
    expect(readOnly.findAllComponents(RatingItem)[0].classes()).toContain('fui-RatingItem--filled');
  });

  it('restores uncontrolled defaults and reapplies controlled values after form reset', async () => {
    const uncontrolled = mount({
      render: () => h('form', [h(Rating, { defaultValue: 2, name: 'uncontrolled' })]),
    });
    await uncontrolled.get('input[value="4"]').setValue(true);
    uncontrolled.get('form').element.reset();
    await vi.waitFor(() => expect(checkedValues(uncontrolled)).toEqual([2]));

    const controlled = mount({
      render: () => h('form', [h(Rating, { modelValue: 2, name: 'controlled' })]),
    });
    (controlled.get('input[value="2"]').element as HTMLInputElement).checked = false;
    (controlled.get('input[value="4"]').element as HTMLInputElement).checked = true;
    controlled.get('form').element.reset();
    await vi.waitFor(() => expect(checkedValues(controlled)).toEqual([2]));
  });

  it('submits the selected native radio value', async () => {
    const wrapper = mount({
      render: () => h('form', [h(Rating, { defaultValue: 3, name: 'score' })]),
    });
    const form = wrapper.get('form').element;
    expect(new FormData(form).get('score')).toBe('3');
    await wrapper.get('input[value="5"]').setValue(true);
    expect(new FormData(form).get('score')).toBe('5');
  });

  it('integrates Field labeling, descriptions, invalid, and required semantics', () => {
    const wrapper = mount(Field, {
      props: {
        label: 'Rate this item',
        validationMessage: 'Rating required',
        hint: 'Choose one to five',
        required: true,
      },
      slots: { default: () => h(Rating) },
    });
    const group = wrapper.get('[role="radiogroup"]');
    const messageId = wrapper.get('.fui-Field__validationMessage').attributes('id');
    const hintId = wrapper.get('.fui-Field__hint').attributes('id');

    expect(group.attributes('id')).toBe(wrapper.get('label').attributes('for'));
    expect(group.attributes('aria-labelledby')).toBe(wrapper.get('label').attributes('id'));
    expect(group.attributes('aria-describedby')).toBe(`${messageId} ${hintId}`);
    expect(group.attributes('aria-invalid')).toBe('true');
    expect(group.attributes('aria-required')).toBe('true');
  });

  it('composes custom FRatingItem children and icon slots through context', () => {
    const wrapper = mount(Rating, {
      props: { defaultValue: 2 },
      slots: {
        default: () => [h(RatingItem, { value: 1 }), h(RatingItem, { value: 2 })],
        'selected-icon': ({ value }: { value: number }) => h('span', `selected-${value}`),
      },
    });
    expect(wrapper.findAllComponents(RatingItem)).toHaveLength(2);
    expect(checkedValues(wrapper)).toEqual([2]);

    const generated = mount(Rating, {
      props: { defaultValue: 1 },
      slots: {
        'selected-icon': ({ value }: { value: number }) =>
          h('span', { class: 'custom-selected' }, `selected-${value}`),
        'unselected-icon': ({ value }: { value: number }) =>
          h('span', { class: 'custom-unselected' }, `unselected-${value}`),
      },
    });
    expect(generated.get('.custom-selected').text()).toBe('selected-1');
    expect(generated.findAll('.custom-unselected')).toHaveLength(4);
  });

  it('warns and falls back for invalid maximums and runtime steps', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const wrapper = mount(Rating, { props: { max: 1, step: 0.25 as 0.5 } });
    expect(wrapper.findAllComponents(RatingItem)).toHaveLength(5);
    expect(wrapper.findAll('input')).toHaveLength(5);
    expect(consoleError).toHaveBeenCalledWith(
      "[FRating] The prop 'max' must be a whole number greater than 1. Received max: 1",
    );
    expect(consoleError).toHaveBeenCalledWith(
      "[FRating] The prop 'step' must be 0.5 or 1. Received step: 0.25",
    );
  });

  it('routes native radio attrs, required state, external form ownership, and pointer listeners', async () => {
    const mouseover = vi.fn();
    const mouseleave = vi.fn();
    const wrapper = mount(
      {
        render: () =>
          h('div', [
            h('form', { id: 'external-rating-form' }),
            h(Rating, {
              defaultValue: 2,
              name: 'external-score',
              form: 'external-rating-form',
              required: true,
              autocomplete: 'off',
              onMouseover: mouseover,
              onMouseleave: mouseleave,
            }),
          ]),
      },
      { attachTo: document.body },
    );
    const group = wrapper.get('[role="radiogroup"]');
    const inputs = wrapper.findAll<HTMLInputElement>('input[type="radio"]');
    expect(group.attributes('form')).toBeUndefined();
    expect(group.attributes('required')).toBeUndefined();
    expect(group.attributes('aria-required')).toBe('true');
    expect(inputs.every((input) => input.attributes('form') === 'external-rating-form')).toBe(true);
    expect(inputs.every((input) => input.attributes('required') !== undefined)).toBe(true);
    expect(inputs.every((input) => input.attributes('autocomplete') === 'off')).toBe(true);
    expect(new FormData(wrapper.get('form').element).get('external-score')).toBe('2');

    await wrapper.get('input[value="4"]').trigger('mouseover');
    await group.trigger('mouseleave');
    expect(mouseover).toHaveBeenCalledOnce();
    expect(mouseleave).toHaveBeenCalledOnce();

    await wrapper.get('input[value="4"]').setValue(true);
    wrapper.get('form').element.reset();
    await vi.waitFor(() => expect(checkedValues(wrapper)).toEqual([2]));
    wrapper.unmount();
  });

  it('exposes roots and useful focus operations', () => {
    const wrapper = mount(Rating, { attachTo: document.body, props: { defaultValue: 2 } });
    const exposed = wrapper.vm as unknown as { element: HTMLDivElement; focus: () => void };
    const selected = wrapper.get<HTMLInputElement>('input[value="2"]');
    const focusSpy = vi.spyOn(selected.element, 'focus');
    expect(exposed.element).toBe(wrapper.element);
    exposed.focus();
    expect(focusSpy).toHaveBeenCalledOnce();

    wrapper.unmount();
  });

  it('supports a controlled parent integration loop', async () => {
    const Host = defineComponent({
      setup() {
        const value = ref(2);
        return () =>
          h(Rating, {
            modelValue: value.value,
            'onUpdate:modelValue': (nextValue: number) => (value.value = nextValue),
          });
      },
    });
    const wrapper = mount(Host);
    await wrapper.get('input[value="5"]').setValue(true);
    expect(checkedValues(wrapper)).toEqual([5]);
  });

  it('defines forced-color, focus, logical direction, and reduced-motion safeguards', () => {
    expect(ratingItemCss).toMatch(/@media \(forced-colors: active\)/);
    expect(ratingItemCss).toContain('CanvasText');
    expect(ratingItemCss).toContain('Highlight');
    expect(ratingItemCss).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
    expect(ratingItemCss).toContain(':focus-within');
  });

  it('exports display root independently in the family', () => {
    const wrapper = mount(RatingDisplay, { props: { value: 4 } });
    const exposed = wrapper.vm as unknown as { element: HTMLDivElement };
    expect(exposed.element).toBe(wrapper.element);
  });
});
