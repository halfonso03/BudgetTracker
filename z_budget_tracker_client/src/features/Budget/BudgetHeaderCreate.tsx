import Label from '../../components/Label';

interface Props {
  bRef: React.Ref<HTMLDivElement>;
}

const BudgetHeaderCreate = ({ bRef }: Props) => {
  return (
    <div className="mb-2 grid grid-cols-[.55fr_.25fr_.25fr]  ">
      <div></div>
      <div className='text-end pb-1'>
        <Label>Total Budgeted</Label>
      </div>
      <div></div>
      <div></div>
      <div className="text-end font-bold text-neutral-800 dark:text-white" ref={bRef}></div>
      <div></div>
    </div>
  );
};
export default BudgetHeaderCreate;
