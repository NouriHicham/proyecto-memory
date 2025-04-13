export class Carta{
  public flip: boolean = false;
  public match: boolean = false;

  constructor(public numero: number, public key: number) {
    this.numero = numero
    this.key = key
  }

  public dibujarCarta() {
    return `<div key="${this.key}" 
    class="
    ${this.flip || this.match ? "bg-white" : "hover:bg-cyan-600 cursor-pointer rotate-y-180"}
    ${this.match ? "ring-2 ring-cyan-500" : ""}
    aspect-square flex items-center justify-center rounded-lg text-3xl transition duration-300 transform bg-cyan-500 select-none" onClick="rotarCarta(${this.key})"> ${this.flip || this.match ? this.numero : ""} </div>`;
  }


}