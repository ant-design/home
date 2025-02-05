import * as React from 'react';

import useForceUpdate from '../_util/hooks/useForceUpdate';
import { cloneElement } from '../_util/reactNode';
import type { StatisticProps } from './Statistic';
import Statistic from './Statistic';
import type { valueType } from './utils';
import { formatCountdown } from './utils';

const REFRESH_INTERVAL = 1000 / 30;

export interface CountdownProps extends StatisticProps {
  format?: string;
  onFinish?: () => void;
  onChange?: (value?: valueType) => void;
  isPaused?: boolean;
}

function getTime(value?: valueType) {
  return new Date(value as valueType).getTime();
}

const Countdown: React.FC<CountdownProps> = (props) => {
  const { value, format = 'HH:mm:ss', onChange, onFinish, isPaused, ...rest } = props;

  const forceUpdate = useForceUpdate();

  const countdown = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const pauseStartTime = React.useRef<number | null>(null);
  const [pauseDuration, setPauseDuration] = React.useState(0);

  const stopTimer = () => {
    onFinish?.();
    if (countdown.current) {
      clearInterval(countdown.current);
      countdown.current = null;
    }
  };

  const updatePauseDuration = () => {
    if (isPaused) {
      pauseStartTime.current = Date.now();
    } else if (pauseStartTime.current !== null) {
      setPauseDuration(pauseDuration + (Date.now() - pauseStartTime.current));
      pauseStartTime.current = null;
    }
  };

  const updateCountdown = () => {
    const timestamp = getTime(value) - pauseDuration;
    if (timestamp >= Date.now()) {
      forceUpdate();
      onChange?.(timestamp - Date.now());
    } else {
      stopTimer();
    }
  };

  const syncTimer = () => {
    countdown.current = setInterval(() => {
      if (!isPaused) {
        updateCountdown();
      }
    }, REFRESH_INTERVAL);
  };

  React.useEffect(() => {
    updatePauseDuration();
    syncTimer();

    return () => {
      if (countdown.current) {
        clearInterval(countdown.current);
        countdown.current = null;
      }
    };
  }, [value, isPaused]);

  const formatter: StatisticProps['formatter'] = (formatValue, config) =>
    formatCountdown(formatValue, { ...config, format }, pauseDuration);

  const valueRender: StatisticProps['valueRender'] = (node) =>
    cloneElement(node, { title: undefined });

  return <Statistic {...rest} value={value} valueRender={valueRender} formatter={formatter} />;
};

export default React.memo(Countdown);
