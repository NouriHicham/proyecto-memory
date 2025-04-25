import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Ganar() {
  return (
    <div>
      <h1 className="text-3xl font-bold mx-6 my-4">Gano</h1>
      <Link href="/juego"><Button variant="outline" className="cursor-pointer mx-6">Volver a jugar</Button></Link>
    </div>
  );
}