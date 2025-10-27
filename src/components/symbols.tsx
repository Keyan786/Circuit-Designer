import React from 'react'
import type { ComponentType } from '../types'

const common = 'fill-none stroke-current stroke-[1.5]'

function Resistor() {
  // IEEE 315-1975 standard resistor - zigzag pattern
  return (
    <g className={common}>
      <line x1={-24} y1={0} x2={-18} y2={0} />
      <path d="M -18 0 L -12 -8 L -6 8 L 0 -8 L 6 8 L 12 -8 L 18 0" />
      <line x1={18} y1={0} x2={24} y2={0} />
    </g>
  )
}

function Capacitor() {
  // IEEE 315-1975 standard capacitor - two parallel plates
  return (
    <g className={common}>
      <line x1={-24} y1={0} x2={-6} y2={0} />
      <line x1={-6} y1={-10} x2={-6} y2={10} />
      <line x1={6} y1={-10} x2={6} y2={10} />
      <line x1={6} y1={0} x2={24} y2={0} />
    </g>
  )
}

function Inductor() {
  // IEEE 315-1975 standard inductor - series of semicircles
  return (
    <g className={common}>
      <line x1={-24} y1={0} x2={-15} y2={0} />
      <path d="M -15 0 c 3 -6, 6 -6, 9 0 c 3 6, 6 6, 9 0 c 3 -6, 6 -6, 9 0" />
      <line x1={12} y1={0} x2={24} y2={0} />
    </g>
  )
}

function Battery() {
  // IEEE 315-1975 standard battery - alternating long and short lines
  return (
    <g className={common}>
      <line x1={-24} y1={0} x2={-12} y2={0} />
      <line x1={-12} y1={-10} x2={-12} y2={10} />
      <line x1={-6} y1={-14} x2={-6} y2={14} />
      <line x1={0} y1={-10} x2={0} y2={10} />
      <line x1={6} y1={-14} x2={6} y2={14} />
      <line x1={12} y1={0} x2={24} y2={0} />
    </g>
  )
}

function Ground() {
  // IEEE 315-1975 standard ground - vertical line with horizontal bars
  return (
    <g className={common}>
      <line x1={0} y1={-12} x2={0} y2={0} />
      <line x1={-10} y1={0} x2={10} y2={0} />
      <line x1={-8} y1={5} x2={8} y2={5} />
      <line x1={-6} y1={10} x2={6} y2={10} />
      <line x1={-4} y1={15} x2={4} y2={15} />
    </g>
  )
}

function OpAmp() {
  // IEEE 315-1975 standard operational amplifier - triangle with + and - inputs
  return (
    <g className={common}>
      <path d="M -18 -15 L 18 0 L -18 15 Z" />
      <line x1={18} y1={0} x2={30} y2={0} />
      <line x1={-30} y1={-7} x2={-6} y2={-7} />
      <line x1={-30} y1={7} x2={-6} y2={7} />
      <text x={-26} y={-3} fontSize="8" fontWeight="400" className="fill-current">+</text>
      <text x={-26} y={11} fontSize="8" fontWeight="400" className="fill-current">-</text>
    </g>
  )
}

function Diode() {
  // IEEE 315-1975 standard diode - triangle with vertical line
  return (
    <g className={common}>
      <line x1={-24} y1={0} x2={-10} y2={0} />
      <path d="M -10 -12 L 10 0 L -10 12 Z" />
      <line x1={10} y1={-12} x2={10} y2={12} />
      <line x1={10} y1={0} x2={24} y2={0} />
    </g>
  )
}

function LED() {
  // IEEE 315-1975 standard LED - diode with light rays
  return (
    <g className={common}>
      <line x1={-24} y1={0} x2={-10} y2={0} />
      <path d="M -10 -12 L 10 0 L -10 12 Z" />
      <line x1={10} y1={-12} x2={10} y2={12} />
      <line x1={10} y1={0} x2={24} y2={0} />
      <path d="M 14 -6 L 18 -10 M 14 0 L 20 0 M 14 6 L 18 10" strokeWidth="1" />
    </g>
  )
}

function SwitchSymbol() {
  // IEEE standard switch - break in line with diagonal connection
  return (
    <g className={common}>
      <line x1={-24} y1={0} x2={-6} y2={0} />
      <line x1={6} y1={0} x2={24} y2={0} />
      <line x1={-6} y1={0} x2={6} y2={-8} />
    </g>
  )
}

function Node() {
  return (
    <g className={common}>
      <circle cx={0} cy={0} r={3} className="fill-current" />
    </g>
  )
}

// Transistors
function TransistorNPN() {
  // IEEE 315-1975 standard NPN transistor
  return (
    <g className={common}>
      <line x1={-24} y1={-10} x2={-8} y2={-10} />
      <line x1={-24} y1={10} x2={-8} y2={10} />
      <line x1={8} y1={0} x2={24} y2={0} />
      <line x1={-8} y1={-10} x2={8} y2={0} />
      <line x1={-8} y1={10} x2={8} y2={0} />
      <line x1={-8} y1={-10} x2={-8} y2={10} />
      <line x1={-8} y1={-10} x2={8} y2={0} strokeWidth="2" />
      <text x={-18} y={-6} fontSize="6" fontWeight="400" className="fill-current">B</text>
      <text x={-18} y={14} fontSize="6" fontWeight="400" className="fill-current">E</text>
      <text x={16} y={-2} fontSize="6" fontWeight="400" className="fill-current">C</text>
    </g>
  )
}

function TransistorPNP() {
  // IEEE 315-1975 standard PNP transistor - with arrow on emitter
  return (
    <g className={common}>
      <line x1={-24} y1={-10} x2={-8} y2={-10} />
      <line x1={-24} y1={10} x2={-8} y2={10} />
      <line x1={8} y1={0} x2={24} y2={0} />
      <line x1={-8} y1={-10} x2={8} y2={0} />
      <line x1={-8} y1={10} x2={8} y2={0} />
      <line x1={-8} y1={-10} x2={-8} y2={10} />
      <line x1={-8} y1={-10} x2={8} y2={0} strokeWidth="2" />
      <circle cx={-6} cy={10} r={2} className="fill-current" />
      <text x={-18} y={-6} fontSize="6" fontWeight="400" className="fill-current">B</text>
      <text x={-18} y={14} fontSize="6" fontWeight="400" className="fill-current">E</text>
      <text x={16} y={-2} fontSize="6" fontWeight="400" className="fill-current">C</text>
    </g>
  )
}

function MOSFETN() {
  // IEEE 315-1975 standard N-channel MOSFET
  return (
    <g className={common}>
      <line x1={-24} y1={-10} x2={-12} y2={-10} />
      <line x1={-24} y1={10} x2={-12} y2={10} />
      <line x1={12} y1={-10} x2={24} y2={-10} />
      <line x1={12} y1={10} x2={24} y2={10} />
      <line x1={-12} y1={-10} x2={12} y2={-10} />
      <line x1={-12} y1={10} x2={12} y2={10} />
      <line x1={0} y1={-18} x2={0} y2={-10} />
      <line x1={-12} y1={-10} x2={-12} y2={10} strokeWidth="2" />
      <line x1={12} y1={-10} x2={12} y2={10} strokeWidth="2" />
      <text x={-18} y={-6} fontSize="6" fontWeight="400" className="fill-current">S</text>
      <text x={-18} y={14} fontSize="6" fontWeight="400" className="fill-current">D</text>
      <text x={2} y={-22} fontSize="6" fontWeight="400" className="fill-current">G</text>
    </g>
  )
}

