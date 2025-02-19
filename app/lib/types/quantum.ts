import { Complex } from '../utils/complex'

// Quantum Types
type Qubit = Complex
type QuantumRegister = Qubit[]
type QuantumGate = (q: QuantumRegister) => QuantumRegister

// Quantum State Management
export class QuantumState {
  private amplitudes: Complex[]
  
  constructor(n: number) {
    this.amplitudes = Array(2 ** n).fill(new Complex(0, 0))
    this.amplitudes[0] = new Complex(1, 0) // Initialize to |0⟩
  }
  
  // Apply quantum gate (unitary transformation)
  apply = (gate: QuantumGate) => gate(this.amplitudes)
  
  // Measure quantum state (returns classical bit with probability)
  measure = () => {
    const p = this.amplitudes.map(a => a.abs() ** 2)
    return p.findIndex(prob => Math.random() <= prob)
  }
  
  // Create entangled state
  entangle = (other: QuantumState): QuantumState => {
    const entangled = new QuantumState(1)
    entangled.amplitudes = this.amplitudes.flatMap(a1 => 
      other.amplitudes.map(a2 => a1.multiply(a2)))
    return entangled
  }
} 