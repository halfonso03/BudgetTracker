import * as Yup from 'yup';


export const PaymentFormSchema = Yup.object().shape({
    payeeId: Yup.number().notOneOf([0], '*').required("*"),
    categoryId: Yup.number().notOneOf([0], '*').required("*"),
    accountId: Yup.number().notOneOf([0], '*').required("*"),
    initiativeId: Yup.number().notOneOf([0], '*').required("*"),
    grantId: Yup.number().notOneOf([0], '*').required("*"),
    amount: Yup.number().notOneOf([0], '*').required("*"),
});
