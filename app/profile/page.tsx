'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import BottomNav from '@/components/BottomNav'

export default function ProfilePage() {
  const router = useRouter()
  
  const [status, setStatus] = useState<'loading' | 'authorized'>('loading')
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userPhone, setUserPhone] = useState('')
  const [userBloodGroup, setUserBloodGroup] = useState('')
  const [userLocation, setUserLocation] = useState('Loading...')
  const [isAvailable, setIsAvailable] = useState(true)

  useEffect(() => {
    const isAuth = localStorage.getItem('isAuth')
    const storedEmail = localStorage.getItem('userEmail')

    if (!isAuth || !storedEmail) {
      router.replace('/login')
    } else {
      const getProfileData = async () => {
        // 1. Get the current logged-in user's ID from Supabase Auth
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
          // 2. Fetch from 'donors' table using the ID instead of email
          const { data, error } = await supabase
            .from('donors')
            .select('*')
            .eq('id', user.id) // Using ID is much safer than email
            .single()

          if (data) {
            setUserName(data.full_name)
            setUserEmail(storedEmail) // Use email from local storage
            setUserPhone(data.phone)
            setUserBloodGroup(data.blood_group)
            setUserLocation(`${data.place}, ${data.district}`)
            
            localStorage.setItem('userName', data.full_name)
            setStatus('authorized')
          } else {
            console.error("No donor record found for this ID")
            router.replace('/login')
          }
        } else {
          router.replace('/login')
        }
      }
      getProfileData()
    }
  }, [router])

  const handleLogout = () => {
    localStorage.clear()
    router.replace('/login')
  }

  const handleEditProfile = () => {
    router.push('/profile/edit')
  }

  if (status === 'loading') {
    return <div className="min-h-screen bg-red-500 flex items-center justify-center text-white font-bold">Loading Profile...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-500 to-red-400 pb-20">
      {/* Header */}
      <div className="bg-red-500 pt-6 pb-20 relative">
        <div className="flex justify-between items-center px-6 mb-8">
          <button onClick={() => router.push('/home')} className="text-white hover:opacity-80 transition">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-black text-white uppercase tracking-widest">My Profile</h1>
          <div className="w-8" />
        </div>

        <div className="flex justify-center">
          <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center border-4 border-white shadow-2xl">
            <svg className="w-16 h-16 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="px-6 -mt-12 relative z-10">
        <div className="bg-white rounded-[2rem] p-8 shadow-2xl space-y-6">
          <div className="text-center border-b border-gray-100 pb-4">
            <h2 className="text-3xl font-black text-gray-800 tracking-tight">{userName}</h2>
            <p className="text-gray-400 font-medium">{userEmail}</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
              <div className="flex items-center gap-4">
                <div className="bg-red-600 w-12 h-12 flex items-center justify-center rounded-xl text-white font-black text-xl shadow-md">
                  {userBloodGroup}
                </div>
                <p className="text-gray-700 font-bold">Blood Group</p>
              </div>
            </div>

            <ProfileInfoRow label="Phone" value={userPhone} icon="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            <ProfileInfoRow label="Location" value={userLocation} icon="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
            <span className="font-bold text-gray-700">Donation Status</span>
            <button 
              onClick={() => setIsAvailable(!isAvailable)}
              className={`px-4 py-2 rounded-xl font-black text-[10px] transition-all ${isAvailable ? 'bg-green-500 text-white shadow-lg shadow-green-100' : 'bg-gray-300 text-gray-600'}`}
            >
              {isAvailable ? '✓ AVAILABLE' : 'BUSY'}
            </button>
          </div>

          <div className="pt-4 space-y-3">
            <button 
              onClick={handleEditProfile} 
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl shadow-xl active:scale-95 transition-all uppercase tracking-widest"
            >
              Edit Profile
            </button>

            <button 
              onClick={handleLogout} 
              className="w-full text-red-500 font-bold py-2 hover:bg-red-50 rounded-xl transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>

      <BottomNav currentPage="profile" />
    </div>
  )
}

function ProfileInfoRow({ label, value, icon }: { label: string, value: string, icon: string }) {
  return (
    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-100">
      <div className="bg-white p-2 rounded-lg shadow-sm text-red-500">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={icon} />
        </svg>
      </div>
      <div>
        <p className="text-[10px] text-gray-400 uppercase font-black tracking-tighter">{label}</p>
        <p className="text-gray-800 font-bold text-sm">{value}</p>
      </div>
    </div>
  )
}