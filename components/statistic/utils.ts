import type * as React from 'react';

export type valueType = number | string;
// countdownValueType is deprecated but still support
export type countdownValueType = number | string;

export type Formatter =
  | false
  | 'number'
  | 'countdown'
  | ((value: valueType, config?: FormatConfig) => React.ReactNode);

export interface FormatConfig {
  formatter?: Formatter;
  decimalSeparator?: string;
  groupSeparator?: string;
  precision?: number;
}

export interface CountdownFormatConfig extends FormatConfig {
  format?: string;
}

// Countdown
const timeUnits: [string, number][] = [
  ['Y', 1000 * 60 * 60 * 24 * 365], // years
  ['M', 1000 * 60 * 60 * 24 * 30], // months
  ['D', 1000 * 60 * 60 * 24], // days
  ['H', 1000 * 60 * 60], // hours
  ['m', 1000 * 60], // minutes
  ['s', 1000], // seconds
  ['S', 1], // million seconds
];

export function formatTimeStr(duration: number, format: string) {
  let leftDuration: number = duration;

  const escapeRegex = /\[[^\]]*]/g;
  const keepList: string[] = (format.match(escapeRegex) || []).map((str) => str.slice(1, -1));
  const templateText = format.replace(escapeRegex, '[]');

  const replacedText = timeUnits.reduce((current, [name, unit]) => {
    if (current.includes(name)) {
      const value = Math.floor(leftDuration / unit);
      leftDuration -= value * unit;
      return current.replace(new RegExp(`${name}+`, 'g'), (match: string) => {
        const len = match.length;
        return value.toString().padStart(len, '0');
      });
    }
    return current;
  }, templateText);

  let index = 0;
  return replacedText.replace(escapeRegex, () => {
    const match = keepList[index];
    index += 1;
    return match;
  });
}

export function formatCountdown(
  value: valueType,
  config: CountdownFormatConfig,
  pauseDuration: number,
) {
  const { format = '' } = config;
  const target = new Date(value).getTime() + pauseDuration;
  const current = Date.now();
  const diff = Math.max(target - current, 0);

  return formatTimeStr(diff, format);
}
