import { useLocation } from "react-router-dom";
import { Loading, LoadingProvider } from './components/Loading';
import { UserInfoProvider } from './components/UserProvider';
import { PixelsMetaverseContextProvider } from './pixels-metaverse';
import { Header } from './components/Header';
import bgSvg from "./assets/image/bg.svg"
import { Routes } from './routes';
import { Web3InfoProvider } from "./hook/web3";

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

const App = () => {
  const { pathname } = useLocation()

  return (
    <div className="relative bg-white overflow-hidden" style={{ minWidth: 1400, minHeight: 600 }}>
      <div className="relative w-full h-full min-h-screen mx-auto bg-no-repeat md:bg-contain bg-cover bg-gray-900"
        style={{ backgroundImage: `url(${bgSvg})` }}>
        <Web3InfoProvider>
          <PixelsMetaverseContextProvider>
            <LoadingProvider>
              <UserInfoProvider>
                {pathname !== "/" && <Header />}
                <Routes />
                <Loading />
              </UserInfoProvider>
            </LoadingProvider>
          </PixelsMetaverseContextProvider>
        </Web3InfoProvider>
      </div>
    </div>
  )
}

export default App;
