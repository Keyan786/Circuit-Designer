import { useAppStore } from '../store'
import { Button } from './ui/Button'

export default function SelectionTools() {
  const { 
    components, 
    selectedIds, 
    selectAllByType, 
    clearSelection, 
    copySelected, 
    paste,
    clipboard 
  } = useAppStore()

  const componentTypes = Array.from(new Set(components.map(comp => comp.type)))

  const handleSelectByType = (type: string) => {
    selectAllByType(type as any)
  }

  const handleCopy = () => {
    copySelected()
  }

  const handlePaste = () => {
    paste()
  }

  return (
    <div className="flex flex-col gap-2 p-3 bg-slate-800/50 rounded-lg">
      <h3 className="text-sm font-semibold text-white mb-2">Selection Tools</h3>
      
      {/* Multi-selection info */}
      <div className="text-xs text-slate-300 mb-2">
        Selected: {selectedIds.length} components
      </div>

      {/* Select by type */}
      <div className="space-y-1">
        <div className="text-xs text-slate-400">Select by Type:</div>
        <div className="flex flex-wrap gap-1">
          {componentTypes.map(type => (
            <Button
              key={type}
              onClick={() => handleSelectByType(type)}
              className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white"
            >
              All {type}s
            </Button>
          ))}
        </div>
      </div>

      {/* Copy/Paste */}
      <div className="flex gap-2">
        <Button
          onClick={handleCopy}
          disabled={selectedIds.length === 0}
          className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white"
        >
          Copy ({selectedIds.length})
        </Button>
        <Button
          onClick={handlePaste}
          disabled={!clipboard}
          className="text-xs px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white"
        >
          Paste
        </Button>
      </div>

      {/* Clear selection */}
      <Button
        onClick={clearSelection}
        className="text-xs px-3 py-1 bg-slate-600 hover:bg-slate-500 text-white"
      >
        Clear Selection
      </Button>
    </div>
  )
}
