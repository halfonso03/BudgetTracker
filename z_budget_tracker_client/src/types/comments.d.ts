type BudgetComment = {
    id: number,
    text: string,
    entryDate: Date,
    enteredBy: string,
    updateDate?: Date,
    updatedBy?: string
}

type CreateCommentRequest = {
    newId?: number
    initiativeId: number,
    grantId: number,
    accountId: number,
    text: string,
    userId: number
}

type UpdateCommentRequest = {
    id: number
    accountId: number
    initiativeId: number,
    grantId: number
    text: string,
    userId: number,

}