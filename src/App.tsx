import './App.css';
import { HashRouter, Switch, Route, useLocation } from "react-router-dom";
import { Website } from './pages/home';
import { PixelsMetaverse } from './pages/play';
import { Produced } from './pages/produced';
import { useWeb3js, Web3jsProvider } from './eos-api/hook';
import bgSvg from "./assets/image/bg.svg"
import { Loading, LoadingProvider } from './components/Loading';
import { UserInfoProvider } from './components/UserProvider';
import { PersonCenter } from './pages/person-center';
import { Mall } from './pages/mall';
import { PixelsMetaverseContextProvider } from './pixels-metaverse';
import Header from './components/Header';
import React from 'react';
import { Routes } from './routes';

declare global {
  // tslint:disable-next-line
  interface Window {
    web3: any;
    ethereum: any;
    Web3Modal: any;
    Box: any;
    box: any;
    space: any;
    [name: string]: any;
  }
}

export const Main = () => {
  const { pathname } = useLocation()
  const { accounts } = useWeb3js()

  return (
    <div className="relative bg-white overflow-hidden" style={{ minWidth: 1400, minHeight: 600 }}>
      <div className="relative w-full h-full min-h-screen mx-auto bg-no-repeat md:bg-contain bg-cover bg-gray-900"
        style={{ backgroundImage: `url(${bgSvg})` }}>
        <PixelsMetaverseContextProvider web3={accounts?.web3} networkId={accounts?.networkId} currentAddress={accounts?.address}>
          <LoadingProvider>
            <UserInfoProvider>
              {pathname !== "/" && <Header />}
              <Routes />
              <Loading />
            </UserInfoProvider>
          </LoadingProvider>
        </PixelsMetaverseContextProvider>
      </div>
    </div>
  )
}

const App = () => {
  return (
    <HashRouter>
      <Web3jsProvider>
        <Main />
      </Web3jsProvider>
    </HashRouter>
  );
}

export default App;
