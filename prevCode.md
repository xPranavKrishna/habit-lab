app/page.tsx:
    'use client'

import { useEffect, useMemo, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Plus, Trash2, Check, Flame, Zap, Brain, Lightbulb, Timer, Target,
  Sparkles, LogOut, Moon, Sun, Shuffle, Coffee, Trophy, Heart, Pencil,
  RotateCcw, Play, Pause, X, CircleHelp, Smile, BookOpen, Dumbbell, Briefcase,
  Home as HomeIcon, MoreHorizontal, Calendar
} from 'lucide-react'
import { DrawingBoard } from '@/components/DrawingBoard'

type Task = { id:string; title:string; category:string; minutes:number; xp:number; active:boolean; created_at?:string }
type Log = { id:string; task_id:string; completed_on:string }
type Idea = { id:string; text:string; created_at?:string }
type Song = { id:string; title:string; created_at?:string; user_id?:string }
type Gossip = { id: string, user_id: string, content: string, created_at: string }
type Person = { id: string, user_id: string, name: string, type: 'loved' | 'hated', tag: string, description: string, created_at: string, gender: string, weapon?: string }


type Tab = 'today'|'lab'|'canvas'|'account'|'music'|'gossip'

const starter = [
  {title:'Read 1 page (yes, just 1)', category:'Learn', minutes:10, xp:20},
  {title:'Drink a glass of water, bro', category:'Health', minutes:5, xp:10},
  {title:'Close all useless tabs', category:'Work', minutes:5, xp:10},
]

const categories = ['Learn','Work','Health','Life','Creative','Other']
const categoryIcons: Record<string, any> = {Learn:BookOpen, Work:Briefcase, Health:Dumbbell, Life:HomeIcon, Creative:Pencil, Other:MoreHorizontal}

const roasts = [
  'Aliya, your bed is not your office. Get up!',
  'നാളെ നോക്കാം is a powerful villain. Today is its weakness.',
  'Your phone has seen more of you today than your goals have. Kashtam.',
  'Bhayankara madiyan aanalle? It\'s okay machane, just tick one box.',
  'Eda… 5 minutes mathi. Start cheyyu. Pinne urangam. 😭',
  'Naatukaar enth parayum enn orkaruthu. Ninakk padikkan madaya. Ath sathyamanu.',
  'If procrastination paid salary, you would be CEO of Kerala by now.',
  'Motivation is out of stock. Just use the 5-min timer.',
  'Bro is planning a comeback since 2018. Pwolikkum machane... oru divasam.',
  'Entha machane, urangukayano? Wake up and pretend to work!',
  'Oru thengayum ariyilla. But just start chummengilum.',
]

const pepTalks = [
  'Tiny today > heroic tomorrow.',
  'Show up ugly. Improve later. Pwolikkam.',
  'You do not need a perfect day. You need a non-zero day.',
  'Consistency is boring. That is why it works. Adichu keri va!',
  'One checkbox can change the mood of the whole day. Sathyam.',
  'Atomic habit machane: 1% better every day.',
  'Oru 5 minute... athre ollu. You got this.',
]

const methods = [
  ['⏱️','5-Minute Thallu (Tiny Start)','Make the first promise ridiculously small: 5 minutes. Continuing is optional. Madi maattan best aanu.'],
  ['🔄','Habit Loop (Atomic)','Cue -> Craving -> Response -> Reward. Keep the cue obvious, Aliya.'],
  ['🧠','Padippi Technique (Active Recall)','Close the notes. Explain, solve, or sketch from memory. Then check what you missed. Nammal aara!'],
  ['🎯','If → Then','Decide the cue in advance: “After breakfast, I do 10 mins.” Less thinking, more doing.'],
  ['🧱','Habit Stacking','Tie a new habit to an old one: "After I drink chaya, I will write 1 paragraph."'],
  ['🍿','Temptation Bundle','Pair an annoying task with a pleasant cue: kappi, playlist, balcony, favourite snack.'],
  ['🪴','Minimum Day','Bad day? Keep the chain alive with the smallest meaningful version of the habit.'],
  ['📉','2-Minute Rule','Scale down any habit to a 2-minute version. Don\'t write a chapter, write a sentence. Easiest വഴി.'],
  ['🗣️','Teach It','Explain the idea out loud like your friend just asked “bro idhu entha?”'],
  ['🎲','Random Quest','Roll the dice and let chance choose a tiny useful action. Removes decision fatigue.'],
]

function today(){ return new Date().toISOString().slice(0,10) }

