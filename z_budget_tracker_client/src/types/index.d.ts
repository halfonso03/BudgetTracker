
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
    year?: number
}

type Initiative = {
    id: number
    name: string
}

type BudgetLineItem = {
    account_id: number
    amount: number
    category_id?: number
    category?: Category
    account: Account
    item_type?: ItemyType
    comment: string
}

type Budget = {
    initiative_id: number
    grant_id: number
    year: number
    items: BudgetLineItem[]
    initiative?: Initiative
    grant?: Grant
}

type BudgetSummary = {
    initiative_id: number
    initiative_name: string,
    grant_id: number
    grant_name: string,
    year: number,
    amount: number
}