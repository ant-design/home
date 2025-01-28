(("undefined"!=typeof globalThis?globalThis:self).makoChunk_antd=("undefined"!=typeof globalThis?globalThis:self).makoChunk_antd||[]).push([["494cb795"],{"494cb795":function(e,n,t){"use strict";t.d(n,"__esModule",{value:!0}),t.d(n,"default",{enumerable:!0,get:function(){return v;}});var i=t("777fffbe"),a=t("852bbaa9"),l=t("f19d2b93"),o=a._(t("5b220c3d")),r=t("e22febe0"),s=t("3835a2b7"),f=i._(t("600aabe0")),d=i._(t("3e969a12")),c=i._(t("714a8bde"));let u=(0,s.createStyles)(({token:e,css:n})=>{let{colorSplit:t,iconCls:i,fontSizeIcon:a}=e;return{prevNextNav:n`
      width: calc(100% - 234px);
      margin-inline-end: 170px;
      margin-inline-start: 64px;
      overflow: hidden;
      font-size: ${e.fontSize}px;
      border-top: 1px solid ${t};
      display: flex;
    `,pageNav:n`
      flex: 1;
      height: 72px;
      line-height: 72px;
      text-decoration: none;

      ${i} {
        color: #999;
        font-size: ${a}px;
        transition: all ${e.motionDurationSlow};
      }

      .chinese {
        margin-inline-start: ${e.marginXXS}px;
      }
    `,prevNav:n`
      text-align: start;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .footer-nav-icon-after {
        display: none;
      }

      .footer-nav-icon-before {
        position: relative;
        line-height: 0;
        vertical-align: middle;
        transition: inset-inline-end ${e.motionDurationSlow};
        margin-inline-end: 1em;
        inset-inline-end: 0;
      }

      &:hover .footer-nav-icon-before {
        inset-inline-end: 0.2em;
      }
    `,nextNav:n`
      text-align: end;
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .footer-nav-icon-before {
        display: none;
      }

      .footer-nav-icon-after {
        position: relative;
        margin-bottom: 1px;
        line-height: 0;
        vertical-align: middle;
        transition: inset-inline-start ${e.motionDurationSlow};
        margin-inline-start: 1em;
        inset-inline-start: 0;
      }

      &:hover .footer-nav-icon-after {
        inset-inline-start: 0.2em;
      }
    `};}),m=e=>Array.isArray(e)?e.reduce((e,n)=>n?"children"in n&&n.children?e.concat(m(n.children)??[]):e.concat(n):e,[]):null;var v=({rtl:e})=>{let{styles:n}=u(),t={className:"footer-nav-icon-before"},i={className:"footer-nav-icon-after"},a=e?(0,l.jsx)(r.RightOutlined,{...t}):(0,l.jsx)(r.LeftOutlined,{...t}),s=e?(0,l.jsx)(r.LeftOutlined,{...i}):(0,l.jsx)(r.RightOutlined,{...i}),[v,x]=(0,d.default)({before:a,after:s}),{isMobile:p}=(0,o.useContext)(c.default),[g,h]=(0,o.useMemo)(()=>{let e=m(v);if(!e)return[null,null];let n=-1;return e.forEach((e,t)=>{e&&e.key===x&&(n=t);}),[e[n-1],e[n+1]];},[v,x]);return p?null:(0,l.jsxs)("section",{className:n.prevNextNav,children:[g&&o.default.cloneElement(g.label,{className:(0,f.default)(n.pageNav,n.prevNav,g.className)}),h&&o.default.cloneElement(h.label,{className:(0,f.default)(n.pageNav,n.nextNav,h.className)})]});};}}]);