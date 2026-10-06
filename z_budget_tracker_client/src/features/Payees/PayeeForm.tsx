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
  onCreatePayeeCreated: (detals: NewPayeeInfo) => void;
};

type FormValues = Yup.InferType<typeof PayeeFormSchema>;

const PayeeForm = ({
  payee,
  onCancel,
  onCreatePayeeCreated,
  mode = '',
}: Props) => {
  const queryClient = useQueryClient();
  const [isActive, setIsActive] = useState(payee.isActive);
  const [payeeId, setPayeeId] = useState(payee.id);
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

  const { createPayee, updatePayee } = usePayeeMutations();
  const { categories } = useCategories();

  const [categoryIsSelected, setCategoryIsSelected] = useState(
    payee.id === 0 ? false : true,
  );
  const [accountOptions, setAccountOptions] = useState<Account[] | null>(null);

  let categoryOptions =
    categories !== null && categories!.length > 0
      ? categories!.map((x: Category) => {
          return { id: x.id, name: x.name };
        })
      : [];

  let payeeTypeOptions = [
    { id: 1, name: 'Vendor' },
    { id: 2, name: 'Contractor' },
  ];

  if (payee.id === 0) {
    const oldC = [...categoryOptions];
    categoryOptions.splice(0, categoryOptions.length);
    categoryOptions = [{ id: 0, name: '-- Select a Category--' }, ...oldC];

    const oldT = [...payeeTypeOptions];
    payeeTypeOptions.splice(0, payeeTypeOptions.length);
    payeeTypeOptions = [{ id: 0, name: '-- Select a Payee Type--' }, ...oldT];
  }

  useEffect(() => {
    if (categories !== null && categories!.length > 0) {
      if (payee.id === 0) {
        const initialOption: Account = {
          id: 0,
          name: '-- Select an Account --',
          number: '',
          category_id: 0,
        };

        const t2 = categories!
          .filter((c) => c.id === categories![0].id)[0]
          .accounts!.map((a: Account) => ({ ...a }));

        const finalOptions = [initialOption, ...t2];

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAccountOptions(finalOptions);
      } else {
        const t2 = categories!
          .filter((c) => c.id === payee.categoryId)[0]
          .accounts!.map((a: Account) => ({ ...a }));
        setAccountOptions(t2);
      }
    }
  }, [categories, payee.categoryId, payee.id]);

  // function getCurrentCategory() {
  //   return getValues('categoryId');
  // }

  function onCategoryChange(e: ChangeEvent<HTMLSelectElement>) {
    setCategoryIsSelected(true);
    setAccountOptions(
      categories!
        .filter((c) => c.id === +e.target.value)[0]
        .accounts!.map((a: Account) => ({ ...a })),
    );
  }

  async function onSubmit(data: FormValues) {
    try {
      if (payeeId === 0) {
        await createPayee.mutateAsync(data, {
          onSuccess: (newId: number) => {
            setValues({ id: newId });
            setPayeeId(newId);
            queryClient.invalidateQueries({
              queryKey: ['payees'],
            });
            toast.success('Payee created.');
            onCreatePayeeCreated({
              id: newId,
              accountId: data.accountId,
              categoryId: data.categoryId,
            });
          },
          onError: (e) => {
            console.log('e', e);
          },
        });
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
        {/* {errors.additionalInformation && <div>FORM ERROR!</div>} */}
        <div className="flex flex-col gap-2 w-full">
          <div className="font-semibold text-neutral-500 mb-2  border-b border-b-neutral-200 pl-0 p-1 ">
            Details
          </div>
          <FormRow
            id="name"
            label="Name"
            error={errors?.name?.message}
            useMessage={true}
          >
            <Input type="text" {...register('name')} />
          </FormRow>
          <FormRow
            id="details"
            label="Additional Information"
            error={errors?.additionalInformation?.message}
          >
            <TextArea {...register('additionalInformation')} rows={3} />
          </FormRow>
          <FormRow
            id="payeeTypeId"
            label="Payee Type"
            useMessage={true}
            error={errors?.payeeTypeId?.message}
          >
            <Select {...register('payeeTypeId')}>
              {payeeTypeOptions.map((x) => (
                <option value={x.id}>{x.name}</option>
              ))}
            </Select>
          </FormRow>
          <FormRow id="isActive" label="Active">
            <Switch isOn={isActive} handleToggle={handleToggle}></Switch>
          </FormRow>

          <div className="font-semibold text-neutral-500 border-b border-b-neutral-300 pl-0 p-1 mt-6 ">
            Charge Account
          </div>
          <FormRow
            id="categoryId"
            label="Category"
            error={errors?.categoryId?.message}
            useMessage={true}
          >
            <Select {...register('categoryId')} onChange={onCategoryChange}>
              {categoryOptions?.map((x) => (
                <option value={x.id}>{x.name}</option>
              ))}
            </Select>
          </FormRow>
          <FormRow id="accountId" label="Account">
            <Select {...register('accountId')} disabled={!categoryIsSelected}>
              {accountOptions?.map((x) => (
                <option value={x.id}>{x.name}</option>
              ))}
            </Select>
          </FormRow>
          <div className="grid grid-cols-[1fr_1.6fr_0.17fr] mt-10">
            <div></div>
            <div className="flex gap-2 justify-start">
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
