export type Task = { id:string; title:string; category:string; minutes:number; xp:number; active:boolean; created_at?:string; user_id?:string; }
export type Log = { id:string; task_id:string; completed_on:string; user_id?:string; }
export type Idea = { id:string; text:string; created_at?:string; user_id?:string; }
export type Song = { id:string; title:string; created_at?:string; user_id?:string }
export type Gossip = { id: string, user_id: string, content: string, created_at: string }
export type Person = { id: string, user_id: string, name: string, type: 'loved' | 'hated', tag: string, description: string, created_at: string, gender: string, weapon?: string }
export type Tab = 'today'|'lab'|'canvas'|'account'|'music'|'gossip'
