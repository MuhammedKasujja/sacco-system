import { db } from '@/db'
import { users } from '@/db/schema'
import { createServerFn } from '@tanstack/react-start'

export const fetchUsers = createServerFn({ method: 'GET' }).handler(() => {
  return db.query.users.findMany()
})

export const createUser = createServerFn().handler(() => {
  return db.insert(users).values({
    firstName: 'kasujja',
    lastName: 'muhammed',
    email: 'al.kasmud.2@gmail.com',
    password: 'Password2',
  })
})
