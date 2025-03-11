import { motion } from "framer-motion"
import { UserPlus, VideoIcon, MessageSquare } from "lucide-react"

const steps = [
  {
    icon: <UserPlus className="h-12 w-12 text-white" />,
    title: "Create Your Profile",
    description:
      "Sign up and tell us about your interests, conversation preferences, and what you hope to learn from others.",
    color: "bg-indigo-600",
  },
  {
    icon: <VideoIcon className="h-12 w-12 text-white" />,
    title: "Get Matched",
    description: "Our system connects you with someone who shares your interests or can offer a unique perspective.",
    color: "bg-purple-600",
  },
  {
    icon: <MessageSquare className="h-12 w-12 text-white" />,
    title: "Start Conversing",
    description: "Engage in meaningful video conversations, ask questions, share experiences, and make connections.",
    color: "bg-blue-600",
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Getting started is simple. Follow these steps to begin your journey of meaningful conversations.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8 justify-center">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="flex-1 max-w-md"
            >
              <div className="flex flex-col items-center text-center">
                <div className={`${step.color} p-4 rounded-full mb-6 shadow-lg`}>{step.icon}</div>
                <h3 className="text-2xl font-semibold mb-3 text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>

                {index < steps.length - 1 && (
                  <div className="hidden md:block h-0.5 w-24 bg-gray-300 absolute right-0 top-1/2 transform translate-x-1/2">
                    <div className="h-2 w-2 bg-gray-400 rounded-full absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2"></div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

