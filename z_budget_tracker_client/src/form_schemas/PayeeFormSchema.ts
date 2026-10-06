import * as Yup from 'yup';


export const PayeeFormSchema = Yup.object().shape({
    id: Yup.number().required("*"),
    name: Yup.string().trim().required("*"),
    additionalInformation: Yup.string().nullable(),
    categoryId: Yup.number().notOneOf([0], '*').required("*"),
    payeeTypeId: Yup.number().notOneOf([0], '*').required("*"),
    accountId: Yup.number().required("*"),
    isActive: Yup.bool().required("*"),
});
