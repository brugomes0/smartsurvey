export function convertUTCToLocalDate(inputDate: string, language: string) {
    const localDate = new Date(inputDate + "z")
    const options = new Intl.DateTimeFormat(language, { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" })

    return options.format(localDate)
}

export function convertUTCToLocalDateShort(inputDate: string, language: string) {
    const localDate = new Date(inputDate + "z")
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }

    const formattedDateParts = new Intl.DateTimeFormat(language, options).formatToParts(localDate)
    const day = formattedDateParts.find(part => part.type === 'day')?.value || ''
    const month = formattedDateParts.find(part => part.type === 'month')?.value || ''
    const year = formattedDateParts.find(part => part.type === 'year')?.value || ''
    const hour = formattedDateParts.find(part => part.type === 'hour')?.value || ''
    const minute = formattedDateParts.find(part => part.type === 'minute')?.value || ''

    return `${day}-${month}-${year} ${hour}:${minute}h`
}