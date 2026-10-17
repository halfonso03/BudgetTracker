import { useEffect, useMemo, useState } from 'react';
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
  const [categorySelected, setCategoryIsSelected] = useState(false);
  const {
    register,
    handleSubmit,
    setValues,
    getValues,
    watch,
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

  console.log('payee', payee.categoryId);

  const { createPayee, updatePayee } = usePayeeMutations();
  const { categories, catSuccess } = useCategories();

  const payeeTypeOptions = [
    { id: 1, name: 'Vendor' },
    { id: 2, name: 'Contractor' },
  ];

  // eslint-disable-next-line react-hooks/incompatible-library
  const categoryIdWatchValue = watch('categoryId') as number;

  const accounts = useMemo(() => {
    return catSuccess && categories
      ? categories.filter((x) => x.id === +categoryIdWatchValue)[0]?.accounts
      : [];
  },[catSuccess, categories, categoryIdWatchValue]);

  function onCategoryChange() {
    setCategoryIsSelected(true);
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

  useEffect(() => {
    if (categorySelected && accounts && accounts.length) {
      setValues({accountId: accounts[0].id});
    }
  }, [accounts, categorySelected, setValues]);

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="self-center w-full"
      >
        category id: {getValues('categoryId')}
        <br></br>
        accountId: {getValues('accountId')}
        <br></br>
        <input type="hidden" {...register('id')} />
        {/* {errors.additionalInformation && <div>FORM ERROR!</div>} */}
        <div className="flex flex-col gap-2 w-full">
          <div className="font-semibold text-neutral-500 mb-2  border-b border-b-neutral-200/60 pl-0 p-1 ">
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
              {payeeId === 0 && (
                <option value="0">--Select a Payee Type --</option>
              )}
              {payeeTypeOptions.map((x) => (
                <option value={x.id}>{x.name}</option>
              ))}
            </Select>
          </FormRow>
          <FormRow id="isActive" label="Active">
            <Switch isOn={isActive} handleToggle={handleToggle}></Switch>
          </FormRow>

          <div className="font-semibold text-neutral-500 border-b border-b-neutral-200/80 pl-0 p-1 mt-6 ">
            Charge Account
          </div>
          <FormRow
            id="categoryId"
            label="Category"
            error={errors?.categoryId?.message}
            useMessage={true}
          >
            <Select
              {...register('categoryId')}
              onChange={(e) => {
                register('categoryId').onChange(e);
                onCategoryChange();
              }}
            >
              {payeeId === 0 && (
                <option value="0">--Select a Category --</option>
              )}
              {categories?.map((x) => (
                <option value={x.id}>{x.name}</option>
              ))}
            </Select>
          </FormRow>
          <FormRow
            id="accountId"
            label="Account"
            error={errors?.accountId?.message}
            useMessage={true}
          >
            <Select
              {...register('accountId')}
              disabled={+getValues('categoryId') === 0}
            >
              {payeeId === 0 && (
                <option value="0">--Select an Account --</option>
              )}
              {accounts?.map((x) => (
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
