type ReproStatus = typeof EDITED | typeof SAVED | typeof POSTED;

type PaymentHeader = {
    id: number;
    justification: string;
    status: ReproStatus;
    createdBy?: string;
    createdById?: number;
    createDate?: Date;
    postedDate?: Date | null;
    postedBy?: string | null;
};

type Payment = {
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
    lineItems: PaymentLineItem[]
    // rowBalances?: ReproRowBalance[],
    started?: boolean
    uuid?: string
}


type PaymentLineItem = {
    rowId: number
    year?: number
    uuid: string
    accountId: number
    accountName: string
    categoryId: number,
    categoryName: string,
    initiativeId: number,
    initiativeName: string
    grantId: number,
    grantName: string,
    payeeId: number,
    payeeName: string
    availableAmount: number
    paymentAmount: string | number
    newAvailableAmount: number
    comment?: string
}


type PaymentInputRows = {
    rows: PaymentInputRow[]
}

type PaymentInputRow = {
    accountId: number;
    categoryId: number;
    payeeId: number;
    availableAmount?: number;
    paymentAmount: string | number;
    newAvailableAmount: number
};

type PaymentAvailableAccountBalance = {
    accountId: number
    accountName: string
    availableAmount: number
    accountId: number
    initiativeId: number,
    grantId: number,
    initiativeName?: string
    grantName?: string
    categoryName?: string
}