const budgets: Budget[] = [
    {
        initiative_id: 1,
        grant_id: 1,
        grant: { id: 1, name: "G26001" },
        initiative: { id: 1, name: "Management & Coordination" },
        year: 2026,
        items: [
            {
                account_id: 1,
                amount: 2010,
                comment: 'test 1',
                category_id: 1,
                item_type: 'b',
                category: {
                    id: 1,
                    name: "Services"
                },
                account: {
                    id: 1,
                    name: "Printing & Binding",
                    account_number: '11-102-0312-54700'
                }
            },
            {
                account_id: 2,
                amount: 3150,
                comment: 'test 2',
                category_id: 1,
                item_type: 'b',
                category: {
                    id: 1,
                    name: "Services"
                },
                account: {
                    id: 2,
                    name: "Insurance-Other",
                    account_number: '11-102-0312-54701'
                }
            },
            {
                account_id: 3,
                amount: 1150,
                comment: 'test 3',
                category_id: 1,
                item_type: 'b',
                category: {
                    id: 1,
                    name: "Services"
                },
                account: {
                    id: 3,
                    name: "Freight & Postage Service",
                    account_number: '11-102-0312-54702'
                }
            },
            {
                account_id: 4,
                amount: 50,
                comment: 'test 4',
                category_id: 1,
                item_type: 'b',
                category: {
                    id: 1,
                    name: "Services"
                },
                account: {
                    id: 4,
                    name: "Communication Services",
                    account_number: '11-102-0312-54703'
                }
            },
            {
                account_id: 5,
                amount: 50,
                comment: 'test 5',
                category_id: 2,
                item_type: 'b',
                category: {
                    id: 2,
                    name: "Facilities"
                },
                account: {
                    id: 5,
                    name: "Rentals & Leases",
                    account_number: '11-102-0312-54700'
                }
            },
            {
                account_id: 6,
                amount: 75,
                comment: 'test 6',
                category_id: 2,
                item_type: 'b',
                category: {
                    id: 2,
                    name: "Facilities"
                },
                account: {
                    id: 6,
                    name: "Utilities - Electric",
                    account_number: '11-102-0312-54700'
                }
            },
            {
                account_id: 7,
                amount: 175,
                comment: 'test 7',
                category_id: 3,
                item_type: 'b',
                category: {
                    id: 3,
                    name: "Supplies"
                },
                account: {
                    id: 7,
                    name: "Toner",
                    account_number: '11-102-0312-54700'
                }
            },
            {
                account_id: 8,
                amount: 175,
                comment: 'test 8',
                category_id: 3,
                item_type: 'b',
                category: {
                    id: 3,
                    name: "Supplies"
                },
                account: {
                    id: 8,
                    name: "Pens",
                    account_number: '11-102-0312-54700'
                }
            },
            {
                account_id: 9,
                amount: 175,
                comment: 'test 9',
                category_id: 3,
                item_type: 'b',
                category: {
                    id: 3,
                    name: "Supplies"
                },
                account: {
                    id: 9,
                    name: "Erasers",
                    account_number: '11-102-0312-54700'
                }
            },

        ]
    },
    {
        initiative_id: 2,
        grant_id: 1,
        grant: { id: 1, name: "G26001" },
        initiative: { id: 2, name: "Training Unit" },
        year: 2026,
        items: [
            {
                account_id: 1,
                amount: 1000,
                comment: 'test 10',
                category_id: 1,
                item_type: 'b',
                category: {
                    id: 1,
                    name: "Services"
                },
                account: {
                    id: 1,
                    name: "Printing & Binding",
                    account_number: '11-102-0312-54700'
                }
            },
            {
                account_id: 2,
                amount: 200,
                comment: 'test 11',
                category_id: 1,
                item_type: 'b',
                category: {
                    id: 1,
                    name: "Services"
                },
                account: {
                    id: 2,
                    name: "Insurance-Other",
                    account_number: '11-102-0312-54701'
                }
            },
            {
                account_id: 3,
                amount: 0,
                comment: 'test 12',
                category_id: 1,
                item_type: 'b',
                category: {
                    id: 1,
                    name: "Services"
                },
                account: {
                    id: 3,
                    name: "Freight & Postage Service",
                    account_number: '11-102-0312-54702'
                }
            },
            {
                account_id: 4,
                amount: 50,
                comment: 'test 13',
                category_id: 1,
                item_type: 'b',
                category: {
                    id: 1,
                    name: "Services"
                },
                account: {
                    id: 4,
                    name: "Communication Services",
                    account_number: '11-102-0312-54703'
                }
            },
            {
                account_id: 5,
                amount: 50,
                comment: 'test 14',
                category_id: 2,
                item_type: 'b',
                category: {
                    id: 2,
                    name: "Facilities"
                },
                account: {
                    id: 5,
                    name: "Rentals & Leases",
                    account_number: '11-102-0312-54700'
                }
            },
            {
                account_id: 6,
                amount: 75,
                comment: 'test 15',
                category_id: 2,
                item_type: 'b',
                category: {
                    id: 2,
                    name: "Facilities"
                },
                account: {
                    id: 6,
                    name: "Utilities - Electric",
                    account_number: '11-102-0312-54700'
                }
            },
            {
                account_id: 7,
                amount: 175,
                comment: 'test 16',
                category_id: 3,
                item_type: 'b',
                category: {
                    id: 3,
                    name: "Supplies"
                },
                account: {
                    id: 7,
                    name: "Toner",
                    account_number: '11-102-0312-54700'
                }
            },
            {
                account_id: 8,
                amount: 175,
                comment: 'test 17',
                category_id: 3,
                item_type: 'b',
                category: {
                    id: 3,
                    name: "Supplies"
                },
                account: {
                    id: 8,
                    name: "Pens",
                    account_number: '11-102-0312-54700'
                }
            },
            {
                account_id: 9,
                amount: 175,
                comment: 'test 18',
                category_id: 3,
                item_type: 'b',
                category: {
                    id: 3,
                    name: "Supplies"
                },
                account: {
                    id: 9,
                    name: "Erasers",
                    account_number: '11-102-0312-54700'
                }
            },

        ]
    },
]

export default budgets;