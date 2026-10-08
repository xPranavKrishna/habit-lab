'use client';
import React, { createContext, useContext, useEffect, useState, useRef, useMemo, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { Task, Log, Idea, Song, Gossip, Person, Tab } from '@/types';
import { starter, roasts, pepTalks } from '@/lib/constants';

type AppContextType = {
  user: any;
  profile: any;
  tasks: Task[];
  logs: Log[];
  ideas: Idea[];
  loading: boolean;
  
  // Timer State
  timer: number;
  timerRunning: boolean;
  setTimer: (t: number) => void;
  setTimerRunning: (r: boolean) => void;
  toggleTimer: () => void;
  formatTime: (s: number) => string;

  // Roast & Pep
  roast: string;
  pep: string;
  setRoast: (r: string) => void;
  setPep: (p: string) => void;

  // SPA Routing
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // UI States
  dark: boolean;
  setDark: React.Dispatch<React.SetStateAction<boolean>>;
  showWaterReminder: boolean;
  setShowWaterReminder: React.Dispatch<React.SetStateAction<boolean>>;
  waterRoast: string;
  prankActive: boolean;
  setPrankActive: React.Dispatch<React.SetStateAction<boolean>>;
  compliments: {id: number, x: number, y: number, text: string}[];

  // Domain Actions
  logout: () => Promise<void>;
  saveProfile: (displayName: string) => Promise<void>;
  addTask: (title: string, category: string, minutes: number) => Promise<void>;
  toggleTask: (t: Task, e?: React.MouseEvent) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  
  addIdea: (text: string) => Promise<void>;
  removeIdea: (id: string) => Promise<void>;
  idea: string;
  setIdea: React.Dispatch<React.SetStateAction<string>>;

  // Music DB
  playlist: Song[];
  addSong: (title: string) => Promise<void>;
  removeSong: (id: string) => Promise<void>;

  // Gossip DB
  gossips: Gossip[];
  persons: Person[];
  addGossip: (content: string) => Promise<void>;
  removeGossip: (id: string) => Promise<void>;
  addPerson: (data: any) => Promise<{error?: string}>;
  initiateDestroy: (person: Person, method: 'burn'|'shoot'|'sword') => void;
  personToConfirmDestroy: {person: Person, method: 'burn'|'shoot'|'sword'} | null;
  setPersonToConfirmDestroy: React.Dispatch<React.SetStateAction<{person: Person, method: 'burn'|'shoot'|'sword'} | null>>;
  executeDestroy: (id: string, method: 'burn'|'shoot'|'sword') => Promise<void>;

  // Computed
  todayLogs: Log[];
  done: number;
  totalXP: number;
  completion: number;
  streakDays: number;
  heatMapDays: {date: string, day: number}[];
  rank: string;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function today(){ return new Date().toISOString().slice(0,10) }

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(true);

  const [gossips, setGossips] = useState<Gossip[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [personToConfirmDestroy, setPersonToConfirmDestroy] = useState<{person: Person, method: 'burn'|'shoot'|'sword'} | null>(null);

  const [playlist, setPlaylist] = useState<Song[]>([]);

  const [dark, setDark] = useState(false);
  const [roast, setRoast] = useState(roasts[0]);
  const [pep, setPep] = useState(pepTalks[0]);

  const [activeTabState, setActiveTabState] = useState('Today');

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      localStorage.setItem('habitlab-tab', tab);
    }
  };

  // Load saved tab initially
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTab = localStorage.getItem('habitlab-tab');
      if (savedTab) setActiveTabState(savedTab);
    }
  }, []);

  // Timer State
  const [timer, setTimer] = useState(0); 
  const [timerRunning, setTimerRunning] = useState(false);
  const endTimeRef = useRef<number|null>(null);
  const intervalRef = useRef<number|null>(null);

  // Reminders
  const [showWaterReminder, setShowWaterReminder] = useState(false);
  const [waterRoast, setWaterRoast] = useState('');
  const [prankActive, setPrankActive] = useState(false);
  const [compliments, setCompliments] = useState<{id: number, x: number, y: number, text: string}[]>([]);

  useEffect(()=>{
    const saved=localStorage.getItem('habitlab-theme'); setDark(saved==='dark');
    setRoast(roasts[Math.floor(Math.random()*roasts.length)]);
    setPep(pepTalks[Math.floor(Math.random()*pepTalks.length)]);
    supabase.auth.getUser().then(({data})=>{setUser(data.user);setLoading(false);if(data.user)load(data.user.id)});
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>{setUser(s?.user??null);if(s?.user)load(s.user.id)});
    return ()=>subscription.unsubscribe();
  },[]);

  useEffect(()=>{
    if(typeof document !== 'undefined') {
      document.documentElement.dataset.theme = dark ? 'dark' : 'light';
      localStorage.setItem('habitlab-theme', dark ? 'dark' : 'light');
    }
  },[dark]);

  useEffect(() => {
    if(!user) return;
    const waterRoasts = [
      "Machane, vellam kudikku. Kidneys cry cheyyunnu! 🚰",
      "Vellam kudikkeda madiya! Hydration is important. 💧",
      "Oru glass vellam kudichittu bakki pani. Go! 🏃‍♂️",
      "Dehydration adichu chavum. Poi vellam kudi! 🚰",
      "Body full of madi, at least pour some water in it! 🧊"
    ];
    let timeoutId: number;
    const triggerReminder = () => {
      setWaterRoast(waterRoasts[Math.floor(Math.random() * waterRoasts.length)]);
      setShowWaterReminder(true);
      const nextGap = Math.floor(Math.random() * (45 * 60000 - 30 * 60000 + 1) + 30 * 60000);
      timeoutId = window.setTimeout(triggerReminder, nextGap);
    };
    const initialGap = Math.floor(Math.random() * (45 * 60000 - 30 * 60000 + 1) + 30 * 60000);
    timeoutId = window.setTimeout(triggerReminder, initialGap);
    return () => clearTimeout(timeoutId);
  }, [user]);

  useEffect(()=>{
    if(timerRunning && timer > 0) {
      endTimeRef.current = Date.now() + timer * 1000;
      intervalRef.current = window.setInterval(() => {
        const remaining = Math.max(0, Math.round((endTimeRef.current! - Date.now()) / 1000));
        setTimer(remaining);
        if (remaining <= 0) {
          setTimerRunning(false);
          window.clearInterval(intervalRef.current!);
        }
      }, 1000);
    } else {
      if(intervalRef.current) window.clearInterval(intervalRef.current);
    }
    return () => {
      if(intervalRef.current) window.clearInterval(intervalRef.current);
    }
  }, [timerRunning]);

  const toggleTimer = () => {
    if (!timer) setTimer(300);
    setTimerRunning(!timerRunning);
  }

  async function load(uid:string){
    const {data:p}=await supabase.from('profiles').select('*').eq('id',uid).maybeSingle(); setProfile(p);
    let {data:t}=await supabase.from('tasks').select('*').eq('user_id',uid).eq('active',true).order('created_at',{ascending:true});
    if(!t || t.length===0){ 
      const seed=starter.map(x=>({...x,user_id:uid,active:true})); 
      const seeded=await supabase.from('tasks').insert(seed).select(); 
      t=seeded.data||[]; 
    }
    const {data:l}=await supabase.from('task_logs').select('id,task_id,completed_on').eq('user_id',uid);
    const {data:i}=await supabase.from('ideas').select('*').eq('user_id',uid).order('created_at',{ascending:false});
    const {data:s}=await supabase.from('songs').select('*').eq('user_id',uid).order('created_at',{ascending:false});
    const {data:g}=await supabase.from('gossips').select('*').eq('user_id',uid).order('created_at',{ascending:false});
    const {data:pers}=await supabase.from('persons').select('*').eq('user_id',uid).order('created_at',{ascending:false});
    setTasks(t||[]);setLogs(l||[]);setIdeas(i||[]);setPlaylist(s||[]);setGossips(g||[]);setPersons(pers||[]);
  }

  async function logout(){await supabase.auth.signOut();setTasks([]);setLogs([]);setIdeas([]);setUser(null);setProfile(null)}
  
  async function saveProfile(displayName: string){
    if(!user)return;
    const name=displayName.trim()||profile?.display_name||user.email?.split('@')[0];
    const {data}=await supabase.from('profiles').upsert({id:user.id,display_name:name}).select().single();
    if(data)setProfile(data);
  }

  async function addTask(title: string, category: string, minutes: number){
    if(!title.trim()||!user)return;
    const row={user_id:user.id,title:title.trim(),category,minutes,xp:Math.max(10,minutes*2),active:true}
    const {data,error}=await supabase.from('tasks').insert(row).select().single(); 
    if(!error&&data){setTasks(v=>[...v,data]);}
  }

  async function toggleTask(t:Task, e?: React.MouseEvent){
    if(!user)return; 
    const mouseX = e?.clientX || (typeof window !== 'undefined' ? window.innerWidth / 2 : 500);
    const mouseY = e?.clientY || (typeof window !== 'undefined' ? window.innerHeight / 2 : 500);
    const d=today(); const existing=logs.find(l=>l.task_id===t.id&&l.completed_on===d);
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

  async function removeTask(id:string){await supabase.from('tasks').update({active:false}).eq('id',id);setTasks(v=>v.filter(t=>t.id!==id))}
  
  async function addIdea(text: string){if(!text.trim()||!user)return;const {data}=await supabase.from('ideas').insert({user_id:user.id,text:text.trim()}).select().single();if(data){setIdeas(v=>[data,...v]);}}
  async function removeIdea(id:string){await supabase.from('ideas').delete().eq('id',id);setIdeas(v=>v.filter(i=>i.id!==id))}

  const addSong = async (title: string) => {
    if (!title.trim() || !user) return;
    const { data } = await supabase.from('songs').insert({user_id: user.id, title: title.trim()}).select().single();
    if (data) {
      setPlaylist(v => [data, ...v]);
    }
  };
  const removeSong = async (id: string) => {
    try {
      setPlaylist(v => v.filter(s => s.id !== id));
      await supabase.from('songs').delete().eq('id', id);
    } catch (err) {}
  };

  const addGossip = async (content: string) => {
    if (!content.trim() || !user) return;
    const { data } = await supabase.from('gossips').insert({user_id: user.id, content: content.trim()}).select().single();
    if (data) { setGossips(v => [data, ...v]); }
  };
  const removeGossip = async (id: string) => {
    try {
      setGossips(v => v.filter(g => g.id !== id));
      await supabase.from('gossips').delete().eq('id', id);
    } catch (e) {}
  };

  const addPerson = async (dataPayload: any) => {
    if (!dataPayload.name.trim() || !dataPayload.tag.trim()) {
      return { error: 'Nokki adikku mone! 🤦‍♂️ Name-um Tag-um nirbandham aanu. (Mandatory fields)' };
    }
    if (!user) return {};
    
    const { data } = await supabase.from('persons').insert({
      user_id: user.id, 
      name: dataPayload.name.trim(), 
      type: dataPayload.type, 
      tag: dataPayload.tag.trim(), 
      description: dataPayload.description.trim(), 
      gender: dataPayload.gender, 
      weapon: dataPayload.weapon.trim() || null
    }).select().single();
    if (data) { 
      setPersons(v => [data, ...v]); 
    }
    return {};
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
    }, 1400);
  };

  // Computations
  const todayLogs=logs.filter(l=>l.completed_on===today());
  const done=tasks.filter(t=>todayLogs.some(l=>l.task_id===t.id)).length;
  const totalXP=logs.reduce((a,l)=>a+(tasks.find(t=>t.id===l.task_id)?.xp||0),0);
  const completion=tasks.length?Math.round(done/tasks.length*100):0;
  
  const streakDays=useMemo(()=>{
    let n=0;
    const set=new Set(logs.map(x=>x.completed_on));
    for(let i=0;i<60;i++){
      const d=new Date();d.setDate(d.getDate()-i);
      if(set.has(d.toISOString().slice(0,10)))n++;
      else break;
    }
    return n;
  },[logs]);

  const heatMapDays = useMemo(() => {
    const arr = [];
    const _today = new Date();
    for(let i=0; i<84; i++) {
      const d = new Date();
      d.setDate(_today.getDate() - (83 - i));
      arr.push({ date: d.toISOString().slice(0,10), day: d.getDay() });
    }
    return arr;
  }, [logs]);

  const rank=totalXP<200?'Pavam Beginner (Madiyan)':totalXP<500?'Getting Serious Aliya':totalXP<1000?'Consistency Goblin':'Pwoli Saanam';
  const formatTime=(s:number)=>`${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  const value = {
    user, profile, tasks, logs, ideas, loading,
    timer, timerRunning, setTimer, setTimerRunning, toggleTimer, formatTime,
    roast, pep, setRoast, setPep,
    activeTab: activeTabState, setActiveTab,
    dark, setDark, showWaterReminder, setShowWaterReminder, waterRoast, prankActive, setPrankActive, compliments,
    logout, saveProfile, addTask, toggleTask, removeTask, addIdea, removeIdea, idea, setIdea,
    playlist, addSong, removeSong,
    gossips, persons, addGossip, removeGossip, addPerson, initiateDestroy, personToConfirmDestroy, setPersonToConfirmDestroy, executeDestroy,
    todayLogs, done, totalXP, completion, streakDays, heatMapDays, rank
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
