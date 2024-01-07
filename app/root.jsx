//  import { cssBundleHref } from "@remix-run/css-bundle"; 
import appStylesHref from "./app.css";
import {
  Links,
  Link,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import React from 'react';
import {  Flex, Tabs, Menu } from 'antd';

const boxStyle = {
  width: '100%',
};

const justifyOptions = [
  'flex-start',
  'center',
  'flex-end',
  'space-between',
  'space-around',
  'space-evenly',
];

const alignOptions = ['flex-start', 'center', 'flex-end'];

const items = [
  {
    label: (<Link to={`/`}>Dashboard</Link>),
    key: '1',
  },
  {
    label: (<Link to={`today`}>Today</Link>),
    key: '2',
  },
  {
    label: (<Link to={``}>Setting</Link>),
    key: '3',
  },
]

export const links = () => [
  // ...(cssBundleHref ? [{ rel: "stylesheet", href: appStylesHref }] : []),
  { rel: "stylesheet", href: appStylesHref }
];

export default function App() {
  const [justify, setJustify] = React.useState(justifyOptions[4]);
  const [alignItems, setAlignItems] = React.useState(alignOptions[0]);
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
      <div >
        <Flex gap="middle"  vertical>
        <Flex style={boxStyle} justify={justify} align={alignItems}>
        <div></div>
          <div>
            <h1><Link to={'/'}>Salat Tracker</Link></h1>
          </div>
          <img src='https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg' className='user-pic' />
          </Flex>
        </Flex>
        <hr />
        
        <Menu style={{paddingLeft: "500px"}}  mode='horizontal'  items={items}   />
      </div>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
