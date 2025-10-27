import type { ComponentType, ConnectionNode } from '../types'

// Define connection points for each component type
// Points are relative to component center (0,0) before rotation
export const COMPONENT_CONNECTION_POINTS: Record<ComponentType, Array<{ id: string; x: number; y: number }>> = {
  // Basic Components
  Resistor: [
    { id: 'left', x: -24, y: 0 },
    { id: 'right', x: 24, y: 0 }
  ],
  Capacitor: [
    { id: 'left', x: -24, y: 0 },
    { id: 'right', x: 24, y: 0 }
  ],
  Inductor: [
    { id: 'left', x: -24, y: 0 },
    { id: 'right', x: 24, y: 0 }
  ],
  Battery: [
    { id: 'positive', x: 24, y: 0 },
    { id: 'negative', x: -24, y: 0 }
  ],
  Ground: [
    { id: 'input', x: 0, y: -10 }
  ],
  OpAmp: [
    { id: 'output', x: 28, y: 0 },
    { id: 'inverting', x: -26, y: -6 },
    { id: 'nonInverting', x: -26, y: 6 }
  ],
  Diode: [
    { id: 'anode', x: -24, y: 0 },
    { id: 'cathode', x: 24, y: 0 }
  ],
  LED: [
    { id: 'anode', x: -24, y: 0 },
    { id: 'cathode', x: 24, y: 0 }
  ],
  Switch: [
    { id: 'input', x: -24, y: 0 },
    { id: 'output', x: 24, y: 0 }
  ],
  Node: [
    { id: 'center', x: 0, y: 0 }
  ],
  
  // Transistors
  TransistorNPN: [
    { id: 'collector', x: 24, y: 0 },
    { id: 'base', x: -24, y: -4 },
    { id: 'emitter', x: -24, y: 4 }
  ],
  TransistorPNP: [
    { id: 'collector', x: 24, y: 0 },
    { id: 'base', x: -24, y: -4 },
    { id: 'emitter', x: -24, y: 4 }
  ],
  MOSFETN: [
    { id: 'drain', x: 24, y: 0 },
    { id: 'gate', x: 0, y: -16 },
    { id: 'source', x: -24, y: 0 }
  ],
  MOSFETP: [
    { id: 'drain', x: 24, y: 0 },
    { id: 'gate', x: 0, y: -16 },
    { id: 'source', x: -24, y: 0 }
  ],
  JFETN: [
    { id: 'drain', x: 24, y: 0 },
    { id: 'gate', x: 0, y: -16 },
    { id: 'source', x: -24, y: 0 }
  ],
  JFETP: [
    { id: 'drain', x: 24, y: 0 },
    { id: 'gate', x: 0, y: -16 },
    { id: 'source', x: -24, y: 0 }
  ],
  IGBT: [
    { id: 'collector', x: 24, y: 0 },
    { id: 'gate', x: 0, y: -16 },
    { id: 'emitter', x: -24, y: 0 }
  ],
  DarlingtonTransistor: [
    { id: 'collector', x: 24, y: 0 },
    { id: 'base', x: -24, y: -2 },
    { id: 'emitter', x: -24, y: 2 }
  ],
  
  // Diodes
  ZenerDiode: [
    { id: 'anode', x: -24, y: 0 },
    { id: 'cathode', x: 24, y: 0 }
  ],
  SchottkyDiode: [
    { id: 'anode', x: -24, y: 0 },
    { id: 'cathode', x: 24, y: 0 }
  ],
  VaractorDiode: [
    { id: 'anode', x: -24, y: 0 },
    { id: 'cathode', x: 24, y: 0 }
  ],
  Photodiode: [
    { id: 'anode', x: -24, y: 0 },
    { id: 'cathode', x: 24, y: 0 }
  ],
  TunnelDiode: [
    { id: 'anode', x: -24, y: 0 },
    { id: 'cathode', x: 24, y: 0 }
  ],
  AvalancheDiode: [
    { id: 'anode', x: -24, y: 0 },
    { id: 'cathode', x: 24, y: 0 }
  ],
  
  // Power Devices
  Thyristor: [
    { id: 'anode', x: 24, y: 0 },
    { id: 'cathode', x: -24, y: 0 },
    { id: 'gate', x: 0, y: -16 }
  ],
  Triac: [
    { id: 'anode1', x: 24, y: 0 },
    { id: 'anode2', x: -24, y: 0 },
    { id: 'gate', x: 0, y: -16 }
  ],
  Diac: [
    { id: 'anode1', x: 24, y: 0 },
    { id: 'anode2', x: -24, y: 0 }
  ],
  PowerMOSFET: [
    { id: 'drain', x: 24, y: 0 },
    { id: 'gate', x: 0, y: -16 },
    { id: 'source', x: -24, y: 0 }
  ],
  
  // Passive Components
  Transformer: [
    { id: 'primary1', x: -24, y: -8 },
    { id: 'primary2', x: -24, y: 8 },
    { id: 'secondary1', x: 16, y: -8 },
    { id: 'secondary2', x: 16, y: 8 }
  ],
  Crystal: [
    { id: 'left', x: -24, y: 0 },
    { id: 'right', x: 24, y: 0 }
  ],
  Relay: [
    { id: 'input1', x: -24, y: -4 },
    { id: 'input2', x: -24, y: 4 },
    { id: 'output1', x: 24, y: -4 },
    { id: 'output2', x: 24, y: 4 }
  ],
  Fuse: [
    { id: 'left', x: -24, y: 0 },
    { id: 'right', x: 24, y: 0 }
  ],
  Potentiometer: [
    { id: 'left', x: -24, y: 0 },
    { id: 'right', x: 24, y: 0 },
    { id: 'wiper', x: 0, y: -8 }
  ],
  VariableCapacitor: [
    { id: 'left', x: -24, y: 0 },
    { id: 'right', x: 24, y: 0 }
  ],
  VariableInductor: [
    { id: 'left', x: -24, y: 0 },
    { id: 'right', x: 24, y: 0 }
  ],
  Thermistor: [
    { id: 'left', x: -24, y: 0 },
    { id: 'right', x: 24, y: 0 }
  ],
  Photoresistor: [
    { id: 'left', x: -24, y: 0 },
    { id: 'right', x: 24, y: 0 }
  ],
  Varistor: [
    { id: 'left', x: -24, y: 0 },
    { id: 'right', x: 24, y: 0 }
  ],
  
  // Sources
  VoltageSource: [
    { id: 'positive', x: 24, y: 0 },
    { id: 'negative', x: -24, y: 0 }
  ],
  CurrentSource: [
    { id: 'positive', x: 24, y: 0 },
    { id: 'negative', x: -24, y: 0 }
  ],
  ACSource: [
    { id: 'positive', x: 24, y: 0 },
    { id: 'negative', x: -24, y: 0 }
  ],
  DCSource: [
    { id: 'positive', x: 24, y: 0 },
    { id: 'negative', x: -24, y: 0 }
  ],
  VoltageControlledVoltageSource: [
    { id: 'output+', x: 24, y: 0 },
    { id: 'output-', x: -24, y: 0 },
    { id: 'input+', x: -24, y: -16 },
    { id: 'input-', x: -24, y: -20 }
  ],
  CurrentControlledCurrentSource: [
    { id: 'output+', x: 24, y: 0 },
    { id: 'output-', x: -24, y: 0 },
    { id: 'input+', x: -24, y: -16 },
    { id: 'input-', x: -24, y: -20 }
  ],
  VoltageControlledCurrentSource: [
    { id: 'output+', x: 24, y: 0 },
    { id: 'output-', x: -24, y: 0 },
    { id: 'input+', x: -24, y: -16 },
    { id: 'input-', x: -24, y: -20 }
  ],
  CurrentControlledVoltageSource: [
    { id: 'output+', x: 24, y: 0 },
    { id: 'output-', x: -24, y: 0 },
    { id: 'input+', x: -24, y: -16 },
    { id: 'input-', x: -24, y: -20 }
  ],
  
  // Amplifiers
  Amplifier: [
    { id: 'output', x: 28, y: 0 },
    { id: 'input+', x: -26, y: -6 },
    { id: 'input-', x: -26, y: 6 }
  ],
  DifferentialAmplifier: [
    { id: 'output', x: 28, y: 0 },
    { id: 'input+', x: -26, y: -6 },
    { id: 'input-', x: -26, y: 6 }
  ],
  InstrumentationAmplifier: [
    { id: 'output', x: 28, y: 0 },
    { id: 'input+', x: -26, y: -6 },
    { id: 'input-', x: -26, y: 6 }
  ],
  Comparator: [
    { id: 'output', x: 28, y: 0 },
    { id: 'input+', x: -26, y: -6 },
    { id: 'input-', x: -26, y: 6 }
  ],
  SchmittTrigger: [
    { id: 'output', x: 28, y: 0 },
    { id: 'input+', x: -26, y: -6 },
    { id: 'input-', x: -26, y: 6 }
  ],
  
  // Logic Gates
  LogicGateAND: [
    { id: 'input1', x: -24, y: -8 },
    { id: 'input2', x: -24, y: 8 },
    { id: 'output', x: 24, y: 0 }
  ],
  LogicGateOR: [
    { id: 'input1', x: -24, y: -8 },
    { id: 'input2', x: -24, y: 8 },
    { id: 'output', x: 24, y: 0 }
  ],
  LogicGateNOT: [
    { id: 'input', x: -24, y: 0 },
    { id: 'output', x: 24, y: 0 }
  ],
  LogicGateNAND: [
    { id: 'input1', x: -24, y: -8 },
    { id: 'input2', x: -24, y: 8 },
    { id: 'output', x: 24, y: 0 }
  ],
  LogicGateNOR: [
    { id: 'input1', x: -24, y: -8 },
    { id: 'input2', x: -24, y: 8 },
    { id: 'output', x: 24, y: 0 }
  ],
  LogicGateXOR: [
    { id: 'input1', x: -24, y: -8 },
    { id: 'input2', x: -24, y: 8 },
    { id: 'output', x: 24, y: 0 }
  ],
  LogicGateXNOR: [
    { id: 'input1', x: -24, y: -8 },
    { id: 'input2', x: -24, y: 8 },
    { id: 'output', x: 24, y: 0 }
  ],
  Buffer: [
    { id: 'input', x: -24, y: 0 },
    { id: 'output', x: 24, y: 0 }
  ],
  Inverter: [
    { id: 'input', x: -24, y: 0 },
    { id: 'output', x: 24, y: 0 }
  ],
  
  // RF Components
  Antenna: [
    { id: 'input', x: 0, y: 0 }
  ],
  Speaker: [
    { id: 'input', x: -24, y: 0 }
  ],
  Microphone: [
    { id: 'output', x: 24, y: 0 }
  ],
  Motor: [
    { id: 'input1', x: -24, y: -8 },
    { id: 'input2', x: -24, y: 8 },
    { id: 'output1', x: 24, y: -8 },
    { id: 'output2', x: 24, y: 8 }
  ],
  Generator: [
    { id: 'input1', x: -24, y: -8 },
    { id: 'input2', x: -24, y: 8 },
    { id: 'output1', x: 24, y: -8 },
    { id: 'output2', x: 24, y: 8 }
  ],
  
  // Placeholder components (using basic 2-terminal connection)
  FlipFlop: [
    { id: 'input1', x: -24, y: -8 },
    { id: 'input2', x: -24, y: 8 },
    { id: 'output1', x: 24, y: -8 },
    { id: 'output2', x: 24, y: 8 }
  ],
  Counter: [
    { id: 'input', x: -24, y: 0 },
    { id: 'output', x: 24, y: 0 }
  ],
  Decoder: [
    { id: 'input1', x: -24, y: -8 },
    { id: 'input2', x: -24, y: 8 },
    { id: 'output1', x: 24, y: -8 },
    { id: 'output2', x: 24, y: 8 }
  ],
  Encoder: [
    { id: 'input1', x: -24, y: -8 },
    { id: 'input2', x: -24, y: 8 },
    { id: 'output1', x: 24, y: -8 },
    { id: 'output2', x: 24, y: 8 }
  ],
  Multiplexer: [
    { id: 'input1', x: -24, y: -8 },
    { id: 'input2', x: -24, y: 8 },
    { id: 'output', x: 24, y: 0 }
  ],
  Demultiplexer: [
    { id: 'input', x: -24, y: 0 },
    { id: 'output1', x: 24, y: -8 },
    { id: 'output2', x: 24, y: 8 }
  ],
  Adder: [
    { id: 'input1', x: -24, y: -8 },
    { id: 'input2', x: -24, y: 8 },
    { id: 'output', x: 24, y: 0 }
  ],
  Subtractor: [
    { id: 'input1', x: -24, y: -8 },
    { id: 'input2', x: -24, y: 8 },
    { id: 'output', x: 24, y: 0 }
  ],
  Latch: [
    { id: 'input1', x: -24, y: -8 },
    { id: 'input2', x: -24, y: 8 },
    { id: 'output1', x: 24, y: -8 },
    { id: 'output2', x: 24, y: 8 }
  ],
  Register: [
    { id: 'input1', x: -24, y: -8 },
    { id: 'input2', x: -24, y: 8 },
    { id: 'output1', x: 24, y: -8 },
    { id: 'output2', x: 24, y: 8 }
  ],
  Memory: [
    { id: 'input1', x: -24, y: -8 },
    { id: 'input2', x: -24, y: 8 },
    { id: 'output1', x: 24, y: -8 },
    { id: 'output2', x: 24, y: 8 }
  ],
  CPU: [
    { id: 'input1', x: -24, y: -8 },
    { id: 'input2', x: -24, y: 8 },
    { id: 'output1', x: 24, y: -8 },
    { id: 'output2', x: 24, y: 8 }
  ],
  Microcontroller: [
    { id: 'input1', x: -24, y: -8 },
    { id: 'input2', x: -24, y: 8 },
    { id: 'output1', x: 24, y: -8 },
    { id: 'output2', x: 24, y: 8 }
  ],
  DSP: [
    { id: 'input1', x: -24, y: -8 },
    { id: 'input2', x: -24, y: 8 },
    { id: 'output1', x: 24, y: -8 },
    { id: 'output2', x: 24, y: 8 }
  ],
  FPGA: [
    { id: 'input1', x: -24, y: -8 },
    { id: 'input2', x: -24, y: 8 },
    { id: 'output1', x: 24, y: -8 },
    { id: 'output2', x: 24, y: 8 }
  ],
  ADC: [
    { id: 'input', x: -24, y: 0 },
    { id: 'output', x: 24, y: 0 }
  ],
  DAC: [
    { id: 'input', x: -24, y: 0 },
    { id: 'output', x: 24, y: 0 }
  ],
  PLL: [
    { id: 'input', x: -24, y: 0 },
    { id: 'output', x: 24, y: 0 }
  ],
  VCO: [
    { id: 'input', x: -24, y: 0 },
    { id: 'output', x: 24, y: 0 }
  ],
  Mixer: [
    { id: 'input1', x: -24, y: -8 },
    { id: 'input2', x: -24, y: 8 },
    { id: 'output', x: 24, y: 0 }
  ],
  Oscillator: [
    { id: 'output', x: 24, y: 0 }
  ],
  Filter: [
    { id: 'input', x: -24, y: 0 },
    { id: 'output', x: 24, y: 0 }
  ],
  AmplifierRF: [
    { id: 'input', x: -24, y: 0 },
    { id: 'output', x: 24, y: 0 }
  ],
  AttenuatorRF: [
    { id: 'input', x: -24, y: 0 },
    { id: 'output', x: 24, y: 0 }
  ],
  FilterRF: [
    { id: 'input', x: -24, y: 0 },
    { id: 'output', x: 24, y: 0 }
  ],
  Coupler: [
    { id: 'input', x: -24, y: 0 },
    { id: 'output', x: 24, y: 0 }
  ],
  PowerDivider: [
    { id: 'input', x: -24, y: 0 },
    { id: 'output1', x: 24, y: -8 },
    { id: 'output2', x: 24, y: 8 }
  ],
  PhaseShifter: [
    { id: 'input', x: -24, y: 0 },
    { id: 'output', x: 24, y: 0 }
  ],
  SwitchRF: [
    { id: 'input', x: -24, y: 0 },
    { id: 'output', x: 24, y: 0 }
  ],
  Limiter: [
    { id: 'input', x: -24, y: 0 },
    { id: 'output', x: 24, y: 0 }
  ],
  Detector: [
    { id: 'input', x: -24, y: 0 },
    { id: 'output', x: 24, y: 0 }
  ],
  Modulator: [
    { id: 'input1', x: -24, y: -8 },
    { id: 'input2', x: -24, y: 8 },
    { id: 'output', x: 24, y: 0 }
  ],
  Demodulator: [
    { id: 'input', x: -24, y: 0 },
    { id: 'output1', x: 24, y: -8 },
    { id: 'output2', x: 24, y: 8 }
  ],
  Receiver: [
    { id: 'input', x: -24, y: 0 },
    { id: 'output', x: 24, y: 0 }
  ],
  Transmitter: [
    { id: 'input', x: -24, y: 0 },
    { id: 'output', x: 24, y: 0 }
  ],
  Transceiver: [
    { id: 'input', x: -24, y: 0 },
    { id: 'output', x: 24, y: 0 }
  ],
  Duplexer: [
    { id: 'input', x: -24, y: 0 },
    { id: 'output', x: 24, y: 0 }
  ],
  Diplexer: [
    { id: 'input', x: -24, y: 0 },
    { id: 'output1', x: 24, y: -8 },
    { id: 'output2', x: 24, y: 8 }
  ],
  Balun: [
    { id: 'input', x: -24, y: 0 },
    { id: 'output', x: 24, y: 0 }
  ],
  TransformerRF: [
    { id: 'input', x: -24, y: 0 },
    { id: 'output', x: 24, y: 0 }
  ],
  Resonator: [
    { id: 'input', x: -24, y: 0 },
    { id: 'output', x: 24, y: 0 }
  ],
  Cavity: [
    { id: 'input', x: -24, y: 0 },
    { id: 'output', x: 24, y: 0 }
  ],
  Waveguide: [
    { id: 'input', x: -24, y: 0 },
    { id: 'output', x: 24, y: 0 }
  ],
  Coaxial: [
    { id: 'input', x: -24, y: 0 },
    { id: 'output', x: 24, y: 0 }
  ],
  Stripline: [
    { id: 'input', x: -24, y: 0 },
    { id: 'output', x: 24, y: 0 }
  ],
  Microstrip: [
    { id: 'input', x: -24, y: 0 },
    { id: 'output', x: 24, y: 0 }
  ],
  Coplanar: [
    { id: 'input', x: -24, y: 0 },
    { id: 'output', x: 24, y: 0 }
  ],
  Slotline: [
    { id: 'input', x: -24, y: 0 },
    { id: 'output', x: 24, y: 0 }
  ]
}

