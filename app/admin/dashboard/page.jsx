'use client'

import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { Users, Heart, TrendingUp, AlertCircle, MoreVertical } from 'lucide-react'
import { useState } from 'react'

const stats = [
  {
    label: 'Total Users',
    value: '548,234',
    change: '+12.5%',
    icon: Users,
    color: 'primary',
  },
  {
    label: 'Successful Matches',
    value: '51,847',
    change: '+8.2%',
    icon: Heart,
    color: 'secondary',
  },
  {
    label: 'Active Premium',
    value: '124,856',
    change: '+5.3%',
    icon: TrendingUp,
    color: 'accent',
  },
  {
    label: 'Support Tickets',
    value: '127',
    change: '-2.1%',
    icon: AlertCircle,
    color: 'destructive',
  },
]

const recentUsers = [
  { id: 1, name: 'Priya Sharma', email: 'priya@example.com', status: 'Active', joinDate: '2024-01-15' },
  { id: 2, name: 'Rajesh Kumar', email: 'rajesh@example.com', status: 'Active', joinDate: '2024-01-14' },
  { id: 3, name: 'Anjali Patel', email: 'anjali@example.com', status: 'Pending', joinDate: '2024-01-13' },
  { id: 4, name: 'Vikram Singh', email: 'vikram@example.com', status: 'Active', joinDate: '2024-01-12' },
  { id: 5, name: 'Meera Verma', email: 'meera@example.com', status: 'Inactive', joinDate: '2024-01-11' },
]

const recentMatches = [
  { id: 1, couple: 'Arjun & Divya', date: '2024-01-15', status: 'Connected' },
  { id: 2, couple: 'Rohan & Isha', date: '2024-01-14', status: 'Engaged' },
  { id: 3, couple: 'Arun & Neha', date: '2024-01-13', status: 'Connected' },
  { id: 4, couple: 'Saurabh & Priya', date: '2024-01-12', status: 'Married' },
]

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview')
kya 
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s your platform overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <Card key={i} className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-green-600 text-sm mt-2">{stat.change} from last month</p>
                  </div>
                  <Icon className={`w-8 h-8 text-${stat.color}`} />
                </div>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Recent Users</h2>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2 text-muted-foreground font-semibold">
                      Name
                    </th>
                    <th className="text-left py-2 px-2 text-muted-foreground font-semibold">
                      Email
                    </th>
                    <th className="text-left py-2 px-2 text-muted-foreground font-semibold">
                      Status
                    </th>
                    <th className="text-left py-2 px-2 text-muted-foreground font-semibold">
                      Join Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map(user => (
                    <tr key={user.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-2 text-foreground">{user.name}</td>
                      <td className="py-3 px-2 text-foreground text-xs">{user.email}</td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.status === 'Active'
                              ? 'bg-green-100 text-green-800'
                              : user.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-foreground text-xs">{user.joinDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Recent Matches */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Recent Matches</h2>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {recentMatches.map(match => (
                <div
                  key={match.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition"
                >
                  <div>
                    <p className="font-semibold text-foreground">{match.couple}</p>
                    <p className="text-muted-foreground text-sm">{match.date}</p>
                  </div>
                  <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                    {match.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <Card className="p-6">
            <h3 className="text-xl font-bold text-foreground mb-4">User Management</h3>
            <div className="space-y-2">
              <Button variant="outline" size="md" className="w-full justify-start">
                View All Users
              </Button>
              <Button variant="outline" size="md" className="w-full justify-start">
                Verify Pending Users
              </Button>
              <Button variant="outline" size="md" className="w-full justify-start">
                Handle Reports
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold text-foreground mb-4">System Management</h3>
            <div className="space-y-2">
              <Button variant="outline" size="md" className="w-full justify-start">
                View Analytics
              </Button>
              <Button variant="outline" size="md" className="w-full justify-start">
                Manage Membership Plans
              </Button>
              <Button variant="outline" size="md" className="w-full justify-start">
                View System Logs
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
