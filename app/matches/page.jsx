'use client'

import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { Heart, X, MessageCircle, Lock, Loader } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'

const mockMatches = [
  {
    id: 1,
    name: 'Priya',
    age: 26,
    location: 'Mumbai',
    profession: 'Doctor',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
    matchScore: 95,
    matchedDate: '2 days ago',
    status: 'matched',
  },
  {
    id: 2,
    name: 'Anjali',
    age: 25,
    location: 'Delhi',
    profession: 'Software Engineer',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    matchScore: 88,
    matchedDate: '5 days ago',
    status: 'matched',
  },
  {
    id: 3,
    name: 'Meera',
    age: 28,
    location: 'Bangalore',
    profession: 'Finance Manager',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
    matchScore: 92,
    matchedDate: '1 week ago',
    status: 'connected',
  },
]

const matchTabs = ['All', 'Mutual Likes', 'Connections', 'Accepted']

export default function MatchesPage() {
  const { accessToken, profileCompletion } = useAuthStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!accessToken) {
      router.push('/auth/login')
      return
    }

    if (profileCompletion < 90) {
      setLoading(false)
      return
    }

    const fetchMatches = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/v1/matches/recommended/', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        })
        if (res.ok) {
          const data = await res.json()
          const formatted = (data.results || []).map(m => ({
            id: m.id,
            name: m.full_name || 'Unknown',
            age: 25, // Mocking age if not provided
            location: m.location_city || 'City',
            profession: m.occupation || 'N/A',
            photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop', // Mock photo
            matchScore: m.compatibility_score || 50,
            matchedDate: 'Just now',
            status: 'matched',
            reason: m.match_reason || ''
          }))
          setMatches(formatted)
        }
      } catch (e) {
        console.error("Failed to fetch matches", e)
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [accessToken, profileCompletion, router])

  const filteredMatches = matches.filter(match => {
    if (activeTab === 'Mutual Likes') return match.status === 'matched'
    if (activeTab === 'Connections') return match.status === 'connected'
    return true
  })

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin w-8 h-8"/></div>

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">My Matches</h1>
          <p className="text-muted-foreground">
            {filteredMatches.length} {filteredMatches.length === 1 ? 'match' : 'matches'} found
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {matchTabs.map(tab => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab)}
              variant={activeTab === tab ? 'primary' : 'outline'}
              size="md"
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* Profile Completion Gate */}
        {profileCompletion < 90 ? (
          <Card className="p-12 text-center max-w-2xl mx-auto mt-12 bg-card/50 backdrop-blur-md border-border relative overflow-hidden">
            <div className="absolute inset-0 bg-background/40 backdrop-blur-sm z-0"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-6">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Unlock Your Matches
              </h3>
              <p className="text-muted-foreground mb-8 text-lg">
                Your profile is only <span className="font-bold text-primary">{profileCompletion}%</span> complete. 
                Our AI Matchmaker requires a 90% completion rate to find your perfect soulmate.
              </p>
              <Button
                onClick={() => router.push('/my-profile')}
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
              >
                Complete Profile Now
              </Button>
            </div>
          </Card>
        ) : (
          <>
            {/* Matches Grid */}
            {filteredMatches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMatches.map(match => (
                  <Card key={match.id} className="overflow-hidden hover:shadow-lg transition flex flex-col">
                    {/* Image Section */}
                    <div className="relative aspect-square bg-muted overflow-hidden group">
                      <Image
                        src={match.photo}
                        alt={match.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
                      
                      {/* Match Score Badge */}
                      <div className="absolute top-4 right-4 bg-background/80 backdrop-blur border border-border px-3 py-1.5 rounded-full flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${match.matchScore >= 80 ? 'bg-green-500' : match.matchScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                        <span className="text-sm font-bold text-foreground">{match.matchScore}% Match</span>
                      </div>

                      {/* Hover AI Reason */}
                      <div className="absolute bottom-4 left-4 right-4 transform translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition duration-300">
                        <p className="text-xs text-white/90 font-medium line-clamp-3">
                          <span className="text-primary font-bold mr-1">AI Says:</span>
                          {match.reason}
                        </p>
                      </div>
                    </div>

                    {/* Info Section */}
                    <div className="p-4 space-y-4 flex-1 flex flex-col">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground">
                          {match.name}, {match.age}
                        </h3>
                        <p className="text-muted-foreground">{match.location}</p>
                        <p className="text-sm text-muted-foreground">{match.profession}</p>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Matched {match.matchedDate}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-4 border-t border-border mt-auto">
                        <Button
                          onClick={() => handleUnmatch(match.id)}
                          variant="ghost"
                          size="md"
                          className="flex-1"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                        <Button
                          onClick={() => handleMessage(match.id)}
                          variant="primary"
                          size="md"
                          className="flex-1"
                        >
                          <MessageCircle className="w-5 h-5 mr-2" />
                          Message
                        </Button>
                        <Button
                          onClick={() => router.push(`/profile/${match.id}`)}
                          variant="outline"
                          size="md"
                          className="flex-1"
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  No matches yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Keep updating your profile to let AI find your perfect match!
                </p>
                <Button
                  onClick={() => router.push('/search')}
                  variant="primary"
                  size="md"
                >
                  Browse Profiles
                </Button>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}
