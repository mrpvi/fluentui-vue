import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Overflow from '../src/components/Overflow/Overflow.vue';
import OverflowDivider from '../src/components/OverflowDivider/OverflowDivider.vue';
import OverflowItem from '../src/components/OverflowItem/OverflowItem.vue';

const components = { Overflow, OverflowItem, OverflowDivider };

class ResizeObserverMock {
  constructor(_callback: ResizeObserverCallback) {}
  observe() {}
  disconnect() {}
  unobserve() {}
}

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', ResizeObserverMock);
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    callback(0);
    return 1;
  });
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: HTMLElement,
  ) {
    const width = Number(this.dataset.width ?? 0);
    return {
      width,
      height: width,
      top: 0,
      right: width,
      bottom: width,
      left: 0,
      x: 0,
      y: 0,
      toJSON() {},
    };
  });
});

afterEach(() => vi.unstubAllGlobals());

function setClientWidth(element: HTMLElement, width: number) {
  Object.defineProperty(element, 'clientWidth', { configurable: true, value: width });
}

async function updateOverflow(wrapper: ReturnType<typeof mount>) {
  const component = wrapper.getComponent(Overflow);
  await component.vm.$nextTick();
  (component.vm as unknown as { updateOverflow: () => void }).updateOverflow();
  await new Promise((resolve) => setTimeout(resolve, 0));
}

describe('FOverflow family', () => {
  it('renders deterministic SSR-safe markup before measurements', () => {
    const wrapper = mount({
      components,
      template: `<Overflow><OverflowItem id="one">One</OverflowItem><OverflowItem id="two">Two</OverflowItem></Overflow>`,
    });
    expect(wrapper.findAll('[data-overflow-item]')).toHaveLength(2);
    expect(wrapper.get('.fui-Overflow').attributes('data-overflowing')).toBe('false');
  });

  it('hides lowest priority end items and emits visibility state', async () => {
    const onChange = vi.fn();
    const wrapper = mount({
      components,
      methods: { onChange },
      template: `
        <Overflow @overflow-change="onChange">
          <OverflowItem id="one" :priority="2" data-width="40">One</OverflowItem>
          <OverflowItem id="two" :priority="0" data-width="40">Two</OverflowItem>
          <OverflowItem id="three" :priority="0" data-width="40">Three</OverflowItem>
        </Overflow>
      `,
    });
    const root = wrapper.get<HTMLElement>('.fui-Overflow').element;
    setClientWidth(root, 80);
    await updateOverflow(wrapper);
    expect(wrapper.get('[data-overflow-item="three"]').attributes('hidden')).toBeDefined();
    expect(wrapper.get('[data-overflow-item="one"]').attributes('hidden')).toBeUndefined();
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ hasOverflow: true, overflowCount: 1 }),
    );
  });

  it('keeps pinned and minimum visible items', async () => {
    const wrapper = mount({
      components,
      template: `
        <Overflow :minimum-visible="2">
          <OverflowItem id="one" pinned data-width="50">One</OverflowItem>
          <OverflowItem id="two" data-width="50">Two</OverflowItem>
          <OverflowItem id="three" data-width="50">Three</OverflowItem>
        </Overflow>
      `,
    });
    setClientWidth(wrapper.get<HTMLElement>('.fui-Overflow').element, 40);
    await updateOverflow(wrapper);
    expect(wrapper.findAll('[data-overflow-item]:not([hidden])')).toHaveLength(2);
    expect(wrapper.get('[data-overflow-item="one"]').attributes('hidden')).toBeUndefined();
  });

  it('tracks group visibility and hides group dividers', async () => {
    const wrapper = mount({
      components,
      template: `
        <Overflow>
          <OverflowItem id="one" group-id="primary" data-width="60">One</OverflowItem>
          <OverflowDivider group-id="primary" data-width="4">|</OverflowDivider>
          <OverflowItem id="two" group-id="secondary" data-width="60">Two</OverflowItem>
        </Overflow>
      `,
    });
    setClientWidth(wrapper.get<HTMLElement>('.fui-Overflow').element, 60);
    await updateOverflow(wrapper);
    expect(wrapper.get('[data-overflow-divider="primary"]').attributes('hidden')).toBeDefined();
    expect(wrapper.get('[data-overflow-item="one"]').attributes('hidden')).toBeUndefined();
    expect(wrapper.get('[data-overflow-item="two"]').attributes('hidden')).toBeDefined();
  });

  it('disconnects observers and cancels pending measurement on unmount', () => {
    const disconnect = vi.spyOn(ResizeObserverMock.prototype, 'disconnect');
    const wrapper = mount({
      components,
      template: `<Overflow><OverflowItem id="one">One</OverflowItem></Overflow>`,
    });
    wrapper.unmount();
    expect(disconnect).toHaveBeenCalled();
    expect(cancelAnimationFrame).toHaveBeenCalled();
  });
});
