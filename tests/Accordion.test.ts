import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { describe, expect, it } from 'vitest';
import Accordion from '../src/components/Accordion/Accordion.vue';
import AccordionHeader from '../src/components/AccordionHeader/AccordionHeader.vue';
import AccordionItem from '../src/components/AccordionItem/AccordionItem.vue';
import AccordionPanel from '../src/components/AccordionPanel/AccordionPanel.vue';

const components = { Accordion, AccordionItem, AccordionHeader, AccordionPanel };

function mountAccordion(template: string, data?: () => Record<string, unknown>) {
  return mount({ components, data, template });
}

describe('FAccordion family', () => {
  it('renders semantic disclosure relationships and upstream defaults', () => {
    const wrapper = mountAccordion(`
      <Accordion>
        <AccordionItem value="one">
          <AccordionHeader>First</AccordionHeader>
          <AccordionPanel>First panel</AccordionPanel>
        </AccordionItem>
      </Accordion>
    `);
    const button = wrapper.get('button');

    expect(wrapper.get('.fui-Accordion').element.tagName).toBe('DIV');
    expect(button.attributes('type')).toBe('button');
    expect(button.attributes('aria-expanded')).toBe('false');
    expect(button.attributes('aria-controls')).toMatch(/^fui-accordion-panel-/);
    expect(wrapper.find('[role="region"]').exists()).toBe(false);
  });

  it('opens a single item and prevents collapsing the final item by default', async () => {
    const wrapper = mountAccordion(`
      <Accordion>
        <AccordionItem value="one"><AccordionHeader>First</AccordionHeader><AccordionPanel>One</AccordionPanel></AccordionItem>
        <AccordionItem value="two"><AccordionHeader>Second</AccordionHeader><AccordionPanel>Two</AccordionPanel></AccordionItem>
      </Accordion>
    `);
    const buttons = wrapper.findAll('button');

    await buttons[0]?.trigger('click');
    expect(buttons[0]?.attributes('aria-expanded')).toBe('true');
    expect(wrapper.get('[role="region"]').text()).toBe('One');
    expect(wrapper.get('[role="region"]').attributes('aria-labelledby')).toBe(
      buttons[0]?.attributes('id'),
    );

    await buttons[0]?.trigger('click');
    expect(buttons[0]?.attributes('aria-expanded')).toBe('true');

    await buttons[1]?.trigger('click');
    expect(buttons[0]?.attributes('aria-expanded')).toBe('false');
    expect(buttons[1]?.attributes('aria-expanded')).toBe('true');
    expect(wrapper.get('[role="region"]').text()).toBe('Two');
  });

  it('supports collapsible multiple uncontrolled state and emits one update per action', async () => {
    const wrapper = mountAccordion(`
      <Accordion multiple collapsible :default-open-items="['one']">
        <AccordionItem value="one"><AccordionHeader>First</AccordionHeader><AccordionPanel>One</AccordionPanel></AccordionItem>
        <AccordionItem value="two"><AccordionHeader>Second</AccordionHeader><AccordionPanel>Two</AccordionPanel></AccordionItem>
      </Accordion>
    `);
    const accordion = wrapper.getComponent(Accordion);
    const buttons = wrapper.findAll('button');

    expect(wrapper.findAll('[role="region"]')).toHaveLength(1);
    await buttons[1]?.trigger('click');
    expect(wrapper.findAll('[role="region"]')).toHaveLength(2);
    expect(accordion.emitted('update:modelValue')).toEqual([[['one', 'two']]]);
    expect(accordion.emitted('toggle')?.[0]?.[1]).toEqual({
      value: 'two',
      openItems: ['one', 'two'],
    });

    await buttons[0]?.trigger('click');
    expect(wrapper.findAll('[role="region"]')).toHaveLength(1);
    expect(accordion.emitted('update:modelValue')).toEqual([[['one', 'two']], [['two']]]);
  });

  it('supports controlled state and explicitly bound undefined', async () => {
    const wrapper = mountAccordion(
      `
      <Accordion :model-value="openItems">
        <AccordionItem value="one"><AccordionHeader>First</AccordionHeader><AccordionPanel>One</AccordionPanel></AccordionItem>
      </Accordion>
    `,
      () => ({ openItems: ['one'] as string[] | undefined }),
    );
    const accordion = wrapper.getComponent(Accordion);
    const button = wrapper.get('button');

    await button.trigger('click');
    expect(button.attributes('aria-expanded')).toBe('true');
    expect(accordion.emitted('update:modelValue')).toBeUndefined();

    await wrapper.setData({ openItems: undefined });
    expect(button.attributes('aria-expanded')).toBe('false');
    await button.trigger('click');
    expect(accordion.emitted('update:modelValue')).toEqual([[['one']]]);
    expect(button.attributes('aria-expanded')).toBe('false');
  });

  it('respects consumer click cancellation and disabled items', async () => {
    const wrapper = mountAccordion(`
      <Accordion collapsible>
        <AccordionItem value="one"><AccordionHeader @click.prevent>Cancelled</AccordionHeader><AccordionPanel>One</AccordionPanel></AccordionItem>
        <AccordionItem value="two" disabled><AccordionHeader>Disabled</AccordionHeader><AccordionPanel>Two</AccordionPanel></AccordionItem>
      </Accordion>
    `);
    const buttons = wrapper.findAll('button');

    await buttons[0]?.trigger('click');
    expect(buttons[0]?.attributes('aria-expanded')).toBe('false');
    expect(buttons[1]?.attributes('disabled')).toBeDefined();
    await buttons[1]?.trigger('click');
    expect(wrapper.find('[role="region"]').exists()).toBe(false);
  });

  it('makes the only required-open header focusable disabled', async () => {
    const wrapper = mountAccordion(`
      <Accordion default-open-items="one">
        <AccordionItem value="one"><AccordionHeader>Required open</AccordionHeader><AccordionPanel>One</AccordionPanel></AccordionItem>
      </Accordion>
    `);
    const button = wrapper.get('button');

    expect(button.attributes('disabled')).toBeUndefined();
    expect(button.attributes('aria-disabled')).toBe('true');
    await button.trigger('click');
    expect(button.attributes('aria-expanded')).toBe('true');
  });

  it('renders heading roots, sizes, positions, slots and routed attrs', () => {
    const wrapper = mountAccordion(`
      <Accordion>
        <AccordionItem value="one">
          <AccordionHeader as="h3" size="large" expand-icon-position="end" inline class="custom" data-track="header">
            <template #icon><span data-icon>Info</span></template>
            <template #expand-icon="{ open }"><span data-expand>{{ open }}</span></template>
            Details
          </AccordionHeader>
        </AccordionItem>
      </Accordion>
    `);
    const header = wrapper.get('.fui-AccordionHeader');

    expect(header.element.tagName).toBe('H3');
    expect(header.classes()).toEqual(
      expect.arrayContaining([
        'fui-AccordionHeader--large',
        'fui-AccordionHeader--expand-end',
        'fui-AccordionHeader--inline',
        'custom',
      ]),
    );
    expect(header.attributes('data-track')).toBe('header');
    expect(wrapper.get('[data-icon]').text()).toBe('Info');
    expect(wrapper.get('[data-expand]').text()).toBe('false');
  });

  it('supports deprecated linear and circular arrow navigation without changing Tab order', async () => {
    const wrapper = mountAccordion(
      `
      <Accordion navigation="circular">
        <AccordionItem value="one"><AccordionHeader>First</AccordionHeader></AccordionItem>
        <AccordionItem value="two"><AccordionHeader>Second</AccordionHeader></AccordionItem>
      </Accordion>
    `,
      undefined,
    );
    document.body.appendChild(wrapper.element);
    const buttons = wrapper.findAll('button');
    (buttons[0]?.element as HTMLButtonElement).focus();
    await buttons[0]?.trigger('keydown', { key: 'ArrowUp' });
    expect(document.activeElement).toBe(buttons[1]?.element);
    await buttons[1]?.trigger('keydown', { key: 'ArrowDown' });
    expect(document.activeElement).toBe(buttons[0]?.element);
    wrapper.unmount();
  });

  it('keeps generated ids stable across reactive updates', async () => {
    const wrapper = mountAccordion(`
      <Accordion collapsible>
        <AccordionItem value="one"><AccordionHeader>First</AccordionHeader><AccordionPanel>One</AccordionPanel></AccordionItem>
      </Accordion>
    `);
    const button = wrapper.get('button');
    const controls = button.attributes('aria-controls');
    await button.trigger('click');
    await nextTick();
    expect(button.attributes('aria-controls')).toBe(controls);
    expect(wrapper.get('[role="region"]').attributes('id')).toBe(controls);
  });
});
