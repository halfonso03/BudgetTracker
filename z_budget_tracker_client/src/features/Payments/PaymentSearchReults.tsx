import { formatCurrency, formatDate } from '../../app/util';
import SortBySelector from '../../components/SortBySelector';
import { useSortingContext } from '../../contexts/useSortingContext';

type Props = {
  results: PaymentSearchResult[];
  // onDelete: (id: number) => void;
};

const PaymentSearchReults = ({ results }: Props) => {
  const { sortByValue } = useSortingContext();
  if (results.length == 0) return null;

  return (
    <div className="w-full min-w-full ">
      <div className="grid grid-cols-[.7fr_1.2fr_1fr_.7fr_.7fr_.7fr_1fr_1fr_1.2fr_.5fr_1.2fr_.3fr] p-2 px-3 bg-gray-50 text-neutral-500 border border-neutral-300/60 ">
        <div className="entity-label flex justify-center">
          <SortBySelector
            label="Payment No."
            value="PAYMENTNUMBER"
            currentSortValue={sortByValue}
          ></SortBySelector>
        </div>
        <div className="entity-label flex justify-center">
          <SortBySelector
            label="Payee"
            value="PAYEE"
            currentSortValue={sortByValue}
          ></SortBySelector>
        </div>
        <div className="entity-label flex justify-center">
          <SortBySelector
            label="Amount"
            value="AMOUNT"
            currentSortValue={sortByValue}
          ></SortBySelector>
        </div>
        <div className="entity-label flex justify-center">
          <SortBySelector
            label="Invoice No."
            value="INVOICENUMBER"
            currentSortValue={sortByValue}
          ></SortBySelector>
        </div>
        <div className="entity-label flex justify-center">
          <SortBySelector
            label="Invoice Date"
            value="INVOICEDATE"
            currentSortValue={sortByValue}
          ></SortBySelector>
        </div>
        <div className="entity-label flex justify-center">
          <SortBySelector
            label="Check No."
            value="CHECKNUMBER"
            currentSortValue={sortByValue}
          ></SortBySelector>
        </div>
        <div className="entity-label flex justify-center">
          <SortBySelector
            label="Posted By"
            value="POSTEDBY"
            currentSortValue={sortByValue}
          ></SortBySelector>
        </div>
        <div className="entity-label flex justify-center">
          <SortBySelector
            label="Posted Date"
            value="POSTEDDATE"
            currentSortValue={sortByValue}
          ></SortBySelector>
        </div>
        <div className="entity-label flex justify-center">
          <SortBySelector
            label="Initiative"
            value="AMOUNT"
            currentSortValue={sortByValue}
          ></SortBySelector>
        </div>
        <div className="entity-label flex justify-center">
          <SortBySelector
            label="Award"
            value="AMOUNT"
            currentSortValue={sortByValue}
          ></SortBySelector>
        </div>
        <div className="entity-label flex justify-center">
          <SortBySelector
            label="Account"
            value="AMOUNT"
            currentSortValue={sortByValue}
          ></SortBySelector>
        </div>
        <div className="text-center"></div>
      </div>
      <div className="border-l border-r border-b border-neutral-300/60">
        {results.map((r, index) => (
          <div
            key={index}
            className="hover:bg-neutral-100  border-b border-b-neutral-300/60 last:border-0"
          >
            <div className="grid grid-cols-[.7fr_1.2fr_1fr_.7fr_.7fr_.7fr_1fr_1fr_1.2fr_.5fr_1.2fr_.3fr] p-2 px-3">
              <div className="text-center self-center">{r.paymentNumber}</div>
              <div className="text-center self-center">{r.payeeName}</div>
              <div className="text-center self-center">{formatCurrency(r.amount)}</div>
              <div className="text-center self-center">{r.invoiceNumber}</div>
              <div className="text-center self-center">
                {r.invoiceDate && formatDate(r.invoiceDate)}
              </div>
              <div className="text-center self-center">{r.checkNumber}</div>
              <div className="text-center self-center">{r.postedBy}</div>
              <div className="text-center self-center">
                {r.postedDate && formatDate(r.postedDate)}
              </div>
              <div className="text-center self-center">{r.initiativeName}</div>
              <div className="text-center self-center">{r.grantName}</div>
              <div className="text-center self-center">
                {r.categoryName + '/' + r.accountName}
              </div>
              <div className="text-center self-center"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default PaymentSearchReults;
