import { useState, type ChangeEvent } from 'react';
import useAccounts from '../../api/hooks/common/useAccounts';
import Switch from '../../components/Switch';
import { Pencil } from 'lucide-react';

type Props = {
  vendors: Vendor[];
};

const List = ({ vendors }: Props) => {
  const [vendorsState, setVendorsState] = useState<Vendor[] | undefined>(
    vendors,
  );

  const { data: accounts, isLoading: loadingAccounts } = useAccounts(6);

  function handleVendorToggle(vendorId: number) {
    const newP = vendorsState!.map((v) => ({
      ...v,
      isActive: v.id === vendorId ? !v.isActive : v.isActive,
    }));
    setVendorsState(newP);
  }

  function onVendorAccountChange(

    // udate on server
    e: ChangeEvent<HTMLSelectElement>,
    vendorId: number,
  ) {
    const newP = vendorsState!.map((v) => ({
      ...v,
      accountId: v.id === vendorId ? +e.target.value : v.accountId,
    }));
    setVendorsState(newP);
  }

  if (loadingAccounts || loadingAccounts) return null;

  return (
    <div className="mx-auto w-[50%]">
      {/* <pre>{JSON.stringify(vendorsState)}</pre> */}
      <div className="grid grid-cols-[1fr_1fr_.3fr_.2fr] gap-2 font-semibold text-neutral-700 p-1">
        <div>Name</div>
        <div className="pl-2">Account</div>
        <div></div>
        <div className="text-center">Active</div>
      </div>
      <div className="">
        {vendorsState?.map((v) => (
          <div
            className="grid grid-cols-[1fr_1fr_.3fr_.2fr] gap-2  p-1 items-center"
            key={v.id}
          >
            <div className="self-center">
              {v.name} {v.id}
            </div>
            <div className="self-center">
              <select
                className="p-1 text-sm border border-neutral-300 rounded-sm w-full"
                defaultValue={v.accountId}
                onChange={(e) => {
                  onVendorAccountChange(e, v.id);
                }}
              >
                {accounts!.map((a) => (
                  <option value={a.id} key={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-center">
              <Pencil className="text-neutral-600 cursor-pointer"></Pencil>
            </div>
            <div className="self-center  flex justify-center">
              <Switch
                key={v.id}
                isOn={v.isActive}
                handleToggle={() => {
                  console.log('v.id', v.id);
                  handleVendorToggle(v.id);
                }}
              ></Switch>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default List;
