"use client";

import { Memoria } from "@/assets/memoria";
import { useEffect } from "react";

export default function Home() {
  const memoria = new Memoria();
  useEffect(() => {
    memoria.shuffle();
    memoria.dibujaMemoria("memoria-container");

    (window as any).rotarCarta = (key: number) => {
      memoria.rotarCarta(key);
    };
  }, []);

  return (
    <div className="m-5">
      <h1>Juego de Memoria</h1>
      <div id="memoria-container" className="grid grid-cols-4 gap-3 w-[350px]"></div>
    </div>
  );
}
