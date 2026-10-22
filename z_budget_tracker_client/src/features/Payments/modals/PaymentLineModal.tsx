import { useState } from 'react';
import useCategories from '../../../api/hooks/common/useCategories';
import useGrants from '../../../api/hooks/common/useGrants';
import useInitiatives from '../../../api/hooks/common/useInitiatives';
import Button from '../../../components/Button';
import PayeeSearcher from '../PayeeSearcher';
import TallModal from '../../../components/TallModal';
import { PaginationContextProvider } from '../../../contexts/pagination/PaginationContextProvider';
import PaymentEntryInput from '../PaymentEntryInput';
import { useForm, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PaymentFormSchema } from '../../../form_schemas/PaymentFormSchema';
import * as Yup from 'yup';
import { Asterisk, X } from 'lucide-react';
import {
  formatCurrency,
  formatNumber,
  parseFormattedNumber,
} from '../../../app/util';
import useRemainingAccountBalances from '../../../api/hooks/payments/useRemainingAccountBalances';
import useSelectedPayeeInfo from '../../../api/hooks/payments/useSelectedPayeeInfo';
import Dropdown, { type Option } from 'react-dropdown';
import { useEscapeKey } from '../../../hooks/useEscapeKey';

type PaymentLineItemSelections = {
  initiativeId?: number;
  grantId?: number;
  categoryId?: number;
  accountId?: number;
  payeeId?: number;
  amount?: number;
  comment?: string;
};

type Props = {
  year: number;
  selections: PaymentLineItemSelections | null;
  uuid: string | null;
  onLineAdded: (lineItem: PaymentLineItem) => void;
  onLineUpdated: (lineItem: PaymentLineItem) => void;
  onCancel: () => void;
  fromRedirect: boolean;
};

type FormValues = Yup.InferType<typeof PaymentFormSchema>;

