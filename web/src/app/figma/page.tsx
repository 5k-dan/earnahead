"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Shield, MapPin, TrendingUp, Heart, CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

export default function FigmaLanding() {
  const [zipCode, setZipCode] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipCode.length === 5) router.push(`/figma/discover/${zipCode}`);
  };

  return (
    <div style={{ background: '#fff' }}>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-5xl font-bold leading-tight mb-6" style={{ color: '#0A1628' }}>
                Earn money while helping your community
              </h1>
              <p className="text-xl leading-relaxed mb-8" style={{ color: '#64748B' }}>
                Discover verified opportunities to donate blood, plasma, or participate in medical research. Make a meaningful impact and receive fair compensation.
              </p>
              <form onSubmit={handleSearch} className="mb-8">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#64748B' }} />
                    <input
                      type="text"
                      placeholder="Enter your ZIP code"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                      className="w-full pl-12 pr-4 py-4 rounded-md text-lg focus:outline-none focus:ring-2"
                      style={{ border: '1px solid #E2E8F0', background: '#F8FAFC', focusRingColor: '#2E5C8A' }}
                      maxLength={5}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={zipCode.length !== 5}
                    className="px-8 py-4 text-white rounded-md font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: '#2E5C8A' }}
                  >
                    <Search className="w-5 h-5" /> Find Opportunities
                  </button>
                </div>
              </form>
              <div className="flex items-center gap-8 text-sm" style={{ color: '#64748B' }}>
                <div className="flex items-center gap-2"><Shield className="w-4 h-4" style={{ color: '#6B8E7F' }} /><span>All providers verified</span></div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" style={{ color: '#6B8E7F' }} /><span>Safe & legitimate</span></div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative">
              <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1631556760585-2e846196d5a9?w=800&q=80"
                  alt="Healthcare professional" className="w-full h-full object-cover"
                />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-xl"
                style={{ border: '1px solid #E2E8F0' }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#6B8E7F1A' }}>
                    <TrendingUp className="w-6 h-6" style={{ color: '#6B8E7F' }} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ color: '#0A1628' }}>$280</p>
                    <p className="text-sm" style={{ color: '#64748B' }}>Avg weekly earnings</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16" style={{ background: '#F5F7F9' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-4 gap-8">
            {[
              { value: '12,847', label: 'Active Contributors' },
              { value: '48,392', label: 'Patients Helped' },
              { value: '$3.2M', label: 'Total Earned' },
              { value: '127', label: 'Verified Providers' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl font-bold mb-2" style={{ color: '#0A1628' }}>{stat.value}</p>
                <p className="text-sm" style={{ color: '#64748B' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#0A1628' }}>How it works</h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: '#64748B' }}>A simple, transparent process to start contributing to your community's health</p>
          </div>
          <div className="grid grid-cols-3 gap-12">
            {[
              { step: '01', title: 'Find opportunities', description: 'Enter your ZIP code to discover verified donation centers and research studies near you.', icon: Search },
              { step: '02', title: 'Review & schedule', description: 'Choose opportunities that match your schedule and eligibility. View compensation upfront.', icon: CheckCircle2 },
              { step: '03', title: 'Contribute & earn', description: 'Complete your donation or study. Receive compensation and track your community impact.', icon: Heart },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="mb-6"><span className="text-6xl font-bold" style={{ color: '#E2E8F0' }}>{item.step}</span></div>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: '#2E5C8A1A' }}>
                  <item.icon className="w-6 h-6" style={{ color: '#2E5C8A' }} />
                </div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: '#0A1628' }}>{item.title}</h3>
                <p style={{ color: '#64748B' }}>{item.description}</p>
                {i < 2 && <ArrowRight className="absolute top-20 -right-6 w-5 h-5" style={{ color: '#64748B' }} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-24" style={{ background: '#F5F7F9' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#0A1628' }}>Your contribution matters</h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: '#64748B' }}>Every donation and participation makes a real difference in your community</p>
          </div>
          <div className="grid grid-cols-3 gap-8">
            {[
              { title: 'Blood & Plasma', impact: 'One donation can save up to 3 lives', src: 'https://images.unsplash.com/photo-1639772823849-6efbd173043c?w=600&q=80' },
              { title: 'Medical Research', impact: 'Advance treatments for millions', src: 'https://images.unsplash.com/photo-1631556760585-2e846196d5a9?w=600&q=80' },
              { title: 'Community Health', impact: 'Build stronger, healthier communities', src: 'https://images.unsplash.com/photo-1621354599227-11f1a2edbe62?w=600&q=80' },
            ].map((item, i) => (
              <div key={i} className="group">
                <div className="aspect-[3/4] rounded-lg overflow-hidden mb-4">
                  <ImageWithFallback src={item.src} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#0A1628' }}>{item.title}</h3>
                <p style={{ color: '#64748B' }}>{item.impact}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24" style={{ background: '#0A1628' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to make a difference?</h2>
          <p className="text-xl mb-8" style={{ color: 'rgba(255,255,255,0.8)' }}>Join thousands of contributors earning money while helping their communities</p>
          <form onSubmit={handleSearch} className="max-w-xl mx-auto">
            <div className="flex gap-3">
              <input
                type="text" placeholder="Enter your ZIP code" value={zipCode}
                onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                className="flex-1 px-6 py-4 rounded-md focus:outline-none text-lg" maxLength={5}
              />
              <button
                type="submit" disabled={zipCode.length !== 5}
                className="px-8 py-4 text-white rounded-md font-medium disabled:opacity-50"
                style={{ background: '#6B8E7F' }}
              >
                Get Started
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
