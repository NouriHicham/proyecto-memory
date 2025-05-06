"use client";

import { Memoria } from "@/assets/memoria";
import "@/assets/styles.css";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


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
      
      //si el contador llega a 0 o todas las cartas ya se han volteado el juego termina
      if (contador <= 0 || memoria.getMatches() === 8) {
        if(memoria.getMatches() !== 8){
          setTiempoAgotado(true);
          memoria.setTiempoAgotado(true);
        }
      }else{
        //el contador bajara uno cada segundo
        setContador(contador - 1);
      }

      // console.log(memoria.getMatches());
      if (memoria.getMatches() === 8) {
        setWin(true);
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [contador]);

  const cambiarImagenes = async (number: number) => {
    if (number === 0) {
      try {
        const nuevasImagenes: string[] = [];
        for (let i = 0; i <= 7; i++) {
          let random = Math.floor(Math.random() * 1000) + 1;
          let pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${random}`).then(response => response.json())
          nuevasImagenes.push(pokemon.sprites.front_default);
        }
        memoria.actualizarImagenes(nuevasImagenes);
        memoria.dibujaMemoria("memoria-container");
      } catch (error) {
        console.error("Error al obtener nuevas imágenes:", error);
      }
    }else if(number === 1){
      try {
        const nuevasImagenes: string[] = [];
        for (let i = 0; i <= 7; i++) {
          let marvel = await fetch(`https://gateway.marvel.com/v1/public/characters/?nameStartsWith=cap&ts=1000&apikey=51b46c2ef71bf43efd59e952b8357ec6&hash=32b653d3c6081762fb7680831f97b5fd`)
          .then(response => response.json())
          nuevasImagenes.push(marvel.thumbnail.path + marvel.thumbnail.extension);
        }
        memoria.actualizarImagenes(nuevasImagenes);
        memoria.dibujaMemoria("memoria-container");
      } catch (error) {
        console.error("Error al obtener nuevas imágenes:", error);
      }
    }

    
        
  };

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
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="mt-5">
                <button onClick={() => cambiarImagenes(0)} className="px-3 py-2 mr-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                  <img src="/img/pokeball.png" alt="pokeball" className="w-5 h-5"/>
                </button> 
              </TooltipTrigger>
              <TooltipContent>
                <p>Cambiar imagenes por pokemons</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="mt-5">
                <button onClick={() => cambiarImagenes(1)} className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  <img src="/img/marvel.png" alt="marvel" className="w-5 h-5"/>
                </button> 
              </TooltipTrigger>
              <TooltipContent>
                <p>Cambiar imagenes por personajes de marvel</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </>
  );
}
