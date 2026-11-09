import Label from '../../components/Label';

interface Props {
  bRef: React.Ref<HTMLDivElement>;
  cRef: React.Ref<HTMLDivElement>;
  rRef: React.Ref<HTMLDivElement>;
  totalSpent: string | undefined;
}

const BudgetHeader = ({ bRef, cRef, rRef, totalSpent }: Props) => {
  return (
    <div className=" mb-5 grid grid-cols-[.55fr_.25fr_.25fr_.25fr_.25fr_.25fr_.2fr] border border-neutral-200 dark:border-slate-700/80 shadow-sm ">
      <div className="pl-3 py-2  font-bold dark:text-white bg-neutral-100 dark:bg-slate-800">
        <Label>Totals</Label>
      </div>
      <div className="pl-3 py-2 text-end bg-neutral-100 font-semibold dark:text-white  dark:bg-slate-800">
        <Label>Budgeted</Label>
      </div>
      <div className="pl-3 py-2 text-end bg-neutral-100 font-semibold dark:text-white  dark:bg-slate-800">
        <Label>Current</Label>
      </div>
      <div className="pl-3 py-2 text-end bg-neutral-100 font-semibold dark:text-white  dark:bg-slate-800">
        <Label>Spent</Label>
      </div>
      <div className="pl-3 py-2 text-end bg-neutral-100  font-semibold dark:text-white  dark:bg-slate-800">
        <Label>Remaining</Label>
      </div>
      <div className="col-span-2 bg-neutral-100 dark:bg-slate-800"></div>
      <div className="dark:bg-slate-800"></div>
      <div
        className="text-end text-neutral-800 font-semibold py-2 dark:text-white dark:bg-slate-800"
        ref={bRef}
      ></div>
      <div
        className="text-end text-neutral-800 font-semibold py-2 dark:text-white dark:bg-slate-800"
        ref={cRef}
      ></div>
      <div className="text-end text-neutral-800 font-semibold py-2 dark:text-white dark:bg-slate-800">
        {totalSpent}
      </div>
      <div
        className="text-end text-neutral-800 font-semibold py-2 dark:text-white dark:bg-slate-800"
        ref={rRef}
      ></div>
      <div className="dark:bg-slate-800"></div>
      <div className="dark:bg-slate-800"></div>
    </div>
  );
};
export default BudgetHeader;
