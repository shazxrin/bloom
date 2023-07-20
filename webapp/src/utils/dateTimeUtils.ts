import {formatDuration, secondsToHours, secondsToMinutes} from "date-fns"

export function formatDurationString(duration: number): string {
    return formatDuration({
        hours: secondsToHours(duration),
        minutes: secondsToMinutes(duration) - (secondsToHours(duration) * 60),
        seconds: duration - (secondsToMinutes(duration) * 60)
    })
}