export default function Home(){
  const [user,setUser]=useState<any>(null)
  const [profile,setProfile]=useState<any>(null)
  const [tasks,setTasks]=useState<Task[]>([])
  const [logs,setLogs]=useState<Log[]>([])
  const [ideas,setIdeas]=useState<Idea[]>([])
  const [tab,setTabState]=useState<Tab>('today')
  const setTab = (t: Tab) => {
    setTabState(t);
    if (typeof window !== 'undefined') localStorage.setItem('habitlab-tab', t);
  }
  const [loading,setLoading]=useState(true)
  const [authMode,setAuthMode]=useState<'login'|'signup'>('login')
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [displayName,setDisplayName]=useState(''); const [authError,setAuthError]=useState('')
  const [newTask,setNewTask]=useState(''); const [category,setCategory]=useState('Learn'); const [minutes,setMinutes]=useState(10)
  const [idea,setIdea]=useState('')
  
  // Gossip States
  const [gossips,setGossips]=useState<Gossip[]>([])
  const [persons,setPersons]=useState<Person[]>([])
  const [newGossip,setNewGossip]=useState('')
  const [personName,setPersonName]=useState('')
  const [personTag,setPersonTag]=useState('')
  const [personDesc,setPersonDesc]=useState('')
  const [personType,setPersonType]=useState<'loved'|'hated'>('hated')
  const [personGender,setPersonGender]=useState('secret')
  const [personWeapon,setPersonWeapon]=useState('')
  const [personError,setPersonError]=useState('')
  const [personToConfirmDestroy, setPersonToConfirmDestroy] = useState<{person: Person, method: 'burn'|'shoot'|'sword'} | null>(null);
  
  const stupidThoughts = [
    "Padikkan irikkumbo mathram aanu fan-inte shabdam shraddikunnathu. 🦟",
    "Exam hall-il question paper kaanumbol ormakal varilla... pakshe 10 varsham munpathe movie dialogue varum. 🎬",
    "'Naale muthal serious aayi padikkanam' - The biggest lie ever told in Kerala. 🤥",
    "If 'Madi' was an Olympic sport, njan urappayum swarnam adichene. 🥇",
    "Pothu pole thinnal mathram pora, pothinulla buddhiyum koodi venam. 🐃",
    "Chila nerath thonnum ellam nirthi himalayathil poyaalo ennu... ⛰️",
    "Book thurakkumbol varunna aa urakkam... athoru prathyeka feel aaanu. 😴",
    "Urakkam varunnilla? Just open your textbook. Instant sleep guaranteed. 📖💤"
  ];
  const [randomThought, setRandomThought] = useState(stupidThoughts[0]);
  const shuffleThought = () => setRandomThought(stupidThoughts[Math.floor(Math.random() * stupidThoughts.length)]);

  const [monkeyMsg, setMonkeyMsg] = useState('');
  const monkeyDialogues = [
    "Njan onnum kettillayee! 🙉",
    "Aaro vannu... marakku! 🙈",
    "Para para, njan aarodum parayilla 🙊",
    "Onnu poyitharamo, njan kettu padikkuva! 🐒",
    "Aara ee thengil keriyathu? 👀",
    "Scoop entha makkale? ☕"
  ];
  const pokeMonkey = () => {
    setMonkeyMsg(monkeyDialogues[Math.floor(Math.random() * monkeyDialogues.length)]);
    setTimeout(() => setMonkeyMsg(''), 3000);
  };
  
  const [dark,setDark]=useState(false); const [roast,setRoast]=useState(roasts[0]); const [pep,setPep]=useState(pepTalks[0])
  
  // Timer State
  const [timer,setTimer]=useState(0); 
  const [timerRunning,setTimerRunning]=useState(false)
  const endTimeRef = useRef<number|null>(null);
  const intervalRef = useRef<number|null>(null);

  // Water Reminder State
  const [showWaterReminder, setShowWaterReminder] = useState(false);
  const [waterRoast, setWaterRoast] = useState('');
  
  // Prank & Compliment States
  const [prankActive, setPrankActive] = useState(false);
  const [compliments, setCompliments] = useState<{id: number, x: number, y: number, text: string}[]>([]);

  // Overthinking Bin State
  const [distraction, setDistraction] = useState('');
  const [isBurning, setIsBurning] = useState(false);
  const burnThought = () => {
    if (!distraction.trim()) return;
    setIsBurning(true);
    setTimeout(() => {
      setDistraction('');
      setIsBurning(false);
    }, 1000);
  }

  // Playlist DB Functions
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [newSong, setNewSong] = useState('');
  
  const addSong = async () => {
    if (!newSong.trim() || !user) return;
    const { data } = await supabase.from('songs').insert({user_id: user.id, title: newSong.trim()}).select().single();
    if (data) {
      setPlaylist(v => [data, ...v]);
      setNewSong('');
    }
  };
  const removeSong = async (id: string) => {
    try {
      console.log("Removing song with ID:", id);
      setPlaylist(v => v.filter(s => s.id !== id));
      const { error } = await supabase.from('songs').delete().eq('id', id);
      if (error) console.error("DB Delete Error:", error);
    } catch (err) {
      console.error("Exception in removeSong:", err);
    }
  };

  // Paradhushanam DB Functions
  const addGossip = async () => {
    if (!newGossip.trim() || !user) return;
    const { data } = await supabase.from('gossips').insert({user_id: user.id, content: newGossip.trim()}).select().single();
    if (data) { setGossips(v => [data, ...v]); setNewGossip(''); }
  };
  const removeGossip = async (id: string) => {
    try {
      setGossips(v => v.filter(g => g.id !== id));
      await supabase.from('gossips').delete().eq('id', id);
    } catch (e) {}
  };
  const addPerson = async () => {
    if (!personName.trim() || !personTag.trim()) {
      setPersonError('Nokki adikku mone! 🤦‍♂️ Name-um Tag-um nirbandham aanu. (Mandatory fields)');
      return;
    }
    if (!user) return;
    
    setPersonError('');
    const { data } = await supabase.from('persons').insert({
      user_id: user.id, name: personName.trim(), type: personType, 
      tag: personTag.trim(), description: personDesc.trim(), 
      gender: personGender, weapon: personWeapon.trim() || null
    }).select().single();
    if (data) { 
      setPersons(v => [data, ...v]); 
      setPersonName(''); setPersonTag(''); setPersonDesc(''); setPersonWeapon('');
    }
  };
  const initiateDestroy = (person: Person, method: 'burn' | 'shoot' | 'sword') => {
    if (person.type === 'loved') {
      setPersonToConfirmDestroy({ person, method });
    } else {
      executeDestroy(person.id, method);
    }
  };

  const executeDestroy = async (id: string, method: 'burn' | 'shoot' | 'sword') => {
    const el = document.getElementById(`person-${id}`);
    if (el) {
      if (method === 'burn') el.classList.add('burn-anim-intense');
      if (method === 'shoot') el.classList.add('shoot-anim');
      if (method === 'sword') el.classList.add('sword-anim');
    }
    setTimeout(async () => {
      setPersons(v => v.filter(p => p.id !== id));
      await supabase.from('persons').delete().eq('id', id);
    }, 1400); // Wait for the intense animation
  };

  // Peeking Uncle State
  const [showUncle, setShowUncle] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setShowUncle(true);
      setTimeout(() => setShowUncle(false), 8000);
    }, 15 * 60 * 1000); // 15 minutes
    return () => clearInterval(interval);
  }, []);

  useEffect(()=>{
    const saved=localStorage.getItem('habitlab-theme'); setDark(saved==='dark')
    const savedTab = localStorage.getItem('habitlab-tab'); if (savedTab) setTab(savedTab as Tab);
    setRoast(roasts[Math.floor(Math.random()*roasts.length)])
    setPep(pepTalks[Math.floor(Math.random()*pepTalks.length)])
    supabase.auth.getUser().then(({data})=>{setUser(data.user);setLoading(false);if(data.user)load(data.user.id)})
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>{setUser(s?.user??null);if(s?.user)load(s.user.id)})
    return ()=>subscription.unsubscribe()
  },[])

  useEffect(()=>{
    document.documentElement.dataset.theme=dark?'dark':'light';
    localStorage.setItem('habitlab-theme',dark?'dark':'light')
  },[dark])

  // Water Reminder Logic
  useEffect(() => {
    if(!user) return;
    const roasts = [
      "Machane, vellam kudikku. Kidneys cry cheyyunnu! 🚰",
      "Vellam kudikkeda madiya! Hydration is important. 💧",
      "Oru glass vellam kudichittu bakki pani. Go! 🏃‍♂️",
      "Dehydration adichu chavum. Poi vellam kudi! 🚰",
      "Body full of madi, at least pour some water in it! 🧊"
    ];
    let timeoutId: number;
    const triggerReminder = () => {
      setWaterRoast(roasts[Math.floor(Math.random() * roasts.length)]);
      setShowWaterReminder(true);
      const nextGap = Math.floor(Math.random() * (45 * 60000 - 30 * 60000 + 1) + 30 * 60000);
      timeoutId = window.setTimeout(triggerReminder, nextGap);
    };
    const initialGap = Math.floor(Math.random() * (45 * 60000 - 30 * 60000 + 1) + 30 * 60000); // 30-45 mins
    timeoutId = window.setTimeout(triggerReminder, initialGap);
    return () => clearTimeout(timeoutId);
  }, [user]);

  // Robust Timer Logic
  useEffect(()=>{
    if(timerRunning && timer > 0) {
      endTimeRef.current = Date.now() + timer * 1000;
      intervalRef.current = window.setInterval(() => {
        const remaining = Math.max(0, Math.round((endTimeRef.current! - Date.now()) / 1000));
        setTimer(remaining);
        if (remaining <= 0) {
          setTimerRunning(false);
          window.clearInterval(intervalRef.current!);
          // Confetti or fun alert can go here
        }
      }, 1000);
    } else {
      if(intervalRef.current) window.clearInterval(intervalRef.current);
    }
    return () => {
      if(intervalRef.current) window.clearInterval(intervalRef.current);
    }
  }, [timerRunning]) // We only depend on timerRunning because timer changes every second

  const toggleTimer = () => {
    if (!timer) setTimer(300); // default 5 minutes for lazy ppl
    setTimerRunning(!timerRunning);
  }

  async function load(uid:string){
    const {data:p}=await supabase.from('profiles').select('*').eq('id',uid).maybeSingle(); setProfile(p)
    let {data:t}=await supabase.from('tasks').select('*').eq('user_id',uid).eq('active',true).order('created_at',{ascending:true})
    if(!t || t.length===0){ const seed=starter.map(x=>({...x,user_id:uid,active:true})); const seeded=await supabase.from('tasks').insert(seed).select(); t=seeded.data||[] }
    const {data:l}=await supabase.from('task_logs').select('id,task_id,completed_on').eq('user_id',uid)
    const {data:i}=await supabase.from('ideas').select('*').eq('user_id',uid).order('created_at',{ascending:false})
    const {data:s}=await supabase.from('songs').select('*').eq('user_id',uid).order('created_at',{ascending:false})
    const {data:g}=await supabase.from('gossips').select('*').eq('user_id',uid).order('created_at',{ascending:false})
    const {data:pers}=await supabase.from('persons').select('*').eq('user_id',uid).order('created_at',{ascending:false})
    setTasks(t||[]);setLogs(l||[]);setIdeas(i||[]);setPlaylist(s||[]);setGossips(g||[]);setPersons(pers||[]);
  }
  async function auth(){
    setAuthError(''); 
    if(!email||!password){setAuthError('Email & Password type cheyy machane. Veruthe click aakathe.');return}
    if(password.length<6){setAuthError('Password need 6+ characters. At least add some 1234s.');return}
    
    if(authMode==='signup'){
      const {data,error}=await supabase.auth.signUp({email,password,options:{data:{display_name:displayName||email.split('@')[0]}}})
      if(error){
        if(error.message.includes('already registered')) setAuthError('Aliya, you already have an account! Just Log in.');
        else if(error.message.includes('validate email address')) setAuthError('Ithu enthu email aada? Type a real one.');
        else setAuthError(error.message);
        return;
      }
      if(!data.session) {
        setAuthError('Account created! But check your email for the magic link (if confirmation is on).');
      }
    }else{
      const {error}=await supabase.auth.signInWithPassword({email,password});
      if(error) {
        if(error.message.includes('Invalid login credentials')) setAuthError('Wrong email or password! Mathi marannupooya?');
        else setAuthError(error.message);
      }
    }
  }
  async function addTask(){
    if(!newTask.trim()||!user)return
    const row={user_id:user.id,title:newTask.trim(),category,minutes,xp:Math.max(10,minutes*2),active:true}
    const {data,error}=await supabase.from('tasks').insert(row).select().single(); if(!error&&data){setTasks(v=>[...v,data]);setNewTask('')}
  }
  async function toggle(t:Task, e?: React.MouseEvent){
    if(!user)return; 
    const mouseX = e?.clientX || window.innerWidth / 2;
    const mouseY = e?.clientY || window.innerHeight / 2;
    const d=today(); const existing=logs.find(l=>l.task_id===t.id&&l.completed_on===d)
    if(existing){
      await supabase.from('task_logs').delete().eq('id',existing.id);setLogs(v=>v.filter(x=>x.id!==existing.id))
    } else {
      const {data,error}=await supabase.from('task_logs').insert({task_id:t.id,user_id:user.id,completed_on:d}).select('id,task_id,completed_on').single();
      if(!error&&data) {
        setLogs(v=>[...v,data]);
        const texts = ["Pwolichu! 🔥", "Kidilam! 🚀", "Minni machane! ✨", "Sambhavam thanne!", "Madi maariyo? 👀", "Adipoli! 🎉", "Kalakki! 💥"];
        const text = texts[Math.floor(Math.random() * texts.length)];
        const id = Date.now();
        setCompliments(prev => [...prev, {id, x: mouseX, y: mouseY, text}]);
        setTimeout(() => setCompliments(prev => prev.filter(c => c.id !== id)), 1500);
      }
    }
  }
  async function remove(id:string){await supabase.from('tasks').update({active:false}).eq('id',id);setTasks(v=>v.filter(t=>t.id!==id))}
  async function addIdea(){if(!idea.trim()||!user)return;const {data}=await supabase.from('ideas').insert({user_id:user.id,text:idea.trim()}).select().single();if(data){setIdeas(v=>[data,...v]);setIdea('')}}
  async function removeIdea(id:string){await supabase.from('ideas').delete().eq('id',id);setIdeas(v=>v.filter(i=>i.id!==id))}
  async function logout(){await supabase.auth.signOut();setTasks([]);setLogs([]);setIdeas([]);setUser(null);setProfile(null)}
  async function saveProfile(){if(!user)return;const name=displayName.trim()||profile?.display_name||email.split('@')[0];const {data}=await supabase.from('profiles').upsert({id:user.id,display_name:name}).select().single();if(data)setProfile(data)}

  // Quick action for lazy mode
  function triggerLazyMode() {
    const lazyTasks = [
      "Stare at ceiling for 2 mins",
      "Drink exactly 1 sip of water",
      "Organize 1 folder on desktop",
      "Think about studying for 10s",
      "Breathe in, breathe out... pwoli",
    ];
    setNewTask(lazyTasks[Math.floor(Math.random() * lazyTasks.length)]);
    setCategory('Other');
    setMinutes(2);
    document.getElementById('quests')?.scrollIntoView({behavior:'smooth'});
  }

  const todayLogs=logs.filter(l=>l.completed_on===today())
  const done=tasks.filter(t=>todayLogs.some(l=>l.task_id===t.id)).length
  const totalXP=logs.reduce((a,l)=>a+(tasks.find(t=>t.id===l.task_id)?.xp||0),0)
  const completion=tasks.length?Math.round(done/tasks.length*100):0
  const streakDays=useMemo(()=>{let n=0;const set=new Set(logs.map(x=>x.completed_on));for(let i=0;i<60;i++){const d=new Date();d.setDate(d.getDate()-i);if(set.has(d.toISOString().slice(0,10)))n++;else break}return n},[logs])
  
  // Weekly bars
  const weekly=useMemo(()=>Array.from({length:7},(_,idx)=>{const d=new Date();d.setDate(d.getDate()-(6-idx));const key=d.toISOString().slice(0,10);return {key,day:d.toLocaleDateString('en-US',{weekday:'short'}),count:logs.filter(l=>l.completed_on===key).length}}),[logs])
  
  // Github-like Heatmap logic (last 84 days = 12 weeks)
  const heatMapDays = useMemo(() => {
    const arr = [];
    const _today = new Date();
    for(let i=0; i<84; i++) {
      const d = new Date();
      d.setDate(_today.getDate() - (83 - i));
      arr.push({ date: d.toISOString().slice(0,10), day: d.getDay() });
    }
    return arr;
  }, [logs])

  const rank=totalXP<200?'Pavam Beginner (Madiyan)':totalXP<500?'Getting Serious Aliya':totalXP<1000?'Consistency Goblin':'Pwoli Saanam'
  const formatTime=(s:number)=>`${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`

  if(loading)return <main className="loading"><div className="loading-orb">😴</div><p>brain cell initializing…</p></main>
  
  if(!user)return <main className="login">
    <div className="floating-sticker fs-1 sticker wiggle-anim" style={{top:'15%', left:'20%'}}>WAKE UP ALIYA</div>
    <div className="floating-sticker fs-2 sticker pulse-anim" style={{bottom:'15%', right:'20%', transform:'rotate(25deg)'}}>NO MADI ALLOWED</div>
    
    <div className="login-card hover-lift">
      <div className="logo pulse-anim">HL<span>🧪</span></div>
      <div className="sticker tilt">FOR LAZY PEOPLE WITH BIG PLANS</div>
      <p className="eyebrow" style={{marginTop:'15px'}}>A GENERAL-PURPOSE LIFE + LEARNING TRACKER</p>
      <h1>{authMode==='login'?'Welcome back, machane.':'Build your tiny universe.'}</h1>
      <p>Tasks, habits, ideas, experiments, focus sessions and gentle chaos. No productivity-bro energy required.</p>
      
      <div className="input-group">
        {authMode==='signup'&&<input className="fun-input" value={displayName} onChange={e=>setDisplayName(e.target.value)} placeholder="What should we call you?"/>}
        <input className="fun-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email (a real one please)"/>
        <input className="fun-input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password (6+ characters)"/>
      </div>
      
      <button className="primary big bounce-hover" onClick={auth} style={{fontSize:'16px'}}>
        {authMode==='login'?'Enter my universe':'Create my universe'} <Sparkles size={18}/>
      </button>
      
      {authError&&<div className="fun-error-box jiggle-hover">
        <b>🤦‍♂️ Ayyo!</b>
        <p>{authError}</p>
      </div>}
      
      <button className="text-btn" onClick={()=>{setAuthMode(authMode==='login'?'signup':'login');setAuthError('')}}>
        {authMode==='login'?'New here? Create account machane':'Already have an account? Log in'}
      </button>
      <small>Free • Your stuff stays attached to your account</small>
    </div>
    <div className="login-doodle float-anim">നാളെ നോക്കാം<br/><span>not today.</span></div>
  </main>

  return <main className="app-shell">
    {/* Fun Background Elements */}
    <div className="fun-bg-shape shape-1"/>
    <div className="fun-bg-shape shape-2"/>
    <div className="fun-bg-shape shape-3"/>

    <header className="topbar">
      <div className="brand">
        <span className="logo mini wiggle-hover">HL<span>🧪</span></span>
        <span className="brand-name">HABIT LAB <i>the lazy way</i></span>
      </div>
      <nav>
        <button className={tab==='today'?'active':''} onClick={()=>setTab('today')}>Today</button>
        <button className={tab==='lab'?'active':''} onClick={()=>setTab('lab')}>Brain Lab</button>
        <button className={tab==='canvas'?'active':''} onClick={()=>setTab('canvas')}>Idea Wall</button>
        <button className={tab==='music'?'active':''} onClick={()=>setTab('music')}>Music</button>
        <button className={tab==='gossip'?'active':''} onClick={()=>setTab('gossip')}>Gossips 👀</button>
        <button className={tab==='account'?'active':''} onClick={()=>setTab('account')}>Me</button>
      </nav>
      <div className="top-actions">
        <button className="icon-pill spin-hover" title="Change vibe" onClick={()=>{setRoast(roasts[Math.floor(Math.random()*roasts.length)]);setPep(pepTalks[Math.floor(Math.random()*pepTalks.length)])}}><Shuffle size={16}/></button>
        <button className="icon-pill pop-hover" title="Toggle dark mode" onClick={()=>setDark(v=>!v)}>{dark?<Sun size={16}/>:<Moon size={16}/>}</button>
        <button className="ghost jiggle-hover" onClick={logout}><LogOut size={15}/> <span>Exit</span></button>
      </div>
    </header>

    {tab==='today'&&<>
      <section className="hero general reveal">
        <div className="hero-copy">
          <div className="sticker tilt pulse-anim">NO PERFECT DAYS ALLOWED</div>
          <p className="eyebrow">TODAY • {new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'short'})}</p>
          <h1>Do a little.<br/><em>Then go sleep.</em></h1>
          <p className="sub">Study. Work. Gym. Just one tiny thing. Anything that matters to you gets a tiny checkbox here. We embrace the lazy here.</p>
          <div className="hero-actions">
            <button className="primary bounce-hover" onClick={()=>{document.getElementById('quests')?.scrollIntoView({behavior:'smooth'});}}><Play size={17}/> Start something</button>
            <button className="secondary pop-hover" onClick={triggerLazyMode}><Coffee size={16}/> Madiyan Mode</button>
          </div>
        </div>
        <div className="mood-card float-anim">
          <div className="scribble">✦</div>
          <span>today's vibe</span>
          <strong>{pep}</strong>
          <small>“{roast}”</small>
          <button onClick={()=>{setRoast(roasts[Math.floor(Math.random()*roasts.length)]);setPep(pepTalks[Math.floor(Math.random()*pepTalks.length)])}}><Shuffle size={14}/> new vibe</button>
        </div>
      </section>

      <section className="stats reveal" style={{animationDelay:'0.1s'}}>
        <div className="hover-lift"><Flame/><b>{streakDays}</b><span>day chain</span></div>
        <div className="hover-lift"><Zap/><b>{totalXP}</b><span>tiny XP</span></div>
        <div className="hover-lift"><Target/><b>{done}/{tasks.length}</b><span>today</span></div>
        <div className="hover-lift"><Trophy/><b>{rank}</b><span>current form</span></div>
      </section>

      <section className="dashboard-grid" id="quests">
        <div className="panel quests reveal" style={{animationDelay:'0.2s'}}>
          <div className="floating-sticker fs-1 sticker wiggle-anim">ADICHU KERI VA!</div>
          <div className="panel-head">
            <div>
              <p className="eyebrow">YOUR QUEST BOARD</p>
              <h2>What matters today?</h2>
            </div>
            <span className="badge bounce-anim">{completion}% done</span>
          </div>
          <div className="add">
            <input value={newTask} onChange={e=>setNewTask(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addTask()} placeholder="Add anything… gym, read, or just breathe"/>
            <select value={category} onChange={e=>setCategory(e.target.value)}>
              {categories.map(c=><option key={c}>{c}</option>)}
            </select>
            <select value={minutes} onChange={e=>setMinutes(+e.target.value)}>
              <option value={2}>2m</option>
              <option value={5}>5m</option>
              <option value={10}>10m</option>
              <option value={20}>20m</option>
              <option value={30}>30m</option>
            </select>
            <button className="primary scale-hover" onClick={addTask}><Plus size={18}/> Add</button>
          </div>
          <div className="task-list">
            {tasks.map(t=>{
              const isDone=todayLogs.some(l=>l.task_id===t.id);
              const Icon=categoryIcons[t.category]||MoreHorizontal;
              return <div 
                className={`task jiggle-hover ${isDone?'done':''}`} 
                key={t.id}
                onClick={(e) => {
                  if (!(e.target as HTMLElement).closest('button')) toggle(t, e as any);
                }}
                style={{cursor: 'pointer'}}
              >
                <button className="check pop-hover" onClick={(e)=>{ e.stopPropagation(); toggle(t, e); }}>
                  {isDone?<RotateCcw size={15}/>:<Icon size={15}/>}
                </button>
                <div className="task-main">
                  <b>{t.title}</b>
                  <span>{t.category} • {t.minutes} min • {isDone ? '-' : '+'}{t.xp} XP</span>
                </div>
                <div className="task-status" style={{
                  background: isDone ? 'var(--pink)' : 'var(--line)', 
                  color: isDone ? 'white' : 'var(--muted)',
                  fontWeight: isDone ? 800 : 600
                }}>
                  {isDone?'Undo ↺':`${t.minutes}m`}
                </div>
                <button className="icon-btn" title="Remove" onClick={(e)=>{ e.stopPropagation(); remove(t.id); }}><Trash2 size={16}/></button>
              </div>
            })}
          </div>
          {tasks.length===0&&<div className="empty">Empty board. Valiya madiyan aanalle? 😭 Add one tiny thing.</div>}
        </div>

        <aside className="side-stack">
          <div className="panel roast-card reveal" style={{animationDelay:'0.3s'}}>
            <div className="sticker">ROAST / SUPPORT</div>
            <h3>{roast}</h3>
            <p>We accept laziness here. We just don't let it run the whole government.</p>
            <div style={{display:'flex', gap:'10px', marginTop:'15px', flexWrap: 'wrap'}}>
              <button className="secondary" style={{flex:1, minWidth:'120px'}} onClick={()=>setRoast(roasts[Math.floor(Math.random()*roasts.length)])}><Shuffle size={14}/> Roast me again</button>
              <button 
                onClick={() => { 
                  setPrankActive(true); 
                  try {
                    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                    const osc = ctx.createOscillator();
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(150, ctx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 1);
                    osc.connect(ctx.destination);
                    osc.start(); osc.stop(ctx.currentTime + 1.5);
                  } catch(e) {}
                  setTimeout(() => setPrankActive(false), 2000); 
                }} 
                className="secondary" 
                style={{flex:1, minWidth:'120px', background: 'var(--pink)', color: 'white', border: '2px solid var(--ink)', cursor: 'pointer'}}
              >
                Ithu click cheyyalle! 🚫
              </button>
            </div>
          </div>
          <div className={`panel timer-card reveal ${timerRunning ? 'running' : ''}`} style={{animationDelay:'0.4s'}}>
            <div className="timer-top">
              <div>
                <p className="eyebrow">FOCUS POCKET</p>
                <h3>{timer?'Tiny rescue timer':'No giant sessions.'}</h3>
              </div>
              <Timer/>
            </div>
            <div className={`timer-number ${timerRunning ? 'timer-active-anim' : 'heartbeat-anim'}`}>{timer?formatTime(timer):'05:00'}</div>
            
            {!timerRunning && (
              <div style={{display:'flex', gap:'8px', marginBottom:'15px', justifyContent: 'center', flexWrap: 'wrap'}}>
                 <button onClick={()=>setTimer(5*60)} className="badge" style={{cursor:'pointer'}}>5m</button>
                 <button onClick={()=>setTimer(10*60)} className="badge" style={{cursor:'pointer'}}>10m</button>
                 <button onClick={()=>setTimer(25*60)} className="badge" style={{cursor:'pointer'}}>25m</button>
                 <button onClick={()=>{
                   const mins = prompt("Eathra minute venam? (Type minutes):");
                   if(mins && !isNaN(Number(mins)) && Number(mins)>0) setTimer(Number(mins)*60);
                 }} className="badge" style={{cursor:'pointer', background: 'var(--paper)'}}>Custom ⚙️</button>
              </div>
            )}

            <div className="timer-controls">
              <button className="primary bounce-hover" onClick={toggleTimer}>
                {timerRunning?<Pause size={16}/>:<Play size={16}/>} {timerRunning?'pause':'start'}
              </button>
              <button className="icon-pill spin-hover" onClick={()=>{setTimer(0);setTimerRunning(false)}}><RotateCcw size={16}/></button>
            </div>
            <small>Rule: you may stop after this. Pwolikkam.</small>
          </div>
        </aside>
      </section>

      {/* Emergency Chaya Break Section */}
      <section className="panel reveal" style={{animationDelay:'0.45s', margin: '0 auto 55px', maxWidth: '1250px', background: 'var(--lime)', border: '2px solid var(--ink)', boxShadow: '6px 6px 0 var(--ink)'}}>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '30px', alignItems: 'center', justifyContent: 'space-between'}}>
          <div style={{flex: 1, minWidth: '300px'}}>
            <div className="sticker tilt" style={{background: 'var(--paper)', color: 'var(--ink)'}}>EMERGENCY KIT</div>
            <h2 style={{fontFamily: 'var(--display)', fontSize: '36px', margin: '15px 0 10px', color: 'var(--ink)', letterSpacing: '-0.03em'}}>Oru chaya kudichaalo? ☕</h2>
            <p style={{fontSize: '15px', color: 'var(--ink)', fontWeight: 600, opacity: 0.8, maxWidth: '400px', lineHeight: 1.6}}>
              Madi pidichu irikkuvaano? Brain full aayo? Take a strict break. 
              Do not touch your phone. Drink water, look at the ceiling, or have a kattan.
            </p>
          </div>
          <div style={{display: 'flex', gap: '15px', flexWrap: 'wrap', flex: 1}}>
             <button className="method hover-lift" onClick={() => {setTimer(300); setTimerRunning(true); document.getElementById('quests')?.scrollIntoView({behavior:'smooth'})}} style={{flex: 1, minHeight: 'auto', background: 'var(--card)', padding: '20px', cursor: 'pointer', textAlign: 'left', border: '2px solid var(--ink)', borderRadius: '16px'}}>
                <b style={{display: 'block', fontSize: '18px', fontFamily: 'var(--display)', marginBottom: '5px'}}>Kattan Chaya (5m)</b>
                <span style={{fontSize: '12px', color: 'var(--muted)', fontWeight: 600}}>Step away. Sip slowly. No reels.</span>
             </button>
             <button className="method hover-lift" onClick={() => {setTimer(120); setTimerRunning(true); document.getElementById('quests')?.scrollIntoView({behavior:'smooth'})}} style={{flex: 1, minHeight: 'auto', background: 'var(--pink)', padding: '20px', cursor: 'pointer', textAlign: 'left', border: '2px solid var(--ink)', borderRadius: '16px'}}>
                <b style={{display: 'block', fontSize: '18px', fontFamily: 'var(--display)', marginBottom: '5px'}}>Vellam Kudi (2m)</b>
                <span style={{fontSize: '12px', color: 'var(--ink)', fontWeight: 600, opacity: 0.8}}>Sthalam vittu poyi vellam kudikk.</span>
             </button>
             <button className="method hover-lift" onClick={() => {setTimer(600); setTimerRunning(true); document.getElementById('quests')?.scrollIntoView({behavior:'smooth'})}} style={{flex: 1, minHeight: 'auto', background: 'var(--cyan)', padding: '20px', cursor: 'pointer', textAlign: 'left', border: '2px solid var(--ink)', borderRadius: '16px'}}>
                <b style={{display: 'block', fontSize: '18px', fontFamily: 'var(--display)', marginBottom: '5px'}}>Kathi Adi (10m)</b>
                <span style={{fontSize: '12px', color: 'var(--ink)', fontWeight: 600, opacity: 0.8}}>Talk to someone. Maximum 10 mins.</span>
             </button>
          </div>
        </div>
      </section>

      {/* Overthinking / Distraction Dump */}
      <section className="panel reveal" style={{animationDelay:'0.48s', margin: '0 auto 55px', maxWidth: '1250px', background: 'var(--orange)', border: '2px solid var(--ink)', boxShadow: '6px 6px 0 var(--ink)'}}>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '30px', alignItems: 'flex-start'}}>
          <div style={{flex: 1, minWidth: '300px'}}>
            <div className="sticker tilt" style={{background: 'var(--pink)', color: 'white'}}>CHAVAR KUTTA 🗑️</div>
            <h2 style={{fontFamily: 'var(--display)', fontSize: '32px', margin: '15px 0 10px', color: 'var(--ink)'}}>Kachaara Chinthakal</h2>
            <p style={{fontSize: '15px', color: 'var(--ink)', fontWeight: 600, opacity: 0.9, lineHeight: 1.6}}>
              Mindil valla stupid overthinking or distractions varunnundo? Type it here and burn it. Poyi padikkeda madiya!
            </p>
          </div>
          <div style={{flex: 1.5, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '15px'}}>
             <div style={{position: 'relative', width: '100%'}}>
               <textarea 
                 value={distraction}
                 onChange={(e) => setDistraction(e.target.value)}
                 placeholder="E.g., Njan ippo instagram thurannal enthavum..."
                 className={`fun-input ${isBurning ? 'burn-anim' : ''}`}
                 style={{width: '100%', minHeight: '100px', resize: 'none', background: 'var(--paper)', border: '2px solid var(--ink)', boxShadow: '4px 4px 0 var(--ink)', borderRadius: '16px', padding: '15px', fontSize: '16px', fontFamily: 'var(--mono)'}}
               />
               {isBurning && <div style={{position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', zIndex: 10, pointerEvents: 'none'}}>
                 <span className="fire-particle" style={{left:'10%', top:'20%', animationDelay:'0.1s'}}>🔥</span>
                 <span className="fire-particle" style={{left:'40%', top:'40%', fontSize:'60px'}}>💥</span>
                 <span className="fire-particle" style={{left:'70%', top:'10%', animationDelay:'0.2s'}}>🔥</span>
                 <span className="fire-particle" style={{left:'20%', top:'60%', animationDelay:'0.3s'}}>💨</span>
                 <span className="fire-particle" style={{left:'80%', top:'50%', animationDelay:'0.1s'}}>🔥</span>
               </div>}
             </div>
             <button onClick={burnThought} className="primary bounce-hover" style={{background: 'var(--ink)', color: 'var(--paper)', padding: '15px 30px', fontSize: '18px'}}>
               Theeyil iduka! 🔥 (Burn it)
             </button>
          </div>
        </div>
      </section>

      {/* GitHub-like Contribution Tracker */}
      <section className="heatmap panel reveal" style={{animationDelay:'0.5s', display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'center'}}>
        <div style={{flex: '1', minWidth: '300px'}}>
          <div className="panel-head" style={{marginBottom: '15px'}}>
            <div>
              <p className="eyebrow">CONSISTENCY GRAPH</p>
              <h2>Your Lazy Tracker (Last 12 weeks)</h2>
            </div>
            <Calendar color="var(--purple)" size={28} className="wiggle-anim" />
          </div>
          <div className="heatmap-scroll">
            <div className="heatmap-grid">
              {heatMapDays.map((d, i) => {
                const count = logs.filter(l => l.completed_on === d.date).length;
                let level = 0;
                if (count === 1) level = 1;
                if (count === 2) level = 2;
                if (count >= 3) level = 3;
                if (count >= 5) level = 4;
                return <div 
                  className={`heatmap-cell count-${level} pop-hover`} 
                  title={`${d.date}: ${count} tasks completed. ${count === 0 ? 'Madiyan' : 'Pwoli'}`} 
                  key={i} 
                />
              })}
            </div>
          </div>
        </div>

        {/* Fun Roast / Stats Section for the empty space */}
        <div className="consistency-roast hover-lift" style={{flex: '1', minWidth: '300px', backgroundColor: 'var(--paper)', padding: '24px', borderRadius: '16px', border: '2px dashed var(--line)', position: 'relative'}}>
          <div className="sticker tilt pulse-anim" style={{position: 'absolute', top: '-15px', right: '-10px', background: 'var(--pink)'}}>MADIYAN STATUS</div>
          <h3 style={{fontFamily: 'var(--display)', fontSize: '24px', marginBottom: '10px', color: 'var(--ink)'}}>
            {streakDays === 0 ? "Zero Streak. Valiya madiyan aanalle? 😂" : 
             streakDays < 3 ? "Aha! 1-2 days poyittu pinne kedann urangam le? 😴" : 
             streakDays < 7 ? "Ok machane, you are getting somewhere. Don't stop! 🚀" : 
             "Consistency Goblin 🔥 Mathi machane, theerkkalle."}
          </h3>
          <p style={{color: 'var(--muted)', fontWeight: 600, fontSize: '14px', lineHeight: 1.6}}>
            Your current consistency level is <b style={{color:'var(--purple)'}}>{rank}</b>. <br/>
            You have a <b style={{color:'var(--lime)', background:'var(--ink)', padding:'2px 6px', borderRadius:'6px'}}>{streakDays} day</b> streak right now. 
            <br/><br/>
            {streakDays === 0 ? "You haven't done anything today. Adichu keri vaa, start any 2 min task! Illenkil shavam aavum." : 
            "Keep feeding the heatmap. The darker the green, the less madiyan you are. Keep it going!"}
          </p>
        </div>
      </section>
    </>}

    {tab==='lab'&&<section className="page reveal">
      <div className="page-title">
        <div className="sticker tilt">ATOMIC HABITS & HACKS</div>
        <p className="eyebrow">THE BRAIN LAB</p>
        <h1>Make the brain<br/><em>cooperate.</em></h1>
        <p>Learning science + behaviour design + tiny experiments. Pick one method, try it, keep what works, ditch the rest.</p>
      </div>
      <div className="method-grid">
        {methods.map(([icon,title,body], i)=><article className="method hover-lift" key={title} style={{animationDelay:`${0.1 * i}s`}}>
          <span className="method-icon float-anim">{icon}</span>
          <h3>{title}</h3>
          <p>{body}</p>
          <button onClick={()=>{setIdea(`${title}: `);setTab('canvas')}}>Put this on my idea wall →</button>
        </article>)}
      </div>
      <div className="lab-challenge panel bounce-hover">
        <div>
          <p className="eyebrow">TODAY'S RANDOM CHALLENGE</p>
          <h2>Teach one thing badly, then better.</h2>
          <p>Pick any idea you learned today. Explain it out loud in 60 seconds without notes. Then check what you forgot.</p>
        </div>
        <button className="primary" onClick={()=>{setTimer(60);setTimerRunning(true);setTab('today')}}><Timer size={16}/> 60 sec timer</button>
      </div>
    </section>}

    {tab==='canvas'&&<section className="page reveal">
      <div className="page-title">
        <div className="sticker tilt wiggle-anim">VATTAAYA CHINTHAKAL 🧠</div>
        <p className="eyebrow">THE IDEA WALL</p>
        <h1>Thonniyavasangal okke<br/><em>ivide idka.</em></h1>
        <p>Varachu vekk. Ezhuthi vekk. Vattu ideas aanelum kuzhappam illa. Future-il ulla nee vannu clear aakki edutholum.</p>
      </div>

      {/* Stupid Random Malayalam Thought Section */}
      <div className="thought-bubble" style={{
        background: 'var(--lime)', 
        border: '3px solid var(--ink)', 
        borderRadius: '30px 30px 30px 0', 
        padding: '20px 30px', 
        margin: '0 auto 40px auto', 
        maxWidth: '800px', 
        boxShadow: '6px 6px 0 var(--ink)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        transform: 'rotate(-1deg)'
      }}>
        <div style={{flex: 1}}>
          <p className="eyebrow" style={{marginBottom: '5px', color: 'var(--ink)'}}>RANDOM STUPID THOUGHT 💭</p>
          <h3 style={{fontFamily: 'var(--display)', fontSize: '22px', color: 'var(--ink)', lineHeight: '1.4', margin: 0}}>
            "{randomThought}"
          </h3>
        </div>
        <button className="icon-pill spin-hover" onClick={shuffleThought} style={{background: 'var(--card)', border: '2px solid var(--ink)', cursor: 'pointer', padding: '15px'}} title="Change Thought">
          <Shuffle size={24} color="var(--ink)" />
        </button>
      </div>

      <div className="canvas-layout">
        <div className="board-panel pop-hover" style={{transform: 'none'}}>
          <DrawingBoard/>
        </div>
        <div className="panel ideas">
          <div className="panel-head">
            <div>
              <p className="eyebrow">CHINTHA-PETTI</p>
              <h2>Minnal Ideas ⚡</h2>
            </div>
            <Lightbulb className="pulse-anim" />
          </div>
          <div className="idea-add">
            <textarea value={idea} onChange={e=>setIdea(e.target.value)} placeholder="Enikku ithu padikkanam... / ithu polikkum..."/>
            <button className="primary bounce-hover" onClick={addIdea}><Plus size={18}/> Otti Vekk 📌</button>
          </div>
          
          <div className="ideas-grid">
            {ideas.map(i => (
              <div 
                className="sticky-note" 
                key={i.id} 
                id={`idea-${i.id}`}
              >
                <div style={{display: 'flex', alignItems: 'flex-start', gap: '8px'}}>
                  <Lightbulb size={16} style={{flexShrink: 0, marginTop: '2px', color: 'var(--ink)', opacity: 0.8}}/>
                  <span>{i.text}</span>
                </div>
                
                <button 
                  className="burn-btn" 
                  title="Burn it!" 
                  onClick={() => {
                    const el = document.getElementById(`idea-${i.id}`);
                    if(el) {
                      el.classList.add('burn-anim');
                      setTimeout(() => removeIdea(i.id), 800);
                    } else {
                      removeIdea(i.id);
                    }
                  }}
                >
                  🔥
                </button>
              </div>
            ))}
          </div>

          {!ideas.length&&<div className="empty">Oru ideayum illalle? Brain full urakkathilanu… 😴</div>}
        </div>
      </div>
    </section>}

    {tab==='account'&&<section className="page reveal">
      <div className="page-title">
        <div className="sticker tilt float-anim">YOUR CORNER OF THE INTERNET</div>
        <p className="eyebrow">ACCOUNT HQ</p>
        <h1>This chaos<br/><em>belongs to you.</em></h1>
        <p>Your account keeps tasks, activity and ideas separate from everyone else's.</p>
      </div>
      <div className="account-grid">
        <div className="panel account-panel hover-lift">
          <p className="eyebrow">PROFILE</p>
          <input value={displayName||profile?.display_name||''} onChange={e=>setDisplayName(e.target.value)} placeholder="Display name"/>
          <input value={user.email||''} disabled/>
          <button className="primary bounce-hover" onClick={saveProfile}>Save profile</button>
          <button className="secondary pop-hover" onClick={logout}><LogOut size={16}/> Log out</button>
        </div>
        <div className="panel account-panel hover-lift">
          <p className="eyebrow">VIBE SETTINGS</p>
          <button className="setting-row" onClick={()=>setDark(v=>!v)}>
            <span>{dark?<Moon/>:<Sun/>}<b>{dark?'Dark mode':'Light mode'}</b></span>
            <span className="setting-chip">{dark?'ON':'ON / OFF'}</span>
          </button>
          <div className="mini-stat"><span>XP</span><b>{totalXP}</b></div>
          <div className="mini-stat"><span>Current streak</span><b>{streakDays} days</b></div>
        </div>
      </div>
    </section>}

    {tab==='music'&&<section className="page reveal">
      <div className="page-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ flex: '1 1 300px' }}>
          <div className="sticker tilt float-anim">PATTU PETTI 🎧</div>
          <p className="eyebrow">LAZY PLAYLIST HQ</p>
          <h1>Padikkan irikkumbo<br/><em>mathram pattu venam.</em></h1>
          <p>Because the silence of your uncompleted tasks is too loud. Open your favorite app and vibe.</p>
        </div>
        
        {/* Dancing Stickman */}
        <div style={{ padding: '20px', background: 'var(--card)', border: '4px solid var(--ink)', borderRadius: '20px', boxShadow: '8px 8px 0 var(--ink)', transform: 'rotate(5deg)' }}>
          <svg viewBox="0 0 100 150" width="120" height="180" style={{overflow: 'visible'}}>
            <g className="stick-body">
              {/* Head */}
              <circle className="stick-head" cx="50" cy="30" r="16" stroke="var(--ink)" strokeWidth="6" fill="var(--paper)"/>
              {/* Torso */}
              <line x1="50" y1="46" x2="50" y2="90" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round"/>
              {/* Left Arm */}
              <g className="stick-arm-l" style={{transformOrigin: '50px 50px'}}>
                <line x1="50" y1="50" x2="20" y2="40" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round"/>
                <line x1="20" y1="40" x2="10" y2="10" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round"/>
              </g>
              {/* Right Arm */}
              <g className="stick-arm-r" style={{transformOrigin: '50px 50px'}}>
                <line x1="50" y1="50" x2="80" y2="40" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round"/>
                <line x1="80" y1="40" x2="90" y2="10" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round"/>
              </g>
              {/* Left Leg */}
              <g className="stick-leg-l" style={{transformOrigin: '50px 90px'}}>
                <line x1="50" y1="90" x2="30" y2="120" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round"/>
                <line x1="30" y1="120" x2="15" y2="150" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round"/>
              </g>
              {/* Right Leg */}
              <g className="stick-leg-r" style={{transformOrigin: '50px 90px'}}>
                <line x1="50" y1="90" x2="70" y2="120" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round"/>
                <line x1="70" y1="120" x2="85" y2="150" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round"/>
              </g>
            </g>
          </svg>
        </div>
      </div>
      <div className="account-grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'}}>
        <div className="panel hover-lift" style={{background: 'var(--lime)', border: '2px solid var(--ink)', cursor: 'pointer', padding: '30px'}} onClick={() => window.open('https://open.spotify.com', '_blank')}>
          <h2 style={{fontFamily: 'var(--display)', fontSize: '28px', color: 'var(--ink)'}}>Spotify</h2>
          <p style={{fontWeight: 600, opacity: 0.8, color: 'var(--ink)', fontSize: '15px'}}>Malayalam Lo-Fi aano? K-Pop aano? Poyi kettu padi machane.</p>
        </div>
        <div className="panel hover-lift" style={{background: 'var(--pink)', border: '2px solid var(--ink)', cursor: 'pointer', padding: '30px'}} onClick={() => window.open('https://music.apple.com', '_blank')}>
          <h2 style={{fontFamily: 'var(--display)', fontSize: '28px', color: 'var(--ink)'}}>Apple Music</h2>
          <p style={{fontWeight: 600, opacity: 0.8, color: 'var(--ink)', fontSize: '15px'}}>Rich madiyan. Spatial audio-il full vibe aakk.</p>
        </div>
        <div className="panel hover-lift" style={{background: 'var(--cyan)', border: '2px solid var(--ink)', cursor: 'pointer', padding: '30px'}} onClick={() => window.open('https://music.youtube.com', '_blank')}>
          <h2 style={{fontFamily: 'var(--display)', fontSize: '28px', color: 'var(--ink)'}}>YT Music</h2>
          <p style={{fontWeight: 600, opacity: 0.8, color: 'var(--ink)', fontSize: '15px'}}>Premium illel ad kettu kidannu padikk.</p>
        </div>
      </div>
      <div className="panel" style={{marginTop: '40px', background: 'var(--card)', overflow: 'hidden'}}>
        <h3 style={{fontFamily: 'var(--display)', fontSize: '24px', marginBottom: '15px'}}>Pattu List (Your Anthems)</h3>
        <p style={{marginBottom: '15px', fontWeight: 600, opacity: 0.8}}>Type your favorite study songs here. Ee list-il ulla pattukal kettaal thanne vibe varanam.</p>
        
        <div className="flex-wrap-mobile" style={{display: 'flex', gap: '10px', marginBottom: '30px'}}>
          <input 
            placeholder="E.g., Parayathe Ariyathe - Lofi Mix..."
            value={newSong}
            onChange={(e) => setNewSong(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addSong()}
            className="fun-input"
            style={{flex: 1, padding: '12px 15px', fontSize: '15px'}}
          />
          <button className="primary bounce-hover" onClick={addSong}><Plus size={18}/> Add Song</button>
        </div>

        <div className="playlist-grid">
          {playlist.map((s, i) => (
            <div className="cassette-tape pop-hover" key={s.id} style={{transform: `rotate(${i % 2 === 0 ? '-2' : '3'}deg)`}}>
              <div className="tape-label">
                <span className="tape-title">{s.title}</span>
                <span className="tape-sub">Vibe {i+1} 🎧</span>
              </div>
              <div className="tape-wheels">
                <div className="wheel"></div>
                <div className="wheel"></div>
              </div>
              <button className="icon-btn remove-song" onClick={(e) => { e.stopPropagation(); removeSong(s.id); }}><X size={16}/></button>
            </div>
          ))}
          {playlist.length === 0 && <div className="empty" style={{gridColumn: '1 / -1'}}>Pattu onnum ille? Oru pattu add cheythu vibe aakku! 🎶</div>}
        </div>
      </div>
    </section>}

    {tab==='gossip'&&<section className="hero general reveal gossip-hero" style={{ alignItems: 'flex-start', paddingTop: '40px' }}>
      <div className="hero-copy gossip-hero-copy" style={{marginBottom: '30px', position: 'sticky', top: '28vh', marginTop: '18vh'}}>
        <div className="sticker tilt pulse-anim">PARADHUSHANAM ☕</div>
        <h1>Gossip & Hit List</h1>
        <p>Because studying is hard, but talking about others is easy. Write down your gossips, add your chunks, and burn the haters! 🔥</p>
      </div>

      <div className="dashboard-grid">
        <div className="panel" style={{background: '#fef3c7', gridColumn: '1 / -1', border: '4px solid var(--ink)', boxShadow: '8px 8px 0 var(--ink)', position: 'relative'}}>
          {/* Fun Tea Stain */}
          <div style={{position: 'absolute', right: '20px', top: '20px', width: '60px', height: '60px', border: '4px solid rgba(139, 69, 19, 0.2)', borderRadius: '50%', pointerEvents: 'none'}}></div>
          
          <div className="panel-head" style={{borderBottom: '4px dashed var(--ink)', paddingBottom: '10px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap'}}>
            <h2 style={{color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '10px'}}>
              <span style={{fontSize: '40px', filter: 'drop-shadow(2px 2px 0 var(--ink))'}}>☕</span> Chayakada Gossips 🤫
            </h2>
            <div 
              style={{ position: 'relative', width: '90px', height: '90px', transform: 'rotate(5deg)', cursor: 'pointer', transition: 'transform 0.2s' }}
              onClick={pokeMonkey}
              onMouseEnter={e => e.currentTarget.style.transform = 'rotate(0deg) scale(1.1)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'rotate(5deg) scale(1)'}
            >
              {monkeyMsg && (
                <div className="pop-anim" style={{
                  position: 'absolute', top: '-45px', right: '50px', background: 'var(--paper)', 
                  color: 'var(--ink)', padding: '8px 12px', borderRadius: '20px 20px 0 20px', 
                  border: '2px solid var(--ink)', boxShadow: '3px 3px 0 var(--ink)', 
                  fontWeight: 800, fontSize: '13px', width: 'max-content', maxWidth: '160px', zIndex: 10
                }}>
                  {monkeyMsg}
                </div>
              )}
              <svg viewBox="0 0 100 100" width="100%" height="100%" style={{overflow: 'visible'}}>
                {/* Ears */}
                <circle cx="15" cy="50" r="14" fill="#8B4513" stroke="var(--ink)" strokeWidth="4"/>
                <circle cx="85" cy="50" r="14" fill="#8B4513" stroke="var(--ink)" strokeWidth="4"/>
                <circle cx="15" cy="50" r="7" fill="#D2B48C" stroke="var(--ink)" strokeWidth="2"/>
                <circle cx="85" cy="50" r="7" fill="#D2B48C" stroke="var(--ink)" strokeWidth="2"/>
                
                {/* Head */}
                <circle cx="50" cy="50" r="38" fill="#8B4513" stroke="var(--ink)" strokeWidth="4"/>
                
                {/* Face Area */}
                <path d="M 22 50 Q 50 15 78 50 Q 80 80 50 85 Q 20 80 22 50 Z" fill="#D2B48C" stroke="var(--ink)" strokeWidth="3"/>
                
                {/* Eyes (White part) */}
                <circle cx="36" cy="42" r="12" fill="white" stroke="var(--ink)" strokeWidth="3"/>
                <circle cx="64" cy="42" r="12" fill="white" stroke="var(--ink)" strokeWidth="3"/>
                
                {/* Pupils (Animated to peek) */}
                <g className="monkey-pupils">
                  <circle cx="36" cy="42" r="5" fill="var(--ink)"/>
                  <circle cx="64" cy="42" r="5" fill="var(--ink)"/>
                </g>
                
                {/* Nose & Mouth */}
                <ellipse cx="50" cy="62" rx="6" ry="4" fill="var(--ink)"/>
                <path d="M 40 72 Q 50 80 60 72" stroke="var(--ink)" strokeWidth="3" fill="none" strokeLinecap="round"/>

                {/* Hands covering eyes/ears/mouth */}
                <g className="monkey-hand-l" style={{transformOrigin: '25px 90px'}}>
                  <path d="M 10 100 Q 20 35 45 45 Q 50 50 45 55 Q 35 60 25 100 Z" fill="#8B4513" stroke="var(--ink)" strokeWidth="4" strokeLinejoin="round"/>
                  <circle cx="42" cy="48" r="7" fill="#D2B48C" stroke="var(--ink)" strokeWidth="2"/>
                </g>
                <g className="monkey-hand-r" style={{transformOrigin: '75px 90px'}}>
                  <path d="M 90 100 Q 80 35 55 45 Q 50 50 55 55 Q 65 60 75 100 Z" fill="#8B4513" stroke="var(--ink)" strokeWidth="4" strokeLinejoin="round"/>
                  <circle cx="58" cy="48" r="7" fill="#D2B48C" stroke="var(--ink)" strokeWidth="2"/>
                </g>
              </svg>
            </div>
          </div>
          <p style={{color: 'var(--ink)', fontSize: '18px', fontWeight: 800, marginBottom: '20px'}}>
            Nattukar ariyanda... Namukidayil maathram! What's the tea today? 🫖
          </p>
          <div className="add gossips-add" style={{gridTemplateColumns: '1fr auto', alignItems: 'flex-end', background: 'var(--card)', padding: '20px', borderRadius: '12px', border: '2px solid var(--ink)', boxShadow: '4px 4px 0 var(--ink)'}}>
            <textarea 
              className="fun-input" 
              style={{minHeight: '80px', resize: 'vertical', fontSize: '16px', background: 'var(--paper)', border: '2px dashed var(--ink)'}}
              placeholder="Ariyamo, innale aval/avan... 🫢💬" 
              value={newGossip} 
              onChange={e=>setNewGossip(e.target.value)} 
            />
            <button className="primary bounce-hover" style={{height: '100%', background: 'var(--orange)', color: 'white'}} onClick={addGossip}><Flame size={18}/> Kathikku 🔥</button>
          </div>
          
          <div className="task-list" style={{marginTop: '40px', display: 'flex', flexWrap: 'wrap', gap: '25px', padding: '10px', maxHeight: '350px', overflowY: 'auto', overflowX: 'hidden'}}>
            {gossips.map((g, index) => {
              const colors = ['#fffbeb', '#f0fdf4', '#fdf2f8', '#eff6ff', '#f5f3ff'];
              const bg = colors[index % colors.length];
              const tilt = (index % 2 === 0 ? 1 : -1) * (Math.random() * 3 + 1);
              return (
              <div key={g.id} className="pop-anim" style={{
                background: bg, 
                padding: '20px', 
                borderRadius: '2px 25px 2px 25px', 
                boxShadow: '4px 4px 0 var(--ink)', 
                border: '2px solid var(--ink)',
                transform: `rotate(${tilt}deg)`,
                position: 'relative',
                minWidth: '250px',
                maxWidth: '400px',
                flex: '1 1 auto',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'rotate(0deg) scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = `rotate(${tilt}deg) scale(1)`}
              >
                {/* Tape */}
                <div style={{position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%) rotate(-2deg)', background: 'rgba(255,255,255,0.7)', width: '60px', height: '20px', border: '1px solid rgba(0,0,0,0.2)', boxShadow: '1px 1px 0 rgba(0,0,0,0.1)', zIndex: 1}}></div>
                
                <p style={{fontSize: '17px', fontWeight: 700, margin: '15px 0', whiteSpace: 'pre-wrap', color: 'var(--ink)', fontFamily: 'var(--font-sans)'}}>
                  "{g.content}"
                </p>
                
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '20px', borderTop: '2px dashed rgba(0,0,0,0.2)', paddingTop: '15px'}}>
                  <div style={{display: 'flex', flexDirection: 'column'}}>
                    <span style={{fontSize: '13px', fontWeight: 800, color: 'var(--ink)', opacity: 0.6}}>Kivi kivi... 🦇</span>
                    <span style={{fontSize: '11px', fontWeight: 600, color: 'var(--ink)', opacity: 0.5}}>{new Date(g.created_at).toLocaleDateString()}</span>
                  </div>
                  <button className="icon-pill hover-lift" title="Remove Gossip" onClick={() => removeGossip(g.id)} style={{background: 'var(--ink)', color: 'white', padding: '8px', border: '2px solid var(--ink)', cursor: 'pointer'}}>
                    <Trash2 size={14}/>
                  </button>
                </div>
              </div>
            )})}
            {gossips.length === 0 && <div className="empty" style={{width: '100%', background: 'rgba(255,255,255,0.5)', color: 'var(--ink)', border: '2px dashed var(--ink)'}}>Nattukarude karyam ariyande irikkunnu? Aaraa e ee thengil keriyathu? 🤔 (No gossips yet!)</div>}
          </div>
        </div>

        <div className="panel" style={{background: 'var(--pink)', color: '#111', gridColumn: '1 / -1'}}>
          <div className="panel-head">
            <h2 style={{color: '#111'}}>Hit List & Chunks Form 💖🔪</h2>
          </div>
          <p style={{margin: '10px 0', fontWeight: 600}}>Add someone to love or burn. 🔥</p>
          
          <div className="add" style={{display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center'}}>
            <input className="fun-input" style={{flex: 1, minWidth: '200px'}} placeholder="Name (e.g. Appi Biju)" value={personName} onChange={e=>setPersonName(e.target.value)} />
            <select className="fun-input" value={personType} onChange={e=>setPersonType(e.target.value as any)}>
              <option value="loved">Chunk 💖</option>
              <option value="hated">Theppu / Hater 🔪</option>
            </select>
            <select className="fun-input" value={personGender} onChange={e=>setPersonGender(e.target.value as any)}>
              <option value="boy">Boy 👦</option>
              <option value="girl">Girl 👧</option>
              <option value="trans">Trans 🏳️‍⚧️</option>
              <option value="secret">Secret 🤐</option>
            </select>
            <input className="fun-input" style={{flex: 1, minWidth: '150px'}} placeholder="Tag (e.g. Visham 🐍)" value={personTag} onChange={e=>setPersonTag(e.target.value)} />
            <input className="fun-input" style={{flex: 1, minWidth: '150px'}} placeholder="Weapon (Optional) 🔫" value={personWeapon} onChange={e=>setPersonWeapon(e.target.value)} />
            <input className="fun-input" style={{flex: 2, minWidth: '250px'}} placeholder="Short desc (Why?)" value={personDesc} onChange={e=>setPersonDesc(e.target.value)} />
            <button className="primary bounce-hover" style={{background: '#111', color: 'white', borderColor: '#111', padding: '12px 25px'}} onClick={addPerson}>Add Person</button>
          </div>
          {personError && <div className="pop-anim" style={{marginTop: '15px', color: 'white', fontWeight: 800, fontSize: '15px', background: 'var(--orange)', padding: '12px 15px', borderRadius: '8px', border: '2px solid var(--ink)', boxShadow: '4px 4px 0 var(--ink)'}}>⚠️ {personError}</div>}
        </div>
        
        {/* Gallery outside the panel, taking up full space */}
        <div className="persons-grid" style={{gridColumn: '1 / -1'}}>
          {persons.map(p => {
            let avatarUrl = `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${p.name}`;
            if (p.gender === 'boy') avatarUrl = `https://api.dicebear.com/9.x/adventurer/svg?seed=${p.name}`;
            else if (p.gender === 'girl') avatarUrl = `https://api.dicebear.com/9.x/lorelei/svg?seed=${p.name}`;
            else if (p.gender === 'secret') avatarUrl = `https://api.dicebear.com/9.x/bottts/svg?seed=${p.name}`;
            else if (p.gender === 'trans') avatarUrl = `https://api.dicebear.com/9.x/micah/svg?seed=${p.name}`;

            return (
            <div key={p.id} id={`person-${p.id}`} className="person-card" style={{background: p.type === 'loved' ? '#ffc9e8' : '#cbd5e1', position: 'relative'}}>
              {p.type === 'hated' && (
                <div style={{position: 'absolute', top: '-10px', left: '-15px', background: 'var(--orange)', color: 'white', fontWeight: 800, padding: '4px 12px', transform: 'rotate(-10deg)', zIndex: 10, border: '2px dashed var(--ink)', boxShadow: '2px 2px 0 var(--ink)'}}>
                  🚨 VISHAM! 🐍
                </div>
              )}
              <div className="person-avatar">
                {/* Generate a stupid drawing! */}
                <img src={avatarUrl} alt="stupid drawing" />
              </div>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', width: '100%'}}>
                <b style={{fontSize: '20px', fontFamily: 'var(--display)'}}>{p.name}</b>
                <span className="badge" style={{background: p.type === 'loved' ? 'var(--pink)' : 'var(--lime)', color: p.type === 'loved' ? 'white' : '#111'}}>{p.tag}</span>
              </div>
              {p.weapon && <span style={{fontSize: '11px', fontWeight: 800, marginTop: '8px', color: 'var(--purple)'}}>Weapon: {p.weapon}</span>}
              <p style={{marginTop: '10px', fontSize: '13px', fontWeight: 600, opacity: 0.9, flex: 1}}>{p.description}</p>
              
              <div style={{display: 'flex', gap: '5px', marginTop: '15px', flexWrap: 'wrap', justifyContent: 'center'}}>
                <button className="icon-pill pop-hover" style={{background: 'var(--ink)', color: 'white', padding: '8px', height: 'auto'}} onClick={() => initiateDestroy(p, 'burn')} title="Burn">
                  <Flame size={16} color="var(--orange)" />
                </button>
                <button className="icon-pill pop-hover" style={{background: 'var(--ink)', color: 'white', padding: '8px', height: 'auto'}} onClick={() => initiateDestroy(p, 'shoot')} title="Shoot">
                  🔫
                </button>
                <button className="icon-pill pop-hover" style={{background: 'var(--ink)', color: 'white', padding: '8px', height: 'auto'}} onClick={() => initiateDestroy(p, 'sword')} title="Slice">
                  ⚔️
                </button>
              </div>
            </div>
            );
          })}
          {persons.length === 0 && <div className="empty" style={{gridColumn: '1 / -1', color: '#111', borderColor: 'rgba(0,0,0,0.1)'}}>No one here yet. Someone needs to be added. 👀</div>}
        </div>

        
      </div>
    </section>}

    <footer>Habit Lab • built for lazy humans who procrastinate beautifully. <span>✦ pwoli saanam</span></footer>

    {/* Water Reminder Toast */}
    {showWaterReminder && (
      <div className="water-toast reveal" onClick={() => setShowWaterReminder(false)}>
        <div className="water-toast-content">
          <span className="pulse-anim" style={{fontSize: '32px'}}>💧</span>
          <div>
            <b style={{fontFamily: 'var(--display)'}}>Vellam Kudikk!</b>
            <p style={{margin: '5px 0 0', fontSize: '13px', fontWeight: 600, opacity: 0.9}}>{waterRoast}</p>
          </div>
          <button className="icon-btn" onClick={(e) => { e.stopPropagation(); setShowWaterReminder(false) }}><X size={16}/></button>
        </div>
      </div>
    )}

    {/* Compliments Overlay */}
    {compliments.map(c => (
      <div key={c.id} style={{
        position: 'fixed', left: c.x, top: c.y, zIndex: 9999,
        pointerEvents: 'none',
        fontFamily: 'var(--display)', fontWeight: 800, fontSize: '30px',
        color: 'var(--lime)', textShadow: '2px 2px 0 var(--ink), -2px -2px 0 var(--ink), 2px -2px 0 var(--ink), -2px 2px 0 var(--ink)',
        animation: 'floatUpAndFade 1.5s forwards'
      }}>
        {c.text}
      </div>
    ))}

    {/* Destroy Confirmation Overlay for Loved Persons */}
    {personToConfirmDestroy && (
      <div className="overlay" style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'grid', placeItems: 'center'}}>
        <div className="panel pop-anim" style={{background: 'var(--paper)', maxWidth: '400px', textAlign: 'center'}}>
          <span style={{fontSize: '40px', display: 'block', margin: '10px 0'}}>🥺</span>
          <h2 style={{fontFamily: 'var(--display)'}}>Eda mone, are you sure?</h2>
          <p style={{margin: '15px 0', fontWeight: 600}}>
            <b>{personToConfirmDestroy.person.name}</b> nalla mon/mol alle? Or did they become Theppu (Evil) and backstab you? 🔪
          </p>
          <div style={{display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'center'}}>
            <button className="primary bounce-hover" style={{background: 'var(--ink)', color: 'white'}} onClick={() => {
              executeDestroy(personToConfirmDestroy.person.id, personToConfirmDestroy.method);
              setPersonToConfirmDestroy(null);
            }}>
              Yes, Theppu aanu! Destroy! 🔥
            </button>
            <button className="primary bounce-hover" onClick={() => setPersonToConfirmDestroy(null)}>
              No, sorry maari poyi 😅
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Prank Overlay (GUARANTEED to work) */}
    {prankActive && (
      <div style={{position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'red', animation: 'chaosMode 0.1s infinite'}}>
        <h1 style={{fontSize: '8vw', color: 'yellow', fontFamily: 'var(--display)', textAlign: 'center', transform: 'rotate(-5deg)', margin: '0 20px'}}>
          SYSTEM ERROR ⚠️<br/>NJAN PARANJILLE CLICK CHEYYALLE ENNU!
        </h1>
      </div>
    )}

    {/* Peeking Uncle Distraction Police */}
    {showUncle && (
      <div className="peeking-uncle">
        🧔‍♂️
        <div className="uncle-bubble">Padikkunundo? 👀</div>
      </div>
    )}
  </main>
}

app/layout.tsx:

import './globals.css'
import { Inter, Space_Grotesk } from 'next/font/google'

const inter = Inter({subsets:['latin'], variable:'--font-inter'})
const space = Space_Grotesk({subsets:['latin'], variable:'--font-space'})

export const metadata = { 
  title:'Habit Lab 🧪 — Make consistency feel like a game', 
  description:'A playful personal learning cockpit and habit tracker.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🧪</text></svg>'
  }
}

export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang="en"><body className={`${inter.variable} ${space.variable}`}>{children}</body></html>
}

app/global.css:
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap');

:root {
  --paper: #f4f0e7;
  --card: #fffdf7;
  --ink: #19151e;
  --muted: #706979;
  --line: #ddd7cc;
  --purple: #7657ff;
  --lime: #caff59;
  --pink: #ff8cc6;
  --cyan: #78e8e1;
  --orange: #ff9b5e;
  --shadow: 0 18px 55px rgba(35, 25, 45, .09);
  --font: 'Manrope', sans-serif;
  --display: 'Space Grotesk', sans-serif;
  --mono: 'DM Mono', monospace;
}

html[data-theme=dark] {
  --paper: #121015;
  --card: #1b1820;
  --ink: #f7f2e8;
  --muted: #aaa2b1;
  --line: #35303a;
  --shadow: 0 18px 55px rgba(0, 0, 0, .28);
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font);
  transition: background .25s, color .25s;
  overflow-x: hidden;
  cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' style='font-size:20px'><text y='20'>😴</text></svg>"), auto;
}

button, input, select, textarea, a, .heatmap-cell, .color-blob {
  font: inherit;
  cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' style='font-size:20px'><text y='20'>⚡</text></svg>"), pointer;
}
button { border: 0; color: inherit; }

.app-shell { min-height: 100vh; overflow: hidden; position: relative; }

/* FUN FLOATING ELEMENTS - BACKGROUND */
.fun-bg-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
  opacity: 0.15;
  pointer-events: none;
  animation: drift 20s infinite alternate ease-in-out;
}
.shape-1 { width: 300px; height: 300px; background: var(--purple); top: 10%; left: -5%; }
.shape-2 { width: 400px; height: 400px; background: var(--lime); bottom: 10%; right: -10%; animation-delay: -5s; }
.shape-3 { width: 250px; height: 250px; background: var(--pink); top: 50%; left: 40%; animation-delay: -10s; }

