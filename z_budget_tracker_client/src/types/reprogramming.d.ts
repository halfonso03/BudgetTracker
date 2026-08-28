type Repro = {
    id: number
    year: number
    justification: string
    createdBy: string
    createDate: Date
    createdById: number
    updateDate?: Date
    updatedById?: number
    postedBy?: string | null
    posted: boolean
    postedById?: number | null
    postedDate?: Date | null
    lineItems: ReproLineItem[]
    rowBalances?: RowBalance[],
    started?: boolean
    uuid?: string
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
    initiativeName?: string
    grantName?: string
    categoryName?: string
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


type CreateReproRequest = {
    justification: string
    createdById: number
    posted: boolean
    lineItems: ReproLineItemRequest[]
}

type UpdateReproRequest = {
    id: number
    justification: string
    updatedById: number
    posted: boolean
    lineItems: ReproLineItemRequest[]
}

type ReproLineItemRequest = {
    rowId: number
    initiativeId: number
    grantId: number
    categoryId: number
    accountId: number
    increase: number
    decrease: number
    comment?: string | null
}


type ReproPreloadLine = {
    initiativeId: number
    grantId: number
    categoryId: number
    accountId: number
    initiativeName?: string
    grantName?: string
    categoryName?: string
    accountName?: string
}


type ReporSearchParams = {
    year: number
    initiativeIds?: number[] | null
    grantIds?: number[] | null
    accountIds?: number[] | null
    posted?: boolean | null | undefined
}

type ReprLineItemSearchResult = {
    rowId: number
    reproId: number
    initiativeName: string
    grantName: string
    categoryName: string
    accountName: string
    increase: number
    decrease: number
}

type ReproSearchResult = {
    id: number,
    year: number
    createdDate: Date
    createdBy: string
    postedBy: string | null
    postedDate: Date | null
    posted: boolean,
    justification: string | null,
    lineItems: ReprLineItemSearchResult
}