(("undefined"!=typeof globalThis?globalThis:self).makoChunk_antd=("undefined"!=typeof globalThis?globalThis:self).makoChunk_antd||[]).push([["a3aa6524"],{"1b87ba52":function(e,l,t){"use strict";t.d(l,"__esModule",{value:!0}),t.d(l,"default",{enumerable:!0,get:function(){return i;}});var a=t("f19d2b93"),n=t("a9d1a279"),i=e=>{let{item:{username:l,url:t}={}}=e;return(null==l?void 0:l.includes("github-actions"))?null:(0,a.jsx)(n.Tooltip,{title:l,children:(0,a.jsx)("li",{children:(0,a.jsx)("a",{href:`https://github.com/${l}`,target:"_blank",rel:"noopener noreferrer",children:(0,a.jsx)(n.Avatar,{size:"small",src:t,alt:l,children:l})})})});};},a3aa6524:function(e,l,t){"use strict";t.d(l,"__esModule",{value:!0}),t.d(l,"default",{enumerable:!0,get:function(){return b;}});var a=t("777fffbe"),n=t("f19d2b93"),i=t("5b220c3d"),r=a._(t("868f756d")),s=t("3835a2b7"),o=a._(t("600aabe0")),d=t("9c86e52a"),u=a._(t("714a8bde")),f=a._(t("1b87ba52"));let c=(0,s.createStyles)(({token:e,css:l})=>({listMobile:l`
    margin: 1em 0 !important;
  `,title:l`
    font-size: ${e.fontSizeSM}px;
    opacity: 0.5;
    margin-bottom: ${e.marginXS}px;
  `,list:l`
    display: flex;
    flex-wrap: wrap;
    clear: both;
    li {
      height: 24px;
      transition: all ${e.motionDurationSlow};
      margin-inline-end: -${e.marginXS}px;
    }
    &:hover {
      li {
        margin-inline-end: 0;
      }
    }
  `}));var b=({filename:e})=>{let{formatMessage:l}=(0,d.useIntl)(),{styles:t}=c(),{isMobile:a}=(0,i.useContext)(u.default);return e?(0,n.jsxs)("div",{className:(0,o.default)({[t.listMobile]:a}),children:[(0,n.jsx)("div",{className:t.title,children:l({id:"app.content.contributors"})}),(0,n.jsx)(r.default,{cache:!0,repo:"ant-design",owner:"ant-design",fileName:e,className:t.list,renderItem:(e,l)=>(0,n.jsx)(f.default,{item:e,loading:l},null==e?void 0:e.url)})]}):null;};}}]);