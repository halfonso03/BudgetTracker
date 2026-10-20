type TransactionResponse = {
    id: number
    amount: number
    typeName: string
    postedDate: Date
    type: string
    payeeName: string
}

type BudgetAudit = {
    amount: number
    updatedBy: string
    updateDate: Date
    accountName: string
    version: string
}