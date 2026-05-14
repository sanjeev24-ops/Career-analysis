import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-dark-900 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.3),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.25),_transparent_30%)]" />
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-16">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full bg-white/5 px-4 py-2 text-sm text-sky-200 ring-1 ring-white/10 backdrop-blur">
                <span className="mr-2 inline-flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                New: AI-powered readiness review in under 2 minutes
              </div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-400 bg-clip-text text-transparent">
                Your Interview Readiness, Decoded in 2 Minutes
              </h1>
              <p className="max-w-xl text-lg text-slate-300">
                PrepPulse gives you a polished readiness score, personalized feedback, and an action plan so you can prepare faster with confidence.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row items-start sm:items-center">
              <button
                onClick={() => navigate('/assessment')}
                className="inline-flex items-center justify-center rounded-3xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-[0_25px_50px_-25px_rgba(79,70,229,0.8)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                Start Assessment
              </button>
              <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-300 backdrop-blur">
                Trusted by <span className="font-semibold text-white">1000+ candidates</span> preparing for tech interviews.
              </div>
            </div>
          </div>

          <div className="relative glass border-white/10 overflow-hidden rounded-[2rem] p-6 shadow-2xl shadow-blue-500/10 animate-slide-up">
            <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500" />
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="text-sm uppercase tracking-[0.3em] text-slate-400">Live dashboard</div>
                <h2 className="text-3xl font-semibold text-white">Interview Score</h2>
              </div>
              <div className="rounded-3xl bg-slate-950/70 px-4 py-3 text-sm text-slate-200">Ready in 2 min</div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Overall</p>
                  <p className="text-5xl font-bold text-cyan-300">85%</p>
                </div>
                <div className="rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-300">Interview Ready</div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  { title: 'Technical', value: '78%', accent: 'from-blue-500 to-sky-500' },
                  { title: 'Resume', value: '92%', accent: 'from-violet-500 to-fuchsia-500' },
                  { title: 'Communication', value: '65%', accent: 'from-amber-400 to-yellow-300' },
                  { title: 'Portfolio', value: '88%', accent: 'from-emerald-500 to-teal-400' },
                ].map(item => (
                  <div key={item.title} className="rounded-3xl bg-white/5 p-4">
                    <div className="text-sm text-slate-400">{item.title}</div>
                    <div className={`mt-3 rounded-2xl bg-slate-900/80 p-4 text-xl font-semibold text-white bg-gradient-to-r ${item.accent}`}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-950/75 p-5">
                <p className="text-sm text-slate-400">Smart feedback</p>
                <p className="mt-2 text-base text-slate-200">No measurable impact detected in your resume.</p>
              </div>
              <div className="rounded-3xl bg-slate-950/75 p-5">
                <p className="text-sm text-slate-400">Action</p>
                <p className="mt-2 text-base text-slate-200">Add metrics like “Improved performance by 30%”.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute left-10 top-28 h-36 w-36 rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="pointer-events-none absolute right-16 bottom-24 h-44 w-44 rounded-full bg-violet-500/15 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-20 w-20 -translate-x-1/2 rounded-full bg-white/10 blur-xl" />
    </div>
  );
};

export default Landing;