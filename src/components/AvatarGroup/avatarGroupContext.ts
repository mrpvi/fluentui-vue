import type { ComputedRef, InjectionKey } from 'vue';
import type { AvatarShape, AvatarSize } from '../Avatar';
import type { AvatarGroupLayout } from './AvatarGroup.types';

export interface AvatarGroupContextValue {
  isOverflow: ComputedRef<boolean>;
  layout: ComputedRef<AvatarGroupLayout>;
  shape: ComputedRef<AvatarShape>;
  size: ComputedRef<AvatarSize>;
}

export const avatarGroupContextKey: InjectionKey<AvatarGroupContextValue> =
  Symbol('fui-avatar-group');
