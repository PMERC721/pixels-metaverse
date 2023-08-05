import { PixelsMetaverseHandleImg, usePixelsMetaverseHandleImg } from "../../../pixels-metaverse";

export const Avatar = () => {
  const { config, canvas2Ref } = usePixelsMetaverseHandleImg()

  return (
    <div
      className="m-4 card main-box overflow-hidden bg-transparent"
      style={{
        width: config?.imgSize?.width,
        height: config?.imgSize?.height,
        minWidth: config?.imgSize?.width
      }}>
      <PixelsMetaverseHandleImg canvasRef={canvas2Ref} showGridColor />
    </div>
  );
};