import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { describe, expect, it } from 'vitest';
import {
  FAriaLiveAnnouncer,
  FMessageBar,
  FMessageBarActions,
  FMessageBarBody,
  FMessageBarGroup,
  FMessageBarTitle,
} from '../src';

describe('MessageBar family', () => {
  it('associates title, body, actions, and intent styling', async () => {
    const wrapper = mount(FMessageBar, {
      props: { intent: 'warning', layout: 'multiline', shape: 'square' },
      slots: {
        default: () => [
          h(FMessageBarBody, null, {
            default: () => [
              h(FMessageBarTitle, null, { default: () => 'Warning' }),
              ' Check input',
            ],
          }),
          h(FMessageBarActions, null, { default: () => h('button', 'Retry') }),
        ],
      },
    });
    await nextTick();
    expect(wrapper.attributes('role')).toBe('group');
    expect(wrapper.attributes('aria-labelledby')).toMatch(/^fui-message-bar-title-/);
    expect(wrapper.get('.fui-MessageBarTitle').attributes('id')).toBe(
      wrapper.attributes('aria-labelledby'),
    );
    expect(wrapper.classes()).toContain('fui-MessageBar--warning');
    expect(wrapper.classes()).toContain('fui-MessageBar--multiline');
  });

  it('announces mounted messages through the announcer foundation', async () => {
    const wrapper = mount(FAriaLiveAnnouncer, {
      slots: {
        default: () =>
          h(
            FMessageBar,
            { intent: 'error' },
            {
              default: () =>
                h(FMessageBarBody, null, {
                  default: () => h(FMessageBarTitle, null, { default: () => 'Failed' }),
                }),
            },
          ),
      },
    });
    await nextTick();
    await nextTick();
    expect(wrapper.find('[aria-live="assertive"]').text()).toBe('Failed');
  });

  it('renders groups with animation metadata', () => {
    const wrapper = mount(FMessageBarGroup, {
      props: { animate: 'exit-only' },
      slots: { default: () => h(FMessageBar) },
    });
    expect(wrapper.attributes('data-animate')).toBe('exit-only');
  });
});
