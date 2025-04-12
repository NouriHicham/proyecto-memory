"use client";

import { Memoria } from "@/assets/memoria";
import { useEffect, useState } from "react";

export default function Home() {
  const memoria = new Memoria();
  const [clicks, setClicks] = useState(0);
  useEffect(() => {
    memoria.shuffle();
    memoria.dibujaMemoria("memoria-container");
    const click = memoria.clicks;
    setClicks(click);

    (window as any).rotarCarta = (key: number) => {
      memoria.rotarCarta(key);
      setClicks(memoria.clicks);
    };
  }, []);

  return (
    <div className="m-5">
      <h1>Juego de Memoria</h1>
      <p>Clicks: {clicks}</p>
      <div id="memoria-container" className="grid grid-cols-4 gap-2 w-[350px]"></div>
    </div>
  );
}
