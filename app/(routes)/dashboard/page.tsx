'use client'

export default function DashboardPage() {
  return (
    <div className="relative min-h-screen">
      {/* Command Center Text */}
      <div className="fixed top-6 left-6">
        <h1 className="text-xl font-bold tracking-wider">COMMAND CENTER</h1>
      </div>

      {/* Main Content Area */}
      <main className="container mx-auto p-8">
        {/* Empty for now */}
      </main>

      {/* Chat Button */}
      <div className="fixed bottom-6 right-6">
        <a
          href="/chat"
          className="bg-white text-black w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-white/90 transition-transform transform hover:scale-105"
        >
          💬
        </a>
      </div>
    </div>
  )
} 