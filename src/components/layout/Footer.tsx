export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700 text-white mt-16 sm:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div className="space-y-3">
            <h3 className="text-lg font-bold">✨ Smart To-Do</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              A modern task management solution for teams and individuals.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-base">Features</h4>
            <ul className="text-gray-400 text-sm space-y-3">
              <li className="hover:text-white transition duration-300">📋 Todo Management</li>
              <li className="hover:text-white transition duration-300">👥 User Roles</li>
              <li className="hover:text-white transition duration-300">🔐 Secure Auth</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-base">Built With</h4>
            <div className="text-gray-400 text-sm space-y-2">
              <div className="leading-relaxed">Next.js 16 • React 19</div>
              <div className="leading-relaxed">TypeScript • MongoDB</div>
              <div className="leading-relaxed">Tailwind CSS • NextAuth</div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-400 text-sm">&copy; 2026 Smart To-Do. All rights reserved.</p>
          <p className="text-gray-500 text-xs mt-3">
            A role-based task management application built with modern technologies.
          </p>
        </div>
      </div>
    </footer>
  );
}