function MOSFETP() {
  // IEEE 315-1975 standard P-channel MOSFET - with bubble on gate
  return (
    <g className={common}>
      <line x1={-24} y1={-10} x2={-12} y2={-10} />
      <line x1={-24} y1={10} x2={-12} y2={10} />
      <line x1={12} y1={-10} x2={24} y2={-10} />
      <line x1={12} y1={10} x2={24} y2={10} />
      <line x1={-12} y1={-10} x2={12} y2={-10} />
      <line x1={-12} y1={10} x2={12} y2={10} />
      <line x1={0} y1={-18} x2={0} y2={-10} />
      <line x1={-12} y1={-10} x2={-12} y2={10} strokeWidth="2" />
      <line x1={12} y1={-10} x2={12} y2={10} strokeWidth="2" />
      <circle cx={-6} cy={10} r={2} className="fill-current" />
      <text x={-18} y={-6} fontSize="6" fontWeight="400" className="fill-current">S</text>
      <text x={-18} y={14} fontSize="6" fontWeight="400" className="fill-current">D</text>
      <text x={2} y={-22} fontSize="6" fontWeight="400" className="fill-current">G</text>
    </g>
  )
}

function JFETN() {
  return (
    <g className={common}>
      <line x1={-24} y1={0} x2={-8} y2={0} />
      <line x1={-8} y1={-12} x2={-8} y2={12} />
      <line x1={-8} y1={-12} x2={8} y2={-8} />
      <line x1={-8} y1={12} x2={8} y2={8} />
      <line x1={8} y1={-8} x2={8} y2={8} />
      <line x1={8} y1={0} x2={24} y2={0} />
      <line x1={-8} y1={-4} x2={-4} y2={-4} />
      <line x1={-8} y1={4} x2={-4} y2={4} />
      <line x1={0} y1={-16} x2={0} y2={-12} />
    </g>
  )
}

function JFETP() {
  return (
    <g className={common}>
      <line x1={-24} y1={0} x2={-8} y2={0} />
      <line x1={-8} y1={-12} x2={-8} y2={12} />
      <line x1={-8} y1={-12} x2={8} y2={-8} />
      <line x1={-8} y1={12} x2={8} y2={8} />
      <line x1={8} y1={-8} x2={8} y2={8} />
      <line x1={8} y1={0} x2={24} y2={0} />
      <line x1={-8} y1={-4} x2={-4} y2={-4} />
      <line x1={-8} y1={4} x2={-4} y2={4} />
      <line x1={0} y1={-16} x2={0} y2={-12} />
      <circle cx={-6} cy={0} r={2} className="fill-current" />
    </g>
  )
}

function IGBT() {
  return (
    <g className={common}>
      <line x1={-24} y1={0} x2={-8} y2={0} />
      <line x1={-8} y1={-12} x2={-8} y2={12} />
      <line x1={-8} y1={-12} x2={8} y2={-8} />
      <line x1={-8} y1={12} x2={8} y2={8} />
      <line x1={8} y1={-8} x2={8} y2={8} />
      <line x1={8} y1={0} x2={24} y2={0} />
      <line x1={-8} y1={-4} x2={-4} y2={-4} />
      <line x1={-8} y1={4} x2={-4} y2={4} />
      <line x1={0} y1={-16} x2={0} y2={-12} />
      <line x1={-2} y1={-8} x2={2} y2={-8} />
    </g>
  )
}

function DarlingtonTransistor() {
  return (
    <g className={common}>
      <line x1={-24} y1={0} x2={-16} y2={0} />
      <line x1={-16} y1={-8} x2={-16} y2={8} />
      <line x1={-16} y1={-8} x2={-8} y2={-6} />
      <line x1={-16} y1={8} x2={-8} y2={6} />
      <line x1={-8} y1={-6} x2={-8} y2={6} />
      <line x1={-8} y1={-4} x2={0} y2={-4} />
      <line x1={-8} y1={4} x2={0} y2={4} />
      <line x1={0} y1={-8} x2={0} y2={8} />
      <line x1={0} y1={-8} x2={8} y2={-6} />
      <line x1={0} y1={8} x2={8} y2={6} />
      <line x1={8} y1={-6} x2={8} y2={6} />
      <line x1={8} y1={0} x2={24} y2={0} />
      <line x1={-16} y1={-2} x2={-12} y2={-2} />
      <line x1={-16} y1={2} x2={-12} y2={2} />
      <line x1={0} y1={-2} x2={4} y2={-2} />
      <line x1={0} y1={2} x2={4} y2={2} />
    </g>
  )
}

// Diodes
function ZenerDiode() {
  return (
    <g className={common}>
      <line x1={-24} y1={0} x2={-8} y2={0} />
      <path d="M -8 -10 L 8 0 L -8 10 Z" />
      <line x1={8} y1={-10} x2={8} y2={10} />
      <line x1={8} y1={0} x2={24} y2={0} />
      <line x1={-4} y1={-6} x2={4} y2={-6} />
      <line x1={-4} y1={6} x2={4} y2={6} />
    </g>
  )
}

function SchottkyDiode() {
  return (
    <g className={common}>
      <line x1={-24} y1={0} x2={-8} y2={0} />
      <path d="M -8 -10 L 8 0 L -8 10 Z" />
      <line x1={8} y1={-10} x2={8} y2={10} />
      <line x1={8} y1={0} x2={24} y2={0} />
      <line x1={-2} y1={-6} x2={2} y2={-6} />
      <line x1={-2} y1={6} x2={2} y2={6} />
    </g>
  )
}

function VaractorDiode() {
  return (
    <g className={common}>
      <line x1={-24} y1={0} x2={-8} y2={0} />
      <path d="M -8 -10 L 8 0 L -8 10 Z" />
      <line x1={8} y1={-10} x2={8} y2={10} />
      <line x1={8} y1={0} x2={24} y2={0} />
      <line x1={-4} y1={-6} x2={4} y2={-6} />
      <line x1={-4} y1={6} x2={4} y2={6} />
      <line x1={0} y1={-8} x2={0} y2={-6} />
    </g>
  )
}

function Photodiode() {
  return (
    <g className={common}>
      <line x1={-24} y1={0} x2={-8} y2={0} />
      <path d="M -8 -10 L 8 0 L -8 10 Z" />
      <line x1={8} y1={-10} x2={8} y2={10} />
      <line x1={8} y1={0} x2={24} y2={0} />
      <path d="M 2 -12 l 6 -6 m -2 6 l 6 -6" />
    </g>
  )
}

function TunnelDiode() {
  return (
    <g className={common}>
      <line x1={-24} y1={0} x2={-8} y2={0} />
      <path d="M -8 -10 L 8 0 L -8 10 Z" />
      <line x1={8} y1={-10} x2={8} y2={10} />
      <line x1={8} y1={0} x2={24} y2={0} />
      <path d="M -4 -6 Q 0 -8 4 -6" />
      <path d="M -4 6 Q 0 8 4 6" />
    </g>
  )
}

function AvalancheDiode() {
  return (
    <g className={common}>
      <line x1={-24} y1={0} x2={-8} y2={0} />
      <path d="M -8 -10 L 8 0 L -8 10 Z" />
      <line x1={8} y1={-10} x2={8} y2={10} />
      <line x1={8} y1={0} x2={24} y2={0} />
      <line x1={-4} y1={-6} x2={4} y2={-6} />
      <line x1={-4} y1={6} x2={4} y2={6} />
      <path d="M -2 -4 L 2 4" />
    </g>
  )
}

// Power Devices
function Thyristor() {
  return (
    <g className={common}>
      <line x1={-24} y1={0} x2={-8} y2={0} />
      <path d="M -8 -10 L 8 0 L -8 10 Z" />
      <line x1={8} y1={-10} x2={8} y2={10} />
      <line x1={8} y1={0} x2={24} y2={0} />
      <line x1={-8} y1={-4} x2={-4} y2={-4} />
      <line x1={-8} y1={4} x2={-4} y2={4} />
      <line x1={0} y1={-16} x2={0} y2={-12} />
    </g>
  )
}

