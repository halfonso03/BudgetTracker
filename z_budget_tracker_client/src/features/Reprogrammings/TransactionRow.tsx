import Dropdown from 'react-dropdown';
import { Fragment } from 'react/jsx-runtime';
import { formatCurrency } from '../../app/util';
import Menus from '../../components/menus/Menus';
import { Copy, EllipsisVertical, StickyNote, Trash } from 'lucide-react';
import CommentToggler from './CommentToggler';

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
  lineItem: {
    initiativeName,
    grantName,
    categoryName,
    accountId,
    uuid,
    comment,
  },
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
          tabIndex={-1}
          aria-label="Number"
          options={accounts}
          onChange={(option) => {
            accountChange(+option.value, uuid);
          }}
          value={accountId}
        />
      </div>
      {render()}
      <div className="flex justify-around self-center">
        <CommentToggler itemComment={comment}></CommentToggler>

        <Menus>
          <Menus.Toggler id={uuid}>
            <EllipsisVertical
              size={20}
              className="text-neutral-500"
            ></EllipsisVertical>
          </Menus.Toggler>
          <Menus.List id={uuid}>
            <Menus.MenuItem onClick={() => duplicateRow(uuid)}>
              <Copy></Copy>&nbsp;&nbsp;Duplicate Row
            </Menus.MenuItem>
            <Menus.MenuItem onClick={() => deleteRow(uuid)}>
              <Trash className="text-red-500"></Trash>&nbsp;&nbsp;Delete Row
            </Menus.MenuItem>
          </Menus.List>
        </Menus>
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
