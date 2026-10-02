import { useState, useEffect, type ChangeEvent } from 'react';
import useCategories from '../../api/hooks/common/useCategories';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Select from '../../components/Select';
import TextArea from '../../components/TextArea';
import FormRow from '../../ui/FormRow';
import { useForm } from 'react-hook-form';

type Props = {
  payee: Payee;
};
const PayeeDetailsForm = ({ payee }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: payee.name,
      details: payee.details,
    },
  });
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

  function onSubmit() {}

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="self-center w-full">
        <div className="flex flex-col gap-4 w-full">
          <div className="font-semibold text-neutral-700 text-xl border-b border-b-neutral-300 pl-0 p-1 ">
            Details
          </div>
          <FormRow id="name" label="Name">
            <Input type="text" {...register('name')} />
          </FormRow>
          <FormRow id="details" label="Additional Information">
            <TextArea {...register('details')} rows={4} />
          </FormRow>
          <FormRow id="typeId" label="Type">
            <Select>
              <option>Vendor</option>
              <option>Contractor</option>
            </Select>
          </FormRow>
          <FormRow id="categoryId" label="Category">
            <Select onChange={onCategoryChange}>
              {categoryOptions?.map((x) => (
                <option value={x.id}>{x.name}</option>
              ))}
            </Select>
          </FormRow>

          <FormRow id="accountId" label="Account">
            <Select>
              {accountOptions?.map((x) => (
                <option value={x.id}>{x.name}</option>
              ))}
            </Select>
          </FormRow>

          <div className="grid grid-cols-[1fr_1.6fr_0.4fr] mt-10">
            <div></div>
            <Button
              type="submit"
              variation="primary"
              buttonSize="small"
              additionalclasses=" p-1"
            >
              {/* {isLoginSuccess ? (
                <Check></Check>
              ) : isLoginPending ? (
                <div className="animate-spin h-6 w-6 border-4 border-gray-200 border-t-transparent border-b-transparent rounded-full"></div>
              ) : (
                'OK'
              )} */}
              Save
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default PayeeDetailsForm;