function Triac() {
  return (
    <g className={common}>
      <line x1={-24} y1={0} x2={-8} y2={0} />
      <path d="M -8 -10 L 8 0 L -8 10 Z" />
      <line x1={8} y1={-10} x2={8} y2={10} />
      <line x1={8} y1={0} x2={24} y2={0} />
      <line x1={-8} y1={-4} x2={-4} y2={-4} />
      <line x1={-8} y1={4} x2={-4} y2={4} />
      <line x1={0} y1={-16} x2={0} y2={-12} />
      <line x1={-2} y1={-8} x2={2} y2={-8} />
    </g>
  )
}

function Diac() {
  return (
    <g className={common}>
      <line x1={-24} y1={0} x2={-8} y2={0} />
      <path d="M -8 -10 L 8 0 L -8 10 Z" />
      <line x1={8} y1={-10} x2={8} y2={10} />
      <line x1={8} y1={0} x2={24} y2={0} />
      <line x1={-4} y1={-6} x2={4} y2={-6} />
      <line x1={-4} y1={6} x2={4} y2={6} />
      <line x1={-2} y1={-4} x2={2} y2={4} />
      <line x1={-2} y1={4} x2={2} y2={-4} />
    </g>
  )
}

function PowerMOSFET() {
  return (
    <g className={common}>
      <line x1={-24} y1={0} x2={-12} y2={0} />
      <line x1={-12} y1={-12} x2={-12} y2={12} />
      <line x1={-12} y1={-12} x2={12} y2={-12} />
      <line x1={-12} y1={12} x2={12} y2={12} />
      <line x1={12} y1={-12} x2={12} y2={12} />
      <line x1={12} y1={0} x2={24} y2={0} />
      <line x1={-12} y1={-4} x2={-8} y2={-4} />
      <line x1={-12} y1={4} x2={-8} y2={4} />
      <line x1={0} y1={-16} x2={0} y2={-12} />
      <line x1={-2} y1={-8} x2={2} y2={-8} />
    </g>
  )
}

// Passive Components
function Transformer() {
  return (
    <g className={common}>
      <line x1={-24} y1={-8} x2={-8} y2={-8} />
      <line x1={-24} y1={8} x2={-8} y2={8} />
      <circle cx={-4} cy={-8} r={4} />
      <circle cx={-4} cy={8} r={4} />
      <line x1={0} y1={-8} x2={16} y2={-8} />
      <line x1={0} y1={8} x2={16} y2={8} />
      <line x1={-4} y1={-12} x2={-4} y2={-4} />
      <line x1={-4} y1={4} x2={-4} y2={12} />
    </g>
  )
}

function Crystal() {
  return (
    <g className={common}>
      <rect x={-8} y={-6} width={16} height={12} rx={2} />
      <line x1={-24} y1={0} x2={-8} y2={0} />
      <line x1={8} y1={0} x2={24} y2={0} />
      <line x1={-4} y1={-2} x2={4} y2={-2} />
      <line x1={-4} y1={2} x2={4} y2={2} />
    </g>
  )
}

function Relay() {
  return (
    <g className={common}>
      <rect x={-8} y={-8} width={16} height={16} rx={2} />
      <line x1={-24} y1={-4} x2={-8} y2={-4} />
      <line x1={-24} y1={4} x2={-8} y2={4} />
      <line x1={8} y1={-4} x2={24} y2={-4} />
      <line x1={8} y1={4} x2={24} y2={4} />
      <line x1={-4} y1={-8} x2={-4} y2={-4} />
      <line x1={4} y1={-8} x2={4} y2={-4} />
    </g>
  )
}

function Fuse() {
  return (
    <g className={common}>
      <line x1={-24} y1={0} x2={-8} y2={0} />
      <line x1={-8} y1={-6} x2={8} y2={6} />
      <line x1={8} y1={0} x2={24} y2={0} />
      <line x1={-2} y1={-3} x2={2} y2={3} />
    </g>
  )
}

function Potentiometer() {
  return (
    <g className={common}>
      <line x1={-24} y1={0} x2={-12} y2={0} />
      <rect x={-12} y={-8} width={24} height={16} rx={2} />
      <line x1={12} y1={0} x2={24} y2={0} />
      <line x1={0} y1={-8} x2={0} y2={8} />
      <line x1={-4} y1={-4} x2={4} y2={4} />
    </g>
  )
}

function VariableCapacitor() {
  return (
    <g className={common}>
      <line x1={-24} y1={0} x2={-6} y2={0} />
      <line x1={-6} y1={-10} x2={-6} y2={10} />
      <line x1={6} y1={-10} x2={6} y2={10} />
      <line x1={6} y1={0} x2={24} y2={0} />
      <line x1={-2} y1={-8} x2={2} y2={-8} />
    </g>
  )
}

function VariableInductor() {
  return (
    <g className={common}>
      <line x1={-24} y1={0} x2={-12} y2={0} />
      <path d="M -12 0 c 4 -10, 8 -10, 12 0 c 4 -10, 8 -10, 12 0" />
      <line x1={12} y1={0} x2={24} y2={0} />
      <line x1={-2} y1={-8} x2={2} y2={-8} />
    </g>
  )
}

function Thermistor() {
  return (
    <g className={common}>
      <line x1={-24} y1={0} x2={-12} y2={0} />
      <rect x={-12} y={-8} width={24} height={16} rx={2} />
      <line x1={12} y1={0} x2={24} y2={0} />
      <text x={0} y={2} textAnchor="middle" fontSize="8" fontWeight="400" className="fill-current">θ</text>
    </g>
  )
}

function Photoresistor() {
  return (
    <g className={common}>
      <line x1={-24} y1={0} x2={-12} y2={0} />
      <rect x={-12} y={-8} width={24} height={16} rx={2} />
      <line x1={12} y1={0} x2={24} y2={0} />
      <path d="M 2 -12 l 6 -6 m -2 6 l 6 -6" />
    </g>
  )
}

function Varistor() {
  return (
    <g className={common}>
      <line x1={-24} y1={0} x2={-8} y2={0} />
      <path d="M -8 -10 L 8 0 L -8 10 Z" />
      <line x1={8} y1={-10} x2={8} y2={10} />
      <line x1={8} y1={0} x2={24} y2={0} />
      <path d="M -4 -6 Q 0 -8 4 -6" />
      <path d="M -4 6 Q 0 8 4 6" />
      <line x1={-2} y1={-4} x2={2} y2={4} />
    </g>
  )
}

// Sources
function VoltageSource() {
  // IEEE 315-1975 standard voltage source
  return (
    <g className={common}>
      <circle cx={0} cy={0} r={14} />
      <line x1={-24} y1={0} x2={-14} y2={0} />
      <line x1={14} y1={0} x2={24} y2={0} />
      <text x={0} y={5} textAnchor="middle" fontSize="12" fontWeight="400" className="fill-current">V</text>
    </g>
  )
}

function CurrentSource() {
  // IEEE 315-1975 standard current source
  return (
    <g className={common}>
      <circle cx={0} cy={0} r={14} />
      <line x1={-24} y1={0} x2={-14} y2={0} />
      <line x1={14} y1={0} x2={24} y2={0} />
      <text x={0} y={5} textAnchor="middle" fontSize="12" fontWeight="400" className="fill-current">I</text>
    </g>
  )
}

function ACSource() {
  return (
    <g className={common}>
      <circle cx={0} cy={0} r={12} />
      <line x1={-24} y1={0} x2={-12} y2={0} />
      <line x1={12} y1={0} x2={24} y2={0} />
      <path d="M -6 -4 Q 0 -8 6 -4 Q 0 0 6 4 Q 0 8 -6 4 Q 0 0 -6 -4" />
    </g>
  )
}

