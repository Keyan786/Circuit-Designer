import Sidebar from './components/Sidebar'
import Canvas from './components/Canvas'
import { ui } from './ui'
import RightPanel from './components/RightPanel'
import ProjectManager from './components/ProjectManager'

function App() {
  // Project management is now handled by ProjectManager component

  return (
    <div className={ui.layout.page}>
      <Sidebar />
      <div className={ui.layout.canvasWrap}>
        <ProjectManager />
        <div className={ui.layout.canvas}>
          <Canvas />
        </div>
      </div>
      <RightPanel />
    </div>
  )
}

export default App