@keyframes drift {
  0% { transform: translate(0, 0) rotate(0deg) scale(1); }
  100% { transform: translate(50px, -50px) rotate(45deg) scale(1.1); }
}

.topbar, .hero, .stats, .dashboard-grid, .weekly, .page, footer, .floating-sticker {
  position: relative;
  z-index: 10;
}

/* TOPBAR */
.topbar {
  height: 76px;
  border-bottom: 2px dashed var(--line);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4.5vw;
  position: sticky;
  top: 0;
  z-index: 20;
  background: color-mix(in srgb, var(--paper) 88%, transparent);
  backdrop-filter: blur(16px);
}
.brand { display: flex; align-items: center; gap: 10px; font: 800 13px var(--display); letter-spacing: .08em; }
.brand-name i { font: 500 9px var(--mono); letter-spacing: 0; color: var(--muted); margin-left: 7px; }
.logo { font: 900 30px/.9 var(--display); letter-spacing: -.08em; transition: transform 0.3s; }
.logo:hover { transform: scale(1.1) rotate(-5deg); }
.logo span { color: var(--purple); font-size: 18px; vertical-align: top; }
.logo.mini { font-size: 20px; }
.logo.mini span { font-size: 11px; }

nav { display: flex; gap: 4px; background: var(--card); border: 2px solid var(--ink); border-radius: 999px; padding: 4px; box-shadow: 4px 4px 0 var(--ink); transition: 0.2s; }
nav:hover { box-shadow: 2px 2px 0 var(--ink); transform: translate(2px, 2px); }
nav button, .ghost, .icon-pill, .secondary { background: transparent; border-radius: 999px; padding: 9px 13px; color: var(--muted); font-size: 12px; font-weight: 800; transition: all 0.2s; }
nav button.active { background: var(--ink); color: var(--paper); }
nav button:hover:not(.active) { background: color-mix(in srgb, var(--line) 30%, transparent); }

