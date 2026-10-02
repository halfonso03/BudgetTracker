type Payee = {
    id: number,
    name: string
    accountName: string
    accountId: number
    isActive: boolean
    details: string
    daysSinceLastPayment: number | null
    lastPaymentAmount: number | null
    lastPaymentDate: Date | null
    totalPaid: number | null
}

type Payment = {
    id: number,
    postedDate: Date
    amount: number;
    year: number
    postedBy: string
}