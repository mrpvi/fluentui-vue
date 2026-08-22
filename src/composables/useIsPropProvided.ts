import { getCurrentInstance } from 'vue';

export function useIsPropProvided(propName: string): boolean {
  const instance = getCurrentInstance();

  if (!instance) {
    throw new Error('useIsPropProvided must be called during component setup.');
  }

  return Object.prototype.hasOwnProperty.call(instance.vnode.props ?? {}, propName);
}
