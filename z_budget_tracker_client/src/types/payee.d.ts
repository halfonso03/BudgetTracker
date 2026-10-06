type Payee = {
    id: number,
    name: string
    accountName: string
    categoryId: number
    accountId: number
    isActive: boolean
    payeeTypeId: number
    additionalInformation?: string
    daysSinceLastPayment?: number | null
    lastPaymentAmount?: number | null
    lastPaymentDate?: Date | null
    totalPaid?: number | null
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

type PayeePaymentStats = {
    lowestPayment: number | null,
    highestPayment: number | null,
    averagePayment: number | null,
    lastPaymentDate: Date | null
    lastPaymentAmount: number | null
}


type CreatePayeeRequest = {
    name: string
    additionalInformation?: string | null | undefined
    isActive: boolean
    payeeTypeId: number
    categoryId: number
    accountId: number
}


type UpdatePayeeRequest = {
    id: number
    name: string
    additionalInformation?: string | null | undefined
    isActive: boolean
    payeeTypeId: number
    categoryId: number
    accountId: number
}


type NewPayeeInfo = {
    id: number;
    accountId: number;
    categoryId: number;
}

