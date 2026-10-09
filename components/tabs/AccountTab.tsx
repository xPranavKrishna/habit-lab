'use client';
import { useState, useEffect } from 'react';
import { LogOut, Moon, Sun, Key } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { auth } from '@/lib/firebase';
import { updatePassword } from 'firebase/auth';

export default function AccountTab() {
  const { 
    user, profile, dark, setDark, logout, saveProfile, totalXP, streakDays
  } = useAppContext();

  const [displayName, setDisplayName] = useState(profile?.display_name || user?.email?.split('@')[0] || '');
  
  useEffect(() => {
    if (profile?.display_name) {
      setDisplayName(profile.display_name);
    }
  }, [profile]);
  const [newPassword, setNewPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');
  const [saveMsg, setSaveMsg] = useState('');

  const handleSaveProfile = async () => {
    await saveProfile(displayName);
    setSaveMsg("Save aayitundee! 🚀 Pwoli!");
    setTimeout(() => setSaveMsg(''), 3000);
  };

  const handlePasswordChange = async () => {
    if(newPassword.length < 6) {
      setPwdMsg("Password 6 characters venam aliya! 🤦‍♂️");
      return;
    }
    setPwdMsg("Updating... ⏳");
    try {
      if(auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        setPwdMsg("Password changed successfully! Pwoli. 🎉");
        setNewPassword('');
      } else {
        setPwdMsg("Ayyo! You are not logged in.");
      }
    } catch (error: any) {
      setPwdMsg("Ayyo! " + error.message);
    }
  };

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
          <button className="primary bounce-hover" onClick={handleSaveProfile}>Save profile</button>
          {saveMsg && <small className="pop-anim" style={{display: 'block', marginTop: '8px', color: 'green', fontWeight: 'bold'}}>{saveMsg}</small>}
          <button className="secondary pop-hover" onClick={logout}><LogOut size={16}/> Log out</button>
          
          <hr style={{margin: '20px 0', border: 'none', borderTop: '1px solid var(--border)'}} />
          
          <p className="eyebrow">CHANGE PASSWORD</p>
          <input 
            type="password" 
            value={newPassword} 
            onChange={e => {setNewPassword(e.target.value); setPwdMsg('')}} 
            placeholder="New Password (min 6 chars)"
          />
          <button className="secondary bounce-hover" onClick={handlePasswordChange}>
            <Key size={16}/> Update Password
          </button>
          {pwdMsg && <small style={{display: 'block', marginTop: '8px', color: pwdMsg.includes('Ayyo') || pwdMsg.includes('venam') ? 'red' : 'green'}}>{pwdMsg}</small>}
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