function DCSource() {
  return (
    <g className={common}>
      <circle cx={0} cy={0} r={12} />
      <line x1={-24} y1={0} x2={-12} y2={0} />
      <line x1={12} y1={0} x2={24} y2={0} />
      <line x1={-6} y1={-4} x2={6} y2={-4} />
      <line x1={-6} y1={4} x2={6} y2={4} />
    </g>
  )
}

function VoltageControlledVoltageSource() {
  return (
    <g className={common}>
      <circle cx={0} cy={0} r={12} />
      <line x1={-24} y1={0} x2={-12} y2={0} />
      <line x1={12} y1={0} x2={24} y2={0} />
      <line x1={-24} y1={-16} x2={-12} y2={-16} />
      <line x1={-24} y1={-20} x2={-12} y2={-20} />
      <text x={0} y={4} textAnchor="middle" fontSize="7" fontWeight="400" className="fill-current">VCVS</text>
    </g>
  )
}

function CurrentControlledCurrentSource() {
  return (
    <g className={common}>
      <circle cx={0} cy={0} r={12} />
      <line x1={-24} y1={0} x2={-12} y2={0} />
      <line x1={12} y1={0} x2={24} y2={0} />
      <line x1={-24} y1={-16} x2={-12} y2={-16} />
      <line x1={-24} y1={-20} x2={-12} y2={-20} />
      <text x={0} y={4} textAnchor="middle" fontSize="7" fontWeight="400" className="fill-current">CCCS</text>
    </g>
  )
}

function VoltageControlledCurrentSource() {
  return (
    <g className={common}>
      <circle cx={0} cy={0} r={12} />
      <line x1={-24} y1={0} x2={-12} y2={0} />
      <line x1={12} y1={0} x2={24} y2={0} />
      <line x1={-24} y1={-16} x2={-12} y2={-16} />
      <line x1={-24} y1={-20} x2={-12} y2={-20} />
      <text x={0} y={4} textAnchor="middle" fontSize="7" fontWeight="400" className="fill-current">VCCS</text>
    </g>
  )
}

function CurrentControlledVoltageSource() {
  return (
    <g className={common}>
      <circle cx={0} cy={0} r={12} />
      <line x1={-24} y1={0} x2={-12} y2={0} />
      <line x1={12} y1={0} x2={24} y2={0} />
      <line x1={-24} y1={-16} x2={-12} y2={-16} />
      <line x1={-24} y1={-20} x2={-12} y2={-20} />
      <text x={0} y={4} textAnchor="middle" fontSize="7" fontWeight="400" className="fill-current">CCVS</text>
    </g>
  )
}

// Logic Gates
function LogicGateAND() {
  return (
    <g className={common}>
      <line x1={-24} y1={-8} x2={-8} y2={-8} />
      <line x1={-24} y1={8} x2={-8} y2={8} />
      <path d="M -8 -12 Q 8 -12 8 0 Q 8 12 -8 12 Z" />
      <line x1={8} y1={0} x2={24} y2={0} />
    </g>
  )
}

function LogicGateOR() {
  return (
    <g className={common}>
      <line x1={-24} y1={-8} x2={-4} y2={-8} />
      <line x1={-24} y1={8} x2={-4} y2={8} />
      <path d="M -4 -12 Q 8 -12 8 0 Q 8 12 -4 12 Q -8 8 -8 0 Q -8 -8 -4 -12" />
      <line x1={8} y1={0} x2={24} y2={0} />
    </g>
  )
}

function LogicGateNOT() {
  return (
    <g className={common}>
      <line x1={-24} y1={0} x2={-8} y2={0} />
      <path d="M -8 -8 L 8 0 L -8 8 Z" />
      <circle cx={10} cy={0} r={2} className="fill-current" />
      <line x1={12} y1={0} x2={24} y2={0} />
    </g>
  )
}

function LogicGateNAND() {
  return (
    <g className={common}>
      <line x1={-24} y1={-8} x2={-8} y2={-8} />
      <line x1={-24} y1={8} x2={-8} y2={8} />
      <path d="M -8 -12 Q 8 -12 8 0 Q 8 12 -8 12 Z" />
      <circle cx={10} cy={0} r={2} className="fill-current" />
      <line x1={12} y1={0} x2={24} y2={0} />
    </g>
  )
}

function LogicGateNOR() {
  return (
    <g className={common}>
      <line x1={-24} y1={-8} x2={-4} y2={-8} />
      <line x1={-24} y1={8} x2={-4} y2={8} />
      <path d="M -4 -12 Q 8 -12 8 0 Q 8 12 -4 12 Q -8 8 -8 0 Q -8 -8 -4 -12" />
      <circle cx={10} cy={0} r={2} className="fill-current" />
      <line x1={12} y1={0} x2={24} y2={0} />
    </g>
  )
}

function LogicGateXOR() {
  return (
    <g className={common}>
      <line x1={-24} y1={-8} x2={-4} y2={-8} />
      <line x1={-24} y1={8} x2={-4} y2={8} />
      <path d="M -4 -12 Q 8 -12 8 0 Q 8 12 -4 12 Q -8 8 -8 0 Q -8 -8 -4 -12" />
      <path d="M -8 -12 Q -4 -12 -4 -8" />
      <line x1={8} y1={0} x2={24} y2={0} />
    </g>
  )
}

function LogicGateXNOR() {
  return (
    <g className={common}>
      <line x1={-24} y1={-8} x2={-4} y2={-8} />
      <line x1={-24} y1={8} x2={-4} y2={8} />
      <path d="M -4 -12 Q 8 -12 8 0 Q 8 12 -4 12 Q -8 8 -8 0 Q -8 -8 -4 -12" />
      <path d="M -8 -12 Q -4 -12 -4 -8" />
      <circle cx={10} cy={0} r={2} className="fill-current" />
      <line x1={12} y1={0} x2={24} y2={0} />
    </g>
  )
}

function Buffer() {
  return (
    <g className={common}>
      <line x1={-24} y1={0} x2={-8} y2={0} />
      <path d="M -8 -8 L 8 0 L -8 8 Z" />
      <line x1={8} y1={0} x2={24} y2={0} />
    </g>
  )
}

function Inverter() {
  return <LogicGateNOT />
}

// Amplifiers
function Amplifier() {
  return (
    <g className={common}>
      <path d="M -16 -12 L 16 0 L -16 12 Z" />
      <line x1={16} y1={0} x2={28} y2={0} />
      <line x1={-26} y1={-6} x2={-6} y2={-6} />
      <line x1={-18} y1={6} x2={-6} y2={6} />
      <text x={0} y={-2} textAnchor="middle" fontSize="8" fontWeight="400" className="fill-current">A</text>
    </g>
  )
}

function DifferentialAmplifier() {
  return (
    <g className={common}>
      <path d="M -16 -12 L 16 0 L -16 12 Z" />
      <line x1={16} y1={0} x2={28} y2={0} />
      <line x1={-26} y1={-6} x2={-6} y2={-6} />
      <line x1={-18} y1={6} x2={-6} y2={6} />
      <line x1={-18} y1={-6} x2={-14} y2={-6} />
      <line x1={-18} y1={6} x2={-14} y2={6} />
      <text x={0} y={-2} textAnchor="middle" fontSize="7" fontWeight="400" className="fill-current">Diff</text>
    </g>
  )
}

function InstrumentationAmplifier() {
  return (
    <g className={common}>
      <path d="M -16 -12 L 16 0 L -16 12 Z" />
      <line x1={16} y1={0} x2={28} y2={0} />
      <line x1={-26} y1={-6} x2={-6} y2={-6} />
      <line x1={-18} y1={6} x2={-6} y2={6} />
      <line x1={-18} y1={-6} x2={-14} y2={-6} />
      <line x1={-18} y1={6} x2={-14} y2={6} />
      <text x={0} y={-2} textAnchor="middle" fontSize="6" fontWeight="400" className="fill-current">IA</text>
    </g>
  )
}

