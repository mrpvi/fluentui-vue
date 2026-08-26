import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import FlatTree from '../src/components/FlatTree/FlatTree.vue';
import FlatTreeItem from '../src/components/FlatTreeItem/FlatTreeItem.vue';
import Tree from '../src/components/Tree/Tree.vue';
import TreeItem from '../src/components/TreeItem/TreeItem.vue';
import TreeItemLayout from '../src/components/TreeItemLayout/TreeItemLayout.vue';
import TreeItemPersonaLayout from '../src/components/TreeItemPersonaLayout/TreeItemPersonaLayout.vue';

const components = {
  Tree,
  TreeItem,
  TreeItemLayout,
  TreeItemPersonaLayout,
  FlatTree,
  FlatTreeItem,
};

describe('FTree family', () => {
  it('renders nested tree semantics and controlled appearance', () => {
    const wrapper = mount({
      components,
      template: `
        <Tree appearance="subtle-alpha" size="small" aria-label="Files">
          <TreeItem item-type="branch" value="src">
            <TreeItemLayout>Source</TreeItemLayout>
            <Tree>
              <TreeItem item-type="leaf" value="index"><TreeItemLayout>index.ts</TreeItemLayout></TreeItem>
            </Tree>
          </TreeItem>
        </Tree>
      `,
    });
    expect(wrapper.get('[role="tree"]').attributes('aria-label')).toBe('Files');
    expect(wrapper.findAll('[role="tree"]')).toHaveLength(1);
    expect(wrapper.findAll('[role="group"]')).toHaveLength(1);
    const items = wrapper.findAll('[role="treeitem"]');
    expect(items[0]?.attributes('aria-level')).toBe('1');
    expect(items[0]?.attributes('aria-expanded')).toBe('false');
    expect(items[1]?.attributes('aria-level')).toBe('2');
    expect(wrapper.get('.fui-Tree').classes()).toContain('fui-Tree--subtle-alpha');
  });

  it('supports uncontrolled expansion by layout button and keyboard', async () => {
    const onChange = vi.fn();
    const wrapper = mount({
      components,
      methods: { onChange },
      template: `
        <Tree @open-change="onChange">
          <TreeItem item-type="branch" value="src">
            <TreeItemLayout>Source</TreeItemLayout>
            <Tree><TreeItem item-type="leaf" value="child"><TreeItemLayout>Child</TreeItemLayout></TreeItem></Tree>
          </TreeItem>
        </Tree>
      `,
    });
    const rootItem = wrapper.findAll('[role="treeitem"]')[0]!;
    await rootItem.get('.fui-TreeItemLayout__expandIcon').trigger('click');
    expect(rootItem.attributes('aria-expanded')).toBe('true');
    expect(onChange.mock.calls[0]?.[1]).toMatchObject({
      open: true,
      value: 'src',
      type: 'expandIconClick',
    });
    rootItem.element.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }),
    );
    await wrapper.vm.$nextTick();
    expect(rootItem.attributes('aria-expanded')).toBe('false');
  });

  it('navigates the visible hierarchy across nested groups', async () => {
    const focus = vi.spyOn(HTMLElement.prototype, 'focus');
    const wrapper = mount({
      attachTo: document.body,
      components,
      template: `
        <Tree :default-open-items="['src']">
          <TreeItem item-type="branch" value="src"><TreeItemLayout>Source</TreeItemLayout>
            <Tree><TreeItem item-type="leaf" value="child"><TreeItemLayout>Child</TreeItemLayout></TreeItem></Tree>
          </TreeItem>
          <TreeItem item-type="leaf" value="readme"><TreeItemLayout>Readme</TreeItemLayout></TreeItem>
        </Tree>
      `,
    });
    const items = wrapper.findAll<HTMLElement>('[role="treeitem"]');
    await items[0]!.trigger('keydown', { key: 'ArrowRight' });
    expect(focus).toHaveBeenLastCalledWith();
    expect(focus.mock.instances.at(-1)).toBe(items[1]!.element);
    await items[1]!.trigger('keydown', { key: 'ArrowDown' });
    expect(focus.mock.instances.at(-1)).toBe(items[2]!.element);
    await items[2]!.trigger('keydown', { key: 'Home' });
    expect(focus.mock.instances.at(-1)).toBe(items[0]!.element);
    expect(items[0]!.attributes('aria-expanded')).toBe('true');
    wrapper.unmount();
  });

  it('supports single and multiselect checked state', async () => {
    const wrapper = mount({
      components,
      template: `
        <Tree selection-mode="multiselect" :default-checked-items="['one']">
          <TreeItem item-type="leaf" value="one"><TreeItemLayout>One</TreeItemLayout></TreeItem>
          <TreeItem item-type="leaf" value="two"><TreeItemLayout>Two</TreeItemLayout></TreeItem>
        </Tree>
      `,
    });
    const items = wrapper.findAll('[role="treeitem"]');
    expect(items[0]?.attributes('aria-checked')).toBe('true');
    items[1]?.element.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    await wrapper.vm.$nextTick();
    expect(items[1]?.attributes('aria-checked')).toBe('true');
    expect(wrapper.get('[role="tree"]').attributes('aria-multiselectable')).toBe('true');
  });

  it('renders persona and flat tree metadata', () => {
    const persona = mount({
      components,
      template: `<Tree><TreeItem item-type="leaf" value="ada"><TreeItemPersonaLayout name="Ada"><template #description>Engineer</template></TreeItemPersonaLayout></TreeItem></Tree>`,
    });
    expect(persona.text()).toContain('Ada');
    expect(persona.text()).toContain('Engineer');
    expect(persona.find('.fui-Avatar').exists()).toBe(true);

    const flat = mount({
      components,
      template: `<FlatTree><FlatTreeItem item-type="leaf" value="flat" :level="3" :position="2" :set-size="4"><TreeItemLayout>Flat</TreeItemLayout></FlatTreeItem></FlatTree>`,
    });
    const item = flat.get('[role="treeitem"]');
    expect(item.attributes('aria-level')).toBe('3');
    expect(item.attributes('aria-posinset')).toBe('2');
    expect(item.attributes('aria-setsize')).toBe('4');
  });
});
