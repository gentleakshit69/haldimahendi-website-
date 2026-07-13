'use client'

import Button from '@/components/ui/Button'
import SearchFilters from '@/components/search/SearchFilters'
import ProfileCard from '@/components/home/ProfileCard'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

// Mock profiles data
const mockProfiles = [
  {
    id: 1,
    name: 'Priya',
    age: 26,
    location: 'Mumbai',
    profession: 'Doctor',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    bio: 'Passionate doctor, love traveling and reading books',
    verified: true,
    isPremium: true,
    interests: ['Travel', 'Reading', 'Cooking'],
  },
  {
    id: 2,
    name: 'Anjali',
    age: 25,
    location: 'Delhi',
    profession: 'Software Engineer',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    bio: 'Tech enthusiast, love hiking and painting',
    verified: true,
    isPremium: false,
    interests: ['Technology', 'Hiking', 'Art'],
  },
  {
    id: 3,
    name: 'Meera',
    age: 28,
    location: 'Bangalore',
    profession: 'Finance Manager',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    bio: 'Career-focused, love good conversations and yoga',
    verified: true,
    isPremium: true,
    interests: ['Yoga', 'Finance', 'Music'],
  },
  {
    id: 4,
    name: 'Divya',
    age: 27,
    location: 'Pune',
    profession: 'Marketing Director',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    bio: 'Creative mind, love events and social work',
    verified: false,
    isPremium: true,
    interests: ['Marketing', 'Events', 'Social Causes'],
  },
  {
    id: 5,
    name: 'Neha',
    age: 24,
    location: 'Hyderabad',
    profession: 'Architect',
    photo: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop',
    bio: 'Design lover, coffee addict, photography enthusiast',
    verified: true,
    isPremium: false,
    interests: ['Design', 'Photography', 'Coffee'],
  },
  {
    id: 6,
    name: 'Isha',
    age: 26,
    location: 'Chennai',
    profession: 'Teacher',
    photo: 'https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=400&h=400&fit=crop',
    bio: 'Educator, passionate about reading and travel',
    verified: true,
    isPremium: false,
    interests: ['Education', 'Travel', 'Books'],
  },
]

export default function SearchPage() {
  const router = useRouter()
  const [profiles, setProfiles] = useState(mockProfiles)
  const [filteredProfiles, setFilteredProfiles] = useState(mockProfiles)
  const [showFilters, setShowFilters] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleApplyFilters = (filters) => {
    let filtered = profiles.filter(profile => {
      if (filters.ageMin && profile.age < filters.ageMin) return false
      if (filters.ageMax && profile.age > filters.ageMax) return false
      if (filters.location && !profile.location.toLowerCase().includes(filters.location.toLowerCase())) return false
      return true
    })
    setFilteredProfiles(filtered)
    setCurrentIndex(0)
  }

  const handleLike = async (profileId) => {
    console.log('Liked profile:', profileId)
    moveToNext()
  }

  const handleReject = async (profileId) => {
    console.log('Rejected profile:', profileId)
    moveToNext()
  }

  const handleSuper = async (profileId) => {
    console.log('Super liked profile:', profileId)
    router.push(`/profile/${profileId}`)
  }

  const moveToNext = () => {
    if (currentIndex < filteredProfiles.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const currentProfile = filteredProfiles[currentIndex]

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-foreground">Find Your Match</h1>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant={showFilters ? 'primary' : 'outline'}
            size="md"
          >
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {showFilters && (
            <div className="lg:col-span-1">
              <SearchFilters
                onApply={handleApplyFilters}
                onReset={() => setFilteredProfiles(profiles)}
              />
            </div>
          )}

          <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
            {filteredProfiles.length > 0 && currentIndex < filteredProfiles.length ? (
              <div className="space-y-6">
                <ProfileCard
                  profile={currentProfile}
                  onLike={handleLike}
                  onSuper={handleSuper}
                  onReject={handleReject}
                  onViewProfile={() => router.push(`/profile/${currentProfile.id}`)}
                />
                <div className="text-center text-muted-foreground">
                  Showing {currentIndex + 1} of {filteredProfiles.length}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  No profiles found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or check back later
                </p>
                <Button
                  onClick={() => setShowFilters(true)}
                  variant="primary"
                  size="md"
                >
                  Adjust Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
