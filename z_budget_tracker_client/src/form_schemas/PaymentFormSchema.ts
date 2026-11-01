import * as Yup from 'yup';
import agent from '../api/agent';


export const PaymentFormSchema = Yup.object().shape({
    payeeId: Yup.number().notOneOf([0], '*').required("*"),
    categoryId: Yup.number().notOneOf([0], '*').required("*"),
    accountId: Yup.number().notOneOf([0], '*').required("*"),
    initiativeId: Yup.number().notOneOf([0], '*').required("*"),
    grantId: Yup.number().notOneOf([0], '*').required("*"),
    comment: Yup.string().optional().nullable(),
    // amount: Yup.string().notOneOf([0], '*').required("*"),
    paymentAmount: Yup
        .string()
        .required('*')
        .matches(
            /^[0-9]{1,3}(,[0-9]{3})*(\.[0-9]+)?$|^[0-9]+(\.[0-9]+)?$/,
            'Must be a valid number with optional commas and decimal'
        )
        .transform((value, originalValue) => {
            // Strip commas to convert "1,234.56" -> "1234.56" for safe parsing if needed
            if (typeof originalValue === 'string') {
                return originalValue.replace(/,/g, '');
            }
            return value;
        })
        // Optional: validate the numeric value after stripping commas
        .test('is-valid-amount', 'Value must be greater than 0', (val) => {
            const parsed = parseFloat(val);
            return !isNaN(parsed) && parsed > 0;
        }),
    checkNumber: Yup.string().optional().nullable(),
    invoiceDate: Yup.date().optional().nullable(),
    invoiceNumber: Yup
        .string()
        .optional()
        .nullable()
        .test(
            'checkInvoicelUnique',
            'This invoice number is already taken',
            async (value, testContext) => {

                const { payload } = testContext.options.context || {}
                const { currentInvoiceNumber, payeeId } = payload;

                if (value) {
                    if (currentInvoiceNumber === value.trim()) return true;
                }

                try {
                    const response = await agent.get<string[]>(
                        `/payee/invoices/${payeeId}?invoiceNumber=${value}`,
                    );


                    const x = Boolean(response.data);
                    console.log('payload', payload)
                    console.log('response.data', response.data)
                    console.log('x', Boolean(response.data))

                    return !x;
                } catch (error) {
                    // Fallback behavior if the API is down (true to allow submission, or false to block)
                    console.error("Remote validation failed", error);
                    return false;
                }
            }
        ),

});
