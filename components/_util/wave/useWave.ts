import * as React from 'react';
import useEvent from 'rc-util/lib/hooks/useEvent';
import raf from 'rc-util/lib/raf';
import showWaveEffect from './WaveEffect';
import { ConfigContext } from '../../config-provider';
import useToken from '../../theme/useToken';
import { TARGET_CLS, type ShowWave } from './interface';

export default function useWave(
  nodeRef: React.RefObject<HTMLElement>,
  className: string,
  component?: string,
) {
  const { wave } = React.useContext(ConfigContext);
  const [, token] = useToken();

  const showWave = useEvent<ShowWave>((event) => {
    const node = nodeRef.current!;

    if (wave?.disabled || !node) {
      return;
    }

    const targetNode = node.querySelector<HTMLElement>(`.${TARGET_CLS}`) || node;

    const { showEffect } = wave || {};

    // Customize wave effect
    (showEffect || showWaveEffect)(targetNode, { className, token, component, event });
  });

  const rafId = React.useRef<number>();

  // Merge trigger event into one for each frame
  const showDebounceWave: ShowWave = (event) => {
    raf.cancel(rafId.current!);

    rafId.current = raf(() => {
      showWave(event);
    });
  };

  return showDebounceWave;
}
