'use client';
import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth';
import { supabase } from '@/lib/supabase';

export function Login() {
  const [authMode, setAuthMode] = useState<'login'|'signup'|'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [authError, setAuthError] = useState('');

  async function handleAuth(){
    setAuthError(''); 
    
    if (authMode === 'forgot') {
      if(!email){setAuthError('Edo, email type cheyyathe engane link ayakkum? 🤦‍♂️');return;}
      try {
        await sendPasswordResetEmail(auth, email);
        setAuthError('Link sent! Email poyi check cheyy machane (spam folder koodi nokkane). 🪄');
      } catch(error: any) {
        setAuthError(error.message);
      }
      return;
    }

    if(!email||!password){setAuthError('Email & Password type cheyy machane. Veruthe click aakathe.');return}
    if(password.length<6){setAuthError('Password need 6+ characters. At least add some 1234s.');return}
    
    if(authMode==='signup'){
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const name = displayName || email.split('@')[0];
        
        await updateProfile(user, { displayName: name });
        await sendEmailVerification(user);
        
        await supabase.from('profiles').insert({ id: user.uid, display_name: name });
        setAuthError('Account created! But check your email for verification.');
      } catch (error: any) {
        if(error.code === 'auth/email-already-in-use') setAuthError('Aliya, you already have an account! Just Log in.');
        else if(error.code === 'auth/invalid-email') setAuthError('Ithu enthu email aada? Type a real one.');
        else setAuthError(error.message);
      }
    }else{
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error: any) {
        if(error.code === 'auth/invalid-credential') setAuthError('Wrong email or password! Athum marannupoyi alle?');
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
        <h1>{authMode==='login'?'Welcome back, machane.':authMode==='forgot'?'Ayyo, password maranno? 🤦‍♂️':'Build your tiny universe.'}</h1>
        <p>{authMode==='forgot' ? 'Kuzhappamilla, it happens. Email adi, oru magic link ayakkam.' : 'Tasks, habits, ideas, experiments, focus sessions and gentle chaos. No productivity-bro energy required.'}</p>
        
        <div className="input-group">
          {authMode==='signup'&&<input className="fun-input" value={displayName} onChange={e=>setDisplayName(e.target.value)} placeholder="What should we call you?"/>}
          <input className="fun-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email (a real one please)"/>
          {authMode!=='forgot'&&<input className="fun-input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password (6+ characters)"/>}
        </div>

        {authMode==='login' && (
          <div style={{textAlign: 'right', marginTop: '-10px', marginBottom: '15px'}}>
            <button className="text-btn" style={{fontSize: '13px', opacity: 0.8}} onClick={()=>{setAuthMode('forgot');setAuthError('')}}>
              Password marannupoyo? 🔑
            </button>
          </div>
        )}
        
        <button className="primary big bounce-hover" onClick={handleAuth} style={{fontSize:'16px'}}>
          {authMode==='login'?'Enter my universe':authMode==='forgot'?'Send Magic Link 🪄':'Create my universe'} <Sparkles size={18}/>
        </button>
        
        {authError&&<div className="fun-error-box jiggle-hover">
          <b>{authMode === 'forgot' && authError.includes('Link sent') ? '🎉 Yay!' : '🤦‍♂️ Ayyo!'}</b>
          <p>{authError}</p>
        </div>}
        
        <button className="text-btn" onClick={()=>{setAuthMode(authMode==='login'?'signup':'login');setAuthError('')}}>
          {authMode==='forgot'?'Thirichu povaam (Back to Login) 🔙':authMode==='login'?'New here? Create account machane':'Already have an account? Log in'}
        </button>
        <small>Free • Your stuff stays attached to your account</small>
      </div>
      <div className="login-doodle float-anim">നാളെ നോക്കാം<br/><span>not today.</span></div>
    </main>
  );
}
