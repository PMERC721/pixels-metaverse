import { ReactNode, CSSProperties } from "react";
import { Empty } from "antd";
import { isEmpty } from "lodash";
import { useWeb3Info } from "abi-to-request";

export const DataStateBox = ({
  data,
  children,
  styleCSS,
  classCSS,
  emptyDesc = "请链接钱包"
}: {
  data: any;
  children: ReactNode;
  styleCSS?: CSSProperties;
  classCSS?: string;
  emptyDesc?: string;
}) => {
  const { connected, networkId } = useWeb3Info();

  return (
    <div
      className={`w-full h-full ${classCSS}`}
      style={{ height: "calc(100vh - 170px)", ...styleCSS }}
    >
      {isEmpty(data)
        ? <div className="w-full h-full flex justify-center items-center opacity-70">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={connected && networkId ? [42].includes(networkId) ? "暂无数据" : "请链接 Kovan 网络" : emptyDesc} style={{ color: "#fff" }} />
        </div>
        : children}
    </div>
  );
};
