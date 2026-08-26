import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Tab from '../src/components/Tab/Tab.vue';
import TabList from '../src/components/TabList/TabList.vue';

const components = { Tab, TabList };

function mountTabs(template: string, data?: () => Record<string, unknown>) {
  return mount({ components, data, template });
}

describe('FTabList and FTab', () => {
  it('renders upstream defaults and semantic tab state', () => {
    const wrapper = mountTabs(`
      <TabList default-selected-value="one" aria-label="Sections">
        <Tab value="one">First</Tab>
        <Tab value="two">Second</Tab>
      </TabList>
    `);
    const tabs = wrapper.findAll('[role="tab"]');

    expect(wrapper.get('[role="tablist"]').attributes('aria-orientation')).toBe('horizontal');
    expect(wrapper.get('[role="tablist"]').classes()).toEqual(
      expect.arrayContaining(['fui-TabList--transparent', 'fui-TabList--medium']),
    );
    expect(tabs[0]?.attributes('type')).toBe('button');
    expect(tabs[0]?.attributes('aria-selected')).toBe('true');
    expect(tabs[0]?.attributes('tabindex')).toBe('0');
    expect(tabs[1]?.attributes('aria-selected')).toBe('false');
    expect(tabs[1]?.attributes('tabindex')).toBe('-1');
  });

  it('supports uncontrolled selection and emits typed selection data', async () => {
    const wrapper = mountTabs(`
      <TabList default-selected-value="one">
        <Tab value="one">First</Tab>
        <Tab value="two">Second</Tab>
      </TabList>
    `);
    const tabList = wrapper.getComponent(TabList);
    const tabs = wrapper.findAll('[role="tab"]');

    await tabs[1]?.trigger('click');
    expect(tabs[0]?.attributes('aria-selected')).toBe('false');
    expect(tabs[1]?.attributes('aria-selected')).toBe('true');
    expect(tabList.emitted('update:modelValue')).toEqual([['two']]);
    expect(tabList.emitted('tabSelect')?.[0]?.[1]).toEqual({ value: 'two' });

    await tabs[1]?.trigger('click');
    expect(tabList.emitted('update:modelValue')).toEqual([['two'], ['two']]);
    expect(tabList.emitted('tabSelect')).toHaveLength(2);
  });

  it('keeps controlled and explicitly undefined values authoritative', async () => {
    const wrapper = mountTabs(
      `
      <TabList :model-value="selected">
        <Tab value="one">First</Tab>
        <Tab value="two">Second</Tab>
      </TabList>
    `,
      () => ({ selected: 'one' as string | undefined }),
    );
    const tabList = wrapper.getComponent(TabList);
    const tabs = wrapper.findAll('[role="tab"]');

    await tabs[1]?.trigger('click');
    expect(tabList.emitted('update:modelValue')).toEqual([['two']]);
    expect(tabs[0]?.attributes('aria-selected')).toBe('true');
    expect(tabs[1]?.attributes('aria-selected')).toBe('false');

    await wrapper.setData({ selected: undefined });
    expect(tabs[0]?.attributes('aria-selected')).toBe('false');
    expect(tabs[0]?.attributes('tabindex')).toBe('0');
  });

  it('selects on focus when requested and preserves manual activation by default', async () => {
    const manual = mountTabs(`
      <TabList default-selected-value="one">
        <Tab value="one">First</Tab><Tab value="two">Second</Tab>
      </TabList>
    `);
    const manualTabs = manual.findAll('[role="tab"]');
    await manualTabs[1]?.trigger('focus');
    expect(manualTabs[0]?.attributes('aria-selected')).toBe('true');

    const automatic = mountTabs(`
      <TabList default-selected-value="one" select-tab-on-focus>
        <Tab value="one">First</Tab><Tab value="two">Second</Tab>
      </TabList>
    `);
    const automaticTabs = automatic.findAll('[role="tab"]');
    await automaticTabs[1]?.trigger('focus');
    expect(automaticTabs[1]?.attributes('aria-selected')).toBe('true');
  });

  it('supports circular roving focus, orientation, Home, End, and disabled tabs', async () => {
    const wrapper = mountTabs(`
      <TabList vertical default-selected-value="one">
        <Tab value="one">First</Tab>
        <Tab value="disabled" disabled>Disabled</Tab>
        <Tab value="three">Third</Tab>
      </TabList>
    `);
    document.body.appendChild(wrapper.element);
    const tabs = wrapper.findAll<HTMLButtonElement>('[role="tab"]');

    tabs[0]?.element.focus();
    await tabs[0]?.trigger('keydown', { key: 'ArrowDown' });
    expect(document.activeElement).toBe(tabs[2]?.element);
    await tabs[2]?.trigger('keydown', { key: 'ArrowDown' });
    expect(document.activeElement).toBe(tabs[0]?.element);
    await tabs[0]?.trigger('keydown', { key: 'End' });
    expect(document.activeElement).toBe(tabs[2]?.element);
    await tabs[2]?.trigger('keydown', { key: 'Home' });
    expect(document.activeElement).toBe(tabs[0]?.element);
    expect(tabs[1]?.attributes('disabled')).toBeDefined();
    expect(tabs[1]?.attributes('aria-selected')).toBeUndefined();
    wrapper.unmount();
  });

  it('respects consumer cancellation and disabled lists', async () => {
    const cancelled = mountTabs(`
      <TabList default-selected-value="one">
        <Tab value="one">First</Tab><Tab value="two" @click.prevent>Second</Tab>
      </TabList>
    `);
    const cancelledTabs = cancelled.findAll('[role="tab"]');
    await cancelledTabs[1]?.trigger('click');
    expect(cancelledTabs[0]?.attributes('aria-selected')).toBe('true');

    const disabled = mountTabs(`
      <TabList disabled default-selected-value="one">
        <Tab value="one">First</Tab><Tab value="two">Second</Tab>
      </TabList>
    `);
    expect(
      disabled.findAll('[role="tab"]').every((tab) => tab.attributes('disabled') !== undefined),
    ).toBe(true);
  });

  it('renders appearances, sizes, icons, reserved content and routed attributes', () => {
    const wrapper = mountTabs(`
      <TabList appearance="filled-circular" size="large" class="custom-list" data-track="list">
        <Tab value="one" class="custom-tab" aria-controls="panel-one">
          <template #icon="{ selected }"><span data-icon>{{ selected }}</span></template>
          First
        </Tab>
        <Tab value="two"><template #icon><span>Icon</span></template></Tab>
      </TabList>
    `);
    const list = wrapper.get('[role="tablist"]');
    const tabs = wrapper.findAll('[role="tab"]');

    expect(list.classes()).toEqual(
      expect.arrayContaining(['fui-TabList--filled-circular', 'fui-TabList--large', 'custom-list']),
    );
    expect(list.attributes('data-track')).toBe('list');
    expect(tabs[0]?.classes()).toEqual(
      expect.arrayContaining(['fui-Tab--filled-circular', 'fui-Tab--large', 'custom-tab']),
    );
    expect(tabs[0]?.attributes('aria-controls')).toBe('panel-one');
    expect(wrapper.get('[data-icon]').text()).toBe('false');
    expect(tabs[0]?.find('.fui-Tab__content--reserved-space').exists()).toBe(true);
    expect(tabs[1]?.classes()).toContain('fui-Tab--icon-only');
    expect(tabs[1]?.find('.fui-Tab__content').exists()).toBe(false);
  });
});
