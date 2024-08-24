import { useEffect } from "react"

export function useCheckNativeNotification() {
    useEffect(() => {
        if (!("Notification" in window)) {
            return
        }

        if (Notification.permission !== "denied") {
            Notification.requestPermission()
        }
    }, [])
}

export function useShowNativeNotification() {
    function showNativeNotification(title: string, body: string) {
        if (!("Notification" in window)) {
            return
        }

        if (Notification.permission === "granted") {
            new Notification(title, { body, icon: "/bloom_logo.svg" })
        }
    }

    return { showNativeNotification }
}
