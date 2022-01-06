import { Submin } from "./components/Submit";
import {
  PixelsMetaverseHandleImg,
  PixelsMetaverseHandleImgProvider,
  usePixelsMetaverseHandleImg,
  CanvasSlicImg
} from "../../pixels-metaverse";
import { Controller } from "./components/Controller";
import { UploadImg } from "./components/UploadImg";

export const ProducedCore = () => {
  const { config, canvasRef, canvas2Ref } = usePixelsMetaverseHandleImg()

  return (
    <div className="flex w-full p-8 pt-24 justify-between">
      <div>
        <UploadImg />
        <Controller />
        <div className="flex border border-gray-500"
          style={{
            cursor: "cell",
            boxShadow: "0px 0px 10px rgba(225,225,225,0.3)"
          }}>
          {config?.bgImg && <>
            <PixelsMetaverseHandleImg
              canvasRef={canvasRef}
              showBgImg
              className="bg-transparent z-50" />
            <CanvasSlicImg img={config?.bgImg} sizeGrid={config?.sizeGrid} /></>}

          <PixelsMetaverseHandleImg
            canvasRef={canvas2Ref}
            showGridColor
            style={{
              backgroundColor: config.bgColor
            }} />
        </div>
      </div>
      <Submin />
    </div>
  )
}

export const Produced = () => {
  return (
    <PixelsMetaverseHandleImgProvider
      size={480}
      showGrid
      handDraw
      data={{
        positions: [],
        size: 'large',
        bgColor: "transparent",
        gridColor: "rgba(225,225,225,0.7)",
      }}
    >
      <ProducedCore />
    </PixelsMetaverseHandleImgProvider>
  )
}