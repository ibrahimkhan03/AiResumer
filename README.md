# Ai-Resumer

A modern AI-powered resume builder with job tracking functionality.

## Features
- 📝 AI-powered resume generation
- 💼 Job application tracking
- 🎨 Professional resume templates
- 📊 Dashboard for managing resumes and jobs
- 🔐 Secure authentication with Clerk

## Tech Stack

### Frontend
- Next.js 15 with TypeScript
- React with modern hooks
- Tailwind CSS for styling
- shadcn/ui components
- Clerk for authentication

### Backend
- Node.js with Express
- Prisma ORM
- PostgreSQL database
- RESTful API architecture

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- Clerk account for authentication

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd Ai-Resumer
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend/client-site
npm install
```

4. Set up environment variables
- Create `.env` file in backend folder
- Add your database URL and Clerk keys

5. Run database migrations
```bash
cd backend
npx prisma migrate dev
```

6. Start the development servers

Backend:
```bash
cd backend
npm start
```

Frontend:
```bash
cd frontend/client-site
npm run dev
```

## Project Structure
```
Ai-Resumer/
├── backend/          # Express.js API server
├── frontend/
│   └── client-site/   # Next.js frontend application
└── README.md
```

## Contributing
Feel free to submit issues and enhancement requests!

## License
This project is licensed under the MIT License.
