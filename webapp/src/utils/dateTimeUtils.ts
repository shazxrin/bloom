import {
    format,
    formatDuration,
    secondsToHours,
    secondsToMinutes,
    set
} from "date-fns"

export function formatDurationString(duration: number): string {
    return formatDuration(
        {
            hours: secondsToHours(duration),
            minutes: secondsToMinutes(duration) - (secondsToHours(duration) * 60)
        },
        {
            zero: true
        }
    )
}

export function formatDate(date: Date): string {
    return format(date, "yyyy-MM-dd")
}

export function getTodayDate(): Date {
    return set(new Date(), {hours: 0, minutes: 0, seconds: 0})
}
