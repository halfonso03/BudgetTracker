import { formatCurrency } from '../../app/util';

type Props = {
  lines: ReproLineItem[];
};
const ReproGrantSummary = ({ lines }: Props) => {
  const groupedData = lines.reduce(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (accumulator: any, currentItem: ReproLineItem) => {
      const key: string = currentItem.grantName;

      // Initialize the array if the key doesn't exist yet
      if (!accumulator[key]) {
        accumulator[key] = [];
      }
      // Push the current object into the group
      accumulator[key].push(currentItem);

      return accumulator;
    },
    {},
  ); // Empty object is the initial value

  const grantTotals: {
    grantName: string;
    increase: number;
    decrease: number;
  }[] = Object.entries(groupedData).map(([grantName, value]) => {
    const items = value as ReproLineItem[];

    const increaseTotal = items.reduce(
      (acc, cur) => acc + +(cur.increase ?? 0),
      0,
    );

    const decreaseTotal = items.reduce(
      (acc, cur) => acc + +(cur.decrease ?? 0),
      0,
    );

    return {
      grantName,
      increase: increaseTotal,
      decrease: decreaseTotal,
    };
  });

  console.log('grantTotals', grantTotals);

  return (
    <div className="w-[40%] mx-auto  p-1 mb-18">
      <div className="font-semibold text-neutral-500 text-center text-[1.1rem] mb-1">Grant Summary</div>
      <div className="border border-neutral-200/80">
        <div className="grid grid-cols-[.5fr_.5fr.5fr] ">
          <div className="font-semibold text-neutral-600 bg-neutral-100 py-2 pl-1 text-center">
            Grant
          </div>
          <div className="font-semibold text-neutral-600 text-center bg-neutral-100 py-2 pl-1">
            Increase
          </div>
          <div className="font-semibold text-neutral-600 text-center bg-neutral-100 py-2 pl-1">
            Decrease
          </div>
          {grantTotals.map((g) => (
            <>
              <div className="pl-1 text-center my-2">{g.grantName}</div>
              <div className="text-center  my-2">{g.increase >  0 ? formatCurrency(g.increase) : "-"}</div>
              <div className="text-center  my-2">{g.decrease >  0 ? formatCurrency(g.decrease) : "-"}</div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ReproGrantSummary;