.top-actions { display: flex; gap: 6px; align-items: center; }
.icon-pill { width: 38px; height: 38px; padding: 0; display: grid; place-items: center; border: 2px solid var(--ink); background: var(--card); border-radius: 12px; box-shadow: 3px 3px 0 var(--ink); transition: 0.2s; }
.icon-pill:hover { transform: translate(2px, 2px); box-shadow: 1px 1px 0 var(--ink); background: var(--lime); color: var(--ink); }
.ghost { display: flex; align-items: center; gap: 6px; }
.ghost:hover { color: var(--pink); transform: rotate(5deg); }

/* HERO */
.hero { max-width: 1250px; margin: auto; padding: 8vh 5vw 5vh; display: flex; justify-content: space-between; align-items: center; gap: 50px; }
.hero-copy { max-width: 730px; }
.eyebrow { font: 500 10px var(--mono); letter-spacing: .12em; color: var(--muted); margin: 0 0 10px; text-transform: uppercase; }
.hero h1, .page-title h1 { font: 700 clamp(48px, 6.3vw, 82px)/.92 var(--display); letter-spacing: -.065em; margin: 12px 0 20px; }
.hero h1 em, .page-title h1 em { font-style: normal; color: var(--purple); text-shadow: 2px 2px 0 var(--lime); display: inline-block; animation: bounce 3s infinite ease-in-out; }

