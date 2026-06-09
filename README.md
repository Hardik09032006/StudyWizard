# AI-Powered Study Buddy 🎓⚡

A full-stack MERN application that leverages Groq AI (Llama 3.3 70B) to help students study smarter. Features include an AI Topic Explainer, Note Summarizer, Quiz Generator, and 3D Flashcard Generator.

## 🚀 Features
- **Topic Explainer:** Get clear explanations for any topic at Simple, Intermediate, or Advanced levels.
- **Note Summarizer:** Condense long study notes into concise, organized bullet points.
- **Quiz Generator:** Instantly create multiple-choice quizzes with scoring and feedback.
- **Concept Flashcards:** Generate interactive 3D flip flashcards for key concepts.
- **History Dashboard:** All generated study materials are automatically saved to your history.
- **Premium UI:** Dark mode with glassmorphism, responsive design, and fluid animations.

## 🛠️ Tech Stack
- **Frontend:** React.js, Vite, React Router, Framer Motion, Vanilla CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **AI Integration:** Groq SDK (`llama-3.3-70b-versatile`)

---

## 💻 Local Development Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or a free Atlas cluster URL)
- Groq API Key (Get it free at [console.groq.com](https://console.groq.com))

### 1. Clone & Install Dependencies
Run the following from the root directory:
```bash
# Install root dependencies (concurrently)
npm install

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Variables
Create a `.env` file inside the `server/` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/studybuddy
GROQ_API_KEY=your_groq_api_key_here
```

### 3. Start the Application
From the root directory, start both frontend and backend concurrently:
```bash
npm run dev
```
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000


