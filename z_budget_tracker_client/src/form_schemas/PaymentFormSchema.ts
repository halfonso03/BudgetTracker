import * as Yup from 'yup';
import { parseFormattedNumber } from '../app/util';


export const PaymentFormSchema = Yup.object().shape({
    payeeId: Yup.number().notOneOf([0], '*').required("*"),
    categoryId: Yup.number().notOneOf([0], '*').required("*"),
    accountId: Yup.number().notOneOf([0], '*').required("*"),
    initiativeId: Yup.number().notOneOf([0], '*').required("*"),
    grantId: Yup.number().notOneOf([0], '*').required("*"),
    // amount: Yup.string().notOneOf([0], '*').required("*"),
    amount: Yup
        .string()
        .required('This field is required')
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
    remainingAmount: Yup.number().required()
        .transform((_, originalValue) => {
            // Strip commas to convert "1,234.56" -> "1234.56" for safe parsing if needed
            return parseFormattedNumber(originalValue.toString());
        })
        .test('is-valid-rem-amount', 'rem amount must be greater than 0', (val) => {
            return val > 0;
        }),
});
