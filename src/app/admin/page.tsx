"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";

// Tipos para usuario y partida
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Game {
  id: number;
  user?: User;
  clicks: number;
  duration: number;
  points: number;
  created_at?: string;
}

export default function AdminMainPage() {
  // Estado para partidas
  const [partidas, setPartidas] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado para el modal de edición
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState<Game | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Estado para el modal de edición de cuentas
  const [editUserModal, setEditUserModal] = useState(false);
  const [editUserData, setEditUserData] = useState<User | null>(null);
  const [editUserLoading, setEditUserLoading] = useState(false);
  const [editUserError, setEditUserError] = useState<string | null>(null);
  const [cuentasData, setCuentasData] = useState<User[]>([]);
  const [cuentasLoading, setCuentasLoading] = useState(false);
  const [cuentasError, setCuentasError] = useState<string | null>(null);

  // Obtener partidas desde la API
  const fetchPartidas = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("auth_token");
    try {
      const res = await fetch("https://m7-nourihicham.up.railway.app/api/games", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("No se pudieron obtener las partidas");
      const data = await res.json();
      setPartidas(Array.isArray(data.data) ? data.data : []);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "message" in err) {
        setError((err as { message?: string }).message || "Error al cargar partidas");
      } else {
        setError("Error al cargar partidas");
      }
    }
    setLoading(false);
  };

  // Obtener cuentas desde la API
  const fetchCuentas = async () => {
    setCuentasLoading(true);
    setCuentasError(null);
    const token = localStorage.getItem("auth_token");
    try {
      const res = await fetch("https://m7-nourihicham.up.railway.app/api/users", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("No se pudieron obtener las cuentas");
      const data = await res.json();
      setCuentasData(Array.isArray(data.data) ? data.data : []);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "message" in err) {
        setCuentasError((err as { message?: string }).message || "Error al cargar cuentas");
      } else {
        setCuentasError("Error al cargar cuentas");
      }
    }
    setCuentasLoading(false);
  };

  // Eliminar partida
  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que quieres eliminar esta partida?")) return;
    const token = localStorage.getItem("auth_token");
    try {
      const res = await fetch(`https://m7-nourihicham.up.railway.app/api/games/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("No se pudo eliminar la partida");
      setPartidas((prev) => prev.filter((p) => p.id !== id));
    } catch (err: unknown) {
      if (err && typeof err === "object" && "message" in err) {
        alert((err as { message?: string }).message || "Error al eliminar");
      } else {
        alert("Error al eliminar");
      }
    }
  };

  const handleUpdate = (partida: Game) => {
    setEditData(partida);
    setEditError(null);
    setEditModal(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editData) return;
    setEditData({ ...editData, [e.target.name]: e.target.value } as Game);
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editData) return;
    setEditLoading(true);
    setEditError(null);
    const token = localStorage.getItem("auth_token");
    try {
      const res = await fetch(`https://m7-nourihicham.up.railway.app/api/games/${editData.id}/finish`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          clicks: Number(editData.clicks),
          duration: Number(editData.duration),
          points: Number(editData.points),
        }),
      });
      if (!res.ok) throw new Error("No se pudo actualizar la partida");
      setEditModal(false);
      fetchPartidas();
    } catch (err: unknown) {
      if (err && typeof err === "object" && "message" in err) {
        setEditError((err as { message?: string }).message || "Error al actualizar");
      } else {
        setEditError("Error al actualizar");
      }
    }
    setEditLoading(false);
  };

  const handleUserUpdate = (cuenta: User) => {
    setEditUserData(cuenta);
    setEditUserError(null);
    setEditUserModal(true);
  };

  const handleUserEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editUserData) return;
    setEditUserData({ ...editUserData, [e.target.name]: e.target.value } as User);
  };

  const handleUserEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUserData) return;
    setEditUserLoading(true);
    setEditUserError(null);
    const token = localStorage.getItem("auth_token");
    try {
      const res = await fetch(`https://m7-nourihicham.up.railway.app/api/users/${editUserData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editUserData.name,
          email: editUserData.email,
          role: editUserData.role,
        }),
      });
      if (!res.ok) throw new Error("No se pudo actualizar la cuenta");
      // Actualizar la lista localmente (en producción, refrescar desde la API)
      setCuentasData((prev) => prev.map((c) => c.id === editUserData.id ? { ...c, ...editUserData } : c));
      setEditUserModal(false);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "message" in err) {
        setEditUserError((err as { message?: string }).message || "Error al actualizar");
      } else {
        setEditUserError("Error al actualizar");
      }
    }
    setEditUserLoading(false);
  };

  //función para eliminar usuarios
  const handleDeleteUser = async (id: number) => {
    if (!confirm("¿Seguro que quieres eliminar este usuario?")) return;
    const token = localStorage.getItem("auth_token");
    try {
      const res = await fetch(`https://m7-nourihicham.up.railway.app/api/user/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("No se pudo eliminar el usuario");
      setCuentasData((prev) => prev.filter((u) => u.id !== id));
    } catch (err: unknown) {
      if (err && typeof err === "object" && "message" in err) {
        alert((err as { message?: string }).message || "Error al eliminar usuario");
      } else {
        alert("Error al eliminar usuario");
      }
    }
  };

  // Obtener partidas y cuentas al cargar
  useEffect(() => {
    fetchPartidas();
    fetchCuentas();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>
      <Tabs defaultValue="cuentas" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="cuentas">Cuentas</TabsTrigger>
          <TabsTrigger value="partidas">Partidas</TabsTrigger>
        </TabsList>
        <TabsContent value="cuentas">
          <h2 className="text-xl font-semibold mb-4">Administrar Cuentas</h2>
          {cuentasLoading && <div>Cargando...</div>}
          {cuentasError && <div className="text-red-500 mb-4">{cuentasError}</div>}
          <table className="w-full text-sm border">
            <thead>
              <tr>
                <th className="text-left border px-2">ID</th>
                <th className="text-left border px-2">Nombre</th>
                <th className="text-left border px-2">Email</th>
                <th className="text-left border px-2">Rol</th>
                <th className="text-left border px-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cuentasData.map((c) => (
                <tr key={c.id}>
                  <td className="border px-2">{c.id}</td>
                  <td className="border px-2">{c.name}</td>
                  <td className="border px-2">{c.email}</td>
                  <td className="border px-2">{c.role}</td>
                  <td className="border px-2 flex gap-2">
                    <button
                      className="text-blue-600 hover:text-blue-800 hover:bg-neutral-200 rounded p-1 cursor-pointer flex items-center gap-1 my-1"
                      onClick={() => handleUserUpdate(c)}
                    >
                      <Pencil size={16} />
                      Editar
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 hover:bg-neutral-200 rounded p-1 cursor-pointer flex items-center gap-1 my-1"
                      onClick={() => handleDeleteUser(c.id)}
                    >
                      <Trash size={16} />
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal de edición de cuenta */}
          {editUserModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent bg-opacity-20 backdrop-blur">
              <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                  onClick={() => setEditUserModal(false)}
                >
                  ✕
                </button>
                <h3 className="text-lg font-semibold mb-4">Editar Cuenta #{editUserData?.id}</h3>
                <form onSubmit={handleUserEditSave} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium">Nombre</label>
                    <input
                      type="text"
                      name="name"
                      value={editUserData?.name ?? ''}
                      onChange={handleUserEditChange}
                      className="border rounded px-2 py-1 w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editUserData?.email ?? ''}
                      onChange={handleUserEditChange}
                      className="border rounded px-2 py-1 w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Rol</label>
                    <select
                      name="role"
                      value={editUserData?.role ?? ''}
                      onChange={handleUserEditChange}
                      className="border rounded px-2 py-1 w-full"
                      required
                    >
                      <option value="admin">admin</option>
                      <option value="user">user</option>
                    </select>
                  </div>
                  {editUserError && <div className="text-red-500 text-sm">{editUserError}</div>}
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-200 rounded"
                      onClick={() => setEditUserModal(false)}
                      disabled={editUserLoading}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded"
                      disabled={editUserLoading}
                    >
                      {editUserLoading ? "Guardando..." : "Guardar"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="partidas">
          <h2 className="text-xl font-semibold mb-4">Administrar Partidas</h2>
          {loading && <div>Cargando...</div>}
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <table className="w-full text-sm border">
            <thead>
              <tr>
                <th className="text-left border px-2">ID</th>
                <th className="text-left border px-2">Usuario</th>
                <th className="text-left border px-2">Clicks</th>
                <th className="text-left border px-2">Puntos</th>
                <th className="text-left border px-2">Fecha</th>
                <th className="text-left border px-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {partidas.map((p) => (
                <tr key={p.id}>
                  <td className="border px-2">{p.id}</td>
                  <td className="border px-2">{p.user?.email || "-"}</td>
                  <td className="border px-2">{p.clicks}</td>
                  <td className="border px-2">{p.points}</td>
                  <td className="border px-2">{p.created_at ? new Date(p.created_at).toLocaleString() : "-"}</td>
                  <td className="border px-2 text-end flex">
                    <button
                      className="text-red-600 hover:text-red-800 hover:bg-neutral-200 rounded p-1 cursor-pointer flex items-center gap-1 my-1 mr-1"
                      onClick={() => handleDelete(p.id)}
                    >
                      <Trash size={16} />
                      Eliminar
                    </button>
                    <button
                      className="text-blue-600 hover:text-blue-800 hover:bg-neutral-200 rounded p-1 cursor-pointer flex items-center gap-1 my-1"
                      onClick={() => handleUpdate(p)}
                    >
                      <Pencil size={16} />
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal de edición */}
          {editModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent bg-opacity-20 backdrop-blur">
              <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                  onClick={() => setEditModal(false)}
                >
                  ✕
                </button>
                <h3 className="text-lg font-semibold mb-4">Editar Partida #{editData?.id}</h3>
                <form onSubmit={handleEditSave} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium">Clicks</label>
                    <input
                      type="number"
                      name="clicks"
                      value={editData?.clicks ?? ''}
                      onChange={handleEditChange}
                      className="border rounded px-2 py-1 w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Puntos</label>
                    <input
                      type="number"
                      name="points"
                      value={editData?.points ?? ''}
                      onChange={handleEditChange}
                      className="border rounded px-2 py-1 w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Duración (segundos)</label>
                    <input
                      type="number"
                      name="duration"
                      value={editData?.duration ?? ''}
                      onChange={handleEditChange}
                      className="border rounded px-2 py-1 w-full"
                      required
                    />
                  </div>
                  {editError && <div className="text-red-500 text-sm">{editError}</div>}
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-200 rounded"
                      onClick={() => setEditModal(false)}
                      disabled={editLoading}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded"
                      disabled={editLoading}
                    >
                      {editLoading ? "Guardando..." : "Guardar"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
