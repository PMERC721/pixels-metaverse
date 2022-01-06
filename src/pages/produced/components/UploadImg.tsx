import CloseCircleOutlined from "@ant-design/icons/lib/icons/CloseCircleOutlined"
import { useCallback, useEffect, useRef, useState } from "react"
import { usePixelsMetaverseHandleImg } from "../../../pixels-metaverse";

export const UploadImg = () => {
  const { setConfig, config, dealClick: { setValue } } = usePixelsMetaverseHandleImg()
  const filedomRef = useRef<HTMLInputElement>(null)
  const [src, setSrc] = useState(localStorage.getItem("imgUrl") || "")
  const [url, setUrl] = useState(src)

  //上传图片
  const fileOnChange = useCallback(() => {
    const filedom = filedomRef.current
    if (filedom && filedom?.files) {
      const file = filedom?.files[0];
      if (!file.type.match("image.*")) {
        return
      }
      let reader = new FileReader()
      reader.onload = function () {
        let bytes = this.result
        let img = new Image()
        img.src = "" + bytes
        img.onload = function () {
          setValue({})
          setConfig((pre) => ({ ...pre, bgImg: img }))
        }
      }
      reader.readAsDataURL(file)
    }
  }, [filedomRef])

  const onLoadImg = (src: string) => {
    let img = new Image()
    img.src = src
    img.crossOrigin = ""
    img.onload = function () {
      setValue({})
      setConfig((pre) => ({ ...pre, bgImg: img }))
    }
  }

  useEffect(() => {
    localStorage.setItem("imgUrl", url)
    onLoadImg(src)
  }, [src])

  return (
    <div className="mb-4 flex items-center justify-between h-10 text-white" style={{ width: config?.imgSize.width }}>
      <div className="flex items-center justify-between rounded bg-white bg-opacity-10 w-96">
        <input
          className="pl-4 bg-transparent search w-64"
          placeholder="请输入图片链接"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        {url && <CloseCircleOutlined onClick={() => setUrl("")} />}
        <div className="bg-red-500 cursor-pointer rounded-r w-24 leading-10 text-center"
          onClick={() => {
            setSrc(url);
            if (!url) setConfig((pre) => ({ ...pre, bgImg: null }))
          }}>导入图片</div>
      </div>
      <div
        className="bg-red-500 cursor-pointer ml-2 rounded w-24 leading-10 text-center"
        onClick={() => setSrc(url)}>
        <input type="file" id="avatar" accept="image/png, image/jpeg, image.jpg" hidden onChange={fileOnChange} ref={filedomRef} />
        <label htmlFor="avatar" className="cursor-pointer">上传文件</label>
      </div>
    </div>
  )
}