// import {
//   useFormContext,
//   type FieldValues,
//   type Path,
//   type PathString,
//   type UseFormRegister,
// } from 'react-hook-form';

// type BudgetRow = {
//   accountId: number;
//   amount: number;
//   name: string;
// };

// interface Props<T extends FieldValues> {
//   name: string;
//   fields: (BudgetRow & Record<'id', string>)[];
//   register: UseFormRegister<T>;
//   fieldName: Path<T>;
// }

// function BudgetCategory<T extends FieldValues>({
//   name,
//   fields,
//   register,
//   fieldName,
// }: Props<T>) {
//   const { getValues } = useFormContext();

//   console.log('fields,', fields);

//   const handleCalculateTotal = () => {
//     // const amount = Number(getValues(`rows.${index}.amount`)) || 0;
//     // const total = fields
//     //   .slice(0, fields.length - 1)
//     //   .map((_, index) => Number(getValues(`rows.${index}.amount`)))
//     //   .reduce((acc, cur) => cur + acc, 0);
//     // setValue(`rows.${fields.length - 1}.amount`, total);
//   };

//   return (
//     <table className="border w-200">
//       <thead>
//         <tr>
//           <td className="font-bold">{name}</td>
//         </tr>
//         <tr>
//           <td className="text-start">Account</td>
//           <td className="text-start  font-bold">Amount</td>
//         </tr>
//       </thead>
//       <tbody>
//         {fields.map((field, index) => {
//           const amountRegister = register(fieldName, {
//             valueAsNumber: true,
//             value: `${fieldName}.${index}.amount`,
//           });

//           return (
//             <tr key={index}>
//               <td className="text-start">{field.name}</td>
//               <td className="text-start">
//                 <input
//                   key={field.id}
//                   type="number"
//                   {...amountRegister}
//                   readOnly={index == fields.length - 1}
//                   disabled={index == fields.length - 1}
//                   className={
//                     `border text-end ` +
//                     (index == fields.length - 1 ? 'font-bold' : '')
//                   }
//                   onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
//                     amountRegister.onBlur(e);
//                     handleCalculateTotal();
//                   }}
//                 />
//               </td>
//             </tr>
//           );
//         })}
//       </tbody>
//     </table>
//   );
// }
// export default BudgetCategory;
