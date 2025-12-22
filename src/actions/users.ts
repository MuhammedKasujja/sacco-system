import { db } from '@/db'
import { usersTable } from '@/db/schema'
import { createServerFn } from '@tanstack/react-start'

export const fetchUsers = createServerFn({ method: 'GET' }).handler(() => {
  return db.query.usersTable.findMany()
})

export const createUser = createServerFn().handler(() => {
  return db.insert(usersTable).values({
    name: 'kasujja muhammed',
    email: 'al.kasmud.2@gmail.com',
    password: 'Password2',
    age: 30,
  })
})
