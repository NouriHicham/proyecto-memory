"use client";

import { Memoria } from "@/assets/memoria";
import "@/assets/styles.css";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    rotarCarta: (key: number) => void;
  }
}

export default function Juego() {
  const [memoria] = useState(new Memoria());
  const [clicks, setClicks] = useState(0);
  const [tiempoAgotado, setTiempoAgotado] = useState(false);
  const [win, setWin] = useState(false);
  const [contador, setContador] = useState(40);

  useEffect(
    () => {
      memoria.shuffle();
      memoria.dibujaMemoria("memoria-container");

      window.rotarCarta = (key: number) => {
          memoria.rotarCarta(key);
          setClicks(memoria.clicks);     
      };
      
    },
    [/* memoria */]
  ); // eslint-disable-line react-hooks/exhaustive-deps

  //tienes 20 segundos para terminar el juego
  useEffect(() => {
    const intervalId = setInterval(() => {
      
      if (contador <= 0 || memoria.getMatches() === 8) {
        if(memoria.getMatches() !== 8){
          setTiempoAgotado(true);
          memoria.setTiempoAgotado(true);
        }
      }else{
        setContador(contador - 1);
      }

      console.log(memoria.getMatches());
      if (memoria.getMatches() === 8) {
        setWin(true);
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [contador]);

  return (
    <>
      <div className="m-5">
        <h1>Juego de Memoria</h1>
        <p>Clicks: {clicks}</p>
        <p>Tiempo restante: {contador} segundos</p>
        <div
          id="memoria-container"
          className={`grid grid-cols-4 gap-2 w-[500px] ${
            tiempoAgotado ? "text-red-500 text-2xl pointer-events-none" : (win ? "text-green-500 text-2xl" : "")
          }`}
        >
          {tiempoAgotado ? "Tiempo agotado" : ""}
          {win ? "Gano" : ""}
        </div>
      </div>
    </>
  );
}
