export const ui = {
  layout: {
    page: 'h-screen w-screen overflow-hidden flex bg-slate-900 text-white',
    header: 'h-12 shrink-0 flex items-center gap-3 px-5 bg-slate-800 border-b border-slate-700',
    sidebar: 'flex flex-col h-full w-72 bg-slate-800 border-r border-slate-700',
    canvasWrap: 'flex-1 min-w-0 min-h-0 overflow-hidden flex flex-col bg-white',
    canvas: 'flex-1 bg-white relative overflow-hidden',
    rightPanel: 'w-80 bg-slate-800 border-l border-slate-700 flex flex-col',
  },
  divider: 'h-px bg-slate-600',
  card: 'bg-slate-800 border border-slate-700 rounded-xl shadow-lg',
  button: (active = false) =>
    `px-3 py-2 text-sm rounded-lg transition ${active ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-200 shadow-lg'}`,
  buttonPrimary: 'px-3 py-2 text-sm rounded-lg text-white shadow-lg bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800',
  buttonSecondary: 'px-3 py-2 text-sm rounded-lg text-slate-200 bg-slate-700 border border-slate-600 hover:bg-slate-600',
  pill: (active = false) =>
    `px-3 py-1.5 text-xs rounded-full ${active ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-200 shadow-lg'}`,
  toolbarStrip: 'bg-slate-800 border-b border-slate-700',
  input: 'h-8 px-2 rounded-md border border-slate-600 bg-slate-700 text-white text-sm focus:ring-2 focus:ring-purple-500 outline-none',
  inputSmall: 'h-7 px-2 rounded-md border border-slate-600 bg-slate-700 text-white text-xs focus:ring-2 focus:ring-purple-500 outline-none',
  range: 'accent-purple-600',
}


