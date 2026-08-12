import Modal from '../../components/Modal';
import Button from '../../components/Button';
import Select from '../../components/Select';
import { useState, type ChangeEvent } from 'react';
import useCurrentAccountBalances from '../../api/hooks/useCurrentAccountBalances';
import { formatCurrency } from '../../app/util';

type Selections = {
  initiativeId?: number;
  grantId?: number;
  categoryId?: number;
  accountId?: number;
};

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  animateOut: boolean;
  initiatives: Initiative[] | undefined;
  grants: Grant[] | undefined;
  categories: Category[] | undefined;
  selections?: Selections;
};

const AddLineModal = ({ ...props }: Props) => {
  const [selections, setSelections] = useState<Selections | null>(null);

  const { data: balances } = useCurrentAccountBalances(
    selections?.initiativeId,
    selections?.grantId,
    selections?.categoryId,
  );

  function addLine(account: ReproAccountBalance) {
    if (props.initiatives && props.grants && props.categories) {
      const newLine: ReproLineItem = {
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
        currentBudget: account.currentAmount,
      };

      console.log('newLine', newLine);
    }
  }
  // const { data: account } = useAccounts(selections?.categoryId);

  return (
    <Modal size="lg" title="Add Line" {...props}>
      {/* <pre>{JSON.stringify(selections)}</pre> */}

      <div className="grid grid-cols-[1fr_1fr] mb-4 gap-4">
        <div className="flex flex-col gap-4">
          <div>
            <span className="entity-label">Select an Initiative...</span>
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
              {props.initiatives?.map((i) => (
                <option value={i.id} key={i.id} className="text-neutral-900">
                  {i.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <span className="entity-label">Select a grant...</span>
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
              {props.grants?.map((i) => (
                <option value={i.id} key={i.id} className="text-neutral-900">
                  {i.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <span className="entity-label">Select a Category...</span>
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
              {props.categories?.map((i) => (
                <option value={i.id} key={i.id} className="text-neutral-900">
                  {i.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="p-2 pt-1">
          <div className="flex justify-between mx-2 mb-2 border-b border-b-neutral-300">
            <div className="entity-label">Account</div>
            <div className="entity-label">Current Balance</div>
          </div>

          {balances?.map((b) => (
            <div
              className="rounded-sm py-1 px-2 flex justify-between mb-1 cursor-pointer hover:bg-neutral-200 transition-all duration-300"
              key={b.accountId}
              onClick={() => addLine(b)}
            >
              <div className="text-neutral-700">{b.name}</div>
              <div className="text-neutral-900 font-semibold ">
                {formatCurrency(b.currentAmount)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-3 pb-3">
        {/* <Button onClick={() => {}}>Save</Button> */}
        <Button
          variation="secondary"
          onClick={() => {
            props.onCancel();

            setTimeout(() => {
              setSelections(null);
              // setReason('');
              // setYear(0);
            }, 500);
          }}
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
};
export default AddLineModal;
