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

type NewBudget = {
    id: number
    name: string,
    accounts?: NewBudgetAccount[]
    // sort_order: number
}

type NewBudgetAccount = {
    id: number
    name: string
    number?: string
    category_id: number
    amount: number,
    prioryear1_amount: number,
    prioryear2_amount: number
}
