import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ room: string }>
}): Promise<Metadata> {
  const resolvedParams = await params
  return {
    title: `Agile Poll | Sala ${resolvedParams.room}`,
    description: `Vote na sala ${resolvedParams.room} do Agile Poll`,
  }
}

export default function RoomLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
