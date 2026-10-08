'use client';
import { useState } from 'react';
import { Flame, Trash2 } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { monkeyDialogues } from '@/lib/constants';

export default function GossipTab() {
  const { 
    gossips, addGossip, removeGossip,
    persons, addPerson, initiateDestroy 
  } = useAppContext();

  const [newGossip, setNewGossip] = useState('');
  const [monkeyMsg, setMonkeyMsg] = useState('');

  const pokeMonkey = () => {
    setMonkeyMsg(monkeyDialogues[Math.floor(Math.random() * monkeyDialogues.length)]);
    setTimeout(() => setMonkeyMsg(''), 3000);
  };

  const [personName, setPersonName] = useState('');
  const [personTag, setPersonTag] = useState('');
  const [personDesc, setPersonDesc] = useState('');
  const [personType, setPersonType] = useState<'loved'|'hated'>('hated');
  const [personGender, setPersonGender] = useState('secret');
  const [personWeapon, setPersonWeapon] = useState('');
  const [personError, setPersonError] = useState('');

  const handleAddPerson = async () => {
    const { error } = await addPerson({
      name: personName, type: personType, tag: personTag, description: personDesc, gender: personGender, weapon: personWeapon
    });
    if (error) {
      setPersonError(error);
    } else {
      setPersonError('');
      setPersonName(''); setPersonTag(''); setPersonDesc(''); setPersonWeapon('');
    }
  };

  return (
    <section className="hero general reveal gossip-hero" style={{ alignItems: 'flex-start', paddingTop: '40px' }}>
      <div className="hero-copy gossip-hero-copy" style={{marginBottom: '30px', position: 'sticky', top: '28vh', marginTop: '18vh'}}>
        <div className="sticker tilt pulse-anim">PARADHUSHANAM ☕</div>
        <h1>Gossip & Hit List</h1>
        <p>Because studying is hard, but talking about others is easy. Write down your gossips, add your chunks, and burn the haters! 🔥</p>
      </div>

      <div className="dashboard-grid">
        <div className="panel" style={{background: '#fef3c7', gridColumn: '1 / -1', border: '4px solid var(--ink)', boxShadow: '8px 8px 0 var(--ink)', position: 'relative'}}>
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
                <circle cx="15" cy="50" r="14" fill="#8B4513" stroke="var(--ink)" strokeWidth="4"/>
                <circle cx="85" cy="50" r="14" fill="#8B4513" stroke="var(--ink)" strokeWidth="4"/>
                <circle cx="15" cy="50" r="7" fill="#D2B48C" stroke="var(--ink)" strokeWidth="2"/>
                <circle cx="85" cy="50" r="7" fill="#D2B48C" stroke="var(--ink)" strokeWidth="2"/>
                <circle cx="50" cy="50" r="38" fill="#8B4513" stroke="var(--ink)" strokeWidth="4"/>
                <path d="M 22 50 Q 50 15 78 50 Q 80 80 50 85 Q 20 80 22 50 Z" fill="#D2B48C" stroke="var(--ink)" strokeWidth="3"/>
                <circle cx="36" cy="42" r="12" fill="white" stroke="var(--ink)" strokeWidth="3"/>
                <circle cx="64" cy="42" r="12" fill="white" stroke="var(--ink)" strokeWidth="3"/>
                <g className="monkey-pupils">
                  <circle cx="36" cy="42" r="5" fill="var(--ink)"/>
                  <circle cx="64" cy="42" r="5" fill="var(--ink)"/>
                </g>
                <ellipse cx="50" cy="62" rx="6" ry="4" fill="var(--ink)"/>
                <path d="M 40 72 Q 50 80 60 72" stroke="var(--ink)" strokeWidth="3" fill="none" strokeLinecap="round"/>
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
            <button className="primary bounce-hover" style={{height: '100%', background: 'var(--orange)', color: 'white'}} onClick={() => { addGossip(newGossip); setNewGossip(''); }}><Flame size={18}/> Kathikku 🔥</button>
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
            <button className="primary bounce-hover" style={{background: '#111', color: 'white', borderColor: '#111', padding: '12px 25px'}} onClick={handleAddPerson}>Add Person</button>
          </div>
          {personError && <div className="pop-anim" style={{marginTop: '15px', color: 'white', fontWeight: 800, fontSize: '15px', background: 'var(--orange)', padding: '12px 15px', borderRadius: '8px', border: '2px solid var(--ink)', boxShadow: '4px 4px 0 var(--ink)'}}>⚠️ {personError}</div>}
        </div>
        
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
    </section>
  );
}
