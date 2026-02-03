'use client'

import React from "react"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    // Simple validation - in production, this would call a backend
    if (email && password.length >= 6) {
      localStorage.setItem('isAuth', 'true')
      localStorage.setItem('userEmail', email)
      setError('')
      router.push('/home')
    } else {
      setError('Invalid email or password')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-red-500 rounded-3xl p-8 shadow-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-red-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-white text-center mb-2">
          BLOODEX
        </h1>
        <p className="text-center text-red-100 text-sm mb-8">
          Connect. Donate. Save Lives.
        </p>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-full bg-red-400 bg-opacity-60 text-white placeholder-red-200 focus:outline-none focus:ring-2 focus:ring-red-300"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-full bg-red-400 bg-opacity-60 text-white placeholder-red-200 focus:outline-none focus:ring-2 focus:ring-red-300"
            />
          </div>

          {error && (
            <p className="text-red-100 text-sm text-center">{error}</p>
          )}

          <div className="flex justify-between items-center text-sm text-white pt-2">
            <a href="#" className="hover:underline">
              Forgot Password?
            </a>
            <Link href="/signup" className="hover:underline font-semibold">
              Sign Up
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-6 rounded-full transition mt-6"
          >
            LOGIN
          </button>
        </form>

        {/* Social Login */}
        <div className="mt-8 pt-6 border-t border-red-400">
          <p className="text-center text-red-100 text-xs mb-4">Or continue with</p>
          <div className="flex justify-center gap-4">
            <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:shadow-lg transition">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
            <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:shadow-lg transition">
              <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>
            <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:shadow-lg transition">
  <svg
    className="w-6 h-6 text-black"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M16.365 1.43c0 1.14-.47 2.27-1.26 3.08-.86.88-2.3 1.56-3.53 1.47-.18-1.11.31-2.25 1.05-3.05.74-.82 2.02-1.43 3.28-1.5z"/>
    <path d="M20.5 17.1c-.54 1.24-.8 1.79-1.5 2.88-.98 1.53-2.36 3.44-4.07 3.46-1.52.02-1.91-.99-3.98-.99s-2.5 1.02-4 .99c-1.7-.02-3-1.73-3.98-3.26-2.7-4.18-3-9.1-1.32-11.7 1.2-1.86 3.1-2.95 4.88-2.95 1.81 0 2.95 1 4.45 1 1.45 0 2.32-1 4.43-1 1.59 0 3.28.86 4.47 2.34-3.94 2.16-3.3 7.8.62 9.23z"/>
  </svg>
</button>

          </div>
        </div>
      </div>
    </div>
  )
}
