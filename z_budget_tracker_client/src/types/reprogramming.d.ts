type Repro = {
    id: number
    justification?: string
    items?: ReproLineItem[]
    createDate: Date
    postedBy?: string
    postedDate?: Date
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
    uuid: string
}

type ReproLineItem = LineItem & {
    row_id: number
    increase?: string | number
    decrease?: string | number
    comment?: string | null | undefined
    currentAmount: number
    newAmount: number
    comment: string
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
    increase: string | number;
    decrease: string | number
    newAmount: number
};


type RowBalance = {
    key: { initiativeId: number; grantId: number; categoryId: number };
    balances: { accountId: number; name: string; currentAmount: number }[];
};