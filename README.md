# 🗳️ Civix: Verified Civic Readiness Engine

**Civix** is a high-performance, non-partisan **Verified Civic Readiness Engine powered by Gemini + deterministic election logic**. It helps voters navigate registration, deadlines, and voting procedures with verifiable outputs.

![Next.js 16](https://img.shields.io/badge/Next.js-16+-black?style=for-the-badge&logo=next.js)
![Gemini 2.5](https://img.shields.io/badge/Google-Gemini_2.5_Flash-blue?style=for-the-badge&logo=googlegemini)
![Tailwind v4](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🚀 Key Features

- **Gemini 2.5 Flash Integration:** Leverages the latest Google AI for natural, jurisdiction-aware civic guidance.
- **Deterministic Deadline Engine:** Unlike standard LLMs that might hallucinate dates, Civix uses a custom logic engine to calculate real-time election deadlines for the user's specific state.
- **Intent-Aware Progress Tracking:** A smart UI that tracks the user's journey through registration, preparation, and voting based on conversational context.
- **Export Chat Utility:** Allows users to export their civic research as a professional text summary to take with them to the polls.
- **Modern Architecture:** Built using Next.js 16 Server Actions and React 19 concurrent features for maximum efficiency and security.

## 🛠️ Tech Stack

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **AI Model:** [Google Gemini 2.5 Flash](https://aistudio.google.com/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Testing:** [Vitest](https://vitest.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)

## 📦 Getting Started

### Prerequisites
- Node.js 20+
- A Google AI Studio API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Mrityunjoy240/civix-assistant.git
   cd civix-assistant
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Testing

We prioritize data accuracy. Run our test suite to verify the Deadline Engine:
```bash
npm run test
```

## 🛡️ Security & Privacy

Civix is designed with security in mind:
- **Zero Client-Side Keys:** All AI interactions are handled via secure Server Actions.
- **Privacy First:** We do not store personal user data; location detection happens on-the-fly to provide context-aware information.

## 📄 License
MIT

---
*Built with ❤️ for the Google PromptWars Hackathon 2026.*
