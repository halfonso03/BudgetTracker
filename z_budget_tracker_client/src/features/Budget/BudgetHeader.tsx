import Label from '../../components/Label';

interface Props {
  bRef: React.Ref<HTMLDivElement>;
  cRef: React.Ref<HTMLDivElement>;
  rRef: React.Ref<HTMLDivElement>;
  totalSpent: string | undefined;
}

const BudgetHeader = ({  bRef, cRef, rRef, totalSpent }: Props) => {
  return (
    <div className=" grid grid-cols-[.55fr_.35fr_.25fr_.25fr_.25fr_.25fr_.2fr] mb-2 ">
      <div className="pl-3 pb-1 font-bold dark:text-white  dark:bg-transparent"></div>
      <div className="flex flex-col items-end justify-end gap-1 pl-3 pb-1 font-semibold dark:text-white dark:bg-transparent">
        <Label>Budgeted</Label>
      </div>
      <div className="pl-3 pb-1 text-end  font-semibold dark:text-white  dark:bg-transparent">
        <Label>Current</Label>
      </div>
      <div className="pl-3 pb-1 text-end font-semibold dark:text-white  dark:bg-transparent">
        <Label>Spent</Label>
      </div>
      <div className="pl-3 pb-1 text-end  font-semibold dark:text-white  dark:bg-transparent">
        <Label>Remaining</Label>
      </div>
      <div className=" dark:bg-transparent"></div>
      <div className="dark:bg-transparent"></div>
      <div className="dark:bg-transparent"></div>
      <div
        className="text-end text-neutral-800 font-semibold pb-1 dark:text-white dark:bg-transparent"
        ref={bRef}
      ></div>
      <div
        className="text-end text-neutral-800 font-semibold pb-1 dark:text-white dark:bg-transparent"
        ref={cRef}
      ></div>
      <div className="text-end text-neutral-800 font-semibold pb-1 dark:text-white dark:bg-transparent">
        {totalSpent}
      </div>
      <div
        className="text-end text-neutral-800 font-semibold pb-1 dark:text-white dark:bg-transparent"
        ref={rRef}
      ></div>
      <div className="dark:bg-transparent"></div>
      <div className="dark:bg-transparent"></div>
    </div>
  );
};
export default BudgetHeader;
