'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    const isAuth = localStorage.getItem('isAuth')
    if (isAuth) {
      router.push('/home')
    } else {
      router.push('/login')
    }
  }, [router])

  return null
}
