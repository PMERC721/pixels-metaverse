
import { useCallback, useEffect, useRef, useState } from "react"
import { isEmpty } from "lodash";
import { Tooltip } from "antd";
import { AppstoreOutlined, ClearOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { usePixelsMetaverseHandleImg } from "../../../pixels-metaverse";

export const Controller = () => {
  const {
    setConfig,
    config,
    canvasRef,
    setPositionsArr,
    dealClick: { clear, value }
  } = usePixelsMetaverseHandleImg()

  return (
    <div
      className="flex flex-col items-center text-gray-300 w-8 absolute py-4"
      style={{
        fontSize: 20,
        height: 480,
        left: (canvasRef?.current?.offsetLeft || 30) - 30,
        top: canvasRef?.current?.offsetTop,
        boxShadow: "0px 0px 10px rgba(225,225,225,0.3)"
      }}
    >
      {/* <Tooltip placement="right" className="mb-4 cursor-pointer" title="大格子" color="#29303d">
          <PlusCircleOutlined
            style={{
              color: config?.sizeGrid !== 20 && config?.withGrid && isEmpty(value) ? 'white' : "gray",
              cursor: config?.sizeGrid !== 20 && config?.withGrid && isEmpty(value) ? "pointer" : "no-drop"
            }}
            onClick={() => { isEmpty(value) && setConfig((pre) => ({ ...pre, sizeGrid: 20 })) }}
          />
        </Tooltip> */}
      {/* <Tooltip placement="right" className="mb-4 cursor-pointer" title="小格子" color="#29303d">
          <MinusCircleOutlined
            style={{
              color: config?.sizeGrid !== 10 && config?.withGrid && isEmpty(value) ? 'white' : "gray",
              cursor: config?.sizeGrid !== 10 && config?.withGrid && isEmpty(value) ? "pointer" : "no-drop"
            }}
            onClick={() => { isEmpty(value) && setConfig((pre) => ({ ...pre, sizeGrid: 10 })) }}
          />
        </Tooltip> */}
      <Tooltip placement="right" className="mb-4 cursor-pointer" title={`${config?.withGrid ? "隐藏" : "显示"}辅助线`} color="#29303d" >
        <AppstoreOutlined style={{ color: config?.withGrid ? 'white' : "gray" }} onClick={() => {
          setConfig((pre) => ({ ...pre, withGrid: !config?.withGrid }))
        }} />
      </Tooltip>
      <Tooltip placement="right" className="mb-4 cursor-pointer" title={`清除画布`} color="#29303d">
        <ClearOutlined style={{ color: !isEmpty(value) ? 'white' : "gray" }} onClick={() => {
          clear()
          setPositionsArr([])
        }} />
      </Tooltip>
      <Tooltip placement="right" className="mb-4 cursor-pointer" title={`选择绘制颜色`} color="#29303d">
        <input type="color" name="颜色" id="" style={{ width: 20 }} onChange={(e) => {
          setConfig((pre) => ({ ...pre, drawColor: e.target.value }))
        }} />
      </Tooltip>
      <Tooltip placement="right" className="mb-4 cursor-pointer" title={`丢弃选取的颜色`} color="#29303d">
        <DeleteOutlined style={{ color: !isEmpty(config?.drawColor) ? 'white' : "gray" }} onClick={() => { setConfig((pre) => ({ ...pre, drawColor: "" })) }} />
      </Tooltip>
      <Tooltip placement="right" className="mb-4 cursor-pointer" title={`调整背景色`} color="#29303d">
        <input type="color" name="颜色" id="" style={{ width: 20 }} onChange={(e) => {
          setConfig((pre) => ({ ...pre, bgColor: e.target.value }))
        }} />
      </Tooltip>
      <Tooltip placement="right" className="mb-4 cursor-pointer" title={() => {
        return (<div style={{ fontSize: 12 }}>
          <div>1.清除画布数据会导致之前所有绘制丢失</div>
          <div>2.选择了绘制颜色后，将不会从当前选中地方取色，除非丢弃该颜色</div>
          <div>3.丢弃当前选中色后，绘制的颜色将是点击处颜色</div>
          <div>4.双击即可删除当前位置数据</div>
        </div>)
      }} color="#29303d">
        <ExclamationCircleOutlined />
      </Tooltip>
    </div>
  )
}