function Comparator() {
  return (
    <g className={common}>
      <path d="M -16 -12 L 16 0 L -16 12 Z" />
      <line x1={16} y1={0} x2={28} y2={0} />
      <line x1={-26} y1={-6} x2={-6} y2={-6} />
      <line x1={-18} y1={6} x2={-6} y2={6} />
      <line x1={-18} y1={-6} x2={-14} y2={-6} />
      <line x1={-18} y1={6} x2={-14} y2={6} />
      <text x={0} y={-2} textAnchor="middle" fontSize="6" fontWeight="400" className="fill-current">CMP</text>
    </g>
  )
}

function SchmittTrigger() {
  return (
    <g className={common}>
      <path d="M -16 -12 L 16 0 L -16 12 Z" />
      <line x1={16} y1={0} x2={28} y2={0} />
      <line x1={-26} y1={-6} x2={-6} y2={-6} />
      <line x1={-18} y1={6} x2={-6} y2={6} />
      <line x1={-18} y1={-6} x2={-14} y2={-6} />
      <line x1={-18} y1={6} x2={-14} y2={6} />
      <text x={0} y={-2} textAnchor="middle" fontSize="6" fontWeight="400" className="fill-current">ST</text>
    </g>
  )
}

// RF Components
function Antenna() {
  return (
    <g className={common}>
      <line x1={0} y1={-20} x2={0} y2={0} />
      <line x1={-8} y1={-12} x2={8} y2={-12} />
      <line x1={-4} y1={-8} x2={4} y2={-8} />
      <line x1={-2} y1={-4} x2={2} y2={-4} />
    </g>
  )
}

function PLL() {
  return (
    <g className={common}>
      <rect x={-8} y={-8} width={16} height={16} rx={2} />
      <line x1={-24} y1={-4} x2={-8} y2={-4} />
      <line x1={-24} y1={4} x2={-8} y2={4} />
      <line x1={8} y1={-4} x2={24} y2={-4} />
      <line x1={8} y1={4} x2={24} y2={4} />
      <text x={0} y={2} textAnchor="middle" fontSize="6" fontWeight="400" className="fill-current">PLL</text>
    </g>
  )
}

function VCO() {
  return (
    <g className={common}>
      <rect x={-8} y={-8} width={16} height={16} rx={2} />
      <line x1={-24} y1={0} x2={-8} y2={0} />
      <line x1={8} y1={0} x2={24} y2={0} />
      <path d="M -2 -4 Q 0 -6 2 -4 Q 0 -2 2 0 Q 0 2 2 4" />
      <text x={0} y={8} textAnchor="middle" fontSize="5" fontWeight="400" className="fill-current">VCO</text>
    </g>
  )
}

function Mixer() {
  return (
    <g className={common}>
      <circle cx={0} cy={0} r={10} />
      <line x1={-24} y1={-6} x2={-10} y2={-6} />
      <line x1={-24} y1={6} x2={-10} y2={6} />
      <line x1={10} y1={0} x2={24} y2={0} />
      <text x={0} y={-12} textAnchor="middle" fontSize="6" fontWeight="400" className="fill-current">×</text>
    </g>
  )
}

function Oscillator() {
  return (
    <g className={common}>
      <rect x={-8} y={-8} width={16} height={16} rx={2} />
      <line x1={-24} y1={0} x2={-8} y2={0} />
      <line x1={8} y1={0} x2={24} y2={0} />
      <path d="M -2 -4 Q 0 -6 2 -4 Q 0 -2 2 0 Q 0 2 2 4" />
      <text x={0} y={8} textAnchor="middle" fontSize="5" fontWeight="400" className="fill-current">OSC</text>
    </g>
  )
}

function Filter() {
  return (
    <g className={common}>
      <rect x={-8} y={-8} width={16} height={16} rx={2} />
      <line x1={-24} y1={0} x2={-8} y2={0} />
      <line x1={8} y1={0} x2={24} y2={0} />
      <path d="M -4 -4 L 4 4 M 4 -4 L -4 4" />
      <text x={0} y={8} textAnchor="middle" fontSize="5" fontWeight="400" className="fill-current">F</text>
    </g>
  )
}

function AmplifierRF() {
  return (
    <g className={common}>
      <path d="M -16 -12 L 16 0 L -16 12 Z" />
      <line x1={16} y1={0} x2={28} y2={0} />
      <line x1={-26} y1={-6} x2={-6} y2={-6} />
      <line x1={-18} y1={6} x2={-6} y2={6} />
      <text x={0} y={-2} textAnchor="middle" fontSize="6" fontWeight="400" className="fill-current">RF</text>
    </g>
  )
}

function AttenuatorRF() {
  return (
    <g className={common}>
      <rect x={-8} y={-8} width={16} height={16} rx={2} />
      <line x1={-24} y1={0} x2={-8} y2={0} />
      <line x1={8} y1={0} x2={24} y2={0} />
      <text x={0} y={2} textAnchor="middle" fontSize="6" fontWeight="400" className="fill-current">ATT</text>
    </g>
  )
}

function FilterRF() {
  return (
    <g className={common}>
      <rect x={-8} y={-8} width={16} height={16} rx={2} />
      <line x1={-24} y1={-6} x2={-8} y2={-6} />
      <line x1={-24} y1={6} x2={-8} y2={6} />
      <line x1={8} y1={-6} x2={24} y2={-6} />
      <line x1={8} y1={6} x2={24} y2={6} />
      <text x={0} y={2} textAnchor="middle" fontSize="6" fontWeight="400" className="fill-current">RF</text>
    </g>
  )
}

function Coupler() {
  return (
    <g className={common}>
      <rect x={-8} y={-8} width={16} height={16} rx={2} />
      <line x1={-24} y1={-6} x2={-8} y2={-6} />
      <line x1={-24} y1={6} x2={-8} y2={6} />
      <line x1={8} y1={-6} x2={24} y2={-6} />
      <line x1={8} y1={6} x2={24} y2={6} />
      <text x={0} y={2} textAnchor="middle" fontSize="5" fontWeight="400" className="fill-current">C</text>
    </g>
  )
}

function PowerDivider() {
  return (
    <g className={common}>
      <line x1={-24} y1={0} x2={0} y2={0} />
      <line x1={0} y1={-12} x2={0} y2={12} />
      <line x1={0} y1={-6} x2={24} y2={-6} />
      <line x1={0} y1={6} x2={24} y2={6} />
      <text x={0} y={-16} textAnchor="middle" fontSize="5" fontWeight="400" className="fill-current">PWR</text>
    </g>
  )
}

function PhaseShifter() {
  return (
    <g className={common}>
      <rect x={-8} y={-8} width={16} height={16} rx={2} />
      <line x1={-24} y1={0} x2={-8} y2={0} />
      <line x1={8} y1={0} x2={24} y2={0} />
      <text x={0} y={2} textAnchor="middle" fontSize="5" fontWeight="400" className="fill-current">φ</text>
    </g>
  )
}

function SwitchRF() {
  return (
    <g className={common}>
      <line x1={-24} y1={-6} x2={-6} y2={-6} />
      <line x1={-24} y1={6} x2={-6} y2={6} />
      <line x1={6} y1={-6} x2={24} y2={-6} />
      <line x1={6} y1={6} x2={24} y2={6} />
      <line x1={-6} y1={-6} x2={6} y2={6} />
      <text x={0} y={-12} textAnchor="middle" fontSize="5" fontWeight="400" className="fill-current">SW</text>
    </g>
  )
}

function Limiter() {
  return (
    <g className={common}>
      <rect x={-8} y={-8} width={16} height={16} rx={2} />
      <line x1={-24} y1={0} x2={-8} y2={0} />
      <line x1={8} y1={0} x2={24} y2={0} />
      <text x={0} y={2} textAnchor="middle" fontSize="6" fontWeight="400" className="fill-current">LIM</text>
    </g>
  )
}

