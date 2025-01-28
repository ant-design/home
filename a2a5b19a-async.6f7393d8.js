(("undefined"!=typeof globalThis?globalThis:self).makoChunk_antd=("undefined"!=typeof globalThis?globalThis:self).makoChunk_antd||[]).push([["a2a5b19a"],{"77f99bbc":function(e,t,i){"use strict";i.d(t,"__esModule",{value:!0}),i.d(t,"default",{enumerable:!0,get:function(){return n;}});var s=i("f19d2b93"),n=e=>{let{className:t,style:i}=e;return(0,s.jsxs)("svg",{className:t,style:i,xmlns:"http://www.w3.org/2000/svg",width:"36",height:"28",viewBox:"0 0 36 28",fill:"none",children:[(0,s.jsx)("title",{children:"Juejin logo"}),(0,s.jsx)("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M17.5875 6.77268L21.8232 3.40505L17.5875 0.00748237L17.5837 0L13.3555 3.39757L17.5837 6.76894L17.5875 6.77268ZM17.5863 17.3955H17.59L28.5161 8.77432L25.5526 6.39453L17.59 12.6808H17.5863L17.5825 12.6845L9.61993 6.40201L6.66016 8.78181L17.5825 17.3992L17.5863 17.3955ZM17.5828 23.2891L17.5865 23.2854L32.2133 11.7456L35.1768 14.1254L28.5238 19.3752L17.5865 28L0.284376 14.3574L0 14.1291L2.95977 11.7531L17.5828 23.2891Z",fill:"currentColor"})]});};},a2a5b19a:function(e,t,i){"use strict";i.d(t,"__esModule",{value:!0}),i.d(t,"default",{enumerable:!0,get:function(){return x;}});var s=i("777fffbe"),n=i("f19d2b93"),l=i("e22febe0"),a=i("a9d1a279"),r=i("3835a2b7"),o=s._(i("600aabe0")),d=s._(i("23546486")),c=s._(i("77f99bbc"));let u="https://picx.zhimg.com/v2-3b2bca09c2771e7a82a81562e806be4d.jpg?source=d16d100b",h=(0,r.createStyles)(({token:e,css:t})=>({card:t`
    width: 100%;
    margin: ${2*e.marginMD}px 0;
    transition: all ${e.motionDurationMid};
    background-color: ${e.colorFillQuaternary};
  `,bigTitle:t`
    color: #121212;
    font-size: ${e.fontSizeLG}px;
    margin-bottom: ${e.marginLG}px;
    font-weight: ${e.fontWeightStrong};
  `,cardBody:t`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,leftCard:t`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    img {
      width: 200px;
      overflow: hidden;
      margin-inline-end: ${e.marginLG}px;
      border-radius: ${e.borderRadiusLG}px;
    }
  `,title:t`
    color: #444;
    font-size: ${e.fontSizeLG}px;
    font-weight: ${e.fontWeightStrong};
    user-select: none;
  `,subTitle:t`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: #646464;
    font-size: ${e.fontSize}px;
    font-weight: 400;
    margin-top: ${e.marginXS}px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,logo:t`
    width: 24px;
    height: 24px;
    font-size: 24px;
    &.zhihu-logo {
      color: #056de8;
    }
    &.yuque-logo {
      color: #00b96b;
    }
    &.juejin-logo {
      color: #1e80ff;
    }
  `,arrowIcon:t`
    color: #8a8f8d;
    margin: 0 ${e.marginXS}px;
    font-size: ${e.fontSizeSM}px;
  `,zlBtn:t`
    padding: 0;
    color: #646464;
  `,discussLogo:t`
    width: 16px;
    height: 16px;
    font-size: 16px;
  `})),g={cn:{bigTitle:"\u6587\u7AE0\u88AB\u4EE5\u4E0B\u4E13\u680F\u6536\u5F55\uFF1A",zhiHu:"\u4E00\u4E2A UI \u8BBE\u8BA1\u4F53\u7CFB",yuQue:"Ant Design \u5B98\u65B9\u4E13\u680F",junjin:"Ant Design \u5F00\u6E90\u4E13\u680F",buttonText:"\u6211\u6709\u60F3\u6CD5\uFF0C\u53BB\u53C2\u4E0E\u8BA8\u8BBA"},en:{bigTitle:"Articles are included in the column:",zhiHu:"A UI design system",yuQue:"Ant Design official column",junjin:"Ant Design Open Source Column",buttonText:"Go to discuss"}};var x=({zhihuLink:e,yuqueLink:t,juejinLink:i})=>{let[s]=(0,d.default)(g),{styles:{card:r,bigTitle:x,cardBody:f,leftCard:m,title:j,subTitle:p,logo:b,arrowIcon:v,zlBtn:y,discussLogo:L}}=h();return e||t||i?(0,n.jsxs)(a.Card,{className:r,bordered:!1,children:[(0,n.jsx)("h3",{className:x,children:s.bigTitle}),e&&(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(a.Divider,{}),(0,n.jsxs)("div",{className:f,children:[(0,n.jsxs)("div",{className:m,children:[(0,n.jsx)("img",{draggable:!1,src:u,alt:"antd"}),(0,n.jsxs)("div",{children:[(0,n.jsx)("p",{className:j,children:"Ant Design"}),(0,n.jsxs)("div",{className:p,children:[(0,n.jsx)(l.ZhihuOutlined,{className:(0,o.default)(b,"zhihu-logo")}),(0,n.jsx)(l.RightOutlined,{className:v}),(0,n.jsx)(a.Button,{target:"_blank",href:"https://www.zhihu.com/column/c_1564262000561106944",className:y,type:"link",children:s.zhiHu})]})]})]}),(0,n.jsx)(a.Button,{ghost:!0,type:"primary",icon:(0,n.jsx)(l.ZhihuOutlined,{className:L}),target:"_blank",href:e,children:s.buttonText})]})]}),t&&(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(a.Divider,{}),(0,n.jsxs)("div",{className:f,children:[(0,n.jsxs)("div",{className:m,children:[(0,n.jsx)("img",{draggable:!1,src:u,alt:"antd"}),(0,n.jsxs)("div",{children:[(0,n.jsx)("p",{className:j,children:"Ant Design"}),(0,n.jsxs)("div",{className:p,children:[(0,n.jsx)(l.YuqueOutlined,{className:(0,o.default)(b,"yuque-logo")}),(0,n.jsx)(l.RightOutlined,{className:v}),(0,n.jsx)(a.Button,{target:"_blank",href:"https://www.yuque.com/ant-design/ant-design",className:y,type:"link",children:s.yuQue})]})]})]}),(0,n.jsx)(a.Button,{ghost:!0,type:"primary",icon:(0,n.jsx)(l.YuqueOutlined,{className:L}),target:"_blank",href:t,children:s.buttonText})]})]}),i&&(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(a.Divider,{}),(0,n.jsxs)("div",{className:f,children:[(0,n.jsxs)("div",{className:m,children:[(0,n.jsx)("img",{draggable:!1,src:u,alt:"antd"}),(0,n.jsxs)("div",{children:[(0,n.jsx)("p",{className:j,children:"Ant Design"}),(0,n.jsxs)("div",{className:p,children:[(0,n.jsx)(c.default,{className:(0,o.default)(b,"juejin-logo")}),(0,n.jsx)(l.RightOutlined,{className:v}),(0,n.jsx)(a.Button,{target:"_blank",href:"https://juejin.cn/column/7247354308258054200",className:y,type:"link",children:s.junjin})]})]})]}),(0,n.jsx)(a.Button,{ghost:!0,type:"primary",icon:(0,n.jsx)(c.default,{className:L}),target:"_blank",href:i,children:s.buttonText})]})]})]}):null;};}}]);