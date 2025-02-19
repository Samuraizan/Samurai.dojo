export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="border-t border-gray-100 pt-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Samurai.Dojo. All rights reserved.
          </p>
          <p className="mt-2 text-center text-sm text-gray-500">
            Built with Next.js and Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  )
} 