interface Props {
  bRef: React.Ref<HTMLDivElement>;
  cRef: React.Ref<HTMLDivElement>;
  rRef: React.Ref<HTMLDivElement>;
  totalSpent: string;
}

const BudgetHeader = ({ bRef, cRef, rRef, totalSpent }: Props) => {
  return (
    <div className="grid grid-cols-[.55fr_.25fr_.25fr_.25fr_.25fr_.25fr_.2fr] pt-5 mb-5 border-t border-t-neutral-200">
      <div className="pl-3 py-2"></div>
      <div className="pl-3 py-2 text-end entity-label">Total Budgeted</div>
      <div className="pl-3 py-2 text-end entity-label">Total Current</div>
      <div className="pl-3 py-2 text-end entity-label">Total Spent</div>
      <div className="pl-3 py-2 text-end entity-label">Total Remaining</div>
      <div className="col-span-2"></div>
      <div></div>
      <div className="text-end font-bold text-neutral-800" ref={bRef}></div>
      <div className="text-end font-bold text-neutral-800 " ref={cRef}></div>
      <div className="text-end font-bold text-neutral-800 ">{totalSpent}</div>
      <div className="text-end font-bold text-neutral-800 " ref={rRef}></div>
      <div></div>
      <div></div>
    </div>
  );
};
export default BudgetHeader;
