import * as React from 'react';
import EnterOutlined from '@ant-design/icons/EnterOutlined';
import type { TextAreaProps } from '@rc-component/textarea';
import KeyCode from '@rc-component/util/lib/KeyCode';
import classNames from 'classnames';

import { cloneElement } from '../_util/reactNode';
import type { DirectionType } from '../config-provider';
import type { TextAreaRef } from '../input/TextArea';
import TextArea from '../input/TextArea';
import useStyle from './style';

interface EditableProps {
  prefixCls: string;
  value: string;
  'aria-label'?: string;
  onSave: (value: string) => void;
  onCancel: () => void;
  onEnd?: () => void;
  className?: string;
  style?: React.CSSProperties;
  direction?: DirectionType;
  maxLength?: number;
  autoSize?: TextAreaProps['autoSize'];
  enterIcon?: React.ReactNode;
  component?: string;
}

const Editable: React.FC<EditableProps> = (props) => {
  const {
    prefixCls,
    'aria-label': ariaLabel,
    className,
    style,
    direction,
    maxLength,
    autoSize = true,
    value,
    onSave,
    onCancel,
    onEnd,
    component,
    enterIcon = <EnterOutlined />,
  } = props;
  const ref = React.useRef<TextAreaRef>(null);

  const inComposition = React.useRef(false);
  const lastKeyCode = React.useRef<number>(null);

  const [current, setCurrent] = React.useState(value);

  React.useEffect(() => {
    setCurrent(value);
  }, [value]);

  React.useEffect(() => {
    if (ref.current?.resizableTextArea) {
      const { textArea } = ref.current.resizableTextArea;
      textArea.focus();
      const { length } = textArea.value;
      textArea.setSelectionRange(length, length);
    }
  }, []);

  const onChange: React.ChangeEventHandler<HTMLTextAreaElement> = ({ target }) => {
    setCurrent(target.value.replace(/[\n\r]/g, ''));
  };

  const onCompositionStart = () => {
    inComposition.current = true;
  };

  const onCompositionEnd = () => {
    inComposition.current = false;
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = ({ keyCode }) => {
    // We don't record keyCode when IME is using
    if (inComposition.current) return;

    lastKeyCode.current = keyCode;
  };

  const confirmChange = () => {
    onSave(current.trim());
  };

  const onKeyUp: React.KeyboardEventHandler<HTMLTextAreaElement> = ({
    keyCode,
    ctrlKey,
    altKey,
    metaKey,
    shiftKey,
  }) => {
    // Check if it's a real key
    if (
      lastKeyCode.current !== keyCode ||
      inComposition.current ||
      ctrlKey ||
      altKey ||
      metaKey ||
      shiftKey
    ) {
      return;
    }
    if (keyCode === KeyCode.ENTER) {
      confirmChange();
      onEnd?.();
    } else if (keyCode === KeyCode.ESC) {
      onCancel();
    }
  };

  const onBlur: React.FocusEventHandler<HTMLTextAreaElement> = () => {
    confirmChange();
  };

  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  const textAreaClassName = classNames(
    prefixCls,
    `${prefixCls}-edit-content`,
    {
      [`${prefixCls}-rtl`]: direction === 'rtl',
      [`${prefixCls}-${component}`]: !!component,
    },
    className,
    hashId,
    cssVarCls,
  );

  return wrapCSSVar(
    <div className={textAreaClassName} style={style}>
      <TextArea
        ref={ref}
        maxLength={maxLength}
        value={current}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
        onBlur={onBlur}
        aria-label={ariaLabel}
        rows={1}
        autoSize={autoSize}
      />
      {enterIcon !== null
        ? cloneElement(enterIcon, { className: `${prefixCls}-edit-content-confirm` })
        : null}
    </div>,
  );
};

export default Editable;
