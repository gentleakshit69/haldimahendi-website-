'use client'

import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { Heart, X, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

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
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('All')
  const [matches, setMatches] = useState(mockMatches)

  const handleUnmatch = (id) => {
    setMatches(matches.filter(m => m.id !== id))
  }

  const handleMessage = (id) => {
    router.push('/messages')
  }

  const filteredMatches = matches.filter(match => {
    if (activeTab === 'Mutual Likes') return match.status === 'matched'
    if (activeTab === 'Connections') return match.status === 'connected'
    return true
  })

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

        {/* Matches Grid */}
        {filteredMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.map(match => (
              <Card key={match.id} className="overflow-hidden hover:shadow-lg transition">
                {/* Image Section */}
                <div className="relative aspect-square bg-muted overflow-hidden group">
                  <Image
                    src={match.photo}
                    alt={match.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition" />
                  
                  {/* Match Score Badge */}
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold">
                    {match.matchScore}% Match
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-4 space-y-4">
                  <div>
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
                  <div className="flex gap-2 pt-4 border-t border-border">
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
              Keep liking profiles to find your perfect match!
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
      </div>
    </div>
  )
}
