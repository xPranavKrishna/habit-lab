import {
  BookOpen, Briefcase, Dumbbell, Home as HomeIcon, Pencil, MoreHorizontal
} from 'lucide-react'

export const starter = [
  {title:'Read 1 page (yes, just 1)', category:'Learn', minutes:10, xp:20},
  {title:'Drink a glass of water, bro', category:'Health', minutes:5, xp:10},
  {title:'Close all useless tabs', category:'Work', minutes:5, xp:10},
]

export const categories = ['Learn','Work','Health','Life','Creative','Other']

export const categoryIcons: Record<string, any> = {Learn:BookOpen, Work:Briefcase, Health:Dumbbell, Life:HomeIcon, Creative:Pencil, Other:MoreHorizontal}

export const roasts = [
  'Aliya, your bed is not your office. Get up!',
  'നാളെ നോക്കാം is a powerful villain. Today is its weakness.',
  'Your phone has seen more of you today than your goals have. Kashtam.',
  'Bhayankara madiyan aanalle? It\'s okay machane, just tick one box.',
  'Eda… 5 minutes mathi. Start cheyyu. Pinne urangam. 😭',
  'Naatukaar enth parayum enn orkaruthu. Ninakk padikkan madiya. Ath sathyamaanu.',
  'If procrastination paid salary, you would be CEO of Kerala by now.',
  'Motivation is out of stock. Just use the 5-min timer.',
  'Bro is planning a comeback since 2018. Pwolikkum machane... oru divasam.',
  'Entha machane, urangukayano? Wake up and pretend to work!',
  'Oru thegayum ariyilla. But just start kuttaa.',
]

export const pepTalks = [
  'Tiny today > heroic tomorrow.',
  'Show up ugly. Improve later. Pwolikkam.',
  'You do not need a perfect day. You need a non-zero day.',
  'Consistency is boring. That is why it works. Adichu keri vaa!',
  'One checkbox can change the mood of the whole day. Sathyam.',
  'Atomic habit machane: 1% better every day.',
  'Oru 5 minute... athre ollu. You got this.',
]

export const methods = [
  ['⏱️','5-Minute Thallu (Tiny Start)','Make the first promise ridiculously small: 5 minutes. Continuing is optional. Madi maattan best aanu.'],
  ['🔄','Habit Loop (Atomic)','Cue -> Craving -> Response -> Reward. Keep the cue obvious, Aliya.'],
  ['🧠','Padippi Technique (Active Recall)','Close the notes. Explain, solve, or sketch from memory. Then check what you missed. Nammal aara!'],
  ['🎯','If → Then','Decide the cue in advance: “After breakfast, I do 10 mins.” Less thinking, more doing.'],
  ['🧱','Habit Stacking','Tie a new habit to an old one: "After I drink chaya, I will write 1 paragraph."'],
  ['🍿','Temptation Bundle','Pair an annoying task with a pleasant cue: kappi, playlist, balcony, favourite snack.'],
  ['🪴','Minimum Day','Bad day? Keep the chain alive with the smallest meaningful version of the habit.'],
  ['📉','2-Minute Rule','Scale down any habit to a 2-minute version. Don\'t write a chapter, write a sentence. Easiest വഴി.'],
  ['🗣️','Teach It','Explain the idea out loud like your friend just asked “bro idhu entha?”'],
  ['🎲','Random Quest','Roll the dice and let chance choose a tiny useful action. Removes decision fatigue.'],
]

export const stupidThoughts = [
  "Padikkan irikkumbo mathram aanu fan-inte shabdam shraddikunnathu. 🦟",
  "Exam hall-il question paper kaanumbol ormakal varilla... pakshe 10 varsham munpathe movie dialogue varum. 🎬",
  "'Naale muthal serious aayi padikkanam' - The biggest lie ever told in Kerala. 🤥",
  "If 'Madi' was an Olympic sport, njan urappayum swarnam adichene. 🥇",
  "Pothu pole thinnal mathram pora, pothinulla buddhiyum koodi venam. 🐃",
  "Chila nerath thonnum ellam nirthi himalayathil poyaalo ennu... ⛰️",
  "Book thurakkumbol varunna aa urakkam... athoru prathyeka feel aaanu. 😴",
  "Urakkam varunnilla? Just open your textbook. Instant sleep guaranteed. 📖💤"
];

export const monkeyDialogues = [
  "Njan onnum kettillyee! 🙉",
  "Aaro vannu... marachu vekku! 🙈",
  "Para para, njan aarodum parayilla 🙊",
  "Onnu poyitharamo, njan kettu padikkuva! 🐒",
  "Ithu enthu prahasanam aanu? 👀",
  "Nammalu pottano? 🤪",
  "Scoop entha makkale? ☕"
];

export const dailyChallenges = [
  {
    title: 'Teach one thing badly, then better.',
    desc: 'Pick any idea you learned today. Explain it out loud in 60 seconds without notes. Then check what you forgot.',
    time: 60,
  },
  {
    title: 'The "Just 5 Minutes" Trick.',
    desc: 'Pick the task you are dreading the most. Set a timer for 5 minutes and just start. You can stop after 5 mins if you want.',
    time: 300,
  },
  {
    title: 'Write down 3 priorities.',
    desc: 'Close your eyes. What are the 3 most important things to do today? Write them down in 60 seconds. Everything else is a distraction.',
    time: 60,
  },
  {
    title: 'Stare at the wall (Dopamine reset).',
    desc: 'Do nothing for 2 minutes. No phone, no music, no talking. Let your brain get bored.',
    time: 120,
  },
  {
    title: 'Declutter your workspace.',
    desc: 'You have exactly 3 minutes to clean your desk, close useless browser tabs, and organize your space. Go!',
    time: 180,
  },
  {
    title: 'Feynman Technique (Mini).',
    desc: 'Take a complex concept you are studying. Try to explain it on a piece of paper as if teaching a 10-year-old. You have 3 minutes.',
    time: 180,
  },
  {
    title: 'Hydration & Stretch.',
    desc: 'Drink a glass of water, stand up, and stretch your body for 60 seconds. Your back will thank you.',
    time: 60,
  },
];
