type Payee = {
    id: number,
    name: string
    accountName: string
    categoryId: number
    accountId: number
    isActive: boolean
    additionalInformation?: string
    daysSinceLastPayment: number | null
    lastPaymentAmount: number | null
    lastPaymentDate: Date | null
    totalPaid: number | null
    payeeTypeId: number
}

type Payment = {
    id: number,
    postedDate: Date
    amount: number;
    year: number
    postedBy: string
    initiative: string
    grant: string
}


