import { Pencil } from 'lucide-react';
import { useVendors } from '../../api/hooks/vendors/useVendors';

// type Props = {
//   vendors: Vendor[];
// };

const List = () => {
  const { results, loadingVendors } = useVendors();

  const paginationData = results?.pagination;

  console.log('paginationData', paginationData);
  // const [vendorsState, setVendorsState] = useState<Vendor[] | undefined>(
  //   vendors,
  // );

  // function handleVendorToggle(vendorId: number) {
  //   const newP = vendorsState!.map((v) => ({
  //     ...v,
  //     isActive: v.id === vendorId ? !v.isActive : v.isActive,
  //   }));
  //   setVendorsState(newP);
  // }

  // function onVendorAccountChange(
  //   // udate on server
  //   e: ChangeEvent<HTMLSelectElement>,
  //   vendorId: number,
  // ) {
  //   const newP = vendorsState!.map((v) => ({
  //     ...v,
  //     accountId: v.id === vendorId ? +e.target.value : v.accountId,
  //   }));
  //   setVendorsState(newP);
  // }

  if (loadingVendors || loadingVendors) return null;

  return (
    <div className="mx-auto w-[50%]">
      {/* <pre>{JSON.stringify(vendorsState)}</pre> */}
      <div className="grid grid-cols-[1fr_1fr_1fr_1fr_.2fr_.2fr] gap-2 font-semibold text-neutral-700 p-1">
        <div>Name</div>
        <div className="text-center">Charge Account</div>
        <div className="text-center">Last Payment</div>
        <div className="text-center"># days since last payment</div>
        <div>Active</div>
        <div className="text-center">Edit</div>
      </div>
      <div className="">
        {results?.map((v) => (
          <div
            className="grid grid-cols-[1fr_1fr_1fr_1fr_.2fr_.2fr] gap-2  p-1 items-center"
            key={v.id}
          >
            <div>{v.name}</div>
            <div className="text-center">{v.accountId}</div>
            <div className="text-center"></div>
            <div className="text-center "></div>
            <div className="text-center "></div>
            <div>
              <Pencil className="text-neutral-600 cursor-pointer"></Pencil>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default List;
