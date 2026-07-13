'use client'

import Card from '@/components/ui/Card'
import { Star } from 'lucide-react'
import Image from 'next/image'

const stories = [
  {
    id: 1,
    name: 'Rajesh & Priya',
    year: '2023',
    photo: 'https://images.unsplash.com/photo-1491438639033-606293d1f5d9?w=400&h=300&fit=crop',
    story: 'Met on Matrimonial 2 years ago. Now happily married with our beautiful daughter. Thank you for bringing us together!',
    location: 'Mumbai',
  },
  {
    id: 2,
    name: 'Arjun & Anjali',
    year: '2022',
    photo: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
    story: 'Connected through the app and fell in love instantly. Had a beautiful wedding last year. Best decision ever!',
    location: 'Delhi',
  },
  {
    id: 3,
    name: 'Vikram & Meera',
    year: '2023',
    photo: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop',
    story: 'Found our soulmates and got engaged within 6 months. The matching algorithm is incredibly accurate!',
    location: 'Bangalore',
  },
  {
    id: 4,
    name: 'Arun & Divya',
    year: '2022',
    photo: 'https://images.unsplash.com/photo-1520763185298-1b434c919cb0?w=400&h=300&fit=crop',
    story: 'After 3 months of chatting and meeting, we knew we were meant to be. Now celebrating 2 years together!',
    location: 'Pune',
  },
  {
    id: 5,
    name: 'Saurabh & Neha',
    year: '2023',
    photo: 'https://images.unsplash.com/photo-1465146072230-91cabc968266?w=400&h=300&fit=crop',
    story: 'The premium features helped us connect with the right person. Got married this year! So grateful!',
    location: 'Hyderabad',
  },
  {
    id: 6,
    name: 'Rohan & Isha',
    year: '2022',
    photo: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=400&h=300&fit=crop',
    story: 'Matched with Isha and knew within the first conversation. Now living our dream life together!',
    location: 'Chennai',
  },
]

export default function SuccessStoriesPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Love Stories
          </h1>
          <p className="text-xl text-muted-foreground">
            Real couples who found their happiness on Matrimonial
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map(story => (
            <Card key={story.id} className="overflow-hidden hover:shadow-lg transition">
              <div className="relative aspect-video bg-muted overflow-hidden">
                <Image
                  src={story.photo}
                  alt={story.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform"
                />
              </div>

              <div className="p-6 space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-primary text-primary"
                    />
                  ))}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {story.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{story.location}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Married in {story.year}
                  </p>
                </div>

                <p className="text-foreground leading-relaxed">
                  &quot;{story.story}&quot;
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-primary/10 rounded-lg p-12 text-center space-y-4">
          <h2 className="text-3xl font-bold text-foreground">
            Your Story Could Be Next
          </h2>
          <p className="text-foreground">
            Join our community and find your perfect match today
          </p>
        </div>
      </div>
    </div>
  )
}
