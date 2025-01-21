import path from 'path';
import React from 'react';
// Reference: https://github.com/ant-design/ant-design/pull/24003#discussion_r427267386
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import rcWarning from '@rc-component/util/lib/warning';
import { extractStaticStyle } from 'antd-style';
import dayjs from 'dayjs';
import fse from 'fs-extra';
import { globSync } from 'glob';
import { JSDOM } from 'jsdom';
import MockDate from 'mockdate';
import type { HTTPRequest } from 'puppeteer';
import rcWarning from 'rc-util/lib/warning';
import ReactDOMServer from 'react-dom/server';

import { App, ConfigProvider, theme } from '../../components';
import { fillWindowEnv } from '../setup';
import { render } from '../utils';
import { TriggerMockContext } from './demoTestContext';

jest.mock('../../components/grid/hooks/useBreakpoint', () => () => ({}));

const snapshotPath = path.join(process.cwd(), 'imageSnapshots');
fse.ensureDirSync(snapshotPath);

const themes = {
  default: theme.defaultAlgorithm,
  dark: theme.darkAlgorithm,
  compact: theme.compactAlgorithm,
};

interface ImageTestOptions {
  onlyViewport?: boolean;
  ssr?: boolean;
  openTriggerClassName?: string;
}

// eslint-disable-next-line jest/no-export
export default function imageTest(
  component: React.ReactElement,
  identifier: string,
  options: ImageTestOptions,
) {
  let doc: Document;
  let container: HTMLDivElement;

  beforeAll(async () => {
    const dom = new JSDOM('<!DOCTYPE html><body></body></html>', {
      url: 'http://localhost/',
    });
    const win = dom.window;
    doc = win.document;

    (global as any).window = win;

    // Fill env
    const keys = [
      ...Object.keys(win),
      'HTMLElement',
      'SVGElement',
      'ShadowRoot',
      'Element',
      'File',
      'Blob',
    ].filter((key) => !(global as any)[key]);

    keys.forEach((key) => {
      (global as any)[key] = win[key];
    });

    // Fake Resize Observer
    global.ResizeObserver = function FakeResizeObserver() {
      return {
        observe() {},
        unobserve() {},
        disconnect() {},
      };
    } as unknown as typeof ResizeObserver;

    // Fake promise not called
    global.fetch = function mockFetch() {
      return {
        then() {
          return this;
        },
        catch() {
          return this;
        },
        finally() {
          return this;
        },
      };
    } as unknown as typeof fetch;

    // Fake matchMedia
    win.matchMedia = (() => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    })) as unknown as typeof matchMedia;

    // Fill window
    fillWindowEnv(win);

    await page.setRequestInterception(true);
  });

  beforeEach(() => {
    doc.body.innerHTML = `<div id="root"></div>`;
    container = doc.querySelector<HTMLDivElement>('#root')!;
  });

  function test(name: string, suffix: string, themedComponent: React.ReactElement) {
    it(name, async () => {
      await page.setViewport({ width: 800, height: 600 });

      const onRequestHandle = (request: HTTPRequest) => {
        if (['image'].includes(request.resourceType())) {
          request.abort();
        } else {
          request.continue();
        }
      };

      const { openTriggerClassName } = options;

      const requestListener = (request: any) => onRequestHandle(request as HTTPRequest);

      MockDate.set(dayjs('2016-11-22').valueOf());
      page.on('request', requestListener);
      await page.goto(`file://${process.cwd()}/tests/index.html`);
      await page.addStyleTag({ path: `${process.cwd()}/components/style/reset.css` });
      await page.addStyleTag({ content: '*{animation: none!important;}' });

      const cache = createCache();

      const emptyStyleHolder = doc.createElement('div');

      let element = (
        <StyleProvider cache={cache} container={emptyStyleHolder}>
          <App>{themedComponent}</App>
        </StyleProvider>
      );

      // Do inject open trigger
      if (openTriggerClassName) {
        element = <TriggerMockContext value={{ popupVisible: true }}>{element}</TriggerMockContext>;
      }

      let html: string;
      let styleStr: string;

      if (options.ssr) {
        html = ReactDOMServer.renderToString(element);
        styleStr = extractStyle(cache) + extractStaticStyle(html).map((item) => item.tag);
      } else {
        const { unmount } = render(element, {
          container,
        });
        html = container.innerHTML;
        styleStr = extractStyle(cache) + extractStaticStyle(html).map((item) => item.tag);
        // We should extract style before unmount
        unmount();
      }

      if (openTriggerClassName) {
        styleStr += `<style>
          .${openTriggerClassName} {
            position: relative !important;
            left: 0 !important;
            top: 0 !important;
            opacity: 1 !important;
            display: inline-block !important;
            vertical-align: top !important;
          }
        </style>`;
      }

      await page.evaluate(
        (innerHTML: string, ssrStyle: string, triggerClassName?: string) => {
          const root = document.querySelector<HTMLDivElement>('#root')!;
          root.innerHTML = innerHTML;
          const head = document.querySelector<HTMLElement>('head')!;
          head.innerHTML += ssrStyle;
          // Inject open trigger with block style
          if (triggerClassName) {
            document.querySelectorAll<HTMLElement>(`.${triggerClassName}`).forEach((node) => {
              const blockStart = document.createElement('div');
              const blockEnd = document.createElement('div');
              node.parentNode?.insertBefore(blockStart, node);
              node.parentNode?.insertBefore(blockEnd, node.nextSibling);
            });
          }
        },
        html,
        styleStr,
        openTriggerClassName || '',
      );

      if (!options.onlyViewport) {
        // Get scroll height of the rendered page and set viewport
        const bodyHeight = await page.evaluate(() => document.body.scrollHeight);

        // loooooong image
        rcWarning(
          bodyHeight < 4096, // Expected height
          `[IMAGE TEST] [${identifier}] may cause screenshots to be very long and unacceptable.
            Please consider using \`onlyViewport: ["filename.tsx"]\`, read more: https://github.com/ant-design/ant-design/pull/52053`,
        );

        await page.setViewport({ width: 800, height: bodyHeight });
      }

      const image = await page.screenshot({
        fullPage: !options.onlyViewport,
      });

      await fse.writeFile(path.join(snapshotPath, `${identifier}${suffix}.png`), image);

      MockDate.reset();
      page.off('request', requestListener);
    });
  }

  Object.entries(themes).forEach(([key, algorithm]) => {
    const configTheme = {
      algorithm,
      token: {
        fontFamily: 'Arial',
      },
    };

    test(
      `component image screenshot should correct ${key}`,
      `.${key}`,
      <div style={{ background: key === 'dark' ? '#000' : '', padding: `24px 12px` }} key={key}>
        <ConfigProvider theme={configTheme}>{component}</ConfigProvider>
      </div>,
    );
    test(
      `[CSS Var] component image screenshot should correct ${key}`,
      `.${key}.css-var`,
      <div style={{ background: key === 'dark' ? '#000' : '', padding: `24px 12px` }} key={key}>
        <ConfigProvider theme={{ ...configTheme }}>{component}</ConfigProvider>
      </div>,
    );
  });
}

