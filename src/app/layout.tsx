import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import PageLayout from '~/components/PageLayout'
import { Provider } from '~/components/ui/provider'
import ClientRoomProvider from '~/components/ClientRoomProvider'
import './global.css'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Toaster } from '~/components/ui/toaster'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'AgilePoll - Planning Poker',
  description: 'Planning Poker',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html suppressHydrationWarning lang='en'>
      <body className={spaceGrotesk.className}>
        <SpeedInsights />
        <Provider>
          <ClientRoomProvider>
            <PageLayout>{children}</PageLayout>
          </ClientRoomProvider>
          <Toaster />
        </Provider>
      </body>
    </html>
  )
}
