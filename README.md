# Docker Model Runner Chatbot Demo

An interactive **AI chatbot demo** built with **Next.js**, **AI Elements UI**, and **Docker Model Runner**, designed to run local large language models like **Gemma 3** directly on your machine — no external API required.

---

## Screenshot

<img width="1085" height="1214" alt="Screenshot 2025-11-02 191010" src="https://github.com/user-attachments/assets/c16aab5e-f2d6-4528-9ef0-7ffc80820166" />

## 🚀 Features

- **Local Inference** — Runs the Gemma 3 model locally via Docker Model Runner (OpenAI API–compatible endpoint).  
- **Modern Frontend** — Built with **AI Elements UI** for a polished chat experience.  
- **Message History** — Maintains user–assistant context during sessions.  
- **Retry & Copy Tools** — Regenerate last response or copy assistant messages.  

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | Next.js (App Router), React, TailwindCSS, AI Elements |
| Backend | Next.js API Route (`/api/chat`) |
| Model Serving | Docker Model Runner (Gemma 3 or compatible LLM) |
| Language | TypeScript |

---

## ⚙️ Setup

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/learning-llms.git
```

### 2. Install dependencies
```bash
bun install
```

### 3. Configure Environment
Create a local .env file:
```bash
LLM_API_URL=http://localhost:12434/v1/chat/completions
LLM_MODEL=gemma-3
```

### 4. Confirm LLM Model is running via Docker

<img width="1871" height="528" alt="image" src="https://github.com/user-attachments/assets/f2abc4e9-ae60-450d-8614-62629723badd" />

or use Docker Model CLI Commands.

### 5. Run the application
```bash
bun dev
```

Your chatbot will be available at http://localhost:3000

