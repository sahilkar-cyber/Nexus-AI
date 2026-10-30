import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Bell, Bot, BrainCircuit,
  CalendarDays, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight,
  CircleHelp, Clock3, Command, FileText, Filter, Flame, FolderKanban, Gauge,
  LayoutDashboard, ListTodo, Menu, MessageSquare, Moon, MoreHorizontal, Plus,
  Search, Send, Settings, Sparkles, Sun, Target, TrendingUp, UploadCloud,
  WandSparkles, X, Zap
} from 'lucide-react'
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts'

const initialTasks = [
  { id: 1, title: 'Finalize DevFest project proposal', tag: 'Product', due: 'Today', done: false, color: 'violet' },
  { id: 2, title: 'Review user onboarding flow', tag: 'Design', due: 'Today', done: false, color: 'blue' },
  { id: 3, title: 'Prepare sprint planning notes', tag: 'Planning', due: 'Tomorrow', done: true, color: 'amber' },
  { id: 4, title: 'Share weekly progress update', tag: 'Team', due: 'Oct 31', done: false, color: 'green' },
]
const chartData = [
  { day: 'Mon', focus: 2.4, tasks: 4 }, { day: 'Tue', focus: 3.1, tasks: 6 },
  { day: 'Wed', focus: 2.8, tasks: 5 }, { day: 'Thu', focus: 4.2, tasks: 8 },
  { day: 'Fri', focus: 3.6, tasks: 7 }, { day: 'Sat', focus: 4.8, tasks: 9 },
  { day: 'Sun', focus: 3.9, tasks: 7 },
]
const navItems = [
  { id: 'Overview', icon: LayoutDashboard }, { id: 'My tasks', icon: ListTodo },
  { id: 'AI Assistant', icon: Bot }, { id: 'Documents', icon: FileText },
  { id: 'Analytics', icon: Activity },
]

function cn(...v) { return v.filter(Boolean).join(' ') }

