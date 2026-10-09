'use client';
import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Login } from '@/components/auth/Login';
import { LogOut, Moon, Sun, Shuffle, X } from 'lucide-react';
import { roasts, pepTalks } from '@/lib/constants';

import TodayTab from '@/components/tabs/TodayTab';
import LabTab from '@/components/tabs/LabTab';
import CanvasTab from '@/components/tabs/CanvasTab';
import MusicTab from '@/components/tabs/MusicTab';
import GossipTab from '@/components/tabs/GossipTab';
import AccountTab from '@/components/tabs/AccountTab';

export default function App() {
  const { 
    user, loading, dark, setDark, logout, setRoast, setPep,
    activeTab, setActiveTab,
    showWaterReminder, setShowWaterReminder, waterRoast,
    compliments, prankActive, personToConfirmDestroy, setPersonToConfirmDestroy, executeDestroy
  } = useAppContext();
  
  const [showUncle, setShowUncle] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowUncle(true);
      setTimeout(() => setShowUncle(false), 8000);
    }, 15 * 60 * 1000); // 15 minutes
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <main className="loading"><div className="loading-orb">😴</div><p>brain cell initializing…</p></main>;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <main className="app-shell" id="top">
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
          {['Today', 'Brain Lab', 'Idea Wall', 'Music', 'Gossips 👀', 'Me'].map(t => (
            <button key={t} className={activeTab === t ? 'active' : ''} onClick={() => {setActiveTab(t); document.getElementById('top')?.scrollIntoView()}}>{t}</button>
          ))}
        </nav>
        <div className="top-actions">
          <button className="icon-pill spin-hover" title="Change vibe" onClick={()=>{setRoast(roasts[Math.floor(Math.random()*roasts.length)]);setPep(pepTalks[Math.floor(Math.random()*pepTalks.length)])}}><Shuffle size={16}/></button>
          <button className="icon-pill pop-hover" title="Toggle dark mode" onClick={()=>setDark(v=>!v)}>{dark?<Sun size={16}/>:<Moon size={16}/>}</button>
          <button className="ghost jiggle-hover" onClick={logout}><LogOut size={15}/> <span>Exit</span></button>
        </div>
      </header>

      {activeTab === 'Today' && <TodayTab />}
      {activeTab === 'Brain Lab' && <LabTab />}
      {activeTab === 'Idea Wall' && <CanvasTab />}
      {activeTab === 'Music' && <MusicTab />}
      {activeTab === 'Gossips 👀' && <GossipTab />}
      {activeTab === 'Me' && <AccountTab />}

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
          <div className="panel pop-anim" style={{background: 'var(--paper)', maxWidth: 'min(90vw, 400px)', textAlign: 'center'}}>
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

      {/* Peeking Uncle */}
      {showUncle && (
        <div className="peeking-uncle">
          🧔‍♂️
          <div className="uncle-bubble">Padikkunundo? 👀</div>
        </div>
      )}
    </main>
  );
}
