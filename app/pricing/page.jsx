'use client'

import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation'

const plans = [
  {
    id: 'free',
    name: 'Starter',
    price: 'Free',
    duration: 'Forever free',
    description: 'Get started with basic features',
    features: [
      'Browse profiles',
      'Send 5 likes per day',
      'Basic search filters',
      'View limited profiles',
      'Community access',
    ],
    limitations: [
      'No messaging',
      'Limited visibility',
      'No profile highlight',
    ],
    cta: 'Start Free',
    popular: false,
  },
  {
    id: 'silver',
    name: 'Silver',
    price: '₹499',
    duration: 'Per month',
    description: 'Enhanced matching experience',
    features: [
      'All Starter features',
      'Unlimited likes',
      'Messaging enabled',
      'Advanced search filters',
      'Profile highlight',
      'See who liked you',
      'Video calls (limited)',
    ],
    cta: 'Upgrade Now',
    popular: true,
  },
  {
    id: 'gold',
    name: 'Gold',
    price: '₹799',
    duration: 'Per month',
    description: 'Premium matching with priority',
    features: [
      'All Silver features',
      'Priority visibility',
      'Featured profile',
      'Unlimited video calls',
      'Profile verification badge',
      'Analytics dashboard',
      'Premium customer support',
    ],
    cta: 'Upgrade Now',
    popular: false,
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: '₹1,299',
    duration: 'Per month',
    description: 'VIP experience with all features',
    features: [
      'All Gold features',
      'VIP priority matching',
      'Dedicated matchmaker',
      'Premium profile design',
      'Top placement',
      'Exclusive events access',
      '24/7 VIP support',
      'Concierge service',
    ],
    cta: 'Upgrade Now',
    popular: false,
  },
]

export default function PricingPage() {
  const router = useRouter()

  const handleUpgrade = (planId) => {
    if (planId === 'free') {
      router.push('/search')
    } else {
      router.push('/auth/login')
    }
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose the plan that works best for you
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {plans.map(plan => (
            <Card
              key={plan.id}
              className={`overflow-hidden flex flex-col transition transform hover:scale-105 ${
                plan.popular ? 'ring-2 ring-primary shadow-2xl' : ''
              }`}
            >
              {plan.popular && (
                <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-bold">
                  Most Popular
                </div>
              )}

              <div className="p-6 space-y-6 flex-1 flex flex-col">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {plan.description}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="text-4xl font-bold text-primary">
                    {plan.price}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {plan.duration}
                  </p>
                </div>

                <Button
                  onClick={() => handleUpgrade(plan.id)}
                  variant={plan.popular ? 'primary' : 'outline'}
                  size="md"
                  className="w-full"
                >
                  {plan.cta}
                </Button>

                <div className="space-y-3 pt-6 border-t border-border">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-foreground text-sm">{feature}</span>
                    </div>
                  ))}

                  {plan.limitations && (
                    <div className="pt-3 border-t border-border">
                      {plan.limitations.map((limitation, i) => (
                        <div key={i} className="flex items-center gap-3 opacity-50">
                          <div className="w-5 h-5 text-muted-foreground" />
                          <span className="text-foreground text-sm">
                            {limitation}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div className="space-y-8 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="font-bold text-foreground mb-2">
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-muted-foreground">
                Yes, you can cancel your subscription anytime without any penalties. Your premium features will remain active until the end of your billing cycle.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-foreground mb-2">
                Are there any hidden charges?
              </h3>
              <p className="text-muted-foreground">
                No, we believe in complete transparency. The price you see is what you pay. There are no hidden charges or additional fees.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-foreground mb-2">
                Do you offer annual plans?
              </h3>
              <p className="text-muted-foreground">
                Yes, we offer discounted annual plans for all paid memberships. Save up to 20% by choosing an annual subscription.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-foreground mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-muted-foreground">
                We accept all major credit cards, debit cards, UPI, and online banking methods for your convenience.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
