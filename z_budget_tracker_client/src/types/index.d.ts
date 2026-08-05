
type ItemyType = 'b' | 'r' | 'd';

type Account = {
    id: number
    name: string
    account_number: string
}

type Category = {
    id: number
    name: string,
    // sort_order: number
}

type Grant = {
    id: number
    name: string,
    startDate?: Date,
    endDate?: Date
    year?: number
    fiduciary?: string
}

type Initiative = {
    id: number
    name: string
}


type AccountBalance = {
    account_id: number
    account_name: string,
    account_number: string
    comment: string
    amount: number
    current_amount: number,
    spent_amount: number
    category?: Category
    category_id?: number
    item_type?: ItemyType
}

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

type Budget = {
    initiative_id: number
    grant_id: number
    year: number
    items?: BudgetLineItem[]
    account_balances: AccountBalance[]
    initiative?: Initiative
    grant?: Grant
}

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