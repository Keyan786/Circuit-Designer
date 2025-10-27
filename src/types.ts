export type ToolId = 'select' | 'place' | 'wire' | 'text' | 'addNode';

export type ComponentType =
  | 'Resistor'
  | 'Capacitor'
  | 'Inductor'
  | 'Battery'
  | 'Ground'
  | 'OpAmp'
  | 'Diode'
  | 'LED'
  | 'Switch'
  | 'Node'
  // Transistors
  | 'TransistorNPN'
  | 'TransistorPNP'
  | 'MOSFETN'
  | 'MOSFETP'
  | 'JFETN'
  | 'JFETP'
  | 'IGBT'
  | 'DarlingtonTransistor'
  // Diodes
  | 'ZenerDiode'
  | 'SchottkyDiode'
  | 'VaractorDiode'
  | 'Photodiode'
  | 'TunnelDiode'
  | 'AvalancheDiode'
  // Power Devices
  | 'Thyristor'
  | 'Triac'
  | 'Diac'
  | 'PowerMOSFET'
  // Passive Components
  | 'Transformer'
  | 'Crystal'
  | 'Relay'
  | 'Fuse'
  | 'Potentiometer'
  | 'VariableCapacitor'
  | 'VariableInductor'
  | 'Thermistor'
  | 'Photoresistor'
  | 'Varistor'
  // Sources
  | 'VoltageSource'
  | 'CurrentSource'
  | 'ACSource'
  | 'DCSource'
  | 'VoltageControlledVoltageSource'
  | 'CurrentControlledCurrentSource'
  | 'VoltageControlledCurrentSource'
  | 'CurrentControlledVoltageSource'
  // Amplifiers
  | 'Amplifier'
  | 'DifferentialAmplifier'
  | 'InstrumentationAmplifier'
  | 'Comparator'
  | 'SchmittTrigger'
  // Logic Gates
  | 'LogicGateAND'
  | 'LogicGateOR'
  | 'LogicGateNOT'
  | 'LogicGateNAND'
  | 'LogicGateNOR'
  | 'LogicGateXOR'
  | 'LogicGateXNOR'
  | 'Buffer'
  | 'Inverter'
  // Digital Components
  | 'FlipFlop'
  | 'Counter'
  | 'Decoder'
  | 'Encoder'
  | 'Multiplexer'
  | 'Demultiplexer'
  | 'Adder'
  | 'Subtractor'
  | 'Latch'
  | 'Register'
  | 'Memory'
  | 'CPU'
  | 'Microcontroller'
  | 'DSP'
  | 'FPGA'
  | 'ADC'
  | 'DAC'
  // RF Components
  | 'PLL'
  | 'VCO'
  | 'Mixer'
  | 'Oscillator'
  | 'Filter'
  | 'Antenna'
  | 'AmplifierRF'
  | 'AttenuatorRF'
  | 'FilterRF'
  | 'Coupler'
  | 'PowerDivider'
  | 'PhaseShifter'
  | 'SwitchRF'
  | 'Limiter'
  | 'Detector'
  | 'Modulator'
  | 'Demodulator'
  | 'Receiver'
  | 'Transmitter'
  | 'Transceiver'
  | 'Duplexer'
  | 'Diplexer'
  | 'Balun'
  | 'TransformerRF'
  | 'Resonator'
  | 'Cavity'
  | 'Waveguide'
  | 'Coaxial'
  | 'Stripline'
  | 'Microstrip'
  | 'Coplanar'
  | 'Slotline'
  // Mechanical/Electromechanical
  | 'Speaker'
  | 'Microphone'
  | 'Motor'
  | 'Generator';

export interface PlacedComponent {
  id: string;
  type: ComponentType;
  x: number; // canvas coords in px
  y: number;
  rotation: number; // degrees 0-359
  scale?: number; // uniform scale, default 1
  color?: string; // CSS color for stroke/fill
}

export interface Point { 
  x: number; 
  y: number;
  componentId?: string | null; // if this point is connected to a component
  terminalId?: string | null; // which terminal on the component
}

export interface Wire {
  id: string;
  points: Point[]; // polyline points
  color?: string; // stroke color for this wire
  label?: string; // wire label (BL, BLB, WWL, etc.)
  signalType?: 'power' | 'ground' | 'data' | 'clock' | 'control' | 'analog' | 'digital' | 'custom'; // signal type for color coding
  bundleId?: string; // ID of wire bundle this wire belongs to
  thickness?: number; // wire thickness in pixels
  style?: 'solid' | 'dashed' | 'dotted'; // wire line style
}

export interface WireBundle {
  id: string;
  name: string;
  color: string;
  layer: number;
  wireIds: string[]; // IDs of wires in this bundle
  label?: string; // bundle label
}

export interface TextElement {
  id: string;
  x: number; // canvas coords in px
  y: number;
  text: string;
  fontSize?: number; // default 14
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  color?: string; // CSS color, default black
  fontFamily?: string; // default 'Arial, sans-serif'
  textAlign?: 'start' | 'middle' | 'end';
  rotation?: number; // degrees 0-359, default 0
}

export interface ConnectionNode {
  id: string;
  x: number;
  y: number;
  componentId: string | null;
  terminalId: string | null;
}

export type WireStyle = 'straight' | 'elbow' | 'polyline'


