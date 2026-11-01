import { useEffect, useState } from 'react';
import Button from '../../../components/Button';
import Modal2 from '../../../components/Modal2';
import DatePicker from 'react-datepicker';
import { Controller, useForm } from 'react-hook-form';
import Input from '../../../components/Input';
import usePayeeInvoices from '../../../api/hooks/payees/usePayeeInvoices';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { formatCurrency, parseFormattedNumber } from '../../../app/util';
import { usePaymentMutations } from '../../../api/hooks/payments/usePaymentMutations';
import Spinner from '../../../components/Spinner';
import { POSTED } from '../../../app/constants';

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  paymentHeader: PaymentHeader;
  paymentLineItem: PaymentLineItem;
  onInvoiceUpdated: (data: {
    uuid: string;
    invoiceNumber: string | null;
    checkNumber: string | null;
    invoiceDate: Date | null;
  }) => void;
};

interface FormData {
  payeeId: number;
  invoiceDate?: Date | null | undefined;
  invoiceNumber?: string | null;
  checkNumber?: string | null;
}

const InvoiceInfoModal = ({
  isOpen,
  onCancel,
  paymentHeader,
  paymentLineItem,
  onInvoiceUpdated,
}: Props) => {
  const [animateOut, setAnimateOut] = useState(false);

  const [invoiceNumberEntered, setInvoiceNumberEntered] = useState<
    string | null
  >(paymentLineItem.invoiceNumber ?? null);

  const { updateInvoice } = usePaymentMutations();
  const {
    mutateAsync,
    isPending,
    isSuccess,
    reset: resetMutate,
  } = updateInvoice;

  const {
    data: found,
    isLoading: foundIsLoading,
    isFetching: foundIsFetching,
    isPending: foundIsPending,
  } = usePayeeInvoices(
    paymentLineItem.payeeId,
    paymentLineItem.invoiceNumber == invoiceNumberEntered
      ? ''
      : invoiceNumberEntered,
  );

  const schema = Yup.object().shape({
    payeeId: Yup.number().required(),
    checkNumber: Yup.string().optional().nullable(),
    invoiceNumber: Yup.string().optional().nullable(),
    invoiceDate: Yup.date().optional().nullable(),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isDirty },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      payeeId: paymentLineItem.payeeId,
    },
  });

  useEffect(() => {
    reset({
      payeeId: paymentLineItem.payeeId,
      invoiceNumber: paymentLineItem.invoiceNumber,
      invoiceDate: paymentLineItem.invoiceDate,
      checkNumber: paymentLineItem.checkNumber,
    });
  }, [
    paymentLineItem.checkNumber,
    paymentLineItem.invoiceDate,
    paymentLineItem.invoiceNumber,
    paymentLineItem.payeeId,
    reset,
  ]);

  async function onSubmit(data: FormData) {
    console.log('data', data);
    console.log('paymentLineId', paymentLineItem.paymentLineItemId);

    const paymentLineItemId = !paymentLineItem.paymentLineItemId
      ? 0
      : paymentLineItem.paymentLineItemId;
    if (paymentHeader.status === POSTED) {
      setTimeout(async () => {
        // if posted
        await mutateAsync(
          {
            paymentLineId: paymentLineItemId,
            invoiceDate: data.invoiceDate,
            invoiceNumber: data.invoiceNumber,
            checkNumber: data.checkNumber,
          },
          {
            onSuccess: () => {
              setTimeout(closeModal, 500);
              onInvoiceUpdated({
                uuid: paymentLineItem.uuid,
                invoiceNumber: data.invoiceNumber ?? null,
                invoiceDate: data.invoiceDate ?? null,
                checkNumber: data.checkNumber ?? null,
              });
            },
          },
        );
      }, 10);
    }
  }

  function closeModal() {
    onCancel();
    setAnimateOut(true);
    setTimeout(() => {
      setAnimateOut(false);
      reset();
      resetMutate();
    }, 500);
  }

  let saveIsDisabled = false;

  if (
    foundIsFetching ||
    foundIsLoading ||
    foundIsPending ||
    isPending ||
    Boolean(found)
  ) {
    saveIsDisabled = true;
  }

  if (isDirty) {
    saveIsDisabled = false;
  }

  return (
    <Modal2
      size="sm"
      title="Update Invoice Information"
      animateOut={animateOut}
      isOpen={isOpen}
      onCancel={closeModal}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* {errors.invoiceDate?.message}
        {errors.invoiceNumber?.message}
        {errors.checkNumber?.message}
        {errors.payeeId?.message} */}
        {/* {payeeId}
        <br></br>
        {invoiceNumberEntered}
        <br></br>
        {getValues('invoiceNumber')} */}
        {found}
        <div className="flex gap-1 justify-between mb-7">
          <div>
            <div className=" text-neutral-600">Payee Name</div>
            <div className="font-medium">{paymentLineItem.payeeName}</div>
          </div>
          <div>
            <div className="text-neutral-600 ">Payment Amount</div>
            <div className="font-medium text-end">
              {formatCurrency(
                parseFormattedNumber(paymentLineItem.paymentAmount.toString()),
              )}
            </div>
          </div>
          <div>
            <div className=" text-neutral-600 text-end">Payment No.</div>
            <div className="font-medium text-end">
              {(paymentLineItem.numberOfPayments ?? 0) + 1}
            </div>
          </div>
        </div>
        <div className=" mb-8  w-full ">
          <div className="flex flex-col gap-3 w-full  ">
            <div className=" w-full">
              <div className=" ">
                <div className="text-neutral-600/90 font-medium self-center">
                  Invoice No.
                </div>
                <Input
                  {...register('invoiceNumber')}
                  additionalclasses="bg-white"
                  onBlur={(e) => {
                    setInvoiceNumberEntered(e.target.value.trim());
                  }}
                ></Input>
              </div>
              {found && (
                <>
                  <div></div>
                  <div className="text-red-500 flex items-center gap-2 my-2">
                    Entered invoice number already exists for this payee.
                  </div>
                </>
              )}
            </div>

            <div className=" ">
              <div className="text-neutral-600/90 font-medium self-center">
                Invoice Date.
              </div>
              <div>
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
                      wrapperClassName="w-full"
                      className="p-2 rounded-sm bg-white border w-full border-gray-300 focus:outline-none focus:ring focus:ring-blue-50 "
                    />
                  )}
                ></Controller>
              </div>
            </div>

            <div className=" ">
              <div className="text-neutral-600/90 font-medium self-center">
                Check No.
              </div>
              <div>
                <div className="">
                  <Input
                    {...register('checkNumber')}
                    additionalclasses="bg-white"
                  ></Input>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 pb-1">
          <Button type="submit" disabled={saveIsDisabled}>
            {isPending || isSuccess ? (
              <Spinner color="white"></Spinner>
            ) : (
              'Save'
            )}
          </Button>
          <Button variation="secondary" onClick={closeModal}>
            Close
          </Button>
        </div>
      </form>
    </Modal2>
  );
};
export default InvoiceInfoModal;
