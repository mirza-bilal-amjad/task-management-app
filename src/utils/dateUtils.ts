/**
 * Date and calendar utility functions
 */

export interface CalendarDay {
  day: number
  dayName: string
  isToday: boolean
}

/**
 * Get formatted current date information
 */
export function getCurrentDateInfo() {
  const today = new Date()
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]

  return {
    today,
    currentDay: today.getDate(),
    currentMonth: monthNames[today.getMonth()],
    currentDayName: dayNames[today.getDay()],
    dayNames,
    monthNames,
  }
}

/**
 * Generate calendar days for a week view (previous 3, current, next 3)
 * @param centerDate - The date to center the calendar around (defaults to today)
 * @returns Array of calendar day objects
 */
export function generateCalendarDays(centerDate?: Date): CalendarDay[] {
  const today = centerDate || new Date()
  const { dayNames } = getCurrentDateInfo()
  const calendarDays: CalendarDay[] = []

  for (let i = -3; i <= 3; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    calendarDays.push({
      day: date.getDate(),
      dayName: dayNames[date.getDay()],
      isToday: i === 0,
    })
  }

  return calendarDays
}

/**
 * Format greeting message based on time of day
 * @param userName - The user's name
 * @returns Formatted greeting string
 */
export function getGreetingMessage(userName?: string): string {
  const hour = new Date().getHours()
  let timeOfDay = "morning"

  if (hour >= 12 && hour < 17) {
    timeOfDay = "afternoon"
  } else if (hour >= 17) {
    timeOfDay = "evening"
  }

  return `Good ${timeOfDay}, ${userName || "User"}!`
}