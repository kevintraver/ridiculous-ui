import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'
import { SearchBar } from '@/lib/search-bar'
import { CategoryProvider } from '@/lib/category-context'
import { Home } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ridiculous UI',
  description: 'A showcase of the most absurd UI components ever created',
  generator: 'v0.dev'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body>
        <CategoryProvider>
          <header className='border-b sticky top-0 bg-background z-10'>
            <div className='container mx-auto py-4 px-4 flex items-center justify-between'>
              <Link href='/' className='font-bold text-xl flex items-center'>
                <Home className='block sm:hidden w-5 h-5' aria-label='Home' />
                <span className='hidden sm:block'>Ridiculous UI</span>
              </Link>
              <nav>
                <ul className='flex items-center gap-6'>
                  <li>
                    <SearchBar />
                  </li>
                  <li>
                    <Link href='/components' className='hover:text-primary'>
                      Components
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </header>
          <main>{children}</main>
          <footer className='border-t py-8 mt-20'>
            <div className='container mx-auto px-4 text-center text-muted-foreground'>
              <p>© {new Date().getFullYear()} Ridiculous UI</p>
            </div>
          </footer>
        </CategoryProvider>
      </body>
    </html>
  )
}
