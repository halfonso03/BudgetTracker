interface Props {
  bRef: React.Ref<HTMLDivElement>;
}

const BudgetHeaderCreate = ({ bRef }: Props) => {
  return (
    <div className="grid grid-cols-[.55fr_.25fr_.25fr] mt-2 mb-1 ">
      <div></div>
      <div className="pl-3 py-2 text-end entity-label">Total Budgeted</div>
      <div></div>
      <div></div>
      <div className="text-end font-bold text-neutral-800" ref={bRef}></div>
      <div></div>
    </div>
  );
};
export default BudgetHeaderCreate;
