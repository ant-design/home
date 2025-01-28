import InternalBadge from './Badge';
import Ribbon from './Ribbon';

export type { BadgeProps } from './Badge';
export type { ScrollNumberProps } from './ScrollNumber';

type CompoundedComponent = typeof InternalBadge & {
  Ribbon: typeof Ribbon;
};

const Badge = InternalBadge as CompoundedComponent;

Badge.Ribbon = Ribbon;

export default Badge;
