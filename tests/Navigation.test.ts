import { h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import {
  FNav,
  FNavCategory,
  FNavCategoryItem,
  FNavItem,
  FNavSubItem,
  FNavSubItemGroup,
} from '../src/components/Navigation';
describe('Navigation family', () => {
  it('selects items with page semantics', async () => {
    const wrapper = mount(FNav, {
      slots: {
        default: () => [
          h(FNavItem, { value: 'home', href: '#home' }, { default: () => 'Home' }),
          h(FNavItem, { value: 'settings', href: '#settings' }, { default: () => 'Settings' }),
        ],
      },
    });
    await wrapper.findAll('.fui-NavItem')[1]!.trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['settings']);
    await nextTick();
    expect(wrapper.findAll('.fui-NavItem')[1]!.attributes('aria-current')).toBe('page');
  });
  it('toggles categories and selects subitems', async () => {
    const wrapper = mount(FNav, {
      slots: {
        default: () =>
          h(
            FNavCategory,
            { value: 'admin' },
            {
              default: () => [
                h(FNavCategoryItem, null, { default: () => 'Admin' }),
                h(FNavSubItemGroup, null, {
                  default: () =>
                    h(FNavSubItem, { value: 'users', href: '#users' }, { default: () => 'Users' }),
                }),
              ],
            },
          ),
      },
    });
    expect(wrapper.find('.fui-NavSubItemGroup').attributes('style')).toContain('display: none');
    await wrapper.find('.fui-NavCategoryItem').trigger('click');
    expect(wrapper.find('.fui-NavSubItemGroup').attributes('style')).toBeUndefined();
    await wrapper.find('.fui-NavSubItem').trigger('click');
    expect(wrapper.emitted('navItemSelect')?.[0]?.[1]).toMatchObject({
      value: 'users',
      categoryValue: 'admin',
    });
  });
});
