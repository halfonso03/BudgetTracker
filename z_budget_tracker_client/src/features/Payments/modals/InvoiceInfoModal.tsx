import { useEffect, useState } from 'react';
import Button from '../../../components/Button';
import Modal2 from '../../../components/Modal2';
import DatePicker from 'react-datepicker';
import { Controller, useForm, type Resolver } from 'react-hook-form';
import Input from '../../../components/Input';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { formatCurrency, parseFormattedNumber } from '../../../app/util';
import { usePaymentMutations } from '../../../api/hooks/payments/usePaymentMutations';
import Spinner from '../../../components/Spinner';
import { InvoiceInfoFormSchema } from '../../../form_schemas/PaymentFormSchema';
import toast from 'react-hot-toast';

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  paymentLineItem: PaymentLineItem;
  onInvoiceUpdated: (data: {
    uuid: string;
    invoiceNumber: string | null;
    checkNumber: string | null;
    invoiceDate: Date | null;
  }) => void;
};

interface FormData {
  invoiceDate?: Date | null | undefined;
  invoiceNumber?: string | null;
  checkNumber?: string | null;
}

type FormValues = Yup.InferType<typeof InvoiceInfoFormSchema>;

const InvoiceInfoModal = ({
  isOpen,
  onCancel,
  paymentLineItem,
  onInvoiceUpdated,
}: Props) => {
  const [animateOut, setAnimateOut] = useState(false);

  const { updateInvoice } = usePaymentMutations();
  const {
    mutateAsync,
    isPending,
    isSuccess,
    reset: resetMutate,
  } = updateInvoice;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isValidating, dirtyFields },
  } = useForm<FormValues>({
    resolver: yupResolver(InvoiceInfoFormSchema) as Resolver<FormValues>,
    mode: 'onBlur',
    context: {
      payload: {
        payeeId: paymentLineItem.payeeId,
        priorInvoiceNumber: paymentLineItem.invoiceNumber,
      }, // Pass your external value here
    },
    defaultValues: {
      invoiceDate: null,
      checkNumber: '',
      invoiceNumber: '',
    },
  });

  useEffect(() => {
    reset({
      invoiceNumber: paymentLineItem.invoiceNumber,
      invoiceDate: paymentLineItem.invoiceDate,
      checkNumber: paymentLineItem.checkNumber,
    });
  }, [
    paymentLineItem.checkNumber,
    paymentLineItem.invoiceDate,
    paymentLineItem.invoiceNumber,
    reset,
  ]);

  async function onSubmit(data: FormData) {
    console.log('data', data);
    console.log('paymentLineId2', paymentLineItem.paymentLineItemId);

    await mutateAsync(
      {
        paymentLineItemId: paymentLineItem.paymentLineItemId!,
        invoiceDate: data.invoiceDate,
        invoiceNumber: data.invoiceNumber,
        checkNumber: data.checkNumber,
      },
      {
        onSuccess: () => {
          toast.success('Updated successfull.');
          setTimeout(closeModal, 800);
          onInvoiceUpdated({
            uuid: paymentLineItem.uuid,
            invoiceDate: data.invoiceDate ?? null,
            invoiceNumber: data.invoiceNumber ?? null,
            checkNumber: data.checkNumber ?? null,
          });
        },
      },
    );
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
        <div className=" mb-8   ">
          <div className="flex flex-col gap-3   ">
            <div className="grid grid-cols-[.45fr_1fr_.5fr]  w-full items-center">
              <div className="text-neutral-600/90 font-medium">
                Invoice Date.
              </div>
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
                    wrapperClassName="w-full border border-blue-500"
                    className="p-2 rounded-sm w-full bg-white border border-gray-300 focus:outline-none focus:ring focus:ring-blue-50 "
                  />
                )}
              ></Controller>
            </div>
            <div className="grid grid-cols-[.45fr_1fr_.5fr] items-center">
              <div className="text-neutral-600/90 font-medium self-center">
                Invoice No.
              </div>
              <div className="flex flex-col items-center gap-1 w-full ">
                <Input
                  {...register('invoiceNumber')}
                  additionalclasses="bg-white "
                ></Input>
                {!isValidating && (
                  <div className='text-red-500'>
                    {errors.invoiceNumber?.message}
                  </div>
                )}
              </div>
              <div className="flex-1  w-full text-red-500">
                {isValidating && dirtyFields.invoiceNumber && (
                  <div className="ml-2">
                    <Spinner color="neutral"></Spinner>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-[.45fr_1fr_.5fr] items-center ">
              <div className="text-neutral-600/90 font-medium self-center">
                Check No.
              </div>
              <Input
                {...register('checkNumber')}
                additionalclasses="bg-white"
              ></Input>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 pb-1">
          <Button type="submit" disabled={isPending || isSuccess}>
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
