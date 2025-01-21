import React, { Suspense, useContext } from 'react';
import { BugOutlined, CodeOutlined, ExperimentOutlined } from '@ant-design/icons';
import { css, Global } from '@emotion/react';
import { Button, ConfigProvider, Tooltip } from 'antd';
import classNames from 'classnames';
import { DumiDemo, DumiDemoGrid, FormattedMessage } from 'dumi';

import useLayoutState from '../../../hooks/useLayoutState';
import useLocale from '../../../hooks/useLocale';
import DemoContext from '../../slots/DemoContext';
import DemoFallback from '../Previewer/DemoFallback';

const locales = {
  cn: {
    enableCssVar: '启用 CSS 变量',
    disableCssVar: '禁用 CSS 变量',
  },
  en: {
    enableCssVar: 'Enable CSS Var',
    disableCssVar: 'Disable CSS Var',
  },
};

const DemoWrapper: typeof DumiDemoGrid = ({ items }) => {
  const { showDebug, setShowDebug } = useContext(DemoContext);
  const [locale] = useLocale(locales);

  const [expandAll, setExpandAll] = useLayoutState(false);
  const [enableCssVar, setEnableCssVar] = useLayoutState(true);

  const handleVisibleToggle = () => {
    setShowDebug?.(!showDebug);
  };

  const handleExpandToggle = () => {
    setExpandAll(!expandAll);
  };

  const handleCssVarToggle = () => {
    setEnableCssVar((v) => !v);
  };

  const demos = React.useMemo(
    () =>
      items.map((item: any) => {
        const { previewerProps } = item;
        const { debug } = previewerProps;
        return {
          ...item,
          previewerProps: {
            ...item.previewerProps,
            expand: expandAll,
            // always override debug property, because dumi will hide debug demo in production
            debug: false,
            /**
             * antd extra marker for the original debug
             * @see https://github.com/ant-design/ant-design/pull/40130#issuecomment-1380208762
             */
            originDebug: debug,
          },
        };
      }),
    [expandAll, showDebug],
  );

  return (
    <div
      className={classNames('demo-wrapper', {
        'demo-wrapper-show-debug': showDebug,
      })}
    >
      <Global
        styles={css`
          :root {
            --antd-site-api-deprecated-display: ${showDebug ? 'table-row' : 'none'};
          }
        `}
      />
      <span className="all-code-box-controls">
        <Tooltip
          title={
            <FormattedMessage id={`app.component.examples.${expandAll ? 'collapse' : 'expand'}`} />
          }
        >
          <Button
            type="text"
            size="small"
            icon={<CodeOutlined />}
            onClick={handleExpandToggle}
            className={expandAll ? 'icon-enabled' : ''}
          />
        </Tooltip>
        <Tooltip
          title={
            <FormattedMessage id={`app.component.examples.${showDebug ? 'hide' : 'visible'}`} />
          }
        >
          <Button
            type="text"
            size="small"
            icon={<BugOutlined />}
            onClick={handleVisibleToggle}
            className={showDebug ? 'icon-enabled' : ''}
          />
        </Tooltip>
        <Tooltip title={enableCssVar ? locale.disableCssVar : locale.enableCssVar}>
          <Button
            type="text"
            size="small"
            icon={<ExperimentOutlined />}
            onClick={handleCssVarToggle}
            className={enableCssVar ? 'icon-enabled' : ''}
          />
        </Tooltip>
      </span>
      <ConfigProvider theme={{ hashed: !enableCssVar }}>
        <DumiDemoGrid
          items={demos}
          demoRender={(item) => (
            <Suspense fallback={<DemoFallback />}>
              <DumiDemo key={item.demo.id} {...item} />
            </Suspense>
          )}
        />
      </ConfigProvider>
    </div>
  );
};

export default DemoWrapper;
