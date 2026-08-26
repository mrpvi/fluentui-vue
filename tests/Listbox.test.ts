import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import Field from '../src/components/Field/Field.vue';
import Listbox from '../src/components/Listbox/Listbox.vue';
import Option from '../src/components/Option/Option.vue';
import OptionGroup from '../src/components/OptionGroup/OptionGroup.vue';

const components = { Field, Listbox, Option, OptionGroup };

function mountListbox(template: string, data?: () => Record<string, unknown>, methods = {}) {
  return mount({ components, data, methods, template });
}

describe('FListbox family', () => {
  it('renders released standalone semantics and routes root attributes', () => {
    const wrapper = mountListbox(`
      <Listbox class="custom-listbox" aria-label="Animals" data-track="choices">
        <Option value="cat">Cat</Option>
        <Option value="dog" disabled>Dog</Option>
      </Listbox>
    `);
    const root = wrapper.get('.fui-Listbox');
    const options = wrapper.findAll('.fui-Option');

    expect(root.attributes('role')).toBe('listbox');
    expect(root.attributes('tabindex')).toBe('0');
    expect(root.attributes('aria-label')).toBe('Animals');
    expect(root.attributes('data-track')).toBe('choices');
    expect(root.classes()).toContain('custom-listbox');
    expect(options).toHaveLength(2);
    expect(options[0]?.attributes('role')).toBe('option');
    expect(options[0]?.attributes('aria-selected')).toBe('false');
    expect(options[0]?.attributes('tabindex')).toBeUndefined();
    expect(options[1]?.attributes('aria-disabled')).toBe('true');
  });

  it('supports uncontrolled single selection and emits released event data', async () => {
    const onSelect = vi.fn();
    const wrapper = mountListbox(
      `
        <Listbox :default-selected-options="['cat']" @option-select="onSelect">
          <Option value="cat">Cat</Option>
          <Option value="dog">Dog</Option>
        </Listbox>
      `,
      undefined,
      { onSelect },
    );
    const options = wrapper.findAll('.fui-Option');

    expect(options[0]?.attributes('aria-selected')).toBe('true');
    await options[1]?.trigger('click');
    expect(options[0]?.attributes('aria-selected')).toBe('false');
    expect(options[1]?.attributes('aria-selected')).toBe('true');
    expect(onSelect.mock.calls[0]?.[1]).toEqual({
      optionText: 'Dog',
      optionValue: 'dog',
      selectedOptions: ['dog'],
    });
    expect(wrapper.getComponent(Listbox).emitted('update:modelValue')?.[0]).toEqual([['dog']]);
  });

  it('supports controlled selection rollback while emitting the proposed value', async () => {
    const onUpdate = vi.fn();
    const wrapper = mountListbox(
      `
        <Listbox :model-value="selected" @update:model-value="onUpdate">
          <Option value="cat">Cat</Option>
          <Option value="dog">Dog</Option>
        </Listbox>
      `,
      () => ({ selected: ['cat'] }),
      { onUpdate },
    );
    const options = wrapper.findAll('.fui-Option');

    await options[1]?.trigger('click');
    expect(onUpdate).toHaveBeenCalledWith(['dog']);
    expect(options[0]?.attributes('aria-selected')).toBe('true');
    expect(options[1]?.attributes('aria-selected')).toBe('false');
  });

  it('uses released multiselect menu semantics and toggles in interaction order', async () => {
    const wrapper = mountListbox(`
      <Listbox multiselect :default-selected-options="['cat']">
        <Option value="cat">Cat</Option>
        <Option value="dog">Dog</Option>
        <Option value="bird">Bird</Option>
      </Listbox>
    `);
    const root = wrapper.get('.fui-Listbox');
    const options = wrapper.findAll('.fui-Option');

    expect(root.attributes('role')).toBe('menu');
    expect(root.attributes('aria-multiselectable')).toBeUndefined();
    expect(options[0]?.attributes('role')).toBe('menuitemcheckbox');
    expect(options[0]?.attributes('aria-checked')).toBe('true');
    expect(options[0]?.attributes('aria-selected')).toBeUndefined();
    expect(options[1]?.find('.fui-Option__checkIcon').isVisible()).toBe(true);

    await options[1]?.trigger('click');
    await options[2]?.trigger('click');
    await options[0]?.trigger('click');
    expect(wrapper.getComponent(Listbox).emitted('update:modelValue')).toEqual([
      [['cat', 'dog']],
      [['cat', 'dog', 'bird']],
      [['dog', 'bird']],
    ]);
  });

  it('keeps disabled options navigable while suppressing selection and consumer clicks', async () => {
    const onClick = vi.fn();
    const wrapper = mountListbox(
      `
        <Listbox aria-label="Disabled navigation">
          <Option value="cat">Cat</Option>
          <Option value="dog" disabled @click="onClick">Dog</Option>
          <Option value="bird">Bird</Option>
        </Listbox>
      `,
      undefined,
      { onClick },
    );
    const root = wrapper.get('.fui-Listbox');
    const options = wrapper.findAll('.fui-Option');

    await nextTick();
    expect(root.attributes('aria-activedescendant')).toBe(options[0]?.attributes('id'));
    await root.trigger('keydown', { key: 'ArrowDown' });
    expect(root.attributes('aria-activedescendant')).toBe(options[1]?.attributes('id'));
    await root.trigger('keydown', { key: 'Enter' });
    expect(wrapper.getComponent(Listbox).emitted('update:modelValue')).toBeUndefined();
    await options[1]?.trigger('click');
    expect(onClick).not.toHaveBeenCalled();
  });

  it('supports Arrow, range, Enter, and Space active-descendant behavior', async () => {
    const wrapper = mountListbox(`
      <Listbox aria-label="Keyboard choices">
        <Option value="one">One</Option>
        <Option value="two">Two</Option>
        <Option value="three">Three</Option>
      </Listbox>
    `);
    const root = wrapper.get('.fui-Listbox');
    const options = wrapper.findAll('.fui-Option');

    await nextTick();
    await root.trigger('keydown', { key: 'End' });
    expect(root.attributes('aria-activedescendant')).toBe(options[2]?.attributes('id'));
    await root.trigger('keydown', { key: 'PageUp' });
    expect(root.attributes('aria-activedescendant')).toBe(options[0]?.attributes('id'));
    await root.trigger('keydown', { key: 'ArrowDown' });
    expect(root.attributes('aria-activedescendant')).toBe(options[1]?.attributes('id'));
    await root.trigger('keydown', { key: 'Enter' });
    await nextTick();
    expect(options[1]?.attributes('aria-selected')).toBe('true');
    await root.trigger('keydown', { key: ' ' });
    expect(wrapper.getComponent(Listbox).emitted('optionSelect')).toHaveLength(2);
  });

  it('auto-activates a selected single option and supports disabling autofocus', async () => {
    const selected = mountListbox(`
      <Listbox :default-selected-options="['two']">
        <Option value="one">One</Option>
        <Option value="two">Two</Option>
      </Listbox>
    `);
    const disabled = mountListbox(`
      <Listbox disable-auto-focus>
        <Option value="one">One</Option>
      </Listbox>
    `);

    await nextTick();
    expect(selected.get('.fui-Listbox').attributes('aria-activedescendant')).toBe(
      selected.findAll('.fui-Option')[1]?.attributes('id'),
    );
    expect(disabled.get('.fui-Listbox').attributes('aria-activedescendant')).toBeUndefined();
  });

  it('derives reactive text and value from option content while honoring explicit empty values', async () => {
    const onSelect = vi.fn();
    const wrapper = mountListbox(
      `
        <Listbox @option-select="onSelect">
          <Option>{{ label }}</Option>
          <Option value="" text="Empty value"><strong>Rich text</strong></Option>
          <Option>
            <template #check-icon>Decorative</template>
            Cat
          </Option>
        </Listbox>
      `,
      () => ({ label: 'Plain text' }),
      { onSelect },
    );
    const options = wrapper.findAll('.fui-Option');

    await options[0]?.trigger('click');
    (wrapper.vm as unknown as { label: string }).label = 'Updated text';
    await nextTick();
    await options[0]?.trigger('click');
    await options[1]?.trigger('click');
    await options[2]?.trigger('click');
    expect(onSelect.mock.calls[0]?.[1]).toMatchObject({
      optionText: 'Plain text',
      optionValue: 'Plain text',
    });
    expect(onSelect.mock.calls[1]?.[1]).toMatchObject({
      optionText: 'Updated text',
      optionValue: 'Updated text',
    });
    expect(onSelect.mock.calls[2]?.[1]).toMatchObject({
      optionText: 'Empty value',
      optionValue: '',
    });
    expect(onSelect.mock.calls[3]?.[1]).toMatchObject({
      optionText: 'Cat',
      optionValue: 'Cat',
    });
  });

  it('allows consumer handlers to cancel option selection and root keyboard behavior', async () => {
    const onClick = vi.fn((event: MouseEvent) => event.preventDefault());
    const onKeydown = vi.fn((event: KeyboardEvent) => event.preventDefault());
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    const onPointerdown = vi.fn();
    const wrapper = mountListbox(
      `
        <Listbox
          @keydown="onKeydown"
          @focus="onFocus"
          @blur="onBlur"
          @pointerdown="onPointerdown"
        >
          <Option value="cat">Cat</Option>
          <Option value="dog" @click="onClick">Dog</Option>
        </Listbox>
      `,
      undefined,
      { onBlur, onClick, onFocus, onKeydown, onPointerdown },
    );
    const root = wrapper.get('.fui-Listbox');
    const options = wrapper.findAll('.fui-Option');

    await nextTick();
    const initialActive = root.attributes('aria-activedescendant');
    await options[1]?.trigger('click');
    expect(onClick).toHaveBeenCalledOnce();
    expect(wrapper.getComponent(Listbox).emitted('update:modelValue')).toBeUndefined();
    expect(root.attributes('aria-activedescendant')).toBe(initialActive);

    await root.trigger('keydown', { key: 'ArrowDown' });
    expect(onKeydown).toHaveBeenCalledOnce();
    expect(root.attributes('aria-activedescendant')).toBe(initialActive);
    await root.trigger('pointerdown');
    await root.trigger('focus');
    await root.trigger('blur');
    expect(onPointerdown).toHaveBeenCalledOnce();
    expect(onFocus).toHaveBeenCalledOnce();
    expect(onBlur).toHaveBeenCalledOnce();
  });

  it('renders groups, label relationships, separators, and custom check content', () => {
    const wrapper = mountListbox(`
      <Listbox multiselect aria-label="Grouped animals">
        <OptionGroup label="Land animals">
          <Option value="cat">
            <template #check-icon="state"><span class="custom-check">{{ state.selected }}</span></template>
            Cat
          </Option>
        </OptionGroup>
        <OptionGroup aria-label="Water animals">
          <Option value="fish">Fish</Option>
        </OptionGroup>
      </Listbox>
    `);
    const groups = wrapper.findAll('.fui-OptionGroup');
    const label = groups[0]?.get('.fui-OptionGroup__label');

    expect(groups[0]?.attributes('role')).toBe('group');
    expect(groups[0]?.attributes('aria-labelledby')).toBe(label?.attributes('id'));
    expect(label?.attributes('role')).toBe('presentation');
    expect(label?.text()).toBe('Land animals');
    expect(groups[1]?.attributes('aria-label')).toBe('Water animals');
    expect(groups[1]?.attributes('aria-labelledby')).toBeUndefined();
    expect(wrapper.get('.custom-check').text()).toBe('false');
  });

  it('integrates with Field labeling, descriptions, required, invalid, attrs, and exposed focus', async () => {
    const wrapper = mountListbox(`
      <Field
        label="Companion"
        hint="Choose one."
        required
        validation-state="error"
        validation-message="Choose a valid companion."
      >
        <Listbox class="field-listbox" data-track="field">
          <Option value="cat">Cat</Option>
        </Listbox>
      </Field>
    `);
    document.body.appendChild(wrapper.element);
    const listbox = wrapper.get<HTMLElement>('.fui-Listbox');

    expect(listbox.attributes('aria-labelledby')).toMatch(/^fui-field-.+__label$/);
    expect(listbox.attributes('aria-describedby')).toMatch(
      /^fui-field-.+__validation-message fui-field-.+__hint$/,
    );
    expect(listbox.attributes('aria-required')).toBe('true');
    expect(listbox.attributes('aria-invalid')).toBe('true');
    expect(listbox.attributes('data-track')).toBe('field');
    listbox.element.focus();
    await nextTick();
    expect(document.activeElement).toBe(listbox.element);
    wrapper.unmount();
  });

  it('updates registration when dynamic DOM order changes', async () => {
    const Host = defineComponent({
      data: () => ({ reversed: false }),
      render() {
        const values = this.reversed ? ['three', 'two', 'one'] : ['one', 'two', 'three'];
        return h(
          Listbox,
          { 'aria-label': 'Dynamic choices' },
          { default: () => values.map((value) => h(Option, { key: value, value }, () => value)) },
        );
      },
    });
    const wrapper = mount(Host);
    const root = wrapper.get('.fui-Listbox');

    await nextTick();
    await root.trigger('keydown', { key: 'End' });
    expect(root.attributes('aria-activedescendant')).toBe(
      wrapper.findAll('.fui-Option')[2]?.attributes('id'),
    );
    wrapper.vm.reversed = true;
    await nextTick();
    await root.trigger('keydown', { key: 'Home' });
    expect(root.attributes('aria-activedescendant')).toBe(
      wrapper.findAll('.fui-Option')[0]?.attributes('id'),
    );
  });
});
