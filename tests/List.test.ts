import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import List from '../src/components/List/List.vue';
import ListItem from '../src/components/ListItem/ListItem.vue';

const components = { List, ListItem };

function mountList(template: string) {
  return mount({ components, template });
}

describe('FList family', () => {
  it('renders released root and item defaults with routed attributes', () => {
    const wrapper = mountList(`
      <List class="custom-list" data-track="people">
        <ListItem class="custom-item">Ada</ListItem>
        <ListItem>Linus</ListItem>
      </List>
    `);

    expect(wrapper.get('ul').attributes('role')).toBe('list');
    expect(wrapper.get('ul').attributes('data-track')).toBe('people');
    expect(wrapper.get('ul').classes()).toEqual(
      expect.arrayContaining(['fui-List', 'custom-list']),
    );
    const items = wrapper.findAll('li');
    expect(items).toHaveLength(2);
    expect(items[0]?.attributes('role')).toBe('listitem');
    expect(items[0]?.classes()).toEqual(expect.arrayContaining(['fui-ListItem', 'custom-item']));
    expect(items[0]?.attributes('tabindex')).toBeUndefined();
    expect(wrapper.find('[role="checkbox"]').exists()).toBe(false);
  });

  it('supports semantic ol, paired div roots, and custom role mapping', () => {
    const ordered = mountList(`
      <List as="ol"><ListItem>First</ListItem></List>
    `);
    const composite = mountList(`
      <List as="div" navigation-mode="composite">
        <ListItem as="div"><div role="gridcell"><button>Action</button></div></ListItem>
      </List>
    `);
    const custom = mountList(`
      <List role="listbox"><ListItem>Custom option</ListItem></List>
    `);

    expect(ordered.get('ol').attributes('role')).toBe('list');
    expect(ordered.get('li').attributes('role')).toBe('listitem');
    expect(composite.get('.fui-List').element.tagName).toBe('DIV');
    expect(composite.get('.fui-List').attributes('role')).toBe('grid');
    expect(composite.get('.fui-ListItem').element.tagName).toBe('DIV');
    expect(composite.get('.fui-ListItem').attributes('role')).toBe('row');
    expect(composite.find('[role="gridcell"]').exists()).toBe(true);
    expect(custom.get('.fui-ListItem').attributes('role')).toBe('option');
  });

  it('supports uncontrolled single selection and does not deselect the selected item', async () => {
    const wrapper = mountList(`
      <List selection-mode="single" :default-selected-items="['two']">
        <ListItem value="one">One</ListItem>
        <ListItem value="two">Two</ListItem>
      </List>
    `);
    const items = wrapper.findAll('.fui-ListItem');

    expect(wrapper.get('.fui-List').attributes('role')).toBe('listbox');
    expect(items[0]?.attributes('role')).toBe('option');
    expect(items[1]?.attributes('aria-selected')).toBe('true');
    await items[0]?.trigger('click');
    expect(items[0]?.attributes('aria-selected')).toBe('true');
    expect(items[1]?.attributes('aria-selected')).toBe('false');
    await items[0]?.trigger('click');
    expect(items[0]?.attributes('aria-selected')).toBe('true');
  });

  it('supports controlled multiselect and emits released selection order', async () => {
    const onUpdate = vi.fn();
    const onChange = vi.fn();
    const wrapper = mount({
      components,
      data: () => ({ selected: ['one'] }),
      methods: { onUpdate, onChange },
      template: `
        <List
          selection-mode="multiselect"
          :model-value="selected"
          @update:model-value="onUpdate"
          @selection-change="onChange"
        >
          <ListItem value="one">One</ListItem>
          <ListItem value="two">Two</ListItem>
        </List>
      `,
    });

    expect(wrapper.get('.fui-List').attributes('aria-multiselectable')).toBe('true');
    await wrapper.findAll('.fui-ListItem')[1]?.trigger('click');
    expect(onUpdate).toHaveBeenCalledWith(['one', 'two']);
    expect(onChange.mock.calls[0]?.[1]).toEqual({ selectedItems: ['one', 'two'] });
    expect(wrapper.findAll('.fui-ListItem')[1]?.attributes('aria-selected')).toBe('false');
  });

  it('preserves action cancellation, checkmark isolation, and disabled selection', async () => {
    const onAction = vi.fn((event: CustomEvent) => event.preventDefault());
    const onNativeAction = vi.fn();
    const wrapper = mount({
      components,
      methods: { onAction },
      template: `
        <List selection-mode="multiselect">
          <ListItem value="action" @action="onAction">Action</ListItem>
          <ListItem value="disabled" disabled-selection>Disabled</ListItem>
          <ListItem value="secondary" disabled-selection @action="() => undefined">Secondary</ListItem>
        </List>
      `,
    });
    const items = wrapper.findAll('.fui-ListItem');
    items[0]?.element.addEventListener('ListItemAction', onNativeAction);

    await items[0]?.trigger('click');
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onNativeAction).toHaveBeenCalledTimes(1);
    expect((onNativeAction.mock.calls[0]?.[0] as CustomEvent).detail.originalEvent).toBeInstanceOf(
      MouseEvent,
    );
    expect(items[0]?.attributes('aria-selected')).toBe('false');
    await items[0]?.find('.fui-ListItem__checkmarkIndicator').trigger('click');
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(items[0]?.attributes('aria-selected')).toBe('true');
    expect(items[0]?.find('[role="checkbox"]').attributes('aria-checked')).toBe('true');
    expect(items[1]?.attributes('aria-disabled')).toBe('true');
    expect(items[1]?.find('[role="checkbox"]').attributes('aria-disabled')).toBe('true');
    expect(items[2]?.attributes('aria-disabled')).toBeUndefined();
    await items[2]?.trigger('click');
    expect(items[2]?.attributes('aria-selected')).toBe('false');
  });

  it('uses Space for selection and Enter for action plus selection', async () => {
    const onAction = vi.fn();
    const wrapper = mount({
      components,
      methods: { onAction },
      template: `
        <List selection-mode="multiselect">
          <ListItem value="one" @action="onAction">One</ListItem>
        </List>
      `,
    });
    const item = wrapper.get('.fui-ListItem');

    await item.trigger('keydown', { key: ' ' });
    expect(item.attributes('aria-selected')).toBe('true');
    expect(onAction).not.toHaveBeenCalled();
    await item.trigger('keydown', { key: 'Enter' });
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(item.attributes('aria-selected')).toBe('false');
  });

  it('moves item focus vertically without wrapping and supports range keys', async () => {
    const wrapper = mountList(`
      <List navigation-mode="items">
        <ListItem value="one">One</ListItem>
        <ListItem value="two">Two</ListItem>
        <ListItem value="three">Three</ListItem>
      </List>
    `);
    document.body.appendChild(wrapper.element);
    const items = wrapper.findAll<HTMLElement>('.fui-ListItem');

    items[0]?.element.focus();
    await items[0]?.trigger('keydown', { key: 'ArrowDown' });
    expect(document.activeElement).toBe(items[1]?.element);
    await items[1]?.trigger('keydown', { key: 'End' });
    expect(document.activeElement).toBe(items[2]?.element);
    await items[2]?.trigger('keydown', { key: 'ArrowDown' });
    expect(document.activeElement).toBe(items[2]?.element);
    await items[2]?.trigger('keydown', { key: 'PageUp' });
    expect(document.activeElement).toBe(items[0]?.element);
    wrapper.unmount();
  });

  it('enters and exits composite item actions with horizontal and vertical keys', async () => {
    const wrapper = mountList(`
      <List navigation-mode="composite">
        <ListItem value="one"><button>One action</button><button>One more</button></ListItem>
        <ListItem value="two"><button>Two action</button></ListItem>
      </List>
    `);
    document.body.appendChild(wrapper.element);
    const items = wrapper.findAll<HTMLElement>('.fui-ListItem');
    const firstAction = wrapper.get<HTMLElement>('button');

    items[0]?.element.focus();
    await items[0]?.trigger('keydown', { key: 'ArrowRight' });
    expect(document.activeElement).toBe(firstAction.element);
    await firstAction.trigger('keydown', { key: 'ArrowRight' });
    const secondAction = wrapper.findAll<HTMLElement>('button')[1];
    expect(document.activeElement).toBe(secondAction?.element);
    await secondAction?.trigger('keydown', { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(firstAction.element);
    await firstAction.trigger('keydown', { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(items[0]?.element);
    await items[0]?.trigger('keydown', { key: 'ArrowRight' });
    await firstAction.trigger('keydown', { key: 'Escape' });
    expect(document.activeElement).toBe(items[0]?.element);
    await items[0]?.trigger('keydown', { key: 'ArrowRight' });
    await firstAction.trigger('keydown', { key: 'ArrowDown' });
    expect(document.activeElement).toBe(items[1]?.element);
    wrapper.unmount();
  });

  it('respects consumer click and keyboard cancellation', async () => {
    const wrapper = mountList(`
      <List selection-mode="single" navigation-mode="items">
        <ListItem value="one" @click.prevent @keydown.prevent>One</ListItem>
        <ListItem value="two">Two</ListItem>
      </List>
    `);
    document.body.appendChild(wrapper.element);
    const items = wrapper.findAll<HTMLElement>('.fui-ListItem');

    await items[0]?.trigger('click');
    expect(items[0]?.attributes('aria-selected')).toBe('false');
    items[0]?.element.focus();
    await items[0]?.trigger('keydown', { key: 'ArrowDown' });
    expect(document.activeElement).toBe(items[0]?.element);
    wrapper.unmount();
  });
});
