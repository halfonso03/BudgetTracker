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
    rowNumber: number
    increase?: number
    decrease?: number
    comment?: string
    currentAmount: number
    newAmount: number
}

type ReproAccountBalance = {
    accountId: number
    name: string
    currentAmount: number
    accountId: number
    initiativeId: number,
    grantId: number,
}

type ReprogInputRows = {
    rows: ReprogInputRow[]
}

type ReprogInputRow = {
    accountId: number;
    categoryId: number;
    currentAmount?: number;
    increase: number;
    decrease: number
    newAmount: number
};


type RowBalance = {
    key: { initiativeId: number; grantId: number; categoryId: number };
    balances: { accountId: number; name: string; currentAmount: number }[];
};