'use client'

import Button from '@/components/ui/Button'
import { ArrowRight, Heart, Shield, Users, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-white to-purple-50 px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-balance text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
                  Find Your Perfect Match
                </h1>
                <p className="text-xl text-muted-foreground">
                  India&apos;s most trusted matrimonial platform. Connect with meaningful relationships built on trust, tradition, and compatibility.
                </p>
              </div>
              
              <div className="flex gap-4 flex-wrap">
                <Link href="/search">
                  <Button size="lg" className="rounded-full px-8">
                    Browse Profiles <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="rounded-full px-8">
                    View Plans
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div>
                  <div className="text-3xl font-bold text-primary">50K+</div>
                  <p className="text-sm text-muted-foreground">Active Members</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">10K+</div>
                  <p className="text-sm text-muted-foreground">Success Stories</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">98%</div>
                  <p className="text-sm text-muted-foreground">Satisfaction</p>
                </div>
              </div>
            </div>

            <div className="relative h-96 sm:h-full min-h-96">
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-200/30 to-purple-200/30 rounded-3xl" />
              <div className="relative h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-pink-300 to-purple-300 rounded-full flex items-center justify-center">
                    <Heart className="w-16 h-16 text-white" />
                  </div>
                  <p className="text-lg font-semibold text-foreground">Connecting Hearts, Building Futures</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-card border-b border-border">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose Matrimonial?</h2>
            <p className="text-xl text-muted-foreground">Experience the difference with our premium features</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: 'Verified Profiles',
                description: 'All members are verified for authenticity and safety'
              },
              {
                icon: Users,
                title: 'Smart Matching',
                description: 'Advanced algorithm finds compatible matches'
              },
              {
                icon: Zap,
                title: 'Quick Connect',
                description: 'Seamless messaging and video calls'
              },
              {
                icon: Heart,
                title: '100% Confidential',
                description: 'Your privacy is our top priority'
              }
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-2xl bg-background border border-border hover:shadow-lg transition-shadow">
                <feature.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="mx-auto max-w-2xl text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-foreground">Ready to Find Your Match?</h2>
            <p className="text-lg text-muted-foreground">Join thousands of happy couples who found love on Matrimonial</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search">
              <Button size="lg" className="rounded-full px-8">
                Start Browsing
              </Button>
            </Link>
            <Link href="/success-stories">
              <Button size="lg" variant="outline" className="rounded-full px-8">
                Read Success Stories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-foreground mb-16">Our Impact</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { stat: '548K+', label: 'Total Members' },
              { stat: '51K+', label: 'Successful Matches' },
              { stat: '25 Years', label: 'In Service' },
              { stat: '24/7', label: 'Support Available' }
            ].map((item, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-card border border-border">
                <div className="text-4xl font-bold text-primary mb-2">{item.stat}</div>
                <p className="text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
