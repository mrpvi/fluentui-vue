import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import Text from '../src/components/Text/Text.vue';
import type {
  TextAlign,
  TextFont,
  TextSize,
  TextTag,
  TextWeight,
} from '../src/components/Text/Text.types';

const tags: TextTag[] = [
  'span',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'pre',
  'strong',
  'b',
  'em',
  'i',
];

describe('FText', () => {
  it('renders one span root with upstream defaults', () => {
    const wrapper = mount(Text, { slots: { default: 'Hello' } });

    expect(wrapper.element.tagName).toBe('SPAN');
    expect(wrapper.text()).toBe('Hello');
    expect(wrapper.element.children).toHaveLength(0);
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'fui-Text',
        'fui-Text--align-start',
        'fui-Text--font-base',
        'fui-Text--size-300',
        'fui-Text--weight-regular',
      ]),
    );
  });

  it.each(tags)('renders the supported %s semantic root', tag => {
    const wrapper = mount(Text, { props: { as: tag } });
    expect(wrapper.element.tagName.toLowerCase()).toBe(tag);
  });

  it('forwards native attributes, listeners, class, and style to the root', async () => {
    const onClick = vi.fn();
    const wrapper = mount(Text, {
      attrs: {
        id: 'description',
        lang: 'en',
        'aria-label': 'Description',
        'data-kind': 'summary',
        class: 'custom',
        style: 'color: rebeccapurple',
        onClick,
      },
    });

    expect(wrapper.attributes('id')).toBe('description');
    expect(wrapper.attributes('lang')).toBe('en');
    expect(wrapper.attributes('aria-label')).toBe('Description');
    expect(wrapper.attributes('data-kind')).toBe('summary');
    expect(wrapper.classes()).toContain('custom');
    expect(wrapper.attributes('style')).toContain('color: rebeccapurple');

    await wrapper.trigger('click');
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('applies layout and decoration modifiers', () => {
    const wrapper = mount(Text, {
      props: {
        block: true,
        wrap: false,
        truncate: true,
        italic: true,
        underline: true,
        strikethrough: true,
      },
    });

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'fui-Text--block',
        'fui-Text--nowrap',
        'fui-Text--truncate',
        'fui-Text--italic',
        'fui-Text--underline',
        'fui-Text--strikethrough',
      ]),
    );
  });

  it('does not make truncate imply block or nowrap', () => {
    const wrapper = mount(Text, { props: { truncate: true } });

    expect(wrapper.classes()).toContain('fui-Text--truncate');
    expect(wrapper.classes()).not.toContain('fui-Text--block');
    expect(wrapper.classes()).not.toContain('fui-Text--nowrap');
  });

  it.each<TextSize>([100, 200, 300, 400, 500, 600, 700, 800, 900, 1000])(
    'applies size %s',
    size => {
      expect(mount(Text, { props: { size } }).classes()).toContain(`fui-Text--size-${size}`);
    },
  );

  it.each<TextFont>(['base', 'monospace', 'numeric'])('applies the %s font', font => {
    expect(mount(Text, { props: { font } }).classes()).toContain(`fui-Text--font-${font}`);
  });

  it.each<TextWeight>(['regular', 'medium', 'semibold', 'bold'])(
    'applies the %s weight',
    weight => {
      expect(mount(Text, { props: { weight } }).classes()).toContain(
        `fui-Text--weight-${weight}`,
      );
    },
  );

  it.each<TextAlign>(['start', 'center', 'end', 'justify'])(
    'applies the %s alignment',
    align => {
      expect(mount(Text, { props: { align } }).classes()).toContain(
        `fui-Text--align-${align}`,
      );
    },
  );

  it('exposes only the native root element', () => {
    const wrapper = mount(Text);
    const vm = wrapper.vm as unknown as { element: HTMLElement; focus?: () => void };

    expect(vm.element).toBe(wrapper.element);
    expect(vm.focus).toBeUndefined();
  });

  it('does not define component-specific emitted events', () => {
    const wrapper = mount(Text);

    expect(wrapper.emitted()).toEqual({});
  });
});
