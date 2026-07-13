'use client'

import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { Heart, Users, Zap, Award } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function AboutPage() {
  const router = useRouter()

  const values = [
    {
      icon: Heart,
      title: 'Love & Trust',
      description: 'We believe in genuine connections built on trust and mutual respect',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'A safe, welcoming community where everyone can find their special someone',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Using advanced AI to provide better matches and user experience',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Committed to the highest standards of service and privacy',
    },
  ]

  const stats = [
    { number: '500K+', label: 'Active Members' },
    { number: '50K+', label: 'Successful Matches' },
    { number: '10K+', label: 'Happy Couples' },
    { number: '15+', label: 'Years of Service' },
  ]

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Find Your Perfect Match
          </h1>
          <p className="text-xl text-muted-foreground">
            Building meaningful relationships through trust, technology, and tradition
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16 space-y-16">
        {/* About Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-foreground">About Matrimonial</h2>
            <p className="text-foreground leading-relaxed">
              Matrimonial is India&apos;s leading matrimonial platform, dedicated to helping people find their life partner. With over 15 years of experience and 500,000+ active members, we&apos;ve successfully created over 50,000 matches.
            </p>
            <p className="text-foreground leading-relaxed">
              Our mission is to make matchmaking more accessible, transparent, and successful using advanced technology and AI-powered recommendations.
            </p>
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Why Choose Us?</h3>
              <ul className="space-y-2 text-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  Verified profiles for safety and authenticity
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  Advanced matching algorithm
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  24/7 customer support
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  Premium privacy and security
                </li>
              </ul>
            </div>
          </div>
          <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&h=500&fit=crop"
              alt="Couple"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Card key={i} className="p-6 text-center space-y-2">
              <div className="text-3xl font-bold text-primary">{stat.number}</div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Values */}
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-foreground text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => {
              const Icon = value.icon
              return (
                <Card key={i} className="p-6 text-center space-y-4">
                  <Icon className="w-12 h-12 text-primary mx-auto" />
                  <h3 className="font-bold text-foreground">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </Card>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary/10 rounded-lg p-12 text-center space-y-4">
          <h2 className="text-3xl font-bold text-foreground">
            Ready to Find Your Match?
          </h2>
          <p className="text-foreground text-lg">
            Join thousands of successful couples who found love on Matrimonial
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => router.push('/search')}
              variant="primary"
              size="md"
            >
              Start Browsing
            </Button>
            <Button
              onClick={() => router.push('/pricing')}
              variant="outline"
              size="md"
            >
              View Plans
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
