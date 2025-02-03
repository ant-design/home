---
group:
  title: Basic Usage
order: 1
title: Usage with create-react-app
---

[create-react-app](https://create-react-app.dev) was once one of the best React application development tools, This article will try to use `create-react-app` to create a `TypeScript` project, and introduce antd. (Note: React has officially deprecated `create-react-app` and is no longer recommended)

> We build `antd` based on latest stable version of TypeScript (`>=5.0.0`), please make sure your project dependency matches it.

## Install and Initialization

Before all start, you may need install [yarn](https://github.com/yarnpkg/yarn/) or [pnpm](https://pnpm.io/) or [bun](https://bun.sh/).

<InstallDependencies npm='$ npx create-react-app antd-demo --template typescript' yarn='$ yarn create react-app antd-demo --template typescript' pnpm='$ pnpm create react-app antd-demo --template typescript' bun='$ bun create react-app antd-demo --template typescript'></InstallDependencies>

The tool will create and initialize environment and dependencies automatically, please try config your proxy setting or use another npm registry if any network errors happen during it.

Then we go inside project and start it.

```bash
$ cd antd-demo
$ npm run start
```

Open the browser at http://localhost:3000/. It renders a header saying `Welcome to React` on the page.

## Import antd

Below is the default directory structure.

```
├── README.md
├── package.json
├── public
│   ├── favicon.ico
│   └── index.html
├── src
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── index.css
│   ├── index.js
│   └── logo.svg
└── yarn.lock
```

Now we install `antd` from yarn or npm or pnpm.

<InstallDependencies npm='$ npm install antd --save' yarn='$ yarn add antd' pnpm='$ pnpm install antd --save' bun='$ bun add antd'></InstallDependencies>

Modify `src/App.js`, import Button component from `antd`.

```tsx
import React from 'react';
import { Button } from 'antd';

const App: React.FC = () => (
  <div className="App">
    <Button type="primary">Button</Button>
  </div>
);

export default App;
```

OK, you should now see a blue primary button displayed on the page. Next you can choose any components of `antd` to develop your application. Visit other workflows of `create-react-app` at its [User Guide](https://create-react-app.dev/docs/getting-started).

### Customize Theme

Ref to the [Customize Theme documentation](/docs/react/customize-theme). Modify theme with ConfigProvider:

```tsx
import React from 'react';
import { ConfigProvider } from 'antd';

const App: React.FC = () => (
  <ConfigProvider theme={{ token: { colorPrimary: '#00b96b' } }}>
    <MyApp />
  </ConfigProvider>
);

export default App;
```

`antd` is written in TypeScript with complete definitions, try out and enjoy the property suggestion and typing check.

![](https://gw.alipayobjects.com/zos/antfincdn/26L5vPoLug/8d7da796-175e-40af-8eea-e7031ba09f9f.png)

> Don't install `@types/antd`.

We are successfully running antd components now, go build your own application!
