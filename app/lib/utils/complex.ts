export class Complex {
  constructor(public re: number, public im: number) {}
  
  multiply = (other: Complex) => new Complex(
    this.re * other.re - this.im * other.im,
    this.re * other.im + this.im * other.re
  )
  
  abs = () => Math.sqrt(this.re ** 2 + this.im ** 2)
} 