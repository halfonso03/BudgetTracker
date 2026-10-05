import { useState, useEffect, type ChangeEvent } from 'react';
import useCategories from '../../api/hooks/common/useCategories';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Select from '../../components/Select';
import TextArea from '../../components/TextArea';
import FormRow from '../../ui/FormRow';
import { useForm, type Resolver } from 'react-hook-form';
import Switch from '../../components/Switch';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { PayeeFormSchema } from '../../form_schemas/PayeeFormSchema';
import { usePayeeMutations } from '../../api/hooks/payees/usePayeeMutations';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

type Props = {
  payee: Payee;
  mode?: string;
  onCancel?: () => void;
};

type FormValues = Yup.InferType<typeof PayeeFormSchema>;

const PayeeForm = ({ payee, onCancel, mode = '' }: Props) => {
  const queryClient = useQueryClient();

  const {
    register, // Function to register input fields and connect them to validation
    handleSubmit, // Function that wraps your submit handler to handle validation
    setValues,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(PayeeFormSchema) as Resolver<FormValues>,
    defaultValues: {
      id: payee.id,
      name: payee.name,
      additionalInformation: payee.additionalInformation,
      categoryId: payee.categoryId,
      accountId: payee.accountId,
      isActive: payee.isActive,
      payeeTypeId: payee.payeeTypeId,
    },
  });

  const { updatePayee } = usePayeeMutations();

  const { categories } = useCategories();

  const categoryOptions =
    categories !== null && categories!.length > 0
      ? categories!.map((x: Category) => {
          return { id: x.id, name: x.name };
        })
      : [];

  const [accountOptions, setAccountOptions] = useState<Account[] | null>(null);

  useEffect(() => {
    if (categories !== null && categories!.length > 0) {
      const t2 = categories!
        .filter((c) => c.id === categories![0].id)[0]
        .accounts!.map((a: Account) => ({ ...a }));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAccountOptions(t2);
    }
  }, [categories]);

  function onCategoryChange(e: ChangeEvent<HTMLSelectElement>) {
    setAccountOptions(
      categories!
        .filter((c) => c.id === +e.target.value)[0]
        .accounts!.map((a: Account) => ({ ...a })),
    );
  }

  async function onSubmit(data: FormValues) {
    try {
      if (data.id === 0) {
        // onCreatePayee;
        console.log('data', data);
      } else {
        await updatePayee.mutateAsync(data, {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ['payees'],
            });
            toast.success('Payee updated.');
          },
          onError: (e) => {
            console.log('e', e);
          },
        });
      }
    } catch (error) {
      alert(error);
      console.log('error', error);
    }
  }

  const [isActive, setIsActive] = useState(payee.isActive);

  function handleToggle() {
    const currentIsActive = isActive;
    setIsActive(!currentIsActive);
    setValues({ isActive: !currentIsActive });
  }

  function onError() {}

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="self-center w-full"
      >
        <input type="hidden" {...register('id')} />
        {/* <pre>{JSON.stringify(getValues())}</pre> */}
        {/* {errors && <div>FORM ERROR!</div>} */}
        <div className="flex flex-col gap-2 w-full">
          <div className="font-semibold text-neutral-700 mb-2  border-b border-b-neutral-300 pl-0 p-1 ">
            Details
          </div>
          <FormRow id="name" label="Name" error={errors?.name?.message}>
            <Input type="text" {...register('name')} />
          </FormRow>
          <FormRow
            id="details"
            label="Additional Information"
            error={errors?.additionalInformation?.message}
          >
            <TextArea {...register('additionalInformation')} rows={3} />
          </FormRow>
          <FormRow id="payeeTypeId" label="Type">
            <Select {...register('payeeTypeId')}>
              <option value={1}>Vendor</option>
              <option value={2}>Contractor</option>
            </Select>
          </FormRow>
          <FormRow id="accountId" label="Active">
            <Switch isOn={isActive} handleToggle={handleToggle}></Switch>
          </FormRow>

          <div className="font-semibold text-neutral-700 border-b border-b-neutral-300 pl-0 p-1 mt-6 ">
            Charge Account
          </div>
          <FormRow id="categoryId" label="Category">
            <Select {...register('categoryId')} onChange={onCategoryChange}>
              {categoryOptions?.map((x) => (
                <option value={x.id}>{x.name}</option>
              ))}
            </Select>
          </FormRow>
          <FormRow id="accountId" label="Account">
            <Select {...register('accountId')}>
              {accountOptions?.map((x) => (
                <option value={x.id}>{x.name}</option>
              ))}
            </Select>
          </FormRow>
          <div className="grid grid-cols-[1fr_1.6fr_0.17fr] mt-10">
            <div></div>
            <div className="flex gap-2 justify-end">
              <Button type="submit" variation="primary" buttonSize="medium">
                {/* {isLoginSuccess ? (
                <Check></Check>
              ) : isLoginPending ? (
                <div className="animate-spin h-6 w-6 border-4 border-gray-200 border-t-transparent border-b-transparent rounded-full"></div>
              ) : (
                'OK'
              )} */}
                Save
              </Button>
              {mode === 'modal' && (
                <Button
                  type="button"
                  variation="secondary"
                  buttonSize="medium"
                  onClick={() => onCancel?.()}
                >
                  {/* {isLoginSuccess ? (
                <Check></Check>
              ) : isLoginPending ? (
                <div className="animate-spin h-6 w-6 border-4 border-gray-200 border-t-transparent border-b-transparent rounded-full"></div>
              ) : (
                'OK'
              )} */}
                  Cancel
                </Button>
              )}
            </div>
            <div></div>
          </div>
        </div>
      </form>
    </div>
  );
};
export default PayeeForm;
