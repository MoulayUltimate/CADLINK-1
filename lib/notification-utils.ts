// Browser notification utilities

export function isNotificationSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
    if (!isNotificationSupported()) return 'unsupported'
    return Notification.permission
}

export async function requestNotificationPermission(): Promise<boolean> {
    if (!isNotificationSupported()) return false

    if (Notification.permission === 'granted') return true
    if (Notification.permission === 'denied') return false

    const permission = await Notification.requestPermission()
    return permission === 'granted'
}

export function sendNotification(title: string, options?: {
    body?: string
    icon?: string
    tag?: string
    onClick?: () => void
}): Notification | null {
    if (!isNotificationSupported()) return null
    if (Notification.permission !== 'granted') return null

    const notification = new Notification(title, {
        body: options?.body,
        icon: options?.icon || '/icon-light-32x32.png',
        tag: options?.tag,
        badge: '/icon-light-32x32.png',
    })

    if (options?.onClick) {
        notification.onclick = () => {
            window.focus()
            options.onClick?.()
            notification.close()
        }
    }

    return notification
}
