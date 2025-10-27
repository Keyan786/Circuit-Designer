import type { PlacedComponent, Wire, Point, ComponentType } from '../types'
import { getConnectionNodes } from './connectionPoints'

// Helper to resolve a point that might be bound to a component terminal
function resolvePoint(p: Point, components: PlacedComponent[], connectionNodes: any[]): Point {
  if (p.componentId && p.terminalId) {
    const comp = components.find(c => c.id === p.componentId)
    if (comp) {
      const node = connectionNodes.find((n: any) => n.componentId === comp.id && n.terminalId === p.terminalId)
      if (node) return { x: node.x, y: node.y }
    }
  }
  return { x: p.x, y: p.y }
}

// Generate actual component symbols matching the canvas - IEEE 315-1975 compliant
function generateComponentSymbol(type: ComponentType): string {
  const common = 'fill="none" stroke="currentColor" stroke-width="1.5"'
  
  switch (type) {
    case 'Resistor':
      return `
        <line x1="-24" y1="0" x2="-18" y2="0" ${common}/>
        <path d="M -18 0 L -12 -8 L -6 8 L 0 -8 L 6 8 L 12 -8 L 18 0" ${common}/>
        <line x1="18" y1="0" x2="24" y2="0" ${common}/>
      `
    case 'Capacitor':
      return `
        <line x1="-24" y1="0" x2="-6" y2="0" ${common}/>
        <line x1="-6" y1="-10" x2="-6" y2="10" ${common}/>
        <line x1="6" y1="-10" x2="6" y2="10" ${common}/>
        <line x1="6" y1="0" x2="24" y2="0" ${common}/>
      `
    case 'Inductor':
      return `
        <line x1="-24" y1="0" x2="-15" y2="0" ${common}/>
        <path d="M -15 0 c 3 -6, 6 -6, 9 0 c 3 6, 6 6, 9 0 c 3 -6, 6 -6, 9 0" ${common}/>
        <line x1="12" y1="0" x2="24" y2="0" ${common}/>
      `
    case 'Battery':
      return `
        <line x1="-24" y1="0" x2="-12" y2="0" ${common}/>
        <line x1="-12" y1="-10" x2="-12" y2="10" ${common}/>
        <line x1="-6" y1="-14" x2="-6" y2="14" ${common}/>
        <line x1="0" y1="-10" x2="0" y2="10" ${common}/>
        <line x1="6" y1="-14" x2="6" y2="14" ${common}/>
        <line x1="12" y1="0" x2="24" y2="0" ${common}/>
      `
    case 'Ground':
      return `
        <line x1="0" y1="-12" x2="0" y2="0" ${common}/>
        <line x1="-10" y1="0" x2="10" y2="0" ${common}/>
        <line x1="-8" y1="5" x2="8" y2="5" ${common}/>
        <line x1="-6" y1="10" x2="6" y2="10" ${common}/>
        <line x1="-4" y1="15" x2="4" y2="15" ${common}/>
      `
    case 'OpAmp':
      return `
        <path d="M -18 -15 L 18 0 L -18 15 Z" ${common}/>
        <line x1="18" y1="0" x2="30" y2="0" ${common}/>
        <line x1="-30" y1="-7" x2="-6" y2="-7" ${common}/>
        <line x1="-30" y1="7" x2="-6" y2="7" ${common}/>
        <text x="-26" y="-3" text-anchor="middle" font-size="8" font-weight="400" fill="currentColor">+</text>
        <text x="-26" y="11" text-anchor="middle" font-size="8" font-weight="400" fill="currentColor">-</text>
      `
    case 'Diode':
      return `
        <line x1="-24" y1="0" x2="-10" y2="0" ${common}/>
        <path d="M -10 -12 L 10 0 L -10 12 Z" ${common}/>
        <line x1="10" y1="-12" x2="10" y2="12" ${common}/>
        <line x1="10" y1="0" x2="24" y2="0" ${common}/>
      `
    case 'LED':
      return `
        <line x1="-24" y1="0" x2="-8" y2="0" ${common}/>
        <path d="M -8 -10 L 8 0 L -8 10 Z" ${common}/>
        <line x1="8" y1="-10" x2="8" y2="10" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
        <path d="M 12 -4 L 16 -8 M 12 0 L 18 0 M 12 4 L 16 8" stroke-width="1" ${common}/>
      `
    case 'Switch':
      return `
        <line x1="-24" y1="0" x2="-6" y2="0" ${common}/>
        <line x1="6" y1="0" x2="24" y2="0" ${common}/>
        <line x1="-6" y1="0" x2="6" y2="-8" ${common}/>
      `
    case 'Node':
      return `
        <circle cx="0" cy="0" r="3" fill="currentColor"/>
      `
    case 'TransistorNPN':
      return `
        <line x1="-24" y1="-10" x2="-8" y2="-10" ${common}/>
        <line x1="-24" y1="10" x2="-8" y2="10" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
        <line x1="-8" y1="-10" x2="8" y2="0" ${common}/>
        <line x1="-8" y1="10" x2="8" y2="0" ${common}/>
        <line x1="-8" y1="-10" x2="-8" y2="10" ${common}/>
        <line x1="-8" y1="-10" x2="8" y2="0" stroke-width="2" ${common}/>
        <text x="-18" y="-6" text-anchor="middle" font-size="6" font-weight="400" fill="currentColor">B</text>
        <text x="-18" y="14" text-anchor="middle" font-size="6" font-weight="400" fill="currentColor">E</text>
        <text x="16" y="-2" text-anchor="middle" font-size="6" font-weight="400" fill="currentColor">C</text>
      `
    case 'TransistorPNP':
      return `
        <line x1="-24" y1="-10" x2="-8" y2="-10" ${common}/>
        <line x1="-24" y1="10" x2="-8" y2="10" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
        <line x1="-8" y1="-10" x2="8" y2="0" ${common}/>
        <line x1="-8" y1="10" x2="8" y2="0" ${common}/>
        <line x1="-8" y1="-10" x2="-8" y2="10" ${common}/>
        <line x1="-8" y1="-10" x2="8" y2="0" stroke-width="2" ${common}/>
        <circle cx="-6" cy="10" r="2" fill="currentColor"/>
        <text x="-18" y="-6" text-anchor="middle" font-size="6" font-weight="400" fill="currentColor">B</text>
        <text x="-18" y="14" text-anchor="middle" font-size="6" font-weight="400" fill="currentColor">E</text>
        <text x="16" y="-2" text-anchor="middle" font-size="6" font-weight="400" fill="currentColor">C</text>
      `
    case 'MOSFETN':
      return `
        <line x1="-24" y1="-10" x2="-12" y2="-10" ${common}/>
        <line x1="-24" y1="10" x2="-12" y2="10" ${common}/>
        <line x1="12" y1="-10" x2="24" y2="-10" ${common}/>
        <line x1="12" y1="10" x2="24" y2="10" ${common}/>
        <line x1="-12" y1="-10" x2="12" y2="-10" ${common}/>
        <line x1="-12" y1="10" x2="12" y2="10" ${common}/>
        <line x1="0" y1="-18" x2="0" y2="-10" ${common}/>
        <line x1="-12" y1="-10" x2="-12" y2="10" stroke-width="2" ${common}/>
        <line x1="12" y1="-10" x2="12" y2="10" stroke-width="2" ${common}/>
        <text x="-18" y="-6" text-anchor="middle" font-size="6" font-weight="400" fill="currentColor">S</text>
        <text x="-18" y="14" text-anchor="middle" font-size="6" font-weight="400" fill="currentColor">D</text>
        <text x="2" y="-22" text-anchor="middle" font-size="6" font-weight="400" fill="currentColor">G</text>
      `
    case 'MOSFETP':
      return `
        <line x1="-24" y1="-10" x2="-12" y2="-10" ${common}/>
        <line x1="-24" y1="10" x2="-12" y2="10" ${common}/>
        <line x1="12" y1="-10" x2="24" y2="-10" ${common}/>
        <line x1="12" y1="10" x2="24" y2="10" ${common}/>
        <line x1="-12" y1="-10" x2="12" y2="-10" ${common}/>
        <line x1="-12" y1="10" x2="12" y2="10" ${common}/>
        <line x1="0" y1="-18" x2="0" y2="-10" ${common}/>
        <line x1="-12" y1="-10" x2="-12" y2="10" stroke-width="2" ${common}/>
        <line x1="12" y1="-10" x2="12" y2="10" stroke-width="2" ${common}/>
        <circle cx="-6" cy="10" r="2" fill="currentColor"/>
        <text x="-18" y="-6" text-anchor="middle" font-size="6" font-weight="400" fill="currentColor">S</text>
        <text x="-18" y="14" text-anchor="middle" font-size="6" font-weight="400" fill="currentColor">D</text>
        <text x="2" y="-22" text-anchor="middle" font-size="6" font-weight="400" fill="currentColor">G</text>
      `
    case 'JFETN':
      return `
        <line x1="-24" y1="0" x2="-8" y2="0" ${common}/>
        <line x1="-8" y1="-12" x2="-8" y2="12" ${common}/>
        <line x1="-8" y1="-12" x2="8" y2="-8" ${common}/>
        <line x1="-8" y1="12" x2="8" y2="8" ${common}/>
        <line x1="8" y1="-8" x2="8" y2="8" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
        <line x1="-8" y1="-4" x2="-4" y2="-4" ${common}/>
        <line x1="-8" y1="4" x2="-4" y2="4" ${common}/>
        <line x1="0" y1="-16" x2="0" y2="-12" ${common}/>
      `
    case 'JFETP':
      return `
        <line x1="-24" y1="0" x2="-8" y2="0" ${common}/>
        <line x1="-8" y1="-12" x2="-8" y2="12" ${common}/>
        <line x1="-8" y1="-12" x2="8" y2="-8" ${common}/>
        <line x1="-8" y1="12" x2="8" y2="8" ${common}/>
        <line x1="8" y1="-8" x2="8" y2="8" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
        <line x1="-8" y1="-4" x2="-4" y2="-4" ${common}/>
        <line x1="-8" y1="4" x2="-4" y2="4" ${common}/>
        <line x1="0" y1="-16" x2="0" y2="-12" ${common}/>
        <circle cx="-6" cy="0" r="2" fill="currentColor"/>
      `
    case 'IGBT':
      return `
        <line x1="-24" y1="0" x2="-8" y2="0" ${common}/>
        <line x1="-8" y1="-12" x2="-8" y2="12" ${common}/>
        <line x1="-8" y1="-12" x2="8" y2="-8" ${common}/>
        <line x1="-8" y1="12" x2="8" y2="8" ${common}/>
        <line x1="8" y1="-8" x2="8" y2="8" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
        <line x1="-8" y1="-4" x2="-4" y2="-4" ${common}/>
        <line x1="-8" y1="4" x2="-4" y2="4" ${common}/>
        <line x1="0" y1="-16" x2="0" y2="-12" ${common}/>
        <line x1="-2" y1="-8" x2="2" y2="-8" ${common}/>
      `
    case 'DarlingtonTransistor':
      return `
        <line x1="-24" y1="0" x2="-16" y2="0" ${common}/>
        <line x1="-16" y1="-8" x2="-16" y2="8" ${common}/>
        <line x1="-16" y1="-8" x2="-8" y2="-6" ${common}/>
        <line x1="-16" y1="8" x2="-8" y2="6" ${common}/>
        <line x1="-8" y1="-6" x2="-8" y2="6" ${common}/>
        <line x1="-8" y1="-4" x2="0" y2="-4" ${common}/>
        <line x1="-8" y1="4" x2="0" y2="4" ${common}/>
        <line x1="0" y1="-8" x2="0" y2="8" ${common}/>
        <line x1="0" y1="-8" x2="8" y2="-6" ${common}/>
        <line x1="0" y1="8" x2="8" y2="6" ${common}/>
        <line x1="8" y1="-6" x2="8" y2="6" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
        <line x1="-16" y1="-2" x2="-12" y2="-2" ${common}/>
        <line x1="-16" y1="2" x2="-12" y2="2" ${common}/>
        <line x1="0" y1="-2" x2="4" y2="-2" ${common}/>
        <line x1="0" y1="2" x2="4" y2="2" ${common}/>
      `
    case 'ZenerDiode':
      return `
        <line x1="-24" y1="0" x2="-8" y2="0" ${common}/>
        <path d="M -8 -10 L 8 0 L -8 10 Z" ${common}/>
        <line x1="8" y1="-10" x2="8" y2="10" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
        <line x1="-4" y1="-6" x2="4" y2="-6" ${common}/>
        <line x1="-4" y1="6" x2="4" y2="6" ${common}/>
      `
    case 'SchottkyDiode':
      return `
        <line x1="-24" y1="0" x2="-8" y2="0" ${common}/>
        <path d="M -8 -10 L 8 0 L -8 10 Z" ${common}/>
        <line x1="8" y1="-10" x2="8" y2="10" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
        <line x1="-2" y1="-6" x2="2" y2="-6" ${common}/>
        <line x1="-2" y1="6" x2="2" y2="6" ${common}/>
      `
    case 'VaractorDiode':
      return `
        <line x1="-24" y1="0" x2="-8" y2="0" ${common}/>
        <path d="M -8 -10 L 8 0 L -8 10 Z" ${common}/>
        <line x1="8" y1="-10" x2="8" y2="10" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
        <line x1="-4" y1="-6" x2="4" y2="-6" ${common}/>
        <line x1="-4" y1="6" x2="4" y2="6" ${common}/>
        <line x1="0" y1="-8" x2="0" y2="-6" ${common}/>
      `
    case 'Photodiode':
      return `
        <line x1="-24" y1="0" x2="-8" y2="0" ${common}/>
        <path d="M -8 -10 L 8 0 L -8 10 Z" ${common}/>
        <line x1="8" y1="-10" x2="8" y2="10" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
        <path d="M 2 -12 l 6 -6 m -2 6 l 6 -6" ${common}/>
      `
    case 'TunnelDiode':
      return `
        <line x1="-24" y1="0" x2="-8" y2="0" ${common}/>
        <path d="M -8 -10 L 8 0 L -8 10 Z" ${common}/>
        <line x1="8" y1="-10" x2="8" y2="10" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
        <path d="M -4 -6 Q 0 -8 4 -6" ${common}/>
        <path d="M -4 6 Q 0 8 4 6" ${common}/>
      `
    case 'AvalancheDiode':
      return `
        <line x1="-24" y1="0" x2="-8" y2="0" ${common}/>
        <path d="M -8 -10 L 8 0 L -8 10 Z" ${common}/>
        <line x1="8" y1="-10" x2="8" y2="10" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
        <line x1="-4" y1="-6" x2="4" y2="-6" ${common}/>
        <line x1="-4" y1="6" x2="4" y2="6" ${common}/>
        <path d="M -2 -4 L 2 4" ${common}/>
      `
    case 'Thyristor':
      return `
        <line x1="-24" y1="0" x2="-8" y2="0" ${common}/>
        <path d="M -8 -10 L 8 0 L -8 10 Z" ${common}/>
        <line x1="8" y1="-10" x2="8" y2="10" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
        <line x1="-8" y1="-4" x2="-4" y2="-4" ${common}/>
        <line x1="-8" y1="4" x2="-4" y2="4" ${common}/>
        <line x1="0" y1="-16" x2="0" y2="-12" ${common}/>
      `
    case 'Triac':
      return `
        <line x1="-24" y1="0" x2="-8" y2="0" ${common}/>
        <path d="M -8 -10 L 8 0 L -8 10 Z" ${common}/>
        <line x1="8" y1="-10" x2="8" y2="10" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
        <line x1="-8" y1="-4" x2="-4" y2="-4" ${common}/>
        <line x1="-8" y1="4" x2="-4" y2="4" ${common}/>
        <line x1="0" y1="-16" x2="0" y2="-12" ${common}/>
        <line x1="-2" y1="-8" x2="2" y2="-8" ${common}/>
      `
    case 'Diac':
      return `
        <line x1="-24" y1="0" x2="-8" y2="0" ${common}/>
        <path d="M -8 -10 L 8 0 L -8 10 Z" ${common}/>
        <line x1="8" y1="-10" x2="8" y2="10" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
        <line x1="-4" y1="-6" x2="4" y2="-6" ${common}/>
        <line x1="-4" y1="6" x2="4" y2="6" ${common}/>
        <line x1="-2" y1="-4" x2="2" y2="4" ${common}/>
        <line x1="-2" y1="4" x2="2" y2="-4" ${common}/>
      `
    case 'PowerMOSFET':
      return `
        <line x1="-24" y1="0" x2="-12" y2="0" ${common}/>
        <line x1="-12" y1="-12" x2="-12" y2="12" ${common}/>
        <line x1="-12" y1="-12" x2="12" y2="-12" ${common}/>
        <line x1="-12" y1="12" x2="12" y2="12" ${common}/>
        <line x1="12" y1="-12" x2="12" y2="12" ${common}/>
        <line x1="12" y1="0" x2="24" y2="0" ${common}/>
        <line x1="-12" y1="-4" x2="-8" y2="-4" ${common}/>
        <line x1="-12" y1="4" x2="-8" y2="4" ${common}/>
        <line x1="0" y1="-16" x2="0" y2="-12" ${common}/>
        <line x1="-2" y1="-8" x2="2" y2="-8" ${common}/>
      `
    case 'Transformer':
      return `
        <line x1="-24" y1="-8" x2="-8" y2="-8" ${common}/>
        <line x1="-24" y1="8" x2="-8" y2="8" ${common}/>
        <circle cx="-4" cy="-8" r="4" ${common}/>
        <circle cx="-4" cy="8" r="4" ${common}/>
        <line x1="0" y1="-8" x2="16" y2="-8" ${common}/>
        <line x1="0" y1="8" x2="16" y2="8" ${common}/>
        <line x1="-4" y1="-12" x2="-4" y2="-4" ${common}/>
        <line x1="-4" y1="4" x2="-4" y2="12" ${common}/>
      `
    case 'Crystal':
      return `
        <rect x="-8" y="-6" width="16" height="12" rx="2" ${common}/>
        <line x1="-24" y1="0" x2="-8" y2="0" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
        <line x1="-4" y1="-2" x2="4" y2="-2" ${common}/>
        <line x1="-4" y1="2" x2="4" y2="2" ${common}/>
      `
    case 'Relay':
      return `
        <rect x="-8" y="-8" width="16" height="16" rx="2" ${common}/>
        <line x1="-24" y1="-4" x2="-8" y2="-4" ${common}/>
        <line x1="-24" y1="4" x2="-8" y2="4" ${common}/>
        <line x1="8" y1="-4" x2="24" y2="-4" ${common}/>
        <line x1="8" y1="4" x2="24" y2="4" ${common}/>
        <line x1="-4" y1="-8" x2="-4" y2="-4" ${common}/>
        <line x1="4" y1="-8" x2="4" y2="-4" ${common}/>
      `
    case 'Fuse':
      return `
        <line x1="-24" y1="0" x2="-8" y2="0" ${common}/>
        <line x1="-8" y1="-6" x2="8" y2="6" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
        <line x1="-2" y1="-3" x2="2" y2="3" ${common}/>
      `
    case 'Potentiometer':
      return `
        <line x1="-24" y1="0" x2="-12" y2="0" ${common}/>
        <rect x="-12" y="-8" width="24" height="16" rx="2" ${common}/>
        <line x1="12" y1="0" x2="24" y2="0" ${common}/>
        <line x1="0" y1="-8" x2="0" y2="8" ${common}/>
        <line x1="-4" y1="-4" x2="4" y2="4" ${common}/>
      `
    case 'VariableCapacitor':
      return `
        <line x1="-24" y1="0" x2="-6" y2="0" ${common}/>
        <line x1="-6" y1="-10" x2="-6" y2="10" ${common}/>
        <line x1="6" y1="-10" x2="6" y2="10" ${common}/>
        <line x1="6" y1="0" x2="24" y2="0" ${common}/>
        <line x1="-2" y1="-8" x2="2" y2="-8" ${common}/>
      `
    case 'VariableInductor':
      return `
        <line x1="-24" y1="0" x2="-12" y2="0" ${common}/>
        <path d="M -12 0 c 4 -10, 8 -10, 12 0 c 4 -10, 8 -10, 12 0" ${common}/>
        <line x1="12" y1="0" x2="24" y2="0" ${common}/>
        <line x1="-2" y1="-8" x2="2" y2="-8" ${common}/>
      `
    case 'Thermistor':
      return `
        <line x1="-24" y1="0" x2="-12" y2="0" ${common}/>
        <rect x="-12" y="-8" width="24" height="16" rx="2" ${common}/>
        <line x1="12" y1="0" x2="24" y2="0" ${common}/>
        <text x="0" y="2" text-anchor="middle" font-size="8" font-weight="500" fill="currentColor">θ</text>
      `
    case 'Photoresistor':
      return `
        <line x1="-24" y1="0" x2="-12" y2="0" ${common}/>
        <rect x="-12" y="-8" width="24" height="16" rx="2" ${common}/>
        <line x1="12" y1="0" x2="24" y2="0" ${common}/>
        <path d="M 2 -12 l 6 -6 m -2 6 l 6 -6" ${common}/>
      `
    case 'Varistor':
      return `
        <line x1="-24" y1="0" x2="-8" y2="0" ${common}/>
        <path d="M -8 -10 L 8 0 L -8 10 Z" ${common}/>
        <line x1="8" y1="-10" x2="8" y2="10" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
        <path d="M -4 -6 Q 0 -8 4 -6" ${common}/>
        <path d="M -4 6 Q 0 8 4 6" ${common}/>
        <line x1="-2" y1="-4" x2="2" y2="4" ${common}/>
      `
    case 'VoltageSource':
      return `
        <circle cx="0" cy="0" r="14" ${common}/>
        <line x1="-24" y1="0" x2="-14" y2="0" ${common}/>
        <line x1="14" y1="0" x2="24" y2="0" ${common}/>
        <text x="0" y="5" text-anchor="middle" font-size="12" font-weight="400" fill="currentColor">V</text>
      `
    case 'CurrentSource':
      return `
        <circle cx="0" cy="0" r="14" ${common}/>
        <line x1="-24" y1="0" x2="-14" y2="0" ${common}/>
        <line x1="14" y1="0" x2="24" y2="0" ${common}/>
        <text x="0" y="5" text-anchor="middle" font-size="12" font-weight="400" fill="currentColor">I</text>
      `
    case 'ACSource':
      return `
        <circle cx="0" cy="0" r="12" ${common}/>
        <line x1="-24" y1="0" x2="-12" y2="0" ${common}/>
        <line x1="12" y1="0" x2="24" y2="0" ${common}/>
        <path d="M -6 -4 Q 0 -8 6 -4 Q 0 0 6 4 Q 0 8 -6 4 Q 0 0 -6 -4" ${common}/>
      `
    case 'DCSource':
      return `
        <circle cx="0" cy="0" r="12" ${common}/>
        <line x1="-24" y1="0" x2="-12" y2="0" ${common}/>
        <line x1="12" y1="0" x2="24" y2="0" ${common}/>
        <line x1="-6" y1="-4" x2="6" y2="-4" ${common}/>
        <line x1="-6" y1="4" x2="6" y2="4" ${common}/>
      `
    case 'VoltageControlledVoltageSource':
      return `
        <circle cx="0" cy="0" r="12" ${common}/>
        <line x1="-24" y1="0" x2="-12" y2="0" ${common}/>
        <line x1="12" y1="0" x2="24" y2="0" ${common}/>
        <line x1="-24" y1="-16" x2="-12" y2="-16" ${common}/>
        <line x1="-24" y1="-20" x2="-12" y2="-20" ${common}/>
        <text x="0" y="4" text-anchor="middle" font-size="7" font-weight="500" fill="currentColor">VCVS</text>
      `
    case 'CurrentControlledCurrentSource':
      return `
        <circle cx="0" cy="0" r="12" ${common}/>
        <line x1="-24" y1="0" x2="-12" y2="0" ${common}/>
        <line x1="12" y1="0" x2="24" y2="0" ${common}/>
        <line x1="-24" y1="-16" x2="-12" y2="-16" ${common}/>
        <line x1="-24" y1="-20" x2="-12" y2="-20" ${common}/>
        <text x="0" y="4" text-anchor="middle" font-size="7" font-weight="500" fill="currentColor">CCCS</text>
      `
    case 'VoltageControlledCurrentSource':
      return `
        <circle cx="0" cy="0" r="12" ${common}/>
        <line x1="-24" y1="0" x2="-12" y2="0" ${common}/>
        <line x1="12" y1="0" x2="24" y2="0" ${common}/>
        <line x1="-24" y1="-16" x2="-12" y2="-16" ${common}/>
        <line x1="-24" y1="-20" x2="-12" y2="-20" ${common}/>
        <text x="0" y="4" text-anchor="middle" font-size="7" font-weight="500" fill="currentColor">VCCS</text>
      `
    case 'CurrentControlledVoltageSource':
      return `
        <circle cx="0" cy="0" r="12" ${common}/>
        <line x1="-24" y1="0" x2="-12" y2="0" ${common}/>
        <line x1="12" y1="0" x2="24" y2="0" ${common}/>
        <line x1="-24" y1="-16" x2="-12" y2="-16" ${common}/>
        <line x1="-24" y1="-20" x2="-12" y2="-20" ${common}/>
        <text x="0" y="4" text-anchor="middle" font-size="7" font-weight="500" fill="currentColor">CCVS</text>
      `
    case 'LogicGateAND':
      return `
        <line x1="-24" y1="-8" x2="-8" y2="-8" ${common}/>
        <line x1="-24" y1="8" x2="-8" y2="8" ${common}/>
        <path d="M -8 -12 Q 8 -12 8 0 Q 8 12 -8 12 Z" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
      `
    case 'LogicGateOR':
      return `
        <line x1="-24" y1="-8" x2="-4" y2="-8" ${common}/>
        <line x1="-24" y1="8" x2="-4" y2="8" ${common}/>
        <path d="M -4 -12 Q 8 -12 8 0 Q 8 12 -4 12 Q -8 8 -8 0 Q -8 -8 -4 -12" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
      `
    case 'LogicGateNOT':
      return `
        <line x1="-24" y1="0" x2="-8" y2="0" ${common}/>
        <path d="M -8 -8 L 8 0 L -8 8 Z" ${common}/>
        <circle cx="10" cy="0" r="2" fill="currentColor"/>
        <line x1="12" y1="0" x2="24" y2="0" ${common}/>
      `
    case 'LogicGateNAND':
      return `
        <line x1="-24" y1="-8" x2="-8" y2="-8" ${common}/>
        <line x1="-24" y1="8" x2="-8" y2="8" ${common}/>
        <path d="M -8 -12 Q 8 -12 8 0 Q 8 12 -8 12 Z" ${common}/>
        <circle cx="10" cy="0" r="2" fill="currentColor"/>
        <line x1="12" y1="0" x2="24" y2="0" ${common}/>
      `
    case 'LogicGateNOR':
      return `
        <line x1="-24" y1="-8" x2="-4" y2="-8" ${common}/>
        <line x1="-24" y1="8" x2="-4" y2="8" ${common}/>
        <path d="M -4 -12 Q 8 -12 8 0 Q 8 12 -4 12 Q -8 8 -8 0 Q -8 -8 -4 -12" ${common}/>
        <circle cx="10" cy="0" r="2" fill="currentColor"/>
        <line x1="12" y1="0" x2="24" y2="0" ${common}/>
      `
    case 'LogicGateXOR':
      return `
        <line x1="-24" y1="-8" x2="-4" y2="-8" ${common}/>
        <line x1="-24" y1="8" x2="-4" y2="8" ${common}/>
        <path d="M -4 -12 Q 8 -12 8 0 Q 8 12 -4 12 Q -8 8 -8 0 Q -8 -8 -4 -12" ${common}/>
        <path d="M -8 -12 Q -4 -12 -4 -8" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
      `
    case 'LogicGateXNOR':
      return `
        <line x1="-24" y1="-8" x2="-4" y2="-8" ${common}/>
        <line x1="-24" y1="8" x2="-4" y2="8" ${common}/>
        <path d="M -4 -12 Q 8 -12 8 0 Q 8 12 -4 12 Q -8 8 -8 0 Q -8 -8 -4 -12" ${common}/>
        <path d="M -8 -12 Q -4 -12 -4 -8" ${common}/>
        <circle cx="10" cy="0" r="2" fill="currentColor"/>
        <line x1="12" y1="0" x2="24" y2="0" ${common}/>
      `
    case 'Buffer':
      return `
        <line x1="-24" y1="0" x2="-8" y2="0" ${common}/>
        <path d="M -8 -8 L 8 0 L -8 8 Z" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
      `
    case 'Inverter':
      return `
        <line x1="-24" y1="0" x2="-8" y2="0" ${common}/>
        <path d="M -8 -8 L 8 0 L -8 8 Z" ${common}/>
        <circle cx="10" cy="0" r="2" fill="currentColor"/>
        <line x1="12" y1="0" x2="24" y2="0" ${common}/>
      `
    case 'Amplifier':
      return `
        <path d="M -16 -12 L 16 0 L -16 12 Z" ${common}/>
        <line x1="16" y1="0" x2="28" y2="0" ${common}/>
        <line x1="-26" y1="-6" x2="-6" y2="-6" ${common}/>
        <line x1="-18" y1="6" x2="-6" y2="6" ${common}/>
        <text x="0" y="-2" text-anchor="middle" font-size="8" font-weight="500" fill="currentColor">A</text>
      `
    case 'DifferentialAmplifier':
      return `
        <path d="M -16 -12 L 16 0 L -16 12 Z" ${common}/>
        <line x1="16" y1="0" x2="28" y2="0" ${common}/>
        <line x1="-26" y1="-6" x2="-6" y2="-6" ${common}/>
        <line x1="-18" y1="6" x2="-6" y2="6" ${common}/>
        <line x1="-18" y1="-6" x2="-14" y2="-6" ${common}/>
        <line x1="-18" y1="6" x2="-14" y2="6" ${common}/>
        <text x="0" y="-2" text-anchor="middle" font-size="7" font-weight="500" fill="currentColor">Diff</text>
      `
    case 'InstrumentationAmplifier':
      return `
        <path d="M -16 -12 L 16 0 L -16 12 Z" ${common}/>
        <line x1="16" y1="0" x2="28" y2="0" ${common}/>
        <line x1="-26" y1="-6" x2="-6" y2="-6" ${common}/>
        <line x1="-18" y1="6" x2="-6" y2="6" ${common}/>
        <line x1="-18" y1="-6" x2="-14" y2="-6" ${common}/>
        <line x1="-18" y1="6" x2="-14" y2="6" ${common}/>
        <text x="0" y="-2" text-anchor="middle" font-size="6" font-weight="500" fill="currentColor">IA</text>
      `
    case 'Comparator':
      return `
        <path d="M -16 -12 L 16 0 L -16 12 Z" ${common}/>
        <line x1="16" y1="0" x2="28" y2="0" ${common}/>
        <line x1="-26" y1="-6" x2="-6" y2="-6" ${common}/>
        <line x1="-18" y1="6" x2="-6" y2="6" ${common}/>
        <line x1="-18" y1="-6" x2="-14" y2="-6" ${common}/>
        <line x1="-18" y1="6" x2="-14" y2="6" ${common}/>
        <text x="0" y="-2" text-anchor="middle" font-size="6" font-weight="500" fill="currentColor">CMP</text>
      `
    case 'SchmittTrigger':
      return `
        <path d="M -16 -12 L 16 0 L -16 12 Z" ${common}/>
        <line x1="16" y1="0" x2="28" y2="0" ${common}/>
        <line x1="-26" y1="-6" x2="-6" y2="-6" ${common}/>
        <line x1="-18" y1="6" x2="-6" y2="6" ${common}/>
        <line x1="-18" y1="-6" x2="-14" y2="-6" ${common}/>
        <line x1="-18" y1="6" x2="-14" y2="6" ${common}/>
        <text x="0" y="-2" text-anchor="middle" font-size="6" font-weight="500" fill="currentColor">ST</text>
      `
    case 'Antenna':
      return `
        <line x1="0" y1="-20" x2="0" y2="0" ${common}/>
        <line x1="-8" y1="-12" x2="8" y2="-12" ${common}/>
        <line x1="-4" y1="-8" x2="4" y2="-8" ${common}/>
        <line x1="-2" y1="-4" x2="2" y2="-4" ${common}/>
      `
    case 'Speaker':
      return `
        <rect x="-8" y="-8" width="16" height="16" rx="2" ${common}/>
        <line x1="-24" y1="0" x2="-8" y2="0" ${common}/>
        <path d="M 8 -4 Q 12 -4 12 0 Q 12 4 8 4" ${common}/>
        <path d="M 12 -2 Q 16 -2 16 0 Q 16 2 12 2" ${common}/>
      `
    case 'Microphone':
      return `
        <rect x="-6" y="-8" width="12" height="16" rx="2" ${common}/>
        <line x1="-24" y1="0" x2="-6" y2="0" ${common}/>
        <line x1="6" y1="0" x2="24" y2="0" ${common}/>
        <path d="M -2 -8 Q 0 -12 2 -8" ${common}/>
      `
    case 'Motor':
      return `
        <circle cx="0" cy="0" r="12" ${common}/>
        <line x1="-24" y1="-8" x2="-12" y2="-8" ${common}/>
        <line x1="-24" y1="8" x2="-12" y2="8" ${common}/>
        <line x1="12" y1="-8" x2="24" y2="-8" ${common}/>
        <line x1="12" y1="8" x2="24" y2="8" ${common}/>
        <text x="0" y="4" text-anchor="middle" font-size="8" font-weight="500" fill="currentColor">M</text>
      `
    case 'Generator':
      return `
        <circle cx="0" cy="0" r="12" ${common}/>
        <line x1="-24" y1="-8" x2="-12" y2="-8" ${common}/>
        <line x1="-24" y1="8" x2="-12" y2="8" ${common}/>
        <line x1="12" y1="-8" x2="24" y2="-8" ${common}/>
        <line x1="12" y1="8" x2="24" y2="8" ${common}/>
        <text x="0" y="4" text-anchor="middle" font-size="8" font-weight="500" fill="currentColor">G</text>
      `
    // RF Components with proper symbols
    case 'PLL':
      return `
        <rect x="-8" y="-8" width="16" height="16" rx="2" ${common}/>
        <line x1="-24" y1="-4" x2="-8" y2="-4" ${common}/>
        <line x1="-24" y1="4" x2="-8" y2="4" ${common}/>
        <line x1="8" y1="-4" x2="24" y2="-4" ${common}/>
        <line x1="8" y1="4" x2="24" y2="4" ${common}/>
        <text x="0" y="2" text-anchor="middle" font-size="6" font-weight="500" fill="currentColor">PLL</text>
      `
    case 'VCO':
      return `
        <rect x="-8" y="-8" width="16" height="16" rx="2" ${common}/>
        <line x1="-24" y1="0" x2="-8" y2="0" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
        <path d="M -2 -4 Q 0 -6 2 -4 Q 0 -2 2 0 Q 0 2 2 4" ${common}/>
        <text x="0" y="8" text-anchor="middle" font-size="5" font-weight="500" fill="currentColor">VCO</text>
      `
    case 'Mixer':
      return `
        <circle cx="0" cy="0" r="10" ${common}/>
        <line x1="-24" y1="-6" x2="-10" y2="-6" ${common}/>
        <line x1="-24" y1="6" x2="-10" y2="6" ${common}/>
        <line x1="10" y1="0" x2="24" y2="0" ${common}/>
        <text x="0" y="-12" text-anchor="middle" font-size="6" font-weight="500" fill="currentColor">×</text>
      `
    case 'Oscillator':
      return `
        <rect x="-8" y="-8" width="16" height="16" rx="2" ${common}/>
        <line x1="-24" y1="0" x2="-8" y2="0" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
        <path d="M -2 -4 Q 0 -6 2 -4 Q 0 -2 2 0 Q 0 2 2 4" ${common}/>
        <text x="0" y="8" text-anchor="middle" font-size="5" font-weight="500" fill="currentColor">OSC</text>
      `
    case 'Filter':
      return `
        <rect x="-8" y="-8" width="16" height="16" rx="2" ${common}/>
        <line x1="-24" y1="0" x2="-8" y2="0" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
        <path d="M -4 -4 L 4 4 M 4 -4 L -4 4" ${common}/>
        <text x="0" y="8" text-anchor="middle" font-size="5" font-weight="500" fill="currentColor">F</text>
      `
    case 'AmplifierRF':
      return `
        <path d="M -16 -12 L 16 0 L -16 12 Z" ${common}/>
        <line x1="16" y1="0" x2="28" y2="0" ${common}/>
        <line x1="-26" y1="-6" x2="-6" y2="-6" ${common}/>
        <line x1="-18" y1="6" x2="-6" y2="6" ${common}/>
        <text x="0" y="-2" text-anchor="middle" font-size="6" font-weight="500" fill="currentColor">RF</text>
      `
    case 'AttenuatorRF':
      return `
        <rect x="-8" y="-8" width="16" height="16" rx="2" ${common}/>
        <line x1="-24" y1="0" x2="-8" y2="0" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
        <text x="0" y="2" text-anchor="middle" font-size="6" font-weight="500" fill="currentColor">ATT</text>
      `
    case 'FilterRF':
      return `
        <rect x="-8" y="-8" width="16" height="16" rx="2" ${common}/>
        <line x1="-24" y1="-6" x2="-8" y2="-6" ${common}/>
        <line x1="-24" y1="6" x2="-8" y2="6" ${common}/>
        <line x1="8" y1="-6" x2="24" y2="-6" ${common}/>
        <line x1="8" y1="6" x2="24" y2="6" ${common}/>
        <text x="0" y="2" text-anchor="middle" font-size="6" font-weight="500" fill="currentColor">RF</text>
      `
    case 'Coupler':
      return `
        <rect x="-8" y="-8" width="16" height="16" rx="2" ${common}/>
        <line x1="-24" y1="-6" x2="-8" y2="-6" ${common}/>
        <line x1="-24" y1="6" x2="-8" y2="6" ${common}/>
        <line x1="8" y1="-6" x2="24" y2="-6" ${common}/>
        <line x1="8" y1="6" x2="24" y2="6" ${common}/>
        <text x="0" y="2" text-anchor="middle" font-size="5" font-weight="500" fill="currentColor">C</text>
      `
    case 'PowerDivider':
      return `
        <line x1="-24" y1="0" x2="0" y2="0" ${common}/>
        <line x1="0" y1="-12" x2="0" y2="12" ${common}/>
        <line x1="0" y1="-6" x2="24" y2="-6" ${common}/>
        <line x1="0" y1="6" x2="24" y2="6" ${common}/>
        <text x="0" y="-16" text-anchor="middle" font-size="5" font-weight="500" fill="currentColor">PWR</text>
      `
    case 'PhaseShifter':
      return `
        <rect x="-8" y="-8" width="16" height="16" rx="2" ${common}/>
        <line x1="-24" y1="0" x2="-8" y2="0" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
        <text x="0" y="2" text-anchor="middle" font-size="5" font-weight="500" fill="currentColor">φ</text>
      `
    case 'SwitchRF':
      return `
        <line x1="-24" y1="-6" x2="-6" y2="-6" ${common}/>
        <line x1="-24" y1="6" x2="-6" y2="6" ${common}/>
        <line x1="6" y1="-6" x2="24" y2="-6" ${common}/>
        <line x1="6" y1="6" x2="24" y2="6" ${common}/>
        <line x1="-6" y1="-6" x2="6" y2="6" ${common}/>
        <text x="0" y="-12" text-anchor="middle" font-size="5" font-weight="500" fill="currentColor">SW</text>
      `
    case 'Limiter':
      return `
        <rect x="-8" y="-8" width="16" height="16" rx="2" ${common}/>
        <line x1="-24" y1="0" x2="-8" y2="0" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
        <text x="0" y="2" text-anchor="middle" font-size="6" font-weight="500" fill="currentColor">LIM</text>
      `
    case 'Detector':
      return `
        <rect x="-8" y="-8" width="16" height="16" rx="2" ${common}/>
        <line x1="-24" y1="0" x2="-8" y2="0" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
        <text x="0" y="2" text-anchor="middle" font-size="6" font-weight="500" fill="currentColor">DET</text>
      `
    case 'Modulator':
      return `
        <rect x="-8" y="-8" width="16" height="16" rx="2" ${common}/>
        <line x1="-24" y1="-4" x2="-8" y2="-4" ${common}/>
        <line x1="-24" y1="4" x2="-8" y2="4" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
        <text x="0" y="2" text-anchor="middle" font-size="5" font-weight="500" fill="currentColor">MOD</text>
      `
    case 'Demodulator':
      return `
        <rect x="-8" y="-8" width="16" height="16" rx="2" ${common}/>
        <line x1="-24" y1="0" x2="-8" y2="0" ${common}/>
        <line x1="8" y1="-4" x2="24" y2="-4" ${common}/>
        <line x1="8" y1="4" x2="24" y2="4" ${common}/>
        <text x="0" y="2" text-anchor="middle" font-size="5" font-weight="500" fill="currentColor">DEM</text>
      `
    case 'Receiver':
      return `
        <rect x="-8" y="-8" width="16" height="16" rx="2" ${common}/>
        <line x1="-24" y1="0" x2="-8" y2="0" ${common}/>
        <line x1="8" y1="-4" x2="24" y2="-4" ${common}/>
        <line x1="8" y1="4" x2="24" y2="4" ${common}/>
        <text x="0" y="2" text-anchor="middle" font-size="5" font-weight="500" fill="currentColor">RX</text>
      `
    case 'Transmitter':
      return `
        <rect x="-8" y="-8" width="16" height="16" rx="2" ${common}/>
        <line x1="-24" y1="-4" x2="-8" y2="-4" ${common}/>
        <line x1="-24" y1="4" x2="-8" y2="4" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
        <text x="0" y="2" text-anchor="middle" font-size="5" font-weight="500" fill="currentColor">TX</text>
      `
    case 'Transceiver':
      return `
        <rect x="-8" y="-8" width="16" height="16" rx="2" ${common}/>
        <line x1="-24" y1="-4" x2="-8" y2="-4" ${common}/>
        <line x1="-24" y1="4" x2="-8" y2="4" ${common}/>
        <line x1="8" y1="-4" x2="24" y2="-4" ${common}/>
        <line x1="8" y1="4" x2="24" y2="4" ${common}/>
        <text x="0" y="2" text-anchor="middle" font-size="5" font-weight="500" fill="currentColor">TRX</text>
      `
    case 'Duplexer':
      return `
        <rect x="-8" y="-8" width="16" height="16" rx="2" ${common}/>
        <line x1="-24" y1="-6" x2="-8" y2="-6" ${common}/>
        <line x1="-24" y1="6" x2="-8" y2="6" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
        <text x="0" y="2" text-anchor="middle" font-size="5" font-weight="500" fill="currentColor">DUP</text>
      `
    case 'Diplexer':
      return `
        <rect x="-8" y="-8" width="16" height="16" rx="2" ${common}/>
        <line x1="-24" y1="-6" x2="-8" y2="-6" ${common}/>
        <line x1="-24" y1="6" x2="-8" y2="6" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
        <text x="0" y="2" text-anchor="middle" font-size="5" font-weight="500" fill="currentColor">DIP</text>
      `
    case 'Balun':
      return `
        <rect x="-8" y="-8" width="16" height="16" rx="2" ${common}/>
        <line x1="-24" y1="-6" x2="-8" y2="-6" ${common}/>
        <line x1="-24" y1="6" x2="-8" y2="6" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
        <text x="0" y="2" text-anchor="middle" font-size="5" font-weight="500" fill="currentColor">BAL</text>
      `
    case 'TransformerRF':
      return `
        <line x1="-24" y1="-8" x2="-8" y2="-8" ${common}/>
        <line x1="-24" y1="8" x2="-8" y2="8" ${common}/>
        <circle cx="-4" cy="-8" r="4" ${common}/>
        <circle cx="-4" cy="8" r="4" ${common}/>
        <line x1="0" y1="-8" x2="16" y2="-8" ${common}/>
        <line x1="0" y1="8" x2="16" y2="8" ${common}/>
        <line x1="-4" y1="-12" x2="-4" y2="-4" ${common}/>
        <line x1="-4" y1="4" x2="-4" y2="12" ${common}/>
        <text x="0" y="-16" text-anchor="middle" font-size="5" font-weight="500" fill="currentColor">RF</text>
      `
    case 'Resonator':
      return `
        <rect x="-8" y="-8" width="16" height="16" rx="2" ${common}/>
        <line x1="-24" y1="0" x2="-8" y2="0" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
        <text x="0" y="2" text-anchor="middle" font-size="5" font-weight="500" fill="currentColor">RES</text>
      `
    case 'Cavity':
      return `
        <rect x="-8" y="-8" width="16" height="16" rx="2" ${common}/>
        <line x1="-24" y1="0" x2="-8" y2="0" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
        <text x="0" y="2" text-anchor="middle" font-size="5" font-weight="500" fill="currentColor">CAV</text>
      `
    case 'Waveguide':
      return `
        <rect x="-12" y="-4" width="24" height="8" ${common}/>
        <line x1="-24" y1="0" x2="-12" y2="0" ${common}/>
        <line x1="12" y1="0" x2="24" y2="0" ${common}/>
        <text x="0" y="-12" text-anchor="middle" font-size="5" font-weight="500" fill="currentColor">WG</text>
      `
    case 'Coaxial':
      return `
        <circle cx="0" cy="0" r="8" ${common}/>
        <circle cx="0" cy="0" r="4" ${common}/>
        <line x1="-24" y1="0" x2="-8" y2="0" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
        <text x="0" y="-12" text-anchor="middle" font-size="5" font-weight="500" fill="currentColor">COAX</text>
      `
    case 'Stripline':
      return `
        <rect x="-12" y="-2" width="24" height="4" ${common}/>
        <line x1="-24" y1="0" x2="-12" y2="0" ${common}/>
        <line x1="12" y1="0" x2="24" y2="0" ${common}/>
        <text x="0" y="-12" text-anchor="middle" font-size="5" font-weight="500" fill="currentColor">SL</text>
      `
    case 'Microstrip':
      return `
        <rect x="-12" y="-3" width="24" height="6" ${common}/>
        <line x1="-24" y1="0" x2="-12" y2="0" ${common}/>
        <line x1="12" y1="0" x2="24" y2="0" ${common}/>
        <text x="0" y="-12" text-anchor="middle" font-size="5" font-weight="500" fill="currentColor">MS</text>
      `
    case 'Coplanar':
      return `
        <rect x="-12" y="-3" width="24" height="6" ${common}/>
        <line x1="-24" y1="-6" x2="-12" y2="-6" ${common}/>
        <line x1="-24" y1="6" x2="-12" y2="6" ${common}/>
        <line x1="12" y1="0" x2="24" y2="0" ${common}/>
        <text x="0" y="-12" text-anchor="middle" font-size="5" font-weight="500" fill="currentColor">CPW</text>
      `
    case 'Slotline':
      return `
        <rect x="-12" y="-6" width="24" height="12" ${common}/>
        <rect x="-12" y="-2" width="24" height="4" fill="white"/>
        <line x1="-24" y1="0" x2="-12" y2="0" ${common}/>
        <line x1="12" y1="0" x2="24" y2="0" ${common}/>
        <text x="0" y="-12" text-anchor="middle" font-size="5" font-weight="500" fill="currentColor">SL</text>
      `
    // Digital/Logic components with proper symbols
    case 'FlipFlop':
      return `
        <rect x="-8" y="-8" width="16" height="16" rx="2" ${common}/>
        <line x1="-24" y1="-4" x2="-8" y2="-4" ${common}/>
        <line x1="-24" y1="4" x2="-8" y2="4" ${common}/>
        <line x1="8" y1="-4" x2="24" y2="-4" ${common}/>
        <line x1="8" y1="4" x2="24" y2="4" ${common}/>
        <text x="0" y="2" text-anchor="middle" font-size="5" font-weight="500" fill="currentColor">FF</text>
      `
    case 'Counter':
      return `
        <rect x="-8" y="-8" width="16" height="16" rx="2" ${common}/>
        <line x1="-24" y1="0" x2="-8" y2="0" ${common}/>
        <line x1="8" y1="-4" x2="24" y2="-4" ${common}/>
        <line x1="8" y1="4" x2="24" y2="4" ${common}/>
        <text x="0" y="2" text-anchor="middle" font-size="5" font-weight="500" fill="currentColor">CNT</text>
      `
    case 'Decoder':
      return `
        <rect x="-8" y="-8" width="16" height="16" rx="2" ${common}/>
        <line x1="-24" y1="-4" x2="-8" y2="-4" ${common}/>
        <line x1="-24" y1="4" x2="-8" y2="4" ${common}/>
        <line x1="8" y1="-6" x2="24" y2="-6" ${common}/>
        <line x1="8" y1="-2" x2="24" y2="-2" ${common}/>
        <line x1="8" y1="2" x2="24" y2="2" ${common}/>
        <line x1="8" y1="6" x2="24" y2="6" ${common}/>
        <text x="0" y="2" text-anchor="middle" font-size="5" font-weight="500" fill="currentColor">DEC</text>
      `
    case 'Encoder':
      return `
        <rect x="-8" y="-8" width="16" height="16" rx="2" ${common}/>
        <line x1="-24" y1="-6" x2="-8" y2="-6" ${common}/>
        <line x1="-24" y1="-2" x2="-8" y2="-2" ${common}/>
        <line x1="-24" y1="2" x2="-8" y2="2" ${common}/>
        <line x1="-24" y1="6" x2="-8" y2="6" ${common}/>
        <line x1="8" y1="-4" x2="24" y2="-4" ${common}/>
        <line x1="8" y1="4" x2="24" y2="4" ${common}/>
        <text x="0" y="2" text-anchor="middle" font-size="5" font-weight="500" fill="currentColor">ENC</text>
      `
    case 'Multiplexer':
      return `
        <rect x="-8" y="-8" width="16" height="16" rx="2" ${common}/>
        <line x1="-24" y1="-6" x2="-8" y2="-6" ${common}/>
        <line x1="-24" y1="-2" x2="-8" y2="-2" ${common}/>
        <line x1="-24" y1="2" x2="-8" y2="2" ${common}/>
        <line x1="-24" y1="6" x2="-8" y2="6" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
        <text x="0" y="2" text-anchor="middle" font-size="5" font-weight="500" fill="currentColor">MUX</text>
      `
    case 'Demultiplexer':
      return `
        <rect x="-8" y="-8" width="16" height="16" rx="2" ${common}/>
        <line x1="-24" y1="0" x2="-8" y2="0" ${common}/>
        <line x1="8" y1="-6" x2="24" y2="-6" ${common}/>
        <line x1="8" y1="-2" x2="24" y2="-2" ${common}/>
        <line x1="8" y1="2" x2="24" y2="2" ${common}/>
        <line x1="8" y1="6" x2="24" y2="6" ${common}/>
        <text x="0" y="2" text-anchor="middle" font-size="5" font-weight="500" fill="currentColor">DEMUX</text>
      `
    case 'Adder':
      return `
        <rect x="-8" y="-8" width="16" height="16" rx="2" ${common}/>
        <line x1="-24" y1="-4" x2="-8" y2="-4" ${common}/>
        <line x1="-24" y1="4" x2="-8" y2="4" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
        <text x="0" y="2" text-anchor="middle" font-size="8" font-weight="bold" fill="currentColor">+</text>
      `
    case 'Subtractor':
      return `
        <rect x="-8" y="-8" width="16" height="16" rx="2" ${common}/>
        <line x1="-24" y1="-4" x2="-8" y2="-4" ${common}/>
        <line x1="-24" y1="4" x2="-8" y2="4" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
        <text x="0" y="2" text-anchor="middle" font-size="8" font-weight="bold" fill="currentColor">-</text>
      `
    case 'Latch':
      return `
        <rect x="-8" y="-8" width="16" height="16" rx="2" ${common}/>
        <line x1="-24" y1="-4" x2="-8" y2="-4" ${common}/>
        <line x1="-24" y1="4" x2="-8" y2="4" ${common}/>
        <line x1="8" y1="-4" x2="24" y2="-4" ${common}/>
        <line x1="8" y1="4" x2="24" y2="4" ${common}/>
        <text x="0" y="2" text-anchor="middle" font-size="5" font-weight="500" fill="currentColor">L</text>
      `
    case 'Register':
      return `
        <rect x="-8" y="-8" width="16" height="16" rx="2" ${common}/>
        <line x1="-24" y1="-4" x2="-8" y2="-4" ${common}/>
        <line x1="-24" y1="4" x2="-8" y2="4" ${common}/>
        <line x1="8" y1="-4" x2="24" y2="-4" ${common}/>
        <line x1="8" y1="4" x2="24" y2="4" ${common}/>
        <text x="0" y="2" text-anchor="middle" font-size="5" font-weight="500" fill="currentColor">REG</text>
      `
    case 'Memory':
      return `
        <rect x="-8" y="-8" width="16" height="16" rx="2" ${common}/>
        <line x1="-24" y1="-6" x2="-8" y2="-6" ${common}/>
        <line x1="-24" y1="-2" x2="-8" y2="-2" ${common}/>
        <line x1="-24" y1="2" x2="-8" y2="2" ${common}/>
        <line x1="-24" y1="6" x2="-8" y2="6" ${common}/>
        <line x1="8" y1="-4" x2="24" y2="-4" ${common}/>
        <line x1="8" y1="4" x2="24" y2="4" ${common}/>
        <text x="0" y="2" text-anchor="middle" font-size="5" font-weight="500" fill="currentColor">MEM</text>
      `
    case 'CPU':
      return `
        <rect x="-8" y="-8" width="16" height="16" rx="2" ${common}/>
        <line x1="-24" y1="-6" x2="-8" y2="-6" ${common}/>
        <line x1="-24" y1="-2" x2="-8" y2="-2" ${common}/>
        <line x1="-24" y1="2" x2="-8" y2="2" ${common}/>
        <line x1="-24" y1="6" x2="-8" y2="6" ${common}/>
        <line x1="8" y1="-6" x2="24" y2="-6" ${common}/>
        <line x1="8" y1="-2" x2="24" y2="-2" ${common}/>
        <line x1="8" y1="2" x2="24" y2="2" ${common}/>
        <line x1="8" y1="6" x2="24" y2="6" ${common}/>
        <text x="0" y="2" text-anchor="middle" font-size="5" font-weight="500" fill="currentColor">CPU</text>
      `
    case 'Microcontroller':
      return `
        <rect x="-8" y="-8" width="16" height="16" rx="2" ${common}/>
        <line x1="-24" y1="-6" x2="-8" y2="-6" ${common}/>
        <line x1="-24" y1="-2" x2="-8" y2="-2" ${common}/>
        <line x1="-24" y1="2" x2="-8" y2="2" ${common}/>
        <line x1="-24" y1="6" x2="-8" y2="6" ${common}/>
        <line x1="8" y1="-6" x2="24" y2="-6" ${common}/>
        <line x1="8" y1="-2" x2="24" y2="-2" ${common}/>
        <line x1="8" y1="2" x2="24" y2="2" ${common}/>
        <line x1="8" y1="6" x2="24" y2="6" ${common}/>
        <text x="0" y="2" text-anchor="middle" font-size="4" font-weight="500" fill="currentColor">μC</text>
      `
    case 'DSP':
      return `
        <rect x="-8" y="-8" width="16" height="16" rx="2" ${common}/>
        <line x1="-24" y1="-4" x2="-8" y2="-4" ${common}/>
        <line x1="-24" y1="4" x2="-8" y2="4" ${common}/>
        <line x1="8" y1="-4" x2="24" y2="-4" ${common}/>
        <line x1="8" y1="4" x2="24" y2="4" ${common}/>
        <text x="0" y="2" text-anchor="middle" font-size="5" font-weight="500" fill="currentColor">DSP</text>
      `
    case 'FPGA':
      return `
        <rect x="-8" y="-8" width="16" height="16" rx="2" ${common}/>
        <line x1="-24" y1="-6" x2="-8" y2="-6" ${common}/>
        <line x1="-24" y1="-2" x2="-8" y2="-2" ${common}/>
        <line x1="-24" y1="2" x2="-8" y2="2" ${common}/>
        <line x1="-24" y1="6" x2="-8" y2="6" ${common}/>
        <line x1="8" y1="-6" x2="24" y2="-6" ${common}/>
        <line x1="8" y1="-2" x2="24" y2="-2" ${common}/>
        <line x1="8" y1="2" x2="24" y2="2" ${common}/>
        <line x1="8" y1="6" x2="24" y2="6" ${common}/>
        <text x="0" y="2" text-anchor="middle" font-size="5" font-weight="500" fill="currentColor">FPGA</text>
      `
    case 'ADC':
      return `
        <rect x="-8" y="-8" width="16" height="16" rx="2" ${common}/>
        <line x1="-24" y1="0" x2="-8" y2="0" ${common}/>
        <line x1="8" y1="-4" x2="24" y2="-4" ${common}/>
        <line x1="8" y1="-2" x2="24" y2="-2" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
        <line x1="8" y1="2" x2="24" y2="2" ${common}/>
        <line x1="8" y1="4" x2="24" y2="4" ${common}/>
        <text x="0" y="2" text-anchor="middle" font-size="5" font-weight="500" fill="currentColor">ADC</text>
      `
    case 'DAC':
      return `
        <rect x="-8" y="-8" width="16" height="16" rx="2" ${common}/>
        <line x1="-24" y1="-4" x2="-8" y2="-4" ${common}/>
        <line x1="-24" y1="-2" x2="-8" y2="-2" ${common}/>
        <line x1="-24" y1="0" x2="-8" y2="0" ${common}/>
        <line x1="-24" y1="2" x2="-8" y2="2" ${common}/>
        <line x1="-24" y1="4" x2="-8" y2="4" ${common}/>
        <line x1="8" y1="0" x2="24" y2="0" ${common}/>
        <text x="0" y="2" text-anchor="middle" font-size="5" font-weight="500" fill="currentColor">DAC</text>
      `
    default:
      // For placeholder components that use Node symbol, return the node symbol
      return `
        <circle cx="0" cy="0" r="3" fill="currentColor"/>
      `
  }
}

