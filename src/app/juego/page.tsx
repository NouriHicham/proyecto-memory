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

  // Nuevo: estado para sesión y juego
  const [token, setToken] = useState<string | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);

  // Nuevo: estado para controlar inicio del juego
  const [started, setStarted] = useState(false);

  // Detectar sesión y crear juego si corresponde
  useEffect(() => {
    if (!started) return;
    const t = localStorage.getItem("auth_token");
    setToken(t);
    if (t) {
      fetch("https://m7-nourihicham.up.railway.app/api/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${t}`,
        },
        body: JSON.stringify({}), // puedes enviar datos iniciales si la API lo requiere
      })
        .then(async (res) => {
          if (!res.ok) throw new Error("No se pudo crear el juego");
          const data = await res.json();
          setGameId(data.data.id?.toString() || null);
        })
        .catch(() => setGameId(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  // Solo inicializa el tablero cuando el juego comienza
  useEffect(() => {
    if (!started) return;
    memoria.shuffle();
    memoria.dibujaMemoria("memoria-container");

    window.rotarCarta = (key: number) => {
      memoria.rotarCarta(key);
      setClicks(memoria.clicks);
    };
    // Reinicia clicks y estados al comenzar
    setClicks(0);
    setTiempoAgotado(false);
    setWin(false);
    setContador(40);
  }, [started]);

  // Cuenta regresiva del juego
  useEffect(() => {
    if (!started) return;
    const intervalId = setInterval(() => {
      if (contador <= 0 || memoria.getMatches() === 8) {
        if (memoria.getMatches() !== 8) {
          setTiempoAgotado(true);
          memoria.setTiempoAgotado(true);
        }
      } else {
        setContador((prev) => prev - 1);
      }

      if (memoria.getMatches() === 8) {
        setWin(true);
        clearInterval(intervalId);

        // Nuevo: Si hay sesión y gameId, finalizar juego
        if (token && gameId) {
          fetch(
            `https://m7-nourihicham.up.railway.app/api/games/${gameId}/finish`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                clicks: clicks,
                duration: 40 - contador,
                points: 1000 - clicks - (40 - contador) - (8 - memoria.getMatches()),
                // puedes agregar más datos si la API lo requiere
              }),
            }
          ).catch(() => {});
        }
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [contador, memoria, token, gameId, clicks, started]);

  // Handler para comenzar el juego
  const handleStart = () => {
    setStarted(true);
  };

  return (
    <>
      <div className="m-5">
        <h1>Juego de Memoria</h1>
        {!started ? (
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleStart}
          >
            Comenzar
          </button>
        ) : (
          <>
            <p>Clicks: {clicks}</p>
            <p>Tiempo restante: {contador} segundos</p>
            <div
              id="memoria-container"
              className={`grid grid-cols-4 gap-2 w-[500px] ${
                tiempoAgotado
                  ? "text-red-500 text-2xl pointer-events-none"
                  : win
                  ? "text-green-500 text-2xl"
                  : ""
              }`}
            >
              {tiempoAgotado ? "Tiempo agotado" : ""}
              {win ? "Gano" : ""}
            </div>
          </>
        )}
      </div>
    </>
  );
}
