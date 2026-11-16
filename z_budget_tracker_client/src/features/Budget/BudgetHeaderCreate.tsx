import { formatNumber } from '../../app/util';
import Label from '../../components/Label';

interface Props {
  year: number;
  bRef: React.Ref<HTMLDivElement>;
  py1Amount: number;
  py2Amount: number;
}

const BudgetHeaderCreate = ({ year, bRef, py1Amount, py2Amount }: Props) => {
  return (
    <div className="mb-2 grid grid-cols-[.55fr_.25fr_.25fr_.25fr]  ">
      <div></div>
      <div className="flex gap-2 flex-col items-end justify-end pb-1">
        <Label>Total Budgeted</Label>
        <Label>{year}</Label>
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
          <div className="flex flex-1 justify-end font-semibold text-neutral-500 dark:text-slate-400">
            {formatNumber(py1Amount)}
          </div>
          <div className="flex flex-1 justify-end font-semibold text-neutral-500 dark:text-slate-400">
            {formatNumber(py2Amount)}
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};
export default BudgetHeaderCreate;
