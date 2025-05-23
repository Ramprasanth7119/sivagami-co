import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Profile = () => {
  const [userData, setUserData] = useState({ name: '', email: '' })
  const [form, setForm] = useState({ name: '', email: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editable, setEditable] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        if (!token) {
          setError('Please login to view profile')
          return
        }

        const response = await axios.get('http://localhost:4000/api/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (response.data.success && response.data.user) {
          setUserData(response.data.user)
          setForm(response.data.user)
        } else {
          setError('Failed to fetch profile data')
        }
      } catch (error) {
        setError(error.response?.data?.message || 'Error fetching profile')
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const token = localStorage.getItem('token')
      const response = await axios.put('http://localhost:4000/api/user/profile', form, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.data.success) {
        setUserData(form)
        setEditable(false)
      } else {
        setError('Failed to update profile')
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="bg-white shadow-md rounded p-6">
        <div className="mb-4">
          <label className="font-semibold">Name:</label>
          {editable ? (
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
            />
          ) : (
            <p>{userData.name}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="font-semibold">Email:</label>
          {editable ? (
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
            />
          ) : (
            <p>{userData.email}</p>
          )}
        </div>
        <div className="mt-4">
          {editable ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-gray-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => setEditable(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditable(true)}
              className="bg-gray-500 hover:bg-dark-600 text-white px-4 py-2 rounded"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
