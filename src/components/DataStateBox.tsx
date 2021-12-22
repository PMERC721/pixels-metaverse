import { ReactNode, CSSProperties } from "react";
import { Empty } from "antd";
import { isEmpty } from "lodash";
import { useWeb3Info } from "../hook/web3";

// 数据状态容器盒子----用于数据获取前后的页面状态显示
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
  const { connected } = useWeb3Info();

  return (
    <div
      className={`w-full h-full ${classCSS}`}
      style={{ height: "calc(100vh - 170px)", ...styleCSS }}
    >
      {isEmpty(data)
        ? <div className="w-full h-full flex justify-center items-center opacity-70">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={connected ? "暂无数据" : emptyDesc} style={{ color: "#fff" }} />
        </div>
        : children}
    </div>
  );
};
