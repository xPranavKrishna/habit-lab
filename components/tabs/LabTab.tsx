'use client';
import { Timer } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { methods } from '@/lib/constants';

export default function LabTab() {
  const { setTimer, setTimerRunning, setActiveTab, setIdea } = useAppContext();

  return (
    <section className="page reveal">
      <div className="page-title">
        <div className="sticker tilt">ATOMIC HABITS & HACKS</div>
        <p className="eyebrow">THE BRAIN LAB</p>
        <h1>Make the brain<br/><em>cooperate.</em></h1>
        <p>Learning science + behaviour design + tiny experiments. Pick one method, try it, keep what works, ditch the rest.</p>
      </div>
      <div className="method-grid">
        {methods.map(([icon,title,body], i) => (
          <article className="method hover-lift" key={title} style={{animationDelay:`${0.1 * i}s`}}>
            <span className="method-icon float-anim">{icon}</span>
            <h3>{title}</h3>
            <p>{body}</p>
            <button onClick={() => {
              setIdea(`${title}: `);
              setActiveTab('Idea Wall');
            }}>Put this on my idea wall →</button>
          </article>
        ))}
      </div>
      <div className="lab-challenge panel bounce-hover">
        <div>
          <p className="eyebrow">TODAY'S RANDOM CHALLENGE</p>
          <h2>Teach one thing badly, then better.</h2>
          <p>Pick any idea you learned today. Explain it out loud in 60 seconds without notes. Then check what you forgot.</p>
        </div>
        <button className="primary" onClick={() => {
          setTimer(60);
          setTimerRunning(true);
          setActiveTab('Today');
        }}><Timer size={16}/> 60 sec timer</button>
      </div>
    </section>
  );
}
