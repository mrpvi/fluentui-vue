import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import Avatar from '../src/components/Avatar/Avatar.vue';
import {
  avatarNamedColors,
  getAvatarColorHash,
  getAvatarInitials,
} from '../src/components/Avatar/Avatar.utils';
import AvatarGroup from '../src/components/AvatarGroup/AvatarGroup.vue';
import AvatarGroupItem from '../src/components/AvatarGroupItem/AvatarGroupItem.vue';
import AvatarGroupPopover from '../src/components/AvatarGroupPopover/AvatarGroupPopover.vue';
import { partitionAvatarGroupItems } from '../src/components/AvatarGroupPopover/AvatarGroupPopover.utils';

const components = { Avatar, AvatarGroup, AvatarGroupItem, AvatarGroupPopover };

describe('FAvatar family', () => {
  it('generates released initials, cleanup, RTL, and fallback cases', () => {
    expect(getAvatarInitials('Ada Lovelace')).toBe('AL');
    expect(getAvatarInitials('Ada Byron Lovelace')).toBe('AL');
    expect(getAvatarInitials('Ada')).toBe('A');
    expect(getAvatarInitials('Ada (Countess) Lovelace')).toBe('AL');
    expect(getAvatarInitials('Ada Lovelace', true)).toBe('LA');
    expect(getAvatarInitials('Ada Lovelace', false, true)).toBe('A');
    expect(getAvatarInitials('555 123 4567')).toBe('');
    expect(getAvatarInitials('李雷')).toBe('');
  });

  it('resolves colorful avatars with the released deterministic hash', () => {
    const value = 'Ada Lovelace';
    const expected = avatarNamedColors[getAvatarColorHash(value) % avatarNamedColors.length];
    const wrapper = mount(Avatar, { props: { name: value, color: 'colorful' } });

    expect(wrapper.classes()).toContain(`fui-Avatar--color-${expected}`);
  });

  it('renders generated initials, first-initial-only at 16, and icon fallback', () => {
    const named = mount(Avatar, { props: { name: 'Ada Lovelace' } });
    const tiny = mount(Avatar, { props: { name: 'Ada Lovelace', size: 16 } });
    const fallback = mount(Avatar);

    expect(named.get('.fui-Avatar__initials').text()).toBe('AL');
    expect(named.attributes('role')).toBe('img');
    expect(named.attributes('aria-label')).toBe('Ada Lovelace');
    expect(tiny.get('.fui-Avatar__initials').text()).toBe('A');
    expect(fallback.find('.fui-Avatar__initials').exists()).toBe(false);
    expect(fallback.find('.fui-Avatar__icon').exists()).toBe(true);
  });

  it('inherits RTL from an ancestor when generating initials', async () => {
    const wrapper = mount({
      components: { Avatar },
      template: '<div dir="rtl"><Avatar name="Ada Lovelace" /></div>',
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.get('.fui-Avatar__initials').text()).toBe('LA');
  });

  it('uses custom initials as a label when name is absent', () => {
    const wrapper = mount(Avatar, { slots: { initials: 'FV' } });
    const initials = wrapper.get('.fui-Avatar__initials');

    expect(wrapper.attributes('aria-labelledby')).toBe(initials.attributes('id'));
    expect(initials.attributes('aria-hidden')).toBeUndefined();
  });

  it('layers a decorative image over initials and recovers after a later image loads', async () => {
    const onError = vi.fn();
    const onLoad = vi.fn();
    const wrapper = mount(Avatar, {
      attrs: { onError, onLoad },
      props: { name: 'Ada Lovelace', image: '/ada.png' },
    });

    expect(wrapper.find('.fui-Avatar__initials').exists()).toBe(true);
    expect(wrapper.get('img').attributes()).toMatchObject({ alt: '' });
    await wrapper.get('img').trigger('error');
    expect(wrapper.get('.fui-Avatar__image').attributes('style')).toContain('display: none');
    expect(wrapper.find('.fui-Avatar__initials').exists()).toBe(true);
    expect(onError).toHaveBeenCalledTimes(1);

    await wrapper.setProps({ image: '/ada-recovered.png' });
    await wrapper.get('img').trigger('load');
    expect(wrapper.get('.fui-Avatar__image').attributes('style')).toBeUndefined();
    expect(onLoad).toHaveBeenCalledTimes(1);
  });

  it('maps active, shape, size, badge, and explicit ARIA state', () => {
    const wrapper = mount(Avatar, {
      attrs: { 'aria-label': 'Explicit avatar label' },
      props: {
        active: 'active',
        activeAppearance: 'ring-shadow',
        name: 'Ada Lovelace',
        presence: { status: 'away' },
        shape: 'square',
        size: 64,
      },
    });

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'fui-Avatar--active',
        'fui-Avatar--active-ring-shadow',
        'fui-Avatar--shape-square',
        'fui-Avatar--size-64',
      ]),
    );
    expect(wrapper.attributes('aria-label')).toBe('Explicit avatar label');
    expect(wrapper.get('.fui-PresenceBadge').classes()).toContain('fui-PresenceBadge--size-large');
  });

  it('includes human-readable presence and out-of-office state in its generated name', () => {
    const wrapper = mount(Avatar, {
      props: {
        active: 'inactive',
        name: 'Ada Lovelace',
        presence: { status: 'do-not-disturb', outOfOffice: true },
      },
    });

    expect(wrapper.attributes('aria-label')).toBe(
      'Ada Lovelace, do not disturb out of office, inactive',
    );
  });

  it('inherits group size and renders inline versus overflow item roots', async () => {
    const wrapper = mount({
      components,
      template: `
        <AvatarGroup size="48" layout="stack" aria-label="Project members">
          <AvatarGroupItem name="Ada Lovelace" />
          <AvatarGroupPopover :count="1" default-open>
            <AvatarGroupItem name="Grace Hopper" />
          </AvatarGroupPopover>
        </AvatarGroup>
      `,
    });
    await wrapper.vm.$nextTick();

    expect(wrapper.get('[role="group"]').classes()).toContain('fui-AvatarGroup--stack');
    expect(wrapper.findAll('.fui-AvatarGroupItem')[0]?.element.tagName).toBe('DIV');
    expect(wrapper.findAll('.fui-Avatar')[0]?.classes()).toContain('fui-Avatar--size-48');
    expect(wrapper.findAll('.fui-AvatarGroupItem')[1]?.element.tagName).toBe('LI');
    expect(wrapper.findAll('.fui-Avatar')[1]?.classes()).toContain('fui-Avatar--size-24');
    expect(wrapper.get('.fui-AvatarGroupItem__overflowLabel').attributes('aria-hidden')).toBe(
      'true',
    );
  });

  it('supports controlled and uncontrolled overflow popover interaction', async () => {
    const uncontrolled = mount({
      components,
      template: `
        <AvatarGroup>
          <AvatarGroupPopover :count="120">
            <AvatarGroupItem name="Ada Lovelace" />
          </AvatarGroupPopover>
        </AvatarGroup>
      `,
    });
    const button = uncontrolled.get('button');
    expect(button.text()).toBe('99+');
    await button.trigger('click');
    expect(uncontrolled.find('[role="dialog"]').exists()).toBe(true);
    expect(button.attributes('aria-expanded')).toBe('true');
    await uncontrolled.get('[role="dialog"]').trigger('keydown', { key: 'Escape' });
    expect(uncontrolled.find('[role="dialog"]').exists()).toBe(false);

    const onUpdate = vi.fn();
    const controlled = mount({
      components,
      methods: { onUpdate },
      template: `
        <AvatarGroup>
          <AvatarGroupPopover :model-value="false" :count="2" @update:model-value="onUpdate" />
        </AvatarGroup>
      `,
    });
    await controlled.get('button').trigger('click');
    expect(onUpdate).toHaveBeenCalledWith(true);
    expect(controlled.find('[role="dialog"]').exists()).toBe(false);
  });

  it('derives the default overflow count from its slot children', () => {
    const wrapper = mount({
      components,
      template: `
        <AvatarGroup>
          <AvatarGroupPopover>
            <AvatarGroupItem name="Ada Lovelace" />
            <AvatarGroupItem name="Grace Hopper" />
            <AvatarGroupItem name="Margaret Hamilton" />
          </AvatarGroupPopover>
        </AvatarGroup>
      `,
    });

    expect(wrapper.get('button').text()).toBe('+3');
  });

  it('wraps reverse Tab from the initially focused overflow surface', async () => {
    const wrapper = mount({
      components,
      template: `
        <AvatarGroup>
          <AvatarGroupPopover :count="1" default-open>
            <AvatarGroupItem name="Ada Lovelace">
              <template #overflow-label><button type="button">Profile</button></template>
            </AvatarGroupItem>
          </AvatarGroupPopover>
        </AvatarGroup>
      `,
      attachTo: document.body,
    });
    await wrapper.vm.$nextTick();

    const surface = wrapper.get('[role="dialog"]');
    const profile = wrapper.get('button[type="button"]:not(.fui-AvatarGroupPopover__trigger)');
    const focus = vi.spyOn(profile.element as HTMLButtonElement, 'focus');
    Object.defineProperty(document, 'activeElement', {
      configurable: true,
      value: surface.element,
    });
    await surface.trigger('keydown', { key: 'Tab', shiftKey: true });
    expect(focus).toHaveBeenCalledTimes(1);
    Object.defineProperty(document, 'activeElement', {
      configurable: true,
      get: () => document.body,
    });

    wrapper.unmount();
  });

  it('defaults to icon indicators below size 24 and hides pie indicator content', () => {
    const icon = mount({
      components,
      template: `
        <AvatarGroup :size="20"><AvatarGroupPopover :count="4" /></AvatarGroup>
      `,
    });
    const pie = mount({
      components,
      template: `
        <AvatarGroup layout="pie"><AvatarGroupPopover :count="4" /></AvatarGroup>
      `,
    });

    expect(icon.find('.fui-AvatarGroupPopover__icon').exists()).toBe(true);
    expect(pie.get('button').text()).toBe('');
  });

  it('partitions group items with released spread and pie behavior', () => {
    expect(partitionAvatarGroupItems({ items: [1, 2, 3, 4, 5, 6, 7] })).toEqual({
      inlineItems: [4, 5, 6, 7],
      overflowItems: [1, 2, 3],
    });
    expect(partitionAvatarGroupItems({ items: [1, 2, 3, 4], layout: 'pie' })).toEqual({
      inlineItems: [1, 2, 3],
      overflowItems: [1, 2, 3, 4],
    });
    expect(partitionAvatarGroupItems({ items: [] })).toEqual({
      inlineItems: [],
      overflowItems: undefined,
    });
  });
});
