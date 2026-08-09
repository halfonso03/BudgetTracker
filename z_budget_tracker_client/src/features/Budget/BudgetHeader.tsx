interface Props {
  bRef: React.Ref<HTMLDivElement>;
  cRef: React.Ref<HTMLDivElement>;
  rRef: React.Ref<HTMLDivElement>;
  totalSpent: string | undefined;
}

const BudgetHeader = ({ bRef, cRef, rRef, totalSpent }: Props) => {
  return (
    <div className=" mt-9 mb-5  grid grid-cols-[.55fr_.25fr_.25fr_.25fr_.25fr_.25fr_.2fr] border border-neutral-200 shadow-sm s">
      <div className="pl-3 py-2 bg-neutral-100 text-neutral-600 font-bold">Totals</div>
      <div className="pl-3 py-2 text-end bg-neutral-100 text-neutral-600 font-bold">
        Budgeted
      </div>
      <div className="pl-3 py-2 text-end bg-neutral-100 text-neutral-600 font-bold">
        Current
      </div>
      <div className="pl-3 py-2 text-end bg-neutral-100 text-neutral-600 font-bold">Spent</div>
      <div className="pl-3 py-2 text-end bg-neutral-100 text-neutral-600 font-bold">
        Remaining
      </div>
      <div className="col-span-2 bg-neutral-100"></div>
      <div></div>
      <div className="text-end text-neutral-800 font-bold py-2" ref={bRef}></div>
      <div className="text-end text-neutral-800 font-bold py-2" ref={cRef}></div>
      <div className="text-end text-neutral-800 font-bold py-2">{totalSpent}</div>
      <div className="text-end text-neutral-800 font-bold py-2" ref={rRef}></div>
      <div></div>
      <div></div>
    </div>
  );
};
export default BudgetHeader;
