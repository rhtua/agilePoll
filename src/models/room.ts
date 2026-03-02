export interface User {
  uid: string
  name: string
  vote?: string
  online?: boolean
}

export interface Room {
  code: string
  name: string
  points: string
  revealVotes: boolean
  createdAt: string | Date
  ownerUid: string
  users: User[]
}
