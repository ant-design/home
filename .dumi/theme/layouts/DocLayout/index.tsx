import classNames from 'classnames';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { Helmet, useOutlet, useSiteData } from 'dumi';
import React, { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import zhCN from 'antd/es/locale/zh_CN';
import ConfigProvider from 'antd/es/config-provider';
import useLocale from '../../../hooks/useLocale';
import useLocation from '../../../hooks/useLocation';
import GlobalStyles from '../../common/GlobalStyles';
import Footer from '../../slots/Footer';
import Header from '../../slots/Header';
import SiteContext from '../../slots/SiteContext';
import '../../static/style';
import ResourceLayout from '../ResourceLayout';
import SidebarLayout from '../SidebarLayout';

const locales = {
  cn: {
    title: 'Ant Design - 一套企业级 UI 设计语言和 React 组件库',
    description: '基于 Ant Design 设计体系的 React UI 组件库，用于研发企业级中后台产品。',
  },
  en: {
    title: "Ant Design - The world's second most popular React UI framework",
    description:
      'An enterprise-class UI design language and React UI library with a set of high-quality React components, one of best React UI library for enterprises',
  },
};

const hasTitle = () => {
  const title = document.querySelector('title');
  if (title && title.innerHTML !== '') {
    return true;
  }
  return false;
};

const hasMeta = (name: string) => {
  const metaTags = document.getElementsByTagName('meta');
  for (let i = 0; i < metaTags.length; i++) {
    if (metaTags[i].getAttribute('name') === name && metaTags[i].getAttribute('content') !== '') {
      return true;
    }
  }
  return false;
};

const DocLayout: React.FC = () => {
  const outlet = useOutlet();
  const location = useLocation();
  const { pathname, search, hash } = location;
  const [locale, lang] = useLocale(locales);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { direction } = useContext(SiteContext);
  const { loading } = useSiteData();

  const isIndexPage =
    ['', '/'].some((path) => path === pathname) ||
    ['/index'].some((path) => pathname.startsWith(path));

  // gen default title and description for index page, other pages should have their own title and description by dumi
  const [showDefaultTitle, setShowDefaultTitle] = useState(!!isIndexPage);
  const [showDefaultDesc, setShowDefaultDesc] = useState(!!isIndexPage);

  useLayoutEffect(() => {
    if (lang === 'cn') {
      dayjs.locale('zh-cn');
    } else {
      dayjs.locale('en');
    }
  }, []);

  // turn off default title and description render if we have prerender ones
  useLayoutEffect(() => {
    if (!hasTitle()) {
      setShowDefaultTitle(true);
    }
    if (!hasMeta('description')) {
      setShowDefaultDesc(true);
    }
  }, []);

  useEffect(() => {
    const nprogressHiddenStyle = document.getElementById('nprogress-style');
    if (nprogressHiddenStyle) {
      timerRef.current = setTimeout(() => {
        nprogressHiddenStyle.parentNode?.removeChild(nprogressHiddenStyle);
      }, 0);
    }
  }, []);

  // handle hash change or visit page hash from Link component, and jump after async chunk loaded
  useEffect(() => {
    const id = hash.replace('#', '');

    if (id) document.getElementById(decodeURIComponent(id))?.scrollIntoView();
  }, [loading, hash]);

  React.useEffect(() => {
    if (typeof (window as any).ga !== 'undefined') {
      (window as any).ga('send', 'pageview', pathname + search);
    }
    if (typeof (window as any)._hmt !== 'undefined') {
      (window as any)._hmt.push(['_trackPageview', pathname + search]);
    }
  }, [location]);

  const content = useMemo(() => {
    if (
      ['', '/'].some((path) => path === pathname) ||
      ['/index'].some((path) => pathname.startsWith(path))
    ) {
      return (
        <>
          <div style={{ minHeight: '100vh' }}>{outlet}</div>
          <Footer />
        </>
      );
    }
    if (pathname.startsWith('/docs/resource')) {
      return <ResourceLayout>{outlet}</ResourceLayout>;
    }
    if (pathname.startsWith('/theme-editor')) {
      return outlet;
    }
    return <SidebarLayout>{outlet}</SidebarLayout>;
  }, [pathname, outlet]);

  return (
    <>
      <Helmet encodeSpecialCharacters={false}>
        <html
          lang={lang === 'cn' ? 'zh-CN' : lang}
          data-direction={direction}
          className={classNames({ rtl: direction === 'rtl' })}
        />
        {showDefaultTitle && <title>{locale?.title}</title>}
        {showDefaultTitle && <meta property="og:title" content={locale?.title} />}
        {showDefaultDesc && <meta name="description" content={locale.description} />}
        <link
          sizes="144x144"
          href="https://gw.alipayobjects.com/zos/antfincdn/UmVnt3t4T0/antd.png"
        />
        <meta property="og:description" content={locale.description} />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://gw.alipayobjects.com/zos/rmsportal/rlpTLlbMzTNYuZGGCVYM.png"
        />
      </Helmet>
      <ConfigProvider direction={direction} locale={lang === 'cn' ? zhCN : undefined}>
        <GlobalStyles />
        <Header />
        {content}
      </ConfigProvider>
    </>
  );
};

export default DocLayout;
