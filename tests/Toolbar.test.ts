import { h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import {
  FToolbar,
  FToolbarButton,
  FToolbarRadioButton,
  FToolbarRadioGroup,
  FToolbarToggleButton,
} from '../src/components/Toolbar';

describe('Toolbar family', () => {
  it('provides toolbar semantics, size, and circular arrow navigation', async () => {
    const wrapper = mount(FToolbar, {
      attachTo: document.body,
      props: { vertical: true, size: 'large', 'aria-label': 'Formatting' },
      slots: {
        default: () => [h(FToolbarButton, null, () => 'One'), h(FToolbarButton, null, () => 'Two')],
      },
    });
    expect(wrapper.attributes('role')).toBe('toolbar');
    expect(wrapper.attributes('aria-orientation')).toBe('vertical');
    expect(wrapper.findAll('button')[0]!.classes()).toContain('fui-Button--large');
    wrapper.findAll('button')[0]!.element.focus();
    await wrapper.trigger('keydown', { key: 'ArrowUp' });
    expect(document.activeElement).toBe(wrapper.findAll('button')[1]!.element);
    wrapper.unmount();
  });

  it('manages toggle and radio checked values', async () => {
    const wrapper = mount(FToolbar, {
      slots: {
        default: () => [
          h(FToolbarToggleButton, { name: 'format', value: 'bold' }, () => 'Bold'),
          h(FToolbarRadioGroup, null, {
            default: () => [
              h(FToolbarRadioButton, { name: 'align', value: 'start' }, () => 'Start'),
              h(FToolbarRadioButton, { name: 'align', value: 'end' }, () => 'End'),
            ],
          }),
        ],
      },
    });
    const buttons = wrapper.findAll('button');
    await buttons[0]!.trigger('click');
    await buttons[2]!.trigger('click');
    await nextTick();
    expect(buttons[0]!.attributes('aria-pressed')).toBe('true');
    expect(buttons[2]!.attributes('aria-checked')).toBe('true');
    expect(wrapper.emitted('update:checkedValues')?.at(-1)?.[0]).toEqual({
      format: ['bold'],
      align: ['end'],
    });
  });
});
