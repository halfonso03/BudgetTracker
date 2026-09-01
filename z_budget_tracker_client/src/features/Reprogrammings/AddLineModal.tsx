import Button from '../../components/Button';
import Select from '../../components/Select';
import { useState, type ChangeEvent } from 'react';
import useCurrentAccountBalances from '../../api/hooks/repro/useCurrentAccountBalances';
import { formatCurrency } from '../../app/util';
import Modal2 from '../../components/Modal2';
import useInitiatives from '../../api/hooks/common/useInitiatives';
import useCategories from '../../api/hooks/common/useCategories';
import useGrants from '../../api/hooks/common/useGrants';

type Selections = {
  initiativeId?: number;
  grantId?: number;
  categoryId?: number;
  accountId?: number;
};

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  selections?: Selections;
  year: number;
  onLineAdded: (
    balance: ReproLineItem,
    key: { initiativeId: number; grantId: number; categoryId: number },
  ) => void;
};

const AddLineModal = ({ ...props }: Props) => {
  const [selections, setSelections] = useState<Selections | null>(null);
  const [animateOut, setAnimateOut] = useState(false);
  const { grants } = useGrants(props.year, props.isOpen);
  const { initiatives } = useInitiatives(props.isOpen);
  const { categories } = useCategories(props.isOpen);

  const { data: balances } = useCurrentAccountBalances(
    selections?.initiativeId,
    selections?.grantId,
    selections?.categoryId,
  );

  function onLineAdded(account: ReproAccountBalance) {
    setSelections(null);
    setAnimateOut(true);
    setTimeout(() => {
      setAnimateOut(false);
    }, 500);
    if (initiatives && grants && categories) {
      const newLine: ReproLineItem = {
        rowId: -1,
        accountId: account.accountId,
        accountName: account.name,
        categoryId: selections!.categoryId!,
        categoryName: categories.filter(
          (x) => x.id == selections?.categoryId,
        )[0].name,
        initiativeId: selections!.initiativeId!,
        initiativeName: initiatives.filter(
          (x) => x.id == selections?.initiativeId,
        )[0].name,
        grantId: selections!.grantId!,
        grantName: grants.filter((x) => x.id == selections?.grantId)[0].name,
        currentAmount: account.currentAmount,
        uuid: window.crypto.randomUUID(),
        newAmount: account.currentAmount,
      };

      props.onLineAdded(newLine, {
        initiativeId: newLine.initiativeId,
        grantId: newLine.grantId,
        categoryId: selections!.categoryId!,
      });
    }
  }

  return (
    <Modal2 size="lg" title="Add a New Line" animateOut={animateOut} {...props}>
      {/* <pre>{JSON.stringify(selections)}</pre> */}

      <div className="grid grid-cols-[1fr_1fr] mb-4 gap-4">
        <div className="flex flex-col gap-9">
          <div>
            <div className="entity-label">Select an Initiative</div>
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
              <option value={0} className="text-neutral-600">
                Select...
              </option>
              {initiatives?.map((i) => (
                <option value={i.id} key={i.id} className="text-neutral-900">
                  {i.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <div className="entity-label">Select a Grant</div>
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
              <option value={0} className="text-neutral-600">
                Select...
              </option>
              {grants?.map((i) => (
                <option value={i.id} key={i.id} className="text-neutral-900">
                  {i.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <div className="entity-label">Select a Category</div>
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
              <option value={0} className="text-neutral-600">
                Select...
              </option>
              {categories?.map((i) => (
                <option value={i.id} key={i.id} className="text-neutral-900">
                  {i.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          {balances && (
            <div className="flex justify-between py-2 px-2 pt-0 ">
              <div className="entity-label">Current Amounts</div>
            </div>
          )}

          {balances &&
            balances?.map((b) => (
              <div
                className="rounded-sm py-2 px-2 flex justify-between mb-1 cursor-pointer hover:bg-neutral-100 transition-all duration-300"
                key={b.accountId}
                onClick={() => {
                  onLineAdded(b);
                  props.onCancel();
                  // setTimeout(, 2000)
                }}
              >
                <div className="text-neutral-700">{b.name}</div>
                <div className="text-neutral-900  ">
                  {formatCurrency(b.currentAmount)}
                </div>
              </div>
            ))}

          {balances && (
            <div className="flex justify-between py-2 px-2">
              <div className="entity-label">
                {selections &&
                  categories?.some((c) => c.id == selections?.categoryId) &&
                  categories?.filter((c) => c.id == selections?.categoryId)[0]
                    .name}
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
          )}
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
              setSelections(null);
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
export default AddLineModal;
