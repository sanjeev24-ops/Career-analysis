# PrepPulse - Interview Readiness Scanner

A premium SaaS application for assessing interview preparedness across technical, resume, communication, and portfolio skills.

## Features

- **Landing Page**: Modern split-layout design with animated preview
- **Assessment Dashboard**: Sidebar-based navigation with progress tracking
- **Real-time Scoring**: Dynamic score calculation based on responses
- **Premium UI**: Glassmorphism, gradients, micro-interactions
- **Results Dashboard**: Comprehensive analysis with charts and action plans
- **Gamification**: Level badges and progress indicators

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Recharts for data visualization
- React Router for navigation

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

## Build for Production

```bash
npm run build
```

## Publish to GitHub Pages

This repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml`.
The app will be built and published automatically whenever changes are pushed to `main`.

If you want to publish manually, enable GitHub Pages under the repository settings and use the `gh-pages` branch created by the workflow.

## Project Structure

```
src/
├── components/
│   ├── Landing.tsx
│   ├── Assessment.tsx
│   └── CircularProgress.tsx
├── data/
│   └── questions.ts
├── App.tsx
├── main.tsx
└── index.css
```