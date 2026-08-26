import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';
import Portal from '../src/components/Portal/Portal.vue';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('FPortal', () => {
  it('teleports content to the body by default', async () => {
    const wrapper = mount(Portal, {
      slots: { default: '<span class="portal-content">Content</span>' },
    });
    await nextTick();
    expect(document.body.querySelector('.portal-content')).not.toBeNull();
    expect(wrapper.find('.portal-content').exists()).toBe(false);
  });

  it('supports a custom mount node and disabled inline rendering', async () => {
    const target = document.createElement('div');
    target.id = 'portal-target';
    document.body.append(target);
    const wrapper = mount(Portal, {
      props: { mountNode: '#portal-target', disabled: true },
      slots: { default: '<span class="portal-content">Inline</span>' },
    });
    await nextTick();
    expect(wrapper.get('.portal-content').text()).toBe('Inline');
    expect(target.querySelector('.portal-content')).toBeNull();
  });
});
