type Repro = {
    id: number
    comment?: string
    items?: ReproLineItem[]
}

type LineItem = {
    accountId: number
    accountName: string
    categoryId: number,
    categoryName: string,
    initiativeId: number,
    initiativeName: string
    grantId: number,
    grantName: string,
    rowIndex?: number
    uuid: string
}

type ReproLineItem = LineItem & {
    increase?: number
    decrease?: number
    comment?: string
    currentAmount?: number
    newAmount?: number
}

type ReproAccountBalance = {
    accountId: number
    name: string
    currentAmount: number
}

