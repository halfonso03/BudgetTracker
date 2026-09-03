import { useState } from 'react';
import { formatDate, formatNumber } from '../../app/util';
import {
  ChevronDownSquare,
  Download,
  EllipsisVertical,
  Glasses,
  Pen,
  Trash,
} from 'lucide-react';
import Menus from '../../components/menus/Menus';
import { Link } from 'react-router-dom';
import SortBySelector from '../../components/SortBySelector';
import { useSortingContext } from '../../contexts/useSortingContext';

type Props = {
  results: ReproSearchResult[];
  onDelete: (id: number) => void;
};

const ReproSearchReults = ({ onDelete, results }: Props) => {
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);
  const { sortByValue } = useSortingContext();

  if (results.length == 0) return null;

  return (
    <div className="w-full">
      <div className="grid grid-cols-[.5fr_.3fr_1fr_1fr.3fr_.4fr] p-2 px-3 ">
        <div className="entity-label">
          <SortBySelector
            label="ID"
            value="ID"
            currentSortValue={sortByValue}
          ></SortBySelector>
        </div>
        <div className="entity-label">
          <SortBySelector
            label="Status"
            value="STATUS"
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
            label="Amount"
            value="AMOUNT"
            currentSortValue={sortByValue}
          ></SortBySelector>
        </div>
        <div className="text-center"></div>
      </div>
      {results.map((r, index) => (
        <div
          key={r.id}
          className="last:border-b border-b-neutral-200 hover:bg-neutral-50 "
        >
          <div className="grid grid-cols-[.5fr_.3fr_1fr_1fr.3fr_.4fr] border border-neutral-200 p-2 px-3 border-b-0 ">
            <div>{r.id}</div>
            <div>{!r.posted ? 'Saved' : 'Posted'}</div>
            <div className="text-center">{r.posted && r.postedBy}</div>
            <div className="text-center">
              {r.postedDate && formatDate(r.postedDate)}
            </div>
            <div className="text-center">
              {formatNumber(
                r.lineItems.reduce((acc, cur) => acc + cur.increase, 0),
              )}
            </div>
            <div className="flex justify-around pl-10 px-7">
              <ChevronDownSquare
                className={`text-blue-500 cursor-pointer ${expandedIndexes.some((x) => x == index) ? 'transition-transform duration-300 ease-in-out rotate-180 ' : 'transition-transform duration-300 ease-in-out rotate-0'}`}
                onClick={() => {
                  if (expandedIndexes.some((x) => x == index)) {
                    setExpandedIndexes((prev) =>
                      prev.filter((x) => x !== index),
                    );
                  } else {
                    setExpandedIndexes((prev) => [...prev, index]);
                  }
                }}
              ></ChevronDownSquare>
              <Menus>
                <Menus.Toggler id={r.id.toString()}>
                  <EllipsisVertical
                    size={20}
                    className="text-neutral-500"
                  ></EllipsisVertical>
                </Menus.Toggler>
                <Menus.List id={r.id.toString()}>
                  <Menus.MenuItem>
                    <Link className="flex" to={`/reprogramming/${r.id}`}>
                      {r.posted ? (
                        <Glasses size={18}></Glasses>
                      ) : (
                        <Pen size={18}></Pen>
                      )}
                      &nbsp;&nbsp;
                      {r.posted ? 'View' : 'Edit'}
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
                  {r.posted !== null && !r.posted && (
                    <Menus.MenuItem onClick={() => onDelete(r.id)}>
                      <Trash className="text-red-500" size={18}></Trash>
                      &nbsp;&nbsp;Delete
                    </Menus.MenuItem>
                  )}
                </Menus.List>
              </Menus>
            </div>
          </div>
          <div
            className={`pb-0 box ${expandedIndexes.some((x) => x == index) ? ' expanded' : ''}`}
          >
            <div className="border border-neutral-200 p-3 border-b-0 bg-neutral-50">
              <div className="border border-neutral-200 bg-white ">
                <div className="grid grid-cols-[1fr_.5fr_.5fr_1fr_.5fr_.5fr] p-2 px-6 border-b border-b-neutral-200">
                  <div className="text-neutral-600">Initiative</div>
                  <div className="text-neutral-600">Award</div>
                  <div className="text-neutral-600">Category</div>
                  <div className="text-neutral-600">Account</div>
                  <div className="text-neutral-600 text-center">Increase</div>
                  <div className="text-neutral-600 text-center">Decrease</div>
                </div>
                {r.lineItems.map((item, index) => (
                  <div
                    key={index}
                    className="border-b border-b-neutral-200 last:border-0"
                  >
                    <div
                      key={index}
                      className="grid grid-cols-[1fr_.5fr_.5fr_1fr_.5fr_.5fr] p-2 px-6"
                    >
                      <div>{item.initiativeName}</div>
                      <div>{item.grantName}</div>
                      <div>{item.categoryName}</div>
                      <div>{item.accountName}</div>
                      <div className="text-center">
                        {item.increase > 0 && formatNumber(item.increase)}
                      </div>
                      <div className="text-center">
                        {item.decrease > 0 && formatNumber(item.decrease)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default ReproSearchReults;
