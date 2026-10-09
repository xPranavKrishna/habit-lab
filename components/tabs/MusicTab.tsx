'use client';
import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

export default function MusicTab() {
  const { playlist, addSong, removeSong } = useAppContext();
  const [newSong, setNewSong] = useState('');

  return (
    <section className="page reveal">
      <div className="page-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ flex: '1 1 300px' }}>
          <div className="sticker tilt float-anim">PATTU PETTI 🎧</div>
          <p className="eyebrow">LAZY PLAYLIST HQ</p>
          <h1>Padikkan irikkumbo<br/><em>mathram paattu venam.</em></h1>
          <p>Because the silence of your uncompleted tasks is too loud. Open your favorite app and vibe.</p>
        </div>
        
        <div style={{ padding: '20px', background: 'var(--card)', border: '4px solid var(--ink)', borderRadius: '20px', boxShadow: '8px 8px 0 var(--ink)', transform: 'rotate(5deg)' }}>
          <svg viewBox="0 0 100 150" width="120" height="180" style={{overflow: 'visible'}}>
            <g className="stick-body">
              <circle className="stick-head" cx="50" cy="30" r="16" stroke="var(--ink)" strokeWidth="6" fill="var(--paper)"/>
              <line x1="50" y1="46" x2="50" y2="90" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round"/>
              <g className="stick-arm-l" style={{transformOrigin: '50px 50px'}}>
                <line x1="50" y1="50" x2="20" y2="40" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round"/>
                <line x1="20" y1="40" x2="10" y2="10" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round"/>
              </g>
              <g className="stick-arm-r" style={{transformOrigin: '50px 50px'}}>
                <line x1="50" y1="50" x2="80" y2="40" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round"/>
                <line x1="80" y1="40" x2="90" y2="10" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round"/>
              </g>
              <g className="stick-leg-l" style={{transformOrigin: '50px 90px'}}>
                <line x1="50" y1="90" x2="30" y2="120" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round"/>
                <line x1="30" y1="120" x2="15" y2="150" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round"/>
              </g>
              <g className="stick-leg-r" style={{transformOrigin: '50px 90px'}}>
                <line x1="50" y1="90" x2="70" y2="120" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round"/>
                <line x1="70" y1="120" x2="85" y2="150" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round"/>
              </g>
            </g>
          </svg>
        </div>
      </div>
      <div className="account-grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'}}>
        <div className="panel hover-lift" style={{background: 'var(--lime)', border: '2px solid var(--ink)', cursor: 'pointer', padding: '30px'}} onClick={() => window.open('https://open.spotify.com', '_blank')}>
          <h2 style={{fontFamily: 'var(--display)', fontSize: '28px', color: '#111'}}>Spotify</h2>
          <p style={{fontWeight: 600, opacity: 0.8, color: '#111', fontSize: '15px'}}>Malayalam Lo-Fi aano? K-Pop aano? Poyi kettu padi machane.</p>
        </div>
        <div className="panel hover-lift" style={{background: 'var(--pink)', border: '2px solid var(--ink)', cursor: 'pointer', padding: '30px'}} onClick={() => window.open('https://music.apple.com', '_blank')}>
          <h2 style={{fontFamily: 'var(--display)', fontSize: '28px', color: '#111'}}>Apple Music</h2>
          <p style={{fontWeight: 600, opacity: 0.8, color: '#111', fontSize: '15px'}}>Rich madiyan. Spatial audio-il full vibe aakk.</p>
        </div>
        <div className="panel hover-lift" style={{background: 'var(--cyan)', border: '2px solid var(--ink)', cursor: 'pointer', padding: '30px'}} onClick={() => window.open('https://music.youtube.com', '_blank')}>
          <h2 style={{fontFamily: 'var(--display)', fontSize: '28px', color: '#111'}}>YT Music</h2>
          <p style={{fontWeight: 600, opacity: 0.8, color: '#111', fontSize: '15px'}}>Premium illel ad kettu kidannu padikk.</p>
        </div>
      </div>
      <div className="panel" style={{marginTop: '40px', background: 'var(--card)', overflow: 'hidden'}}>
        <h3 style={{fontFamily: 'var(--display)', fontSize: '24px', marginBottom: '15px'}}>Pattu List (Your Anthems)</h3>
        <p style={{marginBottom: '15px', fontWeight: 600, opacity: 0.8}}>Type your favorite study songs here. Ee list-il ulla pattukal kettaal thanne vibe varanam.</p>
        
        <div className="flex-wrap-mobile" style={{display: 'flex', gap: '10px', marginBottom: '30px'}}>
          <input 
            placeholder="E.g., Parayathe Ariyathe - Lofi Mix..."
            value={newSong}
            onChange={(e) => setNewSong(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { addSong(newSong); setNewSong(''); }
            }}
            className="fun-input"
            style={{flex: 1, padding: '12px 15px', fontSize: '15px'}}
          />
          <button className="primary bounce-hover" onClick={() => { addSong(newSong); setNewSong(''); }}><Plus size={18}/> Add Song</button>
        </div>

        <div className="playlist-grid">
          {playlist.map((s, i) => (
            <div className="cassette-tape pop-hover" key={s.id} style={{transform: `rotate(${i % 2 === 0 ? '-2' : '3'}deg)`}}>
              <div className="tape-label">
                <span className="tape-title">{s.title}</span>
                <span className="tape-sub">Vibe {i+1} 🎧</span>
              </div>
              <div className="tape-wheels">
                <div className="wheel"></div>
                <div className="wheel"></div>
              </div>
              <button className="icon-btn remove-song" onClick={(e) => { e.stopPropagation(); removeSong(s.id); }}><X size={16}/></button>
            </div>
          ))}
          {playlist.length === 0 && <div className="empty" style={{gridColumn: '1 / -1'}}>Pattu onnum ille? Oru pattu add cheythu vibe aakku! 🎶</div>}
        </div>
      </div>
    </section>
  );
}
