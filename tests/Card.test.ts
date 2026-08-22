import { mount } from '@vue/test-utils';
import { defineComponent, nextTick, ref } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Card from '../src/components/Card/Card.vue';
import CardFooter from '../src/components/CardFooter/CardFooter.vue';
import CardHeader from '../src/components/CardHeader/CardHeader.vue';
import CardPreview from '../src/components/CardPreview/CardPreview.vue';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('FCard', () => {
  it('renders the upstream defaults and semantic group root', () => {
    const wrapper = mount(Card, { slots: { default: 'Card content' } });

    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.attributes('role')).toBe('group');
    expect(wrapper.attributes('tabindex')).toBeUndefined();
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'fui-Card',
        'fui-Card--filled',
        'fui-Card--vertical',
        'fui-Card--medium',
      ]),
    );
    expect(wrapper.text()).toBe('Card content');
  });

  it.each(['filled', 'filled-alternative', 'outline', 'subtle'] as const)(
    'supports the %s appearance',
    (appearance) => {
      expect(mount(Card, { props: { appearance } }).classes()).toContain(`fui-Card--${appearance}`);
    },
  );

  it.each(['vertical', 'horizontal'] as const)('supports %s orientation', (orientation) => {
    expect(mount(Card, { props: { orientation } }).classes()).toContain(`fui-Card--${orientation}`);
  });

  it.each(['small', 'medium', 'large'] as const)('supports the %s size', (size) => {
    expect(mount(Card, { props: { size } }).classes()).toContain(`fui-Card--${size}`);
  });

  it('uses semantic native roots when not selectable', () => {
    expect(mount(Card, { props: { as: 'article' } }).element.tagName).toBe('ARTICLE');
    expect(mount(Card, { props: { as: 'section' } }).element.tagName).toBe('SECTION');
    const button = mount(Card, { props: { as: 'button' } });
    expect(button.element.tagName).toBe('BUTTON');
    expect(button.attributes('type')).toBe('button');
    const anchor = mount(Card, { props: { as: 'a' }, attrs: { href: '/item' } });
    expect(anchor.element.tagName).toBe('A');
    expect(anchor.attributes('href')).toBe('/item');
  });

  it('makes interactive cards focusable by default and respects focusMode off', async () => {
    const wrapper = mount(Card, { attrs: { onClick: vi.fn() } });
    expect(wrapper.attributes('tabindex')).toBe('0');
    expect(wrapper.classes()).toContain('fui-Card--interactive');

    await wrapper.setProps({ focusMode: 'off' });
    expect(wrapper.attributes('tabindex')).toBeUndefined();
  });

  it.each(['no-tab', 'tab-exit', 'tab-only'] as const)(
    'makes nonselectable cards focusable for %s focus mode',
    (focusMode) => {
      expect(mount(Card, { props: { focusMode } }).attributes('tabindex')).toBe('0');
    },
  );

  it('emits click exactly once and preserves preventDefault', async () => {
    const onClick = vi.fn((event: MouseEvent) => event.preventDefault());
    const wrapper = mount(Card, { attrs: { onClick } });

    await wrapper.trigger('click');

    expect(onClick).toHaveBeenCalledOnce();
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('supports uncontrolled selection with click, Enter and hidden checkbox semantics', async () => {
    const wrapper = mount(Card, {
      attachTo: document.body,
      props: { defaultSelected: true },
      slots: { default: '<span>Selectable</span>' },
    });
    const checkbox = wrapper.get('input[type="checkbox"]');

    expect(wrapper.element.tagName).toBe('DIV');
    expect((checkbox.element as HTMLInputElement).checked).toBe(true);
    expect(wrapper.classes()).toContain('fui-Card--selected');

    await wrapper.trigger('click');
    expect((checkbox.element as HTMLInputElement).checked).toBe(false);
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]]);
    expect(wrapper.emitted('selectionChange')?.[0]?.[1]).toEqual({ selected: false });

    await wrapper.trigger('keydown', { key: 'Enter' });
    expect((checkbox.element as HTMLInputElement).checked).toBe(true);
    expect(wrapper.emitted('update:modelValue')).toEqual([[false], [true]]);
    wrapper.unmount();
  });

  it('supports controlled selection and treats explicitly bound undefined as controlled', async () => {
    const wrapper = mount(Card, { props: { modelValue: true } });
    const checkbox = wrapper.get('input[type="checkbox"]');

    await wrapper.trigger('click');
    await nextTick();
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]]);
    expect((checkbox.element as HTMLInputElement).checked).toBe(true);
    expect(wrapper.classes()).toContain('fui-Card--selected');

    await wrapper.setProps({ modelValue: undefined });
    expect((checkbox.element as HTMLInputElement).checked).toBe(false);
    await wrapper.trigger('click');
    await nextTick();
    expect(wrapper.emitted('update:modelValue')).toEqual([[false], [true]]);
    expect((checkbox.element as HTMLInputElement).checked).toBe(false);
  });

  it('ignores later defaultSelected changes in uncontrolled mode', async () => {
    const wrapper = mount(Card, { props: { defaultSelected: false } });
    await wrapper.setProps({ defaultSelected: true });
    expect((wrapper.get('input').element as HTMLInputElement).checked).toBe(false);
  });

  it('supports direct native checkbox changes without duplicate selection', async () => {
    const wrapper = mount(Card, { props: { defaultSelected: false } });
    const checkbox = wrapper.get('input');
    checkbox.element.checked = true;
    await checkbox.trigger('change');

    expect(wrapper.emitted('update:modelValue')).toEqual([[true]]);
    expect(wrapper.emitted('selectionChange')).toHaveLength(1);
    expect(wrapper.classes()).toContain('fui-Card--selected');
  });

  it('routes native form attributes to the hidden checkbox and resets uncontrolled state', async () => {
    const wrapper = mount(
      {
        components: { Card },
        template: `
        <form>
          <Card default-selected name="chosen-card" value="report" required>Report</Card>
          <button type="reset">Reset</button>
        </form>
      `,
      },
      { attachTo: document.body },
    );
    const card = wrapper.get('.fui-Card');
    const checkbox = wrapper.get('input');
    const form = wrapper.get('form').element as HTMLFormElement;

    expect(checkbox.attributes('name')).toBe('chosen-card');
    expect(checkbox.attributes('value')).toBe('report');
    expect(checkbox.attributes('required')).toBeDefined();
    expect(Object.fromEntries(new FormData(form))).toEqual({ 'chosen-card': 'report' });

    await card.trigger('click');
    expect((checkbox.element as HTMLInputElement).checked).toBe(false);
    form.reset();
    await new Promise((resolve) => setTimeout(resolve));
    expect((checkbox.element as HTMLInputElement).checked).toBe(true);
    expect(card.classes()).toContain('fui-Card--selected');
    wrapper.unmount();
  });

  it('reapplies controlled state after native form reset', async () => {
    const wrapper = mount(
      {
        components: { Card },
        template: '<form><Card :model-value="false" name="chosen-card">Report</Card></form>',
      },
      { attachTo: document.body },
    );
    const checkbox = wrapper.get('input').element as HTMLInputElement;
    checkbox.defaultChecked = true;
    (wrapper.get('form').element as HTMLFormElement).reset();
    await new Promise((resolve) => setTimeout(resolve));
    expect(checkbox.checked).toBe(false);
    wrapper.unmount();
  });

  it('does not toggle selection from nested interactive descendants', async () => {
    const wrapper = mount(Card, {
      props: { defaultSelected: false },
      slots: {
        default: '<button data-inner>Inner action</button><a href="#x">Inner link</a>',
      },
    });

    await wrapper.get('[data-inner]').trigger('click');
    await wrapper.get('a').trigger('click');

    expect(wrapper.emitted('selectionChange')).toBeUndefined();
    expect((wrapper.get('input').element as HTMLInputElement).checked).toBe(false);
  });

  it('renders floating action before content and omits the internal checkbox', async () => {
    const action = vi.fn();
    const wrapper = mount(Card, {
      props: { defaultSelected: false },
      slots: {
        'floating-action': '<button data-action>Choose</button>',
        default: '<span data-content>Content</span>',
      },
    });
    wrapper.get('[data-action]').element.addEventListener('click', action);

    expect(wrapper.find('input').exists()).toBe(false);
    expect(wrapper.element.firstElementChild?.classList).toContain('fui-Card__floatingAction');
    expect(wrapper.element.lastElementChild?.hasAttribute('data-content')).toBe(true);
    await wrapper.get('[data-action]').trigger('click');
    expect(action).toHaveBeenCalledOnce();
    expect(wrapper.emitted('selectionChange')).toBeUndefined();
  });

  it('derives the selection checkbox name from CardHeader content', async () => {
    const wrapper = mount({
      components: { Card, CardHeader },
      data: () => ({ selected: false }),
      template: `
        <Card v-model="selected">
          <CardHeader>
            <template #header><h3 id="card-title">Quarterly report</h3></template>
          </CardHeader>
        </Card>
      `,
    });
    await nextTick();

    expect(wrapper.get('input').attributes('aria-labelledby')).toBe('card-title');
    expect(wrapper.get('input').attributes('aria-label')).toBeUndefined();
  });

  it('generates a deterministic header wrapper id when the header child lacks one', async () => {
    const wrapper = mount({
      components: { Card, CardHeader },
      data: () => ({ selected: false }),
      template: `
        <Card v-model="selected">
          <CardHeader><template #header>Quarterly report</template></CardHeader>
        </Card>
      `,
    });
    await nextTick();
    const headerId = wrapper.get('.fui-CardHeader__header').attributes('id');

    expect(headerId).toMatch(/^fui-CardHeader__header-/);
    expect(wrapper.get('input').attributes('aria-labelledby')).toBe(headerId);
  });

  it('derives the selection checkbox label from the preview image', async () => {
    const wrapper = mount({
      components: { Card, CardPreview },
      data: () => ({ selected: false }),
      template: `
        <Card v-model="selected">
          <CardPreview><img src="preview.png" alt="Sales presentation preview" /></CardPreview>
        </Card>
      `,
    });
    await nextTick();

    expect(wrapper.get('input').attributes('aria-label')).toBe('Sales presentation preview');
  });

  it('prefers preview aria-describedby as the selection checkbox reference', async () => {
    const wrapper = mount({
      components: { Card, CardPreview },
      data: () => ({ selected: false }),
      template: `
        <Card v-model="selected">
          <CardPreview><img src="preview.png" aria-describedby="preview-description" /></CardPreview>
          <p id="preview-description">Sales presentation</p>
        </Card>
      `,
    });
    await nextTick();

    expect(wrapper.get('input').attributes('aria-labelledby')).toBe('preview-description');
  });

  it('suppresses click, keyboard, selection and focusability while disabled', async () => {
    const onClick = vi.fn();
    const wrapper = mount(Card, {
      props: { disabled: true, defaultSelected: false },
      attrs: { onClick },
    });
    const checkbox = wrapper.get('input');

    expect(wrapper.attributes('aria-disabled')).toBe('true');
    expect(wrapper.attributes('tabindex')).toBeUndefined();
    expect(checkbox.attributes('disabled')).toBeDefined();
    await wrapper.trigger('click');
    await wrapper.trigger('keydown', { key: 'Enter' });

    expect(onClick).not.toHaveBeenCalled();
    expect(wrapper.emitted('click')).toBeUndefined();
    expect(wrapper.emitted('selectionChange')).toBeUndefined();
  });

  it('routes root attrs, classes and styles while protecting managed state', () => {
    const wrapper = mount(Card, {
      props: { disabled: true },
      attrs: {
        id: 'report-card',
        class: 'custom-card',
        style: 'inline-size: 20rem;',
        role: 'listitem',
        tabindex: '3',
        href: '/wrong',
        type: 'submit',
        'aria-disabled': 'false',
        'aria-selected': 'true',
        'data-track': 'report',
      },
    });

    expect(wrapper.attributes('id')).toBe('report-card');
    expect(wrapper.classes()).toContain('custom-card');
    expect(wrapper.attributes('style')).toContain('inline-size: 20rem');
    expect(wrapper.attributes('role')).toBe('listitem');
    expect(wrapper.attributes('tabindex')).toBeUndefined();
    expect(wrapper.attributes('href')).toBeUndefined();
    expect(wrapper.attributes('type')).toBeUndefined();
    expect(wrapper.attributes('aria-disabled')).toBe('true');
    expect(wrapper.attributes('aria-selected')).toBeUndefined();
    expect(wrapper.attributes('data-track')).toBe('report');
  });

  it.each(['no-tab', 'tab-exit', 'tab-only'] as const)(
    'moves focus inside and returns it with Escape for %s mode',
    async (focusMode) => {
      const wrapper = mount(Card, {
        attachTo: document.body,
        props: { focusMode },
        slots: { default: '<button data-first>First</button><button data-last>Last</button>' },
      });
      await wrapper.trigger('focus');
      await wrapper.trigger('keydown', { key: 'Enter' });
      expect(document.activeElement).toBe(wrapper.get('[data-first]').element);
      await wrapper.get('[data-first]').trigger('keydown', { key: 'Escape' });
      expect(document.activeElement).toBe(wrapper.element);
      wrapper.unmount();
    },
  );

  it('cycles Tab inside no-tab mode', async () => {
    const wrapper = mount(Card, {
      attachTo: document.body,
      props: { focusMode: 'no-tab' },
      slots: { default: '<button data-first>First</button><button data-last>Last</button>' },
    });
    await wrapper.trigger('focus');
    await wrapper.trigger('keydown', { key: 'Enter' });
    (wrapper.get('[data-last]').element as HTMLElement).focus();
    await wrapper.get('[data-last]').trigger('keydown', { key: 'Tab' });
    expect(document.activeElement).toBe(wrapper.get('[data-first]').element);
    wrapper.unmount();
  });

  it('exposes the native root and focus method', async () => {
    const card = ref<InstanceType<typeof Card> | null>(null);
    const Host = defineComponent({
      components: { Card },
      setup: () => ({ card }),
      template: '<Card ref="card" focus-mode="tab-only">Focusable</Card>',
    });
    const wrapper = mount(Host, { attachTo: document.body });
    await nextTick();
    const root = wrapper.get('.fui-Card').element as HTMLElement;
    const focus = vi.spyOn(root, 'focus');

    expect(card.value?.element).toBe(root);
    card.value?.focus();
    expect(focus).toHaveBeenCalledOnce();
    wrapper.unmount();
  });

  it('composes preview, header and footer in public DOM order', () => {
    const wrapper = mount({
      components: { Card, CardPreview, CardHeader, CardFooter },
      template: `
        <Card>
          <CardPreview><img alt="Preview" /></CardPreview>
          <CardHeader><template #header>Title</template></CardHeader>
          <p>Body</p>
          <CardFooter>Open</CardFooter>
        </Card>
      `,
    });
    const children = Array.from(wrapper.get('.fui-Card').element.children).map(
      (element) => element.className || element.tagName,
    );

    expect(children).toEqual(['fui-CardPreview', 'fui-CardHeader', 'P', 'fui-CardFooter']);
  });
});
