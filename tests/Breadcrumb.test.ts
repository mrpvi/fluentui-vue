import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import Breadcrumb from '../src/components/Breadcrumb/Breadcrumb.vue';
import {
  isTruncatableBreadcrumbContent,
  partitionBreadcrumbItems,
  truncateBreadcrumLongTooltip,
  truncateBreadcrumbLongName,
} from '../src/components/Breadcrumb/Breadcrumb.utils';
import BreadcrumbButton from '../src/components/BreadcrumbButton/BreadcrumbButton.vue';
import BreadcrumbDivider from '../src/components/BreadcrumbDivider/BreadcrumbDivider.vue';
import BreadcrumbItem from '../src/components/BreadcrumbItem/BreadcrumbItem.vue';

const components = { Breadcrumb, BreadcrumbButton, BreadcrumbDivider, BreadcrumbItem };

function mountBreadcrumb(template: string) {
  return mount({ components, template });
}

describe('FBreadcrumb family', () => {
  it('renders released semantic defaults and routes root attributes', () => {
    const wrapper = mountBreadcrumb(`
      <Breadcrumb class="custom" data-track="trail">
        <BreadcrumbItem><BreadcrumbButton href="/home">Home</BreadcrumbButton></BreadcrumbItem>
        <BreadcrumbDivider />
        <BreadcrumbItem><BreadcrumbButton current>Current</BreadcrumbButton></BreadcrumbItem>
      </Breadcrumb>
    `);
    const nav = wrapper.get('nav');
    const list = wrapper.get('ol');
    const items = wrapper.findAll('li');

    expect(nav.attributes('aria-label')).toBe('breadcrumb');
    expect(nav.attributes('data-track')).toBe('trail');
    expect(nav.classes()).toEqual(
      expect.arrayContaining(['fui-Breadcrumb', 'fui-Breadcrumb--medium', 'custom']),
    );
    expect(list.attributes('role')).toBe('list');
    expect(items).toHaveLength(3);
    expect(items[0]?.classes()).toContain('fui-BreadcrumbItem');
    expect(items[1]?.attributes('aria-hidden')).toBe('true');
  });

  it('uses links for href controls and buttons otherwise', () => {
    const wrapper = mountBreadcrumb(`
      <Breadcrumb>
        <BreadcrumbItem><BreadcrumbButton href="/home">Home</BreadcrumbButton></BreadcrumbItem>
        <BreadcrumbItem><BreadcrumbButton>Action</BreadcrumbButton></BreadcrumbItem>
        <BreadcrumbItem><BreadcrumbButton as="a">Anchor action</BreadcrumbButton></BreadcrumbItem>
        <BreadcrumbItem><BreadcrumbButton type="submit" role="menuitem" :tabindex="4">Custom</BreadcrumbButton></BreadcrumbItem>
      </Breadcrumb>
    `);
    const controls = wrapper.findAll('.fui-BreadcrumbButton');

    expect(controls[0]?.element.tagName).toBe('A');
    expect(controls[0]?.attributes('href')).toBe('/home');
    expect(controls[1]?.element.tagName).toBe('BUTTON');
    expect(controls[1]?.attributes('type')).toBe('button');
    expect(controls[2]?.element.tagName).toBe('A');
    expect(controls[2]?.attributes('role')).toBe('button');
    expect(controls[2]?.attributes('tabindex')).toBe('0');
    expect(controls[3]?.attributes('type')).toBe('submit');
    expect(controls[3]?.attributes('role')).toBe('menuitem');
    expect(controls[3]?.attributes('tabindex')).toBe('4');
  });

  it('activates anchor buttons with Enter and Space', async () => {
    const onClick = vi.fn();
    const wrapper = mount({
      components,
      methods: { onClick },
      template: `
        <Breadcrumb>
          <BreadcrumbItem><BreadcrumbButton as="a" @click="onClick">Action</BreadcrumbButton></BreadcrumbItem>
        </Breadcrumb>
      `,
    });
    const control = wrapper.get('.fui-BreadcrumbButton');

    await control.trigger('keydown', { key: 'Enter' });
    await control.trigger('keydown', { key: ' ' });
    await control.trigger('keyup', { key: ' ' });
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('applies current, disabled, and focusable-disabled semantics', async () => {
    const onCurrent = vi.fn();
    const wrapper = mount({
      components,
      methods: { onCurrent },
      template: `
          <Breadcrumb>
            <BreadcrumbItem><BreadcrumbButton current @click="onCurrent">Current</BreadcrumbButton></BreadcrumbItem>
            <BreadcrumbItem><BreadcrumbButton disabled>Disabled</BreadcrumbButton></BreadcrumbItem>
            <BreadcrumbItem><BreadcrumbButton disabled-focusable>Focusable</BreadcrumbButton></BreadcrumbItem>
          </Breadcrumb>
        `,
    });
    const controls = wrapper.findAll('.fui-BreadcrumbButton');

    expect(controls[0]?.attributes('aria-current')).toBe('page');
    expect(controls[0]?.attributes('aria-disabled')).toBe('true');
    expect(controls[0]?.attributes('disabled')).toBeUndefined();
    await controls[0]?.trigger('click');
    expect(onCurrent).not.toHaveBeenCalled();

    expect(controls[1]?.attributes('disabled')).toBeDefined();
    expect(controls[1]?.attributes('aria-disabled')).toBe('true');
    expect(controls[1]?.attributes('tabindex')).toBeUndefined();
    expect(controls[2]?.attributes('disabled')).toBeUndefined();
    expect(controls[2]?.attributes('aria-disabled')).toBe('true');
  });

  it('supports circular arrow navigation, RTL, and skips native disabled controls', async () => {
    const wrapper = mountBreadcrumb(`
      <div dir="rtl">
        <Breadcrumb focus-mode="arrow">
          <BreadcrumbItem><BreadcrumbButton href="/one">One</BreadcrumbButton></BreadcrumbItem>
          <BreadcrumbDivider />
          <BreadcrumbItem><BreadcrumbButton disabled>Disabled</BreadcrumbButton></BreadcrumbItem>
          <BreadcrumbDivider />
          <BreadcrumbItem><BreadcrumbButton href="/three">Three</BreadcrumbButton></BreadcrumbItem>
        </Breadcrumb>
      </div>
    `);
    document.body.appendChild(wrapper.element);
    const controls = wrapper.findAll<HTMLElement>('.fui-BreadcrumbButton');
    await wrapper.vm.$nextTick();

    expect(controls[0]?.attributes('tabindex')).toBe('0');
    expect(controls[1]?.attributes('tabindex')).toBe('-1');
    expect(controls[2]?.attributes('tabindex')).toBe('-1');
    controls[0]?.element.focus();
    await controls[0]?.trigger('keydown', { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(controls[2]?.element);
    expect(controls[2]?.attributes('tabindex')).toBe('0');
    await controls[2]?.trigger('keydown', { key: 'ArrowRight' });
    expect(document.activeElement).toBe(controls[0]?.element);
    wrapper.unmount();
  });

  it('recovers roving focus when the remembered control is disabled or removed', async () => {
    const wrapper = mount({
      components,
      data: () => ({ disableFirst: false, showFirst: true }),
      template: `
        <Breadcrumb focus-mode="arrow">
          <BreadcrumbItem v-if="showFirst">
            <BreadcrumbButton :disabled="disableFirst">One</BreadcrumbButton>
          </BreadcrumbItem>
          <BreadcrumbItem><BreadcrumbButton>Two</BreadcrumbButton></BreadcrumbItem>
        </Breadcrumb>
      `,
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('.fui-BreadcrumbButton')[0]?.attributes('tabindex')).toBe('0');

    await wrapper.setData({ disableFirst: true });
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('.fui-BreadcrumbButton')[1]?.attributes('tabindex')).toBe('0');

    await wrapper.setData({ disableFirst: false, showFirst: false });
    await wrapper.vm.$nextTick();
    expect(wrapper.get('.fui-BreadcrumbButton').attributes('tabindex')).toBe('0');
  });

  it('follows DOM order when keyed controls are reordered', async () => {
    const wrapper = mount({
      components,
      data: () => ({ items: ['one', 'two', 'three'] }),
      template: `
        <Breadcrumb focus-mode="arrow">
          <BreadcrumbItem v-for="item in items" :key="item">
            <BreadcrumbButton>{{ item }}</BreadcrumbButton>
          </BreadcrumbItem>
        </Breadcrumb>
      `,
    });
    document.body.appendChild(wrapper.element);
    await wrapper.vm.$nextTick();

    await wrapper.setData({ items: ['three', 'one', 'two'] });
    await wrapper.vm.$nextTick();
    const controls = wrapper.findAll<HTMLElement>('.fui-BreadcrumbButton');
    controls[0]?.element.focus();
    await controls[0]?.trigger('keydown', { key: 'ArrowRight' });

    expect(document.activeElement).toBe(controls[1]?.element);
    wrapper.unmount();
  });

  it('respects consumer keyboard cancellation', async () => {
    const wrapper = mountBreadcrumb(`
      <Breadcrumb focus-mode="arrow">
        <BreadcrumbItem><BreadcrumbButton @keydown.prevent>One</BreadcrumbButton></BreadcrumbItem>
        <BreadcrumbItem><BreadcrumbButton>Two</BreadcrumbButton></BreadcrumbItem>
      </Breadcrumb>
    `);
    document.body.appendChild(wrapper.element);
    const controls = wrapper.findAll<HTMLElement>('.fui-BreadcrumbButton');

    controls[0]?.element.focus();
    await controls[0]?.trigger('keydown', { key: 'ArrowRight' });
    expect(document.activeElement).toBe(controls[0]?.element);
    wrapper.unmount();
  });

  it('partitions and truncates breadcrumb content with released utility defaults', () => {
    expect(
      partitionBreadcrumbItems({
        items: ['one', 'two', 'three', 'four', 'five', 'six', 'seven'],
      }),
    ).toEqual({
      startDisplayedItems: ['one'],
      overflowItems: ['two'],
      endDisplayedItems: ['three', 'four', 'five', 'six', 'seven'],
    });
    expect(partitionBreadcrumbItems({ items: ['one', 'two'], maxDisplayedItems: 0 })).toEqual({
      startDisplayedItems: ['one'],
      overflowItems: undefined,
      endDisplayedItems: ['two'],
    });
    expect(isTruncatableBreadcrumbContent('Fluent breadcrumb', 6)).toBe(true);
    expect(truncateBreadcrumbLongName('a'.repeat(31))).toBe(`${'a'.repeat(30)}...`);
    expect(truncateBreadcrumbLongName('a'.repeat(31), 0)).toBe(`${'a'.repeat(30)}...`);
    expect(truncateBreadcrumLongTooltip('short')).toBe('short');
    expect(truncateBreadcrumLongTooltip('a'.repeat(81), 0)).toBe(`${'a'.repeat(80)}...`);
  });

  it('inherits sizes and renders icon and divider slots', () => {
    const wrapper = mountBreadcrumb(`
      <Breadcrumb size="large" aria-label="Project trail">
        <BreadcrumbItem class="custom-item">
          <BreadcrumbButton class="custom-button">
            <template #icon><svg data-icon /></template>
            Project
          </BreadcrumbButton>
        </BreadcrumbItem>
        <BreadcrumbDivider><span data-divider>/</span></BreadcrumbDivider>
      </Breadcrumb>
    `);
    const button = wrapper.get('.fui-BreadcrumbButton');

    expect(wrapper.get('nav').attributes('aria-label')).toBe('Project trail');
    expect(wrapper.get('.fui-BreadcrumbItem').classes()).toEqual(
      expect.arrayContaining(['fui-BreadcrumbItem--large', 'custom-item']),
    );
    expect(button.classes()).toEqual(
      expect.arrayContaining(['fui-BreadcrumbButton--large', 'custom-button']),
    );
    expect(wrapper.get('.fui-BreadcrumbButton__icon').attributes('aria-hidden')).toBe('true');
    expect(wrapper.find('[data-divider]').exists()).toBe(true);
  });
});
