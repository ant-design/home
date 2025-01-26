import InternalAvatar from './avatar';
import AvatarGroup from './group';

export type { AvatarProps } from './avatar';
export type {
  AvatarGroupProps,
  /** @deprecated Please use `AvatarGroupProps` */
  AvatarGroupProps as GroupProps,
} from './group';
export { AvatarGroup as Group };

type CompoundedComponent = typeof InternalAvatar & {
  Group: typeof AvatarGroup;
};

const Avatar = InternalAvatar as CompoundedComponent;

Avatar.Group = AvatarGroup;

export default Avatar;
