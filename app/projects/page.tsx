import Card from '../components/ui/Card'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Button from '../components/ui/Button'

const projects = [
  {
    title: 'Project One',
    description:
      'A sample project showcasing the integration of Next.js and Tailwind CSS.',
    tags: ['Next.js', 'Tailwind CSS', 'TypeScript'],
  },
  {
    title: 'Project Two',
    description:
      'Demonstrating component-driven development and modern UI practices.',
    tags: ['React', 'Components', 'UI/UX'],
  },
  {
    title: 'Project Three',
    description:
      'Exploring advanced features and optimizations in web development.',
    tags: ['Performance', 'SEO', 'Accessibility'],
  },
]

export default function Projects() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Projects
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              A collection of projects showcasing various aspects of web
              development
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.title}>
                <h2 className="text-xl font-semibold text-gray-900">
                  {project.title}
                </h2>
                <p className="mt-2 text-gray-600">{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-6">
                  <Button variant="outline" size="sm">
                    Learn More
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 