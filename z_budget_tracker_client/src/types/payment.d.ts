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
    rowBalances?: PaymentRowBalance[],
    started?: boolean
    uuid?: string
}

type PaymentRowBalance = {
    initiativeId: number; grantId: number; accountId: number; remainingAmount: number;
};

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
    comment?: string | null
    lastPaymentDate?: Date | null
    numberOfPayments?: number
    invoiceDate?: Date | null | undefined;
    invoiceNumber?: string | null
    checkNumber?: string | null
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

type PaymentRemainingAccountBalance = {
    accountId: number
    accountName: string
    availableAmount: number
    initiativeId: number,
    grantId: number,
    categoryId: number
    accountId: number
    initiativeName?: string
    grantName?: string
    categoryName?: string

}

type PaymentLineItemModalInput = {
    uuid: string;
    initiativeId?: number;
    grantId?: number;
    categoryId?: number;
    accountId?: number;
    payeeId?: number
    amount?: number
    comment?: string
    invoiceNumber?: string;
    invoiceDate?: Date | null | undefined;
    checkNumber?: string;

};

type PaymentLineItemRequest = {
    rowId: number
    initiativeId: number
    grantId: number
    categoryId: number
    accountId: number
    payeeId: number,
    amount: number
    comment?: string | null
}


type CreatePaymentRequest = {
    justification: string
    createdById: number
    posted: boolean
    lineItems: PaymentLineItemRequest[]
}

type UpdatePaymentRequest = {
    id: number
    justification: string
    updatedById: number
    posted: boolean
    lineItems: PaymentLineItemRequest[]
}



type PaymentPreloadedValues = {
    initiativeId?: number
    grantId?: number
    categoryId?: number
    accountId?: number
}



type PaymentSummary = {
    initiativeId: number
    initiativeName: string
    grantId: number
    grantName: string,
    categoryId: number
    categoryName: string,
    accountId: number
    accountName: string,
    available?: number,
    totalPaid?: number,
    remaining?: number
}