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
import Label from '../../components/Label';

type Props = {
  results: ReproSearchResult[];
  onDelete: (id: number) => void;
};

const ReproSearchReults = ({ onDelete, results }: Props) => {
  console.log('ReproSearchReults render');

  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);

  const { sortByValue } = useSortingContext();
  if (results.length == 0) return null;

  return (
    <div className="w-full min-w-full ">
      <div className="grid grid-cols-[.5fr_.3fr_1fr_1fr.3fr_.4fr] p-2 px-3 bg-gray-50 text-neutral-500 border border-neutral-300/60 dark:border-slate-700/80  rounded-t-md  dark:bg-slate-800/80">
        <div className=" flex justify-center ">
          <div className="flex justify-center ">
            <SortBySelector
              label="ID"
              value="ID"
              currentSortValue={sortByValue}
            ></SortBySelector>
          </div>
        </div>
        <div className=" flex justify-center">
          <div className="flex justify-center">
            <SortBySelector
              label="Status"
              value="STATUS"
              currentSortValue={sortByValue}
            ></SortBySelector>
          </div>
        </div>
        <div className=" flex justify-center">
          <div className="flex justify-center">
            <SortBySelector
              label="Posted By"
              value="POSTEDBY"
              currentSortValue={sortByValue}
            ></SortBySelector>
          </div>
        </div>
        <div className=" flex justify-center">
          <div className="flex justify-center">
            <SortBySelector
              label="Posted Date"
              value="POSTEDDATE"
              currentSortValue={sortByValue}
            ></SortBySelector>
          </div>
        </div>
        <div className=" flex justify-center">
          <div className="flex justify-center">
            <SortBySelector
              label="Amount"
              value="AMOUNT"
              currentSortValue={sortByValue}
            ></SortBySelector>
          </div>
        </div>
        <div className="text-center"></div>
      </div>
      <div className="border-l border-r border-b border-neutral-300/60 dark:border-slate-700/80 rounded-b-md">
        {results.map((r, index) => (
          <div
            key={r.id}
            className="hover:bg-neutral-100 dark:hover:bg-slate-700 border-b border-b-neutral-300/60 dark:border-slate-700/80 last:border-0"
          >
            <div className="grid grid-cols-[.5fr_.3fr_1fr_1fr.3fr_.4fr]  p-2 px-3 ">
              <div className="text-center dark:text-white">{r.id}</div>
              <div className="text-center  dark:text-white">
                {!r.posted ? 'Saved' : 'Posted'}
              </div>
              <div className="text-center  dark:text-white">
                {r.posted && r.postedBy}
              </div>
              <div className="text-center  dark:text-white">
                {r.postedDate && formatDate(r.postedDate)}
              </div>
              <div className="text-center  dark:text-white">
                {formatNumber(
                  Math.max(
                    r.lineItems.reduce((acc, cur) => acc + cur.increase, 0),
                    r.lineItems.reduce((acc, cur) => acc + cur.decrease, 0),
                  ),
                )}
              </div>
              <div className="flex justify-around pl-10 px-7">
                <ChevronDownSquare
                  className={`text-blue-500 dark:text-indigo-300 cursor-pointer ${expandedIndexes.some((x) => x == index) ? 'transition-transform duration-300 ease-in-out rotate-180 ' : 'transition-transform duration-300 ease-in-out rotate-0'}`}
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
                      className="text-neutral-500 dark:text-slate-400"
                    ></EllipsisVertical>
                  </Menus.Toggler>
                  <Menus.List id={r.id.toString()} topPos="translate-y-5">
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
              <div className="border border-neutral-200 dark:border-slate-700/80 p-3 border-b-0 bg-neutral-50 dark:bg-slate-800">
                <div className="border border-neutral-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 ">
                  <div className="grid grid-cols-[1fr_.5fr_.5fr_1fr_.5fr_.5fr] p-2 px-6 border-b border-b-neutral-200 dark:border-b-slate-700">
                    <div className="text-neutral-500 dark:text-slate font-medium">
                      <Label>Initiative</Label>
                    </div>
                    <Label>Award</Label>
                    <Label>Category</Label>
                    <Label>Account</Label>
                    <div className="text-center">
                      <Label>Increase</Label>
                    </div>
                    <div className="text-center">
                      <Label>Decrease</Label>
                    </div>
                  </div>
                  {r.lineItems.map((item, index) => (
                    <div
                      key={index}
                      className="border-b border-b-neutral-200 dark:border-slate-700/80 last:border-0"
                    >
                      <div
                        key={index}
                        className="grid grid-cols-[1fr_.5fr_.5fr_1fr_.5fr_.5fr] p-2 px-6"
                      >
                        <div className="dark:text-white">
                          {item.initiativeName}
                        </div>
                        <div className="dark:text-white">{item.grantName}</div>
                        <div className="dark:text-white">
                          {item.categoryName}
                        </div>
                        <div className="dark:text-white">
                          {item.accountName}
                        </div>
                        <div className="text-center dark:text-white">
                          {formatNumber(item.increase)}
                        </div>
                        <div className="text-center dark:text-white">
                          {formatNumber(item.decrease)}
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
    </div>
  );
};
export default ReproSearchReults;
