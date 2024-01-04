import type { ComponentProps, FC } from 'react';
import React, { useEffect, useState } from 'react';
import { EditFilled } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { createStyles } from 'antd-style';
import SourceCodeEditor from 'dumi/theme-default/slots/SourceCodeEditor';

import useLocale from '../../hooks/useLocale';
import LiveError from '../slots/LiveError';

const useStyle = createStyles(({ token, css }) => {
  const { colorPrimaryBorder, colorIcon, colorPrimary } = token;

  return {
    editor: css`
      .npm__react-simple-code-editor__textarea {
        outline: none;

        &:hover {
          box-shadow: inset 0 0 0 1px ${colorPrimaryBorder} !important;
        }

        &:focus {
          box-shadow: inset 0 0 0 1px ${colorPrimary} !important;
        }
      }

      // override dumi editor styles
      .dumi-default-source-code-editor {
        .dumi-default-source-code > pre,
        .dumi-default-source-code-editor-textarea {
          padding: 12px 16px;
        }

        .dumi-default-source-code > pre {
          font-size: 13px;
          line-height: 2;
          font-family: 'Lucida Console', Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
        }

        // disable dumi default copy button
        .dumi-default-source-code-copy {
          display: none;
        }
      }
    `,

    editableIcon: css`
      position: absolute;
      z-index: 2;
      height: 32px;
      width: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      top: 16px;
      inset-inline-end: 56px;
      color: ${colorIcon};
    `,
  };
});

const locales = {
  cn: {
    demoEditable: '编辑 Demo 可实时预览',
  },
  en: {
    demoEditable: 'Edit demo with real-time preview',
  },
};

const HIDE_LIVE_DEMO_TIP = 'hide-live-demo-tip';

const LiveCode: FC<{
  lang: ComponentProps<typeof SourceCodeEditor>['lang'];
  initialValue: ComponentProps<typeof SourceCodeEditor>['initialValue'];
  liveError?: string;
  onTranspile?: (code: string) => void;
}> = (props) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string>();
  const { styles } = useStyle();
  const [locale] = useLocale(locales);

  useEffect(() => {
    const shouldOpen = !localStorage.getItem(HIDE_LIVE_DEMO_TIP);
    if (shouldOpen) {
      setOpen(true);
    }
  }, []);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      localStorage.setItem(HIDE_LIVE_DEMO_TIP, 'true');
    }
  };

  return (
    <>
      <div className={styles.editor}>
        <SourceCodeEditor
          lang={props.lang}
          initialValue={props.initialValue}
          onTranspile={({ err, code }) => {
            if (err) {
              setError(err.toString());
            } else {
              setError(undefined);
              props.onTranspile?.(code);
            }
          }}
        />
        <LiveError error={props.liveError || error} />
      </div>
      <Tooltip title={locale.demoEditable} open={open} onOpenChange={handleOpenChange}>
        <EditFilled className={styles.editableIcon} />
      </Tooltip>
    </>
  );
};

export default LiveCode;
