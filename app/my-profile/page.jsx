'use client'

import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { Upload, Edit2, LogOut } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { Loader } from 'lucide-react'

export default function MyProfilePage() {
  const router = useRouter()
  const { accessToken, clearAuth, setProfileCompletion } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [uploadingDoc, setUploadingDoc] = useState(false)
  const [profileData, setProfileData] = useState({
    name: '',
    age: '',
    location: '',
    profession: '',
    religion: '',
    height: '',
    bio: '',
    about: '',
    lookingFor: '',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  })

  const [formData, setFormData] = useState(profileData)

  // Fetch profile on mount
  useEffect(() => {
    if (!accessToken) {
      router.push('/auth/login')
      return
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/v1/profile/me/', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        })
        if (res.ok) {
          const data = await res.json()
          const p = data.profile || {}
          const newProfile = {
            name: p.full_name || '',
            profession: p.occupation || '',
            about: p.about_me || '',
            bio: p.hobbies || '', // mapping hobbies to bio visually
            age: '', // not returned currently
            location: '',
            religion: '',
            height: '',
            lookingFor: data.preferences?.preferred_religion || '',
            photo: data.photos?.length ? `http://127.0.0.1:8000${data.photos[0].url}` : profileData.photo
          }
          setProfileData(newProfile)
          setFormData(newProfile)

          // Calculate Completion
          const fields = [newProfile.name, newProfile.profession, newProfile.about, newProfile.bio]
          const filled = fields.filter(f => f && f.trim() !== '').length
          setProfileCompletion(Math.round((filled / fields.length) * 100))
        }
      } catch (e) {
        console.error("Failed to fetch profile", e)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [accessToken, router, setProfileCompletion])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingDoc(true)

    const fd = new FormData()
    fd.append('file', file)

    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/profile/biodata/parse/', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` },
        body: fd
      })
      if (res.ok) {
        const data = await res.json()
        const parsed = data.structured_data || {}
        setFormData(prev => ({
          ...prev,
          name: parsed.full_name || prev.name,
          profession: parsed.occupation || prev.profession,
          height: parsed.height || prev.height
        }))
        setIsEditing(true)
        alert('Biodata parsed successfully! Review the extracted fields.')
      }
    } catch (e) {
      alert("Upload failed")
    } finally {
      setUploadingDoc(false)
    }
  }

  const handleSave = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/profile/me/', {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          full_name: formData.name,
          occupation: formData.profession,
          about_me: formData.about,
          hobbies: formData.bio,
          status: 'completed'
        })
      })

      if (res.ok) {
        setProfileData(formData)
        setIsEditing(false)
        alert('Profile updated successfully!')
        
        // Recalculate
        const fields = [formData.name, formData.profession, formData.about, formData.bio]
        const filled = fields.filter(f => f && f.trim() !== '').length
        setProfileCompletion(Math.round((filled / fields.length) * 100))
      }
    } catch (e) {
      alert("Failed to save profile")
    }
  }

  const handleCancel = () => {
    setFormData(profileData)
    setIsEditing(false)
  }

  const handleLogout = () => {
    clearAuth()
    router.push('/auth/login')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin w-8 h-8"/></div>

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-foreground">My Profile</h1>
          <div className="flex gap-4">
            <label className="cursor-pointer">
              <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.png,.jpg,.jpeg" />
              <Button as="span" variant="outline" size="md">
                {uploadingDoc ? <Loader className="w-5 h-5 mr-2 animate-spin" /> : <Upload className="w-5 h-5 mr-2" />}
                {uploadingDoc ? "Parsing AI..." : "Upload Biodata"}
              </Button>
            </label>
            <Button
              onClick={handleLogout}
              variant="danger"
              size="md"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Photo Section */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden sticky top-24">
              <div className="relative aspect-square bg-muted">
                <Image
                  src={profileData.photo}
                  alt={profileData.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {profileData.name}, {profileData.age}
                  </h2>
                  <p className="text-muted-foreground">{profileData.location}</p>
                </div>

                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="primary"
                    size="md"
                    className="w-full"
                  >
                    <Edit2 className="w-5 h-5 mr-2" />
                    Edit Profile
                  </Button>
                )}

                <div className="pt-4 border-t border-border space-y-3">
                  <div>
                    <span className="text-muted-foreground text-sm">Status:</span>
                    <p className="text-foreground font-semibold text-green-600">Active</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">Membership:</span>
                    <p className="text-foreground font-semibold text-primary">Premium</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">Verified:</span>
                    <p className="text-foreground font-semibold text-green-600">Yes</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Profile Details Section */}
          <div className="lg:col-span-2">
            {isEditing ? (
              <Card className="p-6 space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Edit Profile</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Profession
                    </label>
                    <input
                      type="text"
                      name="profession"
                      value={formData.profession}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Religion
                    </label>
                    <input
                      type="text"
                      name="religion"
                      value={formData.religion}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Height
                    </label>
                    <input
                      type="text"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    About Me
                  </label>
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Looking For
                  </label>
                  <textarea
                    name="lookingFor"
                    value={formData.lookingFor}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground"
                  />
                </div>

                <div className="flex gap-4 pt-4 border-t border-border">
                  <Button
                    onClick={handleSave}
                    variant="primary"
                    size="md"
                    className="flex-1"
                  >
                    Save Changes
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    size="md"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="space-y-6">
                <Card className="p-6 space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">About</h2>
                  <p className="text-foreground leading-relaxed">{profileData.about}</p>
                </Card>

                <Card className="p-6 space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">Looking For</h2>
                  <p className="text-foreground leading-relaxed">{profileData.lookingFor}</p>
                </Card>

                <Card className="p-6 space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">Basic Information</h2>
                  <div className="grid grid-cols-2 gap-4 space-y-3">
                    <div>
                      <span className="text-muted-foreground text-sm">Age:</span>
                      <p className="text-foreground font-semibold">{profileData.age}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-sm">Location:</span>
                      <p className="text-foreground font-semibold">{profileData.location}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-sm">Profession:</span>
                      <p className="text-foreground font-semibold">{profileData.profession}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-sm">Religion:</span>
                      <p className="text-foreground font-semibold">{profileData.religion}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-sm">Height:</span>
                      <p className="text-foreground font-semibold">{profileData.height}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-sm">Education:</span>
                      <p className="text-foreground font-semibold">{profileData.education}</p>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
