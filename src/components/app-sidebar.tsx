"use client";

import { useState, useEffect } from "react";
import {
  User,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  Home,
  Gamepad,
  Search,
  Star,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type AuthUser = {
  name: string;
  email: string;
};

const menuItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Juego", url: "/juego", icon: Gamepad },
  { title: "About", url: "/about", icon: Search },
];

export function AppSidebar({ children }: { children?: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [activeTab, setActiveTab] = useState("login");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Guarda el token en localStorage
  const saveToken = (token: string) => {
    localStorage.setItem("auth_token", token);
  };

  // Borra el token
  const clearToken = () => {
    localStorage.removeItem("auth_token");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;
    try {
      const res = await fetch(
        "https://m7-nourihicham.up.railway.app/api/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Error al iniciar sesión");
        setLoading(false);
        return;
      }
      saveToken(data.token);
      setUser({ name: data.name, email });
      setIsLoggedIn(true);
      setLoading(false);
    } catch (err) {
      setError("Error de red");
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;
    try {
      const res = await fetch(
        "https://m7-nourihicham.up.railway.app/api/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            password,
            password_confirmation: password,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Error al registrarse");
        setLoading(false);
        return;
      }
      setLoading(false);
    } catch (err) {
      setError("Error de red");
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (token) {
        await fetch("https://m7-nourihicham.up.railway.app/api/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (err) {
      // Opcional: manejar error de logout
    }
    setUser(null);
    setIsLoggedIn(false);
    clearToken();
  };

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      fetch("https://m7-nourihicham.up.railway.app/api/me", {
        headers: {
          method: "GET",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then(async (res) => {
          if (!res.ok) throw new Error("No autorizado");
          const data = await res.json();
          setUser({ name: data.name, email: data.email });
          setIsLoggedIn(true);
        })
        .catch(() => {
          setUser(null);
          setIsLoggedIn(false);
          clearToken();
        });
    }
  }, []);

  return (
    <SidebarProvider>
      <Sidebar side="left" variant="floating" collapsible="offcanvas">
        <SidebarHeader className="border-b">
          <div className="flex items-center gap-2 px-2 py-3">
            <span className="font-semibold text-blue-600">
              Juego de Memoria
            </span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          {isLoggedIn ? (
            <div className="p-4">
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                  <User className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="font-medium text-lg">{user?.name}</h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Star className="mr-2 h-4 w-4" />
                    <span>Mis Puntuaciones</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>
          ) : (
            <div className="p-4">
              <Tabs
                defaultValue="login"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                  <TabsTrigger value="register">Registrarse</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                      />
                    </div>
                    {error && (
                      <div className="text-red-500 text-sm">{error}</div>
                    )}
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={loading}
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      {loading ? "Cargando..." : "Iniciar Sesión"}
                    </Button>
                  </form>
                </TabsContent>
                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre</Label>
                      <Input id="name" name="name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-register">Email</Label>
                      <Input
                        id="email-register"
                        name="email"
                        type="email"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-register">Contraseña</Label>
                      <Input
                        id="password-register"
                        name="password"
                        type="password"
                        required
                      />
                    </div>
                    {error && (
                      <div className="text-red-500 text-sm">{error}</div>
                    )}
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={loading}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      {loading ? "Cargando..." : "Registrarse"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          )}

          <SidebarGroup>
            <SidebarGroupLabel>Menú</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t">
          {isLoggedIn ? (
            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-2 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          ) : (
            <div className="p-4 text-sm text-gray-500">
              Inicia sesión para guardar tus puntuaciones
            </div>
          )}
        </SidebarFooter>
      </Sidebar>
      {/* El trigger para abrir/cerrar el sidebar en móvil */}
      <SidebarTrigger className="m-2" />
      {/* Renderiza el contenido principal */}
      <main className="flex-1">{children}</main>
    </SidebarProvider>
  );
}
