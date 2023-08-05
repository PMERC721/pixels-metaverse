import CloseCircleOutlined from "@ant-design/icons/lib/icons/CloseCircleOutlined";
import { debounce } from "lodash";
import * as React from "react";

export const LoadingContext = React.createContext(
  {} as {
    loading: any;
    closeLoading: () => void;
    openLoading: () => void;
    closeDelayLoading: () => void;
  },
);

export const useLoading = () => React.useContext(LoadingContext);

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = React.useState<boolean>(false);

  const openLoading = () => {
    setLoading(true)
  }

  const closeDelayLoading = debounce(() => {
    setLoading(false)
  }, 1000)

  const closeLoading = () => {
    setLoading(false)
  }

  return (
    <LoadingContext.Provider value={{ loading, openLoading, closeLoading, closeDelayLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}

export const Loading = () => {
  const { loading, closeLoading } = useLoading()
  const [show, setShow] = React.useState(false)
  React.useEffect(() => {
    let timer: any;
    if (loading) {
      setTimeout(() => {
        setShow(true)
        clearTimeout(timer)
      }, 2000)
    }

    return () => {
      setShow(false)
      clearTimeout(timer)
    }
  }, [loading])

  return (
    loading && <div id="loading">
      <div id="loading-center">
        <div id="loading-center-absolute">
          <div className="object" id="object_four"></div>
          <div className="object" id="object_three"></div>
          <div className="object" id="object_two"></div>
          <div className="object" id="object_one"></div>
        </div>
        {show && <div id="close-loading" onClick={closeLoading}><CloseCircleOutlined /></div>}
        {show && <div id="close-text" >上链以及获取速度较慢，请耐心等待哦。</div>}
      </div>
    </div>
  );
};

export const useSmallLoading = () => {
  const [smallLoading, setSmallLoading] = React.useState(false);

  const SmallLoading = (props: { size: number, color?: string }) => {
    const { size, color = "#165DFF" } = props;
    return (
      smallLoading && <div className="small-loading" style={{
        width: size,
        height: size,
        background: `conic-gradient(from 114.04deg at 50% 50%, ${color} -3.75deg, rgba(22, 93, 255, 0) 331.83deg, ${color} 339.88deg, ${color} 356.25deg, rgba(22, 93, 255, 0) 691.83deg)`
      }}></div>
    )
  }

  return {
    SmallLoading,
    setSmallLoading,
    smallLoading
  }
}