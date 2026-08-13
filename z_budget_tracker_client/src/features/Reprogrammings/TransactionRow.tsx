import Dropdown, { type Option } from 'react-dropdown';
import { Fragment } from 'react/jsx-runtime';
import { formatCurrency } from '../../app/util';

type Props = {
  lineItem: ReproLineItem;
  categories: Category[] | undefined;
  handleAccountChange: (option: Option, rowUuid: string) => void;
};

const TransactionRow = ({
  categories,
  handleAccountChange,
  lineItem: {
    initiativeName,
    grantName,
    categoryName,
    categoryId,
    accountName,
    accountId,
    uuid
  },
}: Props) => {
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
      <div>{initiativeName}</div>
      <div>{grantName}</div>
      <div>{categoryName}</div>
      <div>
        <Dropdown
          aria-label="Number"
          options={accounts}
          renderOption={(option, { active, selected }) => (
            <div>
              <div>
                <div className="flex gap-1">
                  {selected ? '✓ ' : ''}
                  <div
                    className={`text-neutral-900 ${selected} : "" : "pl-20"`}
                  >
                    {option.label}
                  </div>
                </div>
              </div>
              <div className="text-neutral-500 pl-4">
                {formatCurrency(1000)}
              </div>
            </div>
          )}
          onChange={(option) => {
            handleAccountChange(option, uuid);
          }}
          value={accountId}
          placeholder={accountName}
        />
      </div>
    </Fragment>
  );
};
export default TransactionRow;
