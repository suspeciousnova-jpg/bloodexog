'use client'

import { useRouter, usePathname } from 'next/navigation'

interface BottomNavProps {
  currentPage: 'home' | 'profile'
}

export default function BottomNav({ currentPage }: BottomNavProps) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-red-500 border-t-4 border-red-600 flex items-center justify-around py-3 z-50">
      {/* Home */}
      <button
        onClick={() => router.push('/home')}
        className={`flex flex-col items-center justify-center gap-1 py-2 px-6 rounded-lg transition ${
          currentPage === 'home'
            ? 'bg-red-400 bg-opacity-60'
            : 'hover:bg-red-400 hover:bg-opacity-30'
        }`}
        aria-label="Home"
      >
        <svg
          className={`w-6 h-6 ${currentPage === 'home' ? 'text-white' : 'text-red-100'}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
        <span className={`text-xs font-semibold ${currentPage === 'home' ? 'text-white' : 'text-red-100'}`}>
          Home
        </span>
      </button>

      {/* Profile */}
      <button
        onClick={() => router.push('/profile')}
        className={`flex flex-col items-center justify-center gap-1 py-2 px-6 rounded-lg transition ${
          currentPage === 'profile'
            ? 'bg-red-400 bg-opacity-60'
            : 'hover:bg-red-400 hover:bg-opacity-30'
        }`}
        aria-label="Profile"
      >
        <svg
          className={`w-6 h-6 ${currentPage === 'profile' ? 'text-white' : 'text-red-100'}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
        <span className={`text-xs font-semibold ${currentPage === 'profile' ? 'text-white' : 'text-red-100'}`}>
          Profile
        </span>
      </button>
    </div>
  )
}
