import { Fragment } from 'react/jsx-runtime';
import Menus from '../../components/menus/Menus';
import { Copy, Edit, EllipsisVertical, Trash } from 'lucide-react';
import CommentToggler from './CommentToggler';
import { POSTED } from '../../app/constants';

type Props = {
  lineItem: PaymentLineItem;
  canEdit: boolean;
  duplicateRow?: (uuid: string) => void;
  editRow?: (uuid: string) => void;
  deleteRow?: (uuid: string) => void;
  saveComment?: (uuid: string, comment: string | null | undefined) => void;
  status: number;
  render: () => React.ReactNode;
};

const PaymentRow = ({
  render,
  duplicateRow,
  deleteRow,
  editRow,
  saveComment,
  canEdit,
  status,
  lineItem: {
    payeeName,
    initiativeName,
    grantName,
    categoryName,
    accountName,
    uuid,
    comment,
  },
}: Props) => {
  function handleSaveComment(uuid: string, comment: string | null | undefined) {
    saveComment?.(uuid, comment);
  }
  return (
    <Fragment>
      <div className=" flex pl-4  gap-2 p-2 py-4 border border-neutral-200 mb-4 divide-neutral-300/60 divide-x">
        {/* <div className="self-end font-semibold text-neutral-600 bg-neutral-200 p-1">
          Payee
        </div> */}
        <div className="flex-2 ">
          <div className="font-semibold text-neutral-500 ">Payee Name</div>
          <div className="font-medium text-neutral-900 text-xl tracking-wider">
            {payeeName}
          </div>
        </div>
        <div className="flex flex-col  flex-3">
          <div className="flex  ">
            <div className="flex-1 self-end font-semibold text-neutral-500  p-1">
              Category
            </div>
            <div className=" flex-3 self-center font-medium text-neutral-900 pl-1 ">
              {categoryName}
            </div>
          </div>

          <div className="flex ">
            <div className="flex-1  self-end font-semibold text-neutral-500  p-1">
              Account
            </div>
            <div className=" flex-3  self-center font-medium text-neutral-900  pl-1">
              {accountName}
            </div>
          </div>
          <div className="flex ">
            <div className="flex-1 self-end font-semibold text-neutral-500  p-1 ">
              Initiative
            </div>
            <div className="flex-3 self-center font-medium text-neutral-900 pl-1 ">
              {initiativeName}
            </div>
          </div>

          <div className="flex ">
            <div className="flex-1 self-end font-semibold text-neutral-500  p-1">
              Grant
            </div>

            <div className="flex-3 self-center font-medium text-neutral-900  pl-1 ">
              {grantName}
            </div>
          </div>
        </div>

        <div className="flex-3">
          <div className="grid grid-cols-[1fr_1fr_1fr] justify-between gap-2 ">
            <div
              className={` font-semibold text-neutral-600 text-center self-end  p-1 ${status === POSTED ? 'opacity-0' : ''}`}
            >
              Available
            </div>
            <div className="text-center font-semibold text-neutral-600    p-1 px-3">
              Payment
            </div>
            <div className="text-center self-end font-semibold text-neutral-600    p-1 px-3">
              Remaining
            </div>
          </div>
        </div>
        {/* 
        <div></div>
        <div>{payeeName}</div> */}
        <div>{render()}</div>
        <div className="flex justify-around self-center">
          <CommentToggler
            uuid={uuid}
            itemComment={comment}
            saveComment={handleSaveComment}
            canEdit={canEdit}
          ></CommentToggler>
          {canEdit && (
            <Menus>
              <Menus.Toggler id={uuid}>
                <EllipsisVertical
                  size={20}
                  className="text-neutral-500"
                ></EllipsisVertical>
              </Menus.Toggler>
              <Menus.List id={uuid}>
                <Menus.MenuItem onClick={() => editRow?.(uuid)}>
                  <Edit size={18}></Edit>&nbsp;&nbsp;Edit Row
                </Menus.MenuItem>
                <Menus.MenuItem onClick={() => duplicateRow?.(uuid)}>
                  <Copy size={18}></Copy>&nbsp;&nbsp;Duplicate Row
                </Menus.MenuItem>
                <Menus.MenuItem onClick={() => deleteRow?.(uuid)}>
                  <Trash className="text-red-500" size={18}></Trash>
                  &nbsp;&nbsp;Delete Row
                </Menus.MenuItem>
              </Menus.List>
            </Menus>
          )}
        </div>
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
export default PaymentRow;
