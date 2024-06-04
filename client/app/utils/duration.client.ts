const extractHours = (durationInSeconds: number) => {
    return Math.floor(durationInSeconds / 3600)
}

const extractMinutes = (durationInSeconds: number) => {
    return Math.floor((durationInSeconds % 3600) / 60)
}

const extractSeconds = (durationInSeconds: number) => {
    return Math.floor(durationInSeconds % 60)
}

export {
    extractHours,
    extractMinutes,
    extractSeconds
}