const PaymentLineModal = (props: Props) => {
  useEscapeKey(closeModal);

  const [animateOut, setAnimateOut] = useState(false);
  const [payee, setPayee] = useState<Payee | null>(null);
  const [remIsvalid, setRemIsValid] = useState(true);
  const [paymentYear] = useState(() => props.year);
  const [fromRedirect] = useState(() => props.fromRedirect);
  const [redirectMessageIsOpen, setRedirectMessagIsOpen] =
    useState(fromRedirect);
  const { grants, grantsSuccess } = useGrants(paymentYear);
  const { initiatives, iSuccess: loadInitiativesSuccess } = useInitiatives();
  const { categories, catSuccess } = useCategories();

  const [selections, setSelections] =
    useState<PaymentLineItemSelections | null>(props.selections);

  const { data: selectedEditPayee } = useSelectedPayeeInfo(selections?.payeeId);

  // const { data: balances, loadingBalances } = useCurrentAccountBalances(
  //   selections?.initiativeId,
  //   selections?.grantId,
  //   selections?.categoryId,
  // );

  let availableAmount = 0;

  // usePayeePayments(payee?.id ?? 0);

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
      initiativeId: props.selections ? props.selections.initiativeId : 0,
      grantId: props.selections ? props.selections.grantId : 0,
      categoryId: props.selections ? props.selections.categoryId : 0,
      accountId: props.selections ? props.selections.accountId : 0,
      payeeId: props.selections ? props.selections.payeeId : 0,
      paymentAmount: props?.selections?.amount
        ? formatNumber(props.selections.amount)
        : '0.00',
      comment: props.selections ? props.selections.comment : '',
    },
  });

  // const categoryIdWatchValue = watch('categoryId') as number;

  const {
    data: remainingAccountBalances,
    isLoading: loadingRemainingAccountBalances,
  } = useRemainingAccountBalances(
    selections?.initiativeId ?? 0,
    selections?.grantId ?? 0,
    selections?.categoryId ?? 0,
  );

  if (
    remainingAccountBalances?.some((x) => x.accountId === selections?.accountId)
  ) {
    availableAmount =
      remainingAccountBalances?.filter(
        (x) => x.accountId === selections?.accountId,
      )[0].availableAmount ?? 0;
  }

  // eslint-disable-next-line react-hooks/incompatible-library
  watch('accountId');

  function handlePayeeCreated(payee: Payee) {
    handlePayeeSelected(payee);
  }

  function handlePayeeSelected(payee: Payee) {
    const options = {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    };
    setPayee(payee);
    setValue('payeeId', payee.id, options);

    if (+getValues('categoryId') === 0) {
      setValue('categoryId', payee.categoryId, options);

      setSelections((prev) => ({
        ...prev,
        categoryId: payee.categoryId,
        accountId: payee.accountId,
        payeeId: payee.id,
      }));
      setTimeout(() => {
        setValue('accountId', payee.accountId, options);
      }, 0);
    }
    setSelections((prev) => ({ ...prev, payeeId: payee.id }));
  }

  async function onSubmit(data: FormValues) {
    closeModal();
    if (!props.uuid || fromRedirect) {
      const newLine: PaymentLineItem = {
        ...data,
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
        paymentAmount: parseFormattedNumber(
          getValues('paymentAmount').toString(),
        ),
        newAvailableAmount:
          availableAmount - parseFormattedNumber(getValues('paymentAmount')),
        comment: data.comment,
      };

      props.onLineAdded(newLine);
    } else {
      const newLine: PaymentLineItem = {
        ...data,
        rowId: -1,
        uuid: props.uuid,
        accountName:
          categories!
            .filter((x) => x.id === data.categoryId)[0]
            .accounts?.filter((y) => y.id === data.accountId)[0].name ?? '',
        initiativeName:
          initiatives?.filter((x) => x.id === data.initiativeId)[0].name ?? '',
        categoryName:
          categories?.filter((x) => x.id == data.categoryId)[0].name ?? '',
        grantName: grants?.filter((x) => x.id === data.grantId)[0].name ?? '',
        payeeName: selectedEditPayee!.name,
        availableAmount: availableAmount,
        paymentAmount: parseFormattedNumber(
          getValues('paymentAmount').toString(),
        ),
        newAvailableAmount: availableAmount - +getValues('paymentAmount'),
        comment: data.comment,
      };
      props.onLineUpdated(newLine);
    }
  }

  function handlePayeeSelectionCleared() {
    setValue('payeeId', 0);
    setPayee(null);
    setSelections((prev) => ({ ...prev, payeeId: 0 }));
  }

  function handleInputEntryOnBlur() {
    if (isNaN(+getValues('paymentAmount'))) {
      setValue('paymentAmount', '0.00');
    } else {
      const formatted = formatNumber(+getValues('paymentAmount'));
      setValue('paymentAmount', formatted);
    }
  }

  function handleLessThanZero() {
    setRemIsValid(false);
  }

  function handleAmountOk() {
    setRemIsValid(true);
  }

  // function allSelections() {
  //   return (
  //     selections?.initiativeId &&
  //     selections.grantId &&
  //     selections.categoryId &&
  //     selections.accountId
  //   );
  // }

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
    const t = remainingAccountBalances?.filter(
      (x) =>
        x.initiativeId == i &&
        x.grantId == g &&
        x.categoryId == c &&
        x.accountId == a,
    );
    const t2 = t!;
    return t2[0].availableAmount;
  }

  const initiativesForDropdown = loadInitiativesSuccess
    ? initiatives!.map((b) => ({
        value: b.id,
        label: <div>{b.name}</div>,
      }))
    : [];

  const grantsForDropdown = grantsSuccess
    ? grants!.map((b) => ({
        value: b.id,
        label: <div>{b.name}</div>,
      }))
    : [];

  const catsForDropdown = catSuccess
    ? categories!.map((b) => ({
        value: b.id,
        label: <div>{b.name}</div>,
      }))
    : [];

  const accountsForDropdown =
    !loadingRemainingAccountBalances && remainingAccountBalances
      ? remainingAccountBalances!.map((b) => ({
          value: b.accountId,
          label: (
            <div className="flex justify-between gap-2">
              <div>{b.accountName}</div>
              <div>{formatCurrency(b.availableAmount)}</div>
            </div>
          ),
        }))
      : [];

  return (
    <PaginationContextProvider>
      <TallModal
        {...props}
        size="lg"
        title="Create Payment"
        animateOut={animateOut}
        isOpen={true}
        onCancel={closeModal}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={checkKeyDown}
          className="self-center h-full w-full"
        >
          {/* {props.fromRedirect && <div className="p-3">Redirectir</div>} */}

          {/* payee id: {getValues('payeeId')} */}
          {/* <br></br>
          initiative id: {getValues('initiativeId')}
          <br></br>
          grant id: {getValues('grantId')}
          <br></br>
          category id: {getValues('categoryId')}
          <br></br>
          account id: {getValues('accountId')}
          <br></br> */}
          {fromRedirect && redirectMessageIsOpen && (
            <div className="p-3  border border-blue-400 bg-blue-50 flex items-center relative">
              <div className="flex-1 ">
                Initiative, Grant, Category and Account have been pre-selected.
              </div>
              <div
                onClick={() => setRedirectMessagIsOpen(false)}
                className="absolute top-1 right-1 p-1  transition-all duration-200  cursor-pointer hover:bg-blue-200/70"
              >
                <X
                  size={23}
                  className=" text-blue-500 border border-transparent hover:text-blue-700
               transition-all duration-200 "
                ></X>
              </div>
            </div>
          )}

          <div className="flex flex-col justify-between h-full mt-2">
            <div className=" overflow-y-scroll h-[60dvh]">
              <div className="flex flex-col justify-between p-3 px-4 ">
                <div className="grid grid-cols-[.35fr_1fr_.1fr] gap-2 w-full ">
                  <div className="text-neutral-600/90 font-medium">Year</div>
                  <div className="text-neutral-700/90 font-medium">
                    {paymentYear}
                  </div>
                </div>
                <div className="relative flex items-center mb-3"></div>
                <div></div>

                <div className="grid grid-cols-[.35fr_1fr_.1fr]  w-full items-center mb-3">
                  <div className="text-neutral-600/90 font-medium">
                    Initiative
                  </div>

                  {/* <Select
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

                        if (
                          availableAmount2 - +getValues('paymentAmount') >=
                          0
                        ) {
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
                  </Select> */}
                  <Dropdown
                    options={initiativesForDropdown}
                    value={getValues('initiativeId')}
                    onChange={(option: Option) => {
                      setValue('initiativeId', +option.value);

                      const newSelections = {
                        ...selections,
                        initiativeId: +option.value,
                      };

                      if (!remIsvalid) {
                        const availableAmount2 = getAvailable(
                          newSelections.initiativeId!,
                          newSelections.grantId!,
                          newSelections.categoryId!,
                          newSelections.accountId!,
                        );

                        if (
                          availableAmount2 - +getValues('paymentAmount') >=
                          0
                        ) {
                          setRemIsValid(true);
                        }
                      }

                      setSelections(newSelections);
                    }}
                    className=" border p-2 border-neutral-300 py-3 rounded-sm text-neutral-800 disabled: bg-white"
                  ></Dropdown>
                  {errors?.initiativeId && (
                    <div className="text-red-500 pl-1">
                      <Asterisk size={18}></Asterisk>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-[.35fr_1fr_.1fr] w-full items-center mb-3 ">
                  <div className="text-neutral-600/90 font-medium">Grant</div>
                  <Dropdown
                    options={grantsForDropdown}
                    value={getValues('grantId')}
                    onChange={(option: Option) => {
                      setValue('grantId', +option.value);

                      const newSelections = {
                        ...selections,
                        grantId: +option.value,
                      };

                      if (!remIsvalid) {
                        const availableAmount2 = getAvailable(
                          newSelections.initiativeId!,
                          newSelections.grantId!,
                          newSelections.categoryId!,
                          newSelections.accountId!,
                        );

                        if (
                          availableAmount2 - +getValues('paymentAmount') >=
                          0
                        ) {
                          setRemIsValid(true);
                        }
                      }

                      setSelections(newSelections);
                    }}
                    className="border p-2 border-neutral-300 py-3 rounded-sm text-neutral-800 disabled: bg-white"
                  ></Dropdown>
                  {/* <Select
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

                        if (
                          availableAmount2 - +getValues('paymentAmount') >=
                          0
                        ) {
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
                  </Select> */}
                  {errors?.grantId && (
                    <div className="text-red-500 pl-1">
                      <Asterisk size={18}></Asterisk>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-[.35fr_1fr_.1fr] w-full items-center  mb-3">
                  <div className="text-neutral-600/90 font-medium">
                    Category
                  </div>
                  <Dropdown
                    options={catsForDropdown}
                    value={getValues('categoryId')}
                    onChange={(option: Option) => {
                      setValue('categoryId', +option.value);
                      if (+option.value !== 0) {
                        setSelections((prev) => ({
                          ...prev,
                          categoryId: +option.value,
                        }));
                        setValue('accountId', 0);
                      }
                    }}
                    className="border p-2 border-neutral-300 py-3 rounded-sm text-neutral-800 disabled: bg-white"
                  ></Dropdown>
                  {/* 
                  <Select
                    {...register('categoryId')}
                    tabIndex={0}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      register('categoryId').onChange(e);
                      if (+e.target.value !== 0) {
                        setSelections((prev) => ({
                          ...prev,
                          categoryId: +e.target.value,
                        }));
                        setValue('accountId', 0);
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
                  </Select> */}
                </div>
                <div className="grid grid-cols-[.35fr_1fr_.1fr]  w-full items-center mb-3">
                  <div className="text-neutral-600/90 font-medium">Account</div>
                  <Dropdown
                    options={accountsForDropdown}
                    value={getValues('accountId')}
                    onChange={(option: Option) => {
                      setValue('accountId', +option.value);
                      setSelections((prev) => ({
                        ...prev,
                        accountId: +option.value,
                      }));
                    }}
                    className="border p-2 border-neutral-300 py-3 rounded-sm text-neutral-800 disabled: bg-white"
                  ></Dropdown>

                  {/* <Select
                  {...register('accountId')}
                  tabIndex={2}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    register('accountId').onChange(e);

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

                      if (availableAmount2 - +getValues('paymentAmount') >= 0) {
                        setRemIsValid(true);
                      }
                    }

                    setSelections(newSelections);
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
                )} */}
                </div>
                <div className="grid grid-cols-[.35fr_1fr_.1fr] w-full mb-3">
                  <div className="text-neutral-600/90 font-medium">Payee</div>
                  <PayeeSearcher
                    onPayeeSelected={handlePayeeSelected}
                    onPayeeSelectionCleared={handlePayeeSelectionCleared}
                    payeeId={selections?.payeeId}
                    onPayeeCreated={handlePayeeCreated}
                  ></PayeeSearcher>
                  <div className="self-center">
                    {errors.payeeId && (
                      <div className="text-red-500 pl-1">
                        <Asterisk size={18}></Asterisk>
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-[.35fr_1fr_.1fr] w-full items-center mb-7">
                  <div className="text-neutral-600/90 font-medium self-start">
                    Comment
                  </div>
                  <textarea
                    {...register('comment')}
                    className="p-2 border border-neutral-300 rounded-sm"
                    rows={3}
                  ></textarea>
                </div>
                {/* {loadingRemainingAccountBalances && <Spinner></Spinner>} */}

                <div className="grid grid-cols-[.35fr_1fr_.1fr]">
                  <div className="col-span-2  ">
                    <PaymentEntryInput
                      getValues={getValues}
                      error={errors?.paymentAmount}
                      register={register('paymentAmount')}
                      available={availableAmount}
                      onBlur={handleInputEntryOnBlur}
                      onLessThanZero={handleLessThanZero}
                      onOK={handleAmountOk}
                    ></PaymentEntryInput>
                  </div>
                  <div></div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-t-neutral-300/90 p-4">
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

              {/* ||
                  availableAmount -
                    parseFormattedNumber(getValues('paymentAmount')) <
                    0
                    disabled={!allSelections() || !remIsvalid}
                     */}
              <Button
                type="submit"
                disabled={
                  availableAmount -
                    parseFormattedNumber(getValues('paymentAmount')) <
                  0
                }
              >
                {!fromRedirect && props.uuid ? 'Update Payment' : 'Add Payment'}
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

export default PaymentLineModal;

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
