import { motion } from 'framer-motion'
import { Video, Users, Heart, Globe, Shield, Zap } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
const features = [
  {
    icon: <Video className="h-10 w-10 text-primary" />,
    title: 'High-Quality Video',
    description: 'Crystal clear HD video calls that make conversations feel natural and immersive.'
  },
  {
    icon: <Users className="h-10 w-10 text-primary" />,
    title: 'Smart Matching',
    description: 'Our algorithm connects you with people who share your interests and conversation goals.'
  },
  {
    icon: <Heart className="h-10 w-10 text-primary" />,
    title: 'Meaningful Connections',
    description: 'Focus on deep conversations that matter, not just casual small talk.'
  },
  {
    icon: <Globe className="h-10 w-10 text-primary" />,
    title: 'Global Community',
    description: 'Connect with people from over 190 countries and expand your worldview.'
  },
  {
    icon: <Shield className="h-10 w-10 text-primary" />,
    title: 'Safe Environment',
    description: 'Advanced moderation and reporting tools to ensure a respectful experience.'
  },
  {
    icon: <Zap className="h-10 w-10 text-primary" />,
    title: 'Instant Connections',
    description: 'No waiting - get connected to interesting people in seconds.'
  }
]

export default function Features() {
  return (
    <section className="py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold tracking-tight"
          >
            Why Choose Our Platform
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            We've built a platform that prioritizes meaningful human connection in the digital age
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
