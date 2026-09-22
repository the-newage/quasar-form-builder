export const pad2 = (n: number) => String(n).padStart(2, '0')

export function toZuluISOStringFromLocalParts(gregorianDate: string, time: string) {
    // gregorianDate: 'YYYY-MM-DD'
    // time: 'HH:mm:ss'
    const [y, m, d] = gregorianDate.split('-').map(Number)
    const [hh, mm, ss] = time.split(':').map(Number)

    // این Date بر اساس timezone محلی سیستم ساخته می‌شود
    const localDate = new Date(y, (m - 1), d, hh, mm, ss || 0)

    const iso = localDate.toISOString()

    return iso.replace('.000Z', 'Z')
}
