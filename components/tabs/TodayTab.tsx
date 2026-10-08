'use client';
import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { categories, categoryIcons, roasts, pepTalks } from '@/lib/constants';
import { Plus, Trash2, RotateCcw, Play, Pause, Flame, Zap, Target, Trophy, MoreHorizontal, Coffee, Timer, Calendar, Shuffle } from 'lucide-react';

export default function TodayTab() {
  const { 
    tasks, addTask, toggleTask, removeTask, 
    pep, roast, setRoast, setPep,
    streakDays, totalXP, done, rank, completion,
    timer, timerRunning, toggleTimer, formatTime, setTimer, setTimerRunning,
    todayLogs, logs, heatMapDays, setPrankActive
  } = useAppContext();

  const [newTask, setNewTask] = useState('');
  const [category, setCategory] = useState('Learn');
  const [minutes, setMinutes] = useState(10);
  const [distraction, setDistraction] = useState('');
  const [isBurning, setIsBurning] = useState(false);

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

  const burnThought = () => {
    if (!distraction.trim()) return;
    setIsBurning(true);
    setTimeout(() => {
      setDistraction('');
      setIsBurning(false);
    }, 1000);
  }

  return (
    <>
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
            <input value={newTask} onChange={e=>setNewTask(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addTask(newTask, category, minutes)} placeholder="Add anything… gym, read, or just breathe"/>
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
            <button className="primary scale-hover" onClick={() => { addTask(newTask, category, minutes); setNewTask(''); }}><Plus size={18}/> Add</button>
          </div>
          <div className="task-list">
            {tasks.map(t=>{
              const isDone=todayLogs.some(l=>l.task_id===t.id);
              const Icon=categoryIcons[t.category]||MoreHorizontal;
              return <div 
                className={`task jiggle-hover ${isDone?'done':''}`} 
                key={t.id}
                onClick={(e) => {
                  if (!(e.target as HTMLElement).closest('button')) toggleTask(t, e as any);
                }}
                style={{cursor: 'pointer'}}
              >
                <button className="check pop-hover" onClick={(e)=>{ e.stopPropagation(); toggleTask(t, e); }}>
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
                <button className="icon-btn" title="Remove" onClick={(e)=>{ e.stopPropagation(); removeTask(t.id); }}><Trash2 size={16}/></button>
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
    </>
  );
}
