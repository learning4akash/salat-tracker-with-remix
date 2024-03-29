//  import { cssBundleHref } from "@remix-run/css-bundle"; 
import appStylesHref from "./app.css";
import { redirect } from "@remix-run/node";
import { URL } from 'url';
import {
  Links,
  Link,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

export async function loader({ request }) {
  const url = new URL(request.url);
  const getCookie  = request.headers.get('Cookie');
  if ((!getCookie) && url.pathname !== '/setting') {
      return redirect("/setting");
  }
  return {}
}

import React, { useEffect, useState } from 'react';
import {  Flex, Tabs, Menu } from 'antd';
const boxStyle = {
  width: '100%',
};
const disableLink = {
  pointerEvents : "none"
}

const justifyOptions = [
  'flex-start',
  'center',
  'flex-end',
  'space-between',
  'space-around',
  'space-evenly',
];

const alignOptions = ['flex-start', 'center', 'flex-end'];

export const links = () => [
  // ...(cssBundleHref ? [{ rel: "stylesheet", href: appStylesHref }] : []),
  { rel: "stylesheet", href: appStylesHref }
];

export default function App() {
  const [justify, setJustify]        = React.useState(justifyOptions[4]);
  const [alignItems, setAlignItems]  = React.useState(alignOptions[0]);
  const [ userInfo, setUserInfo]     = useState({});
  const [ prayerData, setPrayerData] = useState({});
  const [loading, setLoading]        = useState(true);

  const items = [
    {
      label: (<Link to={`/`}>Dashboard</Link>),
      key: '1',
    },
    {
      label: (<Link className = "disableLink" to={`/tracker`}>Today</Link>),
      key: '2',
    },
    {
      label: (<Link to={`/setting`}>Setting</Link>),
      key: '3',
    },
  ]
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
