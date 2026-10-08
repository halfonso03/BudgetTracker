import { useEffect, useState, type ChangeEvent } from 'react';
import useCategories from '../../../api/hooks/common/useCategories';
import useGrants from '../../../api/hooks/common/useGrants';
import useInitiatives from '../../../api/hooks/common/useInitiatives';
import Button from '../../../components/Button';
import Select from '../../../components/Select';
import PayeeSearcher from '../PayeeSearcher';
import TallModal from '../../../components/TallModal';
import { PaginationContextProvider } from '../../../contexts/pagination/PaginationContextProvider';
import PaymentEntryInput from '../PaymentEntryInput';
import { useForm, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PaymentFormSchema } from '../../../form_schemas/PaymentFormSchema';
import * as Yup from 'yup';
import { Asterisk } from 'lucide-react';
import useAvailableAccountBalances from '../../../api/hooks/payments/useAvailableAccountBalances';

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

type FormValues = Yup.InferType<typeof PaymentFormSchema>;

const AddLineModal = ({ ...props }: Props) => {
  const [selections, setSelections] = useState<Selections | null>(null);
  const [animateOut, setAnimateOut] = useState(false);
  const [payee, setPayee] = useState<Payee | null>(null);
  const { grants } = useGrants(props.year, props.isOpen);
  const { initiatives } = useInitiatives(props.isOpen);
  const { categories, catSuccess } = useCategories(props.isOpen);

  const [accounts, setAccounts] = useState<Account[]>([]);
  const {
    register, // Function to register input fields and connect them to validation
    handleSubmit, // Function that wraps your submit handler to handle validation
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(PaymentFormSchema) as Resolver<FormValues>,
    defaultValues: {
      initiativeId: 0,
      grantId: 0,
      categoryId: 0,
      accountId: 0,
      amount: 0,
    },
  });

  if (
    accounts.length === 0 &&
    catSuccess &&
    categories?.length &&
    categories[0].accounts
  ) {
    const accounts = categories[0].accounts.map((a) => ({
      id: a.id,
      name: a.name,
      number: '',
      category_id: 0,
    }));
    setAccounts(accounts);
  }
  const { data } = useAvailableAccountBalances(
    getValues('initiativeId'),
    getValues('grantId'),
    getValues('categoryId'),
  );

  console.log(getValues('grantId'))
  useEffect(() => {
    if (accounts && accounts.length) {
      if (payee && accounts.some((x) => x.id === payee.accountId)) {
        setValue(
          'accountId',
          accounts.filter((x) => x.id === payee.accountId)[0].id,
        );
      }
    }
  }, [accounts, payee, setValue]);

  // const { data: balances } = useAvailableAccountBalances(
  //   selections?.initiativeId,
  //   selections?.grantId,
  //   selections?.categoryId,
  // );

  console.log('balances', data);
  // function onLineAdded(account: PaymentAvailableAccountBalance) {
  //   setSelections(null);
  //   setAnimateOut(true);
  //   setTimeout(() => {
  //     setAnimateOut(false);
  //   }, 500);

  //   if (initiatives && grants && categories && balances) {
  //     const { availableAmount } = balances.filter(
  //       (x) =>
  //         x.initiativeId === account.initiativeId &&
  //         x.grantId === account.grantId &&
  //         x.accountId === account.accountId,
  //     )[0];

  //     const newLine: PaymentLineItem = {
  //       rowId: -1,
  //       uuid: window.crypto.randomUUID(),
  //       accountId: account.accountId,
  //       accountName: account.accountName,
  //       categoryId: selections!.categoryId!,
  //       categoryName: categories.filter(
  //         (x) => x.id == selections?.categoryId,
  //       )[0].name,
  //       initiativeId: selections!.initiativeId!,
  //       initiativeName: initiatives.filter(
  //         (x) => x.id == selections?.initiativeId,
  //       )[0].name,
  //       grantId: selections!.grantId!,
  //       grantName: grants.filter((x) => x.id == selections?.grantId)[0].name,
  //       payeeId: 0,
  //       payeeName: '',
  //       availableAmount: availableAmount,
  //       paymentAmount: 0,
  //       newAvailableAmount: availableAmount,
  //       comment: '',
  //     };

  //     props.onLineAdded(newLine, {
  //       initiativeId: newLine.initiativeId,
  //       grantId: newLine.grantId,
  //       categoryId: selections!.categoryId!,
  //     });
  //   }
  // }

  function handlePayeeSelected(payee: Payee) {
    setPayee(payee);
    setValue('payeeId', payee.id);
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
      if (a2) {
        setAccounts(a2);
        // setValue('accountId', payee.accountId);
      }
    }
  }

  async function onSubmit(data: FormValues) {
    console.log('onSubmit', data);
  }

  function handlePayeeSelectionCleared() {
    setValue('payeeId', 0);
    setPayee(null);
  }

  return (
    <PaginationContextProvider>
      <TallModal
        size="lg"
        title="Add a Payment"
        animateOut={animateOut}
        {...props}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="self-center h-full w-full"
        >
          <div className="flex flex-col justify-between h-full mt-4">
            {/* {errors?.payeeId?.message && '1'}
            {errors?.categoryId?.message && '2'}
            {errors?.accountId?.message && '3'}
            {errors?.initiativeId?.message && '4'}
            {errors?.grantId?.message}
            {errors?.amount?.message} */}
            <div className="flex flex-col justify-between p-3 px-4 ">
              <div>
                <div className="relative flex items-center mb-5">
                  <div className="grid grid-cols-[.35fr_1fr_.1fr] w-full">
                    <div className="text-neutral-600/90 font-medium">Payee</div>

                    <PayeeSearcher
                      onPayeeSelected={handlePayeeSelected}
                      onPayeeSelectionCleared={handlePayeeSelectionCleared}
                    ></PayeeSearcher>
                    <div className="self-center">
                      {errors.payeeId && (
                        <div className="text-red-500 pl-1">
                          <Asterisk size={18}></Asterisk>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-[.35fr_1fr_.1fr] w-full items-center  mb-5">
                  <div className="text-neutral-600/90 font-medium">
                    Category
                  </div>
                  <Select
                    {...register('categoryId')}
                    tabIndex={1}
                    additionalclasses={`${selections?.categoryId !== undefined ? 'text-neutral-900' : 'text-neutral-500'}`}
                    value={selections?.categoryId}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      if (+e.target.value !== 0) {
                        setSelections((prev) => ({
                          ...prev,
                          categoryId: +e.target.value,
                        }));

                        if (categories) {
                          const accounts = categories
                            .filter((x) => x.id === +e.target.value)[0]
                            .accounts!.map((a) => ({
                              id: a.id,
                              name: a.name,
                              number: '',
                              category_id: 0,
                            }));
                          setAccounts(accounts);
                          setValue('accountId', accounts[0].id);
                        }
                      }
                    }}
                  >
                    {categories?.map((i) => (
                      <option
                        value={i.id}
                        key={i.id}
                        className="text-neutral-900"
                      >
                        {i.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="grid grid-cols-[.35fr_1fr_.1fr]  w-full items-center mb-5">
                  <div className="text-neutral-600/90 font-medium">Account</div>
                  <Select
                    {...register('accountId')}
                    tabIndex={2}
                    additionalclasses={`${selections?.accountId !== undefined ? 'text-neutral-900' : 'text-neutral-500'}`}
                    // value={selections?.accountId}
                    // onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    //   if (+e.target.value !== 0) {
                    //     setSelections((prev) => ({
                    //       ...prev,
                    //       accountId: +e.target.value,
                    //     }));
                    //   }
                    // }}
                  >
                    {accounts?.map((i) => (
                      <option
                        value={i.id}
                        key={i.id}
                        className="text-neutral-900"
                      >
                        {i.name}
                      </option>
                    ))}
                  </Select>
                  {errors?.accountId && (
                    <div className="text-red-500 pl-1">
                      <Asterisk size={18}></Asterisk>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-[.35fr_1fr_.1fr]  w-full items-center mb-5">
                  <div className="text-neutral-600/90 font-medium">
                    Initiative
                  </div>

                  <Select {...register('initiativeId')} tabIndex={3}>
                    <option value={0} className="text-neutral-600">
                      Select...
                    </option>
                    {initiatives?.map((i) => (
                      <option
                        value={i.id}
                        key={i.id}
                        className="text-neutral-900"
                      >
                        {i.name}
                      </option>
                    ))}
                  </Select>
                  {errors?.initiativeId && (
                    <div className="text-red-500 pl-1">
                      <Asterisk size={18}></Asterisk>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-[.35fr_1fr_.1fr] w-full items-center mb-10">
                  <div className="text-neutral-600/90 font-medium">Grant</div>
                  <Select {...register('grantId')} tabIndex={5}>
                    <option value={0} className="text-neutral-600">
                      Select...
                    </option>
                    {grants?.map((i) => (
                      <option
                        value={i.id}
                        key={i.id}
                        className="text-neutral-900"
                      >
                        {i.name}
                      </option>
                    ))}
                  </Select>
                  {errors?.grantId && (
                    <div className="text-red-500 pl-1">
                      <Asterisk size={18}></Asterisk>
                    </div>
                  )}
                </div>
                <PaymentEntryInput
                  error={errors?.amount}
                  register={register('amount')}
                  available={0}
                ></PaymentEntryInput>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-t-neutral-200 p-2 py-2 ">
              <Button type="submit">Add Payment</Button>
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
        </form>
      </TallModal>
    </PaginationContextProvider>
  );
};
export default AddLineModal;
