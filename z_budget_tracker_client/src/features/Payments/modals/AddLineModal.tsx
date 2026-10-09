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
import { formatNumber } from '../../../app/util';
import useAvailableAccountBalances from '../../../api/hooks/payments/useAvailableAccountBalances';

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
  const [payeeUpdated, setPayeeUpdated] = useState(false);
  let availableAmount = 0;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    getValues,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(PaymentFormSchema) as Resolver<FormValues>,
    defaultValues: {
      initiativeId: 0,
      grantId: 0,
      categoryId: payee ? payee.categoryId : 0,
      accountId: 0,
      amount: '0.00',
      remainingAmount: 0,
    },
  });

  const { data: availableAccountBalances, isSuccess: bSuccess } =
    useAvailableAccountBalances(
      selections?.initiativeId ?? 0,
      selections?.grantId ?? 0,
      selections?.categoryId ?? 0,
    );

  if (
    selections?.initiativeId &&
    selections?.grantId &&
    selections?.categoryId &&
    selections?.accountId &&
    bSuccess &&
    availableAccountBalances?.some((x) => x.accountId === selections.accountId)
  ) {
    availableAmount = availableAccountBalances?.filter(
      (x) => x.accountId === selections.accountId,
    )[0].availableAmount;
  }

  // const payeeIdWatchValue = watch('payeeId') as number;
  const categoryIdWatchValue = watch('categoryId') as number;

  const [accounts, setAccounts] = useState(
    catSuccess && categories
      ? categories.filter((x) => x.id === +categoryIdWatchValue)[0]?.accounts
      : [],
  );

  // const [zero, setZero] = useState(false);
  const [remIsvalid, setRemIsValid] = useState(true);

  useEffect(() => {
    if (payee) {
      if (payee.categoryId !== +getValues('categoryId')) {
        setValue('accountId', 0);
      }

      if (payeeUpdated) {
        setValue('accountId', payee.accountId);
      }
    }

    return () => {
      setPayeeUpdated(false);
    };
  }, [
    categories,
    categoryIdWatchValue,
    getValues,
    payee,
    payeeUpdated,
    setValue,
  ]);

  function handlePayeeSelected(payee: Payee) {
    setPayee(payee);
    setValue('payeeId', payee.id);
    setValue('categoryId', payee.categoryId);
    setPayeeUpdated(true);
    if (categories) {
      const accounts = categories.filter((x) => x.id === payee.categoryId)[0]
        .accounts!;
      setAccounts(accounts);
    }

    setSelections((prev) => ({
      ...prev,
      categoryId: payee.categoryId,
      accountId: payee.accountId,
    }));
  }

  async function onSubmit(data: FormValues) {
    console.log(data);

    const newLine: PaymentLineItem = {
      rowId: -1,
      uuid: crypto.randomUUID(),
      accountId: data.accountId,
      categoryId: data.categoryId,
      initiativeId: data.initiativeId,
      grantId: data.grantId,
      accountName: '',
      initiativeName: '',
      categoryName: '',
      grantName: '',
      availableAmount: availableAmount,
      paymentAmount: getValues('amount'),
      newAvailableAmount: availableAmount - +getValues('amount'),
    };

    props.onLineAdded(newLine, {
      initiativeId: newLine.initiativeId,
      grantId: newLine.grantId,
      categoryId: selections!.categoryId!,
    });
  }

  function handlePayeeSelectionCleared() {
    setValue('payeeId', 0);
    setPayee(null);
  }

  function handleInputEntryOnBlur() {
    const formatted = formatNumber(+getValues('amount'));
    setValue('amount', formatted);
  }

  function handleLessThanZero(n: number) {
    setRemIsValid(false);
    setValue('remainingAmount', n);
  }

  function handleAmountOk(n: number) {
    setRemIsValid(true);
    setValue('remainingAmount', n);
  }

  function allSelections() {
    return (
      selections?.initiativeId &&
      selections.grantId &&
      selections.categoryId &&
      selections.accountId
    );
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
          onKeyDown={checkKeyDown}
          className="self-center h-full w-full"
        >
          <div className="flex flex-col justify-between h-full mt-4">
            {/* <pre>{JSON.stringify(selections)}</pre> */}
            {/* remainingAmount: {r} */}
            {errors?.remainingAmount?.message}
            <br></br>
            {/* amount: {getValues('amount')} */}
            {/* payeeId: {getValues('payeeId')}
            <br></br>
            initiativeId: {getValues('initiativeId')}
            <br></br>
            grantId: {getValues('grantId')}
            <br></br>
            categoryId:{getValues('categoryId')}
            <br></br>
            accountId: {getValues('accountId')}
            <br></br>
            amount: {getValues('amount')} */}
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
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      register('categoryId').onChange(e);
                      if (+e.target.value !== 0) {
                        setSelections((prev) => ({
                          ...prev,
                          categoryId: +e.target.value,
                        }));
                        setValue('accountId', 0);
                        if (categories) {
                          const accounts = categories.filter(
                            (x) => x.id === +e.target.value,
                          )[0].accounts!;
                          setAccounts(accounts);
                        }
                      }
                    }}
                  >
                    <option value={0} className="text-neutral-600">
                      Select...
                    </option>
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
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      setPayeeUpdated(false);
                      setSelections((prev) => ({
                        ...prev,
                        accountId: +e.target.value,
                      }));
                      register('accountId').onChange(e);
                    }}
                  >
                    <option value={0} className="text-neutral-600">
                      Select...
                    </option>
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

                  <Select
                    {...register('initiativeId')}
                    tabIndex={3}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      register('initiativeId').onChange(e);
                      // if (+e.target.value !== 0) {
                      setSelections((prev) => ({
                        ...prev,
                        initiativeId: +e.target.value,
                      }));
                      // }
                    }}
                  >
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

                <div className="grid grid-cols-[.35fr_1fr_.1fr] w-full items-center mb-5 ">
                  <div className="text-neutral-600/90 font-medium">Grant</div>
                  <Select
                    {...register('grantId')}
                    tabIndex={5}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      register('grantId').onChange(e);

                      // if (+e.target.value !== 0) {
                      setSelections((prev) => ({
                        ...prev,
                        grantId: +e.target.value,
                      }));
                      // }
                    }}
                  >
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

                <div className="grid grid-cols-[.35fr_1fr_.1fr]  w-full items-center mb-10">
                  <div className="text-neutral-600/90 font-medium self-start">
                    Comment
                  </div>
                  <textarea
                    {...register('comment')}
                    className="p-1 border border-neutral-300 rounded-sm"
                    rows={3}
                  ></textarea>
                </div>
                <PaymentEntryInput
                  getValues={getValues}
                  error={errors?.amount}
                  register={register('amount')}
                  available={availableAmount}
                  onBlur={handleInputEntryOnBlur}
                  onLessThanZero={handleLessThanZero}
                  onOK={handleAmountOk}
                ></PaymentEntryInput>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-t-neutral-200 p-2 py-2 ">
              <Button type="submit" disabled={!allSelections() || !remIsvalid}>
                Add Payment
              </Button>
              <Button
                variation="secondary"
                onClick={() => {
                  props.onCancel();

                  setAnimateOut(true);
                  setTimeout(() => {
                    setSelections(null);
                    setAnimateOut(false);
                    setPayee(null);
                    reset();
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

const checkKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
  const target = e.target as HTMLElement;
  if (e.key === 'Enter' && target.tagName === 'INPUT') {
    e.preventDefault();
  }
};
// const { data: balances } = useAvailableAccountBalances(
//   selections?.initiativeId,
//   selections?.grantId,
//   selections?.categoryId,
// );
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
