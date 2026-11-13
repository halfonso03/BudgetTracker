import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import useCategories from '../../../api/hooks/common/useCategories';
import useGrants from '../../../api/hooks/common/useGrants';
import useInitiatives from '../../../api/hooks/common/useInitiatives';
import Button from '../../../components/Button';
import PayeeSearcher from '../PayeeSearcher';
import TallModal from '../../../components/TallModal';
import { PaginationContextProvider } from '../../../contexts/pagination/PaginationContextProvider';
import PaymentEntryInput from '../PaymentEntryInput';
import { Controller, useForm, type Resolver } from 'react-hook-form';
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
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import Input from '../../../components/Input';
import Spinner from '../../../components/Spinner';
import Label from '../../../components/Label';
import TextArea from '../../../components/TextArea';

type PaymentLineItemSelections = {
  initiativeId?: number;
  grantId?: number;
  categoryId?: number;
  accountId?: number;
  payeeId?: number;
  amount?: number;
  comment?: string;
  invoiceDate?: Date | null | undefined;
  invoiceNumber?: string | null;
  checkNumber?: string | null;
};

type Props = {
  year: number;
  paymentLineItemSelections: PaymentLineItemSelections | null;
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
    useState<PaymentLineItemSelections | null>(props.paymentLineItemSelections);

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
    control,
    watch,
    formState: { errors, isValidating, isSubmitting, isValid, dirtyFields },
  } = useForm<FormValues>({
    resolver: yupResolver(PaymentFormSchema) as Resolver<FormValues>,
    mode: 'onBlur',
    context: {
      payload: {
        payeeId: selections?.payeeId,
        priorInvoiceNumber: selections?.invoiceNumber,
      }, // Pass your external value here
    },
    defaultValues: {
      initiativeId: props.paymentLineItemSelections
        ? props.paymentLineItemSelections.initiativeId
        : 0,
      grantId: props.paymentLineItemSelections
        ? props.paymentLineItemSelections.grantId
        : 0,
      categoryId: props.paymentLineItemSelections
        ? props.paymentLineItemSelections.categoryId
        : 0,
      accountId: props.paymentLineItemSelections
        ? props.paymentLineItemSelections.accountId
        : 0,
      payeeId: props.paymentLineItemSelections
        ? props.paymentLineItemSelections.payeeId
        : 0,
      paymentAmount: props?.paymentLineItemSelections?.amount
        ? formatNumber(props.paymentLineItemSelections.amount)
        : '0.00',
      comment: props.paymentLineItemSelections
        ? props.paymentLineItemSelections.comment
        : '',
      invoiceDate: props.paymentLineItemSelections
        ? props.paymentLineItemSelections.invoiceDate
        : null,
      checkNumber: props.paymentLineItemSelections
        ? props.paymentLineItemSelections.checkNumber
        : '',
      invoiceNumber: props.paymentLineItemSelections
        ? props.paymentLineItemSelections.invoiceNumber
        : '',
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
    if (isValidating || isSubmitting) {
      if (isValid) {
        setTimeout(() => {
          raiseAddOrUpdateEvents(data);
        }, 200);
      }
    } else {
      raiseAddOrUpdateEvents(data);
    }
  }

  function raiseAddOrUpdateEvents(data: FormValues) {
    closeModal();

    if (!props.uuid || fromRedirect) {
      const newLine: PaymentLineItem = {
        ...data,
        rowId: -1,
        uuid: uuidv4(),
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
        comment: data.comment?.trim(),
        lastPaymentDate: payee?.lastPaymentDate,
        numberOfPayments: payee?.numberOfPayments,
        paymentNumber: payee?.numberOfPayments ?? 0 + 1,
      };
      props.onLineAdded(newLine);
    } else {
      // payentLinewItemId is being removed on update of row

      console.log('data', data);

      const updatedLine: PaymentLineItem = {
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
        lastPaymentDate: payee?.lastPaymentDate,
        numberOfPayments: payee?.numberOfPayments,
        comment: data.comment?.trim(),
      };
      // console.log('updatedLine', updatedLine);

      props.onLineUpdated(updatedLine);
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
        label: <div className="dark:text- border-0  ">{b.name}</div>,
      }))
    : [];

  const grantsForDropdown = grantsSuccess
    ? grants!.map((b) => ({
        value: b.id,
        label: <div className="dark:text-white  ">{b.name}</div>,
      }))
    : [];

  const catsForDropdown = catSuccess
    ? categories!.map((b) => ({
        value: b.id,
        label: <div className=" dark:text-white  ">{b.name}</div>,
      }))
    : [];

  const accountsForDropdown =
    !loadingRemainingAccountBalances && remainingAccountBalances
      ? remainingAccountBalances!.map((b) => ({
          value: b.accountId,
          label: (
            <div className="flex justify-between gap-2  dark:text-white dark:bg-slate-900">
              <div>{b.accountName}</div>
              <span className="mr-8 text-neutral-600 dark:text-slate-200">
                Available:&nbsp;&nbsp;{formatCurrency(b.availableAmount)}
              </span>
            </div>
          ),
          data: { balance: b.availableAmount },
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
          {fromRedirect && redirectMessageIsOpen && (
            <div className="p-3 border mb-2 border-blue-400 dark:border-slate-600 bg-blue-50 dark:bg-slate-700/50 dark:text-white flex items-center relative">
              <div className="flex-1 ">
                Initiative, Grant, Category and Account have been pre-selected.
              </div>
              <div
                onClick={() => setRedirectMessagIsOpen(false)}
                className="absolute top-1 right-1 p-1  transition-all duration-200  cursor-pointer hover:bg-blue-200/70 dark:hover:bg-transparent"
              >
                <X
                  size={23}
                  className=" text-blue-500 border border-transparent hover:text-blue-700 dark:text-slate-400 hover:dark:text-white
               transition-all  "
                ></X>
              </div>
            </div>
          )}

          <div className="flex flex-col justify-between h-full ">
            <div className=" overflow-y-scroll border-0 ">
              <div className="flex flex-col gap-4 justify-between p-3 px-4 ">
                <div className="grid grid-cols-[.35fr_1fr_.1fr] gap-2 w-full ">
                  <Label>Year</Label>
                  <div className="text-neutral-700/90 dark:text-white font-medium">
                    {paymentYear}
                  </div>
                </div>

                <div className="grid grid-cols-[.35fr_1fr_.1fr] w-full items-center ">
                  <Label>Initiative</Label>
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
                    className="border p-2 border-neutral-300 dark:border-slate-700/80 py-3 rounded-sm text-neutral-800 disabled:bg-white"
                  ></Dropdown>
                  {errors?.initiativeId && (
                    <div className="text-red-500 pl-1">
                      <Asterisk size={18}></Asterisk>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-[.35fr_1fr_.1fr] w-full items-center ">
                  <Label>Grant</Label>
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
                    className="border p-2 border-neutral-300 dark:border-slate-700/80 py-3 rounded-sm text-neutral-800 disabled:bg-white"
                  ></Dropdown>

                  {errors?.grantId && (
                    <div className="text-red-500 pl-1">
                      <Asterisk size={18}></Asterisk>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-[.35fr_1fr_.1fr] w-full items-center">
                  <Label>Category</Label>
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
                    className="border p-2 border-neutral-300 dark:border-slate-700/80 py-3 rounded-sm text-neutral-800 disabled:bg-white"
                  ></Dropdown>
                  {errors?.categoryId && (
                    <div className="text-red-500 pl-1">
                      <Asterisk size={18}></Asterisk>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-[.35fr_1fr_.1fr] w-full items-center">
                  <Label>Account</Label>
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
                    renderOption={(option) => {
                      console.log('option', option);
                      return option.label;
                    }}
                    className="border p-2 border-neutral-300 dark:border-slate-700/80 py-3 rounded-sm text-neutral-800 disabled:bg-white"
                  ></Dropdown>
                  {errors?.accountId && (
                    <div className="text-red-500 pl-1">
                      <Asterisk size={18}></Asterisk>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-[.35fr_1fr_.1fr] w-full ">
                  <Label>Payee</Label>
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
                <div className="grid grid-cols-[.35fr_1fr_.1fr] w-full items-center ">
                  <Label>Comment</Label>
                  <TextArea {...register('comment')} rows={1}></TextArea>
                </div>

                {/* {loadingRemainingAccountBalances && <Spinner></Spinner>} */}

                <PaymentEntryInput
                  getValues={getValues}
                  error={errors?.paymentAmount}
                  register={register('paymentAmount')}
                  available={availableAmount}
                  onBlur={handleInputEntryOnBlur}
                  onLessThanZero={handleLessThanZero}
                  onOK={handleAmountOk}
                ></PaymentEntryInput>

                <div className="grid grid-cols-[.35fr_1fr_.1fr]">
                  <Label>Invoice Date.</Label>
                  <Controller
                    control={control}
                    name="invoiceDate"
                    render={({ field }) => (
                      <DatePicker
                        {...register('invoiceDate')}
                        id="invoiceDate"
                        selected={field.value ? new Date(field.value) : null}
                        dateFormat="MM/dd/yyyy"
                        onBlur={field.onBlur}
                        onChange={(date: Date | null) => {
                          field.onChange(date);
                        }}
                        className="w-[35%] border border-neutral-300 py-2 px-[.9rem] text-end rounded-sm dark:border-slate-700 focus:outline-none
                         dark:focus:border-indigo-400 disabled:bg-slate-200/60 focus:dark:border-indigo-500 dark:disabled:bg-slate-950 dark:bg-slate-800"
                      />
                    )}
                  ></Controller>
                  <div></div>
                </div>
                <div className="grid grid-cols-[.35fr_1fr_.1fr]">
                  <Label>Invoice No.</Label>
                  <div className="flex items-center w-[35%]">
                    <Input
                      {...register('invoiceNumber')}
                      additionalclasses="bg-white"
                    ></Input>
                    {isValidating && dirtyFields.invoiceNumber && (
                      <div className="ml-2">
                        <Spinner color="neutral"></Spinner>
                      </div>
                    )}
                    {!isValidating && (
                      <span>{errors.invoiceNumber?.message}</span>
                    )}
                  </div>
                  <div></div>
                </div>
                <div className="grid grid-cols-[.35fr_1fr_.1fr]">
                  <Label>Check No.</Label>
                  <div className="w-[35%]">
                    <Input
                      {...register('checkNumber')}
                      additionalclasses="bg-white"
                    ></Input>
                  </div>
                </div>
                <div></div>
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
              <Button type="submit">
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
//       uuid:uuidv4(),
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
