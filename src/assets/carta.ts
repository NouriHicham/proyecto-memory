export class Carta{
  constructor(public numero: number, public key: number) {
    this.numero = numero
    this.key = key
  }

  public dibujarCarta(flip: boolean, match: boolean) {
    return `<div key="${this.key}" class="${flip || match ? "bg-white rotate-y-180" : ""}
    carta flip aspect-square flex items-center justify-center rounded-lg cursor-pointer text-3xl transition-all duration-300 transform bg-cyan-500 hover:bg-cyan-600" onClick="rotarCarta(${this.key})">${this.numero}</div>`;
  }


}