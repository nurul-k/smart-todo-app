import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="space-y-32 sm:space-y-40 py-4">
      {/* Hero Section */}
      <section className="hero-container text-center space-y-10 pt-12 sm:pt-20 lg:pt-28">
        <div className="space-y-6">
          <p className="welcome-text text-sm sm:text-base font-bold text-2xl sm:text-3xl md:text-4xl uppercase tracking-widest text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
            ✨ Welcome to Smart To-Do
          </p>

          <h1 className="sub-heading text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-gray-900 leading-tight">
            Stay organized with{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">role-based</span> task management
          </h1>

          <p className="hero-desc text-gray-600 mx-auto text-base sm:text-lg leading-relaxed">
            A powerful, secure, and modern todo application for both users and administrators,
            built with Next.js, TypeScript, and MongoDB.
          </p>
        </div>

        <div className="btn-row flex flex-col sm:flex-row flex-wrap justify-center gap-6 pt-8 sm:pt-12">
          <Link href="/register" className="w-full sm:w-auto">
            <Button size="lg" variant="primary" className="hero-btn w-full sm:w-auto">
              Get Started →
            </Button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <Button size="lg" variant="secondary" className="hero-btn-two w-full sm:w-auto">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="hw space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900">How It Works</h2>
          <p className="hw-small-txt text-gray-600">Simple, intuitive, and powerful</p>
        </div>
        <div className="boxes grid gap-8 md:gap-10 md:grid-cols-3">
          <div className="numb group rounded-2xl border border-white/40 bg-white/30 backdrop-blur-xl p-8 sm:p-10 shadow-lg hover:shadow-2xl hover:border-blue-400 transition-all duration-300 transform hover:-translate-y-2">
            <div className=" mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 text-2xl font-bold text-white shadow-lg">
              1
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Register</h3>
            <p className="text-gray-600 leading-relaxed">
              Create an account with your email and password to get started.
            </p>
          </div>
          <div className="numb group rounded-2xl border border-white/40 bg-white/30 backdrop-blur-xl p-8 sm:p-10 shadow-lg hover:shadow-2xl hover:border-purple-400 transition-all duration-300 transform hover:-translate-y-2">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-purple-500 text-2xl font-bold text-white shadow-lg">
              2
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Manage Tasks</h3>
            <p className="text-gray-600 leading-relaxed">
              Create, update, and organize your todos with an intuitive interface.
            </p>
          </div>
          <div className="numb group rounded-2xl border border-white/40 bg-white/30 backdrop-blur-xl p-8 sm:p-10 shadow-lg hover:shadow-2xl hover:border-pink-400 transition-all duration-300 transform hover:-translate-y-2">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-pink-600 to-pink-500 text-2xl font-bold text-white shadow-lg">
              3
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Stay Organized</h3>
            <p className="text-gray-600 leading-relaxed">
              Track completed and pending tasks with ease and maintain productivity.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="hw space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900">Powerful Features</h2>
          <p className="hw-small-txt text-gray-600">Everything you need to stay productive</p>
        </div>
        <div className="boxes grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="numb group rounded-2xl border border-blue-200/50 bg-gradient-to-br from-blue-50/80 to-white/50 backdrop-blur p-6 sm:p-8 shadow-lg hover:shadow-xl hover:border-blue-400 transition-all duration-300">
            <div className="mb-4 text-4xl">👤</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">User Dashboard</h3>
            <p className="text-sm text-gray-600">Manage your personal todos easily.</p>
          </div>
          <div className="numb group rounded-2xl border border-purple-200/50 bg-gradient-to-br from-purple-50/80 to-white/50 backdrop-blur p-6 sm:p-8 shadow-lg hover:shadow-xl hover:border-purple-400 transition-all duration-300">
            <div className="mb-4 text-4xl">🔐</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Secure Auth</h3>
            <p className="text-sm text-gray-600">Your data is safely protected.</p>
          </div>
          <div className="numb group rounded-2xl border border-pink-200/50 bg-gradient-to-br from-pink-50/80 to-white/50 backdrop-blur p-6 sm:p-8 shadow-lg hover:shadow-xl hover:border-pink-400 transition-all duration-300">
            <div className="mb-4 text-4xl">👨‍💼</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Admin Panel</h3>
            <p className="text-sm text-gray-600">Manage users and analytics.</p>
          </div>
          <div className="numb group rounded-2xl border border-orange-200/50 bg-gradient-to-br from-orange-50/80 to-white/50 backdrop-blur p-6 sm:p-8 shadow-lg hover:shadow-xl hover:border-orange-400 transition-all duration-300">
            <div className="mb-4 text-4xl">📱</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Responsive</h3>
            <p className="text-sm text-gray-600">Works on all devices.</p>
          </div>
        </div>
      </section>

      {/* About Project */}
      <section className="abt-pjt rounded-3xl bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 border border-white/40 backdrop-blur-xl p-8 sm:p-12 lg:p-16 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900">About This Project</h2>
        <p className="abt-desc mx-auto max-w-3xl text-base sm:text-lg text-gray-700 leading-relaxed">
          This is a portfolio-ready, production-level todo application built with{' '}
          <span className="font-bold text-blue-600">Next.js 16</span>,{' '}
          <span className="font-bold text-purple-600">React 19</span>,{' '}
          <span className="font-bold text-pink-600">TypeScript</span>, and{' '}
          <span className="font-bold text-orange-600">MongoDB</span>. It demonstrates modern web development
          practices including secure authentication, role-based authorization, clean architecture, and responsive
          design.
        </p>
      </section>
    </div>
  );
}