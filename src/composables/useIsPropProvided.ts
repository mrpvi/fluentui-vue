import { getCurrentInstance } from 'vue';

export function useIsPropProvided(propName: string): boolean {
  const instance = getCurrentInstance();

  if (!instance) {
    throw new Error('useIsPropProvided must be called during component setup.');
  }

  const vnodeProps = instance.vnode.props ?? {};
  if (Object.prototype.hasOwnProperty.call(vnodeProps, propName)) {
    return true;
  }

  const kebabName = propName.replace(/\B([A-Z])/g, '-$1').toLowerCase();
  return Object.prototype.hasOwnProperty.call(vnodeProps, kebabName);
}
