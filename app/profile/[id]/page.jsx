'use client'

import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { Heart, MessageCircle, Share2, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'
import { useState } from 'react'

const mockProfiles = {
  1: {
    id: 1,
    name: 'Priya',
    age: 26,
    location: 'Mumbai',
    profession: 'Doctor',
    religion: 'Hindu',
    caste: 'Brahmin',
    height: '5\'6"',
    education: 'MBBS',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=600&fit=crop',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=600&fit=crop',
    ],
    bio: 'Passionate doctor, love traveling and reading books. Looking for someone who appreciates good conversations and adventure.',
    verified: true,
    isPremium: true,
    interests: ['Travel', 'Reading', 'Cooking', 'Yoga', 'Photography'],
    about: 'I am a compassionate doctor working in a leading hospital. I believe in living life to the fullest with family values at the core.',
    lookingFor: 'Seeking a mature, caring partner who understands the importance of family and can be my best friend.',
    lastActive: '2 hours ago',
  },
}

export default function ProfilePage() {
  const router = useRouter()
  const params = useParams()
  const profileId = parseInt(params.id)
  
  const profile = mockProfiles[profileId] || mockProfiles[1]
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

  const handleMessage = () => {
    router.push('/messages')
  }

  const nextPhoto = () => {
    if (currentPhotoIndex < profile.photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1)
    }
  }

  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1)
    }
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          size="md"
          className="mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Photo Gallery */}
            <Card className="overflow-hidden">
              <div className="relative aspect-square bg-muted">
                <Image
                  src={profile.photos[currentPhotoIndex]}
                  alt={profile.name}
                  fill
                  className="object-cover"
                />
                
                {/* Photo Counter */}
                <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentPhotoIndex + 1} / {profile.photos.length}
                </div>

                {/* Verified Badge */}
                {profile.verified && (
                  <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold">
                    Verified
                  </div>
                )}

                {/* Navigation Arrows */}
                {profile.photos.length > 1 && (
                  <>
                    {currentPhotoIndex > 0 && (
                      <button
                        onClick={prevPhoto}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition"
                      >
                        ←
                      </button>
                    )}
                    {currentPhotoIndex < profile.photos.length - 1 && (
                      <button
                        onClick={nextPhoto}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition"
                      >
                        →
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Thumbnail Navigation */}
              <div className="p-4 flex gap-2 overflow-x-auto">
                {profile.photos.map((photo, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPhotoIndex(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition ${
                      currentPhotoIndex === i ? 'border-primary' : 'border-border'
                    }`}
                  >
                    <Image
                      src={photo}
                      alt={`${profile.name} ${i}`}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            </Card>

            {/* About Section */}
            <Card className="p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">About</h2>
              <p className="text-foreground leading-relaxed">{profile.about}</p>
              
              <div className="pt-4 space-y-3">
                <h3 className="font-semibold text-foreground">Looking For</h3>
                <p className="text-foreground leading-relaxed">{profile.lookingFor}</p>
              </div>
            </Card>

            {/* Interests */}
            <Card className="p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, i) => (
                  <span
                    key={i}
                    className="bg-secondary/20 text-secondary px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Info Card */}
            <Card className="p-6 space-y-4 sticky top-24">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {profile.name}, {profile.age}
                </h1>
                <p className="text-muted-foreground text-lg">{profile.location}</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Profession:</span>
                  <span className="text-foreground font-semibold">{profile.profession}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Religion:</span>
                  <span className="text-foreground font-semibold">{profile.religion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Height:</span>
                  <span className="text-foreground font-semibold">{profile.height}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Education:</span>
                  <span className="text-foreground font-semibold">{profile.education}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Active:</span>
                  <span className="text-foreground font-semibold">{profile.lastActive}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-border">
                <Button
                  onClick={handleLike}
                  variant={isLiked ? 'primary' : 'outline'}
                  size="md"
                  className="w-full"
                >
                  <Heart className={`w-5 h-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                  {isLiked ? 'Liked' : 'Like'}
                </Button>
                <Button
                  onClick={handleMessage}
                  variant="primary"
                  size="md"
                  className="w-full"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Message
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  className="w-full"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </Button>
              </div>

              {profile.isPremium && (
                <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-center text-sm font-semibold">
                  Premium Member
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
