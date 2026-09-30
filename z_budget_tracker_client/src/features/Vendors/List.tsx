import { useEffect, useState } from 'react';
import useAccounts from '../../api/hooks/common/useAccounts';
import { useGetAllVendors } from '../../api/hooks/vendors/useGetVendorsByAccount';
import Button from '../../components/Button';
import Select from '../../components/Select';
import Switch from '../../components/Switch';

const List = () => {
  const { data, isLoading } = useGetAllVendors();

  const { data: accounts, isLoading: loadingAccounts } = useAccounts(6);

  const [vendorsState, setVendorsState] = useState<Vendor[] | undefined>(
    !data ? [] : data,
  );

  function handleVendorToggle(vendorId: number) {
    setVendorsState((prev) =>
      prev?.map((v) => ({
        ...v,
        isActive: v.id === vendorId ? !v.isActive : v.isActive,
      })),
    );
  }

console.log('data', data)

  if (isLoading || !data || loadingAccounts || !accounts) return null;

  return (
    <div className="mx-auto w-[50%]">
      {/* <pre>{JSON.stringify(vendorsState)}</pre> */}
      <div className="grid grid-cols-[1fr_1fr_.5fr_.2fr] gap-2 font-semibold text-neutral-700 p-1">
        <div>Name</div>
        <div className="pl-2">Account</div>
        <div className="text-center">Active</div>
      </div>
      <div className="">
        {data?.map((v) => (
          <div
            className="grid grid-cols-[1fr_1fr_.5fr_.2fr] gap-2  p-1 items-center"
            key={v.id}
          >
            <div className="self-center">
              {v.name} {v.id}
            </div>
            <div className="self-center">
              <select
                className="p-1 text-sm border border-neutral-300 rounded-sm w-full"
                value={v.accountId}
              >
                {accounts.map((a) => (
                  <option value={a.id} key={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
            <div className="self-center  flex justify-center">
              <Switch
                isOn={v.isActive}
                handleToggle={() => {
                  console.log('v.id', v.id);
                  handleVendorToggle(v.id);
                }}
              ></Switch>
            </div>
            <div className=" self-center">
              <Button buttonSize="xsmall" variation="secondary">
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default List;
