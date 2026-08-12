type Repro = {
    id: number
    comment?: string
    items?: ReproLineItem[]
}

type ReproLineItem = {
    accountId: number
    accountName: string
    categoryId: number,
    categoryName: string
    increase?: number
    decrease?: number
    comment?: string
    currentBudget: number
    initiativeId: number,
    initiativeName: string
    grantId: number,
    grantName: string
    rowIndex?: number
    uuid: string
}

type ReproAccountBalance = {
    accountId: number
    name: string
    currentAmount: number
}

