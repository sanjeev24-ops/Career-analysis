export interface Question {
  id: string;
  question: string;
  options: string[];
  correct?: string;
}

export interface Section {
  id: string;
  title: string;
  questions: Question[];
}

export const sections: Section[] = [
  {
    id: 'resume',
    title: 'Resume',
    questions: [],
  },
  {
    id: 'technical',
    title: 'Technical',
    questions: [
      {
        id: 'dsa',
        question: 'How comfortable are you with Data Structures and Algorithms?',
        options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
        correct: 'Expert',
      },
      {
        id: 'lang',
        question: 'How many programming languages are you proficient in?',
        options: ['1', '2', '3', '4+'],
        correct: '4+',
      },
      {
        id: 'tools',
        question: 'How familiar are you with development tools and frameworks?',
        options: ['Basic', 'Intermediate', 'Advanced', 'Expert'],
        correct: 'Expert',
      },
      {
        id: 'oop',
        question: 'How well do you understand Object-Oriented Programming concepts?',
        options: ['Not familiar', 'Basic understanding', 'Good grasp', 'Expert level'],
        correct: 'Expert level',
      },
      {
        id: 'debug',
        question: 'How skilled are you at debugging code?',
        options: ['Struggle with it', 'Can debug simple issues', 'Handle most bugs', 'Debug complex systems'],
        correct: 'Debug complex systems',
      },
    ],
  },
  {
    id: 'communication',
    title: 'Communication',
    questions: [],
  },
  {
    id: 'portfolio',
    title: 'Portfolio',
    questions: [],
  },
];

export const getScore = (sectionId: string, answers: Record<string, any>): number => {
  const section = sections.find(s => s.id === sectionId);
  if (!section) return 0;

  if (sectionId === 'technical') {
    const correctCount = section.questions.filter(q => answers.technical?.[q.id] === q.correct).length;
    return correctCount * 6; // 30 / 5 = 6 per correct
  } else if (sectionId === 'resume') {
    let score = 0;
    const text = answers.resume || '';
    if (text.length > 200) score += 10;
    if (/project|experience|skill/i.test(text)) score += 10;
    if (/\d/.test(text)) score += 5;
    return Math.min(25, score);
  } else if (sectionId === 'communication') {
    const text = answers.communication || '';
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    let score = 0;
    if (words < 30) score = 5;
    else if (words <= 80) score = 20;
    else score = 15;
    const fillers = (text.match(/\bum\b|\buh\b|\blike\b/gi) || []).length;
    score -= fillers * 2;
    return Math.max(0, Math.min(20, score));
  } else if (sectionId === 'portfolio') {
    const link = answers.portfolio || '';
    if (/github|http/i.test(link)) return 25;
    return 10;
  }
  return 0;
};

export const getOverallScore = (answers: Record<string, string>): number => {
  const scores = sections.map(s => getScore(s.id, answers));
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
};

export const getLevel = (score: number): { level: string; color: string } => {
  if (score < 40) return { level: 'Beginner', color: 'red' };
  if (score < 70) return { level: 'Intermediate', color: 'yellow' };
  return { level: 'Interview Ready', color: 'green' };
};