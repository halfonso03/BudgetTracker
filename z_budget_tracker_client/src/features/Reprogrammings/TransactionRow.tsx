import Dropdown from 'react-dropdown';
import { Fragment } from 'react/jsx-runtime';
import { formatCurrency } from '../../app/util';

type Props = {
  lineItem: ReproLineItem;
  categories: Category[] | undefined;
  accountChange: (option: number, rowUuid: string) => void;
  duplicateRow: (uuid: string) => void;
  deleteRow: (uuid: string) => void;
  balances: { accountId: number; name: string; currentAmount: number }[];
  render: () => React.ReactNode;
};

const TransactionRow = ({
  render,
  categories,
  accountChange,
  duplicateRow,
  deleteRow,
  balances,
  lineItem: { initiativeName, grantName, categoryName, accountId, uuid },
}: Props) => {
  if (!categories) return null;

  const accounts = balances.map((b) => ({
    value: b.accountId,
    label: (
      <div className="flex justify-between gap-2">
        <div>{b.name}</div>
        <div>{formatCurrency(b.currentAmount)}</div>
      </div>
    ),
  }));

  return (
    <Fragment>
      <div className="self-center">{initiativeName}</div>
      <div className="self-center">{grantName}</div>
      <div className="self-center">{categoryName}</div>
      <div className="self-center w-full">
        <Dropdown
          aria-label="Number"
          options={accounts}
          onChange={(option) => {
            accountChange(+option.value, uuid);
          }}
          value={accountId}
        />
      </div>
      {render()}
      <div className="self-center">
        <button onClick={() => duplicateRow(uuid)}>D</button>
        <button onClick={() => deleteRow(uuid)}>D2</button>
      </div>
    </Fragment>
  );
};

// function balanceDropdownItem(label: string) {
//   const item1 = label.split('|')[0];
//   const item2 = label.split('|')[1];

//   return (
//     <div className="flex justify-between border w-[100%]">
//       <div>{item1}</div>
//       <div>{item2}</div>
//     </div>
//   );
// }
export default TransactionRow;
