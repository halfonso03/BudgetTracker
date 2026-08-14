import Dropdown, { type Option } from 'react-dropdown';
import { Fragment } from 'react/jsx-runtime';
import { formatCurrency } from '../../app/util';
import { useState } from 'react';

// interface AmountfieldsData {
//   count: number;
//   increment: () => void;
// }

type Props = {
  lineItem: ReproLineItem;
  categories: Category[] | undefined;
  handleAccountChange: (option: Option, rowUuid: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render: (data: any) => React.ReactNode;
};

const TransactionRow = ({
  render,
  categories,
  handleAccountChange,
  lineItem: {
    initiativeName,
    grantName,
    categoryName,
    categoryId,
    accountName,
    accountId,
    uuid,
  },
}: Props) => {
  const [count, setCount] = useState<number>(0);

  const increment = () => setCount((prev) => prev + 1);

  if (!categories) return null;

  const category = categories!.filter((x: Category) => x.id == categoryId)[0];

  const accounts = category!.accounts!.map((a) => {
    return {
      value: a.id,
      label: a.name,
    };
  });

  return (
    <Fragment>
      <div className="self-center">{initiativeName}</div>
      <div className="self-center">{grantName}</div>
      <div className="self-center">{categoryName}</div>
      <div className="self-center">
        <Dropdown
          aria-label="Number"
          options={accounts}
          renderOption={(option) => (
            <div className="flex justify-between gap-1">
              <div className="text-neutral-600">{option.label}</div>
              <div className="text-neutral-950">{formatCurrency(1000)}</div>
            </div>
          )}
          onChange={(option) => {
            handleAccountChange(option, uuid);
          }}
          value={accountId}
          placeholder={accountName}
        />
      </div>

      {render({ count, increment })}

      <div className="self-center">actions</div>
    </Fragment>
  );
};
export default TransactionRow;
