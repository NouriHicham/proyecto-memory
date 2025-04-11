import { Carta } from "./carta";

export class Memoria {
  public memoria: Carta[] = [];
  constructor() {
    [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7].forEach((item, key) => this.memoria.push(new Carta(item, key)));
  }

  public shuffle() {
    this.memoria.sort(() => Math.random() - 0.5);
  }

  public dibujaMemoria(containerId: string) {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = this.memoria.map((item) => item.dibujarCarta(false, false)).join("");
    }
  }

  public rotarCarta(key: number) {
    const carta = this.memoria.find((item) => item.key === key);
    if (carta) {
      carta.dibujarCarta(true, false);
    }
  }
}