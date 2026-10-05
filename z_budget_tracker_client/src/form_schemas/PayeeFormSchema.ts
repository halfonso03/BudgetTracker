import * as Yup from 'yup';


export const PayeeFormSchema = Yup.object().shape({
    id: Yup.number().required("*"),
    name: Yup.string().trim().required(),
    additionalInformation: Yup.string().nullable(),
    categoryId: Yup.number().required(),
    accountId: Yup.number().required(),
    isActive: Yup.bool().required(),
    payeeTypeId: Yup.number().required(),
});
