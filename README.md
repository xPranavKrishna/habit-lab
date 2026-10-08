# Habit Lab 🧪 (formerly StudyQuest)

> **"Built for lazy humans who procrastinate beautifully. ✦ pwoli saanam"**

Habit Lab is a quirky, brutalist-inspired personal learning cockpit and habit tracker. It is designed to make consistency feel less like a chore and more like a game, blending productivity with a healthy dose of humor and local Malayalam pop-culture flavor.

![Habit Lab Preview](https://via.placeholder.com/800x450.png?text=Habit+Lab+%F0%9F%A7%AA)

## 🌟 Features

- **Today (Daily Tasks):** A no-nonsense to-do list with a built-in 60-second random teaching challenge to test your memory.
- **Brain Lab:** Curated learning techniques like the Feynman Technique, Pomodoro, and Spaced Repetition explained in simple terms.
- **Idea Wall (Vattaaya Chinthakal):** A dedicated space for random, stupid thoughts and a digital drawing canvas for when your brain needs a break.
- **Music (Pattu Petti):** Quick links to your favorite music platforms and a tracker for your ultimate Lo-Fi study anthems.
- **Gossips 👀 (Paradhushanam):** Because studying is hard, but talking about others is easy. Write down your tea, and add your enemies to the "Hit List" to roast them.
- **Magic Link Authentication:** Passwordless, secure login powered by Supabase.
- **Micro-Interactions:** Custom bouncy CSS animations, brutalist design elements, and a theme switcher (Dark/Light mode).

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** TypeScript / React
- **Styling:** CSS Modules / Tailwind CSS (Custom Brutalist Theme)
- **Backend/Auth:** [Supabase](https://supabase.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher)
- A Supabase account and project

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/habit-lab.git
   cd habit-lab
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 Deployment (Vercel)

The easiest way to deploy this application is to use the [Vercel Platform](https://vercel.com/new).

1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. **Important:** Add the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as Environment Variables in your Vercel project settings before deploying.
4. Click Deploy!

## 🎨 Design Philosophy
Habit Lab rejects corporate, sterile design. It embraces **Brutalism**, heavy borders, high-contrast colors, and cheeky micro-copy. It talks to you like a friend who is slightly disappointed in your life choices but wants you to succeed anyway.

---
*Created with ❤️ and a lot of Chaya ☕.*
