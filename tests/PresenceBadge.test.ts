import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import PresenceBadge from '../src/components/PresenceBadge/PresenceBadge.vue';
import type { BadgeSize } from '../src/components/Badge';
import type { PresenceBadgeStatus } from '../src/components/PresenceBadge/PresenceBadge.types';

const labels: Record<PresenceBadgeStatus, string> = {
  available: 'available',
  away: 'away',
  blocked: 'blocked',
  busy: 'busy',
  'do-not-disturb': 'do not disturb',
  offline: 'offline',
  'out-of-office': 'out of office',
  unknown: 'unknown',
};

describe('FPresenceBadge', () => {
  it('renders a fixed div with accessible default status semantics', () => {
    const wrapper = mount(PresenceBadge);

    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.attributes('role')).toBe('img');
    expect(wrapper.attributes('aria-label')).toBe('available');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'fui-PresenceBadge',
        'fui-PresenceBadge--available',
        'fui-PresenceBadge--size-medium',
      ]),
    );
  });

  it.each(Object.entries(labels) as [PresenceBadgeStatus, string][])(
    'provides the default accessible label for %s',
    (status, label) => {
      const wrapper = mount(PresenceBadge, { props: { status } });

      expect(wrapper.attributes('role')).toBe('img');
      expect(wrapper.attributes('aria-label')).toBe(label);
      expect(wrapper.classes()).toContain(`fui-PresenceBadge--${status}`);
    },
  );

  it.each<PresenceBadgeStatus>([
    'available',
    'away',
    'blocked',
    'busy',
    'do-not-disturb',
    'offline',
    'unknown',
  ])('appends the out-of-office suffix for %s', (status) => {
    const wrapper = mount(PresenceBadge, { props: { status, outOfOffice: true } });

    expect(wrapper.attributes('aria-label')).toBe(`${labels[status]} out of office`);
    expect(wrapper.classes()).toContain('fui-PresenceBadge--out-of-office');
  });

  it('does not duplicate the out-of-office label for the explicit status', () => {
    const wrapper = mount(PresenceBadge, {
      props: { status: 'out-of-office', outOfOffice: true },
    });

    expect(wrapper.attributes('aria-label')).toBe('out of office');
  });

  it('allows consumers to override both role and accessible label', () => {
    const wrapper = mount(PresenceBadge, {
      attrs: { role: 'presentation', 'aria-label': 'Custom presence' },
    });

    expect(wrapper.attributes('role')).toBe('presentation');
    expect(wrapper.attributes('aria-label')).toBe('Custom presence');
  });

  it.each<BadgeSize>(['tiny', 'extra-small', 'small', 'medium', 'large', 'extra-large'])(
    'applies the %s size and renders a fallback SVG',
    (size) => {
      const wrapper = mount(PresenceBadge, { props: { size } });
      const svg = wrapper.get('svg');

      expect(wrapper.classes()).toContain(`fui-PresenceBadge--size-${size}`);
      expect(svg.classes()).toContain('fui-PresenceBadge__svg');
      expect(svg.attributes('aria-hidden')).toBe('true');
      expect(svg.attributes('focusable')).toBe('false');
      expect(svg.get('path').attributes('d')).toBeTruthy();
    },
  );

  it('selects status and OOO-specific fallback icon paths', () => {
    const available = mount(PresenceBadge, { props: { status: 'available' } });
    const availableOof = mount(PresenceBadge, {
      props: { status: 'available', outOfOffice: true },
    });
    const busy = mount(PresenceBadge, { props: { status: 'busy' } });

    expect(available.get('path').attributes('d')).not.toBe(
      availableOof.get('path').attributes('d'),
    );
    expect(available.get('path').attributes('d')).not.toBe(busy.get('path').attributes('d'));
  });

  it('uses custom icon content instead of the fallback SVG without aria-hiding it', () => {
    const wrapper = mount(PresenceBadge, {
      slots: { icon: '<svg class="custom-icon" aria-label="Custom icon"></svg>' },
    });
    const icon = wrapper.get('.fui-PresenceBadge__icon');

    expect(icon.find('.custom-icon').exists()).toBe(true);
    expect(icon.find('.fui-PresenceBadge__svg').exists()).toBe(false);
    expect(icon.attributes('aria-hidden')).toBeUndefined();
    expect(icon.get('.custom-icon').attributes('aria-label')).toBe('Custom icon');
  });

  it('forwards root attributes, listeners, class, and style', async () => {
    const onClick = vi.fn();
    const wrapper = mount(PresenceBadge, {
      attrs: {
        id: 'presence',
        title: 'Presence state',
        'data-kind': 'presence',
        class: 'custom',
        style: 'margin: 2px',
        onClick,
      },
    });

    expect(wrapper.attributes('id')).toBe('presence');
    expect(wrapper.attributes('title')).toBe('Presence state');
    expect(wrapper.attributes('data-kind')).toBe('presence');
    expect(wrapper.classes()).toContain('custom');
    expect(wrapper.attributes('style')).toContain('margin: 2px');
    await wrapper.trigger('click');
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('updates status, label, OOO state, size, and fallback icon reactively', async () => {
    const wrapper = mount(PresenceBadge);
    const originalPath = wrapper.get('path').attributes('d');

    await wrapper.setProps({ status: 'away', outOfOffice: true, size: 'extra-large' });

    expect(wrapper.attributes('aria-label')).toBe('away out of office');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'fui-PresenceBadge--away',
        'fui-PresenceBadge--out-of-office',
        'fui-PresenceBadge--size-extra-large',
      ]),
    );
    expect(wrapper.get('path').attributes('d')).not.toBe(originalPath);
  });

  it('exposes only the native presence element and emits no component events', () => {
    const wrapper = mount(PresenceBadge);
    const vm = wrapper.vm as unknown as { element: HTMLDivElement; focus?: () => void };

    expect(vm.element).toBe(wrapper.element);
    expect(vm.focus).toBeUndefined();
    expect(wrapper.emitted()).toEqual({});
  });
});
