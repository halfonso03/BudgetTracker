import Label from '../../components/Label';

interface Props {
  year: number;
  bRef: React.Ref<HTMLDivElement>;
}

const BudgetHeaderCreate = ({ year, bRef }: Props) => {
  return (
    <div className="mb-2 grid grid-cols-[.55fr_.25fr_.25fr_.25fr]  ">
      <div></div>
      <div className="flex gap-2 flex-col items-end justify-end pb-1">
        <Label>Total Budgeted</Label>
        <div className='text-neutral-500 font-semibold'>{year}</div>
      </div>
      <div className="flex flex-col items-end gap-2 py-2 font-semibold text-neutral-600 ">
        <Label>Prior Budget</Label>
        <div className="flex w-full justify-between">
          <div className="flex flex-1 justify-end">
            <Label>{year - 1}</Label>
          </div>
          <div className="flex flex-1 justify-end">
            <Label>{year - 2}</Label>
          </div>
        </div>
      </div>
      <div></div>
      <div></div>
      <div
        className="text-end font-bold text-neutral-800 dark:text-white"
        ref={bRef}
      ></div>
      <div>
        <div className="flex items-stretch ">
          <div className="flex flex-1 justify-end font-bold text-neutral-600 dark:text-white">
            1,000
          </div>
          <div className="flex flex-1 justify-end font-bold text-neutral-600 dark:text-white">
            2,000
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};
export default BudgetHeaderCreate;
