type Account = {
    id: number
    name: string
    number: string
    category_id: number
    categoryName?: string
}

type Category = {
    id: number
    name: string,
    accounts?: Account[]
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
