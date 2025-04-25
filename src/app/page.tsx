import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold mx-6 my-4">Home</h1>
      <Link href="/juego"><Button variant="outline" className="cursor-pointer mx-6">JUGAR</Button></Link>
    </div>
  );
}