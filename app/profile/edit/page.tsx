'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import BottomNav from '@/components/BottomNav'

export default function EditProfile() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      // 1. Get the Auth User ID
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // 2. Fetch data using ID instead of Email
        const { data } = await supabase
          .from('donors')
          .select('*')
          .eq('id', user.id)
          .single()

        if (data) {
          setName(data.full_name)
          setPhone(data.phone)
        }
      } else {
        router.push('/login')
      }
    }
    fetchUser()
  }, [router])

  const handleUpdate = async () => {
    setLoading(true)
    
    // 1. Get current Auth User ID
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      // 2. Update using ID instead of Email
      const { error } = await supabase
        .from('donors')
        .update({ 
          full_name: name, 
          phone: phone 
        })
        .eq('id', user.id) // Identify the row by ID

      if (!error) {
        localStorage.setItem('userName', name)
        router.push('/profile')
      } else {
        alert("Update failed: " + error.message)
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-red-600 p-6 text-white font-bold flex gap-4">
        <button onClick={() => router.back()}>✕</button>
        <h1>Edit Profile</h1>
      </div>

      <div className="p-8 space-y-6">
        <div>
          <label className="text-gray-400 text-xs font-bold uppercase">Full Name</label>
          <input 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            className="w-full border-b-2 border-red-500 py-2 outline-none text-lg"
          />
        </div>

        <div>
          <label className="text-gray-400 text-xs font-bold uppercase">Phone Number</label>
          <input 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border-b-2 border-red-500 py-2 outline-none text-lg"
          />
        </div>

        <button 
          onClick={handleUpdate}
          className="w-full bg-red-600 text-white font-bold py-4 rounded-xl shadow-lg mt-10"
        >
          {loading ? 'SAVING...' : 'SAVE CHANGES'}
        </button>
      </div>
      <BottomNav currentPage="profile" />
    </div>
  )
}