function Detector() {
  return (
    <g className={common}>
      <rect x={-8} y={-8} width={16} height={16} rx={2} />
      <line x1={-24} y1={0} x2={-8} y2={0} />
      <line x1={8} y1={0} x2={24} y2={0} />
      <text x={0} y={2} textAnchor="middle" fontSize="6" fontWeight="400" className="fill-current">DET</text>
    </g>
  )
}

function Modulator() {
  return (
    <g className={common}>
      <rect x={-8} y={-8} width={16} height={16} rx={2} />
      <line x1={-24} y1={-4} x2={-8} y2={-4} />
      <line x1={-24} y1={4} x2={-8} y2={4} />
      <line x1={8} y1={0} x2={24} y2={0} />
      <text x={0} y={2} textAnchor="middle" fontSize="5" fontWeight="400" className="fill-current">MOD</text>
    </g>
  )
}

function Demodulator() {
  return (
    <g className={common}>
      <rect x={-8} y={-8} width={16} height={16} rx={2} />
      <line x1={-24} y1={0} x2={-8} y2={0} />
      <line x1={8} y1={-4} x2={24} y2={-4} />
      <line x1={8} y1={4} x2={24} y2={4} />
      <text x={0} y={2} textAnchor="middle" fontSize="5" fontWeight="400" className="fill-current">DEM</text>
    </g>
  )
}

function Receiver() {
  return (
    <g className={common}>
      <rect x={-8} y={-8} width={16} height={16} rx={2} />
      <line x1={-24} y1={0} x2={-8} y2={0} />
      <line x1={8} y1={-4} x2={24} y2={-4} />
      <line x1={8} y1={4} x2={24} y2={4} />
      <text x={0} y={2} textAnchor="middle" fontSize="5" fontWeight="400" className="fill-current">RX</text>
    </g>
  )
}

function Transmitter() {
  return (
    <g className={common}>
      <rect x={-8} y={-8} width={16} height={16} rx={2} />
      <line x1={-24} y1={-4} x2={-8} y2={-4} />
      <line x1={-24} y1={4} x2={-8} y2={4} />
      <line x1={8} y1={0} x2={24} y2={0} />
      <text x={0} y={2} textAnchor="middle" fontSize="5" fontWeight="400" className="fill-current">TX</text>
    </g>
  )
}

function Transceiver() {
  return (
    <g className={common}>
      <rect x={-8} y={-8} width={16} height={16} rx={2} />
      <line x1={-24} y1={-4} x2={-8} y2={-4} />
      <line x1={-24} y1={4} x2={-8} y2={4} />
      <line x1={8} y1={-4} x2={24} y2={-4} />
      <line x1={8} y1={4} x2={24} y2={4} />
      <text x={0} y={2} textAnchor="middle" fontSize="5" fontWeight="400" className="fill-current">TRX</text>
    </g>
  )
}

function Duplexer() {
  return (
    <g className={common}>
      <rect x={-8} y={-8} width={16} height={16} rx={2} />
      <line x1={-24} y1={-6} x2={-8} y2={-6} />
      <line x1={-24} y1={6} x2={-8} y2={6} />
      <line x1={8} y1={0} x2={24} y2={0} />
      <text x={0} y={2} textAnchor="middle" fontSize="5" fontWeight="400" className="fill-current">DUP</text>
    </g>
  )
}

function Diplexer() {
  return (
    <g className={common}>
      <rect x={-8} y={-8} width={16} height={16} rx={2} />
      <line x1={-24} y1={-6} x2={-8} y2={-6} />
      <line x1={-24} y1={6} x2={-8} y2={6} />
      <line x1={8} y1={0} x2={24} y2={0} />
      <text x={0} y={2} textAnchor="middle" fontSize="5" fontWeight="400" className="fill-current">DIP</text>
    </g>
  )
}

function Balun() {
  return (
    <g className={common}>
      <rect x={-8} y={-8} width={16} height={16} rx={2} />
      <line x1={-24} y1={-6} x2={-8} y2={-6} />
      <line x1={-24} y1={6} x2={-8} y2={6} />
      <line x1={8} y1={0} x2={24} y2={0} />
      <text x={0} y={2} textAnchor="middle" fontSize="5" fontWeight="400" className="fill-current">BAL</text>
    </g>
  )
}

function TransformerRF() {
  return (
    <g className={common}>
      <line x1={-24} y1={-8} x2={-8} y2={-8} />
      <line x1={-24} y1={8} x2={-8} y2={8} />
      <circle cx={-4} cy={-8} r={4} />
      <circle cx={-4} cy={8} r={4} />
      <line x1={0} y1={-8} x2={16} y2={-8} />
      <line x1={0} y1={8} x2={16} y2={8} />
      <line x1={-4} y1={-12} x2={-4} y2={-4} />
      <line x1={-4} y1={4} x2={-4} y2={12} />
      <text x={0} y={-16} textAnchor="middle" fontSize="5" fontWeight="400" className="fill-current">RF</text>
    </g>
  )
}

function Resonator() {
  return (
    <g className={common}>
      <rect x={-8} y={-8} width={16} height={16} rx={2} />
      <line x1={-24} y1={0} x2={-8} y2={0} />
      <line x1={8} y1={0} x2={24} y2={0} />
      <text x={0} y={2} textAnchor="middle" fontSize="5" fontWeight="400" className="fill-current">RES</text>
    </g>
  )
}

function Cavity() {
  return (
    <g className={common}>
      <rect x={-8} y={-8} width={16} height={16} rx={2} />
      <line x1={-24} y1={0} x2={-8} y2={0} />
      <line x1={8} y1={0} x2={24} y2={0} />
      <text x={0} y={2} textAnchor="middle" fontSize="5" fontWeight="400" className="fill-current">CAV</text>
    </g>
  )
}

function Waveguide() {
  return (
    <g className={common}>
      <rect x={-12} y={-4} width={24} height={8} />
      <line x1={-24} y1={0} x2={-12} y2={0} />
      <line x1={12} y1={0} x2={24} y2={0} />
      <text x={0} y={-12} textAnchor="middle" fontSize="5" fontWeight="400" className="fill-current">WG</text>
    </g>
  )
}

function Coaxial() {
  return (
    <g className={common}>
      <circle cx={0} cy={0} r={8} />
      <circle cx={0} cy={0} r={4} />
      <line x1={-24} y1={0} x2={-8} y2={0} />
      <line x1={8} y1={0} x2={24} y2={0} />
      <text x={0} y={-12} textAnchor="middle" fontSize="5" fontWeight="400" className="fill-current">COAX</text>
    </g>
  )
}

function Stripline() {
  return (
    <g className={common}>
      <rect x={-12} y={-2} width={24} height={4} />
      <line x1={-24} y1={0} x2={-12} y2={0} />
      <line x1={12} y1={0} x2={24} y2={0} />
      <text x={0} y={-12} textAnchor="middle" fontSize="5" fontWeight="400" className="fill-current">SL</text>
    </g>
  )
}

function Microstrip() {
  return (
    <g className={common}>
      <rect x={-12} y={-3} width={24} height={6} />
      <line x1={-24} y1={0} x2={-12} y2={0} />
      <line x1={12} y1={0} x2={24} y2={0} />
      <text x={0} y={-12} textAnchor="middle" fontSize="5" fontWeight="400" className="fill-current">MS</text>
    </g>
  )
}

function Coplanar() {
  return (
    <g className={common}>
      <rect x={-12} y={-3} width={24} height={6} />
      <line x1={-24} y1={-6} x2={-12} y2={-6} />
      <line x1={-24} y1={6} x2={-12} y2={6} />
      <line x1={12} y1={0} x2={24} y2={0} />
      <text x={0} y={-12} textAnchor="middle" fontSize="5" fontWeight="400" className="fill-current">CPW</text>
    </g>
  )
}

