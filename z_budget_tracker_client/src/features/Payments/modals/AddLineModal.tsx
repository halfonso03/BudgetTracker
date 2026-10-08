import { useState, type ChangeEvent } from 'react';
import useCategories from '../../../api/hooks/common/useCategories';
import useGrants from '../../../api/hooks/common/useGrants';
import useInitiatives from '../../../api/hooks/common/useInitiatives';
import { formatCurrency } from '../../../app/util';
import Button from '../../../components/Button';
import Select from '../../../components/Select';
import useAvailableAccountBalances from '../../../api/hooks/payments/useAvailableAccountBalances';
import PayeeSearcher from '../PayeeSearcher';
import TallModal from '../../../components/TallModal';
import Input from '../../../components/Input';
import { Asterisk } from 'lucide-react';
import { usePayeePayments } from '../../../api/hooks/payees/usePayeePayments';
import { PaginationContextProvider } from '../../../contexts/pagination/PaginationContextProvider';

type Selections = {
  initiativeId?: number;
  grantId?: number;
  categoryId?: number;
  accountId?: number;
  payeeId?: number;
};

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  selections?: Selections;
  year: number;
  onLineAdded: (
    balance: PaymentLineItem,
    key: { initiativeId: number; grantId: number; categoryId: number },
  ) => void;
};

