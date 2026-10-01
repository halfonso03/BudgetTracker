type Vendor = {
    id: number,
    name: string
    accountName: string
    accountId: number
    isActive: boolean
    details: string
    daysSinceLastPayment: number | null
    lastPayment: Date | null
}