import { useEffect, useState } from 'react';
import Button from '../../../components/Button';
import Modal2 from '../../../components/Modal2';
import DatePicker from 'react-datepicker';
import { Controller, useForm } from 'react-hook-form';
import Input from '../../../components/Input';
import usePayeeInvoices from '../../../api/hooks/payments/usePayeeInvoices';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { formatCurrency } from '../../../app/util';
import { usePaymentMutations } from '../../../api/hooks/payments/usePaymentMutations';

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  uuid: string | null;
  paymentLineId: number;
  payeeId: number;
  payeeName: string;
  amount: number;
  invoiceNumber?: string | null;
  invoiceDate?: Date | null;
  checkNumber?: string | null;
  paymentNumber: number;
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
  amount,
  payeeName,
  payeeId,
  invoiceNumber,
  invoiceDate,
  checkNumber,
  paymentNumber,
  paymentLineId,
}: Props) => {
  const [animateOut, setAnimateOut] = useState(false);

  const [invoiceNumberEntered, setInvoiceNumberEntered] = useState<
    string | null
  >(invoiceNumber ?? null);

  const { updateInvoice, updateInvoiceSuccess, isUpdatingInvoice } =
    usePaymentMutations();

  const schema = Yup.object().shape({
    payeeId: Yup.number().required(),
    checkNumber: Yup.string().optional().nullable(),
    invoiceNumber: Yup.string().optional().nullable(),
    invoiceDate: Yup.date().optional().nullable(),
  });

  const { register, handleSubmit, control, getValues, reset } =
    useForm<FormData>({
      resolver: yupResolver(schema),
      defaultValues: {
        payeeId: payeeId,
        invoiceNumber: '',
        invoiceDate: null,
        checkNumber: '',
      },
    });

  const {
    data: found,
    isLoading: foundIsLoading,
    isFetching: foundIsFetching,
  } = usePayeeInvoices(
    invoiceNumberEntered !== invoiceNumber ? payeeId : 0,
    invoiceNumber,
  );

  useEffect(() => {
    reset({
      invoiceNumber: invoiceNumber,
      invoiceDate: invoiceDate,
      checkNumber: checkNumber,
    });
  }, [checkNumber, invoiceDate, invoiceNumber, reset]);

  async function onSubmit(data: FormData) {
    if (paymentLineId === 0) {
      // send back the values to the parent
    } else {
      await updateInvoice.mu(
        paymentLineId,
        data.invoiceNumber,
        data.invoiceDate,
        data.checkNumber,
      );
    }
  }

  function closeModal() {
    onCancel();
    setAnimateOut(true);
    setTimeout(() => {
      setAnimateOut(false);
      reset();
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
        <div className="flex gap-1 justify-between mb-7">
          <div>
            <div className=" text-neutral-600">Payee Name</div>
            <div className="font-medium">{payeeName}</div>
          </div>
          <div>
            <div className="text-neutral-600 ">Payment Amount</div>
            <div className="font-medium text-end">{formatCurrency(amount)}</div>
          </div>
          <div>
            <div className=" text-neutral-600 text-end">Payment No.</div>
            <div className="font-medium text-end">{paymentNumber}</div>
          </div>
        </div>
        <div className=" mb-8  w-full ">
          <div className="flex flex-col gap-3 w-full  ">
            <div className=" w-full">
              <div className=" ">
                <div className="text-neutral-600/90 font-medium self-center">
                  Invoice No.
                </div>
                <div className="  ">
                  <Input
                    {...register('invoiceNumber')}
                    additionalclasses="bg-white"
                    onBlur={(e) => {
                      setInvoiceNumberEntered(e.target.value.trim());
                    }}
                  ></Input>
                </div>
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
          <Button
            type="submit"
            disabled={
              (foundIsFetching || foundIsLoading || found) &&
              getValues('invoiceNumber') !== ''
            }
          >
            Save
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