const AddLineModal = ({ ...props }: Props) => {
  const [selections, setSelections] = useState<Selections | null>(null);
  const [animateOut, setAnimateOut] = useState(false);
  const [payee, setPayee] = useState<Payee | null>(null);
  const { grants } = useGrants(props.year, props.isOpen);
  const { initiatives } = useInitiatives(props.isOpen);
  const { categories, catSuccess } = useCategories(props.isOpen);

  const [accounts, setAccounts] = useState<Account[]>([]);

  if (
    accounts.length === 0 &&
    catSuccess &&
    categories?.length &&
    categories[0].accounts
  ) {
    setAccounts(
      categories[0].accounts.map((a) => ({
        id: a.id,
        name: a.name,
        number: '',
        category_id: 0,
      })),
    );
  }

  const { data: balances } = useAvailableAccountBalances(
    selections?.initiativeId,
    selections?.grantId,
    selections?.categoryId,
  );

  function onLineAdded(account: PaymentAvailableAccountBalance) {
    setSelections(null);
    setAnimateOut(true);
    setTimeout(() => {
      setAnimateOut(false);
    }, 500);

    if (initiatives && grants && categories && balances) {
      const { availableAmount } = balances.filter(
        (x) =>
          x.initiativeId === account.initiativeId &&
          x.grantId === account.grantId &&
          x.accountId === account.accountId,
      )[0];

      const newLine: PaymentLineItem = {
        rowId: -1,
        uuid: window.crypto.randomUUID(),
        accountId: account.accountId,
        accountName: account.accountName,
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
        payeeId: 0,
        payeeName: '',
        availableAmount: availableAmount,
        paymentAmount: 0,
        newAvailableAmount: availableAmount,
        comment: '',
      };

      props.onLineAdded(newLine, {
        initiativeId: newLine.initiativeId,
        grantId: newLine.grantId,
        categoryId: selections!.categoryId!,
      });
    }
  }

  function handlePayeeSelected(payee: Payee) {
    setPayee(payee);
    setSelections((prev) => ({
      ...prev,
      categoryId: payee.categoryId,
      accountId: payee.accountId,
    }));

    if (categories && categories.length) {
      const a = categories.filter((x) => x.id === payee.categoryId)[0].accounts;
      const a2: Account[] | undefined = a?.map((x) => ({
        id: x.id,
        name: x.name,
        number: x.number,
        category_id: x.category_id,
      }));
      if (a2) setAccounts(a2);
    }
  }

  return (
    <PaginationContextProvider>
      <TallModal
        size="lg"
        title="Add a Payment"
        animateOut={animateOut}
        {...props}
      >
        <div className="flex flex-col justify-between h-full">
          <div>
            <div className="relative flex gap-2 items-center mb-2   ">
              <div className="grid grid-cols-[.25fr_1fr_.5fr] items-center w-full">
                <div className="text-neutral-600/90 font-medium">Payee</div>
                <PayeeSearcher
                  onPayeeSelected={handlePayeeSelected}
                ></PayeeSearcher>
                <div></div>
              </div>
            </div>

            <div className="grid grid-cols-[.25fr_1fr_.5fr] w-full mt-10 items-center  mb-5">
              <div className="text-neutral-600/90 font-medium">Category</div>
              <Select
                additionalclasses={`${selections?.categoryId !== undefined ? 'text-neutral-900' : 'text-neutral-500'}`}
                value={selections?.categoryId}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  if (+e.target.value !== 0) {
                    setSelections((prev) => ({
                      ...prev,
                      categoryId: +e.target.value,
                    }));

                    if (categories) {
                      setAccounts(
                        categories
                          .filter((x) => x.id === +e.target.value)[0]
                          .accounts!.map((a) => ({
                            id: a.id,
                            name: a.name,
                            number: '',
                            category_id: 0,
                          })),
                      );
                    }
                  }
                }}
              >
                {categories?.map((i) => (
                  <option value={i.id} key={i.id} className="text-neutral-900">
                    {i.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid grid-cols-[.25fr_1fr_.5fr]  w-full items-center mb-5">
              <div className="text-neutral-600/90 font-medium">Account</div>
              <Select
                additionalclasses={`${selections?.accountId !== undefined ? 'text-neutral-900' : 'text-neutral-500'}`}
                value={selections?.accountId}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  if (+e.target.value !== 0) {
                    setSelections((prev) => ({
                      ...prev,
                      accountId: +e.target.value,
                    }));
                  }
                }}
              >
                {accounts?.map((i) => (
                  <option value={i.id} key={i.id} className="text-neutral-900">
                    {i.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="grid grid-cols-[.25fr_1fr_.5fr]  w-full items-center mb-5">
              <div className="text-neutral-600/90 font-medium">Initiative</div>
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

            <div className="grid grid-cols-[.25fr_1fr_.5fr]  w-full items-center mb-10">
              <div className="text-neutral-600/90 font-medium">Grant</div>
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

            <div className="grid grid-cols-[.40fr_.85fr_.5fr]  w-full items-center mb-5">
              <div className="text-neutral-600/90 font-medium">Available</div>
              <div className="font-semibold pl-1">
                {formatCurrency(10998.09)}
              </div>
            </div>

            <div className="grid grid-cols-[.40fr_.85fr_.5fr]  w-full items-center mb-5">
              <div className="text-neutral-600/90 font-medium">
                <div className="flex items-baseline gap-2">
                  Payment Amount
                  <Asterisk className="text-red-500" size={14}></Asterisk>
                </div>
              </div>
              <Input></Input>
            </div>

            <div className="grid grid-cols-[.40fr_.85fr_.5fr] w-full items-center mb-5">
              <div className="text-neutral-600/90 font-medium">Remaining</div>

              <div className="font-semibold pl-1">
                {formatCurrency(10998.09)}
              </div>
            </div>

            <div>
              {/* <div className="grid grid-cols-[.7fr_1fr] mb-4 gap-4">

        <div>
          {balances && (
            <div className="flex justify-between py-2 px-2 pt-0 ">
              <div className="flex-10 entity-label">Accounts</div>
              <div className="flex-9 ">
                <div className=" entity-label text-end">Avaliable Amount</div>
              </div>
            </div>
          )}

          {balances &&
            balances.map((b) => (
              <div
                className="rounded-sm py-2 px-2 flex justify-between mb-1 cursor-pointer hover:bg-neutral-100 transition-all duration-300"
                key={b.accountId}
                onClick={() => {
                  onLineAdded(b);
                  props.onCancel();
                  // setTimeout(, 2000)
                }}
              >
                <div className="flex-10 text-neutral-700">{b.accountName}</div>
                <div className="flex-9 ">
                  <div className="text-neutral-900  text-end ">
                    {formatCurrency(b.availableAmount)}
                  </div>
                </div>
              </div>
            ))}

          {balances && (
            <div className="flex justify-between py-2 px-2">
              <div className="flex-10 entity-label">
                {selections &&
                  categories?.some((c) => c.id == selections?.categoryId) &&
                  categories?.filter((c) => c.id == selections?.categoryId)[0]
                    .name}
                &nbsp;Total
              </div>
              <div className="flex-9">
                <div className="font-semibold text-neutral-800 text-end">
                  {balances &&
                    formatCurrency(
                      balances
                        .map((b) => b.availableAmount)
                        ?.reduce((acc, cur) => acc + cur, 0),
                    )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div> */}
            </div>
          </div>

          <div className="flex justify-end">
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
        </div>
      </TallModal>
    </PaginationContextProvider>
  );
};
export default AddLineModal;
