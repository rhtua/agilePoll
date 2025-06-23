export interface User {
  uid: string
  name: string
  vote?: string
}

export interface Room {
  code: string
  name: string
  points: string
  createdAt: Date
  ownerUid: string
  users: User[]
}
