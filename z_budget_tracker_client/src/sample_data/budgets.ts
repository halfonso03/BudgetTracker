// eslint-disable-next-line @typescript-eslint/no-explicit-any
const budgets: any[] = [
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
                account_name: "Printing & Binding",
                account_number: '11-102-0312-54700',
                category: {
                    id: 1,
                    name: "Services"
                },

            },
            {
                account_id: 2,
                amount: 3150,
                account_name: "Insurance-Other",
                account_number: '11-102-0312-54701',
                comment: 'test 2',
                category_id: 1,
                item_type: 'b',
                category: {
                    id: 1,
                    name: "Services"
                },
            },
            {
                account_id: 3,
                amount: 1150,
                account_name: "Freight & Postage Service",
                account_number: '11-102-0312-54702',
                comment: 'test 3',
                category_id: 1,
                item_type: 'b',
                category: {
                    id: 1,
                    name: "Services"
                },
            },
            {
                account_id: 4,
                amount: 50,
                account_name: "Communication Services",
                account_number: '11-102-0312-54703',
                comment: 'test 4',
                category_id: 1,
                item_type: 'b',
                category: {
                    id: 1,
                    name: "Services"
                },
            },
            {
                account_id: 5,
                amount: 50,
                account_name: "Rentals & Leases",
                account_number: '11-102-0312-54700',
                comment: 'test 5',
                category_id: 2,
                item_type: 'b',
                category: {
                    id: 2,
                    name: "Facilities"
                },
            },
            {
                account_id: 6,
                amount: 75,
                account_name: "Utilities - Electric",
                account_number: '11-102-0312-54700',
                comment: 'test 6',

                category_id: 2,
                item_type: 'b',
                category: {
                    id: 2,
                    name: "Facilities"
                },
            },
            {
                account_id: 7,
                amount: 175,
                account_name: "Toner",
                account_number: '11-102-0312-54700',
                comment: 'test 7',
                category_id: 3,
                item_type: 'b',
                category: {
                    id: 3,
                    name: "Supplies"
                },
            },
            {
                account_id: 8,
                amount: 175,
                account_name: "Pens",
                account_number: '11-102-0312-54700',
                comment: 'test 8',
                category_id: 3,
                item_type: 'b',
                category: {
                    id: 3,
                    name: "Supplies"
                },
            },
            {
                account_id: 9,
                amount: 175,
                account_name: "Erasers",
                account_number: '11-102-0312-54700',
                comment: 'test 9',
                category_id: 3,
                item_type: 'b',
                category: {
                    id: 3,
                    name: "Supplies"
                },
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
                amount: 1000, account_name: "Printing & Binding",
                account_number: '11-102-0312-54700',
                comment: 'test 10',
                category_id: 1,
                item_type: 'b',
                category: {
                    id: 1,
                    name: "Services"
                },
            },
            {
                account_id: 2,
                amount: 200,
                account_name: "Insurance-Other",
                account_number: '11-102-0312-54701',
                comment: 'test 11',
                category_id: 1,
                item_type: 'b',
                category: {
                    id: 1,
                    name: "Services"
                },
            },
            {
                account_id: 3,
                amount: 0,
                account_name: "Freight & Postage Service",
                account_number: '11-102-0312-54702',
                comment: 'test 12',
                category_id: 1,
                item_type: 'b',
                category: {
                    id: 1,
                    name: "Services"
                },
            },
            {
                account_id: 4,
                amount: 50,
                account_name: "Communication Services",
                account_number: '11-102-0312-54703',
                comment: 'test 13',
                category_id: 1,
                item_type: 'b',
                category: {
                    id: 1,
                    name: "Services"
                },
            },
            {
                account_id: 5,
                amount: 50,
                account_name: "Rentals & Leases",
                account_number: '11-102-0312-54700',
                comment: 'test 14',
                category_id: 2,
                item_type: 'b',
                category: {
                    id: 2,
                    name: "Facilities"
                },
            },
            {
                account_id: 6,
                amount: 75,
                account_name: "Utilities - Electric",
                account_number: '11-102-0312-54700',
                comment: 'test 15',
                category_id: 2,
                item_type: 'b',
                category: {
                    id: 2,
                    name: "Facilities"
                },
            },
            {
                account_id: 7,
                amount: 175,
                account_name: "Toner",
                account_number: '11-102-0312-54700',
                comment: 'test 16',
                category_id: 3,
                item_type: 'b',
                category: {
                    id: 3,
                    name: "Supplies"
                },
            },
            {
                account_id: 8,
                amount: 175,
                account_name: "Pens",
                account_number: '11-102-0312-54700',
                comment: 'test 17',
                category_id: 3,
                item_type: 'b',
                category: {
                    id: 3,
                    name: "Supplies"
                },
            },
            {
                account_id: 9,
                amount: 175,
                account_name: "Erasers",
                account_number: '11-102-0312-54700',
                comment: 'test 18',
                category_id: 3,
                item_type: 'b',
                category: {
                    id: 3,
                    name: "Supplies"
                },
            },
        ]
    },
]

export default budgets;