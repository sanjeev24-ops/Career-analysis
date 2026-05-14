import { useState, useEffect } from 'react';
import { sections, getScore, getOverallScore, getLevel } from '../data/questions';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import CircularProgress from './CircularProgress';

const Assessment = () => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeLeft, setTimeLeft] = useState(120);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const currentSection = sections[currentSectionIndex];
  const currentQuestion = currentSection.questions[currentQuestionIndex];
  const currentAnswer = currentSection.id === 'technical'
    ? answers.technical?.[currentQuestion?.id] || ''
    : answers[currentSection.id] || '';
  const totalSections = sections.length + sections.find(s => s.id === 'technical')!.questions.length - 1;
  const completedStep = currentSectionIndex + (currentSection.id === 'technical' ? currentQuestionIndex / currentSection.questions.length : 0);
  const progress = Math.round((completedStep / totalSections) * 100);

  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, showResults]);

  const handleAnswer = (answer: string) => {
    if (currentSection.id === 'technical') {
      setAnswers(prev => ({
        ...prev,
        technical: { ...prev.technical, [currentQuestion.id]: answer }
      }));
    }
    if (currentQuestionIndex < currentSection.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentQuestionIndex(0);
    } else {
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setShowResults(true);
      }, 2000);
    }
  };

  const handleInputChange = (sectionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [sectionId]: value }));
  };

  const handleNext = () => {
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentQuestionIndex(0);
    } else {
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setShowResults(true);
      }, 2000);
    }
  };

  const handleBack = () => {
    if (currentSection.id === 'technical' && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentSectionIndex > 0) {
      const prevSectionIndex = currentSectionIndex - 1;
      const prevSection = sections[prevSectionIndex];
      setCurrentSectionIndex(prevSectionIndex);
      setCurrentQuestionIndex(prevSection.questions.length - 1);
    }
  };

  const canGoBack = currentSectionIndex > 0 || (currentSection.id === 'technical' && currentQuestionIndex > 0);

  if (isAnalyzing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="text-center">
          <div className="text-4xl font-bold mb-4">Analyzing your profile...</div>
          <div className="flex space-x-2 justify-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-purple-500 rounded-full animate-bounce delay-100"></div>
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const overallScore = getOverallScore(answers);
    const level = getLevel(overallScore);
    const scores = sections.map(s => ({ name: s.title, score: getScore(s.id, answers) }));

    const getFeedback = (sectionId: string, score: number) => {
      if (sectionId === 'resume' && score < 15) return "Add measurable achievements and projects to your resume.";
      if (sectionId === 'technical' && score < 18) return "Practice core concepts like DSA and improve your technical skills.";
      if (sectionId === 'communication' && score < 12) return "Structure your answers better and avoid filler words like 'um', 'uh', 'like'.";
      if (sectionId === 'portfolio' && score < 20) return "Add GitHub or project links to showcase your work.";
      return "Great job! Keep improving.";
    };

    const levelColor = level.color === 'red' ? 'text-red-400' : level.color === 'yellow' ? 'text-amber-400' : 'text-emerald-400';

    return (
      <div className="min-h-screen p-8 bg-dark-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <CircularProgress score={overallScore} />
            <div className={`text-2xl font-semibold mt-4 ${levelColor}`}>{level.level}</div>
            <div className="flex justify-center space-x-4 mt-6">
              {scores.map(s => {
                if (s.score > 20) {
                  return <div key={s.name} className="px-4 py-2 bg-green-500/20 rounded-full text-green-400 text-sm">Strong {s.name} Base</div>;
                }
                if (s.score < 15) {
                  return <div key={s.name} className="px-4 py-2 bg-red-500/20 rounded-full text-red-400 text-sm">Needs {s.name} Improvement</div>;
                }
                return null;
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {scores.map(s => (
              <div key={s.name} className="glass rounded-2xl p-6 text-center">
                <div className="text-2xl font-bold mb-2">{s.score}</div>
                <div className="text-gray-400">{s.name}</div>
              </div>
            ))}
          </div>

          <div className="glass rounded-2xl p-6 mb-12">
            <h3 className="text-2xl font-semibold mb-4">Detailed Scores</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scores}>
                <XAxis dataKey="name" />
                <YAxis />
                <Bar dataKey="score" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-6 mb-12">
            {sections.map(s => {
              const score = getScore(s.id, answers);
              const feedback = getFeedback(s.id, score);
              return (
                <div key={s.id} className="glass rounded-2xl p-6">
                  <h4 className="text-xl font-semibold mb-2">{s.title} Feedback</h4>
                  <p className="text-gray-300">{feedback}</p>
                </div>
              );
            })}
          </div>

          <div className="glass rounded-2xl p-6 mb-12">
            <h3 className="text-2xl font-semibold mb-4">Action Plan</h3>
            <ul className="space-y-2">
              <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Practice DSA daily (30 mins)</li>
              <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Add 2 strong projects to resume</li>
              <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Improve communication clarity</li>
              <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Build a professional portfolio</li>
              <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Seek feedback from mentors</li>
            </ul>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                setCurrentSectionIndex(0);
                setCurrentQuestionIndex(0);
                setAnswers({});
                setTimeLeft(120);
                setIsAnalyzing(false);
                setShowResults(false);
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold hover:scale-105 transition-all"
            >
              Retake Assessment
            </button>
            <button className="px-6 py-3 glass rounded-xl font-semibold hover:scale-105 transition-all">Download Report</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-dark-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.16),_transparent_28%)]" />
      <div className="relative z-10 flex min-h-screen">
        <div className="w-80 flex-shrink-0 p-6">
          <div className="glass h-full rounded-[2rem] border border-white/10 p-6 shadow-2xl shadow-slate-950/20">
            <div className="mb-8">
              <div className="text-sm uppercase tracking-[0.3em] text-slate-400">Scoreboard</div>
              <h2 className="mt-3 text-3xl font-semibold text-white">Interview Prep</h2>
            </div>
            <div className="space-y-4">
              {sections.map((s, i) => (
                <div
                  key={s.id}
                  className={`rounded-3xl border px-4 py-4 transition-all ${i === currentSectionIndex ? 'border-blue-400 bg-blue-500/10 shadow-blue-500/10' : 'border-white/10 bg-slate-950/70'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{s.title}</span>
                    <span className="text-xs text-slate-400">{s.questions.length > 0 ? `${currentSectionIndex === i ? currentQuestionIndex + 1 : 0}/${s.questions.length}` : '1'} step</span>
                  </div>
                  <div className="mt-2 text-sm text-slate-400">{s.id === 'technical' ? 'Code and concept questions' : s.id === 'resume' ? 'Resume review' : s.id === 'communication' ? 'Communication analysis' : 'Portfolio assessment'}</div>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-3xl bg-slate-950/70 p-5 text-slate-300">
              <div className="text-sm uppercase tracking-[0.3em] text-slate-500">Time left</div>
              <div className="mt-3 text-3xl font-semibold text-white">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6">
          <div className="glass rounded-[2rem] border border-white/10 p-8 shadow-2xl shadow-slate-950/20">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-8">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Section</p>
                <h1 className="mt-3 text-4xl font-bold text-white">{currentSection.title}</h1>
                <p className="mt-3 max-w-2xl text-slate-300">{currentSection.id === 'technical' ? 'Answer the next technical question to reveal your technical readiness score.' : currentSection.id === 'resume' ? 'Paste your resume text and let PrepPulse analyze your professional story.' : currentSection.id === 'communication' ? 'Write a short response and we will evaluate your clarity and confidence.' : 'Share your portfolio or GitHub link for scoring.'}</p>
              </div>
              <div className="min-h-[100px] rounded-[2rem] bg-gradient-to-br from-blue-500/15 to-violet-500/15 p-6 text-center">
                <div className="text-sm uppercase tracking-[0.3em] text-slate-400">Progress</div>
                <div className="mt-4 text-3xl font-semibold text-white">{progress}%</div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-slate-950/80 p-8">
              {currentSection.questions.length > 0 ? (
                <>
                  <div className="mb-4 flex items-center justify-between rounded-3xl bg-slate-900/80 p-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Question {currentQuestionIndex + 1} of {currentSection.questions.length}</p>
                      <h2 className="mt-2 text-2xl font-semibold text-white">{currentQuestion.question}</h2>
                    </div>
                    <div className="rounded-3xl bg-white/5 px-4 py-2 text-sm text-slate-200">Technical</div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {currentQuestion.options.map(option => (
                      <button
                        key={option}
                        onClick={() => handleAnswer(option)}
                        className={`rounded-3xl border p-5 text-left transition-all duration-300 ${currentAnswer === option ? 'border-cyan-400 bg-cyan-500/10 text-white shadow-[0_15px_30px_-20px_rgba(56,189,248,0.8)]' : 'border-white/10 bg-slate-950/60 text-slate-200 hover:border-cyan-400 hover:bg-slate-900/80'}`}
                      >
                        <div className="text-lg font-semibold">{option}</div>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-6 rounded-3xl border border-white/10 bg-slate-900/80 p-6">
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Your response</p>
                    <p className="mt-3 text-slate-300">{currentSection.id === 'resume' ? 'Resume analyzer will score your content based on length, metrics, and keywords.' : currentSection.id === 'communication' ? 'Keep it concise, clear, and confident for the best score.' : 'A portfolio link with GitHub or live projects earns higher points.'}</p>
                  </div>
                  {currentSection.id === 'resume' || currentSection.id === 'communication' ? (
                    <textarea
                      value={answers[currentSection.id] || ''}
                      onChange={(e) => handleInputChange(currentSection.id, e.target.value)}
                      className="min-h-[260px] w-full rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-5 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                      placeholder={`Enter your ${currentSection.title.toLowerCase()}...`}
                    />
                  ) : (
                    <input
                      type="text"
                      value={answers[currentSection.id] || ''}
                      onChange={(e) => handleInputChange(currentSection.id, e.target.value)}
                      className="w-full rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-5 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                      placeholder={`Enter your ${currentSection.title.toLowerCase()} link...`}
                    />
                  )}
                </>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={handleBack}
                disabled={!canGoBack}
                className={`rounded-3xl px-6 py-4 text-sm font-semibold transition-all ${canGoBack ? 'bg-white/10 text-white hover:bg-white/15' : 'cursor-not-allowed bg-white/5 text-slate-500'}`}
              >
                Back
              </button>
              {currentSection.questions.length === 0 ? (
                <button
                  onClick={handleNext}
                  className="rounded-3xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-transform duration-300 hover:-translate-y-1"
                >
                  Continue
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;