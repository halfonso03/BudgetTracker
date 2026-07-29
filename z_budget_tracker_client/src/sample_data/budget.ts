const budgets: Budget = {
    initiative_id: 1,
    grant_id: 1,
    grant: { id: 1, name: "G25001" },
    initiative: { id: 1, name: "Management & Coordination" },
    year: 2026,
    items: [
        {
            account_id: 1,
            amount: 100,
            category_id: 1,
            item_type: 'b',
            category: {
                id: 1,
                name: "Services"
            },
            account: {
                id: 1,
                name: "Printing & Binding"
            }
        },
        {
            account_id: 2,
            amount: 200,
            category_id: 1,
            item_type: 'b',
            category: {
                id: 1,
                name: "Services"
            },
            account: {
                id: 2,
                name: "Insurance-Other"
            }
        },
        {
            account_id: 3,
            amount: 0,
            category_id: 1,
            item_type: 'b',
            category: {
                id: 1,
                name: "Services"
            },
            account: {
                id: 3,
                name: "Freight & Postage Service"
            }
        },
        {
            account_id: 4,
            amount: 50,
            category_id: 1,
            item_type: 'b',
            category: {
                id: 1,
                name: "Services"
            },
            account: {
                id: 4,
                name: "Communication Services"
            }
        },
        {
            account_id: 5,
            amount: 50,
            category_id: 2,
            item_type: 'b',
            category: {
                id: 2,
                name: "Facilities"
            },
            account: {
                id: 5,
                name: "Rentals & Leases"
            }
        },
        {
            account_id: 6,
            amount: 75,
            category_id: 2,
            item_type: 'b',
            category: {
                id: 2,
                name: "Facilities"
            },
            account: {
                id: 6,
                name: "Utilities - Electric"
            }
        }
    ]
}

export default budgets;