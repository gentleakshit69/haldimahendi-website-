'use client'

import Button from '@/components/ui/Button'
import { useState } from 'react'

export default function SearchFilters({ onApply, onReset }) {
  const [filters, setFilters] = useState({
    ageMin: 18,
    ageMax: 65,
    gender: '',
    location: '',
    religion: '',
    caste: '',
    profession: '',
    height: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const handleApply = () => {
    if (onApply) onApply(filters)
  }

  const handleReset = () => {
    const resetFilters = {
      ageMin: 18,
      ageMax: 65,
      gender: '',
      location: '',
      religion: '',
      caste: '',
      profession: '',
      height: '',
    }
    setFilters(resetFilters)
    if (onReset) onReset(resetFilters)
  }

  return (
    <div className="bg-card rounded-lg p-6 border border-border shadow-md">
      <h3 className="text-lg font-bold mb-4 text-foreground">Search Filters</h3>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Min Age
            </label>
            <input
              type="number"
              name="ageMin"
              value={filters.ageMin}
              onChange={handleChange}
              min="18"
              max="99"
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Max Age
            </label>
            <input
              type="number"
              name="ageMax"
              value={filters.ageMax}
              onChange={handleChange}
              min="18"
              max="99"
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Gender
          </label>
          <select
            name="gender"
            value={filters.gender}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground"
          >
            <option value="">All</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleChange}
            placeholder="City or region"
            className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Religion
          </label>
          <select
            name="religion"
            value={filters.religion}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground"
          >
            <option value="">Any</option>
            <option value="hindu">Hindu</option>
            <option value="muslim">Muslim</option>
            <option value="christian">Christian</option>
            <option value="sikh">Sikh</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Profession
          </label>
          <input
            type="text"
            name="profession"
            value={filters.profession}
            onChange={handleChange}
            placeholder="e.g. Engineer, Doctor"
            className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground"
          />
        </div>

        <div className="pt-4 flex gap-2">
          <Button
            onClick={handleApply}
            variant="primary"
            size="md"
            className="flex-1"
          >
            Apply Filters
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            size="md"
            className="flex-1"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  )
}
