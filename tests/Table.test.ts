import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import * as Table from '../src/components/Table';

const components = {
  Table: Table.FTable,
  TableHeader: Table.FTableHeader,
  TableHeaderCell: Table.FTableHeaderCell,
  TableBody: Table.FTableBody,
  TableRow: Table.FTableRow,
  TableCell: Table.FTableCell,
  TableSelectionCell: Table.FTableSelectionCell,
  TableCellLayout: Table.FTableCellLayout,
  TableCellActions: Table.FTableCellActions,
  TableResizeHandle: Table.FTableResizeHandle,
};

describe('FTable family', () => {
  it('renders native semantic table elements and size styling', () => {
    const wrapper = mount({
      components,
      template: `<Table size="small"><TableHeader><TableRow><TableHeaderCell>Name</TableHeaderCell></TableRow></TableHeader><TableBody><TableRow><TableCell>Ada</TableCell></TableRow></TableBody></Table>`,
    });
    expect(wrapper.get('table').classes()).toContain('fui-Table--small');
    expect(wrapper.find('thead').exists()).toBe(true);
    expect(wrapper.get('th').text()).toBe('Name');
    expect(wrapper.find('tbody').exists()).toBe(true);
    expect(wrapper.get('td').text()).toBe('Ada');
  });

  it('supports div-backed table semantics', () => {
    const wrapper = mount({
      components,
      template: `<Table no-native-elements><TableHeader no-native-elements><TableRow no-native-elements><TableHeaderCell no-native-elements>Name</TableHeaderCell></TableRow></TableHeader><TableBody no-native-elements><TableRow no-native-elements><TableCell no-native-elements>Ada</TableCell></TableRow></TableBody></Table>`,
    });
    expect(wrapper.get('[role="table"]').element.tagName).toBe('DIV');
    expect(wrapper.findAll('[role="rowgroup"]')).toHaveLength(2);
    expect(wrapper.findAll('[role="row"]')).toHaveLength(2);
    expect(wrapper.find('[role="columnheader"]').exists()).toBe(true);
    expect(wrapper.find('[role="cell"]').exists()).toBe(true);
  });

  it('exposes sortable headers with aria-sort and sort events', async () => {
    const onSort = vi.fn();
    const wrapper = mount({
      components,
      methods: { onSort },
      template: `<Table sortable><TableHeader><TableRow><TableHeaderCell sortable sort-direction="ascending" @sort="onSort">Name</TableHeaderCell></TableRow></TableHeader></Table>`,
    });
    expect(wrapper.get('th').attributes('aria-sort')).toBe('ascending');
    await wrapper.get('button').trigger('click');
    expect(onSort).toHaveBeenCalledTimes(1);
  });

  it('renders selection, cell layout, actions, and keyboard resizing', async () => {
    const onChange = vi.fn();
    const onResize = vi.fn();
    const wrapper = mount({
      components,
      methods: { onChange, onResize },
      template: `<Table><TableBody><TableRow><TableSelectionCell aria-label="Select Ada" @change="onChange"/><TableCell><TableCellLayout truncate><template #media>◎</template>Ada<template #description>Engineer</template></TableCellLayout><TableCellActions visible><button>Edit</button></TableCellActions></TableCell></TableRow></TableBody></Table><TableResizeHandle :width="100" @resize="onResize" />`,
    });
    expect(wrapper.get('input').attributes('aria-label')).toBe('Select Ada');
    await wrapper.get('input').setValue(true);
    expect(onChange.mock.calls[0]?.[1]).toEqual({ checked: true });
    expect(wrapper.get('.fui-TableCellLayout__description').text()).toBe('Engineer');
    expect(wrapper.get('.fui-TableCellActions').classes()).toContain(
      'fui-TableCellActions--visible',
    );
    await wrapper.get('[role="separator"]').trigger('keydown', { key: 'ArrowRight' });
    expect(onResize.mock.calls[0]?.[1]).toMatchObject({ width: 101, delta: 1 });
  });
});
