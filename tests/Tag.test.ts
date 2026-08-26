import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import {
  FInteractionTag,
  FInteractionTagPrimary,
  FInteractionTagSecondary,
  FTag,
  FTagGroup,
} from '../src';

const components = {
  FInteractionTag,
  FInteractionTagPrimary,
  FInteractionTagSecondary,
  FTag,
  FTagGroup,
};

describe('Tag family', () => {
  it('renders appearances, sizes, slots, and dismissible button semantics', async () => {
    const wrapper = mount({
      components,
      template: `<FTag appearance="brand" size="small" circular dismissible value="vue"><template #icon>V</template>Vue</FTag>`,
    });
    const tag = wrapper.get('.fui-Tag');
    expect(tag.element.tagName).toBe('BUTTON');
    expect(tag.classes()).toContain('fui-Tag--brand');
    expect(tag.classes()).toContain('fui-Tag--small');
    expect(tag.find('.fui-Tag__icon').text()).toBe('V');
  });

  it('emits dismiss and preserves keyboard focus movement', async () => {
    const onDismiss = vi.fn();
    const wrapper = mount(
      {
        components,
        methods: { onDismiss },
        template: `<FTagGroup dismissible @dismiss="onDismiss"><FTag value="one">One</FTag><FTag value="two">Two</FTag></FTagGroup>`,
      },
      { attachTo: document.body },
    );
    const tags = wrapper.findAll('button');
    tags[0]!.element.focus();
    await tags[0]!.trigger('keydown', { key: 'Delete' });
    expect(onDismiss).toHaveBeenCalledWith(expect.any(KeyboardEvent), { value: 'one' });
    wrapper.unmount();
  });

  it('supports controlled selection and listbox option semantics', async () => {
    const wrapper = mount({
      components,
      template: `<FTagGroup role="listbox" :model-value="['one']"><FTag value="one">One</FTag><FTag value="two">Two</FTag></FTagGroup>`,
    });
    expect(wrapper.get('[role="option"]').attributes('aria-selected')).toBe('true');
    await wrapper.findAll('[role="option"]')[1]!.trigger('click');
    expect(wrapper.getComponent(FTagGroup).emitted('update:modelValue')?.[0]).toEqual([
      ['one', 'two'],
    ]);
  });

  it('composes interaction tag primary and secondary actions', async () => {
    const onDismiss = vi.fn();
    const wrapper = mount({
      components,
      methods: { onDismiss },
      template: `<FTagGroup @dismiss="onDismiss"><FInteractionTag value="vue"><FInteractionTagPrimary has-secondary-action>Vue</FInteractionTagPrimary><FInteractionTagSecondary /></FInteractionTag></FTagGroup>`,
    });
    const buttons = wrapper.findAll('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[1]!.attributes('aria-labelledby')).toContain(buttons[0]!.attributes('id'));
    await buttons[1]!.trigger('click');
    expect(onDismiss).toHaveBeenCalledWith(expect.any(MouseEvent), { value: 'vue' });
  });
});
