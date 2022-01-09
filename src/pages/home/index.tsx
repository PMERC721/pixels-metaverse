import { useHistory } from "react-router-dom";
import { RefObject, useCallback, useEffect, useRef } from "react";
import { add } from "../../eos-api/fetch";

export const usePrint = () => {
  const print = useCallback(
    (ref: RefObject<HTMLDivElement>, text: string) => {
      if (!ref.current) return
      const dom = ref.current;
      let i = 0, timer: any = 0
      function typing() {
        if (i <= text.length) {
          dom.innerHTML = text.slice(0, i++) + '_'
          timer = setTimeout(typing, 200)
        }
        else {
          dom.innerHTML = text//结束打字,移除 _ 光标
          clearTimeout(timer)
        }
      }
      typing()
    }, [])

  return { print }
}

export const Website = () => {
  const history = useHistory()
  const ref = useRef<HTMLDivElement>(null)
  const { print } = usePrint()

  useEffect(() => {
    if (localStorage.getItem("transaction_id")) return
    add("项目被克隆和启动了").then((res) => {
      const transaction_id = (res as { transaction_id: string })?.transaction_id
      localStorage.setItem("transaction_id", transaction_id)
    })
  }, [])

  useEffect(() => {
    print(ref, "这里是像素元宇宙，一个已经创世但是还没有被绘制的世界！等待着我们去建造，你准备好了吗！我的少年！让我们一起在像素的世界里遨游吧！像素元宇宙，我们来啦！")
  }, [ref])

  return (
    <>
      <main className="mx-auto max-w-7xl px-4">
        <div className="sm:text-center lg:text-left lg:pt-40">
          <h1 className="tracking-tight font-extrabold text-gray-200 sm:text-4xl text-xl">
            <p className="block md:mb-8" >欢迎来到，我的像素元宇宙！</p>
            <p className="font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-blue-500 animate-pulse">Hello! Pixels Metaverse!</p>
          </h1>
          <p
            className="mt-3 text-base text-gray-400 h-48 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 lg:mt-12"
            ref={ref}>
          </p>
          <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start lg:mt-12 text-2xl">
            <div className="rounded-md shadow transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105">
              <div className="cursorP w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white hover:text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                onClick={() => history.push("app")}>
                Get started
              </div>
            </div>
            {/* <div className="cursorP mt-3 sm:mt-0 sm:ml-3 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105">
              <div className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 hover:text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
              >
                白皮书
                </div>
            </div> */}
          </div>
        </div>
      </main>
      {/* <div className="relative lg:-top-30 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img className="absolute right-0 bottom-0 h-72 w-50 z-10 sm:h-96 animate-bounce" src={"https://github.githubassets.com/images/modules/site/home/astro-mona.webp"} alt="" />
      </div> */}
    </>
  );
};