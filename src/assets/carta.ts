export class Carta{
  public flip: boolean = false;
  public match: boolean = false;
  public clicks: number = 0;

  constructor(public numero: number, public key: number, public imagenes: string[] = []) {
    this.numero = numero
    this.key = key
  }

  public dibujarCarta() {
    const imagen = this.imagenes[this.numero];
    return `<div key="${this.key}" 
    class="
    ${this.flip || this.match ? "bg-white" : "hover:bg-cyan-600 cursor-pointer"}
    ${this.match ? "ring-3 ring-cyan-500 rotate-y-180" : ""}
    aspect-square flex items-center justify-center rounded-lg text-3xl bg-cyan-500 select-none transition-all duration-300 transform relative
    ${this.flip && !this.match ? "flip-card" : ""}"
    
    onClick="rotarCarta(${this.key})">
      ${
        this.flip || this.match
          ? `<img src="${imagen}" alt="Carta ${this.numero}" class="w-full h-full object-cover rounded-lg" />`
          : ""
      }
      <span class="absolute bottom-1 right-2 text-xs font-medium text-blue-800 bg-cyan-100 px-1 rounded rotate-y-180">
        ${this.flip || this.match ? this.clicks : ""}
      </span>
    </div>`;
  }

}