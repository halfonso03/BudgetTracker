import type { FieldValues, Path, UseFormSetValue } from "react-hook-form";
import { formatNumber } from "../../app/util";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function formatArrayFieldAmount<T extends FieldValues>(
    setValue: UseFormSetValue<T>, budgetRows: any, accountId: number, amount: any) {

    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    let index = 0;
    while (budgetRows[index].accountId !== accountId) {
        index++;
    }


    if (formatter.format(+amount) === 'NaN') {
        setValue(`rows.${index}.amount` as Path<T>, '0.00' as any);
        return;
    }

    setValue(`rows.${index}.amount` as Path<T>, formatNumber(+amount) as any);
}

export function removeNumberFormattingFromArrayField<T extends FieldValues>(
    setValue: UseFormSetValue<T>, budgetRows: any,
    accountId: number,
    amount: string,
) {
    let index = 0;
    while (budgetRows[index].accountId !== accountId) {
        index++;
    }

    const result = amount.replace(/(?<=\d),(?=\d)/g, '');
    setValue(`rows.${index}.amount` as Path<T>, result as any);
}