type Options = {
  skip?: boolean | string[];
  onlyViewport?: boolean | string[];
  /** Use SSR render instead. Only used when the third part deps component */
  ssr?: boolean;
  /** Open Trigger to check the popup render */
  openTriggerClassName?: string;
};

// eslint-disable-next-line jest/no-export
export function imageDemoTest(component: string, options: Options = {}) {
  let describeMethod = options.skip === true ? describe.skip : describe;
  const files = globSync(`./components/${component}/demo/*.tsx`).filter(
    (file) => !file.includes('_semantic'),
  );

  files.forEach((file) => {
    if (Array.isArray(options.skip) && options.skip.some((c) => file.endsWith(c))) {
      describeMethod = describe.skip;
    } else {
      describeMethod = describe;
    }
    describeMethod(`Test ${file} image`, () => {
      let Demo = require(`../../${file}`).default;
      if (typeof Demo === 'function') {
        Demo = <Demo />;
      }
      imageTest(Demo, `${component}-${path.basename(file, '.tsx')}`, {
        onlyViewport:
          options.onlyViewport === true ||
          (Array.isArray(options.onlyViewport) &&
            options.onlyViewport.some((c) => file.endsWith(c))),
        ssr: options.ssr,
        openTriggerClassName: options.openTriggerClassName,
      });
    });
  });
}
