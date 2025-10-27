import { useRef, useEffect, useState } from 'react'
import { useAppStore } from '../store'
import { SymbolFor } from './symbols'
import { getConnectionNodes, findClosestNode } from '../utils/connectionPoints'
import type { ConnectionNode, PlacedComponent, ComponentType, Wire } from '../types'
// inline actions removed; rotate/delete available from properties panel

const GRID_SIZE = 10

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

// Function to snap rotation to common angles
function snapRotation(angle: number): number {
  const snapAngles = [0, 45, 90, 135, 180, 225, 270, 315, 360]
  const snapThreshold = 15 // degrees
  
  // Normalize angle to 0-360 range
  let normalizedAngle = ((angle % 360) + 360) % 360
  
  // Find the closest snap angle
  let closestAngle = snapAngles[0]
  let minDistance = Math.abs(normalizedAngle - closestAngle)
  
  for (const snapAngle of snapAngles) {
    const distance = Math.abs(normalizedAngle - snapAngle)
    if (distance < minDistance) {
      minDistance = distance
      closestAngle = snapAngle
    }
  }
  
  // Only snap if within threshold
  if (minDistance <= snapThreshold) {
    return closestAngle === 360 ? 0 : closestAngle
  }
  
  return normalizedAngle
}

export default function Canvas() {
  const ref = useRef<HTMLDivElement>(null)
  const { components, selectById, selectedId, selectedIds, selectedWireIds, selectedTextIds, addComponentAt, tool, gridOn, setSelectedPosition, setSelectedScale, setSelectedRotation, beginWire, extendWire, finishWire, activeWire, wires, selectedWireId, selectWireById, addWireVertex, texts, selectedTextId, selectTextById, addTextAt, setSelectedTextPosition, setSelectedTextRotation, setSelectedPositionNoHistory, setSelectedTextPositionNoHistory, setSelectedRotationNoHistory, setSelectedTextRotationNoHistory, setSelectedScaleNoHistory, duplicateSelectedComponent, duplicateSelectedText, startPlacing, wireStyle, connectionNodes: storeConnectionNodes, addConnectionNode, deleteConnectionNode, moveConnectionNode, moveWireSegment, divideWireAtPoint, loadTemplate, selectedNodeId, deleteSelectedNode, toggleSelection, copySelected, paste } = useAppStore()
  const [dragging, setDragging] = useState(false)
  const [textDragging, setTextDragging] = useState(false)
  const [scale, setScale] = useState(1)
  const [inCanvas, setInCanvas] = useState(false)
  const [resizing, setResizing] = useState(false)
  const [rotating, setRotating] = useState(false)
  const [buttonDragging, setButtonDragging] = useState(false)
  const [spaceDown, setSpaceDown] = useState(false)
  const [panning, setPanning] = useState(false)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const panRef = useRef({ x: 0, y: 0 })
  const panStartRef = useRef<{ x: number; y: number } | null>(null)
  const [connectionNodes, setConnectionNodes] = useState<ConnectionNode[]>([])
  const [hoveredNode, setHoveredNode] = useState<ConnectionNode | null>(null)
  const [duplicateDragging, setDuplicateDragging] = useState(false)
  const [duplicateStartPos, setDuplicateStartPos] = useState<{ x: number; y: number } | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [alignmentGuides, setAlignmentGuides] = useState({ x: [] as number[], y: [] as number[] })
  const [altPressed, setAltPressed] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [dragPreview, setDragPreview] = useState<{ type: ComponentType; x: number; y: number } | null>(null)
  const [draggedComponentType, setDraggedComponentType] = useState<ComponentType | null>(null)
  const [selectedConnectionNodeId, setSelectedConnectionNodeId] = useState<string | null>(null)
  const [nodeDragging, setNodeDragging] = useState(false)
  const [angleSnapPreview, setAngleSnapPreview] = useState<{ x: number; y: number } | null>(null)
  const [currentAngle, setCurrentAngle] = useState<number | null>(null)
  const [wireDrawingAngle, setWireDrawingAngle] = useState<number | null>(null)
  const [wireAlignmentGuides, setWireAlignmentGuides] = useState<{ x: number[], y: number[] }>({ x: [], y: [] })
  const [wireDropPreview, setWireDropPreview] = useState<{ x: number; y: number; wireId: string } | null>(null)
  const [hoveredWireId, setHoveredWireId] = useState<string | null>(null)
  const [junctionNodePreview, setJunctionNodePreview] = useState<{ x: number; y: number; wireId: string } | null>(null)
  const [wireSegmentDragging, setWireSegmentDragging] = useState<{ wireId: string; pointIndex: number } | null>(null)

  // Update connection nodes when components and wires change
  useEffect(() => {
    console.log('Canvas useEffect triggered - storeConnectionNodes:', storeConnectionNodes.length)
    console.log('storeConnectionNodes:', storeConnectionNodes.map(n => ({ id: n.id, x: n.x, y: n.y })))
    
    const nodes: ConnectionNode[] = []
    
    // Add component connection nodes
    components.forEach(component => {
      const componentNodes = getConnectionNodes(component)
      nodes.push(...componentNodes)
    })
    
    // Add manual connection nodes first (they take priority)
    storeConnectionNodes.forEach((node) => {
      nodes.push({
        id: node.id,
        x: node.x,
        y: node.y,
        componentId: node.componentId,
        terminalId: node.terminalId
      })
    })
    
    // Create a set of manual node locations for quick lookup
    const manualNodeLocations = new Set(
      storeConnectionNodes.map(node => `${node.x.toFixed(1)},${node.y.toFixed(1)}`)
    )
    
    // Add wire vertex connection nodes for polyline wires (only if no manual node exists)
    wires.forEach(wire => {
      wire.points.forEach((point, index) => {
        // Skip first and last points (they connect to components)
        if (index > 0 && index < wire.points.length - 1) {
          // Check if there's already a manual connection node at this location
          const pointLocation = `${point.x.toFixed(1)},${point.y.toFixed(1)}`
          const hasManualNodeAtLocation = manualNodeLocations.has(pointLocation)
          
          // Also check if this point is connected to a manual node
          const isConnectedToManualNode = point.componentId === null && point.terminalId !== null && 
            storeConnectionNodes.some(n => n.id === point.terminalId)
          
          // Don't create wire vertex nodes if there's already a manual node at this location or if this point is connected to a manual node
          if (!hasManualNodeAtLocation && !isConnectedToManualNode) {
          nodes.push({
            id: `${wire.id}-vertex-${index}`,
            x: point.x,
            y: point.y,
            componentId: wire.id, // Use wire ID as component ID for wire vertices
            terminalId: `vertex-${index}`
          })
          }
        }
      })
    })
    
    console.log('Connection nodes generated:')
    nodes.forEach(n => {
      const isManual = n.componentId === null && !n.terminalId?.startsWith('vertex-')
      const isWireVertex = n.terminalId?.startsWith('vertex-')
      const isComponent = n.componentId !== null && !isWireVertex
      console.log(`  ${n.id}: (${n.x.toFixed(1)}, ${n.y.toFixed(1)}) - ${isManual ? 'manual' : isWireVertex ? 'wire-vertex' : isComponent ? 'component' : 'unknown'} - componentId: ${n.componentId}, terminalId: ${n.terminalId}`)
    })
    
    // Log duplicate nodes at same position
    const positions = new Map()
    nodes.forEach(node => {
      const pos = `${node.x.toFixed(1)},${node.y.toFixed(1)}`
      if (positions.has(pos)) {
        console.log('DUPLICATE NODES AT SAME POSITION:', pos)
        console.log('  Node 1:', positions.get(pos))
        console.log('  Node 2:', node)
      } else {
        positions.set(pos, node)
      }
    })
    
    console.log('Final connection nodes to render:', nodes.length)
    console.log('Final nodes:', nodes.map(n => ({ id: n.id, x: n.x, y: n.y, componentId: n.componentId, terminalId: n.terminalId })))
    
    setConnectionNodes(nodes)
  }, [components, wires, storeConnectionNodes])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const s = useAppStore.getState()
      if (e.key === 'Delete') {
        console.log('Delete key pressed')
        console.log('selectedNodeId:', s.selectedNodeId)
        console.log('selectedConnectionNodeId:', selectedConnectionNodeId)
        console.log('selectedWireId:', s.selectedWireId)
        console.log('selectedTextId:', s.selectedTextId)
        
        if (s.selectedNodeId) {
          console.log('Deleting selected node:', s.selectedNodeId)
          console.log('Current store state before deletion:', {
            selectedNodeId: s.selectedNodeId,
            connectionNodes: s.connectionNodes.length,
            wires: s.wires.length
          })
          deleteSelectedNode()
          setSelectedConnectionNodeId(null)
          console.log('After deleteSelectedNode call')
        } else if (selectedConnectionNodeId) {
          console.log('Deleting connection node:', selectedConnectionNodeId)
          deleteConnectionNode(selectedConnectionNodeId)
          setSelectedConnectionNodeId(null)
        } else if (s.selectedWireId) {
          console.log('Deleting selected wire:', s.selectedWireId)
          s.deleteSelectedWire()
        } else if (s.selectedTextId) {
          console.log('Deleting selected text:', s.selectedTextId)
          s.deleteSelectedText()
        } else {
          console.log('Deleting selected component:', s.selectedId)
          s.deleteSelected()
        }
      }
      if (e.key === 'Escape') s.cancelWire()
      if (e.key === 'Backspace') s.popWireVertex()
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') s.undo()
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') s.redo()
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        e.preventDefault()
        copySelected()
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
        e.preventDefault()
        paste()
      }
      if (e.key.toLowerCase() === 'r') s.rotateSelected()
      if (e.key === 'ArrowLeft') s.moveSelectedBy(-GRID_SIZE, 0)
      if (e.key === 'ArrowRight') s.moveSelectedBy(GRID_SIZE, 0)
      if (e.key === 'ArrowUp') s.moveSelectedBy(0, -GRID_SIZE)
      if (e.key === 'ArrowDown') s.moveSelectedBy(0, GRID_SIZE)
      if (e.code === 'Space') {
        setSpaceDown(true)
        e.preventDefault()
      }
      if (e.key === 'Alt') {
        setAltPressed(true)
      }
      // intercept browser zoom shortcuts while pointer is within canvas
      if (inCanvas && (e.ctrlKey || e.metaKey)) {
        if (e.key === '+' || e.key === '=' ) {
          e.preventDefault()
          setScale((v) => Math.min(4, Number((v * 1.1).toFixed(3))))
        }
        if (e.key === '-' || e.key === '_') {
          e.preventDefault()
          setScale((v) => Math.max(0.25, Number((v / 1.1).toFixed(3))))
        }
        if (e.key === '0') {
          e.preventDefault()
          setScale(1)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') setSpaceDown(false)
      if (e.key === 'Alt') setAltPressed(false)
    }
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [inCanvas])

  function canvasPoint(e: React.MouseEvent) {
    if (!ref.current) {
      console.log('Canvas ref not available')
      return
    }
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - pan.x) / scale
    const y = (e.clientY - rect.top - pan.y) / scale
    console.log('Canvas point calculation:', { x, y, clientX: e.clientX, clientY: e.clientY, rect, pan, scale })
    return { x, y }
  }

  // Function to find alignment guides for wire drawing
  function findWireAlignmentGuides(currentX: number, currentY: number): { x: number[], y: number[] } {
    const guides = { x: [] as number[], y: [] as number[] }
    const threshold = 8 // Snap threshold in pixels
    
    // Check alignment with all connection nodes
    connectionNodes.forEach(node => {
      // Check for horizontal alignment (same Y)
      if (Math.abs(currentY - node.y) <= threshold) {
        guides.y.push(node.y)
      }
      // Check for vertical alignment (same X)
      if (Math.abs(currentX - node.x) <= threshold) {
        guides.x.push(node.x)
      }
    })
    
    // Check alignment with all component connection points
    components.forEach(component => {
      const componentNodes = getConnectionNodes(component)
      componentNodes.forEach(node => {
        // Check for horizontal alignment (same Y)
        if (Math.abs(currentY - node.y) <= threshold) {
          guides.y.push(node.y)
        }
        // Check for vertical alignment (same X)
        if (Math.abs(currentX - node.x) <= threshold) {
          guides.x.push(node.x)
        }
      })
    })
    
    return guides
  }

  // Function to snap point to alignment guides
  function snapToAlignment(targetX: number, targetY: number): { x: number; y: number; snapped: boolean } {
    const guides = findWireAlignmentGuides(targetX, targetY)
    const threshold = 8
    
    let snappedX = targetX
    let snappedY = targetY
    let snapped = false
    
    // Snap to vertical guides (same X coordinate)
    for (const guideX of guides.x) {
      if (Math.abs(targetX - guideX) <= threshold) {
        snappedX = guideX
        snapped = true
        break
      }
    }
    
    // Snap to horizontal guides (same Y coordinate)
    for (const guideY of guides.y) {
      if (Math.abs(targetY - guideY) <= threshold) {
        snappedY = guideY
        snapped = true
        break
      }
    }
    
    return { x: snappedX, y: snappedY, snapped }
  }

  // Function to snap a point to common angles (45°, 90°, etc.) - STRICT MODE
  function snapToAngles(startX: number, startY: number, targetX: number, targetY: number): { x: number; y: number; snappedAngle?: number } {
    const dx = targetX - startX
    const dy = targetY - startY
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance < 10) return { x: targetX, y: targetY, snappedAngle: undefined } // Too close to snap
    
    const angle = Math.atan2(dy, dx) * (180 / Math.PI)
    
    // Snap angles: 0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°
    const snapAngles = [0, 45, 90, 135, 180, 225, 270, 315]
    
    // ALWAYS snap to the closest angle (strict mode)
    let closestAngle = snapAngles[0]
    let minDifference = Math.abs(angle - snapAngles[0])
    
    for (const snapAngle of snapAngles) {
      const diff = Math.abs(angle - snapAngle)
      const normalizedDiff = Math.min(diff, 360 - diff)
      
      if (normalizedDiff < minDifference) {
        minDifference = normalizedDiff
        closestAngle = snapAngle
      }
    }
    
    // Convert snapped angle back to coordinates
    const snappedRadians = closestAngle * (Math.PI / 180)
    const snappedX = startX + distance * Math.cos(snappedRadians)
    const snappedY = startY + distance * Math.sin(snappedRadians)
    
    return { 
      x: snappedX, 
      y: snappedY, 
      snappedAngle: closestAngle 
    }
  }

  // Combined snapping function that applies both angle and alignment snapping
  function snapWirePoint(startX: number, startY: number, targetX: number, targetY: number): { x: number; y: number; snappedAngle?: number; alignmentGuides: { x: number[], y: number[] } } {
    // First apply angle snapping
    const angleResult = snapToAngles(startX, startY, targetX, targetY)
    
    // Then apply alignment snapping to the angle-snapped result
    const alignmentResult = snapToAlignment(angleResult.x, angleResult.y)
    
    // Get alignment guides for visual feedback
    const alignmentGuides = findWireAlignmentGuides(alignmentResult.x, alignmentResult.y)
    
    return {
      x: alignmentResult.x,
      y: alignmentResult.y,
      snappedAngle: angleResult.snappedAngle,
      alignmentGuides
    }
  }

  // Function to find closest point on any wire to a given point
  function findClosestPointOnAnyWire(targetX: number, targetY: number): { x: number; y: number; distance: number; wireId: string } | null {
    let closestPoint: { x: number; y: number; distance: number; wireId: string } | null = null
    let minDistance = Infinity

    wires.forEach(wire => {
      const wireClosestPoint = findClosestPointOnWire(wire, targetX, targetY)
      if (wireClosestPoint && wireClosestPoint.distance < minDistance) {
        minDistance = wireClosestPoint.distance
        closestPoint = { ...wireClosestPoint, wireId: wire.id }
      }
    })

    return closestPoint
  }

  // Function to find closest point on a wire to a given point
  function findClosestPointOnWire(wire: Wire, targetX: number, targetY: number): { x: number; y: number; distance: number } | null {
    let closestPoint: { x: number; y: number; distance: number } | null = null
    let minDistance = Infinity

    // Check each segment of the wire
    for (let i = 0; i < wire.points.length - 1; i++) {
      const p1 = wire.points[i]
      const p2 = wire.points[i + 1]
      
      // Convert to canvas coordinates if they have component/terminal references
      const point1 = p1.componentId && p1.terminalId ? 
        (() => {
          const comp = components.find(c => c.id === p1.componentId)
          if (comp) {
            const node = getConnectionNodes(comp).find(n => n.terminalId === p1.terminalId)
            if (node) return { x: node.x, y: node.y }
          }
          return { x: p1.x, y: p1.y }
        })() : { x: p1.x, y: p1.y }
        
      const point2 = p2.componentId && p2.terminalId ? 
        (() => {
          const comp = components.find(c => c.id === p2.componentId)
          if (comp) {
            const node = getConnectionNodes(comp).find(n => n.terminalId === p2.terminalId)
            if (node) return { x: node.x, y: node.y }
          }
          return { x: p2.x, y: p2.y }
        })() : { x: p2.x, y: p2.y }

      // Find closest point on line segment
      const A = targetX - point1.x
      const B = targetY - point1.y
      const C = point2.x - point1.x
      const D = point2.y - point1.y

      const dot = A * C + B * D
      const lenSq = C * C + D * D
      
      if (lenSq === 0) continue // Skip zero-length segments
      
      let param = dot / lenSq
      param = Math.max(0, Math.min(1, param)) // Clamp to segment
      
      const closestX = point1.x + param * C
      const closestY = point1.y + param * D
      
      const distance = Math.sqrt((targetX - closestX) ** 2 + (targetY - closestY) ** 2)
      
      if (distance < minDistance) {
        minDistance = distance
        closestPoint = { x: closestX, y: closestY, distance }
      }
    }
    
    return closestPoint
  }

  function onCanvasClick(e: React.MouseEvent) {
    console.log('Canvas clicked!', e.target)
    const pt = canvasPoint(e)
    if (!pt) {
      console.log('Point calculation failed')
      return
    }
    console.log('Point calculated:', pt)
    
    const isCtrlClick = e.ctrlKey || e.metaKey
    
    console.log('Current tool:', tool)
    if (tool === 'place') {
      addComponentAt(pt.x, pt.y)
    } else if (tool === 'text') {
      addTextAt(pt.x, pt.y)
    } else if (tool === 'select') {
      // First check if clicking on a connection node
      const threshold = Math.max(10, 20 / Math.max(0.001, scale))
      const closestNode = findClosestNode(connectionNodes, pt.x, pt.y, threshold)
      
      if (closestNode) {
        console.log('Clicked on node:', closestNode)
        console.log('Selecting node with ID:', closestNode.id)
        
        if (isCtrlClick) {
          toggleSelection(closestNode.id, 'node')
        } else {
          selectNodeById(closestNode.id)
          selectById(null)
          selectWireById(null)
          selectTextById(null)
        }
        setSelectedConnectionNodeId(closestNode.id)
        return
      }
      
      // Check if clicking on a component
      const clickedComponent = components.find(comp => {
        const dx = pt.x - comp.x
        const dy = pt.y - comp.y
        return Math.abs(dx) < 20 && Math.abs(dy) < 20
      })
      
      if (clickedComponent) {
        if (isCtrlClick) {
          toggleSelection(clickedComponent.id, 'component')
        } else {
          selectById(clickedComponent.id)
          selectWireById(null)
          selectTextById(null)
          selectNodeById(null)
        }
        return
      }
      
      // Check if clicking on a wire
      const clickedWire = wires.find(wire => {
        const wirePoint = findClosestPointOnWire(wire, pt.x, pt.y)
        return wirePoint && wirePoint.distance < threshold
      })
      
      if (clickedWire) {
        if (isCtrlClick) {
          toggleSelection(clickedWire.id, 'wire')
        } else {
          selectWireById(clickedWire.id)
          selectById(null)
          selectTextById(null)
          selectNodeById(null)
        }
        return
      }
      
      // Check if clicking on text
      const clickedText = texts.find(text => {
        const dx = pt.x - text.x
        const dy = pt.y - text.y
        return Math.abs(dx) < 20 && Math.abs(dy) < 20
      })
      
      if (clickedText) {
        if (isCtrlClick) {
          toggleSelection(clickedText.id, 'text')
        } else {
          selectTextById(clickedText.id)
          selectById(null)
          selectWireById(null)
          selectNodeById(null)
        }
        return
      }
      
      // Clicked on empty canvas space - unselect everything
      console.log('Clicked on empty canvas space, unselecting everything')
      if (!isCtrlClick) {
        selectById(null)
        selectWireById(null)
        selectTextById(null)
        selectNodeById(null)
      }
      setSelectedConnectionNodeId(null)
    } else if (tool === 'addNode') {
      // Check if clicking on a wire to create a junction node
      const threshold = Math.max(10, 20 / Math.max(0.001, scale))
      let clickedWire: Wire | null = null
      let closestWirePoint: { x: number; y: number; distance: number } | null = null
      
      // Check if clicking near any existing wire
      for (const wire of wires) {
        const wirePoint = findClosestPointOnWire(wire, pt.x, pt.y)
        if (wirePoint && wirePoint.distance < threshold) {
          if (!closestWirePoint || wirePoint.distance < closestWirePoint.distance) {
            closestWirePoint = wirePoint
            clickedWire = wire
          }
        }
      }
      
      if (clickedWire && closestWirePoint) {
        console.log('Clicked on wire in addNode tool, creating junction node at:', closestWirePoint)
        
        // Find which segment of the wire was clicked
        let segmentIndex = -1
        let minDistance = Infinity
        
        for (let i = 0; i < clickedWire.points.length - 1; i++) {
          const p1 = clickedWire.points[i]
          const p2 = clickedWire.points[i + 1]
          
          // Calculate distance to line segment
          const A = closestWirePoint.x - p1.x
          const B = closestWirePoint.y - p1.y
          const C = p2.x - p1.x
          const D = p2.y - p1.y
          const dot = A * C + B * D
          const lenSq = C * C + D * D
          
          if (lenSq === 0) continue
          
          let param = dot / lenSq
          param = Math.max(0, Math.min(1, param))
          
          const closestX = p1.x + param * C
          const closestY = p1.y + param * D
          
          const distance = Math.sqrt((closestWirePoint.x - closestX) ** 2 + (closestWirePoint.y - closestY) ** 2)
          
          if (distance < minDistance) {
            minDistance = distance
            segmentIndex = i
          }
        }
        
        if (segmentIndex >= 0) {
          // Apply combined angle and alignment snapping to the division point
          const snappedResult = snapWirePoint(closestWirePoint.x, closestWirePoint.y, closestWirePoint.x, closestWirePoint.y)
          
          // Divide the wire at this segment - this creates the junction node
          divideWireAtPoint(clickedWire.id, segmentIndex, snappedResult.x, snappedResult.y)
          
          console.log(`Junction node created at (${snappedResult.x}, ${snappedResult.y})`)
        }
        return
      } else {
        // Clicked on empty canvas space - unselect everything
        console.log('Clicked on empty canvas space, unselecting everything')
        selectById(null)
        selectWireById(null)
        selectTextById(null)
        setSelectedConnectionNodeId(null)
      }
    } else if (tool === 'wire') {
      console.log('Wire tool active, wireStyle:', wireStyle, 'activeWire:', !!activeWire)
      
      // First check if clicking on an existing wire to create a junction node
      const threshold = Math.max(10, 20 / Math.max(0.001, scale))
      let clickedWire: Wire | null = null
      let closestWirePoint: { x: number; y: number; distance: number } | null = null
      
      // Check if clicking near any existing wire
      for (const wire of wires) {
        const wirePoint = findClosestPointOnWire(wire, pt.x, pt.y)
        if (wirePoint && wirePoint.distance < threshold) {
          if (!closestWirePoint || wirePoint.distance < closestWirePoint.distance) {
            closestWirePoint = wirePoint
            clickedWire = wire
          }
        }
      }
      
      if (clickedWire && closestWirePoint) {
        console.log('Clicked on wire, dividing wire at:', closestWirePoint)
        
        // Find which segment of the wire was clicked
        let segmentIndex = -1
        let minDistance = Infinity
        
        for (let i = 0; i < clickedWire.points.length - 1; i++) {
          const p1 = clickedWire.points[i]
          const p2 = clickedWire.points[i + 1]
          
          // Convert to canvas coordinates
          const point1 = p1.componentId && p1.terminalId ? 
            (() => {
              const comp = components.find(c => c.id === p1.componentId)
              if (comp) {
                const node = getConnectionNodes(comp).find(n => n.terminalId === p1.terminalId)
                if (node) return { x: node.x, y: node.y }
              }
              return { x: p1.x, y: p1.y }
            })() : { x: p1.x, y: p1.y }
            
          const point2 = p2.componentId && p2.terminalId ? 
            (() => {
              const comp = components.find(c => c.id === p2.componentId)
              if (comp) {
                const node = getConnectionNodes(comp).find(n => n.terminalId === p2.terminalId)
                if (node) return { x: node.x, y: node.y }
              }
              return { x: p2.x, y: p2.y }
            })() : { x: p2.x, y: p2.y }

          // Calculate distance to line segment
          const A = closestWirePoint.x - point1.x
          const B = closestWirePoint.y - point1.y
          const C = point2.x - point1.x
          const D = point2.y - point1.y
          const dot = A * C + B * D
          const lenSq = C * C + D * D
          
          if (lenSq === 0) continue
          
          let param = dot / lenSq
          param = Math.max(0, Math.min(1, param))
          
          const closestX = point1.x + param * C
          const closestY = point1.y + param * D
          
          const distance = Math.sqrt((closestWirePoint.x - closestX) ** 2 + (closestWirePoint.y - closestY) ** 2)
          
          if (distance < minDistance) {
            minDistance = distance
            segmentIndex = i
          }
        }
        
        if (segmentIndex >= 0) {
          // Apply combined angle and alignment snapping to the division point
          const snappedResult = snapWirePoint(activeWire ? activeWire.points[activeWire.points.length - 1].x : closestWirePoint.x, 
                                            activeWire ? activeWire.points[activeWire.points.length - 1].y : closestWirePoint.y, 
                                            closestWirePoint.x, closestWirePoint.y)
          
          // Divide the wire at this segment - this creates the junction node and returns its ID
          const junctionNodeId = divideWireAtPoint(clickedWire.id, segmentIndex, snappedResult.x, snappedResult.y)
          
          // Set alignment guides for visual feedback
          setWireAlignmentGuides(snappedResult.alignmentGuides)
          
          if (junctionNodeId) {
            if (!activeWire) {
              // Start a new wire from this junction node
              beginWire({ x: snappedResult.x, y: snappedResult.y, componentId: null, terminalId: junctionNodeId })
            } else {
              // Connect current wire to this junction node
              extendWire({ x: snappedResult.x, y: snappedResult.y, componentId: null, terminalId: junctionNodeId })
              finishWire()
            }
          }
        }
        return
      }
      
      if (wireStyle === 'polyline') {
        // Basic polyline logic - create connection nodes and connect them
        const closestNode = findClosestNode(connectionNodes, pt.x, pt.y, threshold)
        
        if (!activeWire) {
          if (closestNode) {
            // Start wire from existing node (component or manual) - allow multiple connections
            console.log('Starting polyline wire from node:', closestNode)
            beginWire({ x: closestNode.x, y: closestNode.y, componentId: closestNode.componentId, terminalId: closestNode.terminalId })
          } else {
            // Start wire from empty space - create connection node
            console.log('Starting polyline wire from point:', pt)
            const nodeId = addConnectionNode(pt.x, pt.y)
            beginWire({ x: pt.x, y: pt.y, componentId: null, terminalId: nodeId })
          }
        } else {
          if (closestNode) {
            // Connect to existing node (allow multiple connections)
            console.log('Connecting polyline wire to node:', closestNode)
            extendWire({ x: closestNode.x, y: closestNode.y, componentId: closestNode.componentId, terminalId: closestNode.terminalId })
            finishWire()
          } else {
            // Add vertex to polyline wire with angle snapping
            console.log('Adding vertex to polyline wire at:', pt)
            
            // Get the last point of the active wire for angle snapping
            const lastPoint = activeWire.points[activeWire.points.length - 1]
            let lastX = lastPoint.x
            let lastY = lastPoint.y
            
            // If the last point is connected to a component, get its actual position
            if (lastPoint.componentId && lastPoint.terminalId) {
              if (lastPoint.componentId === null) {
                // Manual connection node
                const node = storeConnectionNodes.find(n => n.id === lastPoint.terminalId)
                if (node) {
                  lastX = node.x
                  lastY = node.y
                }
              } else {
                // Component connection node
                const comp = components.find(c => c.id === lastPoint.componentId)
                if (comp) {
                  const node = getConnectionNodes(comp).find(n => n.terminalId === lastPoint.terminalId)
                  if (node) {
                    lastX = node.x
                    lastY = node.y
                  }
                }
              }
            }
            
            // Apply combined angle and alignment snapping
            const snappedResult = snapWirePoint(lastX, lastY, pt.x, pt.y)
            
            // Set alignment guides for visual feedback
            setWireAlignmentGuides(snappedResult.alignmentGuides)
            
            // Create connection node at the snapped point
            const nodeId = addConnectionNode(snappedResult.x, snappedResult.y)
            // First extend the wire to this point
            extendWire({ x: snappedResult.x, y: snappedResult.y, componentId: null, terminalId: nodeId })
            // Then add the vertex
            addWireVertex({ x: snappedResult.x, y: snappedResult.y, componentId: null, terminalId: nodeId })
            console.log('Active wire after adding vertex:', activeWire)
          }
        }
      } else {
        // Original logic for straight and elbow wires
      const threshold = Math.max(10, 20 / Math.max(0.001, scale))
      const closestNode = findClosestNode(connectionNodes, pt.x, pt.y, threshold)
      const wirePoint = closestNode ? { x: closestNode.x, y: closestNode.y, componentId: closestNode.componentId, terminalId: closestNode.terminalId } : pt
      
      if (!activeWire) {
        if (!closestNode) {
          selectById(null)
          selectWireById(null)
          return
        }
        beginWire(wirePoint)
      } else {
        if (closestNode) {
            // Allow multiple connections to the same node
          extendWire({ x: closestNode.x, y: closestNode.y, componentId: closestNode.componentId, terminalId: closestNode.terminalId })
          finishWire()
        } else {
          addWireVertex(wirePoint)
          }
        }
      }
    } else {
      // blank click: deselect components, wires, text, and connection nodes
      console.log('Blank click - unselecting everything')
      selectById(null)
      selectWireById(null)
      selectTextById(null)
      setSelectedConnectionNodeId(null)
    }
  }

  function onMouseMove(e: React.MouseEvent) {
    // Handle wire segment dragging
    if (wireSegmentDragging) {
      const pt = canvasPoint(e)
      if (pt) {
        console.log('Moving wire segment:', wireSegmentDragging.wireId, 'point:', wireSegmentDragging.pointIndex, 'to:', pt.x, pt.y)
        moveWireSegment(wireSegmentDragging.wireId, wireSegmentDragging.pointIndex, pt.x, pt.y)
      }
      return
    }
    
    // Check for wire hover (when not dragging components)
    if ((tool === 'select' || tool === 'addNode') && !dragging && !textDragging) {
      const pt = canvasPoint(e)
      if (pt) {
        const closestPoint = findClosestPointOnAnyWire(pt.x, pt.y)
        console.log(`Normal mouse move - closest wire distance: ${closestPoint?.distance}, threshold: ${15 / scale}`)
        if (closestPoint && closestPoint.distance < 15 / scale) {
          console.log(`Normal hover - setting wire ID: ${closestPoint.wireId}`)
          setHoveredWireId(closestPoint.wireId)
          if (tool === 'addNode') {
            setJunctionNodePreview({ x: closestPoint.x, y: closestPoint.y, wireId: closestPoint.wireId })
          }
        } else {
          console.log('Normal hover - clearing wire ID')
          setHoveredWireId(null)
          setJunctionNodePreview(null)
        }
      }
    }
    const pt = canvasPoint(e)
    if (!pt) return
    
    // Update mouse position for visual feedback
    setMousePos({ x: e.clientX, y: e.clientY })
    
    // Check for duplicate mode activation (only when Alt is pressed)
    if ((dragging || textDragging) && duplicateStartPos && !duplicateDragging && altPressed) {
      const dragDistance = Math.sqrt(
        Math.pow(e.clientX - duplicateStartPos.x, 2) + 
        Math.pow(e.clientY - duplicateStartPos.y, 2)
      )
      
      // If dragged more than 20 pixels, activate duplicate mode
      if (dragDistance > 20) {
        if (selectedId) {
          setDragging(false)
          setDuplicateDragging(true)
          // Create duplicate at original position
          duplicateSelectedComponent()
        } else if (selectedTextId) {
          setTextDragging(false)
          setDuplicateDragging(true)
          // Create duplicate at original position
          duplicateSelectedText()
        }
      }
    }
    
    // Only compute hovered node in wire mode; adjust radius by zoom so hit feels consistent
    if (tool === 'wire') {
      const threshold = Math.max(10, 20 / Math.max(0.001, scale))
      const closestNode = findClosestNode(connectionNodes, pt.x, pt.y, threshold)
      setHoveredNode(closestNode)
      
      // Show alignment guides when cursor aligns with component nodes
      if (closestNode) {
        const guides = { x: [] as number[], y: [] as number[] }
        connectionNodes.forEach(node => {
          if (node.id !== closestNode.id) {
            if (Math.abs(pt.y - node.y) <= 5) {
              guides.y.push(node.y)
            }
            if (Math.abs(pt.x - node.x) <= 5) {
              guides.x.push(node.x)
            }
          }
        })
        setAlignmentGuides(guides)
      } else {
        setAlignmentGuides({ x: [], y: [] })
      }
    } else if (hoveredNode) {
      setHoveredNode(null)
      if (!dragging && !textDragging && !duplicateDragging) {
        setAlignmentGuides({ x: [], y: [] })
      }
    }
    
    if (tool === 'wire') {
      // Snap to connection node if close enough
      let wirePoint = hoveredNode ? { x: hoveredNode.x, y: hoveredNode.y, componentId: hoveredNode.componentId, terminalId: hoveredNode.terminalId } : pt
      
      // Apply angle snapping if we have an active wire and no hovered node
      if (activeWire && !hoveredNode && activeWire.points.length > 0) {
        const lastPoint = activeWire.points[activeWire.points.length - 1]
        let lastX = lastPoint.x
        let lastY = lastPoint.y
        
        // If the last point is connected to a component, get its actual position
        if (lastPoint.componentId && lastPoint.terminalId) {
          if (lastPoint.componentId === null) {
            // Manual connection node
            const node = storeConnectionNodes.find(n => n.id === lastPoint.terminalId)
            if (node) {
              lastX = node.x
              lastY = node.y
            }
          } else {
            // Component connection node
            const comp = components.find(c => c.id === lastPoint.componentId)
            if (comp) {
              const node = getConnectionNodes(comp).find(n => n.terminalId === lastPoint.terminalId)
              if (node) {
                lastX = node.x
                lastY = node.y
              }
            }
          }
        }
        
        // Apply combined angle and alignment snapping
        const snappedResult = snapWirePoint(lastX, lastY, pt.x, pt.y)
        wirePoint = { x: snappedResult.x, y: snappedResult.y, componentId: null, terminalId: null }
        
        // Set the wire drawing angle for continuous display
        if (snappedResult.snappedAngle !== undefined) {
          setWireDrawingAngle(snappedResult.snappedAngle)
        }
        
        // Set alignment guides for visual feedback
        setWireAlignmentGuides(snappedResult.alignmentGuides)
        
        // Always show angle when in wire mode
        setAngleSnapPreview({ x: snappedResult.x, y: snappedResult.y })
        setCurrentAngle(snappedResult.snappedAngle || null)
      }
      
      extendWire(wirePoint)
      return
    } else {
      // Clear angle snap preview and current angle when not in wire tool
      setAngleSnapPreview(null)
      setCurrentAngle(null)
      setWireDrawingAngle(null)
      setWireAlignmentGuides({ x: [], y: [] })
    }
    if (nodeDragging && selectedConnectionNodeId) {
      console.log('Moving node:', selectedConnectionNodeId, 'to position:', pt.x.toFixed(1), pt.y.toFixed(1))
      moveConnectionNode(selectedConnectionNodeId, pt.x, pt.y)
      return
    }
    if (resizing) {
      const comp = components.find((c) => c.id === selectedId)
      if (comp) {
        const dx = pt.x - comp.x
        const dy = pt.y - comp.y
        const f = Math.max(0.5, Math.min(3, Math.max(Math.abs(dx), Math.abs(dy)) / 24))
        setSelectedScaleNoHistory(f) // No history during resize - history will be created in onMouseUp
      }
      return
    }
    if (dragging) {
      // Calculate alignment guides for dragging components
      const guides = findAlignmentGuides(components, selectedId, pt.x, pt.y)
      setAlignmentGuides(guides)
      setSelectedPositionNoHistory(pt.x, pt.y)
    }
    if (textDragging) setSelectedTextPositionNoHistory(pt.x, pt.y)
    if (duplicateDragging) {
      // Calculate alignment guides for duplicate dragging
      const guides = findAlignmentGuides(components, selectedId, pt.x, pt.y)
      setAlignmentGuides(guides)
      // Move the newly created duplicate to the current mouse position
      if (selectedId) setSelectedPositionNoHistory(pt.x, pt.y)
      if (selectedTextId) setSelectedTextPositionNoHistory(pt.x, pt.y)
    }
    if (buttonDragging) {
      if (selectedId) setSelectedPositionNoHistory(pt.x, pt.y)
      if (selectedTextId) setSelectedTextPositionNoHistory(pt.x, pt.y)
    }
    if (rotating) {
      const selected = components.find(c => c.id === selectedId)
      const selectedText = texts.find(t => t.id === selectedTextId)
      if (selected) {
        const dx = pt.x - selected.x
        const dy = pt.y - selected.y
        const angle = Math.atan2(dy, dx) * (180 / Math.PI)
        const snappedAngle = snapRotation(angle)
        setSelectedRotationNoHistory(snappedAngle)
      }
      if (selectedText) {
        const dx = pt.x - selectedText.x
        const dy = pt.y - selectedText.y
        const angle = Math.atan2(dy, dx) * (180 / Math.PI)
        const snappedAngle = snapRotation(angle)
        setSelectedTextRotationNoHistory(snappedAngle)
      }
    }
  }

  function onMouseUp() {
    // Create history snapshots when drag operations end
    if (dragging && selectedId) {
      const comp = components.find(c => c.id === selectedId)
      if (comp) {
        setSelectedPosition(comp.x, comp.y) // This will create a history snapshot
      }
    }
    if (textDragging && selectedTextId) {
      const text = texts.find(t => t.id === selectedTextId)
      if (text) {
        setSelectedTextPosition(text.x, text.y) // This will create a history snapshot
      }
    }
    if (duplicateDragging && selectedId) {
      const comp = components.find(c => c.id === selectedId)
      if (comp) {
        setSelectedPosition(comp.x, comp.y) // This will create a history snapshot
      }
    }
    if (duplicateDragging && selectedTextId) {
      const text = texts.find(t => t.id === selectedTextId)
      if (text) {
        setSelectedTextPosition(text.x, text.y) // This will create a history snapshot
      }
    }
    if (rotating && selectedId) {
      const comp = components.find(c => c.id === selectedId)
      if (comp) {
        setSelectedRotation(comp.rotation) // This will create a history snapshot
      }
    }
    if (rotating && selectedTextId) {
      const text = texts.find(t => t.id === selectedTextId)
      if (text) {
        setSelectedTextRotation(text.rotation || 0) // This will create a history snapshot
      }
    }
    if (buttonDragging && selectedId) {
      const comp = components.find(c => c.id === selectedId)
      if (comp) {
        setSelectedPosition(comp.x, comp.y) // This will create a history snapshot
      }
    }
    if (buttonDragging && selectedTextId) {
      const text = texts.find(t => t.id === selectedTextId)
      if (text) {
        setSelectedTextPosition(text.x, text.y) // This will create a history snapshot
      }
    }
    if (resizing && selectedId) {
      const comp = components.find(c => c.id === selectedId)
      if (comp) {
        setSelectedScale(comp.scale || 1) // This will create a history snapshot
      }
    }
    if (nodeDragging && selectedConnectionNodeId) {
      // Create history snapshot for node movement
      const { history, future, components: currentComponents, wires: currentWires, texts: currentTexts } = useAppStore.getState()
      useAppStore.setState({
        history: [...history, { components: currentComponents, wires: currentWires, texts: currentTexts }],
        future: []
      })
    }
    
    setDragging(false)
    setTextDragging(false)
    setDuplicateDragging(false)
    setDuplicateStartPos(null)
    setAlignmentGuides({ x: [], y: [] })
    setResizing(false)
    setRotating(false)
    setButtonDragging(false)
    setNodeDragging(false)
    setWireSegmentDragging(null)
    setPanning(false)
    panStartRef.current = null
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onWheelNative = (e: WheelEvent) => {
      if (e.ctrlKey) {
        // Zoom functionality
        e.preventDefault()
        
        const rect = el.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top
        
        // Convert mouse position to canvas coordinates before zoom
        const canvasX = (mouseX - pan.x) / scale
        const canvasY = (mouseY - pan.y) / scale
        
        const factor = Math.exp(-e.deltaY / 500)
        setScale((prev) => {
          const next = Math.min(4, Math.max(0.25, prev * factor))
          return Number(next.toFixed(3))
        })
        
        // Adjust pan to keep the point under cursor in the same place
        setPan(() => {
          const newScale = Math.min(4, Math.max(0.25, scale * factor))
          const newX = mouseX - canvasX * newScale
          const newY = mouseY - canvasY * newScale
          return { x: newX, y: newY }
        })
      } else {
        // Pan functionality with scroll
        e.preventDefault()
        setPan((prev) => ({
          x: prev.x - e.deltaX,
          y: prev.y - e.deltaY
        }))
      }
    }
    el.addEventListener('wheel', onWheelNative, { passive: false })
    return () => el.removeEventListener('wheel', onWheelNative as EventListener)
  }, [scale, pan])

  function onSvgMouseDown(e: React.MouseEvent<SVGSVGElement>) {
    if (e.button !== 0) return
    if (spaceDown) {
      e.preventDefault()
      setPanning(true)
      panStartRef.current = { x: e.clientX, y: e.clientY }
      panRef.current = { ...pan }
    }
  }

  function onSvgMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    if (panning && panStartRef.current) {
      const dx = e.clientX - panStartRef.current.x
      const dy = e.clientY - panStartRef.current.y
      const next = { x: panRef.current.x + dx, y: panRef.current.y + dy }
      setPan(next)
      return
    }
    onMouseMove(e)
  }

  // Drag and drop handlers
  function onDragEnter(e: React.DragEvent) {
    e.preventDefault()
    if (e.dataTransfer.types.includes('application/component-type')) {
      const componentType = e.dataTransfer.getData('application/component-type') as ComponentType
      setDraggedComponentType(componentType)
      console.log(`Drag enter: component type set to ${componentType}`)
    }
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(true)
    
    console.log(`onDragOver called, draggedComponentType: ${draggedComponentType}`)
    
    if (draggedComponentType) {
      const pt = canvasPoint(e)
      if (pt) {
        setDragPreview({ type: draggedComponentType, x: pt.x, y: pt.y })
        
        // Check if dragging over a wire
        const closestPoint = findClosestPointOnAnyWire(pt.x, pt.y)
        console.log(`Drag over at (${pt.x}, ${pt.y}), closest wire distance: ${closestPoint?.distance}, threshold: ${20 / scale}`)
        if (closestPoint && closestPoint.distance < 20 / scale) {
          console.log(`Setting hovered wire ID: ${closestPoint.wireId}`)
          setWireDropPreview({ x: closestPoint.x, y: closestPoint.y, wireId: closestPoint.wireId })
          setHoveredWireId(closestPoint.wireId)
        } else {
          console.log('Clearing hovered wire ID')
          setWireDropPreview(null)
          setHoveredWireId(null)
        }
      }
    }
  }

  function onDragLeave(e: React.DragEvent) {
    if (!ref.current?.contains(e.relatedTarget as Node)) {
      setIsDragOver(false)
      setDragPreview(null)
      setWireDropPreview(null)
      setHoveredWireId(null)
      setDraggedComponentType(null)
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(false)
    setDragPreview(null)
    setWireDropPreview(null)
    setHoveredWireId(null)
    
    // Handle both old format and new JSON format from side panels
    let componentType: ComponentType | null = null
    let templateId: string | null = null
    
    // Check for dragged component type (from main sidebar)
    if (draggedComponentType) {
      componentType = draggedComponentType
    }
    // Check for old format
    else if (e.dataTransfer.getData('application/component-type')) {
      componentType = e.dataTransfer.getData('application/component-type') as ComponentType
    }
    // Check for new JSON format from side panels
    else if (e.dataTransfer.getData('application/json')) {
      try {
        const data = JSON.parse(e.dataTransfer.getData('application/json'))
        if (data.type === 'component' && data.componentType) {
          componentType = data.componentType
        } else if (data.type === 'template' && data.id) {
          templateId = data.id
        }
      } catch (error) {
        console.error('Error parsing drag data:', error)
      }
    }
    
    if (componentType) {
      const pt = canvasPoint(e)
      if (pt) {
        // Check if dropping on a wire
        const closestPoint = findClosestPointOnAnyWire(pt.x, pt.y)
        
        if (closestPoint && closestPoint.distance < 20 / scale) {
          // Dropping on a wire - place component and connect through its nodes
          const wire = wires.find(w => w.id === closestPoint.wireId)
          if (wire) {
            // Find the segment index where the component should be inserted
            let segmentIndex = -1
            let minDistance = Infinity
            
            for (let i = 0; i < wire.points.length - 1; i++) {
              const p1 = wire.points[i]
              const p2 = wire.points[i + 1]
              
              // Calculate distance from drop point to this segment
              const closestX = Math.max(p1.x, Math.min(pt.x, p2.x))
              const closestY = Math.max(p1.y, Math.min(pt.y, p2.y))
              const distance = Math.sqrt((pt.x - closestX) ** 2 + (pt.y - closestY) ** 2)
              
              if (distance < minDistance) {
                minDistance = distance
                segmentIndex = i
              }
            }
            
            if (segmentIndex >= 0) {
              // Apply combined angle and alignment snapping to the drop point
              const snappedResult = snapWirePoint(wire.points[segmentIndex].x, wire.points[segmentIndex].y, pt.x, pt.y)
              
              // Detect wire direction first to set proper rotation
              const segmentStart = wire.points[segmentIndex]
              const segmentEnd = wire.points[segmentIndex + 1]
              const dx = segmentEnd.x - segmentStart.x
              const dy = segmentEnd.y - segmentStart.y
              const isVertical = Math.abs(dy) > Math.abs(dx)
              const targetRotation = isVertical ? 90 : 0
              
              console.log(`Wire segment: dx=${dx}, dy=${dy}, isVertical=${isVertical}, targetRotation=${targetRotation}°`)
              console.log(`Segment start: (${segmentStart.x}, ${segmentStart.y})`)
              console.log(`Segment end: (${segmentEnd.x}, ${segmentEnd.y})`)
              
              // Place the component with proper rotation
              startPlacing(componentType)
              const componentId = addComponentAt(snappedResult.x, snappedResult.y, targetRotation)
              
              if (componentId) {
                // Now divide the wire and connect to component's connection nodes
                const junctionNodeId = divideWireAtPoint(wire.id, segmentIndex, snappedResult.x, snappedResult.y, componentId)
                
                console.log(`Component ${componentType} placed at (${snappedResult.x}, ${snappedResult.y}) with rotation ${targetRotation}° and wire divided`)
              }
            }
          }
        } else {
          // Normal drop - not on a wire
          startPlacing(componentType)
          addComponentAt(pt.x, pt.y)
        }
      }
    }
    
    // Handle template drops from side panels
    if (templateId) {
      const pt = canvasPoint(e)
      if (pt) {
        loadTemplate(templateId, pt.x, pt.y)
      }
    }
    
    setDraggedComponentType(null)
  }

  return (
    <div ref={ref} onClick={onCanvasClick} onMouseEnter={() => setInCanvas(true)} onMouseLeave={() => { setInCanvas(false); setCurrentAngle(null); setWireDrawingAngle(null); setWireAlignmentGuides({ x: [], y: [] }); setHoveredWireId(null); setJunctionNodePreview(null) }} onDragEnter={onDragEnter} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop} onMouseMove={onMouseMove} className={`relative h-full w-full overflow-hidden m-3 bg-white border border-gray-200 rounded-xl shadow-lg ${spaceDown ? (panning ? 'cursor-grabbing' : 'cursor-grab') : (duplicateDragging && altPressed) ? 'cursor-copy' : isDragOver ? 'border-blue-400 bg-blue-50' : ''}`}>
      {/* Angle Indicator */}
      {(currentAngle !== null || (tool === 'wire' && wireDrawingAngle !== null)) && (
        <div className="absolute top-4 right-4 bg-slate-800 text-white px-4 py-3 rounded-lg shadow-xl text-base font-mono z-10 pointer-events-none border-2 border-blue-400">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="font-bold">{currentAngle || wireDrawingAngle}°</span>
          </div>
        </div>
      )}
      
      {/* Direction Guide - Show all 8 possible directions when wire tool is active */}
      {tool === 'wire' && (
        <div className="absolute bottom-4 right-4 bg-slate-800 text-white px-3 py-2 rounded-lg shadow-lg text-xs font-mono z-10 pointer-events-none">
          <div className="text-center mb-1 text-blue-300">8 Directions</div>
          <div className="grid grid-cols-4 gap-1 text-center">
            <span className={currentAngle === 225 ? 'text-blue-400 font-bold' : 'text-gray-300'}>225°</span>
            <span className={currentAngle === 180 ? 'text-blue-400 font-bold' : 'text-gray-300'}>180°</span>
            <span className={currentAngle === 135 ? 'text-blue-400 font-bold' : 'text-gray-300'}>135°</span>
            <span className={currentAngle === 90 ? 'text-blue-400 font-bold' : 'text-gray-300'}>90°</span>
            <span className={currentAngle === 270 ? 'text-blue-400 font-bold' : 'text-gray-300'}>270°</span>
            <span className={currentAngle === 0 ? 'text-blue-400 font-bold' : 'text-gray-300'}>0°</span>
            <span className={currentAngle === 315 ? 'text-blue-400 font-bold' : 'text-gray-300'}>315°</span>
            <span className={currentAngle === 45 ? 'text-blue-400 font-bold' : 'text-gray-300'}>45°</span>
          </div>
        </div>
      )}
      
      {gridOn && (
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_1px_1px,#e5edff_1px,transparent_0)] [background-size:10px_10px]" />
      )}
      <svg className="absolute inset-0 h-full w-full" onMouseMove={onSvgMouseMove} onMouseDown={onSvgMouseDown} onMouseUp={onMouseUp}>
         {/* Visual feedback for duplicate mode */}
        {duplicateDragging && altPressed && (
          <g className="pointer-events-none">
            <circle
              cx={mousePos.x - (ref.current?.getBoundingClientRect().left || 0)}
              cy={mousePos.y - (ref.current?.getBoundingClientRect().top || 0)}
              r="12"
              fill="#3a5fff"
              fillOpacity="0.2"
              stroke="#3a5fff"
              strokeWidth="2"
            />
            <text
              x={mousePos.x - (ref.current?.getBoundingClientRect().left || 0)}
              y={mousePos.y - (ref.current?.getBoundingClientRect().top || 0) + 4}
              textAnchor="middle"
              fontSize="14"
              fontWeight="bold"
              fill="#3a5fff"
            >
              +
            </text>
          </g>
        )}
        <g transform={`translate(${pan.x},${pan.y}) scale(${scale})`}>
         {/* Drag preview */}
         {dragPreview && dragPreview.type && (
           <g className="pointer-events-none">
             <g transform={`translate(${dragPreview.x}, ${dragPreview.y})`} opacity="0.6">
               <SymbolFor type={dragPreview.type} />
             </g>
           </g>
         )}
         {/* Alignment guides */}
         {alignmentGuides.x.map((x, index) => (
           <line
             key={`guide-x-${index}`}
             x1={x}
             y1={-10000}
             x2={x}
             y2={10000}
             stroke="#ef4444"
             strokeWidth={1 / scale}
             strokeDasharray={`${2 / scale} ${2 / scale}`}
             opacity="0.8"
             pointerEvents="none"
           />
         ))}
         {alignmentGuides.y.map((y, index) => (
           <line
             key={`guide-y-${index}`}
             x1={-10000}
             y1={y}
             x2={10000}
             y2={y}
             stroke="#ef4444"
             strokeWidth={1 / scale}
             strokeDasharray={`${2 / scale} ${2 / scale}`}
             opacity="0.8"
             pointerEvents="none"
           />
         ))}
          {/* existing wires - resolve terminal-bound points dynamically */}
          {wires.map((w) => {
            const points = w.points.map((p) => {
              if (p.componentId && p.terminalId) {
                // Check if this is a manual connection node (junction node)
                if (p.componentId === null) {
                  const node = storeConnectionNodes.find(n => n.id === p.terminalId)
                  if (node) return { x: node.x, y: node.y }
                } else {
                  // Component connection node
                const comp = components.find(c => c.id === p.componentId)
                if (comp) {
                  const node = getConnectionNodes(comp).find(n => n.terminalId === p.terminalId)
                  if (node) return { x: node.x, y: node.y }
                  }
                }
              }
              return { x: p.x, y: p.y }
            })
            return (
              <g key={w.id}>
                <polyline
                  onClick={(e) => { e.stopPropagation(); selectWireById(w.id) }}
                  points={points.map(p => `${p.x},${p.y}`).join(' ')}
                  fill="none"
                  stroke={w.id === hoveredWireId ? '#ff8c00' : (w.color || (w.id === selectedWireId || selectedWireIds.includes(w.id) ? '#ef4444' : '#334155'))}
                  strokeWidth={w.id === selectedWireId || selectedWireIds.includes(w.id) ? (w.thickness || 2) + 2 : (w.id === hoveredWireId ? (w.thickness || 2) + 1 : (w.thickness || 2))}
                  vectorEffect="non-scaling-stroke"
                  strokeDasharray={w.style === 'dashed' ? '8 4' : w.style === 'dotted' ? '2 4' : undefined}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => {
                    console.log(`Wire ${w.id} mouse enter, current hoveredWireId: ${hoveredWireId}`)
                    setHoveredWireId(w.id)
                  }}
                  onMouseLeave={() => {
                    console.log(`Wire ${w.id} mouse leave`)
                    setHoveredWireId(null)
                  }}
                />
                {/* Wire label */}
                {w.label && points.length >= 2 && (
                  <text
                    x={(points[0].x + points[points.length - 1].x) / 2}
                    y={(points[0].y + points[points.length - 1].y) / 2 - 8}
                    fill={w.color || '#334155'}
                    fontSize="12"
                    fontWeight="500"
                    textAnchor="middle"
                    pointerEvents="none"
                    style={{ userSelect: 'none' }}
                  >
                    {w.label}
                  </text>
                )}
                {w.id === selectedWireId && (
                  <>
                    {/* Selection highlight */}
                    <polyline
                      points={points.map(p => `${p.x},${p.y}`).join(' ')}
                      fill="none"
                      stroke="#3a5fff"
                      strokeWidth="6"
                      strokeOpacity="0.3"
                      vectorEffect="non-scaling-stroke"
                      pointerEvents="none"
                    />
                    {/* Selection dots at wire points */}
                    {points.map((point, index) => (
                      <circle
                        key={index}
                        cx={point.x}
                        cy={point.y}
                        r="4"
                        fill="#3a5fff"
                        vectorEffect="non-scaling-stroke"
                        pointerEvents="none"
                      />
                    ))}
                  </>
                )}
                {/* Show connection nodes for individual wire segments */}
                {points.map((point, index) => {
                  // Show nodes for all points in individual segments
                    return (
                      <g key={`vertex-${index}`}>
                      {/* Connection node for segment endpoints */}
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r="6"
                          fill="none"
                        stroke={w.id === selectedWireId || selectedWireIds.includes(w.id) ? '#ef4444' : '#10b981'}
                        strokeWidth={w.id === selectedWireId || selectedWireIds.includes(w.id) ? 2.5 : 1.5}
                          vectorEffect="non-scaling-stroke"
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log('Clicked on wire segment node:', point)
                          // Select the wire when clicking on a segment node
                          selectWireById(w.id)
                        }}
                        onMouseDown={(e) => {
                          e.stopPropagation()
                          console.log('Starting wire segment drag:', w.id, 'point:', index)
                          setWireSegmentDragging({ wireId: w.id, pointIndex: index })
                        }}
                        />
                        <circle
                          cx={point.x}
                          cy={point.y}
                        r={w.id === selectedWireId ? 4 : 3}
                        fill={w.id === selectedWireId ? '#ef4444' : '#10b981'}
                        style={{ cursor: 'pointer' }}
                      />
                      {/* Small square indicator for individual segments */}
                        <rect
                          x={point.x - 2}
                          y={point.y - 2}
                          width="4"
                          height="4"
                        fill={w.id === selectedWireId ? '#ef4444' : '#10b981'}
                          vectorEffect="non-scaling-stroke"
                        style={{ cursor: 'pointer' }}
                        />
                      </g>
                    )
                })}
              </g>
            )
          })}
          {/* active wire preview - also resolve bound points */}
          {activeWire && (() => {
            const points = activeWire.points.map((p) => {
              if (p.componentId && p.terminalId) {
                // Check if this is a manual connection node (junction node)
                if (p.componentId === null) {
                  const node = storeConnectionNodes.find(n => n.id === p.terminalId)
                  if (node) return { x: node.x, y: node.y }
                } else {
                  // Component connection node
                const comp = components.find(c => c.id === p.componentId)
                if (comp) {
                  const node = getConnectionNodes(comp).find(n => n.terminalId === p.terminalId)
                  if (node) return { x: node.x, y: node.y }
                  }
                }
              }
              return { x: p.x, y: p.y }
            })
            return (
              <>
              <polyline
                points={points.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#3a5fff"
                strokeWidth={2}
                strokeDasharray="4 4"
                vectorEffect="non-scaling-stroke"
              />
                {/* Angle snap preview indicator */}
                {angleSnapPreview && activeWire && activeWire.points.length > 0 && (
                  <>
                    {/* Snap preview circle */}
                    <circle
                      cx={angleSnapPreview.x}
                      cy={angleSnapPreview.y}
                      r={6 / scale}
                      fill="#ff8c00"
                      stroke="white"
                      strokeWidth={2 / scale}
                      vectorEffect="non-scaling-stroke"
                      opacity="0.9"
                    />
                    {/* Guide line from last point to snap point */}
                    <line
                      x1={activeWire.points[activeWire.points.length - 1].x}
                      y1={activeWire.points[activeWire.points.length - 1].y}
                      x2={angleSnapPreview.x}
                      y2={angleSnapPreview.y}
                      stroke="#ff8c00"
                      strokeWidth={3 / scale}
                      strokeDasharray={`${8 / scale},${4 / scale}`}
                      vectorEffect="non-scaling-stroke"
                      opacity="0.8"
                    />
                  </>
                )}
              </>
            )
          })()}
          
          {/* Wire alignment guides */}
          {wireAlignmentGuides.x.map((x, index) => (
            <line
              key={`v-guide-${index}`}
              x1={x}
              y1={0}
              x2={x}
              y2="100%"
              stroke="#ff8c00"
              strokeWidth={1 / scale}
              strokeDasharray={`${4 / scale} ${4 / scale}`}
              opacity={0.7}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {wireAlignmentGuides.y.map((y, index) => (
            <line
              key={`h-guide-${index}`}
              x1={0}
              y1={y}
              x2="100%"
              y2={y}
              stroke="#ff8c00"
              strokeWidth={1 / scale}
              strokeDasharray={`${4 / scale} ${4 / scale}`}
              opacity={0.7}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          
          {/* Wire drop preview */}
          {wireDropPreview && (
            <circle
              cx={wireDropPreview.x}
              cy={wireDropPreview.y}
              r={8 / scale}
              fill="#ff8c00"
              stroke="white"
              strokeWidth={2 / scale}
              vectorEffect="non-scaling-stroke"
              opacity={0.8}
            >
              <animate attributeName="r" values={`${8 / scale};${12 / scale};${8 / scale}`} dur="1s" repeatCount="indefinite" />
            </circle>
          )}
          
          {/* Junction node preview */}
          {junctionNodePreview && (
            <circle
              cx={junctionNodePreview.x}
              cy={junctionNodePreview.y}
              r={6 / scale}
              fill="#3a5fff"
              stroke="white"
              strokeWidth={2 / scale}
              vectorEffect="non-scaling-stroke"
              opacity={0.7}
            >
              <animate attributeName="opacity" values="0.7;1;0.7" dur="1.5s" repeatCount="indefinite" />
            </circle>
          )}
          
          {components.map((c) => (
            <g key={c.id} transform={`translate(${c.x},${c.y}) rotate(${c.rotation})`}>
              {/* Symbol & selection scale with component */}
              <g transform={`scale(${c.scale ?? 1})`}>
                <SymbolFor type={c.type} className={c.id === selectedId || selectedIds.includes(c.id) ? 'text-gray-900' : 'text-gray-800'} color={c.color} />
                {(selectedId === c.id || selectedIds.includes(c.id)) && (
                  <>
                    {/* Main selection box - centered around symbol */}
                    <rect x={-26} y={-12} width={52} height={24} fill="none" stroke="#3a5fff" strokeWidth="2" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" pointerEvents="none">
                      <animate attributeName="stroke-dashoffset" from="0" to="8" dur="1s" repeatCount="indefinite" />
                    </rect>
                    {/* Corner handles - resize functionality */}
                    <circle cx={-26} cy={-12} r="4" fill="white" stroke="#3a5fff" strokeWidth="1.5" vectorEffect="non-scaling-stroke" style={{ cursor: 'nwse-resize' }} onMouseDown={(e) => { e.stopPropagation(); setResizing(true) }} />
                    <circle cx={26} cy={-12} r="4" fill="white" stroke="#3a5fff" strokeWidth="1.5" vectorEffect="non-scaling-stroke" style={{ cursor: 'nesw-resize' }} onMouseDown={(e) => { e.stopPropagation(); setResizing(true) }} />
                    <circle cx={-26} cy={12} r="4" fill="white" stroke="#3a5fff" strokeWidth="1.5" vectorEffect="non-scaling-stroke" style={{ cursor: 'nesw-resize' }} onMouseDown={(e) => { e.stopPropagation(); setResizing(true) }} />
                    <circle cx={26} cy={12} r="4" fill="white" stroke="#3a5fff" strokeWidth="1.5" vectorEffect="non-scaling-stroke" style={{ cursor: 'nwse-resize' }} onMouseDown={(e) => { e.stopPropagation(); setResizing(true) }} />
                    {/* Midpoint handles - top and bottom only */}
                    <circle cx={0} cy={-12} r="4" fill="white" stroke="#3a5fff" strokeWidth="1.5" vectorEffect="non-scaling-stroke" pointerEvents="none" />
                    <circle cx={0} cy={12} r="4" fill="white" stroke="#3a5fff" strokeWidth="1.5" vectorEffect="non-scaling-stroke" pointerEvents="none" />
                  </>
                )}
              </g>
              {/* Drag hit area - outside scaled group, larger area */}
              <rect 
                x={-28 * (c.scale ?? 1)} 
                y={-14 * (c.scale ?? 1)} 
                width={56 * (c.scale ?? 1)} 
                height={28 * (c.scale ?? 1)} 
                className="fill-transparent cursor-move" 
                onClick={(e) => { e.stopPropagation(); selectById(c.id) }} 
                onMouseDown={(e) => { 
                  e.stopPropagation(); 
                  selectById(c.id); 
                  setDuplicateStartPos({ x: e.clientX, y: e.clientY });
                  // Start with regular dragging, will switch to duplicate if user drags far enough
                  setDragging(true);
                }}
              />
              {/* Action buttons below selected component */}
              {selectedId === c.id && (
                <g transform={`translate(0, ${35 * (c.scale ?? 1)})`}>
                  {/* Rotation button */}
                  <g 
                    transform="translate(-20, 0)" 
                    style={{ cursor: 'pointer' }}
                    onMouseDown={(e) => { e.stopPropagation(); setRotating(true) }}
                  >
                    <circle cx="0" cy="0" r="12" fill="#e0e7ff" stroke="#d1d5db" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                    <g transform="scale(0.5) translate(-12, -12)" fill="#4b5563">
                      <path d="m24,12c0,.552-.447,1-1,1s-1-.448-1-1c0-5.514-4.486-10-10-10-3.154,0-6.115,1.51-7.991,4h2.991c.553,0,1,.448,1,1s-.447,1-1,1H3c-1.103,0-2-.897-2-2V2c0-.552.447-1,1-1s1,.448,1,1v2.104C5.256,1.542,8.524,0,12,0c6.617,0,12,5.383,12,12Zm-3,4h-4c-.553,0-1,.448-1,1s.447,1,1,1h2.991c-1.877,2.49-4.837,4-7.991,4-5.514,0-10-4.486-10-10,0-.552-.447-1-1-1s-1,.448-1,1c0,6.617,5.383,12,12,12,3.476,0,6.744-1.542,9-4.104v2.104c0,.552.447,1,1,1s1-.448,1-1v-4c0-1.103-.897-2-2-2Z"/>
                    </g>
                  </g>
                  {/* Move button */}
                  <g 
                    transform="translate(20, 0)" 
                    style={{ cursor: 'move' }}
                    onMouseDown={(e) => { e.stopPropagation(); setButtonDragging(true) }}
                  >
                    <circle cx="0" cy="0" r="12" fill="white" stroke="#d1d5db" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                    <g transform="scale(0.5) translate(-12, -12)" fill="#4b5563">
                      <path d="M23.351,10.253c-.233-.263-.462-.513-.619-.67L20.487,7.3a1,1,0,0,0-1.426,1.4l2.251,2.29L21.32,11H13V2.745l2.233,2.194a1,1,0,0,0,1.4-1.426l-2.279-2.24c-.163-.163-.413-.391-.674-.623A2.575,2.575,0,0,0,12.028.006.28.28,0,0,0,12,0l-.011,0a2.584,2.584,0,0,0-1.736.647c-.263.233-.513.462-.67.619L7.3,3.513A1,1,0,1,0,8.7,4.939l2.29-2.251L11,2.68V11H2.68l.015-.015L4.939,8.7A1,1,0,1,0,3.513,7.3L1.274,9.577c-.163.163-.392.413-.624.675A2.581,2.581,0,0,0,0,11.989L0,12c0,.01.005.019.006.029A2.573,2.573,0,0,0,.65,13.682c.233.262.461.512.618.67l2.245,2.284a1,1,0,0,0,1.426-1.4L2.744,13H11v8.32l-.015-.014L8.7,19.062a1,1,0,1,0-1.4,1.425l2.278,2.239c.163.163.413.391.675.624a2.587,2.587,0,0,0,3.43,0c.262-.233.511-.46.669-.619l2.284-2.244a1,1,0,1,0-1.4-1.425L13,21.256V13h8.256l-2.2,2.233a1,1,0,1,0,1.426,1.4l2.239-2.279c.163-.163.391-.413.624-.675A2.589,2.589,0,0,0,23.351,10.253Z"/>
                    </g>
                  </g>
                </g>
              )}
            </g>
          ))}
          {/* Connection nodes - render wire vertices first, then manual nodes on top */}
          {connectionNodes
            .sort((a, b) => {
              const aIsManual = a.componentId === null && !a.terminalId?.startsWith('vertex-')
              const bIsManual = b.componentId === null && !b.terminalId?.startsWith('vertex-')
              // Manual nodes should be rendered last (on top)
              return aIsManual === bIsManual ? 0 : aIsManual ? 1 : -1
            })
            .map((node) => {
            const isHovered = tool === 'wire' && hoveredNode?.id === node.id
            const isSelectedStart = tool === 'wire' && activeWire && activeWire.points.length > 0 && activeWire.points[0].componentId === node.componentId && activeWire.points[0].terminalId === node.terminalId
            const isWireVertex = node.terminalId?.startsWith('vertex-') || false
            const isManualNode = node.componentId === null && !isWireVertex
            const isSelected = selectedConnectionNodeId === node.id || selectedNodeId === node.id
            
            // Debug junction node rendering
            if (isManualNode) {
              console.log(`Rendering junction node ${node.id}:`, {
                x: node.x,
                y: node.y,
                componentId: node.componentId,
                terminalId: node.terminalId,
                isSelected,
                isHovered,
                isSelectedStart
              })
            }
            
            return (
              <g 
                key={node.id} 
                transform={`translate(${node.x},${node.y})`} 
                style={{ cursor: tool === 'wire' ? 'crosshair' : (isManualNode ? 'move' : (isWireVertex ? 'default' : 'pointer')) }} 
                pointerEvents="auto"
                onClick={(e) => {
                  if (isManualNode) {
                    e.stopPropagation()
                    if (tool === 'wire') {
                      // If wire tool is active, treat this as a wire connection
                      if (!activeWire) {
                        // Start wire from this node
                        beginWire({ x: node.x, y: node.y, componentId: node.componentId, terminalId: node.terminalId })
                      } else {
                        // Connect wire to this node
                        extendWire({ x: node.x, y: node.y, componentId: node.componentId, terminalId: node.terminalId })
                        finishWire()
                      }
                    } else {
                      // If not wire tool, select the node
                      console.log('Selecting manual node:', node.id)
                      selectNodeById(node.id)
                      setSelectedConnectionNodeId(node.id)
                      console.log('Node selected, selectedNodeId should be:', node.id)
                    }
                  }
                }}
                onMouseDown={(e) => {
                  console.log('Node clicked:')
                  console.log(`  ID: ${node.id}`)
                  console.log(`  Position: (${node.x.toFixed(1)}, ${node.y.toFixed(1)})`)
                  console.log(`  Type: ${isManualNode ? 'manual' : isWireVertex ? 'wire-vertex' : 'component'}`)
                  console.log(`  Tool: ${tool}`)
                  
                  if (isManualNode && tool !== 'wire') {
                    e.stopPropagation()
                    console.log('Selecting manual node for dragging:', node.id)
                    setSelectedConnectionNodeId(node.id)
                    setNodeDragging(true)
                  } else if (isWireVertex) {
                    // Prevent wire vertex nodes from being selected for dragging
                    e.stopPropagation()
                    console.log('Wire vertex node clicked - preventing selection:', node.id)
                  }
                }}
                onContextMenu={(e) => {
                  if (isManualNode) {
                    e.preventDefault()
                    e.stopPropagation()
                    deleteConnectionNode(node.id)
                  }
                }}
              >
                {isManualNode ? (
                  // Manual connection node - green circle with square overlay (like wire vertices)
                  <>
                    {/* outer ring (non-scaling stroke for clarity) */}
                    <circle 
                      r={6} 
                      fill="none" 
                      stroke={isSelected || isHovered || isSelectedStart ? '#3a5fff' : (tool === 'wire' ? '#f59e0b' : '#10b981')} 
                      strokeWidth={isSelected ? 3 : isSelectedStart ? 2.5 : (tool === 'wire' ? 2 : 1.5)} 
                      vectorEffect="non-scaling-stroke" 
                    />
                    {/* inner dot */}
                    <circle 
                      r={isSelected ? 4 : isSelectedStart ? 3.5 : isHovered ? 3 : 2} 
                      fill={isSelected || isHovered || isSelectedStart ? '#3a5fff' : (tool === 'wire' ? '#f59e0b' : '#10b981')} 
                    />
                    {/* Add a small square overlay to distinguish from component nodes */}
                    <rect 
                      x={-2} 
                      y={-2} 
                      width={4} 
                      height={4} 
                      fill="white" 
                      stroke={isSelected || isHovered || isSelectedStart ? '#3a5fff' : (tool === 'wire' ? '#f59e0b' : '#10b981')} 
                      strokeWidth={0.5}
                      vectorEffect="non-scaling-stroke"
                    />
                  </>
                ) : (
                  // Component connection node - circle
                  <>
                {/* outer ring (non-scaling stroke for clarity) */}
                <circle 
                  r={6} 
                  fill="none" 
                  stroke={isHovered || isSelectedStart ? '#3a5fff' : (isWireVertex ? '#10b981' : '#94a3b8')} 
                  strokeWidth={isSelectedStart ? 2.5 : 1.5} 
                  vectorEffect="non-scaling-stroke" 
                />
                {/* inner dot */}
                <circle 
                  r={isSelectedStart ? 3.5 : isHovered ? 3 : 2} 
                  fill={isHovered || isSelectedStart ? '#3a5fff' : (isWireVertex ? '#10b981' : '#64748b')} 
                />
                {/* Add a small square for wire vertices to distinguish them */}
                {isWireVertex && (
                  <rect 
                    x={-2} 
                    y={-2} 
                    width={4} 
                    height={4} 
                    fill="white" 
                    stroke={isHovered || isSelectedStart ? '#3a5fff' : '#10b981'} 
                    strokeWidth={0.5}
                    vectorEffect="non-scaling-stroke"
                  />
                    )}
                  </>
                )}
              </g>
            )
          })}
          {/* Text elements */}
          {texts.map((text) => (
            <g key={text.id} transform={`translate(${text.x},${text.y}) rotate(${text.rotation || 0})`}>
              <text
                x={0}
                y={(text.fontSize || 14) * 0.35}
                fontSize={text.fontSize || 14}
                fontWeight={text.fontWeight || 'normal'}
                fill={text.color || '#000000'}
                fontFamily={text.fontFamily || 'Arial, sans-serif'}
                textAnchor={text.textAlign === 'middle' ? 'middle' : text.textAlign === 'end' ? 'end' : 'start'}
                dominantBaseline="middle"
                className="cursor-pointer select-none"
                onClick={(e) => { e.stopPropagation(); selectTextById(text.id) }}
                onMouseDown={(e) => { 
                  e.stopPropagation(); 
                  selectTextById(text.id); 
                  setDuplicateStartPos({ x: e.clientX, y: e.clientY });
                  // Start with regular dragging, will switch to duplicate if user drags far enough
                  setTextDragging(true);
                }}
                style={{ userSelect: 'none' }}
              >
                {text.text}
              </text>
              {(selectedTextId === text.id || selectedTextIds.includes(text.id)) && (() => {
                const fontSize = text.fontSize || 14
                const textWidth = text.text.length * fontSize * 0.6
                const textHeight = fontSize
                const padding = 6
                const boxWidth = textWidth + padding * 2
                const boxHeight = textHeight + padding * 2
                
                // Calculate box position based on text alignment
                let boxX = 0
                if (text.textAlign === 'middle') {
                  boxX = -boxWidth / 2
                } else if (text.textAlign === 'end') {
                  boxX = -boxWidth
                } else {
                  boxX = -padding
                }
                
                return (
                  <>
                    {/* Main text selection box - properly positioned around text */}
                    <rect
                      x={boxX}
                      y={-boxHeight / 2}
                      width={boxWidth}
                      height={boxHeight}
                      fill="none"
                      stroke="#3a5fff"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      vectorEffect="non-scaling-stroke"
                      pointerEvents="none"
                    >
                      <animate attributeName="stroke-dashoffset" from="0" to="8" dur="1s" repeatCount="indefinite" />
                    </rect>
                    {/* Corner handles - resize functionality */}
                    <circle cx={boxX} cy={-boxHeight / 2} r="4" fill="white" stroke="#3a5fff" strokeWidth="2" vectorEffect="non-scaling-stroke" style={{ cursor: 'nwse-resize' }} onMouseDown={(e) => { e.stopPropagation(); setResizing(true) }} />
                    <circle cx={boxX + boxWidth} cy={-boxHeight / 2} r="4" fill="white" stroke="#3a5fff" strokeWidth="2" vectorEffect="non-scaling-stroke" style={{ cursor: 'nesw-resize' }} onMouseDown={(e) => { e.stopPropagation(); setResizing(true) }} />
                    <circle cx={boxX} cy={boxHeight / 2} r="4" fill="white" stroke="#3a5fff" strokeWidth="2" vectorEffect="non-scaling-stroke" style={{ cursor: 'nesw-resize' }} onMouseDown={(e) => { e.stopPropagation(); setResizing(true) }} />
                    <circle cx={boxX + boxWidth} cy={boxHeight / 2} r="4" fill="white" stroke="#3a5fff" strokeWidth="2" vectorEffect="non-scaling-stroke" style={{ cursor: 'nwse-resize' }} onMouseDown={(e) => { e.stopPropagation(); setResizing(true) }} />
                    {/* Midpoint handles - top and bottom only */}
                    <circle cx={boxX + boxWidth / 2} cy={-boxHeight / 2} r="4" fill="white" stroke="#3a5fff" strokeWidth="2" vectorEffect="non-scaling-stroke" pointerEvents="none" />
                    <circle cx={boxX + boxWidth / 2} cy={boxHeight / 2} r="4" fill="white" stroke="#3a5fff" strokeWidth="2" vectorEffect="non-scaling-stroke" pointerEvents="none" />
                  </>
                )
              })()}
              {/* Action buttons below selected text */}
              {(selectedTextId === text.id || selectedTextIds.includes(text.id)) && (() => {
                const fontSize = text.fontSize || 14
                const textHeight = fontSize
                const padding = 6
                const boxHeight = textHeight + padding * 2
                
                return (
                  <g transform={`translate(0, ${boxHeight / 2 + 35})`}>
                    {/* Rotation button */}
                    <g 
                      transform="translate(-20, 0)" 
                      style={{ cursor: 'pointer' }}
                      onMouseDown={(e) => { e.stopPropagation(); setRotating(true) }}
                    >
                      <circle cx="0" cy="0" r="12" fill="#e0e7ff" stroke="#d1d5db" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                      <g transform="scale(0.5) translate(-12, -12)" fill="#4b5563">
                        <path d="m24,12c0,.552-.447,1-1,1s-1-.448-1-1c0-5.514-4.486-10-10-10-3.154,0-6.115,1.51-7.991,4h2.991c.553,0,1,.448,1,1s-.447,1-1,1H3c-1.103,0-2-.897-2-2V2c0-.552.447-1,1-1s1,.448,1,1v2.104C5.256,1.542,8.524,0,12,0c6.617,0,12,5.383,12,12Zm-3,4h-4c-.553,0-1,.448-1,1s.447,1,1,1h2.991c-1.877,2.49-4.837,4-7.991,4-5.514,0-10-4.486-10-10,0-.552-.447-1-1-1s-1,.448-1,1c0,6.617,5.383,12,12,12,3.476,0,6.744-1.542,9-4.104v2.104c0,.552.447,1,1,1s1-.448,1-1v-4c0-1.103-.897-2-2-2Z"/>
                      </g>
                    </g>
                    {/* Move button */}
                    <g 
                      transform="translate(20, 0)" 
                      style={{ cursor: 'move' }}
                      onMouseDown={(e) => { e.stopPropagation(); setButtonDragging(true) }}
                    >
                      <circle cx="0" cy="0" r="12" fill="white" stroke="#d1d5db" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                      <g transform="scale(0.5) translate(-12, -12)" fill="#4b5563">
                        <path d="M23.351,10.253c-.233-.263-.462-.513-.619-.67L20.487,7.3a1,1,0,0,0-1.426,1.4l2.251,2.29L21.32,11H13V2.745l2.233,2.194a1,1,0,0,0,1.4-1.426l-2.279-2.24c-.163-.163-.413-.391-.674-.623A2.575,2.575,0,0,0,12.028.006.28.28,0,0,0,12,0l-.011,0a2.584,2.584,0,0,0-1.736.647c-.263.233-.513.462-.67.619L7.3,3.513A1,1,0,1,0,8.7,4.939l2.29-2.251L11,2.68V11H2.68l.015-.015L4.939,8.7A1,1,0,1,0,3.513,7.3L1.274,9.577c-.163.163-.392.413-.624.675A2.581,2.581,0,0,0,0,11.989L0,12c0,.01.005.019.006.029A2.573,2.573,0,0,0,.65,13.682c.233.262.461.512.618.67l2.245,2.284a1,1,0,0,0,1.426-1.4L2.744,13H11v8.32l-.015-.014L8.7,19.062a1,1,0,1,0-1.4,1.425l2.278,2.239c.163.163.413.391.675.624a2.587,2.587,0,0,0,3.43,0c.262-.233.511-.46.669-.619l2.284-2.244a1,1,0,1,0-1.4-1.425L13,21.256V13h8.256l-2.2,2.233a1,1,0,1,0,1.426,1.4l2.239-2.279c.163-.163.391-.413.624-.675A2.589,2.589,0,0,0,23.351,10.253Z"/>
                      </g>
                    </g>
                  </g>
                )
              })()}
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}


