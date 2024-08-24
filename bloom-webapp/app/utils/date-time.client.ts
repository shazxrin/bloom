import { format } from "date-fns"

const formatToLocalISO = (dateTime: string | Date) => {
    const date = new Date(dateTime)

    return format(date, "yyyy-MM-dd") + "T" + format(date, "HH:mm:ss") + "Z"
}

export {
    formatToLocalISO
}
