import Button from '../../components/Button';
import Search from '../../components/Search';

type Props = {
  onAddPayee: () => void;
  onSearch: (searchTerm: string) => void;
};
const PayeeListHeaderControls = ({ onAddPayee, onSearch }: Props) => {
  return (
    <div className="flex justify-between w-full mb-6">
      <div className="w-full justify-between flex ">
        <Button buttonSize="medium" variation="primary" onClick={onAddPayee}>
          Add Payee
        </Button>
        <Search onSearch={onSearch}></Search>
      </div>
    </div>
  );
};
export default PayeeListHeaderControls;
