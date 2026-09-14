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
    rowBalances?: ReproRowBalance[],
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
    currentAmount: number
    increase?: string | number
    decrease?: string | number
    newCurrentAmount: number
    remainingAmount: number
    newRemainingAmount: number
    comment?: string
}

type ReproAccountBalance = {
    accountId: number
    accountName: string
    currentAmount: number
    remainingAmount: number
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
    newCurrentAmount: number
};


type ReproRowBalance = {
    key: { initiativeId: number; grantId: number; categoryId: number };
    balances: { accountId: number; accountName: string; currentAmount: number, remainingAmount: number }[];
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


type ReproSearchParams = {
    year: number
    initiativeIds?: number[] | null
    grantIds?: number[] | null
    accountIds?: number[] | null
    status: number
    debitAmount?: number | undefined
    creditAmount?: number | undefined
    debitComparer: number
    creditComparer: number
    selectedIds?: { id: number, type: string }[]
    xSelectedIds?: { id: number, type: string }[]
}

// public required int Year { get; set; }        
//         public List<int>? InitiativeIds { get; set; } = [];
//         public List<int>? GrantIds { get; set; } = [];
//         public List<int>? AccountIds { get; set; } = [];
//         public ReproSearchStatus Status { get; set; }
//         public AmountComparer DebitComparer { get; set; }
//         public AmountComparer CreditComparer { get; set; }
//         public decimal DebitAmount { get; set; }
//         public decimal CreditAmount { get; set; }



type ReproSearchResponse = {
    items: ReproSearchResult[]
    itemCount: number
    pagination: PaginationData
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
    lineItems: ReprLineItemSearchResult[]
}