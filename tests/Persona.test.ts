import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Persona from '../src/components/Persona/Persona.vue';

const components = { Persona };

describe('FPersona', () => {
  it('renders the default avatar and primary text from name', () => {
    const wrapper = mount(Persona, { props: { name: 'Ada Lovelace' } });

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'fui-Persona--size-medium',
        'fui-Persona--text-position-after',
        'fui-Persona--text-alignment-start',
      ]),
    );
    expect(wrapper.get('.fui-Avatar').classes()).toContain('fui-Avatar--size-32');
    expect(wrapper.get('.fui-Avatar').attributes('aria-label')).toBe('Ada Lovelace');
    expect(wrapper.get('.fui-Persona__primaryText').text()).toBe('Ada Lovelace');
  });

  it('renders text lines in released order and places media before or after them', () => {
    const after = mount(Persona, {
      props: { name: 'Ada Lovelace' },
      slots: {
        secondaryText: 'Mathematician',
        tertiaryText: 'London',
        quaternaryText: 'Available',
      },
    });
    expect(
      Array.from(after.element.children as HTMLCollection).map((element) => element.className),
    ).toEqual([
      'fui-Persona__media',
      'fui-Persona__primaryText',
      'fui-Persona__secondaryText',
      'fui-Persona__tertiaryText',
      'fui-Persona__quaternaryText',
    ]);

    const before = mount(Persona, {
      props: { name: 'Ada Lovelace', textPosition: 'before' },
      slots: { secondaryText: 'Mathematician' },
    });
    expect(before.element.lastElementChild?.classList).toContain('fui-Persona__media');
  });

  it.each([
    ['extra-small', '20'],
    ['small', '28'],
    ['medium', '32'],
    ['large', '36'],
    ['extra-large', '40'],
    ['huge', '56'],
  ] as const)('maps the %s Persona size to Avatar size %s', (size, avatarSize) => {
    const wrapper = mount(Persona, { props: { name: 'Ada Lovelace', size } });
    expect(wrapper.get('.fui-Avatar').classes()).toContain(`fui-Avatar--size-${avatarSize}`);
  });

  it.each([
    ['extra-small', 'tiny'],
    ['small', 'extra-small'],
    ['medium', 'small'],
    ['large', 'medium'],
    ['extra-large', 'large'],
    ['huge', 'large'],
  ] as const)('maps the %s Persona size to standalone presence size %s', (size, badgeSize) => {
    const wrapper = mount(Persona, {
      props: { name: 'Ada Lovelace', presenceOnly: true, presence: { status: 'away' }, size },
    });

    expect(wrapper.find('.fui-Avatar').exists()).toBe(false);
    expect(wrapper.get('.fui-PresenceBadge').classes()).toContain(
      `fui-PresenceBadge--size-${badgeSize}`,
    );
  });

  it('forwards avatar composition and presence to the default Avatar', () => {
    const wrapper = mount(Persona, {
      props: {
        avatar: { color: 'colorful', image: '/ada.png', shape: 'square' },
        name: 'Ada Lovelace',
        presence: { status: 'do-not-disturb', outOfOffice: true },
        size: 'large',
      },
    });
    const avatar = wrapper.get('.fui-Avatar');

    expect(avatar.classes()).toEqual(
      expect.arrayContaining([
        'fui-Avatar--size-36',
        'fui-Avatar--shape-square',
        expect.stringMatching(/^fui-Avatar--color-/),
      ]),
    );
    expect(avatar.get('img').attributes('src')).toBe('/ada.png');
    expect(avatar.attributes('aria-label')).toBe('Ada Lovelace, do not disturb out of office');
  });

  it('allows nested Avatar props to override Persona defaults like the released Avatar slot', () => {
    const wrapper = mount(Persona, {
      props: {
        avatar: { name: 'Avatar label', presence: { status: 'busy' }, size: 64 },
        name: 'Persona text',
        presence: { status: 'away' },
        size: 'small',
      },
    });
    const avatar = wrapper.get('.fui-Avatar');

    expect(avatar.classes()).toContain('fui-Avatar--size-64');
    expect(avatar.attributes('aria-label')).toBe('Avatar label, busy');
    expect(wrapper.get('.fui-Persona__primaryText').text()).toBe('Persona text');
  });

  it('allows standalone presence props to override the mapped default size', () => {
    const wrapper = mount(Persona, {
      props: {
        name: 'Ada Lovelace',
        presenceOnly: true,
        presence: { status: 'away', size: 'tiny' },
        size: 'huge',
      },
    });

    expect(wrapper.get('.fui-PresenceBadge').classes()).toContain('fui-PresenceBadge--size-tiny');
  });

  it('renders the default primary text slot even when name is absent', () => {
    const wrapper = mount(Persona);

    expect(wrapper.get('.fui-Persona__primaryText').text()).toBe('');
    expect(wrapper.find('.fui-Avatar').exists()).toBe(true);
  });

  it('omits the media wrapper for presence-only Personas without presence content', () => {
    const wrapper = mount(Persona, { props: { name: 'Ada Lovelace', presenceOnly: true } });

    expect(wrapper.find('.fui-Persona__media').exists()).toBe(false);
    expect(wrapper.get('.fui-Persona__primaryText').text()).toBe('Ada Lovelace');
  });

  it('supports custom media and all text slots without adding interaction semantics', () => {
    const wrapper = mount(Persona, {
      slots: {
        avatar: '<button data-avatar type="button">Profile image</button>',
        primaryText: '<strong>Ada Lovelace</strong>',
        secondaryText: 'Mathematician',
      },
    });

    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.attributes('role')).toBeUndefined();
    expect(wrapper.get('[data-avatar]').text()).toBe('Profile image');
    expect(wrapper.get('.fui-Persona__primaryText strong').text()).toBe('Ada Lovelace');
  });

  it('supports below and centered layout classes', () => {
    const wrapper = mount(Persona, {
      props: { name: 'Ada Lovelace', textAlignment: 'center', textPosition: 'below' },
    });

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'fui-Persona--text-alignment-center',
        'fui-Persona--text-position-below',
      ]),
    );
    expect(wrapper.element.firstElementChild?.classList).toContain('fui-Persona__media');
  });

  it('routes root attrs and exposes its native element', () => {
    const wrapper = mount(Persona, {
      attrs: {
        id: 'persona',
        class: 'custom-persona',
        style: 'max-width: 20rem;',
        'aria-label': 'Project lead',
        'data-persona': 'lead',
      },
      props: { name: 'Ada Lovelace' },
    });
    const exposed = wrapper.vm as unknown as { element: HTMLDivElement };

    expect(wrapper.attributes('id')).toBe('persona');
    expect(wrapper.classes()).toContain('custom-persona');
    expect(wrapper.attributes('style')).toContain('max-width: 20rem');
    expect(wrapper.attributes('aria-label')).toBe('Project lead');
    expect(wrapper.attributes('data-persona')).toBe('lead');
    expect(exposed.element).toBe(wrapper.element);
  });

  it('renders custom Avatar and presence icon subslots', () => {
    const avatar = mount({
      components,
      template: `
        <Persona name="Ada Lovelace">
          <template #avatarInitials>AV</template>
        </Persona>
      `,
    });
    expect(avatar.get('.fui-Avatar__initials').text()).toBe('AV');

    const presence = mount({
      components,
      template: `
        <Persona name="Ada Lovelace" presence-only :presence="{ status: 'available' }">
          <template #presenceIcon><span data-presence-icon>Online</span></template>
        </Persona>
      `,
    });
    expect(presence.get('[data-presence-icon]').text()).toBe('Online');
  });
});
