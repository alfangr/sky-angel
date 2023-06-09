import Head from "next/head";

import Main from "@/components/Main";
import Playground from "@/components/Playground";
import { useState } from "react";

export default function Home() {
  const [isStarted, setIsStarted] = useState(false);

  const startGame = () => {
    setIsStarted(!isStarted);
  }

  return (
    <>
      <Head>
        <title>Sky Angel</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="aircraft-container">
          { isStarted ? <Playground /> : <Main onClick={startGame} /> }
        </div>
      </main>
    </>
  )
}
