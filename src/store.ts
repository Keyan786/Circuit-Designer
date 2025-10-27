import { create } from 'zustand'
import { nanoid } from 'nanoid'
import { produce } from 'immer'
import type { ComponentType, PlacedComponent, ToolId, Wire, Point, WireStyle, TextElement, WireBundle } from './types'
import { getConnectionNodes } from './utils/connectionPoints'

export interface CircuitTemplate {
  id: string;
  name: string;
  category: 'sram' | 'logic' | 'memory' | 'custom';
  description: string;
  components: PlacedComponent[];
  wires: Wire[];
  texts: TextElement[];
  width: number;
  height: number;
}

export interface AppState {
  tool: ToolId;
  placingType: ComponentType | null;
  components: PlacedComponent[];
  selectedId: string | null;
  selectedWireId: string | null;
  selectedTextId: string | null;
  selectedNodeId: string | null;
  selectedIds: string[];
  selectedWireIds: string[];
  selectedTextIds: string[];
  selectedNodeIds: string[];
  clipboard: { components: PlacedComponent[]; texts: TextElement[]; wires: Wire[] } | null;
  texts: TextElement[];
  wires: Wire[];
  activeWire: Wire | null;
  connectionNodes: Array<{ id: string; x: number; y: number; componentId: string | null; terminalId: string | null }>;
  gridOn: boolean;
  rulerOn: boolean;
  wireStyle: WireStyle;
  wireColor: string;
  textColor: string;
  textSize: number;
  textWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  history: { components: PlacedComponent[]; wires: Wire[]; texts: TextElement[] }[];
  future: { components: PlacedComponent[]; wires: Wire[]; texts: TextElement[] }[];
  templates: CircuitTemplate[];
  customTemplates: CircuitTemplate[];
  wireBundles: WireBundle[];
  projectName: string;
  projectId: string;
  isProjectSaved: boolean;
  autoSave: boolean;
  setTool: (tool: ToolId) => void;
  toggleGrid: () => void;
  toggleRuler: () => void;
  setWireStyle: (style: WireStyle) => void;
  setWireColor: (color: string) => void;
  setSelectedWireColor: (color: string) => void;
  setTextColor: (color: string) => void;
  setTextSize: (size: number) => void;
  setTextWeight: (weight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900') => void;
  startPlacing: (type: ComponentType) => void;
  addComponentAt: (x: number, y: number, rotation?: number) => string | null;
  addTextAt: (x: number, y: number) => void;
  addConnectionNode: (x: number, y: number, id?: string) => string;
  deleteConnectionNode: (nodeId: string) => void;
  moveConnectionNode: (nodeId: string, x: number, y: number) => void;
  moveWireSegment: (wireId: string, pointIndex: number, x: number, y: number) => void;
  divideWireAtPoint: (wireId: string, pointIndex: number, x: number, y: number, componentId?: string) => string;
  beforeAddComponent: (x: number, y: number) => string | null;
  selectById: (id: string | null) => void;
  selectWireById: (id: string | null) => void;
  selectTextById: (id: string | null) => void;
  selectNodeById: (id: string | null) => void;
  // Multi-selection functions
  toggleSelection: (id: string, type: 'component' | 'wire' | 'text' | 'node') => void;
  selectAllByType: (type: ComponentType) => void;
  clearSelection: () => void;
  // Copy/Paste functions
  copySelected: () => void;
  paste: () => void;
  // Undo/Redo functions
  saveHistory: () => void;
  moveSelectedBy: (dx: number, dy: number) => void;
  rotateSelected: () => void;
  setSelectedRotation: (deg: number) => void;
  deleteSelected: () => void;
  deleteSelectedWire: () => void;
  deleteSelectedText: () => void;
  deleteSelectedNode: () => void;
  setSelectedPosition: (x: number, y: number) => void;
  setSelectedScale: (scale: number) => void;
  setSelectedColor: (color: string) => void;
  setSelectedTextContent: (text: string) => void;
  setSelectedTextPosition: (x: number, y: number) => void;
  setSelectedTextRotation: (rotation: number) => void;
  setSelectedTextColor: (color: string) => void;
  setSelectedTextSize: (size: number) => void;
  setSelectedTextWeight: (weight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900') => void;
  // drag operations (without history snapshots)
  setSelectedPositionNoHistory: (x: number, y: number) => void;
  setSelectedTextPositionNoHistory: (x: number, y: number) => void;
  setSelectedRotationNoHistory: (deg: number) => void;
  setSelectedTextRotationNoHistory: (rotation: number) => void;
  setSelectedScaleNoHistory: (scale: number) => void;
  // duplicate operations
  duplicateSelectedComponent: (offsetX?: number, offsetY?: number) => void;
  duplicateSelectedText: (offsetX?: number, offsetY?: number) => void;
  // wiring
  beginWire: (start: Point) => void;
  extendWire: (to: Point) => void;
  addWireVertex: (at: Point) => void;
  popWireVertex: () => void;
  finishWire: () => void;
  cancelWire: () => void;
  undo: () => void;
  redo: () => void;
  // Template functions
  loadTemplate: (templateId: string, x: number, y: number) => void;
  saveAsTemplate: (name: string, category: 'sram' | 'logic' | 'memory' | 'custom', description: string) => void;
  deleteTemplate: (templateId: string) => void;
  // Advanced Wire Management
  setWireLabel: (wireId: string, label: string) => void;
  setWireSignalType: (wireId: string, signalType: 'power' | 'ground' | 'data' | 'clock' | 'control' | 'analog' | 'digital' | 'custom') => void;
  setWireThickness: (wireId: string, thickness: number) => void;
  setWireLineStyle: (wireId: string, style: 'solid' | 'dashed' | 'dotted') => void;
  createWireBundle: (name: string, color: string, wireIds: string[]) => string;
  addWireToBundle: (bundleId: string, wireId: string) => void;
  removeWireFromBundle: (bundleId: string, wireId: string) => void;
  deleteWireBundle: (bundleId: string) => void;
  autoRouteWires: (wireIds: string[]) => void;
  // Project Management
  setProjectName: (name: string) => void;
  saveProject: () => void;
  loadProject: (projectId: string) => void;
  newProject: () => void;
  exportProject: () => void;
  exportProjectAsJSON: () => void;
  exportProjectAsSVG: () => void;
  markProjectAsUnsaved: () => void;
  toggleAutoSave: () => void;
}

function snap(value: number, grid = 10): number {
  return Math.round(value / grid) * grid
}

// Pre-built circuit templates
function createBuiltInTemplates(): CircuitTemplate[] {
  return [
    // 6T SRAM Cell
    {
      id: 'sram-6t',
      name: '6T SRAM Cell',
      category: 'sram',
      description: 'Standard 6-transistor SRAM cell with cross-coupled inverters',
      components: [
        { id: 'p1', type: 'Resistor', x: 50, y: 30, rotation: 0, scale: 1, color: '#000000' },
        { id: 'p2', type: 'Resistor', x: 150, y: 30, rotation: 0, scale: 1, color: '#000000' },
        { id: 'n1', type: 'Resistor', x: 50, y: 80, rotation: 0, scale: 1, color: '#000000' },
        { id: 'n2', type: 'Resistor', x: 150, y: 80, rotation: 0, scale: 1, color: '#000000' },
        { id: 'n3', type: 'Resistor', x: 50, y: 130, rotation: 0, scale: 1, color: '#000000' },
        { id: 'n4', type: 'Resistor', x: 150, y: 130, rotation: 0, scale: 1, color: '#000000' }
      ],
      wires: [],
      texts: [
        { id: 't1', text: 'VDD', x: 100, y: 10, rotation: 0, color: '#000000', fontSize: 12, fontWeight: 'normal' },
        { id: 't2', text: 'GND', x: 100, y: 160, rotation: 0, color: '#000000', fontSize: 12, fontWeight: 'normal' },
        { id: 't3', text: 'BL', x: 30, y: 100, rotation: 0, color: '#000000', fontSize: 12, fontWeight: 'normal' },
        { id: 't4', text: 'BLB', x: 170, y: 100, rotation: 0, color: '#000000', fontSize: 12, fontWeight: 'normal' },
        { id: 't5', text: 'WL', x: 100, y: 180, rotation: 0, color: '#000000', fontSize: 12, fontWeight: 'normal' }
      ],
      width: 200,
      height: 200
    },
    // NAND Gate
    {
      id: 'nand-gate',
      name: 'NAND Gate',
      category: 'logic',
      description: '2-input NAND gate',
      components: [
        { id: 'p1', type: 'Resistor', x: 50, y: 30, rotation: 0, scale: 1, color: '#000000' },
        { id: 'p2', type: 'Resistor', x: 50, y: 60, rotation: 0, scale: 1, color: '#000000' },
        { id: 'n1', type: 'Resistor', x: 50, y: 90, rotation: 0, scale: 1, color: '#000000' },
        { id: 'n2', type: 'Resistor', x: 80, y: 90, rotation: 0, scale: 1, color: '#000000' }
      ],
      wires: [],
      texts: [
        { id: 't1', text: 'A', x: 20, y: 45, rotation: 0, color: '#000000', fontSize: 12, fontWeight: 'normal' },
        { id: 't2', text: 'B', x: 20, y: 75, rotation: 0, color: '#000000', fontSize: 12, fontWeight: 'normal' },
        { id: 't3', text: 'Y', x: 100, y: 60, rotation: 0, color: '#000000', fontSize: 12, fontWeight: 'normal' }
      ],
      width: 120,
      height: 120
    },
    // NOR Gate
    {
      id: 'nor-gate',
      name: 'NOR Gate',
      category: 'logic',
      description: '2-input NOR gate',
      components: [
        { id: 'p1', type: 'Resistor', x: 50, y: 30, rotation: 0, scale: 1, color: '#000000' },
        { id: 'p2', type: 'Resistor', x: 80, y: 30, rotation: 0, scale: 1, color: '#000000' },
        { id: 'n1', type: 'Resistor', x: 50, y: 90, rotation: 0, scale: 1, color: '#000000' },
        { id: 'n2', type: 'Resistor', x: 50, y: 120, rotation: 0, scale: 1, color: '#000000' }
      ],
      wires: [],
      texts: [
        { id: 't1', text: 'A', x: 20, y: 45, rotation: 0, color: '#000000', fontSize: 12, fontWeight: 'normal' },
        { id: 't2', text: 'B', x: 20, y: 105, rotation: 0, color: '#000000', fontSize: 12, fontWeight: 'normal' },
        { id: 't3', text: 'Y', x: 100, y: 60, rotation: 0, color: '#000000', fontSize: 12, fontWeight: 'normal' }
      ],
      width: 120,
      height: 150
    }
  ]
}

// Function to find alignment guides
function findAlignmentGuides(components: PlacedComponent[], currentId: string | null, currentX: number, currentY: number): { x: number[], y: number[] } {
  if (!currentId) return { x: [], y: [] }
  
  const guides = { x: [] as number[], y: [] as number[] }
  const threshold = 5 // Snap threshold in pixels
  
  // Get other components (excluding current one)
  const otherComponents = components.filter(c => c.id !== currentId)
  
  otherComponents.forEach(comp => {
    // Check for horizontal alignment (same Y)
    if (Math.abs(currentY - comp.y) <= threshold) {
      guides.y.push(comp.y)
    }
    
    // Check for vertical alignment (same X)
    if (Math.abs(currentX - comp.x) <= threshold) {
      guides.x.push(comp.x)
    }
  })
  
  return guides
}

export const useAppStore = create<AppState>((set, get) => ({
  tool: 'select',
  placingType: null,
  components: [],
  selectedId: null,
  selectedWireId: null,
  selectedTextId: null,
  selectedNodeId: null,
  selectedIds: [],
  selectedWireIds: [],
  selectedTextIds: [],
  selectedNodeIds: [],
  clipboard: null,
  texts: [],
  wires: [],
  activeWire: null,
  connectionNodes: [],
  gridOn: true,
  rulerOn: false,
  wireStyle: 'elbow',
  wireColor: '#334155',
  textColor: '#000000',
  textSize: 14,
  textWeight: 'normal',
  history: [],
  future: [],
  templates: createBuiltInTemplates(),
  customTemplates: [],
  wireBundles: [],
  projectName: 'Untitled Project',
  projectId: nanoid(8),
  isProjectSaved: false,
  autoSave: true,
  setTool: (tool) => set({ tool }),
  toggleGrid: () => set((s) => ({ gridOn: !s.gridOn })),
  toggleRuler: () => set((s) => ({ rulerOn: !s.rulerOn })),
  setWireStyle: (style) => set({ wireStyle: style }),
  setWireColor: (color) => set({ wireColor: color }),
  setSelectedWireColor: (color) => set((state) => {
    if (!state.selectedWireId) return {}
    const next = state.wires.map((w) => w.id === state.selectedWireId ? { ...w, color } : w)
    return { wires: next, history: [...state.history, { components: state.components, wires: state.wires, texts: state.texts }], future: [] }
  }),
  setTextColor: (color) => set({ textColor: color }),
  setTextSize: (size) => set({ textSize: size }),
  setTextWeight: (weight) => set({ textWeight: weight }),
  startPlacing: (type) => set({ tool: 'place', placingType: type }),
  addComponentAt: (x, y, rotation = 0) => {
    const { placingType, gridOn } = get()
    if (!placingType) return null
    const nx = gridOn ? snap(x) : x
    const ny = gridOn ? snap(y) : y
    const componentId = nanoid(8)
    console.log(`Creating component ${placingType} at (${nx}, ${ny}) with rotation ${rotation}°`)
    set((state) => {
      const next = produce(state.components, (draft) => {
        draft.push({ id: componentId, type: placingType, x: nx, y: ny, rotation: rotation })
      })
      return {
        components: next,
        history: [...state.history, { components: state.components, wires: state.wires, texts: state.texts }],
        future: [],
        placingType: null,
        tool: 'select'
      }
    })
    return componentId
  },
  addTextAt: (x, y) => {
    const { textColor, textSize, textWeight, gridOn } = get()
    const nx = gridOn ? snap(x) : x
    const ny = gridOn ? snap(y) : y
    set((state) => {
      const next = produce(state.texts, (draft) => {
        draft.push({ 
          id: nanoid(8), 
          x: nx, 
          y: ny, 
          text: 'Text', 
          fontSize: textSize, 
          fontWeight: textWeight, 
          color: textColor,
          fontFamily: 'Arial, sans-serif',
          textAlign: 'start',
          rotation: 0
        })
      })
      return {
        texts: next,
        history: [...state.history, { components: state.components, wires: state.wires, texts: state.texts }],
        future: [],
        tool: 'select'
      }
    })
  },
  addConnectionNode: (x, y, id?) => {
    const { gridOn } = get()
    const nx = gridOn ? snap(x) : x
    const ny = gridOn ? snap(y) : y
    const nodeId = id || nanoid(8)
    set((state) => {
      const node = { id: nodeId, x: nx, y: ny, componentId: null, terminalId: nodeId }
      return { 
        connectionNodes: [...state.connectionNodes, node],
        history: [...state.history, { components: state.components, wires: state.wires, texts: state.texts }],
        future: []
      }
    })
    return nodeId
  },
  deleteConnectionNode: (nodeId) => set((state) => {
    // Remove the connection node
    const filteredNodes = state.connectionNodes.filter(node => node.id !== nodeId)
    
    // Remove wires that are connected to this node
    const filteredWires = state.wires.filter(wire => {
      // Check if any wire point is connected to this node
      return !wire.points.some(point => 
        point.componentId === null && point.terminalId === nodeId
      )
    })
    
    return {
      connectionNodes: filteredNodes,
      wires: filteredWires,
      history: [...state.history, { components: state.components, wires: state.wires, texts: state.texts }],
      future: []
    }
  }),
  moveConnectionNode: (nodeId, x, y) => set((state) => {
    // Find the node being moved
    const nodeToMove = state.connectionNodes.find(node => node.id === nodeId)
    if (!nodeToMove) {
      console.log('Node not found for movement:', nodeId)
      return {}
    }
    
    console.log('Moving node in store:')
    console.log(`  Node ID: ${nodeId}`)
    console.log(`  Old Position: (${nodeToMove.x.toFixed(1)}, ${nodeToMove.y.toFixed(1)})`)
    console.log(`  New Position: (${x.toFixed(1)}, ${y.toFixed(1)})`)
    console.log(`  Node Type: ${nodeToMove.componentId === null ? 'manual' : 'component'}`)
    
    // Debug: Check all wire points to see which ones should be updated
    console.log('Checking wire points for updates:')
    state.wires.forEach(wire => {
      console.log(`  Wire ${wire.id}:`)
      wire.points.forEach((point, index) => {
        console.log(`    Point ${index}: (${point.x.toFixed(1)}, ${point.y.toFixed(1)}) - componentId: ${point.componentId}, terminalId: ${point.terminalId}`)
      })
    })
    
    // Update the node position
    const updatedNodes = state.connectionNodes.map(node => 
      node.id === nodeId ? { ...node, x, y } : node
    )
    
    // Update all wire points that are connected to this node
    const updatedWires = state.wires.map(wire => {
      const updatedPoints = wire.points.map(point => {
        // If this point is connected to the moved node by terminalId, update its coordinates
        if (point.componentId === null && point.terminalId === nodeId) {
          console.log(`  Updating wire point by terminalId: ${point.x.toFixed(1)},${point.y.toFixed(1)} -> ${x.toFixed(1)},${y.toFixed(1)}`)
          return { ...point, x, y }
        }
        // If this point has the exact same coordinates as the old node position (for manual nodes)
        // Use stricter tolerance to avoid updating unrelated points
        if (Math.abs(point.x - nodeToMove.x) < 0.1 && Math.abs(point.y - nodeToMove.y) < 0.1 && 
            point.componentId === null) {
          console.log(`  Updating wire point by coordinates: ${point.x.toFixed(1)},${point.y.toFixed(1)} -> ${x.toFixed(1)},${y.toFixed(1)}`)
          return { ...point, x, y }
        }
        // Handle wire points with undefined componentId/terminalId that match the old position
        if (Math.abs(point.x - nodeToMove.x) < 0.1 && Math.abs(point.y - nodeToMove.y) < 0.1 && 
            (point.componentId === undefined || point.componentId === null) && 
            (point.terminalId === undefined || point.terminalId === null)) {
          console.log(`  Updating wire point with undefined values: ${point.x.toFixed(1)},${point.y.toFixed(1)} -> ${x.toFixed(1)},${y.toFixed(1)}`)
          return { ...point, x, y, componentId: null, terminalId: nodeId }
        }
        return point
      })
      return { ...wire, points: updatedPoints }
    })
    
    return {
      connectionNodes: updatedNodes,
      wires: updatedWires,
      history: [...state.history, { components: state.components, wires: state.wires, texts: state.texts }],
      future: []
    }
  }),
  moveWireSegment: (wireId, pointIndex, x, y) => set((state) => {
    console.log('Moving wire segment:', wireId, 'point:', pointIndex, 'to:', x, y)
    
    const updatedWires = state.wires.map(wire => {
      if (wire.id === wireId) {
        const updatedPoints = wire.points.map((point, index) => {
          if (index === pointIndex) {
            return { ...point, x, y }
          }
          return point
        })
        return { ...wire, points: updatedPoints }
      }
      return wire
    })
    
    return {
      wires: updatedWires,
      history: [...state.history, { components: state.components, wires: state.wires, texts: state.texts }],
      future: []
    }
  }),
  divideWireAtPoint: (wireId, pointIndex, x, y, componentId?: string) => {
    let nodeId = nanoid(8) // Declare nodeId outside the set function
    
    set((state) => {
      const wire = state.wires.find(w => w.id === wireId)
      if (!wire || pointIndex < 0 || pointIndex >= wire.points.length - 1) return {}
      
      // Find the component that was just placed
      const component = componentId ? state.components.find(c => c.id === componentId) : 
        state.components.find(c => Math.abs(c.x - x) < 5 && Math.abs(c.y - y) < 5)
      
      if (component) {
        // Get component connection nodes
        const componentNodes = getConnectionNodes(component)
        if (componentNodes.length >= 2) {
          // Get the points before and after the division point
          const pointsBefore = wire.points.slice(0, pointIndex + 1)
          const pointsAfter = wire.points.slice(pointIndex + 1)
          
          // Find the division point coordinates
          const divisionPoint = wire.points[pointIndex]
          const nextPoint = wire.points[pointIndex + 1]
          
          console.log(`Dividing wire ${wireId} at segment ${pointIndex}`)
          console.log(`Division point: (${divisionPoint.x}, ${divisionPoint.y})`)
          console.log(`Next point: (${nextPoint.x}, ${nextPoint.y})`)
          
          // Calculate distances from division point to each component node
          const nodeDistances = componentNodes.map(node => ({
            node,
            distance: Math.sqrt((node.x - divisionPoint.x) ** 2 + (node.y - divisionPoint.y) ** 2)
          }))
          
          // Sort by distance to find the nearest nodes
          nodeDistances.sort((a, b) => a.distance - b.distance)
          
          const nearestNode1 = nodeDistances[0].node
          const nearestNode2 = nodeDistances[1].node
          
          console.log(`Nearest node 1: (${nearestNode1.x}, ${nearestNode1.y}) - distance: ${nodeDistances[0].distance}`)
          console.log(`Nearest node 2: (${nearestNode2.x}, ${nearestNode2.y}) - distance: ${nodeDistances[1].distance}`)
          
          // Determine which node is closer to the start of the wire
          const startPoint = wire.points[0]
          const distanceToStart1 = Math.sqrt((nearestNode1.x - startPoint.x) ** 2 + (nearestNode1.y - startPoint.y) ** 2)
          const distanceToStart2 = Math.sqrt((nearestNode2.x - startPoint.x) ** 2 + (nearestNode2.y - startPoint.y) ** 2)
          
          let startNode, endNode
          if (distanceToStart1 < distanceToStart2) {
            startNode = nearestNode1
            endNode = nearestNode2
          } else {
            startNode = nearestNode2
            endNode = nearestNode1
          }
          
          // Detect wire direction and set component rotation
          // Use the wire segment direction for more accurate detection
          const segmentStart = wire.points[pointIndex]
          const segmentEnd = wire.points[pointIndex + 1]
          const dx = segmentEnd.x - segmentStart.x
          const dy = segmentEnd.y - segmentStart.y
          const angle = Math.atan2(dy, dx) * (180 / Math.PI)
          
          console.log(`Wire segment direction: dx=${dx}, dy=${dy}, angle=${angle}`)
          
          // Determine if wire segment is more vertical or horizontal
          const isVertical = Math.abs(dy) > Math.abs(dx)
          const targetRotation = isVertical ? 90 : 0
          
          console.log(`Wire is ${isVertical ? 'vertical' : 'horizontal'}, setting component rotation to ${targetRotation}°`)
          
          // Update component rotation
          const updatedComponents = state.components.map(c => 
            c.id === component.id 
              ? { ...c, rotation: targetRotation }
              : c
          )
          
          console.log(`Start node: (${startNode.x}, ${startNode.y})`)
          console.log(`End node: (${endNode.x}, ${endNode.y})`)
          
          // Create the first wire: from start to component's nearest start node
          const firstWire = {
            id: nanoid(8),
            points: [...pointsBefore, { x: startNode.x, y: startNode.y, componentId: component.id, terminalId: startNode.terminalId }],
            color: wire.color
          }
          
          // Create the second wire: from component's nearest end node to wire end
          const secondWire = {
            id: nanoid(8),
            points: [{ x: endNode.x, y: endNode.y, componentId: component.id, terminalId: endNode.terminalId }, ...pointsAfter],
            color: wire.color
          }
          
          console.log(`First wire points:`, firstWire.points)
          console.log(`Second wire points:`, secondWire.points)
          
          // Remove original wire and add the two new wires
          const updatedWires = state.wires.filter(w => w.id !== wireId)
          updatedWires.push(firstWire, secondWire)
          
          return {
            components: updatedComponents,
            wires: updatedWires,
            history: [...state.history, { components: state.components, wires: state.wires, texts: state.texts }],
            future: []
          }
        }
      }
      
      // Fallback: create junction node if component not found or doesn't have enough connection nodes
      const junctionNode = {
        id: nodeId,
        x,
        y,
        componentId: null,
        terminalId: nodeId
      }
      
      console.log(`Creating junction node ${nodeId} at (${x}, ${y})`)
      
      // Split the wire into two parts
      const firstWirePoints = wire.points.slice(0, pointIndex + 1)
      const secondWirePoints = wire.points.slice(pointIndex + 1)
      
      console.log(`First wire points:`, firstWirePoints)
      console.log(`Second wire points:`, secondWirePoints)
      
      // Update the first wire to end at the junction
      const updatedFirstWire = {
        ...wire,
        points: [...firstWirePoints, { x, y, componentId: null, terminalId: nodeId }]
      }
      
      // Create the second wire starting from the junction
      const secondWire = {
        id: nanoid(8),
        points: [{ x, y, componentId: null, terminalId: nodeId }, ...secondWirePoints],
        color: wire.color
      }
      
      console.log(`Updated first wire points:`, updatedFirstWire.points)
      console.log(`Second wire points:`, secondWire.points)
      
      // Remove original wire and add the two new wires
      const updatedWires = state.wires.filter(w => w.id !== wireId)
      updatedWires.push(updatedFirstWire, secondWire)
      
      return {
        wires: updatedWires,
        connectionNodes: [...state.connectionNodes, junctionNode],
        history: [...state.history, { components: state.components, wires: state.wires, texts: state.texts }],
        future: []
      }
    })
    return nodeId
  },
  beforeAddComponent: (x: number, y: number) => {
    // This function is called before adding a component to check if it should be connected to a junction node
    const state = get()
    const junctionNode = state.connectionNodes.find(node => 
      Math.abs(node.x - x) < 5 && 
      Math.abs(node.y - y) < 5 &&
      node.componentId === null &&
      node.terminalId === node.id
    )
    return junctionNode ? junctionNode.id : null
  },
  selectById: (id) => set({ 
    selectedId: id, 
    selectedWireId: null, 
    selectedTextId: null,
    selectedIds: id ? [id] : [],
    selectedWireIds: [],
    selectedTextIds: [],
    selectedNodeIds: []
  }),
  selectWireById: (id) => set({ 
    selectedWireId: id, 
    selectedId: null, 
    selectedTextId: null,
    selectedIds: [],
    selectedWireIds: id ? [id] : [],
    selectedTextIds: [],
    selectedNodeIds: []
  }),
  selectTextById: (id) => set({ 
    selectedTextId: id, 
    selectedId: null, 
    selectedWireId: null,
    selectedIds: [],
    selectedWireIds: [],
    selectedTextIds: id ? [id] : [],
    selectedNodeIds: []
  }),
  selectNodeById: (id) => {
    console.log('Store: selectNodeById called with:', id)
    set({ 
      selectedNodeId: id, 
      selectedId: null, 
      selectedWireId: null, 
      selectedTextId: null,
      selectedIds: [],
      selectedWireIds: [],
      selectedTextIds: [],
      selectedNodeIds: id ? [id] : []
    })
    console.log('Store: selectedNodeId set to:', id)
  },
  moveSelectedBy: (dx, dy) => set((state) => {
    // Get all selected component IDs (both single and multi-selection)
    const selectedComponentIds = state.selectedId ? [state.selectedId] : []
    const allSelectedIds = [...selectedComponentIds, ...state.selectedIds]
    
    if (allSelectedIds.length === 0) return {}
    
    const next = produce(state.components, (draft) => {
      allSelectedIds.forEach(id => {
        const c = draft.find((d: PlacedComponent) => d.id === id)
      if (c) {
        c.x += dx
        c.y += dy
        if (state.gridOn) {
          c.x = snap(c.x)
          c.y = snap(c.y)
        }
      }
    })
    })
    
    return { components: next, history: [...state.history, { components: state.components, wires: state.wires, texts: state.texts }], future: [], isProjectSaved: false }
  }),
  rotateSelected: () => set((state) => {
    // Get all selected component IDs (both single and multi-selection)
    const selectedComponentIds = state.selectedId ? [state.selectedId] : []
    const allSelectedIds = [...selectedComponentIds, ...state.selectedIds]
    
    if (allSelectedIds.length === 0) return {}
    
    const next = produce(state.components, (draft) => {
      allSelectedIds.forEach(id => {
        const c = draft.find((d: PlacedComponent) => d.id === id)
      if (c) {
        c.rotation = (Math.round((c.rotation + 90) % 360))
      }
    })
    })
    
    return { components: next, history: [...state.history, { components: state.components, wires: state.wires, texts: state.texts }], future: [], isProjectSaved: false }
  }),
  setSelectedRotation: (deg) => set((state) => {
    // Get all selected component IDs (both single and multi-selection)
    const selectedComponentIds = state.selectedId ? [state.selectedId] : []
    const allSelectedIds = [...selectedComponentIds, ...state.selectedIds]
    
    if (allSelectedIds.length === 0) return {}
    
    const clamped = ((deg % 360) + 360) % 360
    const next = produce(state.components, (draft) => {
      allSelectedIds.forEach(id => {
        const c = draft.find((d: PlacedComponent) => d.id === id)
      if (c) c.rotation = clamped
    })
    })
    
    return { components: next, history: [...state.history, { components: state.components, wires: state.wires, texts: state.texts }], future: [], isProjectSaved: false }
  }),
  deleteSelected: () => set((state) => {
    // Get all selected component IDs (both single and multi-selection)
    const selectedComponentIds = state.selectedId ? [state.selectedId] : []
    const allSelectedIds = [...selectedComponentIds, ...state.selectedIds]
    
    if (allSelectedIds.length === 0) return {}
    
    const next = state.components.filter((c) => !allSelectedIds.includes(c.id))
    return { 
      components: next, 
      selectedId: null, 
      selectedIds: [],
      history: [...state.history, { components: state.components, wires: state.wires, texts: state.texts }], 
      future: [], 
      isProjectSaved: false 
    }
  }),
  deleteSelectedWire: () => set((state) => {
    // Get all selected wire IDs (both single and multi-selection)
    const selectedWireIds = state.selectedWireId ? [state.selectedWireId] : []
    const allSelectedWireIds = [...selectedWireIds, ...state.selectedWireIds]
    
    if (allSelectedWireIds.length === 0) return {}
    
    const next = state.wires.filter((w) => !allSelectedWireIds.includes(w.id))
    return { 
      wires: next, 
      selectedWireId: null, 
      selectedWireIds: [],
      history: [...state.history, { components: state.components, wires: state.wires, texts: state.texts }], 
      future: [], 
      isProjectSaved: false 
    }
  }),
  deleteSelectedText: () => set((state) => {
    // Get all selected text IDs (both single and multi-selection)
    const selectedTextIds = state.selectedTextId ? [state.selectedTextId] : []
    const allSelectedTextIds = [...selectedTextIds, ...state.selectedTextIds]
    
    if (allSelectedTextIds.length === 0) return {}
    
    const next = state.texts.filter((t) => !allSelectedTextIds.includes(t.id))
    return { 
      texts: next, 
      selectedTextId: null, 
      selectedTextIds: [],
      history: [...state.history, { components: state.components, wires: state.wires, texts: state.texts }], 
      future: [], 
      isProjectSaved: false 
    }
  }),
  deleteSelectedNode: () => set((state) => {
    // Get all selected node IDs (both single and multi-selection)
    const selectedNodeIds = state.selectedNodeId ? [state.selectedNodeId] : []
    const allSelectedNodeIds = [...selectedNodeIds, ...state.selectedNodeIds]
    
    if (allSelectedNodeIds.length === 0) return {}
    
    console.log('Deleting selected nodes:', allSelectedNodeIds)
    console.log('Current connection nodes:', state.connectionNodes.length)
    console.log('Current wires:', state.wires.length)
    
    // Use the existing deleteConnectionNode logic to remove the nodes and their adjacent wires
    const filteredNodes = state.connectionNodes.filter(node => !allSelectedNodeIds.includes(node.id))
    
    // Remove wires that are connected to any of these nodes
    const filteredWires = state.wires.filter(wire => {
      const hasConnection = wire.points.some(point => 
        point.componentId === null && point.terminalId && allSelectedNodeIds.includes(point.terminalId)
      )
      if (hasConnection) {
        console.log('Removing wire connected to node:', wire.id)
      }
      return !hasConnection
    })
    
    console.log('After filtering - nodes:', filteredNodes.length, 'wires:', filteredWires.length)
    console.log('Filtered nodes:', filteredNodes.map(n => ({ id: n.id, x: n.x, y: n.y })))
    
    return {
            connectionNodes: filteredNodes,
            wires: filteredWires,
            selectedNodeId: null,
            selectedNodeIds: [],
            history: [...state.history, { components: state.components, wires: state.wires, texts: state.texts }],
            future: [],
            isProjectSaved: false
    }
  }),
  beginWire: (start) => set((s) => ({ activeWire: { id: nanoid(8), points: [start, start], color: s.wireColor } })),
  extendWire: (to) => set((s) => {
    if (!s.activeWire) return {}
    let nx = to.x, ny = to.y
    
    if (s.gridOn) {
      nx = snap(nx)
      ny = snap(ny)
    }
    
    let pts: Point[]
    
    // Handle different wire styles
    if (s.wireStyle === 'straight') {
      // Direct line from anchor to current position
      const anchor = s.activeWire.points[0]
      pts = [anchor, { x: nx, y: ny }]
    } else if (s.wireStyle === 'elbow') {
      // Orthogonal routing (90-degree turns only)
      const anchor = s.activeWire.points[0]
      const dx = Math.abs(nx - anchor.x)
      const dy = Math.abs(ny - anchor.y)
      
      let midX = anchor.x, midY = anchor.y
      let endX = nx, endY = ny
      
      if (s.gridOn) {
        midX = snap(midX)
        midY = snap(midY)
        endX = snap(endX)
        endY = snap(endY)
      }
      
      // Choose the route with the shorter first segment
      if (dx < dy) {
        // Horizontal first, then vertical
        midX = endX
        pts = [anchor, { x: midX, y: midY }, { x: endX, y: endY }]
      } else {
        // Vertical first, then horizontal
        midY = endY
        pts = [anchor, { x: midX, y: midY }, { x: endX, y: endY }]
      }
    } else {
      // polyline - extend from the last vertex, not the anchor
      pts = [...s.activeWire.points.slice(0, -1), { x: nx, y: ny }]
    }
    
    return { activeWire: { ...s.activeWire, points: pts } as Wire }
  }),
  addWireVertex: (at) => set((s) => {
    if (!s.activeWire) return {}
    let vx = at.x, vy = at.y
    if (s.gridOn) { vx = snap(vx); vy = snap(vy) }
    // For polyline, add the vertex and make it the new anchor point
    const pts = [...s.activeWire.points.slice(0, -1), { x: vx, y: vy }, { x: vx, y: vy }]
    return { activeWire: { ...s.activeWire, points: pts } as Wire }
  }),
  popWireVertex: () => set((s) => {
    if (!s.activeWire) return {}
    const n = s.activeWire.points.length
    if (n <= 2) return {}
    const preview = s.activeWire.points[n - 1]
    const pts = [...s.activeWire.points.slice(0, n - 2), preview]
    return { activeWire: { ...s.activeWire, points: pts } as Wire }
  }),
  finishWire: () => set((s) => {
    if (!s.activeWire || s.activeWire.points.length < 2) return { activeWire: null }
    
    // For polyline wires, create individual segments
    if (s.activeWire.points.length > 2) {
      const segments: Wire[] = []
      for (let i = 0; i < s.activeWire.points.length - 1; i++) {
        const segment: Wire = {
          id: `${s.activeWire.id}-segment-${i}`,
          points: [s.activeWire.points[i], s.activeWire.points[i + 1]],
          color: s.activeWire.color,
          label: s.activeWire.label,
          signalType: s.activeWire.signalType,
          bundleId: s.activeWire.bundleId,
          thickness: s.activeWire.thickness,
          style: s.activeWire.style
        }
        segments.push(segment)
      }
            return { 
              wires: [...s.wires, ...segments], 
              activeWire: null, 
              history: [...s.history, { components: s.components, wires: s.wires, texts: s.texts }], 
              future: [],
              isProjectSaved: false
            }
    } else {
      // For simple 2-point wires, keep as single wire
      return { wires: [...s.wires, s.activeWire], activeWire: null, history: [...s.history, { components: s.components, wires: s.wires, texts: s.texts }], future: [], isProjectSaved: false }
    }
  }),
  cancelWire: () => set({ activeWire: null }),
  setSelectedPosition: (x, y) => set((state) => {
    if (!state.selectedId) return {}
    
    // Find alignment guides
    const guides = findAlignmentGuides(state.components, state.selectedId, x, y)
    
    let nx = x
    let ny = y
    
    // Apply alignment snapping first (higher priority)
    if (guides.x.length > 0) {
      nx = guides.x[0] // Snap to the first aligned X position
    } else if (state.gridOn) {
      nx = snap(x) // Fall back to grid snapping
    }
    
    if (guides.y.length > 0) {
      ny = guides.y[0] // Snap to the first aligned Y position
    } else if (state.gridOn) {
      ny = snap(y) // Fall back to grid snapping
    }
    
    const next = produce(state.components, (draft) => {
      const c = draft.find((d: PlacedComponent) => d.id === state.selectedId)
      if (c) {
        c.x = nx
        c.y = ny
      }
    })
    return { components: next, history: [...state.history, { components: state.components, wires: state.wires, texts: state.texts }], future: [] }
  }),
  setSelectedScale: (scale) => set((state) => {
    if (!state.selectedId) return {}
    const next = produce(state.components, (draft) => {
      const c = draft.find((d: PlacedComponent) => d.id === state.selectedId)
      if (c) c.scale = Math.max(0.5, Math.min(3, scale))
    })
    return { components: next, history: [...state.history, { components: state.components, wires: state.wires, texts: state.texts }], future: [] }
  }),
  setSelectedColor: (color) => set((state) => {
    if (!state.selectedId) return {}
    const next = produce(state.components, (draft) => {
      const c = draft.find((d: PlacedComponent) => d.id === state.selectedId)
      if (c) c.color = color
    })
    return { components: next, history: [...state.history, { components: state.components, wires: state.wires, texts: state.texts }], future: [] }
  }),
  setSelectedTextContent: (text) => set((state) => {
    if (!state.selectedTextId) return {}
    const next = produce(state.texts, (draft) => {
      const t = draft.find((d: TextElement) => d.id === state.selectedTextId)
      if (t) t.text = text
    })
    return { texts: next, history: [...state.history, { components: state.components, wires: state.wires, texts: state.texts }], future: [] }
  }),
  setSelectedTextPosition: (x, y) => set((state) => {
    if (!state.selectedTextId) return {}
    const nx = state.gridOn ? snap(x) : x
    const ny = state.gridOn ? snap(y) : y
    const next = produce(state.texts, (draft) => {
      const t = draft.find((d: TextElement) => d.id === state.selectedTextId)
      if (t) {
        t.x = nx
        t.y = ny
      }
    })
    return { texts: next, history: [...state.history, { components: state.components, wires: state.wires, texts: state.texts }], future: [] }
  }),
  setSelectedTextRotation: (rotation) => set((state) => {
    if (!state.selectedTextId) return {}
    const next = produce(state.texts, (draft) => {
      const t = draft.find((d: TextElement) => d.id === state.selectedTextId)
      if (t) t.rotation = rotation
    })
    return { texts: next, history: [...state.history, { components: state.components, wires: state.wires, texts: state.texts }], future: [] }
  }),
  setSelectedTextColor: (color) => set((state) => {
    if (!state.selectedTextId) return {}
    const next = produce(state.texts, (draft) => {
      const t = draft.find((d: TextElement) => d.id === state.selectedTextId)
      if (t) t.color = color
    })
    return { texts: next, history: [...state.history, { components: state.components, wires: state.wires, texts: state.texts }], future: [] }
  }),
  setSelectedTextSize: (size) => set((state) => {
    if (!state.selectedTextId) return {}
    const next = produce(state.texts, (draft) => {
      const t = draft.find((d: TextElement) => d.id === state.selectedTextId)
      if (t) t.fontSize = size
    })
    return { texts: next, history: [...state.history, { components: state.components, wires: state.wires, texts: state.texts }], future: [] }
  }),
  setSelectedTextWeight: (weight) => set((state) => {
    if (!state.selectedTextId) return {}
    const next = produce(state.texts, (draft) => {
      const t = draft.find((d: TextElement) => d.id === state.selectedTextId)
      if (t) t.fontWeight = weight
    })
    return { texts: next, history: [...state.history, { components: state.components, wires: state.wires, texts: state.texts }], future: [] }
  }),
  // drag operations (without history snapshots)
  setSelectedPositionNoHistory: (x, y) => set((state) => {
    if (!state.selectedId) return {}
    
    // Find alignment guides
    const guides = findAlignmentGuides(state.components, state.selectedId, x, y)
    
    let nx = x
    let ny = y
    
    // Apply alignment snapping first (higher priority)
    if (guides.x.length > 0) {
      nx = guides.x[0] // Snap to the first aligned X position
    } else if (state.gridOn) {
      nx = snap(x) // Fall back to grid snapping
    }
    
    if (guides.y.length > 0) {
      ny = guides.y[0] // Snap to the first aligned Y position
    } else if (state.gridOn) {
      ny = snap(y) // Fall back to grid snapping
    }
    
    const next = produce(state.components, (draft) => {
      const c = draft.find((d: PlacedComponent) => d.id === state.selectedId)
      if (c) {
        c.x = nx
        c.y = ny
      }
    })
    return { components: next }
  }),
  setSelectedTextPositionNoHistory: (x, y) => set((state) => {
    if (!state.selectedTextId) return {}
    const nx = state.gridOn ? snap(x) : x
    const ny = state.gridOn ? snap(y) : y
    const next = produce(state.texts, (draft) => {
      const t = draft.find((d: TextElement) => d.id === state.selectedTextId)
      if (t) {
        t.x = nx
        t.y = ny
      }
    })
    return { texts: next }
  }),
  setSelectedRotationNoHistory: (deg) => set((state) => {
    if (!state.selectedId) return {}
    const clamped = ((deg % 360) + 360) % 360
    const next = produce(state.components, (draft) => {
      const c = draft.find((d: PlacedComponent) => d.id === state.selectedId)
      if (c) c.rotation = clamped
    })
    return { components: next }
  }),
  setSelectedTextRotationNoHistory: (rotation) => set((state) => {
    if (!state.selectedTextId) return {}
    const next = produce(state.texts, (draft) => {
      const t = draft.find((d: TextElement) => d.id === state.selectedTextId)
      if (t) t.rotation = rotation
    })
    return { texts: next }
  }),
  setSelectedScaleNoHistory: (scale) => set((state) => {
    if (!state.selectedId) return {}
    const next = produce(state.components, (draft) => {
      const c = draft.find((d: PlacedComponent) => d.id === state.selectedId)
      if (c) c.scale = Math.max(0.5, Math.min(3, scale))
    })
    return { components: next }
  }),
  duplicateSelectedComponent: (offsetX = 40, offsetY = 40) => set((state) => {
    if (!state.selectedId) return {}
    const original = state.components.find(c => c.id === state.selectedId)
    if (!original) return {}
    
    const duplicate: PlacedComponent = {
      ...original,
      id: nanoid(8),
      x: original.x + offsetX,
      y: original.y + offsetY
    }
    
    return { 
      components: [...state.components, duplicate],
      selectedId: duplicate.id,
      history: [...state.history, { components: state.components, wires: state.wires, texts: state.texts }],
      future: []
    }
  }),
  duplicateSelectedText: (offsetX = 40, offsetY = 40) => set((state) => {
    if (!state.selectedTextId) return {}
    const original = state.texts.find(t => t.id === state.selectedTextId)
    if (!original) return {}
    
    const duplicate: TextElement = {
      ...original,
      id: nanoid(8),
      x: original.x + offsetX,
      y: original.y + offsetY
    }
    
    return { 
      texts: [...state.texts, duplicate],
      selectedTextId: duplicate.id,
      history: [...state.history, { components: state.components, wires: state.wires, texts: state.texts }],
      future: []
    }
  }),
  undo: () => set((state) => {
    const prev = state.history[state.history.length - 1]
    if (!prev) return {}
    const newHistory = state.history.slice(0, -1)
    return {
      components: prev.components,
      wires: prev.wires,
      texts: prev.texts,
      history: newHistory,
      future: [{ components: state.components, wires: state.wires, texts: state.texts }, ...state.future],
      selectedId: null,
      selectedWireId: null,
      selectedTextId: null,
      tool: 'select'
    }
  }),
  redo: () => set((state) => {
    const next = state.future[0]
    if (!next) return {}
    return {
      components: next.components,
      wires: next.wires,
      texts: next.texts,
      history: [...state.history, { components: state.components, wires: state.wires, texts: state.texts }],
      future: state.future.slice(1),
      selectedId: null,
      selectedWireId: null,
      selectedTextId: null,
      tool: 'select'
    }
  }),
  // Template functions
  loadTemplate: (templateId, x, y) => {
    const state = get()
    const template = [...state.templates, ...state.customTemplates].find(t => t.id === templateId)
    if (!template) return
    
    // Create new IDs for all components and wires
    const componentIdMap = new Map<string, string>()
    const wireIdMap = new Map<string, string>()
    
    // Generate new IDs for components
    template.components.forEach(comp => {
      const newId = nanoid(8)
      componentIdMap.set(comp.id, newId)
    })
    
    // Generate new IDs for wires
    template.wires.forEach(wire => {
      const newId = nanoid(8)
      wireIdMap.set(wire.id, newId)
    })
    
    // Create new components with updated positions and IDs
    const newComponents = template.components.map(comp => ({
      ...comp,
      id: componentIdMap.get(comp.id)!,
      x: comp.x + x,
      y: comp.y + y
    }))
    
    // Create new wires with updated IDs and positions
    const newWires = template.wires.map(wire => ({
      ...wire,
      id: wireIdMap.get(wire.id)!,
      points: wire.points.map(point => ({
        ...point,
        x: point.x + x,
        y: point.y + y,
        componentId: point.componentId ? componentIdMap.get(point.componentId) : point.componentId
      }))
    }))
    
    // Create new texts with updated positions
    const newTexts = template.texts.map(text => ({
      ...text,
      id: nanoid(8),
      x: text.x + x,
      y: text.y + y
    }))
    
    set((state) => ({
      components: [...state.components, ...newComponents],
      wires: [...state.wires, ...newWires],
      texts: [...state.texts, ...newTexts],
      history: [...state.history, { components: state.components, wires: state.wires, texts: state.texts }],
      future: []
    }))
  },
  saveAsTemplate: (name, category, description) => {
    const state = get()
    if (state.components.length === 0) return
    
    // Calculate bounding box
    const allX = [...state.components.map(c => c.x), ...state.wires.flatMap(w => w.points.map(p => p.x))]
    const allY = [...state.components.map(c => c.y), ...state.wires.flatMap(w => w.points.map(p => p.y))]
    const minX = Math.min(...allX)
    const minY = Math.min(...allY)
    const maxX = Math.max(...allX)
    const maxY = Math.max(...allY)
    
    // Normalize positions to start from (0,0)
    const normalizedComponents = state.components.map(comp => ({
      ...comp,
      x: comp.x - minX,
      y: comp.y - minY
    }))
    
    const normalizedWires = state.wires.map(wire => ({
      ...wire,
      points: wire.points.map(point => ({
        ...point,
        x: point.x - minX,
        y: point.y - minY
      }))
    }))
    
    const normalizedTexts = state.texts.map(text => ({
      ...text,
      x: text.x - minX,
      y: text.y - minY
    }))
    
    const template: CircuitTemplate = {
      id: nanoid(8),
      name,
      category,
      description,
      components: normalizedComponents,
      wires: normalizedWires,
      texts: normalizedTexts,
      width: maxX - minX,
      height: maxY - minY
    }
    
    set((state) => ({
      customTemplates: [...state.customTemplates, template]
    }))
  },
  deleteTemplate: (templateId) => {
    set((state) => ({
      customTemplates: state.customTemplates.filter(t => t.id !== templateId)
    }))
  },
  
  // Advanced Wire Management Implementations
  setWireLabel: (wireId, label) => set((state) => ({
    wires: state.wires.map(w => w.id === wireId ? { ...w, label } : w),
    history: [...state.history, { components: state.components, wires: state.wires, texts: state.texts }],
    future: []
  })),
  
  setWireSignalType: (wireId, signalType) => set((state) => {
    // Auto-assign color based on signal type
    const colorMap = {
      power: '#ef4444', // red
      ground: '#000000', // black
      data: '#3b82f6', // blue
      clock: '#8b5cf6', // purple
      control: '#f59e0b', // amber
      analog: '#10b981', // green
      digital: '#06b6d4', // cyan
      custom: '#6b7280' // gray
    }
    
    return {
      wires: state.wires.map(w => w.id === wireId ? { ...w, signalType, color: colorMap[signalType] } : w),
      history: [...state.history, { components: state.components, wires: state.wires, texts: state.texts }],
      future: []
    }
  }),
  
  setWireThickness: (wireId, thickness) => set((state) => ({
    wires: state.wires.map(w => w.id === wireId ? { ...w, thickness } : w),
    history: [...state.history, { components: state.components, wires: state.wires, texts: state.texts }],
    future: []
  })),
  
  setWireLineStyle: (wireId, style) => set((state) => ({
    wires: state.wires.map(w => w.id === wireId ? { ...w, style } : w),
    history: [...state.history, { components: state.components, wires: state.wires, texts: state.texts }],
    future: []
  })),
  
  createWireBundle: (name, color, wireIds) => {
    const bundleId = nanoid(8)
    set((state) => ({
      wireBundles: [...state.wireBundles, { id: bundleId, name, color, layer: 0, wireIds, label: name }],
      wires: state.wires.map(w => wireIds.includes(w.id) ? { ...w, bundleId, color } : w),
      history: [...state.history, { components: state.components, wires: state.wires, texts: state.texts }],
      future: []
    }))
    return bundleId
  },
  
  addWireToBundle: (bundleId, wireId) => set((state) => {
    const bundle = state.wireBundles.find(b => b.id === bundleId)
    if (!bundle) return {}
    
    return {
      wireBundles: state.wireBundles.map(b => 
        b.id === bundleId ? { ...b, wireIds: [...b.wireIds, wireId] } : b
      ),
      wires: state.wires.map(w => 
        w.id === wireId ? { ...w, bundleId, color: bundle.color } : w
      ),
      history: [...state.history, { components: state.components, wires: state.wires, texts: state.texts }],
      future: []
    }
  }),
  
  removeWireFromBundle: (bundleId, wireId) => set((state) => ({
    wireBundles: state.wireBundles.map(b => 
      b.id === bundleId ? { ...b, wireIds: b.wireIds.filter(id => id !== wireId) } : b
    ),
    wires: state.wires.map(w => 
      w.id === wireId ? { ...w, bundleId: undefined } : w
    ),
    history: [...state.history, { components: state.components, wires: state.wires, texts: state.texts }],
    future: []
  })),
  
  deleteWireBundle: (bundleId) => set((state) => ({
    wireBundles: state.wireBundles.filter(b => b.id !== bundleId),
    wires: state.wires.map(w => 
      w.bundleId === bundleId ? { ...w, bundleId: undefined } : w
    ),
    history: [...state.history, { components: state.components, wires: state.wires, texts: state.texts }],
    future: []
  })),
  
  autoRouteWires: (wireIds) => set((state) => {
    // Simple auto-routing: adjust wires to avoid crossings using Manhattan routing
    const newWires = state.wires.map(wire => {
      if (!wireIds.includes(wire.id)) return wire
      
      // For each wire, create a Manhattan-style routing
      const points = wire.points
      if (points.length < 2) return wire
      
      const start = points[0]
      const end = points[points.length - 1]
      
      // Create a simple L-shaped or Z-shaped route
      const midX = (start.x + end.x) / 2
      
      const newPoints = [
        start,
        { x: midX, y: start.y, componentId: null, terminalId: null },
        { x: midX, y: end.y, componentId: null, terminalId: null },
        end
      ]
      
      return { ...wire, points: newPoints }
    })
    
    return {
      wires: newWires,
      history: [...state.history, { components: state.components, wires: state.wires, texts: state.texts }],
      future: []
    }
  }),
  
  // Project Management Implementations
  setProjectName: (name) => set({ projectName: name, isProjectSaved: false }),
  
  saveProject: () => set((state) => {
    const projectData = {
      id: state.projectId,
      name: state.projectName,
      components: state.components,
      wires: state.wires,
      texts: state.texts,
      connectionNodes: state.connectionNodes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // Save to localStorage
    const savedProjects = JSON.parse(localStorage.getItem('circuitProjects') || '[]')
    const existingIndex = savedProjects.findIndex((p: any) => p.id === state.projectId)
    
    if (existingIndex >= 0) {
      savedProjects[existingIndex] = projectData
    } else {
      savedProjects.push(projectData)
    }
    
    localStorage.setItem('circuitProjects', JSON.stringify(savedProjects))
    console.log('Project saved:', state.projectName)
    
    return { isProjectSaved: true }
  }),
  
  loadProject: (projectId) => set(() => {
    const savedProjects = JSON.parse(localStorage.getItem('circuitProjects') || '[]')
    const project = savedProjects.find((p: any) => p.id === projectId)
    
    if (project) {
      console.log('Loading project:', project.name)
      return {
        projectName: project.name,
        projectId: project.id,
        components: project.components || [],
        wires: project.wires || [],
        texts: project.texts || [],
        connectionNodes: project.connectionNodes || [],
        history: [],
        future: [],
        isProjectSaved: true
      }
    }
    
    return {}
  }),
  
  newProject: () => set(() => {
    console.log('Creating new project')
    return {
      projectName: 'Untitled Project',
      projectId: nanoid(8),
      components: [],
      wires: [],
      texts: [],
      connectionNodes: [],
      selectedId: null,
      selectedWireId: null,
      selectedTextId: null,
      selectedNodeId: null,
      history: [],
      future: [],
      isProjectSaved: false
    }
  }),
  
  exportProject: () => set((state) => {
    // Export as PNG image
    const canvas = document.querySelector('svg') as SVGElement
    if (!canvas) {
      console.error('No SVG canvas found for export')
      return {}
    }

    // Get SVG dimensions
    const svgRect = canvas.getBoundingClientRect()
    const width = svgRect.width
    const height = svgRect.height

    // Create a canvas element for PNG conversion
    const canvasElement = document.createElement('canvas')
    const ctx = canvasElement.getContext('2d')
    if (!ctx) {
      console.error('Could not get canvas context')
      return {}
    }

    // Set canvas dimensions
    canvasElement.width = width
    canvasElement.height = height

    // Set white background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)

    // Convert SVG to image
    const svgData = new XMLSerializer().serializeToString(canvas)
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const svgUrl = URL.createObjectURL(svgBlob)

    const img = new Image()
    img.onload = () => {
      // Draw the image onto the canvas
      ctx.drawImage(img, 0, 0, width, height)
      
      // Convert canvas to PNG and download
      canvasElement.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `${state.projectName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        }
        URL.revokeObjectURL(svgUrl)
      }, 'image/png')
    }
    
    img.onerror = () => {
      console.error('Failed to load SVG for export')
      URL.revokeObjectURL(svgUrl)
    }
    
    img.src = svgUrl
    
    console.log('Project exported as PNG:', state.projectName)
    return {}
  }),
  
  exportProjectAsJSON: () => set((state) => {
    const projectData = {
      name: state.projectName,
      components: state.components,
      wires: state.wires,
      texts: state.texts,
      connectionNodes: state.connectionNodes,
      exportedAt: new Date().toISOString()
    }
    
    // Create and download JSON file
    const dataStr = JSON.stringify(projectData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `${state.projectName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    console.log('Project exported as JSON:', state.projectName)
    return {}
  }),
  
  exportProjectAsSVG: () => set((state) => {
    // Export as SVG file
    const canvas = document.querySelector('svg') as SVGElement
    if (!canvas) {
      console.error('No SVG canvas found for export')
      return {}
    }

    // Get SVG data
    const svgData = new XMLSerializer().serializeToString(canvas)
    
    // Add XML declaration and proper SVG namespace if not present
    let svgContent = svgData
    if (!svgContent.includes('<?xml')) {
      svgContent = '<?xml version="1.0" encoding="UTF-8"?>\n' + svgContent
    }
    
    // Create and download SVG file
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `${state.projectName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.svg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    console.log('Project exported as SVG:', state.projectName)
    return {}
  }),
  
  markProjectAsUnsaved: () => set((state) => {
    const result = { isProjectSaved: false }
    
    // Auto-save if enabled
    if (state.autoSave) {
      setTimeout(() => {
        const currentState = useAppStore.getState()
        currentState.saveProject()
      }, 1000) // Auto-save after 1 second delay
    }
    
    return result
  }),
  
  toggleAutoSave: () => set((state) => ({ autoSave: !state.autoSave })),
  
  // Multi-selection functions
  toggleSelection: (id, type) => set((state) => {
    const newState = { ...state }
    
    switch (type) {
      case 'component':
        if (state.selectedIds.includes(id)) {
          newState.selectedIds = state.selectedIds.filter(selectedId => selectedId !== id)
        } else {
          newState.selectedIds = [...state.selectedIds, id]
        }
        break
      case 'wire':
        if (state.selectedWireIds.includes(id)) {
          newState.selectedWireIds = state.selectedWireIds.filter(selectedId => selectedId !== id)
        } else {
          newState.selectedWireIds = [...state.selectedWireIds, id]
        }
        break
      case 'text':
        if (state.selectedTextIds.includes(id)) {
          newState.selectedTextIds = state.selectedTextIds.filter(selectedId => selectedId !== id)
        } else {
          newState.selectedTextIds = [...state.selectedTextIds, id]
        }
        break
      case 'node':
        if (state.selectedNodeIds.includes(id)) {
          newState.selectedNodeIds = state.selectedNodeIds.filter(selectedId => selectedId !== id)
        } else {
          newState.selectedNodeIds = [...state.selectedNodeIds, id]
        }
        break
    }
    
    return newState
  }),
  
  selectAllByType: (type) => set((state) => {
    const matchingIds = state.components
      .filter(component => component.type === type)
      .map(component => component.id)
    
    return { selectedIds: matchingIds }
  }),
  
  clearSelection: () => set({
    selectedIds: [],
    selectedWireIds: [],
    selectedTextIds: [],
    selectedNodeIds: [],
    selectedId: null,
    selectedWireId: null,
    selectedTextId: null,
    selectedNodeId: null
  }),
  
  // Copy/Paste functions
  copySelected: () => set((state) => {
    const selectedComponents = state.components.filter(comp => 
      state.selectedIds.includes(comp.id)
    )
    const selectedTexts = state.texts.filter(text => 
      state.selectedTextIds.includes(text.id)
    )
    const selectedWires = state.wires.filter(wire => 
      state.selectedWireIds.includes(wire.id)
    )
    
    return {
      clipboard: {
        components: selectedComponents,
        texts: selectedTexts,
        wires: selectedWires
      }
    }
  }),
  
  paste: () => set((state) => {
    if (!state.clipboard) return {}
    
    const offsetX = 20
    const offsetY = 20
    const newComponents: PlacedComponent[] = []
    const newTexts: TextElement[] = []
    const newWires: Wire[] = []
    
    // Create new components with unique IDs and offset positions
    state.clipboard.components.forEach(comp => {
      const newId = nanoid()
      const newComp: PlacedComponent = {
        ...comp,
        id: newId,
        x: comp.x + offsetX,
        y: comp.y + offsetY
      }
      newComponents.push(newComp)
    })
    
    // Create new texts with unique IDs and offset positions
    state.clipboard.texts.forEach(text => {
      const newId = nanoid()
      const newText: TextElement = {
        ...text,
        id: newId,
        x: text.x + offsetX,
        y: text.y + offsetY
      }
      newTexts.push(newText)
    })
    
    // Create new wires with unique IDs
    state.clipboard.wires.forEach(wire => {
      const newId = nanoid()
      const newWire: Wire = {
        ...wire,
        id: newId,
        points: wire.points.map(point => ({
          ...point,
          x: point.x + offsetX,
          y: point.y + offsetY
        }))
      }
      newWires.push(newWire)
    })
    
    return {
      components: [...state.components, ...newComponents],
      texts: [...state.texts, ...newTexts],
      wires: [...state.wires, ...newWires],
      isProjectSaved: false
    }
  }),
  
  // Enhanced undo/redo with saveHistory
  saveHistory: () => set((state) => ({
    history: [...state.history, { 
      components: state.components, 
      wires: state.wires, 
      texts: state.texts 
    }].slice(-50), // Keep only last 50 states
    future: []
  }))
}))