function Slotline() {
  return (
    <g className={common}>
      <rect x={-12} y={-6} width={24} height={12} />
      <rect x={-12} y={-2} width={24} height={4} fill="white" />
      <line x1={-24} y1={0} x2={-12} y2={0} />
      <line x1={12} y1={0} x2={24} y2={0} />
      <text x={0} y={-12} textAnchor="middle" fontSize="5" fontWeight="400" className="fill-current">SL</text>
    </g>
  )
}

// Digital/Logic Components
function FlipFlop() {
  return (
    <g className={common}>
      <rect x={-8} y={-8} width={16} height={16} rx={2} />
      <line x1={-24} y1={-4} x2={-8} y2={-4} />
      <line x1={-24} y1={4} x2={-8} y2={4} />
      <line x1={8} y1={-4} x2={24} y2={-4} />
      <line x1={8} y1={4} x2={24} y2={4} />
      <text x={0} y={2} textAnchor="middle" fontSize="5" fontWeight="400" className="fill-current">FF</text>
    </g>
  )
}

function Counter() {
  return (
    <g className={common}>
      <rect x={-8} y={-8} width={16} height={16} rx={2} />
      <line x1={-24} y1={0} x2={-8} y2={0} />
      <line x1={8} y1={-4} x2={24} y2={-4} />
      <line x1={8} y1={4} x2={24} y2={4} />
      <text x={0} y={2} textAnchor="middle" fontSize="5" fontWeight="400" className="fill-current">CNT</text>
    </g>
  )
}

function Decoder() {
  return (
    <g className={common}>
      <rect x={-8} y={-8} width={16} height={16} rx={2} />
      <line x1={-24} y1={-4} x2={-8} y2={-4} />
      <line x1={-24} y1={4} x2={-8} y2={4} />
      <line x1={8} y1={-6} x2={24} y2={-6} />
      <line x1={8} y1={-2} x2={24} y2={-2} />
      <line x1={8} y1={2} x2={24} y2={2} />
      <line x1={8} y1={6} x2={24} y2={6} />
      <text x={0} y={2} textAnchor="middle" fontSize="5" fontWeight="400" className="fill-current">DEC</text>
    </g>
  )
}

function Encoder() {
  return (
    <g className={common}>
      <rect x={-8} y={-8} width={16} height={16} rx={2} />
      <line x1={-24} y1={-6} x2={-8} y2={-6} />
      <line x1={-24} y1={-2} x2={-8} y2={-2} />
      <line x1={-24} y1={2} x2={-8} y2={2} />
      <line x1={-24} y1={6} x2={-8} y2={6} />
      <line x1={8} y1={-4} x2={24} y2={-4} />
      <line x1={8} y1={4} x2={24} y2={4} />
      <text x={0} y={2} textAnchor="middle" fontSize="5" fontWeight="400" className="fill-current">ENC</text>
    </g>
  )
}

function Multiplexer() {
  return (
    <g className={common}>
      <rect x={-8} y={-8} width={16} height={16} rx={2} />
      <line x1={-24} y1={-6} x2={-8} y2={-6} />
      <line x1={-24} y1={-2} x2={-8} y2={-2} />
      <line x1={-24} y1={2} x2={-8} y2={2} />
      <line x1={-24} y1={6} x2={-8} y2={6} />
      <line x1={8} y1={0} x2={24} y2={0} />
      <text x={0} y={2} textAnchor="middle" fontSize="5" fontWeight="400" className="fill-current">MUX</text>
    </g>
  )
}

function Demultiplexer() {
  return (
    <g className={common}>
      <rect x={-8} y={-8} width={16} height={16} rx={2} />
      <line x1={-24} y1={0} x2={-8} y2={0} />
      <line x1={8} y1={-6} x2={24} y2={-6} />
      <line x1={8} y1={-2} x2={24} y2={-2} />
      <line x1={8} y1={2} x2={24} y2={2} />
      <line x1={8} y1={6} x2={24} y2={6} />
      <text x={0} y={2} textAnchor="middle" fontSize="5" fontWeight="400" className="fill-current">DEMUX</text>
    </g>
  )
}

function Adder() {
  return (
    <g className={common}>
      <rect x={-8} y={-8} width={16} height={16} rx={2} />
      <line x1={-24} y1={-4} x2={-8} y2={-4} />
      <line x1={-24} y1={4} x2={-8} y2={4} />
      <line x1={8} y1={0} x2={24} y2={0} />
      <text x={0} y={2} textAnchor="middle" fontSize="8" fontWeight="400" className="fill-current">+</text>
    </g>
  )
}

function Subtractor() {
  return (
    <g className={common}>
      <rect x={-8} y={-8} width={16} height={16} rx={2} />
      <line x1={-24} y1={-4} x2={-8} y2={-4} />
      <line x1={-24} y1={4} x2={-8} y2={4} />
      <line x1={8} y1={0} x2={24} y2={0} />
      <text x={0} y={2} textAnchor="middle" fontSize="8" fontWeight="400" className="fill-current">-</text>
    </g>
  )
}

function Latch() {
  return (
    <g className={common}>
      <rect x={-8} y={-8} width={16} height={16} rx={2} />
      <line x1={-24} y1={-4} x2={-8} y2={-4} />
      <line x1={-24} y1={4} x2={-8} y2={4} />
      <line x1={8} y1={-4} x2={24} y2={-4} />
      <line x1={8} y1={4} x2={24} y2={4} />
      <text x={0} y={2} textAnchor="middle" fontSize="5" fontWeight="400" className="fill-current">L</text>
    </g>
  )
}

function Register() {
  return (
    <g className={common}>
      <rect x={-8} y={-8} width={16} height={16} rx={2} />
      <line x1={-24} y1={-4} x2={-8} y2={-4} />
      <line x1={-24} y1={4} x2={-8} y2={4} />
      <line x1={8} y1={-4} x2={24} y2={-4} />
      <line x1={8} y1={4} x2={24} y2={4} />
      <text x={0} y={2} textAnchor="middle" fontSize="5" fontWeight="400" className="fill-current">REG</text>
    </g>
  )
}

function Memory() {
  return (
    <g className={common}>
      <rect x={-8} y={-8} width={16} height={16} rx={2} />
      <line x1={-24} y1={-6} x2={-8} y2={-6} />
      <line x1={-24} y1={-2} x2={-8} y2={-2} />
      <line x1={-24} y1={2} x2={-8} y2={2} />
      <line x1={-24} y1={6} x2={-8} y2={6} />
      <line x1={8} y1={-4} x2={24} y2={-4} />
      <line x1={8} y1={4} x2={24} y2={4} />
      <text x={0} y={2} textAnchor="middle" fontSize="5" fontWeight="400" className="fill-current">MEM</text>
    </g>
  )
}

function CPU() {
  return (
    <g className={common}>
      <rect x={-8} y={-8} width={16} height={16} rx={2} />
      <line x1={-24} y1={-6} x2={-8} y2={-6} />
      <line x1={-24} y1={-2} x2={-8} y2={-2} />
      <line x1={-24} y1={2} x2={-8} y2={2} />
      <line x1={-24} y1={6} x2={-8} y2={6} />
      <line x1={8} y1={-6} x2={24} y2={-6} />
      <line x1={8} y1={-2} x2={24} y2={-2} />
      <line x1={8} y1={2} x2={24} y2={2} />
      <line x1={8} y1={6} x2={24} y2={6} />
      <text x={0} y={2} textAnchor="middle" fontSize="5" fontWeight="400" className="fill-current">CPU</text>
    </g>
  )
}

