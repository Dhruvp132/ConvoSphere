'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter } from './ui/card'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Marketing Director',
    content: "I've made professional connections that turned into real collaborations. The quality of conversations here is unmatched.",
    avatar: '/placeholder.svg?height=40&width=40'
  },
  {
    name: 'Michael Chen',
    role: 'Graduate Student',
    content: 'As someone studying abroad, this platform helped me connect with people from my home country and make new friends globally.',
    avatar: '/placeholder.svg?height=40&width=40'
  },
  {
    name: 'Elena Rodriguez',
    role: 'Life Coach',
    content: "The deep conversations I've had here have been incredibly rewarding. I've gained new perspectives that changed my outlook on life.",
    avatar: '/placeholder.svg?height=40&width=40'
  }
]

export default function Testimonials() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold tracking-tight"
          >
            What Our Users Say
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Join thousands of satisfied users who have found meaningful connections
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-lg mb-6">"{testimonial.content}"</p>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-4">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
