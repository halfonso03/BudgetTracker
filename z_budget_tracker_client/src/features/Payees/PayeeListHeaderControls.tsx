import Button from '../../components/Button';
import Search from '../../components/Search';

type Props = {
  onAddPayee: () => void;
  onSearch: (searchTerm: string) => void;
};
const PayeeListHeaderControls = ({ onAddPayee, onSearch }: Props) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between ">
        <Button buttonSize="medium" variation="primary" onClick={onAddPayee}>
          Add Payee
        </Button>
        <div className="flex w-[25%] ">
          <div className="w-full ">
            <Search onSearch={onSearch}></Search>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PayeeListHeaderControls;