.sub, .page-title > p:last-child { color: var(--muted); max-width: 650px; line-height: 1.7; font-size: 15px; font-weight: 500; }
.hero-actions { display: flex; gap: 12px; margin-top: 25px; }

.primary { background: var(--ink); color: var(--paper); border-radius: 12px; padding: 12px 18px; display: inline-flex; align-items: center; justify-content: center; gap: 7px; font-weight: 800; font-size: 13px; transition: .18s; border: 2px solid var(--ink); box-shadow: 4px 4px 0 var(--purple); }
.primary:hover { transform: translate(2px, 2px); box-shadow: 2px 2px 0 var(--lime); }
.primary:active { transform: translate(4px, 4px); box-shadow: none; }

.secondary { border: 2px solid var(--ink); background: var(--card); display: inline-flex; align-items: center; gap: 7px; border-radius: 12px; font-size: 13px; box-shadow: 3px 3px 0 var(--orange); transition: 0.18s; color: var(--ink); font-weight: 800; }
.secondary:hover { transform: translate(2px, 2px); box-shadow: 1px 1px 0 var(--cyan); }

/* CARDS & PANELS */
.mood-card { width: 285px; min-height: 280px; border: 2px solid var(--ink); background: var(--card); border-radius: 26px; padding: 24px; box-shadow: 6px 6px 0 var(--pink); transform: rotate(2deg); position: relative; transition: 0.3s; }
.mood-card:hover { transform: rotate(-1deg) scale(1.02); box-shadow: 8px 8px 0 var(--cyan); }
.mood-card .scribble { font: 700 65px var(--display); color: var(--lime); position: absolute; right: 16px; top: 2px; transform: rotate(10deg); animation: wiggle 2s infinite linear; pointer-events: none; }
.mood-card span { display: block; font: 500 10px var(--mono); color: var(--muted); text-transform: uppercase; }
.mood-card strong { display: block; font: 700 24px/1.1 var(--display); margin: 18px 0 25px; max-width: 210px; }
.mood-card small { display: block; color: var(--muted); font-size: 12px; line-height: 1.5; font-style: italic; }
.mood-card button { margin-top: 22px; background: none; color: var(--purple); font-weight: 800; font-size: 12px; display: flex; gap: 6px; align-items: center; border: 2px dashed var(--purple); padding: 6px 12px; border-radius: 8px; transition: 0.2s; }
.mood-card button:hover { background: var(--purple); color: white; transform: rotate(-2deg); }

