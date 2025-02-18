import Card from '../components/ui/Card'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

export default function About() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              About Samurai.Dojo
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              A journey of continuous improvement and learning
            </p>
          </div>

          <div className="mt-16">
            <Card className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-semibold text-gray-900">
                The 42-Day Challenge
              </h2>
              <p className="mt-4 text-gray-600">
                Samurai.Dojo is a personal project that will evolve over 42 days,
                incorporating new features, improvements, and learning experiences
                along the way. Built with modern web technologies and best
                practices, this project serves as a testament to the journey of
                continuous learning and improvement in web development.
              </p>
              <h3 className="mt-8 text-xl font-semibold text-gray-900">
                Tech Stack
              </h3>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-600">
                <li>Next.js for the framework</li>
                <li>TypeScript for type safety</li>
                <li>Tailwind CSS for styling</li>
                <li>Component-driven architecture</li>
                <li>Modern development practices</li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 