type Repro = {
    id: number
    comment?: string
    items?: ReproLineItem[]
}

type ReproLineItem = {
    accountId: number
    categoryId: number,
    accountName?: string
    categoryName?: string
    increase?: number
    decrease?: number
    comment?: string
    currentBudget?: number
}
