interface Props {
  bRef: React.Ref<HTMLDivElement>;
  cRef: React.Ref<HTMLDivElement>;
  rRef: React.Ref<HTMLDivElement>;
  totalSpent: string | undefined;
}

const BudgetHeader = ({ bRef, cRef, rRef, totalSpent }: Props) => {
  return (
    <div className="border border-neutral-200 grid grid-cols-[.55fr_.25fr_.25fr_.25fr_.25fr_.25fr_.2fr] mt-7 mb-10">
      <div className="pl-3 py-2 bg-neutral-100 entity-name">Totals</div>
      <div className="pl-3 py-2 text-end bg-neutral-100 entity-name">
        Budgeted
      </div>
      <div className="pl-3 py-2 text-end bg-neutral-100 entity-name">
        Current
      </div>
      <div className="pl-3 py-2 text-end bg-neutral-100 entity-name">
        Spent
      </div>
      <div className="pl-3 py-2 text-end bg-neutral-100 entity-name">
        Remaining
      </div>
      <div className="col-span-2 bg-neutral-100"></div>
      <div></div>
      <div className="text-end entity-label py-2" ref={bRef}></div>
      <div className="text-end entity-label  py-2" ref={cRef}></div>
      <div className="text-end entity-label  py-2">{totalSpent}</div>
      <div className="text-end entity-label  py-2" ref={rRef}></div>
      <div></div>
      <div></div>
    </div>
  );
};
export default BudgetHeader;