.sticker { display: inline-block; background: var(--lime); color: #151217; padding: 7px 10px; font: 900 11px var(--mono); letter-spacing: .04em; border: 2px solid #151217; box-shadow: 2px 2px 0 #151217; text-transform: uppercase; }
.tilt { transform: rotate(-3deg); transition: 0.2s; }
.tilt:hover { transform: rotate(3deg) scale(1.1); background: var(--pink); }

.floating-sticker { position: absolute; z-index: 1; pointer-events: none; }
.fs-1 { top: 15%; right: 5%; transform: rotate(15deg); }
.fs-2 { bottom: 10%; left: 5%; transform: rotate(-20deg); }

/* STATS */
.stats { max-width: 1250px; margin: 0 auto 30px; padding: 0 5vw; display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }
.stats > div { border: 2px solid var(--ink); border-radius: 16px; background: var(--card); padding: 16px; display: flex; align-items: center; gap: 15px; box-shadow: 4px 4px 0 var(--cyan); transition: transform 0.2s; }
.stats > div:hover { transform: translateY(-5px); box-shadow: 4px 8px 0 var(--lime); }
.stats svg { color: var(--ink); background: var(--lime); padding: 6px; border-radius: 8px; width: 32px; height: 32px; }
.stats:nth-child(even) svg { background: var(--pink); }
.stats b { font: 800 22px var(--display); display: block; line-height: 1; }
.stats span { font-size: 10px; font-weight: 800; color: var(--muted); text-transform: uppercase; font-family: var(--mono); }

/* DASHBOARD */
.dashboard-grid { max-width: 1250px; margin: auto; padding: 0 5vw 50px; display: grid; grid-template-columns: 1fr 320px; gap: 24px; }
.panel { background: var(--card); border: 2px solid var(--ink); border-radius: 24px; padding: 24px; box-shadow: 6px 6px 0 var(--ink); position: relative; }
.panel-head { display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.panel h2 { font: 800 28px var(--display); margin: 0; letter-spacing: -.03em; }
.badge { background: var(--lime); color: #17131b; border-radius: 999px; padding: 7px 12px; font: 800 11px var(--mono); border: 2px solid #17131b; box-shadow: 2px 2px 0 #17131b; }

.add { display: grid; grid-template-columns: 1fr 110px 80px auto; gap: 10px; margin: 25px 0; }
.add input, .add select, .login-card input, .account-panel input, .idea-add textarea { border: 2px solid var(--ink); background: var(--paper); color: var(--ink); border-radius: 12px; padding: 12px; outline: none; font-weight: 600; font-family: var(--font); box-shadow: 2px 2px 0 var(--line); transition: 0.2s; }
.add input:focus, .login-card input:focus, .idea-add textarea:focus { border-color: var(--purple); box-shadow: 4px 4px 0 var(--purple); transform: translateY(-2px); }

/* IDEAS & STICKY NOTES */
.ideas-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 15px; margin-top: 20px; }
.sticky-note { 
  background: #fdf596; color: #111; 
  padding: 15px 15px 40px; 
  position: relative; 
  border-radius: 2px 15px 2px 15px;
  box-shadow: 4px 4px 10px rgba(0,0,0,0.1), inset 0 -15px 10px rgba(0,0,0,0.05);
  transition: 0.3s;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  word-wrap: break-word;
  font-family: var(--font);
  font-weight: 600;
  font-size: 14px;
}
.sticky-note:nth-child(even) { background: #ffc9e8; transform: rotate(2deg); }
.sticky-note:nth-child(odd) { background: #b0f5e1; transform: rotate(-1.5deg); }
.sticky-note:nth-child(3n) { background: #fdf596; transform: rotate(1deg); }
.sticky-note:hover { transform: scale(1.05) rotate(0); z-index: 5; box-shadow: 8px 8px 15px rgba(0,0,0,0.15); }
.sticky-note .burn-btn {
  position: absolute; bottom: 8px; right: 8px;
  background: var(--ink); color: white;
  border: none; border-radius: 50%;
  width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; opacity: 0; transition: 0.2s;
  box-shadow: 2px 2px 0 var(--pink);
}
.sticky-note:hover .burn-btn { opacity: 1; transform: scale(1.1); }
.sticky-note .burn-btn:hover { background: var(--pink); color: var(--ink); box-shadow: none; }

/* PERSON CARDS & INTENSE BURN */
.persons-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; margin-top: 25px; }
.person-card {
  background: var(--paper); border: 3px solid var(--ink); border-radius: 16px; padding: 15px; position: relative;
  box-shadow: 4px 4px 0 var(--ink); display: flex; flex-direction: column; align-items: center; text-align: center;
  transition: 0.3s; color: var(--ink); overflow: hidden; z-index: 1;
}
.person-card:hover { transform: translateY(-5px); box-shadow: 8px 8px 0 var(--purple); z-index: 5; }
.person-avatar { width: 80px; height: 80px; border-radius: 50%; background: #e0f2fe; border: 3px solid var(--ink); margin-bottom: 10px; overflow: hidden; display: flex; justify-content: center; align-items: flex-end; box-shadow: inset 0 -10px 0 rgba(0,0,0,0.1); }
.person-avatar img { width: 90%; height: 90%; object-fit: contain; }
@keyframes intense-burn {
  0% { transform: scale(1); filter: sepia(0) hue-rotate(0) saturate(1) brightness(1); opacity: 1; }
  20% { transform: scale(1.1) rotate(3deg); filter: sepia(1) hue-rotate(-20deg) saturate(5) brightness(0.8); }
  50% { transform: scale(0.9) translateY(-10px) rotate(-5deg); filter: sepia(1) hue-rotate(-40deg) saturate(10) brightness(0.5); opacity: 1; box-shadow: 0 0 50px red, 0 0 20px orange; background: #222; border-color: red; }
  80% { transform: scale(0.6) translateY(-30px); filter: sepia(1) hue-rotate(-50deg) saturate(20) brightness(0.2); opacity: 0.8; box-shadow: 0 0 80px red, 0 0 40px yellow; background: #111; }
  100% { transform: scale(0) translateY(-60px); opacity: 0; filter: blur(20px); }
}
.burn-anim-intense { animation: intense-burn 1.5s cubic-bezier(0.5, 0, 0.5, 1) forwards !important; pointer-events: none; }
.burn-anim-intense::after { content: '🔥'; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); font-size: 80px; animation: floatUpAndFade 1.5s forwards; }


/* CASSETTE TAPES (MUSIC TAB) */
.playlist-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
.cassette-tape { 
  background: var(--ink); color: var(--paper);
  padding: 15px; border-radius: 12px;
  position: relative; transition: 0.3s;
  box-shadow: 6px 6px 0 var(--lime);
  display: flex; flex-direction: column; gap: 10px;
  min-height: 110px; justify-content: center;
}
.cassette-tape:nth-child(even) { box-shadow: 6px 6px 0 var(--cyan); }
.cassette-tape:nth-child(3n) { box-shadow: 6px 6px 0 var(--pink); }
.cassette-tape:hover { transform: scale(1.05) rotate(0) !important; z-index: 5; box-shadow: 8px 8px 0 var(--purple) !important; }
.tape-label { 
  background: var(--paper); color: var(--ink);
  padding: 10px 15px; border-radius: 6px;
  display: flex; flex-direction: column; 
  align-items: center; text-align: center;
}
.tape-title { font-weight: 800; font-family: var(--display); font-size: 16px; word-wrap: break-word; }
.tape-sub { font-size: 11px; font-weight: 600; color: var(--muted); text-transform: uppercase; margin-top: 4px; }
.tape-wheels { 
  display: flex; justify-content: center; gap: 40px; 
  background: #222; border-radius: 20px; padding: 5px;
}
.wheel { width: 20px; height: 20px; border-radius: 50%; background: #444; border: 4px dashed #666; animation: spin 4s linear infinite; }
.remove-song { position: absolute; top: 10px; right: 10px; background: var(--paper); color: var(--ink); border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.2s; z-index: 10; cursor: pointer; }
.cassette-tape:hover .remove-song { opacity: 1; }
.remove-song:hover { background: var(--pink); color: white; transform: scale(1.2); }

.task-list { display: flex; flex-direction: column; gap: 10px; }
.task { display: flex; align-items: center; gap: 12px; border: 2px solid var(--line); padding: 12px; border-radius: 16px; background: color-mix(in srgb, var(--paper) 40%, transparent); transition: 0.2s; }
.task:hover { border-color: var(--ink); box-shadow: 3px 3px 0 var(--lime); background: var(--card); }
.check { width: 30px; height: 30px; border-radius: 10px; border: 2px solid var(--ink); background: var(--paper); display: grid; place-items: center; flex: none; box-shadow: 2px 2px 0 var(--ink); transition: 0.2s; }
.check:hover { transform: scale(1.1); background: var(--orange); }
.task.done .check { background: var(--lime); box-shadow: none; transform: translate(2px, 2px); }
.task-main { flex: 1; min-width: 0; }
.task-main b { font-size: 14px; display: block; font-weight: 800; }
.task.done .task-main b { text-decoration: line-through; color: var(--muted); opacity: 0.6; }
.task-main span, .task-status { font: 600 11px var(--mono); color: var(--muted); }
.task-status { white-space: nowrap; background: var(--line); padding: 4px 8px; border-radius: 6px; }
.icon-btn { background: none; color: var(--muted); padding: 6px; transition: 0.2s; }
.icon-btn:hover { color: #f25b73; transform: scale(1.2) rotate(10deg); }

.side-stack { display: flex; flex-direction: column; gap: 24px; }
.roast-card { background: var(--pink); color: #19151e; overflow: hidden; position: relative; border-color: #19151e; box-shadow: 6px 6px 0 #19151e; }
.roast-card:after { content: 'LOL'; position: absolute; right: -10px; bottom: -42px; font: 900 110px var(--display); color: rgba(25, 21, 30, 0.08); transform: rotate(-12deg); pointer-events: none; }
.roast-card h3 { font: 800 24px/1.1 var(--display); max-width: 260px; position: relative; z-index: 1; margin: 15px 0; }
.roast-card p, .timer-card small { color: #19151e; opacity: 0.8; font-size: 13px; line-height: 1.6; font-weight: 600; }
.roast-card .secondary { background: transparent; border-color: #19151e; box-shadow: 3px 3px 0 #19151e; margin-top: 15px; position: relative; z-index: 2; }
.roast-card .secondary:hover { background: #19151e; color: var(--pink); box-shadow: none; transform: translate(3px, 3px); }

.timer-card { background: var(--cyan); border-color: #19151e; box-shadow: 6px 6px 0 #19151e; color: #19151e; transition: all 0.5s ease; }
.timer-card.running { background: #b0f5e1; border-color: var(--pink); box-shadow: 8px 8px 0 var(--pink); }
.timer-top { display: flex; justify-content: space-between; }
.timer-top svg { color: #19151e; animation: pulse 2s infinite; }
.timer-card h3 { font: 800 22px var(--display); margin: 0; }
.timer-number { font: 900 64px var(--mono); letter-spacing: -.08em; margin: 15px 0; text-align: center; text-shadow: 3px 3px 0 var(--paper); transition: 0.3s; }
.timer-active-anim { animation: pulseBig 1s infinite alternate cubic-bezier(0.4, 0, 0.2, 1); color: var(--purple); text-shadow: 5px 5px 0 var(--pink), -2px -2px 0 var(--lime); }
@keyframes pulseBig { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
.timer-controls { display: flex; gap: 10px; margin-bottom: 12px; }
.timer-controls .primary { flex: 1; border-color: #19151e; box-shadow: 3px 3px 0 #19151e; }
.timer-controls .primary:hover { background: var(--purple); box-shadow: 1px 1px 0 #19151e; }
.timer-controls .icon-pill { border-color: #19151e; box-shadow: 3px 3px 0 #19151e; background: transparent; color: #19151e; }
.timer-card small { opacity: 0.7; }

/* WEEKLY */
.weekly { max-width: 1250px; margin: 0 auto 55px; display: grid; grid-template-columns: 260px 1fr; gap: 30px; align-items: center; border: 2px dashed var(--purple); background: transparent; box-shadow: none; padding: 30px; }
.week-bars { display: flex; align-items: end; justify-content: space-around; height: 140px; }
.week-day { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: end; gap: 8px; }
.week-day > span { font: 800 11px var(--mono); color: var(--ink); }
.bar { height: 90px; width: 30px; border-radius: 12px; background: color-mix(in srgb, var(--line) 40%, transparent); display: flex; align-items: end; overflow: hidden; border: 2px solid var(--ink); }
.bar i { display: block; width: 100%; background: var(--lime); border-top: 2px solid var(--ink); min-height: 7px; transition: height 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
.week-day:hover .bar i { background: var(--pink); }
.week-day small { font: 700 10px var(--mono); color: var(--muted); text-transform: uppercase; }
.quote-strip { grid-column: 1 / -1; border-top: 2px dashed var(--line); padding-top: 20px; color: var(--muted); font-size: 13px; display: flex; align-items: center; gap: 10px; justify-content: center; font-weight: 600; }
.quote-strip b { color: var(--ink); font-style: italic; background: var(--lime); padding: 2px 8px; transform: rotate(-2deg); display: inline-block; }
.quote-strip svg { color: var(--pink); animation: heartbeat 1.5s infinite; }

/* HEATMAP */
.heatmap { max-width: 1250px; margin: 0 auto 55px; border-style: solid; }
.heatmap-scroll { overflow-x: auto; padding-bottom: 10px; }
.heatmap-grid { display: grid; grid-template-rows: repeat(7, 1fr); grid-auto-flow: column; gap: 5px; width: max-content; }
.heatmap-cell { width: 16px; height: 16px; border-radius: 4px; background: var(--line); border: 1px solid color-mix(in srgb, var(--ink) 20%, transparent); transition: 0.2s; position: relative; }
.heatmap-cell:hover { transform: scale(1.6); z-index: 2; border-color: var(--ink); box-shadow: 2px 2px 0 var(--ink); }
.heatmap-cell.count-0 { background: color-mix(in srgb, var(--line) 40%, transparent); }
.heatmap-cell.count-1 { background: color-mix(in srgb, var(--lime) 40%, var(--card)); border-color: var(--lime); }
.heatmap-cell.count-2 { background: color-mix(in srgb, var(--lime) 70%, var(--card)); border-color: var(--lime); }
.heatmap-cell.count-3 { background: var(--lime); border-color: var(--ink); }
.heatmap-cell.count-4 { background: var(--purple); border-color: var(--ink); }

/* PAGES */
.page { max-width: 1250px; margin: auto; padding: 8vh 5vw 70px; }
.page-title { margin-bottom: 50px; }
.page-title h1 { max-width: 850px; }
.method-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 20px; }
.method { min-height: 260px; padding: 24px; border: 2px solid var(--ink); border-radius: 20px; background: var(--card); display: flex; flex-direction: column; box-shadow: 4px 4px 0 var(--orange); transition: 0.3s; position: relative; overflow: hidden; }
.method:hover { box-shadow: 6px 8px 0 var(--lime); z-index: 2; }
.method:nth-child(2n) { transform: rotate(1deg); }
.method:nth-child(3n) { transform: rotate(-1.5deg); }
.method:nth-child(4n) { transform: rotate(0.5deg); }
.method-icon { font-size: 32px; margin-bottom: 10px; display: inline-block; }
.method h3 { font: 800 20px var(--display); margin: 0 0 10px; }
.method p { font-size: 13px; color: var(--muted); line-height: 1.6; flex: 1; font-weight: 500; }
.method button { background: var(--paper); border: 2px solid var(--ink); border-radius: 8px; padding: 8px; text-align: center; color: var(--ink); font-size: 11px; font-weight: 800; transition: 0.2s; margin-top: 15px; }
.method button:hover { background: var(--cyan); transform: rotate(-2deg); }

.lab-challenge { margin-top: 30px; display: flex; justify-content: space-between; align-items: center; gap: 20px; background: var(--orange); border-color: var(--ink); box-shadow: 6px 6px 0 var(--ink); color: #111; }
.lab-challenge h2 { margin: 0 0 7px; color: #111; }
.lab-challenge p { color: #111; opacity: 0.8; font-size: 14px; line-height: 1.5; font-weight: 600; }
.lab-challenge .primary { background: var(--ink); color: var(--lime); border-color: var(--ink); box-shadow: 4px 4px 0 var(--pink); }

/* DRAWING BOARD */
.canvas-layout { display: grid; grid-template-columns: 1.6fr 0.8fr; gap: 24px; }
.board-panel { overflow: hidden; padding: 0; border: 2px solid var(--ink); box-shadow: 6px 6px 0 var(--purple); background: var(--card); border-radius: 24px; display: flex; flex-direction: column; }
.board { display: flex; flex-direction: column; height: 100%; }
.board-tools { display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; border-bottom: 2px dashed var(--line); background: var(--paper); }
.board-tools span { font: 700 12px var(--mono); color: var(--muted); }
.tool-group { display: flex; gap: 8px; align-items: center; }
.divider { width: 2px; height: 20px; background: var(--line); margin: 0 4px; }
.color-blob { width: 24px; height: 24px; border-radius: 50%; border: 2px solid var(--ink); transition: 0.2s; box-shadow: 2px 2px 0 var(--ink); }
.color-blob:hover, .color-blob.active { transform: scale(1.2); box-shadow: none; border-width: 3px; }
.tool { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 8px; border: 2px solid transparent; background: transparent; color: var(--muted); transition: 0.2s; }
.tool:hover { background: var(--line); color: var(--ink); }
.tool.active { background: var(--lime); border-color: var(--ink); color: var(--ink); box-shadow: 2px 2px 0 var(--ink); }
.canvas-wrapper { flex: 1; position: relative; min-height: 470px; background-color: var(--card); background-image: radial-gradient(color-mix(in srgb, var(--muted) 20%, transparent) 2px, transparent 2px); background-size: 30px 30px; }
.board canvas { width: 100%; height: 100%; display: block; touch-action: none; position: absolute; inset: 0; cursor: crosshair; }
.canvas-text-input { position: absolute; z-index: 10; background: transparent; border: 1px dashed var(--purple); outline: none; font: 600 20px var(--display); padding: 2px 5px; border-radius: 4px; min-width: 100px; }
.canvas-text-input:focus { background: color-mix(in srgb, var(--paper) 80%, transparent); box-shadow: 0 0 0 2px var(--lime); }
.board > p { padding: 15px 20px; margin: 0; font: 600 12px var(--mono); color: var(--muted); border-top: 2px dashed var(--line); background: var(--paper); }

.ideas { border: 2px solid var(--ink); box-shadow: 6px 6px 0 var(--pink); }
.ideas .panel-head svg { color: var(--pink); width: 32px; height: 32px; }
.idea-add { display: flex; flex-direction: column; gap: 10px; margin: 25px 0; }
.idea-add textarea { min-height: 120px; resize: vertical; border: 2px solid var(--ink); box-shadow: 3px 3px 0 var(--ink); border-radius: 16px; font-weight: 600; font-size: 14px; }
.idea { display: flex; gap: 12px; border-top: 2px dashed var(--line); padding: 16px 0; font-size: 14px; font-weight: 600; line-height: 1.5; }
.idea svg { flex: none; color: var(--orange); }

.empty { text-align: center; padding: 40px; color: var(--muted); border: 2px dashed var(--muted); border-radius: 20px; font-size: 14px; font-weight: 600; background: color-mix(in srgb, var(--line) 30%, transparent); }

/* ACCOUNT */
.account-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.account-panel { display: grid; gap: 15px; }
.account-panel input { width: 100%; }
.setting-row { border: 2px solid var(--ink); background: var(--paper); border-radius: 16px; padding: 16px; display: flex; align-items: center; justify-content: space-between; font-weight: 700; transition: 0.2s; cursor: pointer; box-shadow: 3px 3px 0 var(--ink); }
.setting-row:hover { transform: translate(2px, 2px); box-shadow: 1px 1px 0 var(--ink); background: var(--lime); }
.setting-row span:first-child { display: flex; gap: 12px; align-items: center; }
.setting-chip { background: var(--ink); color: var(--lime); padding: 6px 10px; border-radius: 99px; font: 800 10px var(--mono); }
.mini-stat { border-top: 2px dashed var(--line); padding: 16px 0; display: flex; justify-content: space-between; font-size: 14px; font-weight: 600; }
.mini-stat b { font-family: var(--display); font-size: 20px; }

footer { text-align: center; padding: 40px; color: var(--muted); font: 700 12px var(--mono); border-top: 2px solid var(--line); margin-top: 50px; }
footer span { color: var(--purple); font-weight: 800; background: var(--lime); color: #111; padding: 2px 6px; border-radius: 4px; display: inline-block; transform: rotate(-2deg); }

/* LOGIN */
.login { min-height: 100vh; display: grid; place-items: center; position: relative; background: var(--paper); overflow: hidden; }
.login::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 70% 15%, var(--lime) 0%, transparent 40%), radial-gradient(circle at 20% 80%, var(--pink) 0%, transparent 40%); opacity: 0.2; }
.login-card { width: min(480px, 92vw); text-align: center; padding: 48px; border: 4px solid var(--ink); background: var(--card); border-radius: 32px; box-shadow: 12px 12px 0 var(--ink); position: relative; z-index: 2; transition: 0.3s; }
.login-card:hover { transform: translateY(-5px); box-shadow: 12px 16px 0 var(--purple); }
.login-card .logo { margin-bottom: 20px; }
.login-card h1 { font: 800 42px/.95 var(--display); letter-spacing: -.05em; margin: 20px 0; }
.login-card p:not(.eyebrow):not(.auth-error) { color: var(--muted); line-height: 1.6; font-size: 14px; font-weight: 600; margin-bottom: 25px; }
.login-card input { width: 100%; margin: 8px 0; border-width: 2px; }
.big { width: 100%; padding: 16px; margin: 15px 0; font-size: 15px; border-radius: 16px; }

.fun-error-box {
  background: var(--pink);
  color: var(--ink);
  border: 3px solid var(--ink);
  border-radius: 16px;
  padding: 15px;
  margin-top: 15px;
  box-shadow: 6px 6px 0 var(--ink);
  font-weight: 800;
  text-align: left;
  display: flex;
  gap: 12px;
  align-items: center;
  animation: jiggle 0.4s ease-in-out;
}
.fun-error-box b { font-size: 24px; flex: none; }
.fun-error-box p { margin: 0 !important; font-size: 14px !important; color: var(--ink) !important; font-weight: 800 !important; line-height: 1.4 !important; }

.input-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 20px 0;
}
.fun-input {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
}
.fun-input:focus {
  transform: scale(1.03) rotate(-1deg) !important;
  box-shadow: 6px 6px 0 var(--purple) !important;
}

.auth-error { color: #fff; background: #ef5f70; padding: 10px; border-radius: 8px; font-size: 13px; font-weight: 700; border: 2px solid var(--ink); margin-top: 10px; }
.text-btn { background: none; text-decoration: underline; color: var(--muted); font-size: 13px; font-weight: 700; margin-top: 10px; display: inline-block; }
.text-btn:hover { color: var(--purple); }
.login-card small { display: block; color: var(--muted); font-size: 11px; margin-top: 20px; font-weight: 600; }
.login-doodle { position: absolute; right: 8%; bottom: 15%; font: 800 28px var(--display); transform: rotate(-12deg); color: var(--pink); text-shadow: 2px 2px 0 var(--ink); animation: float 3s infinite ease-in-out alternate; z-index: 1; pointer-events: none; }
.login-doodle span { color: var(--ink); font-size: 14px; background: var(--lime); padding: 4px 8px; border-radius: 6px; display: block; transform: rotate(5deg); margin-top: 5px; text-shadow: none; }

.loading { min-height: 100vh; display: grid; place-items: center; align-content: center; gap: 15px; background: var(--paper); color: var(--ink); font: 700 14px var(--mono); }
.loading-orb { width: 80px; height: 80px; border-radius: 50%; background: var(--lime); color: var(--ink); display: grid; place-items: center; font-size: 32px; animation: bounce 1.3s ease-in-out infinite; border: 4px solid var(--ink); box-shadow: 4px 4px 0 var(--pink); }

/* WATER TOAST */
.water-toast {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: var(--cyan);
  color: var(--ink);
  padding: 15px 20px;
  border-radius: 16px;
  border: 2px solid var(--ink);
  box-shadow: 6px 6px 0 var(--ink);
  z-index: 1000;
  cursor: pointer;
  max-width: 320px;
  animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.water-toast-content { display: flex; align-items: center; gap: 15px; }
@keyframes slideUp { from { opacity: 0; transform: translateY(50px) scale(0.9); } to { opacity: 1; transform: none; } }

/* FUN ACTIVITY ANIMATIONS */
@keyframes floatUpAndFade {
  0% { opacity: 1; transform: translate(-50%, -50%) scale(0.5); }
  20% { transform: translate(-50%, -100%) scale(1.2) rotate(-5deg); }
  100% { opacity: 0; transform: translate(-50%, -300%) scale(1) rotate(5deg); }
}

@keyframes chaosMode {
  0% { transform: translate(0,0) scale(1); filter: invert(0); }
  25% { transform: translate(-10px, 10px) scale(1.02); filter: invert(1) hue-rotate(90deg); }
  50% { transform: translate(10px, -10px) scale(0.98); filter: invert(0) sepia(1) hue-rotate(180deg); }
  75% { transform: translate(-10px, -10px) scale(1.03); filter: invert(1) hue-rotate(270deg); }
  100% { transform: translate(0,0) scale(1); filter: invert(0); }
}
.prank-chaos {
  animation: chaosMode 0.2s infinite !important;
}

@keyframes burnAway {
  0% { transform: scale(1) skewX(0); filter: contrast(1); opacity: 1; background: var(--paper); }
  20% { transform: scale(1.02) skewX(2deg); filter: contrast(2) brightness(0.8) sepia(1) hue-rotate(-50deg); background: #ff5722; color: #fff; border-color: #ffeb3b; box-shadow: 0 0 20px #ff9800; }
  40% { transform: scale(0.95) skewX(-2deg) translateY(10px); filter: contrast(2.5) brightness(0.6) sepia(1) hue-rotate(-50deg); background: #f44336; box-shadow: 0 0 40px #ff5722; opacity: 0.9; }
  60% { transform: scale(1.05) skewX(3deg) translateY(-10px); filter: grayscale(1) brightness(0.2); background: #333; opacity: 0.6; }
  100% { transform: scale(0.1) translateY(-100px) rotate(10deg); filter: grayscale(1) brightness(0); opacity: 0; }
}
.burn-anim {
  animation: burnAway 1.2s cubic-bezier(0.36, 0.07, 0.19, 0.97) forwards !important;
  pointer-events: none;
}
.fire-particle {
  position: absolute;
  font-size: 40px;
  animation: flyUp 1s ease-out forwards;
  pointer-events: none;
  z-index: 20;
}
@keyframes flyUp {
  0% { transform: translateY(0) scale(1) rotate(0deg); opacity: 1; }
  100% { transform: translateY(-100px) scale(0) rotate(45deg); opacity: 0; }
}

.peeking-uncle {
  position: fixed;
  bottom: -10px;
  right: 20px;
  z-index: 8000;
  font-size: 70px;
  filter: drop-shadow(0 -4px 10px rgba(0,0,0,0.2));
  animation: slideUpPeek 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
.uncle-bubble {
  position: absolute;
  top: -40px;
  right: 60px;
  background: var(--paper);
  color: var(--ink);
  font-size: 16px;
  font-weight: 800;
  padding: 10px 16px;
  border-radius: 16px;
  border: 2px solid var(--ink);
  box-shadow: 4px 4px 0 var(--cyan);
  white-space: nowrap;
  font-family: var(--mono);
  animation: popIn 0.3s ease-out 0.5s both;
}
@keyframes slideUpPeek {
  from { transform: translateY(100%) rotate(20deg); }
  to { transform: translateY(0) rotate(-5deg); }
}
@keyframes popIn {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.reveal { animation: rise 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
@keyframes rise { from { opacity: 0; transform: translateY(30px) scale(0.95); } to { opacity: 1; transform: none; } }

/* GLOBAL UTILITY ANIMATIONS */
@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
@keyframes wiggle { 0%, 100% { transform: rotate(10deg) scale(1); } 50% { transform: rotate(20deg) scale(1.1); } }
@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }
@keyframes heartbeat { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.3); } }
@keyframes float { 0% { transform: translateY(0px) rotate(15deg); } 100% { transform: translateY(-15px) rotate(10deg); } }
@keyframes jiggle { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(3deg); } 75% { transform: rotate(-3deg); } }
@keyframes spin360 { 100% { transform: rotate(360deg); } }

.bounce-hover:hover { animation: bounce 0.5s infinite; }
.wiggle-hover:hover { animation: wiggle 0.5s infinite; }
.pulse-hover:hover { animation: pulse 0.8s infinite; }
.float-anim { animation: float 4s infinite ease-in-out alternate; }
.pulse-anim { animation: pulse 2s infinite; }
.wiggle-anim { animation: wiggle 2s infinite linear; }
.heartbeat-anim { animation: heartbeat 2s infinite ease-in-out; }
.jiggle-hover:hover { animation: jiggle 0.4s infinite ease-in-out; }
.spin-hover:hover { animation: spin360 1s ease-in-out; }
.pop-hover:hover { transform: scale(1.1) translateY(-2px); }
.scale-hover:hover { transform: scale(1.05); }
.hover-lift { transition: 0.3s; }
.hover-lift:hover { transform: translateY(-8px); box-shadow: 4px 10px 0 var(--lime) !important; z-index: 2; position: relative; }

/* RESPONSIVE */
@media(max-width:1050px) {
  nav button { padding: 8px; }
  .method-grid { grid-template-columns: repeat(3, 1fr); }
  .dashboard-grid { grid-template-columns: 1fr; }
  .side-stack { display: grid; grid-template-columns: 1fr 1fr; }
  .weekly { grid-template-columns: 1fr; padding: 20px; }
  .canvas-layout { grid-template-columns: 1fr; }
}

@media(max-width:720px) {
  .topbar { height: auto; min-height: 70px; flex-wrap: wrap; padding: 12px 15px; gap: 12px; border-bottom-width: 2px; }
  .brand-name { display: none; }
  nav { order: 3; width: 100%; overflow: auto; padding: 6px; }
  nav button { white-space: nowrap; }
  .hero { padding: 55px 20px 35px; flex-direction: column; align-items: stretch; text-align: center; }
  .hero-copy { margin: 0 auto; }
  .hero-actions { justify-content: center; }
  .mood-card { width: 100%; transform: none !important; }
  .stats { padding: 0 20px; grid-template-columns: repeat(2, 1fr); }
  .dashboard-grid { padding: 0 20px 40px; }
  .add { grid-template-columns: 1fr 1fr; gap: 8px; }
  .add input, .add .primary { grid-column: 1 / -1; }
  .side-stack { grid-template-columns: 1fr; }
  .weekly { margin: 0 20px 40px; }
  .page { padding: 50px 20px; }
  .method-grid { grid-template-columns: 1fr 1fr; }
  .account-grid { grid-template-columns: 1fr; }
  .hero h1, .page-title h1 { font-size: 42px; }
  .login-card { padding: 40px 24px; box-shadow: 6px 6px 0 var(--ink); }
  .login-doodle, .floating-sticker { display: none; }
  
  /* Mobile Fixes for Gossip & Idea Wall */
  .gossip-hero { align-items: stretch !important; padding-top: 20px !important; }
  .gossip-hero-copy { position: static !important; margin-top: 0 !important; top: auto !important; }
  .thought-bubble { flex-direction: column !important; text-align: center; border-radius: 20px !important; padding: 15px !important; }
  .thought-bubble h3 { font-size: 18px !important; }
  
  .flex-wrap-mobile { flex-wrap: wrap !important; }
  .flex-wrap-mobile > * { width: 100% !important; flex: none !important; }
  .gossips-add { grid-template-columns: 1fr !important; }
}

@media(max-width:480px) {
  .method-grid { grid-template-columns: 1fr; }
  .hero h1, .page-title h1 { font-size: 38px; }
  .task-status { display: none; }
  .top-actions .ghost span { display: none; }
  .quote-strip { flex-wrap: wrap; text-align: center; }
}

/* FIX DROPDOWN (SELECT) PADDING BUG */
select.fun-input {
  appearance: none;
  -webkit-appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%23111" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>');
  background-repeat: no-repeat;
  background-position: right 15px center;
  padding-right: 45px !important;
}

/* KILL ANIMATIONS */

/* 1. SHOOT ANIMATION */
@keyframes shoot-drop {
  0% { transform: scale(1); }
  10% { transform: scale(1.05) rotate(-5deg); filter: brightness(1.5) contrast(1.5); }
  15% { transform: scale(0.95) rotate(10deg) translateX(10px); filter: brightness(1) drop-shadow(0 0 10px red); }
  30% { transform: scale(0.9) rotate(-15deg) translateX(-20px); opacity: 1; }
  100% { transform: translateY(800px) rotate(-45deg); opacity: 0; filter: blur(5px); }
}
.shoot-anim {
  animation: shoot-drop 1.4s cubic-bezier(0.5, 0, 0.5, 1) forwards !important;
  pointer-events: none;
}
.shoot-anim::after {
  content: '💥'; position: absolute; top: 30%; left: 40%; font-size: 100px; animation: floatUpAndFade 1s forwards;
}

/* 2. SWORD ANIMATION */
@keyframes sword-slice {
  0% { transform: skewX(0); }
  15% { transform: skewX(-10deg) scale(1.1); filter: drop-shadow(0 0 20px red) brightness(1.2); }
  30% { transform: skewX(25deg) translateX(40px); opacity: 1; }
  100% { transform: skewX(50deg) translateX(150px) translateY(100px); opacity: 0; filter: blur(15px); }
}
.sword-anim {
  animation: sword-slice 1.4s ease-in forwards !important;
  pointer-events: none;
  background: var(--orange) !important;
}
.sword-anim::after {
  content: '⚔️'; position: absolute; top: 20%; left: 50%; transform: translateX(-50%); font-size: 90px; animation: floatUpAndFade 1s forwards;
}

/* 3. CRAZY DANCING STICKMAN ANIMATION */
@keyframes dance-head {
  0%, 100% { transform: rotate(-15deg) translate(-2px, 0); }
  25% { transform: rotate(15deg) translate(2px, 3px); }
  50% { transform: rotate(-25deg) translate(-3px, -2px); }
  75% { transform: rotate(20deg) translate(2px, 3px); }
}

@keyframes dance-body {
  0%, 100% { transform: translateY(0); }
  25% { transform: translateY(8px); } /* Squat down */
  50% { transform: translateY(-4px); } /* Pop up */
  75% { transform: translateY(8px); } /* Squat down */
}

@keyframes dance-arm-l {
  0%, 100% { transform: rotate(60deg); }
  25% { transform: rotate(-100deg); } /* Arm swinging up */
  50% { transform: rotate(80deg); }
  75% { transform: rotate(-120deg); }
}

@keyframes dance-arm-r {
  0%, 100% { transform: rotate(-100deg); } /* Arm swinging up */
  25% { transform: rotate(60deg); }
  50% { transform: rotate(-120deg); }
  75% { transform: rotate(80deg); }
}

@keyframes dance-leg-l {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(45deg) translate(-5px, -5px); } /* Kick out left */
  50% { transform: rotate(0deg); }
  75% { transform: rotate(-20deg) translate(5px, 0); } /* Bend in */
}

@keyframes dance-leg-r {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(20deg) translate(-5px, 0); } /* Bend in */
  50% { transform: rotate(0deg); }
  75% { transform: rotate(-45deg) translate(5px, -5px); } /* Kick out right */
}

.stick-head { animation: dance-head 0.7s infinite linear; transform-origin: 50px 30px; }
.stick-body { animation: dance-body 0.7s infinite linear; transform-origin: 50px 90px; }
.stick-arm-l { animation: dance-arm-l 0.7s infinite linear; transform-origin: 50px 50px; }
.stick-arm-r { animation: dance-arm-r 0.7s infinite linear; transform-origin: 50px 50px; }
.stick-leg-l { animation: dance-leg-l 0.7s infinite linear; transform-origin: 50px 90px; }
.stick-leg-r { animation: dance-leg-r 0.7s infinite linear; transform-origin: 50px 90px; }

/* 4. PEEKING MONKEY ANIMATION */
@keyframes monkey-peek-l {
  0%, 65%, 100% { transform: rotate(0deg); }
  75%, 90% { transform: rotate(-50deg); } /* Lowers left hand to peek */
}
@keyframes monkey-peek-r {
  0%, 25%, 100% { transform: rotate(0deg); }
  35%, 50% { transform: rotate(50deg); } /* Lowers right hand */
}
@keyframes monkey-pupils {
  0%, 25%, 100% { transform: translate(0, 0); }
  35%, 50% { transform: translate(6px, 0); } /* Look right when right hand lowers */
  75%, 90% { transform: translate(-6px, 0); } /* Look left when left hand lowers */
}

.monkey-hand-l { animation: monkey-peek-l 6s infinite ease-in-out; }
.monkey-hand-r { animation: monkey-peek-r 6s infinite ease-in-out; }
.monkey-pupils { animation: monkey-pupils 6s infinite ease-in-out; }



