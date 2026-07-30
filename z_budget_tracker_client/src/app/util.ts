import { format } from "date-fns";

export function formatDate(date: Date) {
    return format(date, "M/d/yy ");
}

export function formatDateForCalendar(date: Date) {
    return format(date, "yyyy-MM-dd");
}

export function formatCurrency(amount: number) {
    const customFormat = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        currencySign: 'accounting'
    });

    return customFormat.format(amount)
}

export function formatNumber(amount: number): string {

    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })

    return formatter.format(amount)
}

