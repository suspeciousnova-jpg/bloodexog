'use client'

import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'

interface DonorProfile {
  id: string | number
  name: string
  bloodGroup: string
  distance: string
  lastDonation: string
  district: string
  place: string
  phone: string
}

export default function HomePage() {
  const router = useRouter()
  
  // --- AUTH SHIELD STATES ---
  const [status, setStatus] = useState<'loading' | 'authorized'>('loading')
  const [userName, setUserName] = useState('')
  
  // --- SEARCH & DISPLAY STATES ---
  const [bloodGroup, setBloodGroup] = useState('')
  const [district, setDistrict] = useState('')
  const [place, setPlace] = useState('')
  const [searchResults, setSearchResults] = useState<DonorProfile[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const bloodGroups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']
  
  const places: { [key: string]: string[] } = {
    "Thiruvananthapuram": ["Athiyannoor", "Chirayinkeezhu", "Kilimanoor", "Nedumangad", "Nemom", "Parassala", "Perumkadavila", "Pothencode", "Vamanapuram", "Varkala", "Vellanad"],
    "Kollam": ["Anchal", "Chadayamangalam", "Chavara", "Chittumala", "Ithikkara", "Kottarakkara", "Mukhathala", "Oachira", "Pathanapuram", "Sasthamcotta", "Vettikkavala"],
    "Pathanamthitta": ["Elanthoor", "Koipuram", "Konni", "Mallappally", "Pandalam", "Parakode", "Pulikeezhu", "Ranni"],
    "Alappuzha": ["Ambalappuzha", "Aryad", "Bharanickavu", "Champakkulam", "Chengannur", "Haripad", "Kanjikuzhy", "Mavelikkara", "Muthukulam", "Pattanakkad", "Thycattussery", "Veliyanad"],
    "Kottayam": ["Erattupetta", "Ettumanoor", "Kaduthuruthy", "Kanjirappally", "Lalam", "Madappally", "Pallom", "Pampady", "Uzhavoor", "Vaikom", "Vazhoor"],
    "Idukki": ["Adimaly", "Azhutha (Peermade)", "Devikulam", "Elamdesom", "Idukki", "Kattappana", "Nedumkandam", "Thodupuzha"],
    "Ernakulam": ["Alangad", "Angamaly", "Edappally", "Koovappady", "Kothamangalam", "Mulanthuruthy", "Muvattupuzha", "Palluruthy", "Pampakuda", "Parakkadavu", "Paravur", "Vadavucode", "Vazhakulam", "Vypin"],
    "Thrissur": ["Anthikkad", "Chalakkudy", "Chavakkad", "Cherpu", "Chowannur", "Irinjalakkuda", "Kodakara", "Mala", "Mathilakam", "Mullassery", "Ollukkara", "Pazhayannur", "Puzhakkal", "Thalikkulam", "Vellangallur", "Wadakkanchery"],
    "Palakkad": ["Alathur", "Attappady", "Chittur", "Kollengode", "Kuzhalmannam", "Malampuzha", "Mannarkkad", "Nenmara", "Ottappalam", "Palakkad", "Pattambi", "Sreekrishnapuram", "Thrithala"],
    "Malappuram": ["Areekode", "Kalikavu", "Kondotty", "Kuttippuram", "Malappuram", "Mankada", "Nilambur", "Perinthalmanna", "Perumpadappa", "Ponnani", "Tanur", "Tirur", "Tirurangadi", "Vengara", "Wandoor"],
    "Kozhikode": ["Balussery", "Chelannur", "Koduvally", "Kozhikode", "Kunnamangalam", "Kunnummal", "Melady", "Panthalayani", "Perambra", "Thodannur", "Tuneri", "Vatakara"],
    "Wayanad": ["Kalpetta", "Mananthavady", "Panamaram", "Sulthan Bathery"],
    "Kannur": ["Edakkad", "Irikkur", "Iritty", "Kalliasseri", "Kannur", "Kuthuparamba", "Panoor", "Payyannur", "Peravoor", "Thalassery", "Thaliparamba"],
    "Kasaragod": ["Kanhangad", "Karadka", "Kasaragod", "Manjeshwaram", "Neeleswaram", "Parappa"]
  }

  useEffect(() => {
    const isAuth = localStorage.getItem('isAuth')
    const name = localStorage.getItem('userName')

    if (!isAuth) {
      router.replace('/login')
    } else {
      setUserName(name || 'User')
      setStatus('authorized')
      fetchInitialDonors() // Load recent donors on start
    }
  }, [router])

  // --- FETCH RECENT DONORS ON LOAD ---
  const fetchInitialDonors = async () => {
    const { data, error } = await supabase
      .from('donors')
      .select('*')
      .order('id', { ascending: false })
      .limit(5)

    if (!error && data) {
      formatAndSetResults(data)
    }
  }

  // Helper to format DB data to UI data
  const formatAndSetResults = (data: any[]) => {
    const formatted = data.map((d: any) => ({
      id: d.id,
      name: d.full_name,
      bloodGroup: d.blood_group,
      district: d.district,
      place: d.place,
      phone: d.phone,
      lastDonation: 'N/A',
      distance: 'N/A'
    }))
    setSearchResults(formatted)
  }

  const handleFindDonors = async () => {
    if (bloodGroup || district || place) {
      let query = supabase.from('donors').select('*')

      if (bloodGroup) query = query.eq('blood_group', bloodGroup)
      if (district) query = query.eq('district', district)
      if (place) query = query.eq('place', place)

      const { data, error } = await query

      if (error) {
        console.error('Error fetching donors:', error)
      } else if (data) {
        formatAndSetResults(data)
        setHasSearched(true)
      }
    }
  }

  // --- PREVENT RENDER IF NOT LOGGED IN ---
  if (status === 'loading') {
    return <div className="min-h-screen bg-red-600 flex items-center justify-center text-white font-bold animate-pulse">Checking Access...</div>
  }

  return (
    <div className="min-h-screen bg-red-500 flex flex-col pb-24">
      {/* Header */}
      <div className="pt-8 px-6 pb-6 text-center text-white">
        <h1 className="text-4xl font-bold mb-2 tracking-tighter">BLOODEX</h1>
        <p className="opacity-80 text-xs mb-4 uppercase tracking-widest">Connect • Donate • Save Lives</p>
        <h2 className="text-2xl font-bold italic">Welcome, {userName}!</h2>
      </div>

      {/* Search Section */}
      <div className="px-6 pb-6 space-y-4">
        <div className="relative">
          <select
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            className="w-full px-4 py-4 rounded-2xl bg-white text-gray-700 focus:outline-none appearance-none cursor-pointer text-center font-black shadow-lg text-lg"
          >
            <option value="">Select Blood Group</option>
            {bloodGroups.map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
          <div className="absolute right-6 top-5 pointer-events-none text-gray-400">▼</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <select
              value={district}
              onChange={(e) => {
                setDistrict(e.target.value)
                setPlace('')
              }}
              className="w-full px-4 py-3 rounded-2xl bg-white text-gray-700 focus:outline-none appearance-none text-center text-sm font-bold shadow-md"
            >
              <option value="">District</option>
              {Object.keys(places).sort().map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <select
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              disabled={!district}
              className="w-full px-4 py-3 rounded-2xl bg-white text-gray-700 focus:outline-none appearance-none text-center text-sm font-bold shadow-md disabled:bg-red-400 disabled:text-red-200"
            >
              <option value="">Place</option>
              {district && places[district]?.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleFindDonors}
          className="w-full bg-black text-white font-black py-4 rounded-2xl transition-all shadow-2xl active:scale-95 uppercase tracking-widest mt-2 hover:bg-gray-900"
        >
          Find Donors
        </button>
      </div>

      {/* Results / Recent Section */}
      <div className="px-6 flex-1">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white uppercase tracking-tight">
            {hasSearched ? `Search Results (${searchResults.length})` : 'Recent Donors'}
          </h3>
          {hasSearched && (
            <button 
              onClick={() => { setHasSearched(false); fetchInitialDonors(); setBloodGroup(''); setDistrict(''); setPlace(''); }}
              className="text-xs text-white bg-red-400 px-3 py-1 rounded-full font-bold"
            >
              Clear
            </button>
          )}
        </div>

        <div className="space-y-4">
          {searchResults.map((donor) => (
            <DonorCard key={donor.id} donor={donor} />
          ))}
          
          {hasSearched && searchResults.length === 0 && (
            <div className="bg-red-400 p-8 rounded-3xl text-center text-white font-bold border-2 border-dashed border-red-300">
              No donors found in this location.
            </div>
          )}
        </div>
      </div>

      <BottomNav currentPage="home" />
    </div>
  )
}

function DonorCard({ donor }: { donor: DonorProfile }) {
  return (
    <div className="bg-white rounded-3xl p-5 text-gray-800 shadow-xl flex justify-between items-center border-b-4 border-gray-200 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <span className="bg-red-600 text-white px-3 py-1 rounded-xl text-xs font-black shadow-sm">
            {donor.bloodGroup}
          </span>
          <p className="font-bold text-lg leading-none">{donor.name}</p>
        </div>
        <p className="text-sm text-gray-500 font-medium">
          📍 {donor.place}, {donor.district}
        </p>
      </div>

      <a 
        href={`tel:${donor.phone}`} 
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-2xl shadow-lg active:scale-90 transition-transform"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      </a>
    </div>
  )
}