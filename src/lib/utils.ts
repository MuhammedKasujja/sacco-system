import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import bcrypt from 'bcryptjs'
import { addDays } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// encript user password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  const hashedPassword = await bcrypt.hash(password, saltRounds)
  return hashedPassword
}

export async function checkPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  const match = await bcrypt.compare(password, hashedPassword)
  return match
}

export function getCurrentTime() {
  return addDays(Date.now(), 0).toUTCString()
}
