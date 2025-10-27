import { useState, useEffect } from 'react'
import { useAppStore } from '../store'
import Button from './ui/Button'
import { IconSave, IconFolderOpen, IconDownload, IconPlus, IconChevronDown } from './icons'

interface SavedProject {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export default function ProjectManager() {
  const { 
    projectName, 
    isProjectSaved,
    autoSave,
    setProjectName, 
    saveProject, 
    loadProject, 
    newProject, 
    exportProject,
    exportProjectAsJSON,
    exportProjectAsSVG,
    toggleAutoSave,
    saveToLocalStorage,
    loadFromLocalStorage,
    clearLocalStorage
  } = useAppStore()
  
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([])
  const [showProjectList, setShowProjectList] = useState(false)
  const [showExportOptions, setShowExportOptions] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [tempName, setTempName] = useState(projectName)

  // Load saved projects from localStorage
  useEffect(() => {
    const projects = JSON.parse(localStorage.getItem('circuitProjects') || '[]')
    setSavedProjects(projects.map((p: any) => ({
      id: p.id,
      name: p.name,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt
    })))
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.project-manager')) {
        setShowProjectList(false)
        setShowExportOptions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSaveProject = () => {
    saveProject()
    // Refresh the project list
    const projects = JSON.parse(localStorage.getItem('circuitProjects') || '[]')
    setSavedProjects(projects.map((p: any) => ({
      id: p.id,
      name: p.name,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt
    })))
  }

  const handleLoadProject = (projectId: string) => {
    loadProject(projectId)
    setShowProjectList(false)
  }

  const handleNewProject = () => {
    newProject()
    setTempName('Untitled Project')
    setIsEditingName(true)
  }

  const handleNameEdit = () => {
    setIsEditingName(true)
    setTempName(projectName)
  }

  const handleSaveToLocalStorage = () => {
    saveToLocalStorage()
    alert('Project saved to browser storage!')
  }

  const handleLoadFromLocalStorage = () => {
    loadFromLocalStorage()
    alert('Project loaded from browser storage!')
  }

  const handleClearLocalStorage = () => {
    if (confirm('Are you sure you want to clear all saved data? This cannot be undone.')) {
      clearLocalStorage()
      alert('All saved data cleared!')
    }
  }

  const handleNameSave = () => {
    setProjectName(tempName)
    setIsEditingName(false)
  }

  const handleNameCancel = () => {
    setTempName(projectName)
    setIsEditingName(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave()
    } else if (e.key === 'Escape') {
      handleNameCancel()
    }
  }

  return (
    <div className="project-manager flex items-center gap-2 px-4 py-2 bg-slate-800 border-b border-slate-700">
      {/* Project Name */}
      <div className="flex items-center gap-2">
        {isEditingName ? (
          <input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onBlur={handleNameSave}
            onKeyDown={handleKeyPress}
            className="px-2 py-1 bg-slate-700 text-white border border-slate-600 rounded text-sm focus:outline-none focus:border-blue-500"
            autoFocus
          />
        ) : (
          <button
            onClick={handleNameEdit}
            className="text-white hover:text-blue-400 text-sm font-medium px-2 py-1 rounded hover:bg-slate-700 transition-colors"
          >
            {autoSave && <span className="text-green-400 mr-1">✓</span>}
            {!isProjectSaved && !autoSave && <span className="text-blue-400 mr-1">•</span>}
            {projectName}
          </button>
        )}
      </div>

      {/* Project Actions */}
      <div className="flex items-center gap-1">
        <Button
          variant="secondary"
          onClick={handleSaveProject}
          title="Save Project"
        >
          <IconSave width={16} height={16} />
        </Button>

        <Button
          variant="secondary"
          onClick={() => setShowProjectList(!showProjectList)}
          title="Open Project"
        >
          <IconFolderOpen width={16} height={16} />
        </Button>

        <Button
          variant="secondary"
          onClick={handleSaveToLocalStorage}
          title="Save to Browser Storage"
        >
          💾
        </Button>

        <Button
          variant="secondary"
          onClick={handleLoadFromLocalStorage}
          title="Load from Browser Storage"
        >
          📁
        </Button>

        <Button
          variant="secondary"
          onClick={handleClearLocalStorage}
          title="Clear Browser Storage"
        >
          🗑️
        </Button>

        <div className="relative">
          <Button
            variant="secondary"
            onClick={() => setShowExportOptions(!showExportOptions)}
            title="Export Project"
          >
            <IconDownload width={16} height={16} />
            <IconChevronDown width={12} height={12} className="ml-1" />
          </Button>
          
          {showExportOptions && (
            <div className="absolute top-8 right-0 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 min-w-32">
              <button
                onClick={() => {
                  exportProject()
                  setShowExportOptions(false)
                }}
                className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 rounded-t-lg transition-colors"
              >
                Export as PNG
              </button>
              <button
                onClick={() => {
                  exportProjectAsSVG()
                  setShowExportOptions(false)
                }}
                className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 transition-colors"
              >
                Export as SVG
              </button>
              <button
                onClick={() => {
                  exportProjectAsJSON()
                  setShowExportOptions(false)
                }}
                className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 rounded-b-lg transition-colors"
              >
                Export as JSON
              </button>
            </div>
          )}
        </div>

        <Button
          variant="primary"
          onClick={handleNewProject}
          title="New Project"
        >
          <IconPlus width={16} height={16} />
        </Button>
      </div>

      {/* Auto-Save Toggle */}
      <div className="ml-auto flex items-center gap-3">
        <span className="text-sm text-slate-300">Auto Save</span>
        <button
          onClick={toggleAutoSave}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800 ${
            autoSave ? 'bg-purple-600' : 'bg-slate-600'
          }`}
        >
          <span
            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
              autoSave ? 'translate-x-5' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Project List Dropdown */}
      {showProjectList && (
        <div className="absolute top-12 left-4 right-4 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-slate-400 mb-2">Saved Projects</div>
            {savedProjects.length === 0 ? (
              <div className="text-sm text-slate-500 py-2">No saved projects</div>
            ) : (
              savedProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => handleLoadProject(project.id)}
                  className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 rounded transition-colors"
                >
                  <div className="font-medium">{project.name}</div>
                  <div className="text-xs text-slate-400">
                    Updated: {new Date(project.updatedAt).toLocaleDateString()}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
