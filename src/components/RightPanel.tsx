import { useMemo, useEffect, useState } from 'react'
import { useAppStore } from '../store'
import { ui } from '../ui'
import Button from './ui/Button'
import { IconTrash, IconChip } from './icons'
import SelectionTools from './SelectionTools'

export default function RightPanel() {
  const { components, selectedId, selectById, deleteSelected, setSelectedScale, setSelectedColor, setSelectedRotation, texts, selectedTextId, selectTextById, deleteSelectedText, setSelectedTextContent, setSelectedTextPosition, setSelectedTextRotation, setSelectedTextColor, setSelectedTextSize, setSelectedTextWeight, wires, selectedWireId, selectWireById, deleteSelectedWire, setWireLabel, setWireSignalType, setWireThickness, setWireLineStyle, selectedNodeId, selectNodeById, deleteSelectedNode, connectionNodes } = useAppStore()
  const selected = useMemo(() => components.find(c => c.id === selectedId) || null, [components, selectedId])
  const selectedText = useMemo(() => texts.find(t => t.id === selectedTextId) || null, [texts, selectedTextId])
  const selectedWire = useMemo(() => wires.find(w => w.id === selectedWireId) || null, [wires, selectedWireId])
  const selectedNode = useMemo(() => connectionNodes.find(n => n.id === selectedNodeId) || null, [connectionNodes, selectedNodeId])
  const [rotInput, setRotInput] = useState('0')
  const [textRotInput, setTextRotInput] = useState('0')
  const [textContent, setTextContent] = useState('')
  const [wireLabel, setWireLabelInput] = useState('')
  const [wireThicknessInput, setWireThicknessInput] = useState('2')

  useEffect(() => {
    if (selected) setRotInput(String(Math.round(selected.rotation) || 0))
    else setRotInput('0')
  }, [selectedId])

  useEffect(() => {
    if (selectedText) {
      setTextRotInput(String(Math.round(selectedText.rotation || 0)))
      setTextContent(selectedText.text)
    } else {
      setTextRotInput('0')
      setTextContent('')
    }
  }, [selectedTextId])

  useEffect(() => {
    if (selectedWire) {
      setWireLabelInput(selectedWire.label || '')
      setWireThicknessInput(String(selectedWire.thickness || 2))
    } else {
      setWireLabelInput('')
      setWireThicknessInput('2')
    }
  }, [selectedWireId])

  return (
    <aside className={ui.layout.rightPanel}>
      <div className={`p-4 pb-3 ${ui.toolbarStrip}`}>
        <div className="text-sm font-semibold tracking-wide text-slate-200">Properties</div>
      </div>
      <div className="px-4"><div className={ui.divider}/></div>
      <div className="p-4 space-y-3">
        <SelectionTools />
        <div className="text-xs text-slate-400">Selected</div>
        {!selected && !selectedText && <div className="text-xs text-slate-400">Nothing selected</div>}
        {selected && (
          <div className="space-y-3">
            
            <div className="space-y-2">
              <label className="flex items-center justify-between text-sm text-slate-200">
                <span>Rotation</span>
                <input
                  type="number"
                  className={`${ui.inputSmall} w-24 text-right`}
                  min={0}
                  max={359}
                  step={1}
                  placeholder="0"
                  value={rotInput}
                  onFocus={() => { if (rotInput === '0') setRotInput('') }}
                  onChange={(e) => {
                    const v = e.target.value
                    setRotInput(v)
                    if (v === '') return
                    const n = parseFloat(v)
                    if (!Number.isNaN(n)) setSelectedRotation(n)
                  }}
                  onBlur={() => {
                    if (rotInput === '') { setRotInput('0'); setSelectedRotation(0) }
                  }}
                />
              </label>
              <label className="flex items-center justify-between text-sm text-slate-200">
                <span>Size</span>
                <input type="range" className={ui.range} min="0.5" max="3" step="0.1" value={selected.scale ?? 1} onChange={(e) => setSelectedScale(parseFloat(e.target.value))} />
              </label>
              <label className="flex items-center justify-between text-sm text-slate-200">
                <span>Color</span>
                <input type="color" className="h-8 w-10 p-0 border-0 bg-transparent" value={selected.color ?? '#111111'} onChange={(e) => setSelectedColor(e.target.value)} />
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="destructive" title="Delete" onClick={deleteSelected}><IconTrash width={16} height={16}/></Button>
            </div>
          </div>
        )}
        {selectedText && (
          <div className="space-y-3">
            <div className="text-xs text-slate-400">Text Properties</div>
            <div className="space-y-2">
              <label className="flex items-center justify-between text-sm text-slate-200">
                <span>Text</span>
                <input
                  type="text"
                  className={`${ui.inputSmall} w-32`}
                  value={textContent}
                  onChange={(e) => {
                    setTextContent(e.target.value)
                    setSelectedTextContent(e.target.value)
                  }}
                />
              </label>
              <label className="flex items-center justify-between text-sm text-slate-200">
                <span>Size</span>
                <input
                  type="number"
                  className={`${ui.inputSmall} w-20`}
                  min="8"
                  max="72"
                  value={selectedText.fontSize || 14}
                  onChange={(e) => setSelectedTextSize(parseInt(e.target.value) || 14)}
                />
              </label>
              <label className="flex items-center justify-between text-sm text-slate-200">
                <span>Weight</span>
                <select
                  className={`${ui.inputSmall} w-24`}
                  value={selectedText.fontWeight || 'normal'}
                  onChange={(e) => setSelectedTextWeight(e.target.value as any)}
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
              </label>
              <label className="flex items-center justify-between text-sm text-slate-200">
                <span>Color</span>
                <input type="color" className="h-8 w-10 p-0 border-0 bg-transparent" value={selectedText.color || '#000000'} onChange={(e) => setSelectedTextColor(e.target.value)} />
              </label>
              <label className="flex items-center justify-between text-sm text-slate-200">
                <span>Rotation</span>
                <input
                  type="number"
                  className={`${ui.inputSmall} w-24 text-right`}
                  min={0}
                  max={359}
                  step={1}
                  placeholder="0"
                  value={textRotInput}
                  onFocus={() => { if (textRotInput === '0') setTextRotInput('') }}
                  onChange={(e) => {
                    const v = e.target.value
                    setTextRotInput(v)
                    if (v === '') return
                    const n = parseFloat(v)
                    if (!Number.isNaN(n)) setSelectedTextRotation(n)
                  }}
                  onBlur={() => {
                    if (textRotInput === '') { setTextRotInput('0'); setSelectedTextRotation(0) }
                  }}
                />
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="destructive" title="Delete" onClick={deleteSelectedText}><IconTrash width={16} height={16}/></Button>
            </div>
          </div>
        )}
        {selectedWire && (
          <div className="space-y-3">
            <div className="text-xs text-slate-400">Wire Properties</div>
            <div className="space-y-2">
              <label className="flex items-center justify-between text-sm text-slate-200">
                <span>Label</span>
                <input
                  type="text"
                  className={`${ui.inputSmall} w-32`}
                  placeholder="e.g. BL, WWL"
                  value={wireLabel}
                  onChange={(e) => {
                    setWireLabelInput(e.target.value)
                    setWireLabel(selectedWireId!, e.target.value)
                  }}
                />
              </label>
              <label className="flex items-center justify-between text-sm text-slate-200">
                <span>Signal Type</span>
                <select
                  className={`${ui.inputSmall} w-32`}
                  value={selectedWire.signalType || 'custom'}
                  onChange={(e) => setWireSignalType(selectedWireId!, e.target.value as any)}
                >
                  <option value="custom">Custom</option>
                  <option value="power">Power (Red)</option>
                  <option value="ground">Ground (Black)</option>
                  <option value="data">Data (Blue)</option>
                  <option value="clock">Clock (Purple)</option>
                  <option value="control">Control (Amber)</option>
                  <option value="analog">Analog (Green)</option>
                  <option value="digital">Digital (Cyan)</option>
                </select>
              </label>
              <label className="flex items-center justify-between text-sm text-slate-200">
                <span>Thickness</span>
                <input
                  type="number"
                  className={`${ui.inputSmall} w-20 text-right`}
                  min="1"
                  max="10"
                  step="0.5"
                  value={wireThicknessInput}
                  onChange={(e) => {
                    setWireThicknessInput(e.target.value)
                    const thickness = parseFloat(e.target.value)
                    if (!isNaN(thickness)) {
                      setWireThickness(selectedWireId!, thickness)
                    }
                  }}
                />
              </label>
              <label className="flex items-center justify-between text-sm text-slate-200">
                <span>Line Style</span>
                <select
                  className={`${ui.inputSmall} w-32`}
                  value={selectedWire.style || 'solid'}
                  onChange={(e) => setWireLineStyle(selectedWireId!, e.target.value as any)}
                >
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                </select>
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="destructive" title="Delete" onClick={deleteSelectedWire}><IconTrash width={16} height={16}/></Button>
            </div>
          </div>
        )}
        {selectedNode && (
          <div className="space-y-3">
            <div className="text-xs text-slate-400">Node Properties</div>
            <div className="space-y-2">
              <div className="text-sm text-slate-200">
                <div className="font-medium">Connection Node</div>
                <div className="text-xs text-slate-400 mt-1">
                  Position: ({selectedNode.x.toFixed(1)}, {selectedNode.y.toFixed(1)})
                </div>
                <div className="text-xs text-slate-400">
                  Type: {selectedNode.componentId === null ? 'Manual' : 'Component'}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="destructive" title="Delete Node" onClick={deleteSelectedNode}>
                  <IconTrash width={16} height={16}/>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="px-4"><div className={ui.divider}/></div>
      <div className="p-4 space-y-3 overflow-auto">
        <div className="text-xs text-slate-400 flex items-center gap-1"><IconChip width={14} height={14}/> Components</div>
        <div className="space-y-2">
          {components.map((c) => (
            <button key={c.id} onClick={() => selectById(c.id)} className={`${ui.card} cursor-pointer w-full text-left px-3 py-2 ${selectedId===c.id ? 'ring-1 ring-purple-500' : ''}`}>
              <div className="text-sm font-medium text-slate-200">{c.type}</div>
              <div className="text-xs text-slate-400">({c.x}, {c.y}) • rot {c.rotation}°</div>
            </button>
          ))}
          {components.length===0 && <div className="text-xs text-slate-400">No components</div>}
        </div>
      </div>
      <div className="px-4"><div className={ui.divider}/></div>
      <div className="p-4 space-y-3 overflow-auto">
        <div className="text-xs text-slate-400 flex items-center gap-1">📝 Text Elements</div>
        <div className="space-y-2">
          {texts.map((t) => (
            <button key={t.id} onClick={() => selectTextById(t.id)} className={`${ui.card} cursor-pointer w-full text-left px-3 py-2 ${selectedTextId===t.id ? 'ring-1 ring-purple-500' : ''}`}>
              <div className="text-sm font-medium text-slate-200 truncate">{t.text}</div>
              <div className="text-xs text-slate-400">({t.x}, {t.y}) • {t.fontSize || 14}px • {t.fontWeight || 'normal'}</div>
            </button>
          ))}
          {texts.length===0 && <div className="text-xs text-slate-400">No text elements</div>}
        </div>
      </div>
      <div className="px-4"><div className={ui.divider}/></div>
      <div className="p-4 space-y-3 overflow-auto">
        <div className="text-xs text-slate-400 flex items-center gap-1">🔌 Wires</div>
        <div className="space-y-2">
          {wires.map((w) => (
            <button key={w.id} onClick={() => selectWireById(w.id)} className={`${ui.card} cursor-pointer w-full text-left px-3 py-2 ${selectedWireId===w.id ? 'ring-1 ring-purple-500' : ''}`}>
              <div className="text-sm font-medium text-slate-200 truncate flex items-center gap-2">
                <div className="w-4 h-1 rounded-full" style={{ backgroundColor: w.color || '#334155' }}></div>
                {w.label || 'Untitled Wire'}
              </div>
              <div className="text-xs text-slate-400">
                {w.signalType || 'custom'} • {w.points.length} points
              </div>
            </button>
          ))}
          {wires.length===0 && <div className="text-xs text-slate-400">No wires</div>}
        </div>
      </div>
    </aside>
  )
}


