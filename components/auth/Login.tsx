'use client';
import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function Login() {
  const [authMode, setAuthMode] = useState<'login'|'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [authError, setAuthError] = useState('');

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
        if(error.message.includes('Invalid login credentials')) setAuthError('Wrong email or password! Athum marannupoyi alle?');
        else setAuthError(error.message);
      }
    }
  }

  return (
    <main className="login">
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
  );
}
