import { Carta } from "./carta";

export class Memoria {
  public memoria: Carta[] = [];
  private flippedCards: Carta[] = [];
  private isChecking: boolean = false;
  public clicks: number = 0;
  public matches: number = 0; // debe llegar a 8
  private tiempoAgotado: boolean = false;

  private imagenes: string[] = [
    "/img/0.png",
    "/img/1.png",
    "/img/2.png",
    "/img/3.png",
    "/img/4.png",
    "/img/5.png",
    "/img/6.png",
    "/img/7.png",
  ]
  constructor() {
    [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7].forEach((item, key) => this.memoria.push(new Carta(item, key, this.imagenes)));
  }

  public shuffle() {
    this.memoria.sort(() => Math.random() - 0.5);
  }

  public dibujaMemoria(containerId: string) {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = this.memoria.map((item) => item.dibujarCarta()).join("");
    }
  }

  public rotarCarta(key: number) {
    if (this.tiempoAgotado) return;

    const carta = this.memoria.find((item) => item.key === key);
    this.clicks++;

    //evitar que se giren las cartas si hay dos giradas
    if (this.flippedCards.length === 2 || this.isChecking) {
      this.clicks--; // no sumar clicks si hay dos cartas giradas
      return;
    }

    if (carta && !carta.flip && !carta.match) {
      carta.flip = true;
      carta.clicks++;
      this.flippedCards.push(carta);

      if(this.flippedCards.length === 2) {
        this.checkMatch();
      }

      this.dibujaMemoria("memoria-container");
    }
  }

  private checkMatch() {
    const [carta1, carta2] = this.flippedCards;

    //bloquea interaccion hasta que se verifique
    this.isChecking = true;
    if (carta1.numero === carta2.numero) {
      carta1.match = true;
      carta2.match = true;
      this.matches++;
      this.isChecking = false;

    }else{
      setTimeout(() => {
        carta1.flip = false;
        carta2.flip = false;
        this.dibujaMemoria("memoria-container");
        this.isChecking = false;
      }, 1000); // Espera 1 segundo antes de voltear las cartas
    }

    this.flippedCards = [];
  }

  public getMatches() {
    return this.matches;
  }

  public setTiempoAgotado(tiempoAgotado: boolean) {
    this.tiempoAgotado = tiempoAgotado;
  }
  
}