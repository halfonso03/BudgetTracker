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
    totalPaid?: number | null
    categoryName?: string
    payeeType?: string
    lastPaymentDate?: Date | null
    numberOfPayments: number
}

type PayeePayment = {
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
    numberOfPayments: number
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
    payeeName: string,
    accountName: string
    payeeTypeId: number
}

