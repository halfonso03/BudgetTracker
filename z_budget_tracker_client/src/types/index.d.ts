
type ItemyType = 'b' | 'r' | 'd';

type Account = {
    id: number
    name: string
    account_number?: number
}

type Category = {
    id: number
    name: string,
    // sort_order: number
}


type BudgetAccount = {
    id: number
    name: string
    account_number?: number
    amount: number
}

type BudgetCategory = {
    id: number
    name: string
    accounts: BudgetAccount[]
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
}

type Budget = {
    initiative_id: number
    grant_id: number
    year: number
    items: BudgetLineItem[]
    initiative?: Initiative
    grant?: Grant
}