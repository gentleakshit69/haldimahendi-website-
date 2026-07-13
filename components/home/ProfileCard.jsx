'use client'

import Button from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Heart, MessageCircle, Share2, X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

export default function ProfileCard({ profile, onLike, onSuper, onReject, onViewProfile }) {
  const [isLiked, setIsLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLike = async () => {
    setIsLoading(true)
    setIsLiked(true)
    if (onLike) await onLike(profile.id)
    setIsLoading(false)
  }

  const handleSuper = async () => {
    setIsLoading(true)
    if (onSuper) await onSuper(profile.id)
    setIsLoading(false)
  }

  const handleReject = async () => {
    if (onReject) await onReject(profile.id)
  }

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
      <div className="relative h-96 bg-muted overflow-hidden group">
        {profile.photo ? (
          <Image
            src={profile.photo}
            alt={profile.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4" />
              <p className="text-muted-foreground">No photo</p>
            </div>
          </div>
        )}

        {profile.verified && (
          <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold">
            Verified
          </div>
        )}

        {profile.isPremium && (
          <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
            Premium
          </div>
        )}
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-2xl font-bold text-foreground">
            {profile.name}, {profile.age}
          </h3>
          <p className="text-muted-foreground">{profile.location}</p>
          <p className="text-sm text-muted-foreground mt-1">{profile.profession}</p>
        </div>

        <p className="text-foreground line-clamp-3">{profile.bio}</p>

        <div className="flex gap-2 flex-wrap">
          {profile.interests?.slice(0, 3).map((interest, i) => (
            <span
              key={i}
              className="bg-secondary/20 text-secondary px-3 py-1 rounded-full text-sm"
            >
              {interest}
            </span>
          ))}
        </div>

        <div className="flex gap-2 pt-4 border-t border-border">
          <Button
            onClick={handleReject}
            disabled={isLoading}
            variant="ghost"
            size="md"
            className="flex-1"
          >
            <X className="w-5 h-5" />
          </Button>
          <Button
            onClick={handleLike}
            disabled={isLoading}
            variant="secondary"
            size="md"
            className="flex-1"
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </Button>
          <Button
            onClick={handleSuper}
            disabled={isLoading}
            variant="primary"
            size="md"
            className="flex-1"
          >
            <MessageCircle className="w-5 h-5" />
          </Button>
          <Button
            onClick={onViewProfile}
            variant="outline"
            size="md"
            className="flex-1"
          >
            View
          </Button>
        </div>
      </div>
    </Card>
  )
}
