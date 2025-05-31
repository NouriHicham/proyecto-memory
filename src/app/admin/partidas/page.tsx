"use client";
import { useEffect, useState } from "react";

export default function AdminPartidas() {
  // Simulación de partidas
  const [partidas, setPartidas] = useState([
    { id: 1, usuario: "user1@example.com", clicks: 20, puntos: 900, fecha: "2024-06-01" },
    { id: 2, usuario: "user2@example.com", clicks: 25, puntos: 850, fecha: "2024-06-02" },
  ]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Administrar Partidas</h1>
      <table className="w-full text-sm border">
        <thead>
          <tr>
            <th className="text-left border px-2">ID</th>
            <th className="text-left border px-2">Usuario</th>
            <th className="text-left border px-2">Clicks</th>
            <th className="text-left border px-2">Puntos</th>
            <th className="text-left border px-2">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {partidas.map((p) => (
            <tr key={p.id}>
              <td className="border px-2">{p.id}</td>
              <td className="border px-2">{p.usuario}</td>
              <td className="border px-2">{p.clicks}</td>
              <td className="border px-2">{p.puntos}</td>
              <td className="border px-2">{p.fecha}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
