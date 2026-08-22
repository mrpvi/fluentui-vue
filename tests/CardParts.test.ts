import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import CardFooter from '../src/components/CardFooter/CardFooter.vue';
import CardHeader from '../src/components/CardHeader/CardHeader.vue';
import CardPreview from '../src/components/CardPreview/CardPreview.vue';

describe('FCardHeader', () => {
  it('renders image, header, description and action in upstream order', () => {
    const wrapper = mount(CardHeader, {
      slots: {
        image: '<img data-image alt="App" />',
        header: '<h3 data-header>Title</h3>',
        description: '<p data-description>Description</p>',
        action: '<button data-action>More</button>',
      },
    });

    expect(
      Array.from(wrapper.element.children as HTMLCollection).map((element) => element.className),
    ).toEqual([
      'fui-CardHeader__image',
      'fui-CardHeader__header',
      'fui-CardHeader__description',
      'fui-CardHeader__action',
    ]);
    expect(wrapper.get('[data-header]').text()).toBe('Title');
  });

  it('omits wrappers for absent optional slots', () => {
    const wrapper = mount(CardHeader, { slots: { header: 'Title' } });
    expect(wrapper.find('.fui-CardHeader__image').exists()).toBe(false);
    expect(wrapper.find('.fui-CardHeader__description').exists()).toBe(false);
    expect(wrapper.find('.fui-CardHeader__action').exists()).toBe(false);
  });

  it('routes root attrs and exposes the native element', () => {
    const wrapper = mount(CardHeader, {
      attrs: {
        id: 'header',
        class: 'custom',
        style: 'min-width: 0;',
        'aria-label': 'Card heading',
        'data-part': 'header',
      },
    });
    const exposed = wrapper.vm as unknown as { element: HTMLElement };

    expect(wrapper.attributes('id')).toBe('header');
    expect(wrapper.classes()).toContain('custom');
    expect(wrapper.attributes('style')).toContain('min-width: 0');
    expect(wrapper.attributes('aria-label')).toBe('Card heading');
    expect(wrapper.attributes('data-part')).toBe('header');
    expect(exposed.element).toBe(wrapper.element);
  });
});

describe('FCardPreview', () => {
  it('renders preview children followed by the logo overlay', () => {
    const wrapper = mount(CardPreview, {
      slots: {
        default: '<img data-preview alt="Preview" />',
        logo: '<img data-logo alt="Logo" />',
      },
    });

    expect(wrapper.element.firstElementChild?.hasAttribute('data-preview')).toBe(true);
    expect(wrapper.element.lastElementChild?.classList).toContain('fui-CardPreview__logo');
    expect(wrapper.get('[data-logo]').attributes('alt')).toBe('Logo');
  });

  it('omits the optional logo wrapper when the slot is absent', () => {
    const wrapper = mount(CardPreview, { slots: { default: '<img alt="Preview" />' } });
    expect(wrapper.find('.fui-CardPreview__logo').exists()).toBe(false);
  });

  it('routes root attrs and exposes the native element', () => {
    const wrapper = mount(CardPreview, {
      attrs: {
        id: 'preview',
        class: 'custom',
        style: 'aspect-ratio: 16 / 9;',
        role: 'figure',
        'data-part': 'preview',
      },
    });
    const exposed = wrapper.vm as unknown as { element: HTMLElement };

    expect(wrapper.attributes('id')).toBe('preview');
    expect(wrapper.classes()).toContain('custom');
    expect(wrapper.attributes('style')).toContain('aspect-ratio: 16 / 9');
    expect(wrapper.attributes('role')).toBe('figure');
    expect(wrapper.attributes('data-part')).toBe('preview');
    expect(exposed.element).toBe(wrapper.element);
  });
});

describe('FCardFooter', () => {
  it('renders default children before the far-edge action', () => {
    const wrapper = mount(CardFooter, {
      slots: {
        default: '<button data-primary>Open</button>',
        action: '<button data-action>More</button>',
      },
    });

    expect(wrapper.element.firstElementChild?.hasAttribute('data-primary')).toBe(true);
    expect(wrapper.element.lastElementChild?.classList).toContain('fui-CardFooter__action');
  });

  it('does not swallow descendant action events', async () => {
    const action = vi.fn();
    const wrapper = mount(CardFooter, {
      slots: { action: '<button data-action>More</button>' },
    });
    wrapper.get('[data-action]').element.addEventListener('click', action);

    await wrapper.get('[data-action]').trigger('click');
    expect(action).toHaveBeenCalledOnce();
  });

  it('omits action wrapper when absent and routes attrs/ref to root', () => {
    const wrapper = mount(CardFooter, {
      attrs: {
        id: 'footer',
        class: 'custom',
        style: 'justify-content: flex-start;',
        'aria-label': 'Card actions',
        'data-part': 'footer',
      },
      slots: { default: 'Open' },
    });
    const exposed = wrapper.vm as unknown as { element: HTMLElement };

    expect(wrapper.find('.fui-CardFooter__action').exists()).toBe(false);
    expect(wrapper.attributes('id')).toBe('footer');
    expect(wrapper.classes()).toContain('custom');
    expect(wrapper.attributes('style')).toContain('justify-content: flex-start');
    expect(wrapper.attributes('aria-label')).toBe('Card actions');
    expect(wrapper.attributes('data-part')).toBe('footer');
    expect(exposed.element).toBe(wrapper.element);
  });
});
