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
import { formatNumber, parseFormattedNumber } from '../../../app/util';
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
  const [remIsvalid, setRemIsValid] = useState(true);

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
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const categoryIdWatchValue = watch('categoryId') as number;

  const [accounts, setAccounts] = useState(
    catSuccess && categories
      ? categories.filter((x) => x.id === +categoryIdWatchValue)[0]?.accounts
      : [],
  );

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
      if (payeeUpdated === true) setPayeeUpdated(false);
    };
  }, [getValues, payee, payeeUpdated, setValue]);

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
    closeModal();

    const newLine: PaymentLineItem = {
      rowId: -1,
      uuid: crypto.randomUUID(),
      accountName:
        categories!
          .filter((x) => x.id === data.categoryId)[0]
          .accounts?.filter((y) => y.id === data.accountId)[0].name ?? '',
      initiativeName:
        initiatives?.filter((x) => x.id === data.initiativeId)[0].name ?? '',
      categoryName:
        categories?.filter((x) => x.id == data.categoryId)[0].name ?? '',
      grantName: grants?.filter((x) => x.id === data.grantId)[0].name ?? '',
      payeeName: payee!.name,
      availableAmount: availableAmount,
      paymentAmount: getValues('amount'),
      newAvailableAmount: availableAmount - +getValues('amount'),
      comment: data.comment,
      ...data,
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

  function handleLessThanZero() {
    setRemIsValid(false);
  }

  function handleAmountOk() {
    setRemIsValid(true);
  }

  function allSelections() {
    return (
      selections?.initiativeId &&
      selections.grantId &&
      selections.categoryId &&
      selections.accountId
    );
  }

  function closeModal() {
    props.onCancel();
    setAnimateOut(true);
    setTimeout(() => {
      setSelections(null);
      setAnimateOut(false);
      setPayee(null);
      reset();
    }, 500);
  }

  function getAvailable(i: number, g: number, c: number, a: number) {
    const t = availableAccountBalances?.filter(
      (x) =>
        x.initiativeId == i &&
        x.grantId == g &&
        x.categoryId == c &&
        x.accountId == a,
    );
    const t2 = t!;
    return t2[0].availableAmount;
  }
  return (
    <PaginationContextProvider>
      <TallModal
        size="lg"
        title="Add a Payment"
        animateOut={animateOut}
        {...props}
        onCancel={closeModal}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={checkKeyDown}
          className="self-center h-full w-full"
        >
          <div className="flex flex-col justify-between h-full mt-4">
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

                      const newSelections = {
                        ...selections,
                        accountId: +e.target.value,
                      };

                      if (!remIsvalid) {
                        const availableAmount2 = getAvailable(
                          newSelections.initiativeId!,
                          newSelections.grantId!,
                          newSelections.categoryId!,
                          newSelections.accountId!,
                        );

                        if (availableAmount2 - +getValues('amount') >= 0) {
                          setRemIsValid(true);
                        }
                      }

                      setSelections(newSelections);

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

                      const newSelections = {
                        ...selections,
                        initiativeId: +e.target.value,
                      };

                      if (!remIsvalid) {
                        const availableAmount2 = getAvailable(
                          newSelections.initiativeId!,
                          newSelections.grantId!,
                          newSelections.categoryId!,
                          newSelections.accountId!,
                        );

                        if (availableAmount2 - +getValues('amount') >= 0) {
                          setRemIsValid(true);
                        }
                      }

                      setSelections(newSelections);
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

                      const newSelections = {
                        ...selections,
                        grantId: +e.target.value,
                      };

                      if (!remIsvalid) {
                        const availableAmount2 = getAvailable(
                          newSelections.initiativeId!,
                          newSelections.grantId!,
                          newSelections.categoryId!,
                          newSelections.accountId!,
                        );

                        if (availableAmount2 - +getValues('amount') >= 0) {
                          setRemIsValid(true);
                        }
                      }

                      setSelections(newSelections);
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
                    className="p-2 border border-neutral-300 rounded-sm"
                    rows={2}
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
            <div className="flex justify-end gap-2 border-t border-t-neutral-200 p-4">
              {/* {allSelections() && <span>have all selections</span>}
              <br></br>
              {remIsvalid ? (
                <span>remaingamount is valid</span>
              ) : (
                <span>rem amount NOT valid</span>
              )}
              <br></br>
              {availableAmount - parseFormattedNumber(getValues('amount')) <
              0 ? (
                <span>too mch requested</span>
              ) : (
                <span>ok amount requested</span>
              )} */}
              <Button
                type="submit"
                disabled={
                  !allSelections() ||
                  !remIsvalid ||
                  availableAmount - parseFormattedNumber(getValues('amount')) <
                    0
                }
              >
                Add Payment
              </Button>
              <Button variation="secondary" onClick={closeModal}>
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
