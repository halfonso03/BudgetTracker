import { useState } from 'react';
import { formatDate, formatNumber } from '../../app/util';
import { ChevronDownSquare } from 'lucide-react';

type Props = {
  results: ReproSearchResult[];
};

const ReproSearchReults = ({ results }: Props) => {
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);
  if (results.length == 0) return null;
  return (
    <div className="w-full">
      <div className="grid grid-cols-[.3fr_1fr_1fr_.3fr_.3fr] p-2 px-3 ">
        <div className="entity-label">ID</div>
        <div className="entity-label text-center">Posted By</div>
        <div className="entity-label text-center">Posted Date</div>
        <div className="entity-label text-end">Amount</div>
        <div className="text-center"></div>
      </div>
      {results.map((r, index) => (
        <div
          key={r.id}
          className="last:border-b border-b-neutral-200 animate-repro-fade-in"
        >
          <div className="grid grid-cols-[.3fr_1fr_1fr.3fr_.3fr] border border-neutral-200 p-2 px-3 border-b-0 ">
            <div>{r.id}</div>
            <div className="text-center">{r.posted && r.postedBy}</div>
            <div className="text-center">
              {r.postedDate && formatDate(r.postedDate)}
            </div>
            <div className="text-end">
              {formatNumber(
                r.lineItems.reduce((acc, cur) => acc + cur.increase, 0),
              )}
            </div>
            <div className="flex justify-center">
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
