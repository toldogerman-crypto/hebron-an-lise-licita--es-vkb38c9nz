/* General utility functions (exposes cn) */
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { UrgencyLevel } from './types'

/**
 * Merges multiple class names into a single string
 * @param inputs - Array of class names
 * @returns Merged class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export function getDaysUntil(dateString: string): number {
  if (!dateString) return 0
  let target: Date
  if (dateString.includes('/')) {
    const [datePart, timePart] = dateString.split(' ')
    const [day, month, year] = datePart.split('/')
    target = new Date(`${year}-${month}-${day}T${timePart || '00:00:00'}`)
  } else {
    target = new Date(dateString)
  }
  if (isNaN(target.getTime())) return 0
  const now = new Date()
  const diff = target.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function getUrgencyLevel(dateString: string, minDeadline: number = 3): UrgencyLevel {
  const days = getDaysUntil(dateString)
  if (days < minDeadline) return 'red'
  if (days <= minDeadline + 4) return 'yellow'
  return 'green'
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