// Calculate actual connection nodes for a component
export function getConnectionNodes(component: { id: string; type: ComponentType; x: number; y: number; rotation: number; scale?: number }): ConnectionNode[] {
  const points = COMPONENT_CONNECTION_POINTS[component.type]
  const scale = component.scale || 1
  
  return points.map(point => {
    // Apply scale
    let x = point.x * scale
    let y = point.y * scale
    
    // Apply rotation
    const radians = (component.rotation * Math.PI) / 180
    const cos = Math.cos(radians)
    const sin = Math.sin(radians)
    const rotatedX = x * cos - y * sin
    const rotatedY = x * sin + y * cos
    
    // Apply translation
    const finalX = component.x + rotatedX
    const finalY = component.y + rotatedY
    
    return {
      id: `${component.id}-${point.id}`,
      x: finalX,
      y: finalY,
      componentId: component.id,
      terminalId: point.id
    }
  })
}

// Find the closest connection node to a point
export function findClosestNode(nodes: ConnectionNode[], x: number, y: number, maxDistance = 20): ConnectionNode | null {
  let closest: ConnectionNode | null = null
  let minDistance = maxDistance
  
  for (const node of nodes) {
    const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2)
    if (distance < minDistance) {
      minDistance = distance
      closest = node
    }
  }
  
  return closest
}
