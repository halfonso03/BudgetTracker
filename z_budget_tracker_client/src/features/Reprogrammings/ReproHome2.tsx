import { useState } from 'react';
import AddLineModal from './AddLineModal';
import useCategories from '../../api/hooks/useCategories';
import useGrants from '../../api/hooks/useGrants';
import useInitiatives from '../../api/hooks/useInitiatives';
import TransactionRow from './TransactionRow';
import { type Option } from 'react-dropdown';

const ReproHome2 = () => {
  const [addLineModelIsOpen, setAddLineModelIsOpen] = useState(false);
  const [lines, setLines] = useState<ReproLineItem[]>([]);

  const { data: initiatives } = useInitiatives();
  const { data: categories, isLoading } = useCategories();
  const [year, setYear] = useState<number>(2026);
  const { data: grants } = useGrants(year);

  function handleLineAdded(line: ReproLineItem) {
    setTimeout(() => {
      setAddLineModelIsOpen(false);
    }, 500);
    setLines((prev) => [...prev, line]);
  }

  const handleAccountChange = (option: Option, rowUuid: string) => {
    setLines((prev) => {
      const otherLines = prev.filter((x) => x.uuid !== rowUuid);
      const updatedLine = prev.filter((x) => x.uuid === rowUuid)[0];
      updatedLine.accountId = +option.value;
      updatedLine.accountName = option.label!.toString();
      return [...otherLines, updatedLine];
    });
  };

  if (isLoading) return null;

  return (
    <div>
      <button onClick={() => setAddLineModelIsOpen(true)}>Add Line</button>
      <div className="grid grid-cols-[1fr_1fr_1fr_1fr]">
        {lines.map((item) => (
          <TransactionRow
            key={item.uuid}
            lineItem={item}
            categories={categories}
            handleAccountChange={handleAccountChange}
          ></TransactionRow>
        ))}
      </div>

      <AddLineModal
        isOpen={addLineModelIsOpen}
        initiatives={initiatives}
        grants={grants}
        categories={categories}
        onLineAdded={handleLineAdded}
        onCancel={() => {
          setTimeout(() => {
            setAddLineModelIsOpen(false);
          }, 500);
        }}
      ></AddLineModal>
    </div>
  );
};
export default ReproHome2;
