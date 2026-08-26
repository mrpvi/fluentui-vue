import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  FTag,
  FTagPicker,
  FTagPickerButton,
  FTagPickerControl,
  FTagPickerGroup,
  FTagPickerInput,
  FTagPickerList,
  FTagPickerOption,
  FTagPickerOptionGroup,
} from '../src';

const components = {
  FTag,
  FTagPicker,
  FTagPickerButton,
  FTagPickerControl,
  FTagPickerGroup,
  FTagPickerInput,
  FTagPickerList,
  FTagPickerOption,
  FTagPickerOptionGroup,
};
function mountPicker(template: string, methods?: Record<string, unknown>) {
  return mount({ components, methods, template }, { attachTo: document.body });
}
afterEach(() => {
  document.body.innerHTML = '';
});

describe('TagPicker family', () => {
  it('opens, filters, exposes active descendant, and selects options', async () => {
    const wrapper = mountPicker(
      `<FTagPicker inline-popup><FTagPickerControl><FTagPickerInput placeholder="Choose people" /></FTagPickerControl><FTagPickerList><FTagPickerOption value="ada">Ada</FTagPickerOption><FTagPickerOption value="grace">Grace</FTagPickerOption></FTagPickerList></FTagPicker>`,
    );
    const input = wrapper.get<HTMLInputElement>('.fui-TagPickerInput');
    await input.setValue('gr');
    await nextTick();
    expect(input.attributes('aria-expanded')).toBe('true');
    expect(input.attributes('aria-activedescendant')).toContain('fui-tag-picker-option');
    await wrapper.findAll('.fui-TagPickerOption')[1]!.trigger('click');
    await nextTick();
    expect(wrapper.getComponent(FTagPicker).emitted('optionSelect')?.[0]?.[1]).toEqual({
      selectedOptions: ['grace'],
      value: 'grace',
    });
    expect(input.attributes('aria-expanded')).toBe('false');
  });

  it('supports keyboard selection and controlled rollback', async () => {
    const wrapper = mountPicker(
      `<FTagPicker inline-popup :selected-options="['ada']"><FTagPickerControl><FTagPickerInput /></FTagPickerControl><FTagPickerList><FTagPickerOption value="ada">Ada</FTagPickerOption><FTagPickerOption value="grace">Grace</FTagPickerOption></FTagPickerList></FTagPicker>`,
    );
    const input = wrapper.get('.fui-TagPickerInput');
    await input.setValue('gr');
    await nextTick();
    await wrapper.findAll('.fui-TagPickerOption')[1]!.trigger('click');
    expect(wrapper.getComponent(FTagPicker).emitted('update:selectedOptions')?.[0]).toEqual([
      ['ada', 'grace'],
    ]);
    expect(wrapper.getComponent(FTagPicker).vm.selectedOptions).toEqual(['ada']);
  });

  it('renders grouped option content and removes selected tags', async () => {
    const onSelect = vi.fn();
    const wrapper = mountPicker(
      `<FTagPicker inline-popup :default-selected-options="['ada']" @option-select="onSelect"><FTagPickerControl><FTagPickerGroup v-slot="{ selectedOptions }"><FTag v-for="item in selectedOptions" :key="item" :value="item">{{ item }}</FTag></FTagPickerGroup><FTagPickerInput /></FTagPickerControl><FTagPickerList><FTagPickerOptionGroup label="People"><FTagPickerOption value="ada"><template #media>A</template>Ada<template #secondary-content>Engineer</template></FTagPickerOption></FTagPickerOptionGroup></FTagPickerList></FTagPicker>`,
      { onSelect },
    );
    expect(wrapper.get('.fui-TagPickerGroup .fui-Tag').text()).toContain('ada');
    await wrapper.get('.fui-TagPickerGroup .fui-Tag').trigger('click');
    expect(onSelect).toHaveBeenCalledWith(expect.any(MouseEvent), {
      selectedOptions: [],
      value: 'ada',
    });
    await wrapper.get('.fui-TagPickerInput').setValue('a');
    await nextTick();
    expect(wrapper.get('.fui-TagPickerOptionGroup').attributes('role')).toBe('group');
  });

  it('supports an alternative button trigger and cleans up document listeners', async () => {
    const remove = vi.spyOn(document, 'removeEventListener');
    const wrapper = mountPicker(
      `<FTagPicker><FTagPickerControl><FTagPickerButton placeholder="Choose" /></FTagPickerControl><FTagPickerList><FTagPickerOption value="ada">Ada</FTagPickerOption></FTagPickerList></FTagPicker>`,
    );
    await wrapper.get('.fui-TagPickerButton').trigger('click');
    expect(wrapper.get('.fui-TagPickerButton').attributes('aria-expanded')).toBe('true');
    wrapper.unmount();
    expect(remove).toHaveBeenCalledWith('pointerdown', expect.any(Function));
    expect(remove).toHaveBeenCalledWith('keydown', expect.any(Function));
  });
});