// Generate SVG content for the circuit
export function generateSVG(components: PlacedComponent[], wires: Wire[], options: {
  width?: number
  height?: number
  showGrid?: boolean
  backgroundColor?: string
  showNodes?: boolean
  customBounds?: { minX: number; minY: number; maxX: number; maxY: number }
} = {}): string {
  const {
    width = 800,
    height = 600,
    showGrid = false,
    backgroundColor = 'white',
    showNodes = true,
    customBounds
  } = options

  // Get connection nodes for wire resolution
  const connectionNodes: any[] = []
  components.forEach(component => {
    const componentNodes = getConnectionNodes(component)
    connectionNodes.push(...componentNodes)
  })

  let minX: number, minY: number, maxX: number, maxY: number

  if (customBounds) {
    // Use provided bounds (for PNG export)
    minX = customBounds.minX
    minY = customBounds.minY
    maxX = customBounds.maxX
    maxY = customBounds.maxY
  } else {
    // Calculate bounds to center the content (for SVG export)
    minX = Infinity
    minY = Infinity
    maxX = -Infinity
    maxY = -Infinity

    // Calculate bounds from components
    components.forEach(comp => {
      const scale = comp.scale ?? 1
      minX = Math.min(minX, comp.x - 30 * scale)
      minY = Math.min(minY, comp.y - 20 * scale)
      maxX = Math.max(maxX, comp.x + 30 * scale)
      maxY = Math.max(maxY, comp.y + 20 * scale)
    })

    // Calculate bounds from wires
    wires.forEach(wire => {
      wire.points.forEach(point => {
        const resolved = resolvePoint(point, components, connectionNodes)
        minX = Math.min(minX, resolved.x)
        minY = Math.min(minY, resolved.y)
        maxX = Math.max(maxX, resolved.x)
        maxY = Math.max(maxY, resolved.y)
      })
    })

    // Add padding
    const padding = 40
    minX -= padding
    minY -= padding
    maxX += padding
    maxY += padding
  }

  // Calculate content dimensions
  const contentWidth = maxX - minX
  const contentHeight = maxY - minY

  // Center the content in the output dimensions
  const offsetX = (width - contentWidth) / 2 - minX
  const offsetY = (height - contentHeight) / 2 - minY

  // Generate grid if requested
  const gridPattern = showGrid ? `
    <defs>
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)"/>
  ` : ''

  // Generate wires
  const wireElements = wires.map(wire => {
    const points = wire.points.map(p => resolvePoint(p, components, connectionNodes))
    const pathData = points.map((p, i) => 
      `${i === 0 ? 'M' : 'L'} ${p.x + offsetX} ${p.y + offsetY}`
    ).join(' ')
    
    return `<path d="${pathData}" fill="none" stroke="${wire.color || '#334155'}" stroke-width="2"/>`
  }).join('\n    ')

  // Generate components
  const componentElements = components.map(comp => {
    const transform = `translate(${comp.x + offsetX},${comp.y + offsetY}) rotate(${comp.rotation}) scale(${comp.scale ?? 1})`
    const color = comp.color || '#334155'
    const symbol = generateComponentSymbol(comp.type)
    
    return `<g transform="${transform}" style="color: ${color}">
      ${symbol}
    </g>`
  }).join('\n    ')

  // Generate connection nodes (same as canvas)
  const nodeElements = showNodes ? connectionNodes.map(node => {
    return `<g transform="translate(${node.x + offsetX},${node.y + offsetY})">
      <circle r="6" fill="none" stroke="#94a3b8" stroke-width="1.5" vector-effect="non-scaling-stroke"/>
      <circle r="2" fill="#64748b"/>
    </g>`
  }).join('\n    ') : ''

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${backgroundColor}"/>
  ${gridPattern}
  ${wireElements}
  ${componentElements}
  ${nodeElements}
</svg>`
}

// Export as SVG file
export function exportAsSVG(components: PlacedComponent[], wires: Wire[], filename = 'circuit.svg', options: {
  showGrid?: boolean
  showNodes?: boolean
} = {}): void {
  const svgContent = generateSVG(components, wires, { 
    showGrid: options.showGrid || false,
    showNodes: options.showNodes || true
  })
  const blob = new Blob([svgContent], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Export as PNG file
export function exportAsPNG(components: PlacedComponent[], wires: Wire[], filename = 'circuit.png', options: {
  scale?: number
  showGrid?: boolean
  showNodes?: boolean
  padding?: number
} = {}): void {
  const { scale = 4, showGrid = false, showNodes = true, padding = 20 } = options
  
  // Calculate exact circuit bounds - pixel by pixel
  let minX: number = Infinity, minY: number = Infinity, maxX: number = -Infinity, maxY: number = -Infinity
  
  // Get connection nodes for wire resolution
  const connectionNodes: any[] = []
  components.forEach(component => {
    const componentNodes = getConnectionNodes(component)
    connectionNodes.push(...componentNodes)
  })

  // Calculate bounds from components (exact pixel positions)
  components.forEach(comp => {
    const compScale = comp.scale ?? 1
    minX = Math.min(minX, comp.x - 30 * compScale)
    minY = Math.min(minY, comp.y - 20 * compScale)
    maxX = Math.max(maxX, comp.x + 30 * compScale)
    maxY = Math.max(maxY, comp.y + 20 * compScale)
  })

  // Calculate bounds from wires (exact pixel positions)
  wires.forEach(wire => {
    wire.points.forEach(point => {
      const resolved = resolvePoint(point, components, connectionNodes)
      minX = Math.min(minX, resolved.x)
      minY = Math.min(minY, resolved.y)
      maxX = Math.max(maxX, resolved.x)
      maxY = Math.max(maxY, resolved.y)
    })
  })

  // Add minimal padding
  minX -= padding
  minY -= padding
  maxX += padding
  maxY += padding

  // Calculate exact content dimensions
  const contentWidth = maxX - minX
  const contentHeight = maxY - minY

  // Use reasonable base size and apply scale for quality
  const baseWidth = Math.max(400, contentWidth)
  const baseHeight = Math.max(300, contentHeight)
  
  // Apply scale for better quality - keep high resolution
  const outputWidth = baseWidth * scale
  const outputHeight = baseHeight * scale
  
  const svgContent = generateSVG(components, wires, { 
    width: outputWidth, 
    height: outputHeight,
    showGrid,
    showNodes,
    customBounds: { minX, minY, maxX, maxY }
  })
  
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  canvas.width = outputWidth
  canvas.height = outputHeight
  
  const img = new Image()
  const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(svgBlob)
  
  img.onload = () => {
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0)
    
    canvas.toBlob((blob) => {
      if (!blob) return
      
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)
    }, 'image/png', 1.0)
    
    URL.revokeObjectURL(url)
  }
  
  img.src = url
}

// Show export dialog
export function showExportDialog(components: PlacedComponent[], wires: Wire[]): void {
  const dialog = document.createElement('div')
  dialog.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  `
  
  const modal = document.createElement('div')
  modal.style.cssText = `
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    max-width: 450px;
    width: 90%;
  `
  
  modal.innerHTML = `
    <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #1f2937;">Export Circuit</h3>
    <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 14px;">Choose export format and options</p>
    
    <div style="margin-bottom: 20px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
        <input type="checkbox" id="show-nodes" checked style="cursor: pointer;">
        <label for="show-nodes" style="font-size: 14px; color: #374151; cursor: pointer;">Show connection nodes</label>
      </div>
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
        <input type="checkbox" id="show-grid" style="cursor: pointer;">
        <label for="show-grid" style="font-size: 14px; color: #374151; cursor: pointer;">Show grid</label>
      </div>
      <div style="margin-bottom: 12px;">
        <label for="png-quality" style="display: block; font-size: 14px; color: #374151; margin-bottom: 4px;">PNG Resolution:</label>
        <select id="png-quality" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; cursor: pointer;">
          <option value="2">Standard (2x)</option>
          <option value="4" selected>High Quality (4x)</option>
          <option value="6">Ultra High (6x)</option>
          <option value="8">Maximum (8x)</option>
        </select>
      </div>
    </div>
    
    <div style="display: flex; gap: 12px; margin-bottom: 20px;">
      <button id="export-svg" style="
        flex: 1;
        padding: 12px 16px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        background: white;
        color: #374151;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      ">Export SVG</button>
      <button id="export-png" style="
        flex: 1;
        padding: 12px 16px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        background: white;
        color: #374151;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      ">Export PNG</button>
    </div>
    
    <div style="display: flex; gap: 8px;">
      <button id="cancel" style="
        flex: 1;
        padding: 10px 16px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        background: white;
        color: #6b7280;
        font-size: 14px;
        cursor: pointer;
      ">Cancel</button>
    </div>
  `
  
  dialog.appendChild(modal)
  document.body.appendChild(dialog)
  
  // Add hover effects
  const buttons = modal.querySelectorAll('button')
  buttons.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      if (btn.id !== 'cancel') {
        btn.style.background = '#f3f4f6'
        btn.style.borderColor = '#9ca3af'
      }
    })
    btn.addEventListener('mouseleave', () => {
      if (btn.id !== 'cancel') {
        btn.style.background = 'white'
        btn.style.borderColor = '#d1d5db'
      }
    })
  })
  
  // Event handlers
  modal.querySelector('#export-svg')?.addEventListener('click', () => {
    const showNodes = (modal.querySelector('#show-nodes') as HTMLInputElement)?.checked || false
    const showGrid = (modal.querySelector('#show-grid') as HTMLInputElement)?.checked || false
    exportAsSVG(components, wires, 'circuit.svg', { showNodes, showGrid })
    document.body.removeChild(dialog)
  })
  
  modal.querySelector('#export-png')?.addEventListener('click', () => {
    const showNodes = (modal.querySelector('#show-nodes') as HTMLInputElement)?.checked || false
    const showGrid = (modal.querySelector('#show-grid') as HTMLInputElement)?.checked || false
    const quality = parseInt((modal.querySelector('#png-quality') as HTMLSelectElement)?.value || '4')
    exportAsPNG(components, wires, 'circuit.png', { showNodes, showGrid, scale: quality })
    document.body.removeChild(dialog)
  })
  
  modal.querySelector('#cancel')?.addEventListener('click', () => {
    document.body.removeChild(dialog)
  })
  
  // Close on backdrop click
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      document.body.removeChild(dialog)
    }
  })
}