function Microcontroller() {
  return (
    <g className={common}>
      <rect x={-8} y={-8} width={16} height={16} rx={2} />
      <line x1={-24} y1={-6} x2={-8} y2={-6} />
      <line x1={-24} y1={-2} x2={-8} y2={-2} />
      <line x1={-24} y1={2} x2={-8} y2={2} />
      <line x1={-24} y1={6} x2={-8} y2={6} />
      <line x1={8} y1={-6} x2={24} y2={-6} />
      <line x1={8} y1={-2} x2={24} y2={-2} />
      <line x1={8} y1={2} x2={24} y2={2} />
      <line x1={8} y1={6} x2={24} y2={6} />
      <text x={0} y={2} textAnchor="middle" fontSize="4" fontWeight="400" className="fill-current">μC</text>
    </g>
  )
}

function DSP() {
  return (
    <g className={common}>
      <rect x={-8} y={-8} width={16} height={16} rx={2} />
      <line x1={-24} y1={-4} x2={-8} y2={-4} />
      <line x1={-24} y1={4} x2={-8} y2={4} />
      <line x1={8} y1={-4} x2={24} y2={-4} />
      <line x1={8} y1={4} x2={24} y2={4} />
      <text x={0} y={2} textAnchor="middle" fontSize="5" fontWeight="400" className="fill-current">DSP</text>
    </g>
  )
}

function FPGA() {
  return (
    <g className={common}>
      <rect x={-8} y={-8} width={16} height={16} rx={2} />
      <line x1={-24} y1={-6} x2={-8} y2={-6} />
      <line x1={-24} y1={-2} x2={-8} y2={-2} />
      <line x1={-24} y1={2} x2={-8} y2={2} />
      <line x1={-24} y1={6} x2={-8} y2={6} />
      <line x1={8} y1={-6} x2={24} y2={-6} />
      <line x1={8} y1={-2} x2={24} y2={-2} />
      <line x1={8} y1={2} x2={24} y2={2} />
      <line x1={8} y1={6} x2={24} y2={6} />
      <text x={0} y={2} textAnchor="middle" fontSize="5" fontWeight="400" className="fill-current">FPGA</text>
    </g>
  )
}

function ADC() {
  return (
    <g className={common}>
      <rect x={-8} y={-8} width={16} height={16} rx={2} />
      <line x1={-24} y1={0} x2={-8} y2={0} />
      <line x1={8} y1={-4} x2={24} y2={-4} />
      <line x1={8} y1={-2} x2={24} y2={-2} />
      <line x1={8} y1={0} x2={24} y2={0} />
      <line x1={8} y1={2} x2={24} y2={2} />
      <line x1={8} y1={4} x2={24} y2={4} />
      <text x={0} y={2} textAnchor="middle" fontSize="5" fontWeight="400" className="fill-current">ADC</text>
    </g>
  )
}

function DAC() {
  return (
    <g className={common}>
      <rect x={-8} y={-8} width={16} height={16} rx={2} />
      <line x1={-24} y1={-4} x2={-8} y2={-4} />
      <line x1={-24} y1={-2} x2={-8} y2={-2} />
      <line x1={-24} y1={0} x2={-8} y2={0} />
      <line x1={-24} y1={2} x2={-8} y2={2} />
      <line x1={-24} y1={4} x2={-8} y2={4} />
      <line x1={8} y1={0} x2={24} y2={0} />
      <text x={0} y={2} textAnchor="middle" fontSize="5" fontWeight="400" className="fill-current">DAC</text>
    </g>
  )
}

function Speaker() {
  return (
    <g className={common}>
      <rect x={-8} y={-8} width={16} height={16} rx={2} />
      <line x1={-24} y1={0} x2={-8} y2={0} />
      <path d="M 8 -4 Q 12 -4 12 0 Q 12 4 8 4" />
      <path d="M 12 -2 Q 16 -2 16 0 Q 16 2 12 2" />
    </g>
  )
}

function Microphone() {
  return (
    <g className={common}>
      <rect x={-6} y={-8} width={12} height={16} rx={2} />
      <line x1={-24} y1={0} x2={-6} y2={0} />
      <line x1={6} y1={0} x2={24} y2={0} />
      <path d="M -2 -8 Q 0 -12 2 -8" />
    </g>
  )
}

function Motor() {
  return (
    <g className={common}>
      <circle cx={0} cy={0} r={12} />
      <line x1={-24} y1={-8} x2={-12} y2={-8} />
      <line x1={-24} y1={8} x2={-12} y2={8} />
      <line x1={12} y1={-8} x2={24} y2={-8} />
      <line x1={12} y1={8} x2={24} y2={8} />
      <text x={0} y={4} textAnchor="middle" fontSize="8" fontWeight="400" className="fill-current">M</text>
    </g>
  )
}

function Generator() {
  return (
    <g className={common}>
      <circle cx={0} cy={0} r={12} />
      <line x1={-24} y1={-8} x2={-12} y2={-8} />
      <line x1={-24} y1={8} x2={-12} y2={8} />
      <line x1={12} y1={-8} x2={24} y2={-8} />
      <line x1={12} y1={8} x2={24} y2={8} />
      <text x={0} y={4} textAnchor="middle" fontSize="8" fontWeight="400" className="fill-current">G</text>
    </g>
  )
}

const SYMBOLS: Record<ComponentType, React.FC> = {
  // Basic Components
  Resistor,
  Capacitor,
  Inductor,
  Battery,
  Ground,
  OpAmp,
  Diode,
  LED,
  Switch: SwitchSymbol,
  Node,
  // Transistors
  TransistorNPN,
  TransistorPNP,
  MOSFETN,
  MOSFETP,
  JFETN,
  JFETP,
  IGBT,
  DarlingtonTransistor,
  // Diodes
  ZenerDiode,
  SchottkyDiode,
  VaractorDiode,
  Photodiode,
  TunnelDiode,
  AvalancheDiode,
  // Power Devices
  Thyristor,
  Triac,
  Diac,
  PowerMOSFET,
  // Passive Components
  Transformer,
  Crystal,
  Relay,
  Fuse,
  Potentiometer,
  VariableCapacitor,
  VariableInductor,
  Thermistor,
  Photoresistor,
  Varistor,
  // Sources
  VoltageSource,
  CurrentSource,
  ACSource,
  DCSource,
  VoltageControlledVoltageSource,
  CurrentControlledCurrentSource,
  VoltageControlledCurrentSource,
  CurrentControlledVoltageSource,
  // Amplifiers
  Amplifier,
  DifferentialAmplifier,
  InstrumentationAmplifier,
  Comparator,
  SchmittTrigger,
  // Logic Gates
  LogicGateAND,
  LogicGateOR,
  LogicGateNOT,
  LogicGateNAND,
  LogicGateNOR,
  LogicGateXOR,
  LogicGateXNOR,
  Buffer,
  Inverter,
  // RF Components
  Antenna,
  Speaker,
  Microphone,
  Motor,
  Generator,
  PLL,
  VCO,
  Mixer,
  Oscillator,
  Filter,
  AmplifierRF,
  AttenuatorRF,
  FilterRF,
  Coupler,
  PowerDivider,
  PhaseShifter,
  SwitchRF,
  Limiter,
  Detector,
  Modulator,
  Demodulator,
  Receiver,
  Transmitter,
  Transceiver,
  Duplexer,
  Diplexer,
  Balun,
  TransformerRF,
  Resonator,
  Cavity,
  Waveguide,
  Coaxial,
  Stripline,
  Microstrip,
  Coplanar,
  Slotline,
  // Digital/Logic Components
  FlipFlop,
  Counter,
  Decoder,
  Encoder,
  Multiplexer,
  Demultiplexer,
  Adder,
  Subtractor,
  Latch,
  Register,
  Memory,
  CPU,
  Microcontroller,
  DSP,
  FPGA,
  ADC,
  DAC,
}

export function SymbolFor({ type, className, color }: { type: ComponentType; className?: string; color?: string }) {
  const C = SYMBOLS[type]
  return (
    <g className={className} style={color ? { color } : undefined}>
      <C />
    </g>
  )
}

export default SymbolFor


