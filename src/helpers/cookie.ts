export function getCookie(name: string) {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)

    if (parts.length === 2) return parts.pop()?.split(';').shift()
}

export function setCookie(name: string, value: string) {
    document.cookie = `${name}=${value}`
}

export function deleteCookie(name: string) {
    document.cookie = `${name}=; expire=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}