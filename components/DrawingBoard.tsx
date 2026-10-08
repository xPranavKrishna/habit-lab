'use client'
import { useEffect, useRef, useState } from 'react'
import { Eraser, Pencil, RotateCcw, Type } from 'lucide-react'

const COLORS = [
  { name: 'Ink', val: 'var(--ink)' },
  { name: 'Purple', val: 'var(--purple)' },
  { name: 'Pink', val: 'var(--pink)' },
  { name: 'Cyan', val: 'var(--cyan)' },
  { name: 'Orange', val: 'var(--orange)' },
]

export function DrawingBoard() {
  const ref = useRef<HTMLCanvasElement>(null)
  const [mode, setMode] = useState<'draw'|'erase'|'text'>('draw')
  const [color, setColor] = useState('var(--ink)')
  const drawing = useRef(false)
  const [textInput, setTextInput] = useState({ visible: false, x: 0, y: 0, text: '' })
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const c = ref.current!
    const dpr = window.devicePixelRatio || 1
    c.width = c.clientWidth * dpr
    c.height = c.clientHeight * dpr
    const x = c.getContext('2d')!
    x.scale(dpr, dpr)
    x.lineCap = 'round'
    x.lineJoin = 'round'
  }, [])

  function getRealColor(cssVar: string) {
    if (cssVar.startsWith('var(')) {
      const varName = cssVar.replace('var(', '').replace(')', '')
      return getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
    }
    return cssVar
  }

  function pos(e: React.PointerEvent) {
    const c = ref.current!
    const r = c.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  function down(e: React.PointerEvent) {
    if (mode === 'text') {
      const p = pos(e)
      setTextInput({ visible: true, x: p.x, y: p.y, text: '' })
      setTimeout(() => inputRef.current?.focus(), 10)
      return
    }
    drawing.current = true
    const p = pos(e)
    const x = ref.current!.getContext('2d')!
    x.beginPath()
    x.moveTo(p.x, p.y)
  }

  function move(e: React.PointerEvent) {
    if (!drawing.current || mode === 'text') return
    const p = pos(e)
    const x = ref.current!.getContext('2d')!
    x.globalCompositeOperation = mode === 'erase' ? 'destination-out' : 'source-over'
    x.lineWidth = mode === 'erase' ? 22 : 4
    x.strokeStyle = mode === 'erase' ? 'rgba(0,0,0,1)' : getRealColor(color)
    x.lineTo(p.x, p.y)
    x.stroke()
  }

  function clear() {
    const c = ref.current!
    c.getContext('2d')!.clearRect(0, 0, c.width, c.height)
  }

  function commitText() {
    if (textInput.visible && textInput.text.trim()) {
      const x = ref.current!.getContext('2d')!
      x.globalCompositeOperation = 'source-over'
      x.font = `600 20px ${getComputedStyle(document.documentElement).getPropertyValue('--display').trim()}`
      x.fillStyle = getRealColor(color)
      x.fillText(textInput.text, textInput.x, textInput.y + 15) // +15 for baseline roughly
    }
    setTextInput({ ...textInput, visible: false, text: '' })
  }

  return (
    <div className="board">
      <div className="board-tools">
        <span>✎ freestyle planning</span>
        <div className="tool-group">
          {COLORS.map(c => (
            <button 
              key={c.name}
              className={`color-blob ${color === c.val ? 'active' : ''}`}
              style={{ background: c.val }}
              onClick={() => { setColor(c.val); if(mode==='erase') setMode('draw') }}
              title={c.name}
            />
          ))}
          <div className="divider"></div>
          <button className={mode === 'draw' ? 'tool active' : 'tool'} onClick={() => setMode('draw')} title="Draw"><Pencil size={15} /></button>
          <button className={mode === 'text' ? 'tool active' : 'tool'} onClick={() => setMode('text')} title="Type"><Type size={15} /></button>
          <button className={mode === 'erase' ? 'tool active' : 'tool'} onClick={() => setMode('erase')} title="Eraser"><Eraser size={15} /></button>
          <button className="tool" onClick={clear} title="Clear All"><RotateCcw size={15} /></button>
        </div>
      </div>
      <div className="canvas-wrapper" style={{ position: 'relative' }}>
        <canvas 
          ref={ref} 
          onPointerDown={down} 
          onPointerMove={move} 
          onPointerUp={() => drawing.current = false} 
          onPointerLeave={() => drawing.current = false} 
        />
        {textInput.visible && (
          <input
            ref={inputRef}
            type="text"
            className="canvas-text-input"
            style={{
              position: 'absolute',
              left: textInput.x,
              top: textInput.y - 10,
              color: getRealColor(color),
            }}
            value={textInput.text}
            onChange={e => setTextInput({ ...textInput, text: e.target.value })}
            onBlur={commitText}
            onKeyDown={e => e.key === 'Enter' && commitText()}
            placeholder="Type..."
          />
        )}
      </div>
      <p>Draw arrows. Boxes. Future genius plans. Express your creativity.</p>
    </div>
  )
}
