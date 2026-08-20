import Button from '../../components/Button';
import Select from '../../components/Select';
import { useState, type ChangeEvent } from 'react';
import useCurrentAccountBalances from '../../api/hooks/useCurrentAccountBalances';
import { formatCurrency } from '../../app/util';
import Modal2 from '../../components/Modal2';
import { Check } from 'lucide-react';

type Selections = {
  initiativeId?: number;
  grantId?: number;
  categoryId?: number;
  accountId?: number;
};

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  uuid: string;
  initiatives: Initiative[] | undefined;
  grants: Grant[] | undefined;
  categories: Category[] | undefined;
  selections?: Selections | null;
  onLineUpdated: (
    balance: ReproLineItem,
    key: { initiativeId: number; grantId: number; categoryId: number },
  ) => void;
};

const EditLineModal = ({ ...props }: Props) => {
  const [selections, setSelections] = useState<Selections>({
    initiativeId: props.selections!.initiativeId!,
    grantId: props.selections!.grantId!,
    categoryId: props.selections!.categoryId!,
    accountId: props.selections!.accountId!,
  });

  const [originalSlections] = useState<Selections>({
    initiativeId: props.selections!.initiativeId!,
    grantId: props.selections!.grantId!,
    categoryId: props.selections!.categoryId!,
    accountId: props.selections!.accountId!,
  });

  const [animateOut, setAnimateOut] = useState(false);

  const { data: balances } = useCurrentAccountBalances(
    selections?.initiativeId,
    selections?.grantId,
    selections?.categoryId,
  );

  function onLineUpdated(account: ReproAccountBalance) {
    setAnimateOut(true);
    if (props.initiatives && props.grants && props.categories) {
      console.log('selections!.initiativeId!', selections!.initiativeId!);
      const newLine: ReproLineItem = {
        row_id: -1,
        uuid: props.uuid,
        accountId: account.accountId,
        accountName: account.name,
        categoryId: selections!.categoryId!,
        categoryName: props.categories.filter(
          (x) => x.id == selections?.categoryId,
        )[0].name,
        initiativeId: selections!.initiativeId!,
        initiativeName: props.initiatives.filter(
          (x) => x.id == selections?.initiativeId,
        )[0].name,
        grantId: selections!.grantId!,
        grantName: props.grants.filter((x) => x.id == selections?.grantId)[0]
          .name,
        currentAmount: account.currentAmount,
        newAmount: account.currentAmount,
      };

      props.onLineUpdated(newLine, {
        initiativeId: newLine.initiativeId,
        grantId: newLine.grantId,
        categoryId: newLine.categoryId,
      });
    }
  }

  return (
    <Modal2 size="lg" title="Edit Line" animateOut={animateOut} {...props}>
      <div className="grid grid-cols-[1fr_1fr] mb-4 gap-4">
        <div className="flex flex-col gap-9">
          <div>
            <span className="entity-label">Select an Initiative</span>
            <Select
              value={selections?.initiativeId}
              additionalclasses={`${selections?.initiativeId !== undefined ? 'text-neutral-900' : 'text-neutral-500'}`}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                if (+e.target.value !== 0) {
                  setSelections((prev) => ({
                    ...prev,
                    initiativeId: +e.target.value,
                  }));
                }
              }}
            >
              {props.initiatives?.map((i) => (
                <option value={i.id} key={i.id} className="text-neutral-900">
                  {i.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <span className="entity-label">Select a Grant</span>
            <Select
              additionalclasses={`${selections?.grantId !== undefined ? 'text-neutral-900' : 'text-neutral-500'}`}
              value={selections?.grantId}
              disabled={!selections?.initiativeId}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                if (+e.target.value !== 0) {
                  setSelections((prev) => ({
                    ...prev,
                    grantId: +e.target.value,
                  }));
                }
              }}
            >
              {props.grants?.map((i) => (
                <option value={i.id} key={i.id} className="text-neutral-900">
                  {i.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <span className="entity-label">Select a Category</span>
            <Select
              additionalclasses={`${selections?.categoryId !== undefined ? 'text-neutral-900' : 'text-neutral-500'}`}
              value={selections?.categoryId}
              disabled={!selections?.grantId}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                if (+e.target.value !== 0) {
                  setSelections((prev) => ({
                    ...prev,
                    categoryId: +e.target.value,
                  }));
                }
              }}
            >
              {props.categories?.map((i) => (
                <option value={i.id} key={i.id} className="text-neutral-900">
                  {i.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className=" ">
          <div className="py-2 px-2 pt-0 ">
            <div className="entity-label mb-3 border-b border-b-neutral-200">
              Select an Account
            </div>
            <div className="entity-label">Current Amounts</div>
            {/* <div className="entity-label">Current Balance</div> */}
          </div>

          {balances?.map((b) => (
            <div
              className="rounded-sm py-2 px-2 flex justify-between mb-1 cursor-pointer hover:bg-neutral-100 transition-all duration-300"
              key={b.accountId}
              onClick={() => {
                onLineUpdated(b);
                props.onCancel();
                // setTimeout(, 2000)
              }}
            >
              <div className="flex text-neutral-700 items-center gap-1">
                {b.accountId == originalSlections.accountId &&
                  b.initiativeId == originalSlections.initiativeId &&
                  b.grantId == originalSlections.grantId && (
                    <Check size={16} className="text-blue-500"></Check>
                  )}
                {b.name}
              </div>
              <div className="text-neutral-900  ">
                {formatCurrency(b.currentAmount)}
              </div>
            </div>
          ))}
          <div className="flex justify-between py-2 px-2">
            <div className="entity-label">
              {selections &&
                props.categories?.some((c) => c.id == selections?.categoryId) &&
                props.categories?.filter(
                  (c) => c.id == selections?.categoryId,
                )[0].name}
              &nbsp;Total
            </div>
            <div className="font-semibold text-neutral-800">
              {balances &&
                formatCurrency(
                  balances
                    .map((b) => b.currentAmount)
                    ?.reduce((acc, cur) => acc + cur, 0),
                )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3 pb-3">
        {/* <Button onClick={() => {}}>Save</Button> */}
        <Button
          variation="secondary"
          onClick={() => {
            props.onCancel();
            setAnimateOut(true);
            setTimeout(() => {
              // setSelections(null);
              setAnimateOut(false);
            }, 500);
          }}
        >
          Cancel
        </Button>
      </div>
    </Modal2>
  );
};
export default EditLineModal;
