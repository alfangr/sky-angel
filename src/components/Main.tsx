import Image from "next/legacy/image";

import BGStart from "@assets/images/start-bg.jpg";

interface IMainProps {
  onClick: () => void
}

export default function Main({ onClick }: IMainProps) {
  return (
    <div className="aircraft-start">
      <div className="relative w-full h-full z-0">
        <Image
          className="object-cover"
          src={BGStart}
          alt="Main Background"
          layout="fill"
          priority
        />
        <div className="absolute z-10 inset-5 h-max flex flex-col items-center justify-center">
          <h1 className="game-title font-space">SKY ANGEL</h1>
          <button
            className="mt-80 bg-blue-500 hover:bg-blue-400 text-white text-2xl font-bold py-2 px-8 border-b-4 border-blue-700 hover:border-blue-500 rounded"
            type="button"
            onClick={onClick}
          >
            START
          </button>
        </div>
      </div>
    </div>
  )
}