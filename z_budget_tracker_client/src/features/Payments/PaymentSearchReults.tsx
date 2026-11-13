import { Link } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../app/util';
import SortBySelector from '../../components/SortBySelector';
import { useSortingContext } from '../../contexts/useSortingContext';
import Menus from '../../components/menus/Menus';
import {
  DollarSign,
  Download,
  Ellipsis,
  Glasses,
  Pen,
  Trash,
} from 'lucide-react';

type Props = {
  results: PaymentSearchResult[];
  onDelete: (id: number, name: string) => void;
  onStartUpdateInvoice: (paymentSearchResult: PaymentSearchResult) => void;
};

const PaymentSearchReults = ({
  results,
  onDelete,
  onStartUpdateInvoice,
}: Props) => {
  const { sortByValue } = useSortingContext();
  if (results.length == 0) return null;

  return (
    <div className="w-full min-w-full  ">
      <div className="grid grid-cols-[.4fr_.9fr_1.2fr_1fr_.7fr_.7fr_.7fr_1fr_.8fr_1.2fr_.5fr_1.4fr_.3fr] p-2 px-3 bg-gray-50 text-neutral-500 border border-neutral-300/60 dark:border-slate-700/80  rounded-t-md  dark:bg-slate-800/80">
        <div className="flex justify-center">
          <SortBySelector
            label="ID"
            value="ID"
            currentSortValue={sortByValue}
          ></SortBySelector>
        </div>
        <div className="flex justify-center">
          <div className="flex justify-center">
            <SortBySelector
              label="Payment No."
              value="PAYMENTNUMBER"
              currentSortValue={sortByValue}
            ></SortBySelector>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="flex justify-center">
            <SortBySelector
              label="Payee"
              value="PAYEE"
              currentSortValue={sortByValue}
            ></SortBySelector>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="flex justify-center">
            <SortBySelector
              label="Amount"
              value="AMOUNT"
              currentSortValue={sortByValue}
            ></SortBySelector>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="flex justify-center">
            {' '}
            <SortBySelector
              label="Invoice Date"
              value="INVOICEDATE"
              currentSortValue={sortByValue}
            ></SortBySelector>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="flex justify-center">
            <SortBySelector
              label="Invoice No."
              value="INVOICENUMBER"
              currentSortValue={sortByValue}
            ></SortBySelector>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="flex justify-center">
            <SortBySelector
              label="Check No."
              value="CHECKNUMBER"
              currentSortValue={sortByValue}
            ></SortBySelector>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="flex justify-center">
            <SortBySelector
              label="Posted By"
              value="POSTEDBY"
              currentSortValue={sortByValue}
            ></SortBySelector>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="flex justify-center">
            <SortBySelector
              label="Posted Date"
              value="POSTEDDATE"
              currentSortValue={sortByValue}
            ></SortBySelector>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="flex justify-center">
            <SortBySelector
              label="Initiative"
              value="INITIATIVE"
              currentSortValue={sortByValue}
            ></SortBySelector>
          </div>
        </div>
        <div className="flex justify-center">
          <SortBySelector
            label="Award"
            value="AWARD"
            currentSortValue={sortByValue}
          ></SortBySelector>
        </div>
        <div className="flex justify-center">
          <div className="flex justify-center">
            <SortBySelector
              label="Account"
              value="ACCOUNT"
              currentSortValue={sortByValue}
            ></SortBySelector>
          </div>
        </div>
        <div className="text-center"></div>
      </div>
      <div className="border-l border-r border-b border-neutral-300/60 dark:border-slate-700/80 rounded-b-md">
        {results.map((r, index) => (
          <div
            key={index}
            className="hover:bg-neutral-100 dark:hover:bg-slate-700 border-b border-b-neutral-300/60 dark:border-slate-700/80 last:border-0"
          >
            <div className="grid grid-cols-[.4fr_.9fr_1.2fr_1fr_.7fr_.7fr_.7fr_1fr_.8fr_1.2fr_.5fr_1.4fr_.3fr] p-2 px-3">
              <div className="self-center dark:text-white">
                <Link to={`/payments/${r.paymentId}`}>{r.paymentId}</Link>
              </div>
              <div className="text-center self-center dark:text-white">
                {r.paymentNumber}
              </div>
              <div className="text-center self-center dark:text-white">
                {r.payeeName}
              </div>
              <div className="text-center self-center dark:text-white">
                {formatCurrency(r.amount)}
              </div>
              <div className="text-center self-center dark:text-white">
                {r.invoiceDate && formatDate(r.invoiceDate)}
              </div>
              <div className="text-center self-center dark:text-white">
                {r.invoiceNumber}
              </div>
              <div className="text-center self-center dark:text-white">
                {r.checkNumber}
              </div>
              <div className="text-center self-center dark:text-white">
                {r.postedBy}
              </div>
              <div className="text-center self-center dark:text-white">
                {r.postedDate && formatDate(r.postedDate)}
              </div>
              <div className="text-center self-center dark:text-white">
                {r.initiativeName}
              </div>
              <div className="text-center self-center dark:text-white">
                {r.grantName}
              </div>
              <div className="text-center self-center dark:text-white">
                {r.categoryName + '/' + r.accountName}
              </div>
              <div className="flex justify-center self-center w-full">
                <Menus>
                  <Menus.Toggler id={r.paymentLineItemId.toString()}>
                    <Ellipsis
                      size={22}
                      className="text-neutral-500 hover:text-neutral-400 dark:text-slate-400 adrk:hover:text-slate-300 transition-all hover:scale-125"
                    ></Ellipsis>
                  </Menus.Toggler>
                  <Menus.List
                    id={r.paymentLineItemId.toString()}
                    topPos="translate-y-5"
                    leftPos="translate-x-22"
                  >
                    <Menus.MenuItem>
                      <Link className="flex" to={`/payments/${r.paymentId}`}>
                        {r.postedDate !== null ? (
                          <Glasses size={18}></Glasses>
                        ) : (
                          <Pen size={18}></Pen>
                        )}
                        &nbsp;&nbsp;
                        {r.postedDate !== null ? 'View' : 'Edit'}
                      </Link>
                    </Menus.MenuItem>
                    <Menus.MenuItem
                      onClick={() => {
                        alert('download');
                      }}
                    >
                      <Download size={18}></Download>
                      &nbsp;&nbsp;Download
                    </Menus.MenuItem>

                    <Menus.MenuItem onClick={() => onStartUpdateInvoice(r)}>
                      <DollarSign size={18}></DollarSign>
                      &nbsp;&nbsp;Update Invoice
                    </Menus.MenuItem>
                    {!r.postedDate && (
                      <Menus.MenuItem
                        onClick={() =>
                          onDelete(r.paymentLineItemId, r.payeeName)
                        }
                      >
                        <Trash className="text-red-500" size={18}></Trash>
                        &nbsp;&nbsp;Delete
                      </Menus.MenuItem>
                    )}
                  </Menus.List>
                </Menus>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default PaymentSearchReults;
