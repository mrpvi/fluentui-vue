import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Dropdown from '../src/components/Dropdown/Dropdown.vue';
import Field from '../src/components/Field/Field.vue';
import Option from '../src/components/Option/Option.vue';
import OptionGroup from '../src/components/OptionGroup/OptionGroup.vue';

const components = { Dropdown, Field, Option, OptionGroup };

function mountDropdown(
  template: string,
  data?: () => Record<string, unknown>,
  methods: Record<string, (...args: never[]) => unknown> = {},
) {
  return mount({ components, data, methods, template }, { attachTo: document.body });
}

function trigger(wrapper: ReturnType<typeof mountDropdown>) {
  return wrapper.get<HTMLButtonElement>('.fui-Dropdown__button');
}

function popup(wrapper: ReturnType<typeof mountDropdown>) {
  return document.body.querySelector<HTMLElement>(
    `#${trigger(wrapper).attributes('aria-controls')}`,
  );
}

afterEach(() => {
  document.body.innerHTML = '';
  vi.useRealTimers();
});

describe('FDropdown', () => {
  it('renders combobox semantics, placeholder, appearances, and a teleported popup', async () => {
    const wrapper = mountDropdown(`
      <Dropdown
        class="custom-dropdown"
        aria-label="Animal"
        placeholder="Choose an animal"
        appearance="filled-darker"
        size="large"
        data-track="animal"
      >
        <Option value="cat">Cat</Option>
        <Option value="dog">Dog</Option>
      </Dropdown>
    `);
    const button = trigger(wrapper);

    expect(wrapper.get('.fui-Dropdown').classes()).toContain('custom-dropdown');
    expect(wrapper.get('.fui-Dropdown').classes()).toContain('fui-Dropdown--filled-darker');
    expect(wrapper.get('.fui-Dropdown').classes()).toContain('fui-Dropdown--large');
    expect(button.attributes('role')).toBe('combobox');
    expect(button.attributes('aria-expanded')).toBe('false');
    expect(button.attributes('aria-haspopup')).toBe('listbox');
    expect(button.attributes('aria-label')).toBe('Animal');
    expect(button.attributes('data-track')).toBe('animal');
    expect(button.text()).toContain('Choose an animal');

    await button.trigger('click');
    expect(button.attributes('aria-expanded')).toBe('true');
    expect(button.attributes('aria-controls')).toMatch(/^fui-dropdown-listbox-/);
    expect(popup(wrapper)?.getAttribute('role')).toBe('listbox');
    expect(wrapper.get('.fui-Dropdown').attributes('aria-owns')).toBe(
      button.attributes('aria-controls'),
    );
  });

  it('supports uncontrolled single selection, display text, closing, and event data', async () => {
    const onSelect = vi.fn();
    const wrapper = mountDropdown(
      `
        <Dropdown @option-select="onSelect">
          <Option value="cat">Cat</Option>
          <Option value="dog">Dog</Option>
        </Dropdown>
      `,
      undefined,
      { onSelect },
    );
    const button = trigger(wrapper);

    await button.trigger('click');
    const options = document.body.querySelectorAll<HTMLElement>('.fui-Option');
    options[1]?.click();
    await nextTick();

    expect(button.attributes('aria-expanded')).toBe('false');
    expect(button.text()).toContain('Dog');
    expect(wrapper.getComponent(Dropdown).emitted('update:selectedOptions')?.[0]).toEqual([
      ['dog'],
    ]);
    expect(wrapper.getComponent(Dropdown).emitted('update:modelValue')?.[0]).toEqual(['Dog']);
    expect(onSelect.mock.calls[0]?.[1]).toEqual({
      optionText: 'Dog',
      optionValue: 'dog',
      selectedOptions: ['dog'],
    });
  });

  it('supports controlled open, selection, and displayed value rollback', async () => {
    const onOpen = vi.fn();
    const onSelection = vi.fn();
    const onValue = vi.fn();
    const wrapper = mountDropdown(
      `
        <Dropdown
          :open="false"
          :selected-options="['cat']"
          model-value="Controlled label"
          @update:open="onOpen"
          @update:selected-options="onSelection"
          @update:model-value="onValue"
        >
          <Option value="cat">Cat</Option>
          <Option value="dog">Dog</Option>
        </Dropdown>
      `,
      undefined,
      { onOpen, onSelection, onValue },
    );
    const button = trigger(wrapper);

    await button.trigger('click');
    expect(onOpen).toHaveBeenCalledWith(true);
    expect(button.attributes('aria-expanded')).toBe('false');
    expect(button.text()).toContain('Controlled label');

    await wrapper.setProps?.({});
    const controlledOpen = mountDropdown(
      `
        <Dropdown
          :open="true"
          :selected-options="['cat']"
          model-value="Controlled label"
          @update:selected-options="onSelection"
          @update:model-value="onValue"
        >
          <Option value="cat">Cat</Option>
          <Option value="dog">Dog</Option>
        </Dropdown>
      `,
      undefined,
      { onSelection, onValue },
    );
    const controlledOptions = document.body.querySelectorAll<HTMLElement>('.fui-Option');
    controlledOptions[controlledOptions.length - 1]?.click();
    await nextTick();
    expect(onSelection).toHaveBeenCalledWith(['dog']);
    expect(onValue).toHaveBeenCalledWith('Dog');
    expect(trigger(controlledOpen).text()).toContain('Controlled label');
  });

  it('activates options when controlled open changes to true', async () => {
    const wrapper = mountDropdown(
      `
        <Dropdown :open="open">
          <Option value="cat">Cat</Option>
          <Option value="dog">Dog</Option>
        </Dropdown>
      `,
      () => ({ open: false }),
    );
    const button = trigger(wrapper);

    expect(button.attributes('aria-activedescendant')).toBeUndefined();
    await wrapper.setData({ open: true });
    await nextTick();
    await nextTick();
    const options = document.body.querySelectorAll<HTMLElement>('.fui-Option');
    expect(button.attributes('aria-expanded')).toBe('true');
    expect(button.attributes('aria-activedescendant')).toBe(options[0]?.id);
  });

  it('supports multiselect toggling without closing and released menu semantics', async () => {
    const wrapper = mountDropdown(`
      <Dropdown multiselect :default-selected-options="['cat']">
        <Option value="cat">Cat</Option>
        <Option value="dog">Dog</Option>
        <Option value="bird">Bird</Option>
      </Dropdown>
    `);
    const button = trigger(wrapper);

    await button.trigger('click');
    const options = document.body.querySelectorAll<HTMLElement>('.fui-Option');
    expect(popup(wrapper)?.getAttribute('role')).toBe('menu');
    expect(options[0]?.getAttribute('role')).toBe('menuitemcheckbox');
    options[1]?.click();
    await nextTick();
    expect(button.attributes('aria-expanded')).toBe('true');
    expect(button.text()).toContain('Cat, Dog');
    options[0]?.click();
    await nextTick();
    expect(button.text()).toContain('Dog');
    expect(wrapper.getComponent(Dropdown).emitted('update:selectedOptions')).toEqual([
      [['cat', 'dog']],
      [['dog']],
    ]);
  });

  it('supports clearable single selection and restores trigger focus', async () => {
    const wrapper = mountDropdown(`
      <Dropdown clearable default-value="Cat" :default-selected-options="['cat']">
        <Option value="cat">Cat</Option>
      </Dropdown>
    `);
    await nextTick();
    const button = trigger(wrapper);
    const clear = wrapper.get<HTMLButtonElement>('.fui-Dropdown__clearButton');

    expect(button.text()).toContain('Cat');
    await clear.trigger('click');
    await nextTick();
    expect(wrapper.getComponent(Dropdown).emitted('update:selectedOptions')?.[0]).toEqual([[]]);
    expect(wrapper.getComponent(Dropdown).emitted('optionSelect')?.[0]?.[1]).toEqual({
      optionText: undefined,
      optionValue: undefined,
      selectedOptions: [],
    });
    expect(document.activeElement).toBe(button.element);
    expect(wrapper.find('.fui-Dropdown__clearButton').exists()).toBe(false);
  });

  it('supports active-descendant keyboard navigation, disabled options, selection, and escape', async () => {
    const wrapper = mountDropdown(`
      <Dropdown>
        <Option value="one">One</Option>
        <Option value="two" disabled>Two</Option>
        <Option value="three">Three</Option>
      </Dropdown>
    `);
    const button = trigger(wrapper);

    await button.trigger('keydown', { key: 'ArrowDown' });
    await nextTick();
    const options = document.body.querySelectorAll<HTMLElement>('.fui-Option');
    expect(button.attributes('aria-activedescendant')).toBe(options[0]?.id);
    await button.trigger('keydown', { key: 'ArrowDown' });
    expect(button.attributes('aria-activedescendant')).toBe(options[1]?.id);
    await button.trigger('keydown', { key: 'Enter' });
    expect(wrapper.getComponent(Dropdown).emitted('optionSelect')).toBeUndefined();
    expect(button.attributes('aria-expanded')).toBe('false');
    await button.trigger('click');
    await nextTick();
    await button.trigger('keydown', { key: 'End' });
    await nextTick();
    await button.trigger('keydown', { key: 'Enter' });
    await nextTick();
    expect(button.text()).toContain('Three');
    expect(button.attributes('aria-expanded')).toBe('false');
    await button.trigger('keydown', { key: ' ' });
    await button.trigger('keydown', { key: 'Escape' });
    expect(button.attributes('aria-expanded')).toBe('false');
  });

  it('supports 500ms prefix typeahead and repeated-character cycling', async () => {
    vi.useFakeTimers();
    const wrapper = mountDropdown(`
      <Dropdown>
        <Option value="cat">Cat</Option>
        <Option value="cow">Cow</Option>
        <Option value="dog">Dog</Option>
      </Dropdown>
    `);
    const button = trigger(wrapper);

    await button.trigger('keydown', { key: 'c' });
    await nextTick();
    const options = document.body.querySelectorAll<HTMLElement>('.fui-Option');
    expect(button.attributes('aria-expanded')).toBe('true');
    expect(button.attributes('aria-activedescendant')).toBe(options[0]?.id);
    await button.trigger('keydown', { key: 'c' });
    expect(button.attributes('aria-activedescendant')).toBe(options[1]?.id);
    vi.advanceTimersByTime(501);
    await button.trigger('keydown', { key: 'd' });
    expect(button.attributes('aria-activedescendant')).toBe(options[2]?.id);
  });

  it('supports groups, inline popup placement, outside dismissal, and Field relationships', async () => {
    const wrapper = mountDropdown(`
      <Field label="Companion" hint="Choose one." required validation-state="error">
        <Dropdown inline-popup default-open>
          <OptionGroup label="Animals">
            <Option value="cat">Cat</Option>
          </OptionGroup>
        </Dropdown>
      </Field>
    `);
    await nextTick();
    const button = trigger(wrapper);

    expect(button.attributes('aria-labelledby')).toMatch(/^fui-field-.+__label$/);
    expect(button.attributes('aria-describedby')).toMatch(/^fui-field-.+__hint$/);
    expect(button.attributes('aria-required')).toBe('true');
    expect(button.attributes('aria-invalid')).toBe('true');
    expect(wrapper.find('.fui-Dropdown__listbox').exists()).toBe(true);
    expect(wrapper.get('.fui-OptionGroup').attributes('aria-labelledby')).toMatch(
      /^fui-option-group-label-/,
    );
    expect(wrapper.get('.fui-Dropdown').attributes('aria-owns')).toBeUndefined();

    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    await nextTick();
    expect(button.attributes('aria-expanded')).toBe('false');
  });

  it('blocks disabled interaction and warns for clearable multiselect', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const wrapper = mountDropdown(`
      <Dropdown disabled clearable multiselect>
        <Option value="cat">Cat</Option>
      </Dropdown>
    `);
    const button = trigger(wrapper);

    expect(button.attributes('disabled')).toBeDefined();
    await button.trigger('click');
    await button.trigger('keydown', { key: 'ArrowDown' });
    expect(button.attributes('aria-expanded')).toBe('false');
    expect(wrapper.find('.fui-Dropdown__clearButton').exists()).toBe(false);
    expect(warning).toHaveBeenCalledWith(
      'FDropdown does not support `clearable` in multiselect mode.',
    );
    warning.mockRestore();
  });

  it('allows consumer trigger events and option clicks to cancel behavior', async () => {
    const onClick = vi.fn((event: MouseEvent) => event.preventDefault());
    const onKeydown = vi.fn((event: KeyboardEvent) => event.preventDefault());
    const onOptionClick = vi.fn((event: MouseEvent) => event.preventDefault());
    const wrapper = mountDropdown(
      `
        <Dropdown @click="onClick" @keydown="onKeydown" default-open>
          <Option value="cat" @click="onOptionClick">Cat</Option>
        </Dropdown>
      `,
      undefined,
      { onClick, onKeydown, onOptionClick },
    );
    const button = trigger(wrapper);

    await button.trigger('click');
    expect(button.attributes('aria-expanded')).toBe('true');
    await button.trigger('keydown', { key: 'Escape' });
    expect(button.attributes('aria-expanded')).toBe('true');
    document.body.querySelector<HTMLElement>('.fui-Option')?.click();
    await nextTick();
    expect(wrapper.getComponent(Dropdown).emitted('optionSelect')).toBeUndefined();
  });
});
