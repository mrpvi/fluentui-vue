import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Combobox from '../src/components/Combobox/Combobox.vue';
import Field from '../src/components/Field/Field.vue';
import Option from '../src/components/Option/Option.vue';

const components = { Combobox, Field, Option };

function mountCombobox(template: string, data?: () => Record<string, unknown>) {
  return mount({ components, data, template }, { attachTo: document.body });
}

function input(wrapper: ReturnType<typeof mountCombobox>) {
  return wrapper.get<HTMLInputElement>('.fui-Combobox__input');
}

afterEach(() => {
  document.body.innerHTML = '';
  vi.useRealTimers();
});

describe('FCombobox', () => {
  it('renders an editable combobox with Field relationships and filtered options', async () => {
    const wrapper = mountCombobox(`
      <Field label="Animal" hint="Choose an animal." required>
        <Combobox placeholder="Search animals">
          <Option value="cat">Cat</Option>
          <Option value="dog">Dog</Option>
          <Option value="bird">Bird</Option>
        </Combobox>
      </Field>
    `);
    const control = input(wrapper);
    expect(control.attributes('role')).toBe('combobox');
    expect(control.attributes('aria-labelledby')).toMatch(/^fui-field-.+__label$/);
    expect(control.attributes('aria-describedby')).toMatch(/^fui-field-.+__hint$/);
    expect(control.attributes('aria-required')).toBe('true');
    expect(control.attributes('placeholder')).toBe('Search animals');

    await control.setValue('do');
    await nextTick();
    expect(control.attributes('aria-expanded')).toBe('true');
    const options = [...document.body.querySelectorAll<HTMLElement>('.fui-Option')];
    expect(options.map((option) => option.textContent?.trim())).toEqual(['Cat', 'Dog', 'Bird']);
    expect(control.attributes('aria-activedescendant')).toBe(options[1]?.id);
  });

  it('selects an option, emits value data, and restores focus', async () => {
    const wrapper = mountCombobox(
      `<Combobox><Option value="cat">Cat</Option><Option value="dog">Dog</Option></Combobox>`,
      undefined,
    );
    const control = input(wrapper);
    await control.setValue('d');
    await nextTick();
    document.body.querySelector<HTMLElement>('.fui-Option:nth-child(2)')?.click();
    await nextTick();
    expect(control.element.value).toBe('Dog');
    expect(control.attributes('aria-expanded')).toBe('false');
    expect(control.element).toBe(document.activeElement);
    expect(wrapper.getComponent(Combobox).emitted('optionSelect')).toHaveLength(1);
    expect(wrapper.getComponent(Combobox).emitted('optionSelect')?.[0]?.[1]).toEqual(
      expect.objectContaining({ optionText: 'Dog', optionValue: 'dog', selectedOptions: ['dog'] }),
    );
  });

  it('supports keyboard opening, selection, Escape, clear, and disabled options', async () => {
    const wrapper = mountCombobox(`
      <Combobox clearable default-value="Cat" default-selected-options="cat">
        <Option value="cat">Cat</Option>
        <Option value="dog">Dog</Option>
        <Option value="bird" disabled>Bird</Option>
      </Combobox>
    `);
    const control = input(wrapper);
    await control.trigger('keydown', { key: 'ArrowDown' });
    await nextTick();
    expect(control.attributes('aria-expanded')).toBe('true');
    await control.trigger('keydown', { key: 'ArrowDown' });
    await control.trigger('keydown', { key: 'Enter' });
    await nextTick();
    expect(control.element.value).toBe('Dog');
    expect(control.attributes('aria-expanded')).toBe('false');
    await control.trigger('keydown', { key: 'ArrowDown' });
    await control.trigger('keydown', { key: 'Escape' });
    expect(control.attributes('aria-expanded')).toBe('false');
    await wrapper.get('button[aria-label="Clear selection"]').trigger('click');
    await nextTick();
    expect(control.element.value).toBe('');
    expect(control.element).toBe(document.activeElement);
  });

  it('supports multiselect inline popup and controlled rollback', async () => {
    const wrapper = mountCombobox(`
      <Combobox multiselect inline-popup :selected-options="['cat']" model-value="Locked">
        <Option value="cat">Cat</Option><Option value="dog">Dog</Option>
      </Combobox>
    `);
    const control = input(wrapper);
    await control.trigger('click');
    const dog = document.body.querySelector<HTMLElement>('.fui-Option:nth-child(2)');
    dog?.click();
    await nextTick();
    expect(control.element.value).toBe('Locked');
    expect(document.querySelector('.fui-Combobox__listbox')?.getAttribute('role')).toBe('menu');
  });
});
