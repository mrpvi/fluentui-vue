import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import Field from '../src/components/Field/Field.vue';
import RatingDisplay from '../src/components/RatingDisplay/RatingDisplay.vue';
import RatingItem from '../src/components/RatingItem/RatingItem.vue';

describe('FRatingDisplay', () => {
  it('renders released defaults as a named image with five decorative items', () => {
    const wrapper = mount(RatingDisplay, { props: { value: 3 } });
    expect(wrapper.attributes('role')).toBe('img');
    expect(wrapper.findAllComponents(RatingItem)).toHaveLength(5);
    expect(wrapper.findAll('input')).toHaveLength(0);
    expect(
      wrapper
        .findAllComponents(RatingItem)
        .every((item) => item.attributes('aria-hidden') === 'true'),
    ).toBe(true);
    expect(wrapper.get('.fui-RatingDisplay__valueText').text()).toBe('3');
    expect(wrapper.attributes('aria-labelledby')).toBe(
      wrapper.get('.fui-RatingDisplay__valueText').attributes('id'),
    );
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['fui-RatingDisplay--neutral', 'fui-RatingDisplay--medium']),
    );
  });

  it('omits optional text when values are absent and supplies a fallback accessible name', () => {
    const wrapper = mount(RatingDisplay);
    expect(wrapper.find('.fui-RatingDisplay__valueText').exists()).toBe(false);
    expect(wrapper.find('.fui-RatingDisplay__countText').exists()).toBe(false);
    expect(wrapper.attributes('aria-label')).toBe('0 out of 5');
  });

  it('formats count and composes value and count accessible naming', () => {
    const wrapper = mount(RatingDisplay, { props: { value: 4.2, count: 1160 } });
    const valueText = wrapper.get('.fui-RatingDisplay__valueText');
    const countText = wrapper.get('.fui-RatingDisplay__countText');
    expect(valueText.text()).toBe('4.2');
    expect(countText.text()).toBe((1160).toLocaleString());
    expect(wrapper.attributes('aria-labelledby')).toBe(
      `${valueText.attributes('id')} ${countText.attributes('id')}`,
    );
  });

  it('uses normalized visible text and slot data for invalid and clamped values', () => {
    const high = mount(RatingDisplay, { props: { value: 8, max: 5 } });
    expect(high.get('.fui-RatingDisplay__valueText').text()).toBe('5');

    const invalid = mount(RatingDisplay, {
      props: { value: Number.NaN },
      slots: { 'value-text': ({ value }: { value: number }) => `Normalized ${value}` },
    });
    expect(invalid.get('.fui-RatingDisplay__valueText').text()).toBe('Normalized 0');
  });

  it('renders only one fully filled item in compact mode', () => {
    const wrapper = mount(RatingDisplay, { props: { compact: true, value: 2.5 } });
    expect(wrapper.findAllComponents(RatingItem)).toHaveLength(1);
    expect(wrapper.getComponent(RatingItem).classes()).toContain('fui-RatingItem--fill-full');
    expect(wrapper.classes()).toContain('fui-RatingDisplay--compact');
  });

  it.each(['brand', 'marigold', 'neutral'] as const)('applies %s color', (color) => {
    const wrapper = mount(RatingDisplay, { props: { color } });
    expect(wrapper.classes()).toContain(`fui-RatingDisplay--${color}`);
    expect(wrapper.getComponent(RatingItem).classes()).toContain(`fui-RatingItem--${color}`);
  });

  it.each(['small', 'medium', 'large', 'extra-large'] as const)('applies %s size', (size) => {
    const wrapper = mount(RatingDisplay, { props: { size } });
    expect(wrapper.classes()).toContain(`fui-RatingDisplay--${size}`);
    expect(wrapper.getComponent(RatingItem).classes()).toContain(`fui-RatingItem--${size}`);
  });

  it('supports max and decimal fill without adding interactivity', () => {
    const wrapper = mount(RatingDisplay, { props: { max: 10, value: 8.5 } });
    expect(wrapper.findAllComponents(RatingItem)).toHaveLength(10);
    expect(wrapper.findAllComponents(RatingItem)[8].classes()).toContain(
      'fui-RatingItem--fill-half',
    );
    expect(wrapper.findAll('input')).toHaveLength(0);
  });

  it('supports icon and text slots with typed display data', () => {
    const wrapper = mount(RatingDisplay, {
      props: { value: 3.5, count: 2048 },
      slots: {
        icon: ({ value, fill }: { value: number; fill: number }) =>
          h('span', { class: 'custom-icon' }, `${value}:${fill}`),
        'value-text': ({ value }: { value: number }) => `Score ${value}`,
        'count-text': ({ formattedCount }: { formattedCount: string | undefined }) =>
          `${formattedCount} reviews`,
      },
    });
    expect(wrapper.findAll('.custom-icon')).toHaveLength(6);
    expect(wrapper.get('.fui-RatingDisplay__valueText').text()).toBe('Score 3.5');
    expect(wrapper.get('.fui-RatingDisplay__countText').text()).toBe(
      `${(2048).toLocaleString()} reviews`,
    );
  });

  it('preserves explicit accessible names and routes attrs while protecting image semantics', () => {
    const wrapper = mount(RatingDisplay, {
      props: { value: 4 },
      attrs: {
        id: 'rating-summary',
        class: 'custom-display',
        style: 'margin: 2px',
        role: 'meter',
        'aria-label': 'Four of five stars',
        'aria-labelledby': 'external-label',
        title: 'Summary',
      },
    });
    expect(wrapper.attributes('id')).toBe('rating-summary');
    expect(wrapper.classes()).toContain('custom-display');
    expect(wrapper.attributes('style')).toContain('margin: 2px');
    expect(wrapper.attributes('role')).toBe('img');
    expect(wrapper.attributes('aria-label')).toBe('Four of five stars');
    expect(wrapper.attributes('aria-labelledby')).toBe('external-label');
    expect(wrapper.attributes('title')).toBe('Summary');
  });

  it('does not let generated text labels override an explicit aria-label', () => {
    const wrapper = mount(RatingDisplay, {
      props: { value: 4.2, count: 1160 },
      attrs: { 'aria-label': '4.2 out of 5 from 1,160 ratings' },
    });
    expect(wrapper.attributes('aria-label')).toBe('4.2 out of 5 from 1,160 ratings');
    expect(wrapper.attributes('aria-labelledby')).toBeUndefined();
  });

  it('integrates Field labels and descriptions', () => {
    const wrapper = mount(Field, {
      props: { label: 'Average rating', hint: 'Based on verified reviews' },
      slots: { default: () => h(RatingDisplay, { value: 4.7, count: 512 }) },
    });
    const display = wrapper.get('[role="img"]');
    expect(display.attributes('id')).toBe(wrapper.get('label').attributes('for'));
    expect(display.attributes('aria-labelledby')).toBe(wrapper.get('label').attributes('id'));
    expect(display.attributes('aria-describedby')).toBe(
      wrapper.get('.fui-Field__hint').attributes('id'),
    );
  });

  it('warns and falls back for invalid maximums', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const wrapper = mount(RatingDisplay, { props: { max: 1 } });
    expect(wrapper.findAllComponents(RatingItem)).toHaveLength(5);
    expect(consoleError).toHaveBeenCalledWith(
      "[FRatingDisplay] The prop 'max' must be a whole number greater than 1. Received max: 1",
    );
  });
});
