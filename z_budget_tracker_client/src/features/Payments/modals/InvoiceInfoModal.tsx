import { useState } from 'react';
import Button from '../../../components/Button';
import Modal2 from '../../../components/Modal2';
import DatePicker from 'react-datepicker';
import { Controller, useForm } from 'react-hook-form';
import Input from '../../../components/Input';
import usePayeeInvoices from '../../../api/hooks/payments/usePayeeInvoices';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  uuid: string | null;
  payeeId: number;
  invoiceNumber?: string | null;
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
  uuid,
  payeeId,
  invoiceNumber,
}: Props) => {
  const [animateOut, setAnimateOut] = useState(false);

  const [invoiceNumberEntered, setInvoiceNumberEntered] = useState<
    string | null
  >(invoiceNumber ?? null);

  const schema = Yup.object({
    payeeId: Yup.number().required(),
    checkNumber: Yup.string().optional().nullable(),
    invoiceNumber: Yup.string().optional().nullable(),
    invoiceDate: Yup.date().optional().nullable(),
  }).required();

  const { register, handleSubmit, control, getValues } = useForm<FormData>({
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

  function closeModal() {
    onCancel();
    setAnimateOut(true);
    setTimeout(() => {
      setAnimateOut(false);
    }, 500);
  }

  function onSubmit() {

    console.log('uuid', uuid)
  }

  return (
    <Modal2
      size="lg"
      title="Update Invoice Information"
      animateOut={animateOut}
      isOpen={isOpen}
      onCancel={onCancel}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-[1fr_1fr] mb-4 gap-4">
          {/* <pre>{JSON.stringify(paymentLineItem)}</pre> */}
          <div className="flex flex-col gap-3 bg-neutral-200/40 p-4 rounded-sm">
            <div className="grid grid-cols-[.35fr_1fr_.1fr]">
              <div className="grid grid-cols-[.33fr_1fr_.1fr] col-span-3 ">
                <div className="text-neutral-600/90 font-medium self-center">
                  Invoice No.
                </div>
                <div className="col-span-2 flex gap-2 w-[42%] items-center ">
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

            <div className="grid grid-cols-[.35fr_1fr_.1fr]">
              <div className="grid grid-cols-[.37fr_1fr_.1fr] col-span-2">
                <div className="text-neutral-600/90 font-medium self-center">
                  Invoice Date.
                </div>
                <div>
                  <div className="w-[50%]">
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
                          className="p-2 rounded-sm bg-white w-full border border-gray-300 focus:outline-none focus:ring focus:ring-blue-50 "
                        />
                      )}
                    ></Controller>
                  </div>
                </div>
              </div>
              <div></div>
            </div>

            <div className="grid grid-cols-[.35fr_1fr_.1fr]">
              <div className="grid grid-cols-[.37fr_1fr_.1fr] col-span-2">
                <div className="text-neutral-600/90 font-medium self-center">
                  Check No.
                </div>
                <div>
                  <div className="w-[50%]">
                    <Input
                      {...register('checkNumber')}
                      additionalclasses="bg-white"
                    ></Input>
                  </div>
                </div>
              </div>
              <div></div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 pb-3">
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
