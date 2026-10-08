'use client';
import { useState } from 'react';
import { Lightbulb, Shuffle, Plus } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { DrawingBoard } from '@/components/DrawingBoard';
import { stupidThoughts } from '@/lib/constants';

export default function CanvasTab() {
  const { ideas, addIdea, removeIdea, idea, setIdea } = useAppContext();
  const [randomThought, setRandomThought] = useState(stupidThoughts[0]);

  const shuffleThought = () => setRandomThought(stupidThoughts[Math.floor(Math.random() * stupidThoughts.length)]);

  return (
    <section className="page reveal">
      <div className="page-title">
        <div className="sticker tilt wiggle-anim">VATTAAYA CHINTHAKAL 🧠</div>
        <p className="eyebrow">THE IDEA WALL</p>
        <h1>Thonniyavasangal okke<br/><em>ivide idka.</em></h1>
        <p>Varachu vekk. Ezhuthi vekk. Vattu ideas aanelum kuzhappam illa. Future-il ulla nee vannu clear aakki edutholum.</p>
      </div>

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
            <button className="primary bounce-hover" onClick={() => { addIdea(idea); setIdea(''); }}><Plus size={18}/> Otti Vekk 📌</button>
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
    </section>
  );
}
