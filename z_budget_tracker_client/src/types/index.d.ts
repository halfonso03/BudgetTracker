type ItemyType = 'b' | 'r' | 'd';

// used by BudgetSummary.tsx
type BudgetSummary = {
    initiative_id: number
    initiative_name: string,
    grant_id: number
    grant_name: string,
    year: number,
    approved_amount: number
    current_amount: number
    spent_amount: number
    remaining_amount: number
}

// used by BudgetSummary.tsx
type AccountBalance = {
    account_id: number
    account_name: string,
    account_number: string
    comment: BudgetComment
    amount: number
    current_amount: number,
    spent_amount: number
    category?: Category
    category_id?: number
    item_type?: ItemyType
    hasRepro: boolean
}

// child of Budget Type
type BudgetLineItem = {
    account_id: number
    amount: number
    category_id?: number
    category?: Category
    account?: Account
    item_type?: ItemyType
    comment: string
    account_name: string,
    account_number: string
}

// used by
//  UseBudgetSummary.tsx
// useBudgetDetails.tsx
type Budget = {
    initiative_id: number
    grant_id: number
    year: number
    items?: BudgetLineItem[]
    account_balances: AccountBalance[]
    initiative?: Initiative
    grant?: Grant
}

// used by CreateBudget.tsx
type BudgetInputRow = {
    accountId: number;
    categoryId: number;
    amount: string;
    name: string;
    comment?: BudgetComment;
    current_amount?: string;
    spent_amount?: string;
    remaining_amount?: string;
    hasRepro: bolean
};


// used by CreateBudget.tsx
type BudgetRows = {
    rows: BudgetInputRow[];
};

type CreateBudgetRequest = {
    createdBy: number
    year: number
    lineItems: CreateBudgetLineItemsRequest[]
    comments: CreateBudgetCommentRequest[]
}

type CreateBudgetLineItemsRequest = {
    accountId: number,
    amount: number,
    initiativeId: number,
    grantId: number
}

type CreateBudgetCommentRequest = {
    accountId: number
    text: string
}

type UpdateBudgetRequest = {
    updatedBy: number,
    initiativeId: number,
    grantId: number,
    lineItems: UpdateBudgetLineItemsRequest[]
}

type UpdateBudgetLineItemsRequest = CreateBudgetLineItemsRequest


