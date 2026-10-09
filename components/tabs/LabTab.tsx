'use client';
import { Timer } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { methods, dailyChallenges } from '@/lib/constants';

export default function LabTab() {
  const { setTimer, setTimerRunning, setActiveTab, setIdea } = useAppContext();

  // Deterministically pick ONE challenge for the day based on the current date
  const dateStr = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`;
  const hash = dateStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const challenge = dailyChallenges[hash % dailyChallenges.length];

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
          <h2>{challenge.title}</h2>
          <p>{challenge.desc}</p>
        </div>
        <button className="primary" onClick={() => {
          setTimer(challenge.time);
          setTimerRunning(true);
          setActiveTab('Today');
        }}><Timer size={16}/> {challenge.time >= 60 ? `${challenge.time / 60} min` : `${challenge.time} sec`} timer</button>
      </div>
    </section>
  );
}
