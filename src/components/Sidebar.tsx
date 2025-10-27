import { useState, useMemo, useRef, useEffect } from 'react'
import { useAppStore } from '../store'
import type { WireStyle } from '../types'
import { ui } from '../ui'
import type { ComponentType } from '../types'
import Button from './ui/Button'
import { SymbolFor } from './symbols'
import { IconSelect, IconWire, IconText, IconNode, IconGrid, IconRuler } from './icons'

const ALL_COMPONENTS: { type: ComponentType; category: 'Basic' | 'Passive' | 'Transistors' | 'Diodes' | 'Power' | 'Sources' | 'Amplifiers' | 'Logic' | 'Digital' | 'RF' | 'Mechanical' }[] = [
  // Basic Components
  { type: 'Resistor', category: 'Basic' },
  { type: 'Capacitor', category: 'Basic' },
  { type: 'Inductor', category: 'Basic' },
  { type: 'Battery', category: 'Basic' },
  { type: 'Ground', category: 'Basic' },
  { type: 'OpAmp', category: 'Basic' },
  { type: 'Diode', category: 'Basic' },
  { type: 'LED', category: 'Basic' },
  { type: 'Switch', category: 'Basic' },
  { type: 'Node', category: 'Basic' },
  
  // Passive Components
  { type: 'Transformer', category: 'Passive' },
  { type: 'Crystal', category: 'Passive' },
  { type: 'Relay', category: 'Passive' },
  { type: 'Fuse', category: 'Passive' },
  { type: 'Potentiometer', category: 'Passive' },
  { type: 'VariableCapacitor', category: 'Passive' },
  { type: 'VariableInductor', category: 'Passive' },
  { type: 'Thermistor', category: 'Passive' },
  { type: 'Photoresistor', category: 'Passive' },
  { type: 'Varistor', category: 'Passive' },
  
  // Transistors
  { type: 'TransistorNPN', category: 'Transistors' },
  { type: 'TransistorPNP', category: 'Transistors' },
  { type: 'MOSFETN', category: 'Transistors' },
  { type: 'MOSFETP', category: 'Transistors' },
  { type: 'JFETN', category: 'Transistors' },
  { type: 'JFETP', category: 'Transistors' },
  { type: 'IGBT', category: 'Transistors' },
  { type: 'DarlingtonTransistor', category: 'Transistors' },
  
  // Diodes
  { type: 'ZenerDiode', category: 'Diodes' },
  { type: 'SchottkyDiode', category: 'Diodes' },
  { type: 'VaractorDiode', category: 'Diodes' },
  { type: 'Photodiode', category: 'Diodes' },
  { type: 'TunnelDiode', category: 'Diodes' },
  { type: 'AvalancheDiode', category: 'Diodes' },
  
  // Power Devices
  { type: 'Thyristor', category: 'Power' },
  { type: 'Triac', category: 'Power' },
  { type: 'Diac', category: 'Power' },
  { type: 'PowerMOSFET', category: 'Power' },
  
  // Sources
  { type: 'VoltageSource', category: 'Sources' },
  { type: 'CurrentSource', category: 'Sources' },
  { type: 'ACSource', category: 'Sources' },
  { type: 'DCSource', category: 'Sources' },
  { type: 'VoltageControlledVoltageSource', category: 'Sources' },
  { type: 'CurrentControlledCurrentSource', category: 'Sources' },
  { type: 'VoltageControlledCurrentSource', category: 'Sources' },
  { type: 'CurrentControlledVoltageSource', category: 'Sources' },
  
  // Amplifiers
  { type: 'Amplifier', category: 'Amplifiers' },
  { type: 'DifferentialAmplifier', category: 'Amplifiers' },
  { type: 'InstrumentationAmplifier', category: 'Amplifiers' },
  { type: 'Comparator', category: 'Amplifiers' },
  { type: 'SchmittTrigger', category: 'Amplifiers' },
  
  // Logic Gates
  { type: 'LogicGateAND', category: 'Logic' },
  { type: 'LogicGateOR', category: 'Logic' },
  { type: 'LogicGateNOT', category: 'Logic' },
  { type: 'LogicGateNAND', category: 'Logic' },
  { type: 'LogicGateNOR', category: 'Logic' },
  { type: 'LogicGateXOR', category: 'Logic' },
  { type: 'LogicGateXNOR', category: 'Logic' },
  { type: 'Buffer', category: 'Logic' },
  { type: 'Inverter', category: 'Logic' },
  
  // Digital Components
  { type: 'FlipFlop', category: 'Digital' },
  { type: 'Counter', category: 'Digital' },
  { type: 'Decoder', category: 'Digital' },
  { type: 'Encoder', category: 'Digital' },
  { type: 'Multiplexer', category: 'Digital' },
  { type: 'Demultiplexer', category: 'Digital' },
  { type: 'Adder', category: 'Digital' },
  { type: 'Subtractor', category: 'Digital' },
  { type: 'Latch', category: 'Digital' },
  { type: 'Register', category: 'Digital' },
  { type: 'Memory', category: 'Digital' },
  { type: 'CPU', category: 'Digital' },
  { type: 'Microcontroller', category: 'Digital' },
  { type: 'DSP', category: 'Digital' },
  { type: 'FPGA', category: 'Digital' },
  { type: 'ADC', category: 'Digital' },
  { type: 'DAC', category: 'Digital' },
  { type: 'PLL', category: 'Digital' },
  { type: 'VCO', category: 'Digital' },
  { type: 'Mixer', category: 'Digital' },
  { type: 'Oscillator', category: 'Digital' },
  { type: 'Filter', category: 'Digital' },
  
  // RF Components
  { type: 'Antenna', category: 'RF' },
  { type: 'AmplifierRF', category: 'RF' },
  { type: 'AttenuatorRF', category: 'RF' },
  { type: 'FilterRF', category: 'RF' },
  { type: 'Coupler', category: 'RF' },
  { type: 'PowerDivider', category: 'RF' },
  { type: 'PhaseShifter', category: 'RF' },
  { type: 'SwitchRF', category: 'RF' },
  { type: 'Limiter', category: 'RF' },
  { type: 'Detector', category: 'RF' },
  { type: 'Modulator', category: 'RF' },
  { type: 'Demodulator', category: 'RF' },
  { type: 'Receiver', category: 'RF' },
  { type: 'Transmitter', category: 'RF' },
  { type: 'Transceiver', category: 'RF' },
  { type: 'Duplexer', category: 'RF' },
  { type: 'Diplexer', category: 'RF' },
  { type: 'Balun', category: 'RF' },
  { type: 'TransformerRF', category: 'RF' },
  { type: 'Resonator', category: 'RF' },
  { type: 'Cavity', category: 'RF' },
  { type: 'Waveguide', category: 'RF' },
  { type: 'Coaxial', category: 'RF' },
  { type: 'Stripline', category: 'RF' },
  { type: 'Microstrip', category: 'RF' },
  { type: 'Coplanar', category: 'RF' },
  { type: 'Slotline', category: 'RF' },
  
  // Mechanical/Electromechanical
  { type: 'Speaker', category: 'Mechanical' },
  { type: 'Microphone', category: 'Mechanical' },
  { type: 'Motor', category: 'Mechanical' },
  { type: 'Generator', category: 'Mechanical' },
]

