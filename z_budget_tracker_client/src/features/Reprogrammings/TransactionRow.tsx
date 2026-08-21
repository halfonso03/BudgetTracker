import Dropdown from 'react-dropdown';
import { Fragment } from 'react/jsx-runtime';
import { formatCurrency } from '../../app/util';
import Menus from '../../components/menus/Menus';
import { Copy, Edit, EllipsisVertical, Trash } from 'lucide-react';
import CommentToggler from './CommentToggler';

type Props = {
  lineItem: ReproLineItem;
  balances: { accountId: number; name: string; currentAmount: number }[];
  accountChange: (option: number, rowUuid: string) => void;
  duplicateRow: (uuid: string) => void;
  editRow: (uuid: string) => void;
  deleteRow: (uuid: string) => void;
  saveComment: (uuid: string, comment: string | null | undefined) => void;
  render: () => React.ReactNode;
};

const TransactionRow = ({
  render,
  accountChange,
  duplicateRow,
  deleteRow,
  editRow,
  balances,
  saveComment,
  lineItem: {
    rowId,
    initiativeName,
    grantName,
    categoryName,
    accountId,
    uuid,
    comment,
  },
}: Props) => {

  const accounts = balances.map((b) => ({
    value: b.accountId,
    label: (
      <div className="flex justify-between gap-2">
        <div>{b.name}</div>
        <div>{formatCurrency(b.currentAmount)}</div>
      </div>
    ),
  }));

  function handleSaveComment(uuid: string, comment: string | null | undefined) {
    saveComment(uuid, comment);
  }

  return (
    <Fragment>
      <div className="self-center">
        {initiativeName} {rowId}
      </div>
      <div className="self-center">{grantName}</div>
      <div className="self-center">{categoryName}</div>
      <div className="self-center ">
        <Dropdown
          tabIndex={-1}
          aria-label="Number"
          options={accounts}
          onChange={(option) => {
            accountChange(+option.value, uuid);
          }}
          value={accountId}
          className="w-full"
        />
      </div>
      {render()}
      <div className="flex justify-around self-center">
        <CommentToggler
          uuid={uuid}
          itemComment={comment}
          saveComment={handleSaveComment}
        ></CommentToggler>

        <Menus>
          <Menus.Toggler id={uuid}>
            <EllipsisVertical
              size={20}
              className="text-neutral-500"
            ></EllipsisVertical>
          </Menus.Toggler>
          <Menus.List id={uuid}>
            <Menus.MenuItem onClick={() => editRow(uuid)}>
              <Edit size={18}></Edit>&nbsp;&nbsp;Edit Row
            </Menus.MenuItem>
            <Menus.MenuItem onClick={() => duplicateRow(uuid)}>
              <Copy size={18}></Copy>&nbsp;&nbsp;Duplicate Row
            </Menus.MenuItem>
            <Menus.MenuItem onClick={() => deleteRow(uuid)}>
              <Trash className="text-red-500" size={18}></Trash>
              &nbsp;&nbsp;Delete Row
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
