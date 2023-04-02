import { useEffect, useState, useRef } from "react";
import Image from "next/image";

import Play from "@assets/images/play.png";
import Pause from "@assets/images/pause.png";
import Time from "@assets/images/timer.png";
import Star from "@assets/images/star.png";
import Aircraft from "@assets/images/aircraft.png";
import Bird from "@assets/images/bird.png";
import Cloud from "@assets/images/cloud.png";
import Parachute from "@assets/images/parachute.png";

import Fuel from "@components/Fuel";

interface Position {
  x: number;
  y: number;
};

interface ObjectData {
  id: number;
  speed: number;
  position: Position;
};

export default function Playground() {
  const aircraft = { width: 226, height: 75 };
  const aircraftSpeed = 10;
  const aircraftElement = document.getElementById("aircraft");
  const parentWidth = aircraftElement?.parentNode?.parentElement?.clientWidth || 1024;
  const parentHeight = aircraftElement?.parentNode?.parentElement?.clientHeight || 768;

  const [isGamePlayed, setIsGamePlayed] = useState(false);
  const [isGamePaused, setIsGamePaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [positionAircraft, setPositionAircraft] = useState({ x: 0, y: 370 });
  const [time, setTime] = useState(0);
  const [clouds, setClouds] = useState<ObjectData[]>([]);
  const [birds, setBirds] = useState<ObjectData[]>([]);
  const [parachutes, setParachutes] = useState<ObjectData[]>([]);
  const [stars, setStars] = useState<ObjectData[]>([]);
  const [fuel, setFuel] = useState(100);

  const [name, setName] = useState("");

  const timeRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  useEffect(() => {
    movingClouds(5);
    handleAudioAlwaysOn();
  }, []);

  useEffect(() => {
    checkCollision();
  }, [positionAircraft, parachutes]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      var allowedKey = ["Space", "ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"];

      // filter array allowed key when game is paused
      if (isGamePaused) {
        allowedKey = [allowedKey[0]];
      } else {
        allowedKey = allowedKey;
      };

      // break when key if not allowed
      if (!allowedKey.includes(event.code)) return;

      !isGamePlayed && setIsGamePlayed(true);

      switch (event.code) {
        case "ArrowLeft":
          if (positionAircraft.x > 0) {
            setPositionAircraft((prevPosition) => ({
              x: prevPosition.x - aircraftSpeed,
              y: prevPosition.y,
            }));
          }
          break;
        case "ArrowUp":
          if (positionAircraft.y + aircraft.height < parentHeight) {
            setPositionAircraft((prevPosition) => ({
              x: prevPosition.x,
              y: prevPosition.y + aircraftSpeed,
            }));
          }
          break;
        case "ArrowRight":
          if (positionAircraft.x + aircraft.width < parentWidth) {
            setPositionAircraft((prevPosition) => ({
              x: prevPosition.x + aircraftSpeed,
              y: prevPosition.y,
            }));
          }
          break;
        case "ArrowDown":
          if (positionAircraft.y > 0) {
            setPositionAircraft((prevPosition) => ({
              x: prevPosition.x,
              y: prevPosition.y - aircraftSpeed,
            }));
          }
          break;
        case "Space":
          console.log(isGamePaused);
          // if (isGamePaused) {
          //   console.log('yuk play');
          //   handlePlay();
          // } else {
          //   console.log('yuk pause');
          //   handlePause();
          // }
          // console.log(isGamePaused);
          // isGamePaused ? handlePlay() : handlePause();
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [positionAircraft]);

  useEffect(() => {
    if (isGamePlayed) { // game played
      timer();
      movingBirds(3);
      movingParachutes(2);
      movingStars(2);
      audioRef.current?.play();
    } else { // game paused
      // condition for paused game
    }
  }, [isGamePlayed]);

  useEffect(() => {
    if (fuel <= 0) {
      // 
    }
  }, [fuel]);

  const movingBirds = (numOfCloud: number) => {
    const initialBirds: ObjectData[] = [];
    const birdWidth = 127;

    for (let i = 1; i <= numOfCloud; i++) {
      const speed = Math.random() * 5 + 1;
      const position: Position = {
        x: -parentWidth,
        y: Math.random() * (parentHeight - 100),
      };
      initialBirds.push({ id: i, speed, position });
    }
    setBirds(initialBirds);

    const moveInterval = setInterval(() => {
      setBirds((prevBirds) => {
        const updatedBirds = prevBirds.map((bird) => {
          const newLeft = bird.position.x - bird.speed;
          if (newLeft < -birdWidth) {
            const newTop = Math.floor(Math.random() * (parentHeight - 100));
            return {
              ...bird,
              position: { x: parentWidth, y: newTop },
            };
          }
          return { ...bird, position: { ...bird.position, x: newLeft } };
        });
        return updatedBirds;
      });
    }, 50);

    return () => clearInterval(moveInterval);
  }

  const movingClouds = (numOfCloud: number) => {
    const initialClouds: ObjectData[] = [];
    const cloudWidth = 232;

    for (let i = 1; i <= numOfCloud; i++) {
      const speed = Math.random() * 5 + 1;
      const position: Position = {
        x: -parentWidth,
        y: Math.random() * (parentHeight - 100),
      };
      initialClouds.push({ id: i, speed, position });
    }
    setClouds(initialClouds);

    const moveInterval = setInterval(() => {
      setClouds((prevClouds) => {
        const updatedClouds = prevClouds.map((cloud) => {
          const newLeft = cloud.position.x - cloud.speed;
          if (newLeft < -cloudWidth) {
            const newTop = Math.floor(Math.random() * (parentHeight - 100));
            return {
              ...cloud,
              position: { x: parentWidth, y: newTop },
            };
          }
          return { ...cloud, position: { ...cloud.position, x: newLeft } };
        });
        return updatedClouds;
      });
    }, 50);

    return () => clearInterval(moveInterval);
  }

  const movingParachutes = (numOfParachutes: number) => {
    const initialParachutes: ObjectData[] = [];
    const parachuteHeight = 50;
  
    for (let i = 1; i <= numOfParachutes; i++) {
      const speed = Math.random() * 5 + 1;
      const position: Position = {
        x: Math.random() * (parentWidth - parachuteHeight),
        y: -parachuteHeight,
      };
      initialParachutes.push({ id: i, speed, position });
    }
    setParachutes(initialParachutes);
  
    const moveInterval = setInterval(() => {
      setParachutes((prevParachutes) => {
        const updatedParachutes = prevParachutes.map((parachute) => {
          const newY = parachute.position.y + parachute.speed;
          if (newY > parentHeight) {
            const newX = Math.random() * (parentWidth - parachuteHeight);
            return {
              ...parachute,
              position: { x: newX, y: -parachuteHeight },
            };
          }
          return { ...parachute, position: { ...parachute.position, y: newY } };
        });
        return updatedParachutes;
      });
    }, 50);
  
    return () => clearInterval(moveInterval);
  };

  const movingStars = (numOfStars: number) => {
    const initialStars: ObjectData[] = [];
    const starHeight = 30;
  
    for (let i = 1; i <= numOfStars; i++) {
      const speed = Math.random() * 5 + 1;
      const position: Position = {
        x: Math.random() * (parentWidth - starHeight),
        y: -starHeight,
      };
      initialStars.push({ id: i, speed, position });
    }
    setStars(initialStars);
  
    const moveInterval = setInterval(() => {
      setStars((prevStars) => {
        const updatedStars = prevStars.map((star) => {
          const newY = star.position.y + star.speed;
          if (newY > parentHeight) {
            const newX = Math.random() * (parentWidth - starHeight);
            return {
              ...star,
              position: { x: newX, y: -starHeight },
            };
          }
          return { ...star, position: { ...star.position, y: newY } };
        });
        return updatedStars;
      });
    }, 50);
  
    return () => clearInterval(moveInterval);
  };

  const timer = () => {
    timeRef.current = window.setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => window.clearInterval(timeRef.current as number);
  }

  const handlePlay = () => {
    audioRef.current?.play();
    setIsGamePlayed(true);
    setIsGamePaused(false);
  };

  const handlePause = () => {
    audioRef.current?.pause();
    setIsGamePlayed(false);
    setIsGamePaused(true);
  };

  const handleAudioAlwaysOn = () => {
    const audio = audioRef.current!;
    audio.addEventListener("ended", () => {
      audio.currentTime = 0;
      audio.play();
    });

    return () => {
      audio.removeEventListener("ended", () => {
        audio.currentTime = 0;
        audio.play();
      });
    };
  }

  const checkCollision = () => {
    if (
      positionAircraft.x < parachutes[0]?.position.x + 50 &&
      positionAircraft.x + 50 > parachutes[0]?.position.x &&
      positionAircraft.y < parachutes[0]?.position.y + 50 &&
      positionAircraft.y + 50 > parachutes[0]?.position.y
    ) {
      console.log(positionAircraft.x, positionAircraft.y, parachutes[0]?.position.x, parachutes[0]?.position.y)
      // alert("Collision detected!");
    }
  }

  const handleFuelZero = () => {
    setIsGameOver(true);
  }

  const addPlayers = async () => {

    const response = await fetch(`http://localhost:5000/players`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        time: "140",
        stars: "10"
      }),
    });
    const json = await response.json();
    console.log(json);
  };

  return (
    <>
      <audio ref={audioRef} src="/audios/bg-sound.mp3" />
      <div className="aircraft-playground">

        {!isGamePlayed && (
          <div className="flex justify-center items-center fixed top-0 left-0 w-full h-full z-50">
            <div className="text-white font-bold">Move the Aircraft to start the game</div>
          </div>
        )}

        {isGamePaused && (
          <div className="overlay">
            <div className="message">Game Paused</div>
          </div>
        )}

        {isGameOver && (
          <div className="overlay">
            <div className="flex flex-col gap-4 w-96 bg-black bg-opacity-75 p-8 rounded">
              <h1 className="font-space text-white text-center text-2xl">Game Over</h1>
              <form onSubmit={addPlayers} className="flex flex-row items-center justify-center gap-3">
                <input
                  type="text"
                  className="px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1 invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500 disabled:shadow-none"
                  placeholder="Input your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <button type="submit" className="w-40 bg-black text-white font-bold py-2 px-4 border border-white rounded">Simpan</button>
              </form>
            </div>
          </div>
        )}

        {
          isGamePlayed && (
            <div className="relative flex flex-row justify-between z-30 bg-transparent p-5">
              <div className="flex flex-row items-center h-max gap-2">
                <Fuel fill={fuel} onFuelZero={handleFuelZero} />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-end mb-1">
                  {
                    isGamePlayed ? (
                      <button type="button" onClick={handlePause}>
                        <Image
                          className="w-6 h-6 object-contain"
                          src={Pause}
                          alt="Pause Icon"
                        />
                      </button>
                    ) : (
                      <button type="button" onClick={handlePlay}>
                        <Image
                          className="w-6 h-6 object-contain"
                          src={Play}
                          alt="Play Icon"
                        />
                      </button>
                    )
                  }
                </div>
                <div className="flex flex-row items-center justify-end">
                  <span className="text-2xl mt-1 mr-2 text-white">{time}</span>
                  <Image
                    className="w-6 h-6 object-contain"
                    src={Time}
                    alt="Time Icon"
                  />
                </div>
                <div className="flex flex-row items-center justify-end">
                  <span className="text-2xl mt-1 mr-2 text-white">0</span>
                  <Image
                    className="w-6 h-6 object-contain"
                    src={Star}
                    alt="Star Icon"
                  />
                </div>
              </div>
            </div>
          )
        }

        <Image
          id="aircraft"
          style={{
            left: `${positionAircraft.x}px`,
            bottom: `${positionAircraft.y}px`,
          }}
          src={Aircraft}
          alt="Aircraft Icon"
        />

        { birds.map((bird) => (
          <Image
            className="bird"
            key={bird.id}
            style={{
              left: `${bird.position.x}px`,
              top: `${bird.position.y}px`,
            }}
            src={Bird}
            alt="Bird Icon"
          />
        )) }

        { clouds.map((cloud) => (
          <Image
            className="cloud"
            key={cloud.id}
            style={{
              left: `${cloud.position.x}px`,
              top: `${cloud.position.y}px`,
            }}
            src={Cloud}
            alt="Cloud Icon"
          />
        )) }

        { parachutes.map((parachute) => (
          <Image
            className="parachute"
            key={parachute.id}
            style={{
              left: `${parachute.position.x}px`,
              top: `${parachute.position.y}px`,
            }}
            src={Parachute}
            alt="Parachute Icon"
          />
        )) }
        
        { stars.map((star) => (
          <Image
            className="star"
            key={star.id}
            style={{
              left: `${star.position.x}px`,
              top: `${star.position.y}px`,
            }}
            src={Star}
            alt="Star Icon"
          />
        )) }
      </div>
    </>
  )
}