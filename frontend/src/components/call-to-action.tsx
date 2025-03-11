import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'

export default function CallToAction() {
  const navigate = useNavigate();
  return (
    <section className="py-24 bg-primary text-primary-foreground">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Ready to Start Meaningful Conversations?
            </h2>
            <p className="mt-4 text-xl text-primary-foreground/90 max-w-lg">
              Join our community of curious minds and connect with people who share your interests and passions.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button onClick={() => {
                navigate("/room")
              }}
               size="lg" variant="secondary" className="text-primary font-medium px-8 py-6 text-lg">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 px-8 py-6 text-lg">
                Watch Demo
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative h-[400px] rounded-lg overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-sm rounded-lg border border-white/10"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm mb-6">
                  <ArrowRight className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Start in seconds</h3>
                <p className="text-primary-foreground/80">
                  No downloads required. Connect instantly through your browser.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