function App() {
  const [page, setPage] = useState('Overview')
  const [tasks, setTasks] = useState(initialTasks)
  const [dark, setDark] = useState(false)
  const [query, setQuery] = useState('')
  const [taskModal, setTaskModal] = useState(false)
  const [newTask, setNewTask] = useState('')
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState([
    { from: 'ai', text: 'Hey Alex! I’m your Nexus assistant. What would you like to make progress on today?' }
  ])
  const [docText, setDocText] = useState('')
  const [summary, setSummary] = useState('')
  const [mobileNav, setMobileNav] = useState(false)
  const [notice, setNotice] = useState('')

  const completed = tasks.filter(t => t.done).length
  const filteredTasks = useMemo(() => tasks.filter(t => t.title.toLowerCase().includes(query.toLowerCase())), [tasks, query])

  const toggleTask = id => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  const addTask = () => {
    if (!newTask.trim()) return
    setTasks(prev => [{ id: Date.now(), title: newTask.trim(), tag: 'Personal', due: 'Today', done: false, color: 'violet' }, ...prev])
    setNewTask(''); setTaskModal(false); setNotice('Task added to your workspace')
    setTimeout(() => setNotice(''), 2400)
  }
  const sendMessage = () => {
    if (!chatInput.trim()) return
    const text = chatInput.trim()
    setMessages(prev => [...prev, { from: 'user', text }, { from: 'ai', text: makeReply(text) }])
    setChatInput('')
  }
  const summarize = () => {
    if (!docText.trim()) return
    const clean = docText.trim().replace(/\s+/g, ' ')
    const sentences = clean.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [clean]
    setSummary(`Executive summary\n${sentences.slice(0, 2).join(' ').trim()}\n\nKey takeaways\n${sentences.slice(2, 5).map(s => '• ' + s.trim()).join('\n') || '• The document provides context and supporting details for its main point.'}\n\nSuggested next step\nTurn the main points into clear actions, assign owners, and agree on a timeline.`)
  }

  return (
    <div className={cn('min-h-screen transition-colors duration-300', dark ? 'dark-mode' : 'bg-[#f7f8fc]')}>
      <div className="flex min-h-screen">
        <aside className={cn('fixed inset-y-0 left-0 z-40 flex w-[252px] flex-col border-r border-[#eceef5] bg-white px-5 py-6 transition-transform lg:static lg:translate-x-0', dark && 'bg-[#191e30] border-[#2b3148]', mobileNav ? 'translate-x-0' : '-translate-x-full')}>
          <div className="mb-10 flex items-center gap-3 px-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-gradient-to-br from-[#7164ed] to-[#a77cf1] text-white shadow-lg shadow-violet-200"><BrainCircuit size={22}/></div>
            <div><div className="font-display text-[19px] font-extrabold tracking-tight">nexus<span className="text-[#7869eb]">.</span></div><div className="text-[10px] font-bold uppercase tracking-[.18em] text-[#a2a6b7]">AI workspace</div></div>
            <button onClick={() => setMobileNav(false)} className="ml-auto rounded-lg p-2 text-slate-400 lg:hidden"><X size={18}/></button>
          </div>
          <div className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#a6a9b8]">Workspace</div>
          <nav className="space-y-1">
            {navItems.map(({id, icon: Icon}) => (
              <button key={id} onClick={() => { setPage(id); setMobileNav(false) }} className={cn('nav-active flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[13px] font-semibold transition-all', page === id ? 'bg-[#f0efff] text-[#6c5ce7]' : 'text-[#7f8498] hover:bg-[#f7f7fb] hover:text-[#454b62]', dark && page !== id && 'text-[#a5abc0] hover:bg-[#242a40]')}>
                <Icon size={17} strokeWidth={2.1}/>{id}
                {id === 'AI Assistant' && <span className="ml-auto rounded-md bg-[#eeeaff] px-1.5 py-0.5 text-[9px] font-bold text-[#7464e8]">NEW</span>}
              </button>
            ))}
          </nav>
          <div className="mb-3 mt-9 px-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#a6a9b8]">Personal</div>
          <button onClick={() => setNotice('Your calendar is up to date')} className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-[13px] font-semibold text-[#85899b] hover:bg-[#f7f7fb]"><CalendarDays size={17}/> Calendar</button>
          <button onClick={() => setNotice('Settings are coming soon')} className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-[13px] font-semibold text-[#85899b] hover:bg-[#f7f7fb]"><Settings size={17}/> Settings</button>
          <div className="mt-auto">
            <div className="mb-5 rounded-2xl bg-gradient-to-br from-[#f1efff] to-[#f7f4ff] p-4">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#7667e9] shadow-sm"><Zap size={16}/></div>
              <div className="font-display text-[13px] font-bold text-[#39345e]">Unlock your flow</div>
              <p className="mt-1 text-[11px] leading-relaxed text-[#817c9e]">Let AI take care of the busywork so you can focus on what matters.</p>
              <button onClick={() => setPage('AI Assistant')} className="mt-3 flex items-center gap-1 text-[11px] font-bold text-[#6c5ce7]">Explore AI <ArrowRight size={13}/></button>
            </div>
            <div className="flex items-center gap-3 border-t border-[#eff0f5] pt-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8e5ff] text-[12px] font-bold text-[#6c5ce7]">AK</div>
              <div className="min-w-0 flex-1"><div className="truncate text-[12px] font-bold">Alex Kumar</div><div className="text-[10px] text-[#a1a4b2]">Free workspace</div></div>
              <MoreHorizontal size={18} className="text-[#a1a4b2]"/>
            </div>
          </div>
        </aside>

        {mobileNav && <button aria-label="Close navigation" onClick={() => setMobileNav(false)} className="fixed inset-0 z-30 bg-slate-900/20 lg:hidden"/>}

        <main className="min-w-0 flex-1">
          <header className={cn('sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-[#eceef5] bg-[#f7f8fc]/90 px-5 backdrop-blur-xl sm:px-8 xl:px-10', dark && 'border-[#2b3148] bg-[#121525]/90')}>
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileNav(true)} className="rounded-lg p-2 text-slate-500 lg:hidden"><Menu size={19}/></button>
              <div><div className="text-[11px] font-medium text-[#a0a4b3]">Workspace / <span className="text-[#6d7185]">{page}</span></div><div className="font-display text-[17px] font-bold">{page}</div></div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={cn('hidden h-10 w-[210px] items-center gap-2 rounded-xl border border-[#e9ebf3] bg-white px-3 sm:flex', dark && 'surface')}><Search size={15} className="text-[#a5a8b8]"/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search anything..." className="w-full bg-transparent text-[11px] outline-none placeholder:text-[#b0b3c0]"/><kbd className="rounded border border-[#eceef5] px-1 text-[9px] text-[#a5a8b8]">⌘ K</kbd></div>
              <button onClick={() => setDark(!dark)} className={cn('flex h-10 w-10 items-center justify-center rounded-xl border border-[#e9ebf3] bg-white text-[#777d91] hover:text-[#6c5ce7]', dark && 'surface')} title="Toggle theme">{dark ? <Sun size={17}/> : <Moon size={17}/>}</button>
              <button onClick={() => setNotice('You’re all caught up!')} className={cn('relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#e9ebf3] bg-white text-[#777d91]', dark && 'surface')}><Bell size={17}/><span className="absolute right-[9px] top-[8px] h-1.5 w-1.5 rounded-full bg-[#f18a76] ring-2 ring-white"/></button>
              <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-[#e8e5ff] text-[11px] font-bold text-[#6c5ce7] sm:flex">AK</div>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 xl:px-10">
            <AnimatePresence mode="wait">
              <motion.div key={page} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-5}} transition={{duration:.22}}>
                {page === 'Overview' && <Overview tasks={tasks} completed={completed} toggleTask={toggleTask} setTaskModal={setTaskModal} setPage={setPage}/>}
                {page === 'My tasks' && <Tasks tasks={filteredTasks} toggleTask={toggleTask} setTaskModal={setTaskModal} query={query}/>}
                {page === 'AI Assistant' && <Assistant messages={messages} input={chatInput} setInput={setChatInput} send={sendMessage}/>}
                {page === 'Documents' && <Documents docText={docText} setDocText={setDocText} summary={summary} summarize={summarize}/>}
                {page === 'Analytics' && <Analytics tasks={tasks} completed={completed}/>}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <AnimatePresence>{taskModal && <TaskModal value={newTask} setValue={setNewTask} close={() => setTaskModal(false)} add={addTask}/>}</AnimatePresence>
      <AnimatePresence>{notice && <motion.div initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}} className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-[#25243b] px-4 py-3 text-[12px] font-semibold text-white shadow-xl"><CheckCircle2 size={16} className="text-emerald-300"/>{notice}</motion.div>}</AnimatePresence>
    </div>
  )
}

function Overview({tasks, completed, toggleTask, setTaskModal, setPage}) {
  const progress = Math.round((completed / Math.max(tasks.length,1))*100)
  return <div className="space-y-7">
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div><div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.15em] text-[#8d91a5]"><span className="h-1.5 w-1.5 rounded-full bg-[#7b6bed]"/> Thursday, October 30, 2026</div><h1 className="font-display text-[27px] font-extrabold tracking-tight sm:text-[32px]">Good evening, Alex <span>✦</span></h1><p className="mt-1 text-[13px] text-[#969aab] muted">Here’s what’s happening with your workspace today.</p></div>
      <button onClick={() => setTaskModal(true)} className="flex items-center justify-center gap-2 rounded-xl bg-[#6d5ce7] px-4 py-3 text-[12px] font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-[#5d4bd8]"><Plus size={16}/> Create new task</button>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Stat icon={Target} label="Tasks completed" value={`${completed}/${tasks.length}`} delta="+12.8%" note="vs last week" color="violet"/>
      <Stat icon={Clock3} label="Focus time" value="24.5h" delta="+8.2%" note="vs last week" color="blue"/>
      <Stat icon={Flame} label="Current streak" value="7 days" delta="Personal best" note="Keep it going" color="orange"/>
      <Stat icon={Gauge} label="Productivity score" value="86.4" delta="+5.4%" note="vs last week" color="green"/>
    </div>
    <div className="grid gap-5 xl:grid-cols-[1.65fr_1fr]">
      <section className="panel soft-shadow p-5 sm:p-6">
        <div className="mb-6 flex items-start justify-between"><div><h2 className="font-display text-[15px] font-bold">Productivity overview</h2><p className="mt-1 text-[11px] text-[#a0a4b3] muted">Your focus hours over the last 7 days</p></div><button className="flex items-center gap-2 rounded-lg border border-[#eceef5] px-3 py-2 text-[10px] font-semibold text-[#777d91]">This week <ChevronDown size={13}/></button></div>
        <div className="mb-4 flex items-end gap-2"><span className="font-display text-[29px] font-extrabold">24.5h</span><span className="mb-1 flex items-center text-[10px] font-bold text-[#28a879]"><ArrowUpRight size={13}/> 12.6%</span></div>
        <div className="h-[220px] w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{top:8,right:8,left:-22,bottom:0}}><defs><linearGradient id="focusFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8172ed" stopOpacity={.22}/><stop offset="100%" stopColor="#8172ed" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#f0f1f6" strokeDasharray="4 5" vertical={false}/><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill:'#a5a8b7',fontSize:10}} dy={10}/><YAxis axisLine={false} tickLine={false} tick={{fill:'#a5a8b7',fontSize:10}}/><Tooltip contentStyle={{borderRadius:12,border:'1px solid #eeeef5',fontSize:11,boxShadow:'0 8px 25px #2221'}}/><Area type="monotone" dataKey="focus" stroke="#7969e9" strokeWidth={2.5} fill="url(#focusFill)" activeDot={{r:5,strokeWidth:0}}/></AreaChart></ResponsiveContainer></div>
      </section>
      <section className="panel soft-shadow p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between"><div><h2 className="font-display text-[15px] font-bold">Daily goals</h2><p className="mt-1 text-[11px] text-[#a0a4b3] muted">Small steps, big momentum.</p></div><button className="rounded-lg p-1 text-[#a4a7b5]"><MoreHorizontal size={18}/></button></div>
        <div className="flex items-center gap-5">
          <div className="relative flex h-[116px] w-[116px] shrink-0 items-center justify-center rounded-full" style={{background:`conic-gradient(#7767e9 ${progress}%, #eeeef5 ${progress}% 100%)`}}><div className="flex h-[91px] w-[91px] flex-col items-center justify-center rounded-full bg-white"><span className="font-display text-[25px] font-extrabold">{progress}%</span><span className="text-[9px] text-[#a1a4b3]">completed</span></div></div>
          <div className="min-w-0 flex-1 space-y-3"><Goal label="Deep work" value="3 / 4 hrs" percent={75} color="#7767e9"/><Goal label="Tasks" value={`${completed} / ${tasks.length}`} percent={progress} color="#3cae91"/><Goal label="Breaks" value="2 / 3" percent={67} color="#f0a75d"/></div>
        </div>
        <div className="mt-6 rounded-xl bg-[#f7f6ff] p-3.5"><div className="flex items-center gap-2 text-[11px] font-bold text-[#6557c8]"><Sparkles size={14}/> AI insight</div><p className="mt-1 text-[11px] leading-relaxed text-[#8580a9]">You’re most focused between 10 AM and 12 PM. Try scheduling your most important work then.</p></div>
      </section>
    </div>
    <div className="grid gap-5 xl:grid-cols-[1.45fr_1fr]">
      <section className="panel soft-shadow p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between"><div><h2 className="font-display text-[15px] font-bold">Your tasks</h2><p className="mt-1 text-[11px] text-[#a0a4b3] muted">Stay on top of your priorities</p></div><button onClick={() => setPage('My tasks')} className="text-[11px] font-bold text-[#6d5ce7]">View all <ArrowRight className="ml-1 inline" size={13}/></button></div>
        <div className="space-y-1">{tasks.slice(0,4).map(t => <TaskRow key={t.id} task={t} toggle={toggleTask}/>)}</div>
      </section>
      <section className="overflow-hidden rounded-[18px] bg-gradient-to-br from-[#7162e8] via-[#7965e8] to-[#9b75eb] p-6 text-white shadow-lg shadow-violet-200">
        <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15"><WandSparkles size={20}/></div>
        <div className="text-[10px] font-bold uppercase tracking-[.16em] text-white/65">Meet your AI copilot</div>
        <h2 className="mt-2 max-w-[240px] font-display text-[23px] font-extrabold leading-tight">A little help goes a long way.</h2>
        <p className="mt-3 max-w-[280px] text-[12px] leading-relaxed text-white/75">Brainstorm ideas, summarize documents, and turn your thoughts into action — all in one place.</p>
        <button onClick={() => setPage('AI Assistant')} className="mt-6 flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-[11px] font-bold text-[#6859d7] transition hover:-translate-y-0.5">Chat with Nexus <ArrowRight size={14}/></button>
        <div className="pointer-events-none relative h-5"><div className="absolute -right-3 -top-16 h-36 w-36 rounded-full border border-white/15"/><div className="absolute -right-[-28px] -top-9 h-20 w-20 rounded-full border border-white/15"/></div>
      </section>
    </div>
  </div>
}

function Stat({icon:Icon,label,value,delta,note,color}) {
  const styles = {violet:'bg-[#f0edff] text-[#7969e9]',blue:'bg-[#eaf3ff] text-[#5b9be8]',orange:'bg-[#fff2e7] text-[#ed9c58]',green:'bg-[#e8f8f2] text-[#35a982]'}
  return <div className="panel soft-shadow p-5"><div className="mb-4 flex items-center justify-between"><div className={cn('flex h-9 w-9 items-center justify-center rounded-xl',styles[color])}><Icon size={17}/></div><span className="flex items-center gap-0.5 text-[10px] font-bold text-[#2ba77e]">{delta.startsWith('+') && <ArrowUpRight size={12}/>} {delta}</span></div><div className="font-display text-[25px] font-extrabold tracking-tight">{value}</div><div className="mt-1 text-[11px] font-semibold text-[#777d91] muted">{label}</div><div className="mt-2 text-[9px] text-[#a5a8b6] muted">{note}</div></div>
}
function Goal({label,value,percent,color}) { return <div><div className="mb-1.5 flex justify-between text-[10px]"><span className="font-semibold text-[#777d91] muted">{label}</span><span className="text-[#9b9eae]">{value}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-[#f0f1f6]"><div className="h-full rounded-full" style={{width:`${percent}%`,background:color}}/></div></div> }
function TaskRow({task,toggle}) {
  const dot = {violet:'bg-violet-400',blue:'bg-blue-400',amber:'bg-amber-400',green:'bg-emerald-400'}
  return <div className="group flex items-center gap-3 rounded-xl px-2 py-3 transition hover:bg-[#fafaff]"><button onClick={() => toggle(task.id)} className={cn('flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md border transition',task.done?'border-[#7969e9] bg-[#7969e9] text-white':'border-[#dfe1eb] hover:border-[#7969e9]')}>{task.done && <Check size={12}/>}</button><span className={cn('h-2 w-2 rounded-full',dot[task.color]||dot.violet)}/><span className={cn('min-w-0 flex-1 truncate text-[12px] font-semibold',task.done?'text-[#b4b6c2] line-through':'text-[#555b70] muted')}>{task.title}</span><span className="hidden rounded-md bg-[#f6f6fa] px-2 py-1 text-[9px] font-semibold text-[#999daf] sm:inline">{task.tag}</span><span className="text-[10px] text-[#a5a8b6]">{task.due}</span></div>
}

function Tasks({tasks,toggleTask,setTaskModal,query}) {
  return <div className="space-y-6"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h1 className="font-display text-[28px] font-extrabold">My tasks</h1><p className="mt-1 text-[12px] text-[#969aab] muted">A clear mind starts with a clear plan.</p></div><button onClick={() => setTaskModal(true)} className="flex items-center justify-center gap-2 rounded-xl bg-[#6d5ce7] px-4 py-3 text-[12px] font-bold text-white"><Plus size={16}/> Add task</button></div>
    <div className="panel soft-shadow p-5 sm:p-7"><div className="mb-4 flex items-center justify-between"><div className="font-display text-[14px] font-bold">All tasks <span className="ml-1 text-[#a5a8b6]">({tasks.length})</span></div><div className="flex items-center gap-2 text-[10px] text-[#999daf]"><Filter size={14}/> Filtered list</div></div>{tasks.length ? tasks.map(t=><TaskRow key={t.id} task={t} toggle={toggleTask}/>) : <div className="py-12 text-center text-[12px] text-[#9b9eae]">{query ? 'No tasks match your search.' : 'No tasks yet. Add your first task to get started.'}</div>}</div>
  </div>
}

function Assistant({messages,input,setInput,send}) {
  const suggestions = ['Help me plan my day','Give me ideas for my project','Write a professional email']
  return <div className="mx-auto max-w-[950px] space-y-6"><div><div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.15em] text-[#8d91a5]"><Sparkles size={13} className="text-[#7869e9]"/> Your AI copilot</div><h1 className="font-display text-[28px] font-extrabold">How can I help today?</h1><p className="mt-1 text-[12px] text-[#969aab] muted">Think out loud. I’ll help you turn ideas into action.</p></div>
    <div className="panel soft-shadow flex min-h-[490px] flex-col overflow-hidden"><div className="flex items-center gap-3 border-b border-[#eff0f5] px-5 py-4"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#efedff] text-[#7565e8]"><Bot size={19}/></div><div className="flex-1"><div className="text-[12px] font-bold">Nexus Assistant</div><div className="flex items-center gap-1 text-[10px] text-[#36a77f]"><span className="h-1.5 w-1.5 rounded-full bg-[#36a77f]"/> Ready to help</div></div><span className="rounded-lg bg-[#f7f6ff] px-2 py-1 text-[9px] font-bold text-[#7869e9]">BETA</span></div>
      <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-7">{messages.map((m,i)=><div key={i} className={cn('flex gap-3',m.from==='user'&&'flex-row-reverse')}><div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-xl',m.from==='ai'?'bg-[#efedff] text-[#7565e8]':'bg-[#eaf3ff] text-[#548fd5]')}>{m.from==='ai'?<Sparkles size={15}/>:<span className="text-[10px] font-bold">AK</span>}</div><div className={cn('max-w-[78%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-[12px] leading-relaxed',m.from==='ai'?'rounded-tl-md bg-[#f7f7fb] text-[#656a7e]':'rounded-tr-md bg-[#6d5ce7] text-white')}>{m.text}</div></div>)}</div>
      <div className="border-t border-[#eff0f5] p-4 sm:p-5"><div className="mb-3 flex flex-wrap gap-2">{suggestions.map(s=><button key={s} onClick={()=>setInput(s)} className="rounded-full border border-[#ececf4] px-3 py-1.5 text-[10px] font-medium text-[#888da1] transition hover:border-[#c9c2ff] hover:text-[#6d5ce7]">{s}</button>)}</div><div className="flex items-center gap-2 rounded-xl border border-[#e9eaf2] bg-white p-2 pl-4"><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Message Nexus..." className="min-w-0 flex-1 bg-transparent text-[12px] outline-none placeholder:text-[#b0b3c0]"/><button onClick={send} className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#6d5ce7] text-white hover:bg-[#5d4bd8]"><Send size={15}/></button></div><div className="mt-2 text-center text-[9px] text-[#b0b3c0]">Nexus AI can make mistakes. Verify important information.</div></div>
    </div>
  </div>
}

function Documents({docText,setDocText,summary,summarize}) {
  return <div className="space-y-6"><div><div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.15em] text-[#8d91a5]"><FileText size={13}/> Knowledge workspace</div><h1 className="font-display text-[28px] font-extrabold">Document studio</h1><p className="mt-1 text-[12px] text-[#969aab] muted">Turn long-form content into clear, actionable insights.</p></div>
    <div className="grid gap-5 xl:grid-cols-2"><section className="panel soft-shadow p-5 sm:p-6"><div className="mb-4 flex items-center justify-between"><div className="font-display text-[14px] font-bold">Your document</div><span className="rounded-lg bg-[#f4f3ff] px-2 py-1 text-[9px] font-bold text-[#7667e9]">INPUT</span></div><div className="mb-4 flex min-h-[270px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#e5e5f0] bg-[#fbfbfe] p-5 text-center"><div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#efedff] text-[#7869e9]"><UploadCloud size={20}/></div><div className="text-[12px] font-bold text-[#62677b]">Paste your text below</div><p className="mt-1 text-[10px] text-[#a2a5b4]">Add meeting notes, research, briefs, or any text you want to understand faster.</p></div><textarea value={docText} onChange={e=>setDocText(e.target.value)} placeholder="Paste or type your document here..." className="min-h-[150px] w-full resize-y rounded-xl border border-[#e9eaf2] bg-white p-4 text-[12px] leading-relaxed outline-none focus:border-[#aaa0f5]"/><button onClick={summarize} disabled={!docText.trim()} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6d5ce7] px-4 py-3 text-[11px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"><Sparkles size={15}/> Generate summary</button></section>
    <section className="panel soft-shadow p-5 sm:p-6"><div className="mb-4 flex items-center justify-between"><div className="font-display text-[14px] font-bold">AI summary</div><span className="rounded-lg bg-[#eaf8f2] px-2 py-1 text-[9px] font-bold text-[#36a77f]">OUTPUT</span></div>{summary ? <div className="whitespace-pre-wrap rounded-xl bg-[#faf9ff] p-5 text-[12px] leading-[2] text-[#666b80]">{summary}</div> : <div className="flex min-h-[420px] flex-col items-center justify-center rounded-xl bg-[#fafaff] p-8 text-center"><div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#7869e9] shadow-sm"><BrainCircuit size={25}/></div><div className="font-display text-[14px] font-bold">Your summary will appear here</div><p className="mt-2 max-w-[230px] text-[11px] leading-relaxed text-[#a1a4b3]">Paste a document and let Nexus organize the key points for you.</p></div>}</section></div>
  </div>
}

function Analytics({tasks,completed}) {
  return <div className="space-y-6"><div><div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.15em] text-[#8d91a5]"><TrendingUp size={13}/> Performance insights</div><h1 className="font-display text-[28px] font-extrabold">Your productivity</h1><p className="mt-1 text-[12px] text-[#969aab] muted">A snapshot of your momentum and focus.</p></div>
    <div className="grid gap-4 sm:grid-cols-3"><Stat icon={CheckCircle2} label="Tasks completed" value={completed} delta="+12.8%" note="vs last week" color="green"/><Stat icon={Clock3} label="Focus hours" value="24.5h" delta="+8.2%" note="vs last week" color="blue"/><Stat icon={Target} label="Completion rate" value={`${Math.round(completed/Math.max(tasks.length,1)*100)}%`} delta="+5.4%" note="vs last week" color="violet"/></div>
    <div className="panel soft-shadow p-5 sm:p-7"><h2 className="font-display text-[15px] font-bold">Focus activity</h2><p className="mt-1 text-[11px] text-[#a0a4b3] muted">Hours spent in focused work sessions</p><div className="mt-5 h-[300px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData}><defs><linearGradient id="analyticsFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8172ed" stopOpacity={.25}/><stop offset="100%" stopColor="#8172ed" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#f0f1f6" strokeDasharray="4 5" vertical={false}/><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill:'#a5a8b7',fontSize:11}}/><YAxis axisLine={false} tickLine={false} tick={{fill:'#a5a8b7',fontSize:11}}/><Tooltip/><Area type="monotone" dataKey="focus" stroke="#7969e9" strokeWidth={3} fill="url(#analyticsFill)"/></AreaChart></ResponsiveContainer></div></div>
  </div>
}

function TaskModal({value,setValue,close,add}) {
  return <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 flex items-center justify-center bg-[#17172b]/35 p-4 backdrop-blur-sm" onClick={close}><motion.div initial={{y:15,scale:.98}} animate={{y:0,scale:1}} exit={{y:10,scale:.98}} onClick={e=>e.stopPropagation()} className="w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-2xl"><div className="mb-5 flex items-center justify-between"><div><h2 className="font-display text-[17px] font-extrabold text-[#272b40]">Create a task</h2><p className="mt-1 text-[11px] text-[#9a9eae]">What would you like to get done?</p></div><button onClick={close} className="rounded-lg p-2 text-[#9da1af] hover:bg-slate-50"><X size={17}/></button></div><input autoFocus value={value} onChange={e=>setValue(e.target.value)} onKeyDown={e=>e.key==='Enter'&&add()} placeholder="e.g. Prepare project demo" className="w-full rounded-xl border border-[#e8e9f1] px-4 py-3 text-[12px] text-[#35394e] outline-none focus:border-[#a99ff3]"/><div className="mt-5 flex justify-end gap-2"><button onClick={close} className="rounded-xl px-4 py-2.5 text-[11px] font-bold text-[#85899a]">Cancel</button><button onClick={add} disabled={!value.trim()} className="rounded-xl bg-[#6d5ce7] px-4 py-2.5 text-[11px] font-bold text-white disabled:opacity-40">Add task</button></div></motion.div></motion.div>
}

function makeReply(text) {
  const t = text.toLowerCase()
  if (t.includes('plan') || t.includes('day')) return 'Here’s a simple plan to get momentum:\\n\\n1. Pick one high-impact task and give it a 60–90 minute focus block.\\n2. Clear two quick tasks to reduce mental clutter.\\n3. Take a short break, then review what moved forward.\\n\\nWant me to help turn this into a task list?'
  if (t.includes('idea') || t.includes('project')) return 'Let’s make the idea sharper. Start with the problem, define who experiences it, and build one standout workflow that solves it end-to-end. For a DevFest demo, show the user journey, a meaningful AI feature, and measurable impact.\\n\\nI can help you shape the problem statement and feature set next.'
  if (t.includes('email') || t.includes('write')) return 'Absolutely. A strong professional message is clear, warm, and specific. Share the recipient, purpose, and the action you want them to take, and I can draft a polished version you can edit.'
  return `Great question. Here’s a practical way to approach “${text}”:\\n\\n• Define the outcome you want.\\n• Break it into the smallest useful next steps.\\n• Set a time box and focus on finishing the first step.\\n\\nIf you share a little more context, I can make the plan more specific.`
}

export default App
