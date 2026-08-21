type Repro = {
    id: number
    justification: string
    createdBy: string
    createDate: Date
    createdById: number
    updateDate?: Date
    updatedById?: number
    postedBy?: string
    posted: boolean
    postedById?: number
    lineItems: ReproLineItem[]
    rowBalances?: RowBalance[],
    started?: boolean
}

type LineItem = {
    year?: number
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
    rowId: number
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

type SearchParams = {
    id?: number,
    initiativeName?: string
    grantName?: string
    categoryName?: string
    accountName?: string
    year?: number
}