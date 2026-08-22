import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import Image from '../src/components/Image/Image.vue';
import type { ImageFit, ImageShape } from '../src/components/Image/Image.types';

describe('FImage', () => {
  it('renders a fixed native img root with upstream defaults', () => {
    const wrapper = mount(Image, {
      attrs: { src: '/photo.png', alt: 'A photo' },
    });

    expect(wrapper.element.tagName).toBe('IMG');
    expect(wrapper.attributes('src')).toBe('/photo.png');
    expect(wrapper.attributes('alt')).toBe('A photo');
    expect(wrapper.element.children).toHaveLength(0);
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['fui-Image', 'fui-Image--shape-square', 'fui-Image--fit-default']),
    );
    expect(wrapper.classes()).not.toEqual(
      expect.arrayContaining([
        'fui-Image--block',
        'fui-Image--bordered',
        'fui-Image--shadow',
        'fui-Image--fit-fill',
      ]),
    );
  });

  it.each<ImageShape>(['square', 'rounded', 'circular'])('applies the %s shape', (shape) => {
    const wrapper = mount(Image, { props: { shape } });

    expect(wrapper.classes()).toContain(`fui-Image--shape-${shape}`);
  });

  it.each<ImageFit>(['default', 'none', 'center', 'contain', 'cover'])(
    'applies the %s fit mode',
    (fit) => {
      const wrapper = mount(Image, {
        props: { fit },
        attrs: { width: 120 },
      });

      expect(wrapper.classes()).toContain(`fui-Image--fit-${fit}`);
    },
  );

  it('applies boolean visual modifiers without leaking them as image attributes', () => {
    const wrapper = mount(Image, {
      props: { block: true, bordered: true, shadow: true },
    });

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['fui-Image--block', 'fui-Image--bordered', 'fui-Image--shadow']),
    );
    expect(wrapper.attributes('block')).toBeUndefined();
    expect(wrapper.attributes('bordered')).toBeUndefined();
    expect(wrapper.attributes('shadow')).toBeUndefined();
  });

  it.each<Exclude<ImageFit, 'default'>>(['none', 'center', 'contain', 'cover'])(
    'applies fit-fill for %s when neither size attribute is present',
    (fit) => {
      const wrapper = mount(Image, { props: { fit } });

      expect(wrapper.classes()).toContain('fui-Image--fit-fill');
    },
  );

  it('does not apply fit-fill for the default fit', () => {
    const wrapper = mount(Image);

    expect(wrapper.classes()).not.toContain('fui-Image--fit-fill');
  });

  it.each([
    { name: 'width', attrs: { width: 100 } },
    { name: 'height', attrs: { height: 100 } },
    { name: 'both dimensions', attrs: { width: 100, height: 100 } },
    { name: 'zero width', attrs: { width: 0 } },
    { name: 'zero height', attrs: { height: 0 } },
    { name: 'empty width', attrs: { width: '' } },
    { name: 'empty height', attrs: { height: '' } },
  ])('does not apply fit-fill when $name is present', ({ attrs }) => {
    const wrapper = mount(Image, {
      props: { fit: 'cover' },
      attrs,
    });

    expect(wrapper.classes()).not.toContain('fui-Image--fit-fill');
  });

  it('updates fit-fill reactively as the fit prop changes with explicit size', async () => {
    const wrapper = mount(Image, {
      props: { fit: 'default' },
      attrs: { width: 0 },
    });

    await wrapper.setProps({ fit: 'cover' });
    expect(wrapper.classes()).toContain('fui-Image--fit-cover');
    expect(wrapper.classes()).not.toContain('fui-Image--fit-fill');

    await wrapper.setProps({ fit: 'contain' });
    expect(wrapper.classes()).toContain('fui-Image--fit-contain');
    expect(wrapper.classes()).not.toContain('fui-Image--fit-fill');
  });

  it('updates visual props reactively', async () => {
    const wrapper = mount(Image, {
      props: {
        block: false,
        bordered: false,
        fit: 'default',
        shadow: false,
        shape: 'square',
      },
    });

    await wrapper.setProps({
      block: true,
      bordered: true,
      fit: 'contain',
      shadow: true,
      shape: 'rounded',
    });

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'fui-Image--block',
        'fui-Image--bordered',
        'fui-Image--fit-contain',
        'fui-Image--fit-fill',
        'fui-Image--shadow',
        'fui-Image--shape-rounded',
      ]),
    );
    expect(wrapper.classes()).not.toEqual(
      expect.arrayContaining(['fui-Image--fit-default', 'fui-Image--shape-square']),
    );
  });

  it('routes native image attributes, ARIA, data attributes, class, and style to img', () => {
    const wrapper = mount(Image, {
      attrs: {
        id: 'profile-image',
        src: '/profile.webp',
        srcset: '/profile.webp 1x, /profile@2x.webp 2x',
        sizes: '64px',
        alt: 'Profile',
        width: 64,
        height: 64,
        loading: 'lazy',
        decoding: 'async',
        crossorigin: 'anonymous',
        referrerpolicy: 'no-referrer',
        usemap: '#profile-map',
        ismap: true,
        draggable: 'false',
        fetchpriority: 'high',
        'aria-describedby': 'profile-description',
        'data-track': 'avatar',
        class: ['custom-image', { selected: true }],
        style: [{ maxWidth: '64px' }, 'opacity: 0.8'],
      },
    });

    expect(wrapper.attributes()).toMatchObject({
      id: 'profile-image',
      src: '/profile.webp',
      srcset: '/profile.webp 1x, /profile@2x.webp 2x',
      sizes: '64px',
      alt: 'Profile',
      width: '64',
      height: '64',
      loading: 'lazy',
      decoding: 'async',
      crossorigin: 'anonymous',
      referrerpolicy: 'no-referrer',
      usemap: '#profile-map',
      ismap: '',
      draggable: 'false',
      fetchpriority: 'high',
      'aria-describedby': 'profile-description',
      'data-track': 'avatar',
    });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['fui-Image', 'custom-image', 'selected']),
    );
    expect(wrapper.attributes('style')).toContain('max-width: 64px');
    expect(wrapper.attributes('style')).toContain('opacity: 0.8');
  });

  it('relies on native load and error listeners without declared component emits', () => {
    const onLoad = vi.fn();
    const onError = vi.fn();
    const wrapper = mount(Image, {
      attrs: { onLoad, onError },
    });
    const loadEvent = new Event('load');
    const errorEvent = new Event('error');

    wrapper.element.dispatchEvent(loadEvent);
    wrapper.element.dispatchEvent(errorEvent);

    expect(onLoad).toHaveBeenCalledOnce();
    expect(onLoad).toHaveBeenCalledWith(loadEvent);
    expect(onError).toHaveBeenCalledOnce();
    expect(onError).toHaveBeenCalledWith(errorEvent);
    expect(wrapper.vm.$options.emits).toBeUndefined();
  });

  it('does not add fallback state after an error', () => {
    const wrapper = mount(Image, {
      attrs: { src: '/missing.png', alt: 'Missing image' },
    });

    wrapper.element.dispatchEvent(new Event('error'));

    expect(wrapper.element.tagName).toBe('IMG');
    expect(wrapper.attributes('src')).toBe('/missing.png');
    expect(wrapper.attributes('alt')).toBe('Missing image');
    expect(wrapper.element.children).toHaveLength(0);
    expect(wrapper.classes()).not.toContain('fui-Image--error');
  });

  it('exposes only the native image element', () => {
    const wrapper = mount(Image);
    const exposed = wrapper.vm as unknown as {
      element: HTMLImageElement;
      focus?: () => void;
    };

    expect(exposed.element).toBe(wrapper.element);
    expect(exposed.element).toBeInstanceOf(HTMLImageElement);
    expect(exposed.focus).toBeUndefined();
  });
});
