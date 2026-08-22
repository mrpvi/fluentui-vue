import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import Link from '../src/components/Link/Link.vue';

describe('FLink', () => {
  it('renders a native button with upstream defaults when href is absent', () => {
    const wrapper = mount(Link, { slots: { default: 'Open details' } });
    const button = wrapper.get('button');

    expect(button.attributes('type')).toBe('button');
    expect(button.classes()).toContain('fui-Link');
    expect(button.classes()).toContain('fui-Link--default');
    expect(button.text()).toBe('Open details');
  });

  it('selects anchors from truthy href and respects explicit root precedence', () => {
    const anchor = mount(Link, {
      props: { href: '/docs' },
      slots: { default: 'Docs' },
    });
    const explicitButton = mount(Link, {
      props: { as: 'button', href: '/docs' },
    });
    const explicitAnchor = mount(Link, {
      props: { as: 'a' },
    });

    expect(anchor.get('a').attributes('href')).toBe('/docs');
    expect(explicitButton.get('button').attributes('href')).toBeUndefined();
    expect(explicitAnchor.get('a').attributes('href')).toBeUndefined();
  });

  it('treats an empty href as falsy like the upstream implementation', () => {
    const wrapper = mount(Link, { props: { href: '' } });

    expect(wrapper.element.tagName).toBe('BUTTON');
  });

  it('renders spans with button semantics and preserves an explicit role', () => {
    const automatic = mount(Link, { props: { as: 'span' } });
    const explicit = mount(Link, {
      props: { as: 'span' },
      attrs: { role: 'menuitem' },
    });

    expect(automatic.get('span').attributes('role')).toBe('button');
    expect(automatic.get('span').attributes('tabindex')).toBe('0');
    expect(explicit.get('span').attributes('role')).toBe('menuitem');
  });

  it('applies appearance and inline classes', () => {
    const wrapper = mount(Link, {
      props: { appearance: 'subtle', inline: true },
    });

    expect(wrapper.classes()).toContain('fui-Link--subtle');
    expect(wrapper.classes()).toContain('fui-Link--inline');
  });

  it('forwards root attributes, class, and style', () => {
    const wrapper = mount(Link, {
      props: { href: '/download' },
      attrs: {
        id: 'download',
        class: 'custom-link',
        style: 'white-space: nowrap;',
        target: '_blank',
        rel: 'noreferrer',
        download: 'guide.pdf',
        hreflang: 'en',
        referrerpolicy: 'no-referrer',
        'aria-label': 'Download guide',
        'data-track': 'guide',
      },
    });

    const anchor = wrapper.get('a');
    expect(anchor.attributes('id')).toBe('download');
    expect(anchor.classes()).toContain('custom-link');
    expect(anchor.attributes('style')).toContain('white-space: nowrap');
    expect(anchor.attributes('target')).toBe('_blank');
    expect(anchor.attributes('rel')).toBe('noreferrer');
    expect(anchor.attributes('download')).toBe('guide.pdf');
    expect(anchor.attributes('hreflang')).toBe('en');
    expect(anchor.attributes('referrerpolicy')).toBe('no-referrer');
    expect(anchor.attributes('aria-label')).toBe('Download guide');
    expect(anchor.attributes('data-track')).toBe('guide');
  });

  it('preserves explicit button type, role, and tab index', () => {
    const wrapper = mount(Link, {
      props: { as: 'button' },
      attrs: {
        type: 'submit',
        role: 'menuitem',
        tabindex: -1,
      },
    });

    const button = wrapper.get('button');
    expect(button.attributes('type')).toBe('submit');
    expect(button.attributes('role')).toBe('menuitem');
    expect(button.attributes('tabindex')).toBe('-1');
  });

  it('emits one native click for enabled roots', async () => {
    const wrapper = mount(Link);

    await wrapper.trigger('click');

    expect(wrapper.emitted('click')).toHaveLength(1);
    expect(wrapper.emitted('click')?.[0]?.[0]).toBeInstanceOf(MouseEvent);
  });

  it('implements disabled and disabledFocusable button behavior', async () => {
    const disabled = mount(Link, { props: { disabled: true } });
    const focusable = mount(Link, { props: { disabledFocusable: true } });

    const disabledButton = disabled.get('button');
    const focusableButton = focusable.get('button');

    expect(disabledButton.attributes('disabled')).toBeDefined();
    expect(disabledButton.attributes('aria-disabled')).toBe('true');
    expect(disabledButton.classes()).toContain('fui-Link--disabled');
    expect(focusableButton.attributes('disabled')).toBeUndefined();
    expect(focusableButton.attributes('aria-disabled')).toBe('true');
    expect(focusableButton.classes()).toContain('fui-Link--disabled-focusable');

    await disabledButton.trigger('click');
    await focusableButton.trigger('click');
    expect(disabled.emitted('click')).toBeUndefined();
    expect(focusable.emitted('click')).toBeUndefined();
  });

  it('implements disabled and disabledFocusable anchor behavior', () => {
    const disabled = mount(Link, {
      props: { href: '/docs', disabled: true },
    });
    const focusable = mount(Link, {
      props: { href: '/docs', disabledFocusable: true },
    });
    const explicitRole = mount(Link, {
      props: { href: '/docs', disabled: true },
      attrs: { role: 'menuitem' },
    });

    const disabledAnchor = disabled.get('a');
    expect(disabledAnchor.attributes('href')).toBeUndefined();
    expect(disabledAnchor.attributes('role')).toBe('link');
    expect(disabledAnchor.attributes('tabindex')).toBeUndefined();
    expect(disabledAnchor.attributes('aria-disabled')).toBe('true');

    const focusableAnchor = focusable.get('a');
    expect(focusableAnchor.attributes('href')).toBe('/docs');
    expect(focusableAnchor.attributes('role')).toBe('link');
    expect(focusableAnchor.attributes('tabindex')).toBe('0');
    expect(focusableAnchor.attributes('aria-disabled')).toBe('true');

    expect(explicitRole.get('a').attributes('role')).toBe('menuitem');
  });

  it('implements disabled and disabledFocusable span behavior', () => {
    const disabled = mount(Link, {
      props: { as: 'span', disabled: true },
    });
    const focusable = mount(Link, {
      props: { as: 'span', disabledFocusable: true },
    });

    expect(disabled.get('span').attributes('role')).toBe('button');
    expect(disabled.get('span').attributes('tabindex')).toBeUndefined();
    expect(disabled.get('span').attributes('aria-disabled')).toBe('true');
    expect(focusable.get('span').attributes('role')).toBe('button');
    expect(focusable.get('span').attributes('tabindex')).toBe('0');
    expect(focusable.get('span').attributes('aria-disabled')).toBe('true');
  });

  it('preserves explicit anchor and span tab indexes', () => {
    const anchor = mount(Link, {
      props: { href: '/docs' },
      attrs: { tabindex: -1 },
    });
    const span = mount(Link, {
      props: { as: 'span' },
      attrs: { tabindex: 2 },
    });

    expect(anchor.get('a').attributes('tabindex')).toBe('-1');
    expect(span.get('span').attributes('tabindex')).toBe('2');
  });

  it('prevents disabled clicks without stopping propagation', () => {
    const wrapper = mount(Link, { props: { disabledFocusable: true } });
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    const stopPropagation = vi.spyOn(event, 'stopPropagation');

    wrapper.element.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(stopPropagation).not.toHaveBeenCalled();
    expect(wrapper.emitted('click')).toBeUndefined();
  });

  it.each(['Enter', ' '])('prevents and stops disabled %s keydown activation', key => {
    const wrapper = mount(Link, { props: { disabledFocusable: true } });
    const event = new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      cancelable: true,
    });
    const stopPropagation = vi.spyOn(event, 'stopPropagation');

    wrapper.element.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(stopPropagation).toHaveBeenCalledOnce();
    expect(wrapper.emitted('keydown')).toBeUndefined();
  });

  it('forwards non-activation keydown events even while disabled', () => {
    const wrapper = mount(Link, { props: { disabled: true } });
    const event = new KeyboardEvent('keydown', {
      key: 'ArrowRight',
      bubbles: true,
      cancelable: true,
    });

    wrapper.element.dispatchEvent(event);

    expect(wrapper.emitted('keydown')).toHaveLength(1);
    expect(wrapper.emitted('keydown')?.[0]?.[0]).toBe(event);
  });

  it.each(['Enter', ' '])('synthesizes one span click for %s', key => {
    const wrapper = mount(Link, { props: { as: 'span' } });
    const event = new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      cancelable: true,
    });

    wrapper.element.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(wrapper.emitted('keydown')).toHaveLength(1);
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('does not synthesize a span click when the consumer handles keydown', () => {
    const onKeydown = vi.fn((event: KeyboardEvent) => {
      (event.currentTarget as HTMLElement).click();
    });
    const wrapper = mount(Link, {
      props: { as: 'span' },
      attrs: { onKeydown },
    });
    const event = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
      cancelable: true,
    });

    wrapper.element.dispatchEvent(event);

    expect(onKeydown).toHaveBeenCalledOnce();
    expect(wrapper.emitted('keydown')).toHaveLength(1);
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('supports camel-cased and once keydown listeners without duplicate span activation', () => {
    const onKeyDown = vi.fn();
    const camelCased = mount(Link, {
      props: { as: 'span' },
      attrs: { onKeyDown },
    });
    const onKeydownOnce = vi.fn();
    const once = mount(Link, {
      props: { as: 'span' },
      attrs: { onKeydownOnce },
    });

    camelCased.element.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      }),
    );
    once.element.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(onKeyDown).toHaveBeenCalledOnce();
    expect(camelCased.emitted('click')).toBeUndefined();
    expect(onKeydownOnce).toHaveBeenCalledOnce();
    expect(once.emitted('click')).toBeUndefined();
  });

  it('suppresses capture-modified click and keydown listeners while disabled', () => {
    const onClickCapture = vi.fn();
    const onKeydownCapture = vi.fn();
    const wrapper = mount(Link, {
      props: { as: 'span', disabledFocusable: true },
      attrs: { onClickCapture, onKeydownCapture },
    });

    wrapper.element.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true }),
    );
    wrapper.element.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(onClickCapture).not.toHaveBeenCalled();
    expect(onKeydownCapture).not.toHaveBeenCalled();
  });

  it('falls back to link semantics for an empty disabled-anchor role', () => {
    const wrapper = mount(Link, {
      props: { href: '/docs', disabled: true },
      attrs: { role: '' },
    });

    expect(wrapper.get('a').attributes('role')).toBe('link');
  });

  it.each<{
    props: { href?: string };
    element: 'button' | 'a';
  }>([
    { props: {}, element: 'button' },
    { props: { href: '/docs' }, element: 'a' },
  ])('does not emulate keyboard clicks for native $element roots', ({ props, element }) => {
    const wrapper = mount(Link, { props });
    const event = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
      cancelable: true,
    });

    wrapper.get(element).element.dispatchEvent(event);

    expect(wrapper.emitted('keydown')).toHaveLength(1);
    expect(wrapper.emitted('click')).toBeUndefined();
  });

  it('exposes the native element and focus method', () => {
    const wrapper = mount(Link, { attachTo: document.body });
    const exposed = wrapper.vm as unknown as {
      element: HTMLElement;
      focus: () => void;
    };
    const focus = vi.spyOn(wrapper.element as HTMLElement, 'focus');

    expect(exposed.element).toBe(wrapper.element);
    exposed.focus();
    expect(focus).toHaveBeenCalledOnce();
  });
});
