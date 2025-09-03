import BottomNavigation from "./BottomNavigation"

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content area with bottom padding for navigation */}
      <main className="pb-20">
        {children}
      </main>
      
      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  )
}
