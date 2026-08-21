import Button from '../../components/Button';
import useRepro from '../../contexts/useRepro';

const Search = () => {
  const { saveSearchParams } = useRepro();

  return (
    <div>
      Search
      <Button
        onClick={() => {
          saveSearchParams({ initiativeName: 'test' });
        }}
      >
        Save Params
      </Button>
    </div>
  );
};
export default Search;
