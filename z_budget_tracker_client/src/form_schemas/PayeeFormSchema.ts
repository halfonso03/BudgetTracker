import * as Yup from 'yup';


export const PayeeFormSchema = Yup.object().shape({
    name: Yup.string().trim().required(),
    additionalInformation: Yup.string().optional(),
    categoryId: Yup.number().required(),
    accountId: Yup.number().required(),
    isActive: Yup.bool().required(),
    payeeTypeId: Yup.number().required(),
});
