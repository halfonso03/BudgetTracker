import { useGetAllVendors } from '../../api/hooks/vendors/useGetVendorsByAccount';
import List from './List';

const VendorHome = () => {
  const { data, isLoading } = useGetAllVendors();

  if (isLoading) return null;

  return <div>{data && <List vendors={data}></List>}</div>;
};
export default VendorHome;
