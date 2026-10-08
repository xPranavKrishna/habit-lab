'use client';
import { useState } from 'react';
import { LogOut, Moon, Sun } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

export default function AccountTab() {
  const { 
    user, profile, dark, setDark, logout, saveProfile, totalXP, streakDays
  } = useAppContext();

  const [displayName, setDisplayName] = useState(profile?.display_name || user?.email?.split('@')[0] || '');

  return (
    <section className="page reveal">
      <div className="page-title">
        <div className="sticker tilt float-anim">YOUR CORNER OF THE INTERNET</div>
        <p className="eyebrow">ACCOUNT HQ</p>
        <h1>This chaos<br/><em>belongs to you.</em></h1>
        <p>Your account keeps tasks, activity and ideas separate from everyone else's.</p>
      </div>
      <div className="account-grid">
        <div className="panel account-panel hover-lift">
          <p className="eyebrow">PROFILE</p>
          <input value={displayName} onChange={e=>setDisplayName(e.target.value)} placeholder="Display name"/>
          <input value={user?.email||''} disabled/>
          <button className="primary bounce-hover" onClick={() => saveProfile(displayName)}>Save profile</button>
          <button className="secondary pop-hover" onClick={logout}><LogOut size={16}/> Log out</button>
        </div>
        <div className="panel account-panel hover-lift">
          <p className="eyebrow">VIBE SETTINGS</p>
          <button className="setting-row" onClick={()=>setDark(!dark)}>
            <span>{dark?<Moon/>:<Sun/>}<b>{dark?'Dark mode':'Light mode'}</b></span>
            <span className="setting-chip">{dark?'ON':'ON / OFF'}</span>
          </button>
          <div className="mini-stat"><span>XP</span><b>{totalXP}</b></div>
          <div className="mini-stat"><span>Current streak</span><b>{streakDays} days</b></div>
        </div>
      </div>
    </section>
  );
}
