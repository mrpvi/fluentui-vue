import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import * as Grid from '../src/components/DataGrid';

const components = {
  DataGrid: Grid.FDataGrid,
  DataGridHeader: Grid.FDataGridHeader,
  DataGridHeaderCell: Grid.FDataGridHeaderCell,
  DataGridBody: Grid.FDataGridBody,
  DataGridRow: Grid.FDataGridRow,
  DataGridCell: Grid.FDataGridCell,
  DataGridSelectionCell: Grid.FDataGridSelectionCell,
};
const items = [
  { id: 'ada', name: 'Ada', score: 2 },
  { id: 'grace', name: 'Grace', score: 1 },
];
const columns = [
  {
    columnId: 'name',
    compare: (a: (typeof items)[number], b: (typeof items)[number]) => a.name.localeCompare(b.name),
    width: 120,
    minWidth: 80,
  },
  {
    columnId: 'score',
    compare: (a: (typeof items)[number], b: (typeof items)[number]) => a.score - b.score,
    width: 80,
  },
];
const template = `<DataGrid :items="items" :columns="columns" :get-row-id="item => item.id" selection-mode="multiselect" :default-selected-items="['ada']" resizable-columns><DataGridHeader><DataGridRow><DataGridSelectionCell/><DataGridHeaderCell column-id="name">Name</DataGridHeaderCell><DataGridHeaderCell column-id="score">Score</DataGridHeaderCell></DataGridRow></DataGridHeader><DataGridBody v-slot="{ item, rowId }"><DataGridRow :row-id="rowId"><template #selection-cell><DataGridSelectionCell/></template><DataGridCell>{{ item.name }}</DataGridCell><DataGridCell>{{ item.score }}</DataGridCell></DataGridRow></DataGridBody></DataGrid>`;

function mountGrid(extra: Record<string, unknown> = {}) {
  return mount({ components, data: () => ({ items, columns }), ...extra, template });
}

describe('FDataGrid family', () => {
  it('renders grid semantics, rows from items, and selected state', () => {
    const wrapper = mountGrid();
    expect(wrapper.get('[role="grid"]').attributes('aria-multiselectable')).toBe('true');
    expect(wrapper.findAll('[role="row"]')).toHaveLength(3);
    expect(wrapper.findAll('[role="gridcell"]')).toHaveLength(4);
    expect(wrapper.findAll('[role="columnheader"]')).toHaveLength(2);
    expect(wrapper.findAll('.fui-DataGridRow')[1]?.attributes('aria-selected')).toBe('true');
    expect(wrapper.text()).toContain('Ada');
  });

  it('selects rows and select-all with typed events', async () => {
    const onSelection = vi.fn();
    const wrapper = mount({
      components,
      data: () => ({ items, columns }),
      methods: { onSelection },
      template: template.replace(
        'resizable-columns',
        'resizable-columns @selection-change="onSelection"',
      ),
    });
    const inputs = wrapper.findAll('input');
    await inputs[2]?.setValue(true);
    expect(onSelection.mock.calls.at(-1)?.[1]).toEqual({ selectedItems: ['ada', 'grace'] });
    await inputs[0]?.trigger('change');
    expect(onSelection.mock.calls.at(-1)?.[1]).toEqual({ selectedItems: [] });
  });

  it('toggles sorting and reorders rendered rows', async () => {
    const onSort = vi.fn();
    const wrapper = mount({
      components,
      data: () => ({ items, columns }),
      methods: { onSort },
      template: template.replace('resizable-columns', 'resizable-columns @sort-change="onSort"'),
    });
    const score = wrapper.findAll('.fui-DataGridHeaderCell')[1]!;
    await score.get('button').trigger('click');
    expect(onSort.mock.calls[0]?.[1]).toEqual({ sortColumn: 'score', sortDirection: 'ascending' });
    expect(wrapper.findAll('.fui-DataGridRow')[1]?.text()).toContain('Grace');
    await score.get('button').trigger('click');
    expect(onSort.mock.calls[1]?.[1]).toEqual({ sortColumn: 'score', sortDirection: 'descending' });
  });

  it('moves focus across cells with arrow keys', async () => {
    const wrapper = mountGrid();
    document.body.appendChild(wrapper.element);
    const cells = wrapper.findAll<HTMLElement>('[role="gridcell"]');
    cells[0]?.element.focus();
    await cells[0]?.trigger('keydown', { key: 'ArrowRight' });
    expect(document.activeElement).toBe(cells[1]?.element);
    await cells[1]?.trigger('keydown', { key: 'ArrowDown' });
    expect(document.activeElement).toBe(cells[3]?.element);
    wrapper.unmount();
  });

  it('resizes columns with keyboard handles', async () => {
    const onResize = vi.fn();
    const wrapper = mount({
      components,
      data: () => ({ items, columns }),
      methods: { onResize },
      template: template.replace(
        'resizable-columns',
        'resizable-columns @column-resize="onResize"',
      ),
    });
    const handle = wrapper.findAll('[role="separator"]')[0]!;
    await handle.trigger('keydown', { key: 'ArrowRight', shiftKey: true });
    expect(onResize.mock.calls.at(-1)?.[1]).toEqual({ columnId: 'name', width: 130 });
  });
});
