"use client";

import { motion } from "motion/react";
import { Quote, Heart, TrendingUp } from "lucide-react";
import ImageWithFallback from "@/components/figma/ImageWithFallback";
import Link from "next/link";

const stories = [
  {
    id: 1,
    name: "Sarah Martinez",
    age: 28,
    occupation: "Graduate Student",
    city: "San Francisco, CA",
    contributions: 42,
    earnings: 4200,
    image: "https://images.unsplash.com/photo-1770235622504-3851a96ac6ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    story: "As a graduate student, the extra income from plasma donation has been incredibly helpful. But what really keeps me coming back is knowing that my contribution is helping burn victims and people with immune disorders. It's a win-win that fits perfectly into my schedule.",
    impact: "Helped 126 patients through regular plasma donation",
  },
  {
    id: 2,
    name: "Michael Roberts",
    age: 34,
    occupation: "Fitness Trainer",
    city: "Oakland, CA",
    contributions: 38,
    earnings: 3200,
    image: "https://images.unsplash.com/photo-1770894807442-108cc33c0a7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    story: "I've always wanted to give back to my community. When I discovered I could donate blood regularly and help save lives while earning compensation, it felt like the perfect opportunity. The platform makes it so easy to find verified donation centers near me.",
    impact: "Regular blood donor saving lives every 8 weeks",
  },
  {
    id: 3,
    name: "Jennifer Lee",
    age: 42,
    occupation: "Healthcare Administrator",
    city: "San Jose, CA",
    contributions: 15,
    earnings: 5800,
    image: "https://images.unsplash.com/photo-1659354206036-3d2699c31e0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    story: "Working in healthcare, I understand the critical need for research participants. I've participated in several studies through this platform, contributing to medical advances while earning meaningful compensation. The verification process gives me complete confidence in every opportunity.",
    impact: "Participated in 15 research studies advancing medical science",
  },
];

const testimonials = [
  {
    name: "David Kim",
    role: "Software Engineer",
    quote: "The transparency and verification process is outstanding. I always know exactly what to expect, and the impact tracking motivates me to continue contributing.",
  },
  {
    name: "Amanda Chen",
    role: "Teacher",
    quote: "This platform connected me with opportunities I never knew existed. It's empowering to earn extra income while making a real difference in people's lives.",
  },
  {
    name: "Robert Williams",
    role: "Freelance Designer",
    quote: "As someone with a flexible schedule, being able to find and book donation appointments so easily has been game-changing. The community aspect is incredibly motivating.",
  },
];

const whyUs = [
  { title: "Verified & Safe", description: "Every provider undergoes strict verification. All opportunities are with licensed medical facilities." },
  { title: "Transparent Process", description: "Clear compensation, time requirements, and eligibility criteria upfront. No hidden surprises." },
  { title: "Real Impact", description: "Track your contributions and see the actual difference you're making in your community." },
  { title: "Flexible Scheduling", description: "Find opportunities that work with your schedule. Book appointments with ease." },
  { title: "Fair Compensation", description: "Earn competitive rates for your time and contribution. Payment is always guaranteed." },
  { title: "Community Support", description: "Join a network of contributors. Share experiences and support each other's journey." },
];

export default function StoriesPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Contributor Stories</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real people making a real impact in their communities while earning fair compensation
          </p>
        </motion.div>

        {/* Featured Stories */}
        <div className="space-y-24 mb-24">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-16 items-center"
            >
              <div className={index % 2 === 1 ? "order-2" : ""}>
                <div className="aspect-[3/4] rounded-lg overflow-hidden shadow-xl">
                  <ImageWithFallback src={story.image} alt={story.name} className="w-full h-full object-cover" />
                </div>
              </div>

              <div className={index % 2 === 1 ? "order-1" : ""}>
                <div className="mb-6">
                  <h2 className="text-3xl font-bold mb-2">{story.name}</h2>
                  <p className="text-lg text-muted-foreground mb-1">{story.occupation}</p>
                  <p className="text-sm text-muted-foreground">{story.city}</p>
                </div>

                <div className="flex items-center gap-8 mb-8">
                  <div>
                    <p className="text-2xl font-bold text-secondary">{story.contributions}</p>
                    <p className="text-sm text-muted-foreground">Contributions</p>
                  </div>
                  <div className="w-px h-12 bg-border" />
                  <div>
                    <p className="text-2xl font-bold text-accent">${story.earnings.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Earned</p>
                  </div>
                </div>

                <div className="relative mb-6">
                  <Quote className="w-8 h-8 text-muted-foreground/30 absolute -top-2 -left-2" />
                  <p className="text-lg text-foreground leading-relaxed pl-8">{story.story}</p>
                </div>

                <div className="flex items-start gap-3 p-4 bg-accent/5 rounded-lg border border-accent/20">
                  <Heart className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-accent mb-1">Community Impact</p>
                    <p className="text-sm text-muted-foreground">{story.impact}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-3xl font-bold text-center mb-12">What Contributors Say</h2>

          <div className="grid grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-muted p-8 rounded-lg"
              >
                <Quote className="w-8 h-8 text-secondary/30 mb-4" />
                <p className="text-foreground mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div className="pt-4 border-t border-border">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats / CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-secondary to-secondary/80 rounded-lg p-12 text-white mb-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Thousands of contributors are already making a difference. Start your journey today.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-12 mb-12">
            {[
              { icon: Heart, label: "Active Contributors", value: "12,847" },
              { icon: TrendingUp, label: "Lives Impacted", value: "145,176+" },
              { icon: TrendingUp, label: "Total Earned", value: "$3.2M" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <p className="text-4xl font-bold mb-2">{stat.value}</p>
                <p className="text-white/80">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/figma/discover/94102">
              <button className="px-8 py-4 bg-white text-secondary rounded-md font-medium hover:bg-white/90 transition-colors">
                Find Opportunities Near You
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Why Choose Us */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">Why Contributors Choose Us</h2>

          <div className="grid grid-cols-3 gap-8">
            {whyUs.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 bg-secondary rounded-full" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
