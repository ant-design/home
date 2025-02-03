import type { AlignType, BuildInPlacements } from '@rc-component/trigger';

import type { PopupOverflow } from '../config-provider/context';
import type { AdjustOverflow } from '../_util/placements';

interface MergedPlacementsConfig {
  buildInPlacements?: BuildInPlacements;
  popupOverflow?: PopupOverflow;
  autoAdjustOverflow?: boolean | AdjustOverflow;
}

const getOverflow = (autoAdjustOverflow?: boolean | AdjustOverflow): AlignType['overflow'] => {
  if (autoAdjustOverflow === false) {
    return {
      adjustX: false,
      adjustY: false,
    };
  }
  const overflow =
    autoAdjustOverflow && typeof autoAdjustOverflow === 'object' ? autoAdjustOverflow : {};

  return {
    adjustX: true,
    adjustY: true,
    shiftY: true,
    ...overflow,
  };
};

const getBuiltInPlacements = (
  popupOverflow?: PopupOverflow,
  autoAdjustOverflow?: boolean | AdjustOverflow,
): Record<string, AlignType> => {
  const htmlRegion: AlignType['htmlRegion'] = popupOverflow === 'scroll' ? 'scroll' : 'visible';

  const sharedConfig: AlignType = {
    overflow: getOverflow(autoAdjustOverflow),
    htmlRegion,
    dynamicInset: true,
  };

  return {
    bottomLeft: {
      ...sharedConfig,
      points: ['tl', 'bl'],
      offset: [0, 4],
    },
    bottomRight: {
      ...sharedConfig,
      points: ['tr', 'br'],
      offset: [0, 4],
    },
    topLeft: {
      ...sharedConfig,
      points: ['bl', 'tl'],
      offset: [0, -4],
    },
    topRight: {
      ...sharedConfig,
      points: ['br', 'tr'],
      offset: [0, -4],
    },
  };
};

function mergedBuiltinPlacements(config: MergedPlacementsConfig) {
  const { buildInPlacements, popupOverflow, autoAdjustOverflow } = config;

  return buildInPlacements || getBuiltInPlacements(popupOverflow, autoAdjustOverflow);
}

export default mergedBuiltinPlacements;
