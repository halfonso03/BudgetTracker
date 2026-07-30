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

export function formatNumber(amount: number) {

    return new Intl.NumberFormat('en-US').format(amount)
}

// export const requiredString = (fieldName: string) =>
//     z
//         .string({ error: `${fieldName} is required` })
//         .min(1, { error: `${fieldName} is required` });

// export function timeAgo(date: DateArg<Date>) {
//     return formatDistanceToNow(date) + " ago";
// }
