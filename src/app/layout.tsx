import type { Metadata } from 'next'
import { Urbanist } from 'next/font/google'
import PageLayout from '~/components/PageLayout'
import { Provider } from '~/components/ui/provider'
import './global.css'

const urbanist = Urbanist({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AgilePoll',
  description: 'Planning Poker',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html suppressHydrationWarning lang='en'>
      <body className={urbanist.className}>
        <Provider>
          <PageLayout>{children}</PageLayout>
        </Provider>
      </body>
    </html>
  )
}
