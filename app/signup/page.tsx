'use client'

import { supabase } from '@/lib/supabase'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// 1. Data Structure for Districts and Places
const districtData: Record<string, string[]> = {
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
};

export default function SignupPage() {
  const router = useRouter()

  const [fullName, setFullName] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [bloodGroup, setBloodGroup] = useState('')
  const [district, setDistrict] = useState('')
  const [place, setPlace] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const bloodGroups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDistrict(e.target.value);
    setPlace(''); 
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !mobileNumber || !bloodGroup || !email || !password || !district || !place) {
      setError('Please fill in all fields');
      return;
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      return;
    }

    if (authData.user) {
      const { error: dbError } = await supabase
        .from('donors')
        .insert([
          {
            id: authData.user.id,
            full_name: fullName,
            phone: mobileNumber,
            blood_group: bloodGroup,
            district: district,
            place: place,
          }
        ]);

      if (dbError) {
        setError("Database Error: " + dbError.message);
      } else {
        localStorage.setItem('isAuth', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', fullName);
        router.push('/home'); 
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pb-20">
      <div className="w-full max-w-sm bg-red-500 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-4xl font-bold text-white text-center mb-8">BLOODEX</h1>

        <form onSubmit={handleSignup} className="space-y-4">
          <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-3 rounded-full bg-red-400 bg-opacity-60 text-white placeholder-red-200 focus:outline-none focus:ring-2 focus:ring-red-300" />
          <input type="tel" placeholder="Mobile Number" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} className="w-full px-4 py-3 rounded-full bg-red-400 bg-opacity-60 text-white placeholder-red-200 focus:outline-none focus:ring-2 focus:ring-red-300" />

          {/* District Select */}
          <select
            value={district}
            onChange={handleDistrictChange}
            className="w-full px-4 py-3 rounded-full bg-red-400 bg-opacity-60 text-white focus:outline-none focus:ring-2 focus:ring-red-300 appearance-none"
            style={{ backgroundColor: 'rgba(248, 113, 113, 0.6)' }}
          >
            <option value="" disabled className="bg-white text-gray-500">
              Select District
            </option>
            {Object.keys(districtData).map((dist) => (
              <option key={dist} value={dist} className="bg-white text-gray-800">
                {dist}
              </option>
            ))}
          </select>

          {/* Place Select */}
          <select
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            disabled={!district}
            className={`w-full px-4 py-3 rounded-full bg-red-400 bg-opacity-60 text-white focus:outline-none focus:ring-2 focus:ring-red-300 ${
              !district ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <option value="" disabled className="bg-white text-gray-500">
              Select Place
            </option>
            {district &&
              districtData[district].map((p) => (
                <option key={p} value={p} className="bg-white text-gray-800">
                  {p}
                </option>
              ))}
          </select>

          {/* Blood Group Select */}
          <select
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            className="w-full px-4 py-3 rounded-full bg-red-400 bg-opacity-60 text-white focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            <option value="" disabled className="bg-white text-gray-500">
              Blood Group
            </option>
            {bloodGroups.map((bg) => (
              <option key={bg} value={bg} className="bg-white text-gray-800">
                {bg}
              </option>
            ))}
          </select>

          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-full bg-red-400 bg-opacity-60 text-white placeholder-red-200 focus:outline-none focus:ring-2 focus:ring-red-300" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-full bg-red-400 bg-opacity-60 text-white placeholder-red-200 focus:outline-none focus:ring-2 focus:ring-red-300" />

          {error && <p className="text-red-100 text-sm text-center">{error}</p>}

          <button type="submit" className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-full transition shadow-lg">
            SIGN UP
          </button>

          {/* --- REVERSE PATH LINK --- */}
          <div className="text-center mt-6">
            <p className="text-red-100 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-white font-bold underline underline-offset-4 hover:text-red-200 transition-colors">
                Log In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}