const CATEGORIES: Array<'All' | 'Basic' | 'Passive' | 'Transistors' | 'Diodes' | 'Power' | 'Sources' | 'Amplifiers' | 'Logic' | 'Digital' | 'RF' | 'Mechanical'> = ['All', 'Basic', 'Passive', 'Transistors', 'Diodes', 'Power', 'Sources', 'Amplifiers', 'Logic', 'Digital', 'RF', 'Mechanical']

export default function Sidebar() {
  const { setTool, startPlacing, toggleGrid, toggleRuler, gridOn, rulerOn, tool, placingType, wireStyle, setWireStyle, wireColor, setWireColor, selectedWireId, setSelectedWireColor, textColor, setTextColor, textSize, setTextSize, textWeight, setTextWeight, templates, customTemplates, loadTemplate } = useAppStore() as any
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<'All' | 'Basic' | 'Passive' | 'Transistors' | 'Diodes' | 'Power' | 'Sources' | 'Amplifiers' | 'Logic' | 'Digital' | 'RF' | 'Mechanical'>('All')
  const [showTopGradient, setShowTopGradient] = useState(false)
  const [showBottomGradient, setShowBottomGradient] = useState(false)
  const [showTemplatesPanel, setShowTemplatesPanel] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [showComponentsPanel, setShowComponentsPanel] = useState(false)
  const [isComponentsClosing, setIsComponentsClosing] = useState(false)
  const [showComponentsTopGradient, setShowComponentsTopGradient] = useState(false)
  const [showComponentsBottomGradient, setShowComponentsBottomGradient] = useState(false)
  const componentsScrollRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const handleCloseTemplates = () => {
    setIsClosing(true)
    setTimeout(() => {
      setShowTemplatesPanel(false)
      setIsClosing(false)
    }, 300)
  }

  const handleCloseComponents = () => {
    setIsComponentsClosing(true)
    setTimeout(() => {
      setShowComponentsPanel(false)
      setIsComponentsClosing(false)
    }, 300)
  }

  // Function to update components gradient visibility based on scroll position
  const updateComponentsGradientVisibility = () => {
    const container = componentsScrollRef.current
    if (!container) return

    const { scrollTop, scrollHeight, clientHeight } = container
    const isScrollable = scrollHeight > clientHeight

    if (!isScrollable) {
      setShowComponentsTopGradient(false)
      setShowComponentsBottomGradient(false)
      return
    }

    setShowComponentsTopGradient(scrollTop > 0)
    setShowComponentsBottomGradient(scrollTop < scrollHeight - clientHeight - 1)
  }

  const seg = ui.pill

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ALL_COMPONENTS.filter(({ type, category: cat }) => {
      const byCat = category === 'All' || cat === category
      const byText = !q || type.toLowerCase().includes(q)
      return byCat && byText
    })
  }, [query, category])

  // Function to update gradient visibility based on scroll position
  const updateGradientVisibility = () => {
    const container = scrollContainerRef.current
    if (!container) return

    const { scrollTop, scrollHeight, clientHeight } = container
    const threshold = 5 // Small threshold to account for floating point precision
    
    // Check if content is scrollable (content height > container height)
    const isScrollable = scrollHeight > clientHeight

    if (!isScrollable) {
      // No scrolling needed, hide both gradients
      setShowTopGradient(false)
      setShowBottomGradient(false)
      return
    }

    // Top gradient: show when there's content above (scrolled down from top)
    setShowTopGradient(scrollTop > threshold)
    
    // Bottom gradient: show when there's content below (not at bottom)
    setShowBottomGradient(scrollTop < scrollHeight - clientHeight - threshold)
  }

  // Update gradients when filtered components change
  useEffect(() => {
    // Small delay to ensure DOM is updated
    const timer = setTimeout(() => {
      updateGradientVisibility()
    }, 10)
    return () => clearTimeout(timer)
  }, [filtered])

  // Add scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    container.addEventListener('scroll', updateGradientVisibility)
    return () => container.removeEventListener('scroll', updateGradientVisibility)
  }, [])

  // Update components gradient visibility when content changes
  useEffect(() => {
    updateComponentsGradientVisibility()
  }, [filtered])

  // Add scroll event listener for components panel
  useEffect(() => {
    const container = componentsScrollRef.current
    if (!container) return

    container.addEventListener('scroll', updateComponentsGradientVisibility)
    return () => container.removeEventListener('scroll', updateComponentsGradientVisibility)
  }, [])

  return (
    <>
      <aside className={ui.layout.sidebar}>
      <div className={`p-4 pb-3 ${ui.toolbarStrip}`}>
        <div className="text-sm font-semibold tracking-wide text-slate-200">Toolbar</div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Button className="cursor-pointer" variant="toggle" active={tool==='select'} onClick={() => setTool('select')}>
            <IconSelect width={18} height={18} className="mr-2" />
            Select
          </Button>
          <Button className="cursor-pointer" variant="toggle" active={tool==='wire'} onClick={() => setTool('wire')}>
            <IconWire width={18} height={18} className="mr-2" />
            Wire
          </Button>
          <Button className="cursor-pointer" variant="toggle" active={tool==='text'} onClick={() => setTool('text')}>
            <IconText width={18} height={18} className="mr-2" />
            Text
          </Button>
          <Button className="cursor-pointer" variant="toggle" active={tool==='addNode'} onClick={() => setTool('addNode')}>
            <IconNode width={18} height={18} className="mr-2" />
            Add Node
          </Button>
          <Button 
            className="cursor-pointer col-span-2" 
            variant="toggle" 
            active={showTemplatesPanel} 
            onClick={() => setShowTemplatesPanel(!showTemplatesPanel)}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Templates
          </Button>
        </div>
        {tool==='wire' && (
          <div className="mt-3">
            <div className="text-xs font-medium text-slate-300">Wire</div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(['straight','elbow','polyline'] as WireStyle[]).map(style => (
                <Button key={style} variant="toggle" active={wireStyle===style} onClick={() => setWireStyle(style)} className="cursor-pointer capitalize">
                  {style}
                </Button>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-slate-300">Wire color</span>
              <input type="color" value={wireColor} onChange={(e) => {
                setWireColor(e.target.value)
                if (selectedWireId) setSelectedWireColor(e.target.value)
              }} className="w-10 h-6 rounded-md cursor-pointer" />
            </div>
          </div>
        )}
        {tool==='text' && (
          <div className="mt-3">
            <div className="text-xs font-medium text-slate-300">Text</div>
            <div className="mt-2 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">Size</span>
                <input
                  type="number"
                  className={`${ui.inputSmall} w-16`}
                  min="8"
                  max="72"
                  value={textSize}
                  onChange={(e) => setTextSize(parseInt(e.target.value) || 14)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">Weight</span>
                <select
                  className={`${ui.inputSmall} w-20`}
                  value={textWeight}
                  onChange={(e) => setTextWeight(e.target.value)}
                >
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                  <option value="100">100</option>
                  <option value="200">200</option>
                  <option value="300">300</option>
                  <option value="400">400</option>
                  <option value="500">500</option>
                  <option value="600">600</option>
                  <option value="700">700</option>
                  <option value="800">800</option>
                  <option value="900">900</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">Color</span>
                <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-10 h-6 rounded-md cursor-pointer" />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="px-4"><div className={ui.divider}/></div>
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-slate-200">Components</div>
          <button
            onClick={() => setShowComponentsPanel(true)}
            className="text-xs px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            See All
          </button>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search components..."
            className="flex-1 text-sm px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button key={c} className={seg(category===c)} onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>
      </div>

      <div className="relative p-4 overflow-hidden">
        {/* Top gradient indicator - only show when scrolled down */}
        {showTopGradient && (
          <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-slate-900 via-slate-800 to-transparent z-10 pointer-events-none" />
        )}
        {/* Bottom gradient indicator - only show when more content below */}
        {showBottomGradient && (
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-slate-900 via-slate-800 to-transparent z-10 pointer-events-none" />
        )}
        {/* Scrollable content with hidden scrollbar */}
        <div 
          ref={scrollContainerRef}
          className="max-h-96 overflow-y-auto scrollbar-hide" 
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <div className="grid grid-cols-2 gap-2 pb-4">
          {filtered.length === 0 && (
            <div className="col-span-2 text-xs text-slate-400">No components found</div>
          )}
          {filtered.map(({ type }) => (
            <button
              key={type}
              data-active={tool==='place' && placingType===type ? 'true' : undefined}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('application/component-type', type)
                e.dataTransfer.effectAllowed = 'copy'
              }}
              className={`
                group relative flex items-center gap-3 text-left text-sm px-3 py-2 rounded-lg transition duration-150 ease-out cursor-grab
                bg-slate-700 border border-slate-600 hover:bg-slate-600 hover:border-slate-500 active:scale-[0.98]
                data-[active=true]:bg-purple-600 data-[active=true]:text-white data-[active=true]:border-purple-500
                focus:outline-none focus:ring-2 focus:ring-purple-500
              `}
              onClick={() => startPlacing(type)}
            >
              {/* symbol preview */}
              <span className="shrink-0 inline-flex items-center justify-center w-10 h-7 rounded-md bg-slate-600 shadow-lg group-data-[active=true]:bg-purple-500">
                <svg viewBox="-32 -20 64 40" width="36" height="24" className="text-slate-200">
                  <SymbolFor type={type as any} />
                </svg>
              </span>
              <span className="flex-1 min-w-0 truncate">
                {type}
              </span>
            </button>
          ))}
          </div>
        </div>
      </div>


      <div className="px-4"><div className={ui.divider}/></div>
      <div className="mt-auto p-4 space-y-3">
        <label className="flex items-center justify-between text-sm text-slate-200">
          <div className="flex items-center gap-2">
            <IconGrid width={16} height={16} />
            <span>Grid</span>
          </div>
          <input type="checkbox" className="accent-purple-600" checked={gridOn} onChange={toggleGrid}/>
        </label>
        <label className="flex items-center justify-between text-sm text-slate-200">
          <div className="flex items-center gap-2">
            <IconRuler width={16} height={16} />
            <span>Ruler</span>
          </div>
          <input type="checkbox" className="accent-purple-600" checked={rulerOn} onChange={toggleRuler}/>
        </label>
      </div>
      
      
    </aside>

    {/* Separate Templates Section */}
    {(showTemplatesPanel || isClosing) && (
      <div 
        className="fixed top-0 left-72 w-80 h-full bg-gradient-to-br from-slate-800/95 via-slate-700/90 to-slate-800/95 backdrop-blur-md border-r border-slate-600/50 shadow-2xl z-50 transform transition-all duration-300 ease-out rounded-r-lg m-2"
        style={{
          animation: isClosing ? 'slideOutToLeft 0.3s ease-in' : 'slideInFromLeft 0.3s ease-out'
        }}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-lg font-semibold text-white">Circuit Templates</div>
            <button
              onClick={handleCloseTemplates}
              className="p-2 hover:bg-slate-600/50 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Templates Content */}
          <div className="flex-1 overflow-y-auto space-y-6">
            {/* SRAM Cells */}
            <div>
              <div className="text-sm font-medium text-slate-200 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
                SRAM Cells
              </div>
              <div className="space-y-2">
              {templates.filter((t: any) => t.category === 'sram').map((template: any) => (
                <div
                  key={template.id}
                  className="p-3 bg-slate-600/50 rounded-lg cursor-pointer hover:bg-slate-500/50 transition-all duration-200 border border-slate-500/30 hover:border-purple-400/50"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/json', JSON.stringify({ type: 'template', id: template.id }))
                    e.dataTransfer.effectAllowed = 'copy'
                  }}
                  onClick={() => loadTemplate(template.id, 100, 100)}
                >
                  <div className="text-sm font-medium text-white">{template.name}</div>
                  <div className="text-xs text-slate-300 mt-1">{template.description}</div>
                </div>
              ))}
              </div>
            </div>
            
            {/* Logic Gates */}
            <div>
              <div className="text-sm font-medium text-slate-200 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Logic Gates
              </div>
              <div className="space-y-2">
              {templates.filter((t: any) => t.category === 'logic').map((template: any) => (
                <div
                  key={template.id}
                  className="p-3 bg-slate-600/50 rounded-lg cursor-pointer hover:bg-slate-500/50 transition-all duration-200 border border-slate-500/30 hover:border-blue-400/50"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/json', JSON.stringify({ type: 'template', id: template.id }))
                    e.dataTransfer.effectAllowed = 'copy'
                  }}
                  onClick={() => loadTemplate(template.id, 100, 100)}
                >
                  <div className="text-sm font-medium text-white">{template.name}</div>
                  <div className="text-xs text-slate-300 mt-1">{template.description}</div>
                </div>
              ))}
              </div>
            </div>
            
            {/* Custom Templates */}
            {customTemplates.length > 0 && (
              <div>
                <div className="text-sm font-medium text-slate-200 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Custom Templates
                </div>
                <div className="space-y-2">
                  {customTemplates.map((template: any) => (
                    <div
                      key={template.id}
                      className="p-3 bg-slate-600/50 rounded-lg cursor-pointer hover:bg-slate-500/50 transition-all duration-200 border border-slate-500/30 hover:border-green-400/50"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('application/json', JSON.stringify({ type: 'template', id: template.id }))
                        e.dataTransfer.effectAllowed = 'copy'
                      }}
                      onClick={() => loadTemplate(template.id, 100, 100)}
                    >
                      <div className="text-sm font-medium text-white">{template.name}</div>
                      <div className="text-xs text-slate-300 mt-1">{template.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-slate-600/50">
            <div className="text-xs text-slate-400 text-center">
              Click any template to load it onto the canvas
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Separate Components Section */}
    {(showComponentsPanel || isComponentsClosing) && (
      <div 
        className="fixed top-0 left-72 w-80 h-full bg-gradient-to-br from-slate-900/98 via-slate-800/95 to-slate-900/98 backdrop-blur-md border-r border-slate-600/50 shadow-2xl z-50 transform transition-all duration-300 ease-out rounded-r-lg m-2"
        style={{
          animation: isComponentsClosing ? 'slideOutToLeft 0.3s ease-in' : 'slideInFromLeft 0.3s ease-out'
        }}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-lg font-semibold text-white">All Components</div>
            <button
              onClick={handleCloseComponents}
              className="p-2 hover:bg-slate-600/50 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search components..."
              className="w-full text-sm px-3 py-2 rounded-lg bg-slate-700/60 border border-slate-600/60 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button 
                  key={c} 
                  className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                    category === c 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-slate-700/60 text-slate-300 hover:bg-slate-600/60'
                  }`}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Components Content */}
          <div className="flex-1 overflow-y-auto scrollbar-hide relative">
            {/* Top gradient indicator */}
            {showComponentsTopGradient && (
              <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-slate-800 via-slate-800 to-transparent z-10 pointer-events-none" />
            )}
            
            {/* Bottom gradient indicator */}
            {showComponentsBottomGradient && (
              <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-slate-800 via-slate-800 to-transparent z-10 pointer-events-none" />
            )}
            
            <div className="grid grid-cols-1 gap-3" ref={componentsScrollRef}>
              {filtered.map(({ type }) => (
                <div
                  key={type}
                  className="p-3 bg-slate-700/70 rounded-lg cursor-pointer hover:bg-slate-600/70 transition-all duration-200 border border-slate-600/50 hover:border-purple-400/60 hover:shadow-lg flex items-center gap-3"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/json', JSON.stringify({ type: 'component', componentType: type }))
                    e.dataTransfer.effectAllowed = 'copy'
                  }}
                  onClick={() => {
                    startPlacing(type)
                    handleCloseComponents()
                  }}
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-slate-800/50 rounded-md flex-shrink-0">
                    <svg viewBox="-32 -20 64 40" width="32" height="20" className="text-white">
                      <SymbolFor type={type} />
                    </svg>
                  </div>
                  <div className="text-sm font-medium text-white leading-tight break-words hyphens-auto flex-1 min-w-0">
                    {type}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-slate-600/50">
            <div className="text-xs text-slate-400 text-center">
              Click any component to place it on the canvas
            </div>
          </div>
        </div>
      </div>
    )}

    </>
  )
}


