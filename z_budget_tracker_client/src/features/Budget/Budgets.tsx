import { useState } from 'react';
import Summary from './Summary';
import Button from '../../components/Button';
import BudgetSelectionsModal from './BudgetSelectionsModal';

const Budgets = () => {
  const [year, setYear] = useState<number>(2026);
  const [isCreateBudgetModalOpen, setIsCreateBudgetOpenModal] =
    useState<boolean>(false);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(+e.target.value);
  };

  return (
    <div className=''>
      <div className="flex mb-4 justify-between items-center">
        <div>
          <div className="p-2 font-bold text-neutral-700">Year:</div>
          <select
            value={year}
            className="p-2 border border-neutral-300"
            onChange={handleYearChange}
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
        </div>
        <div>
          <Button
            onClick={() => {
              setIsCreateBudgetOpenModal(true);
            }}
          >
            Create Budget
          </Button>
        </div>
      </div>
      <Summary year={year}></Summary>
      {isCreateBudgetModalOpen && (
        <BudgetSelectionsModal
          year={year}
          onCancelForm={() => setIsCreateBudgetOpenModal(false)}
        />
      )}
    </div>
  );
};

export default Budgets;

// <Table columns=".5fr .5fr .5fr">
//   <Table.Header>
//     <Table.Cell>Initiative</Table.Cell>
//     <Table.Cell>Grant</Table.Cell>
//     <Table.Cell>Amount</Table.Cell>
//   </Table.Header>
//   <Table.Body
//     data={data}
//     render={(budget: BudgetSummary, index: number) => (
//       <Table.Row key={index}>
//         <Table.Cell>{budget.initiative_id}</Table.Cell>
//         <Table.Cell>{budget.grant_id}</Table.Cell>
//         <Table.Cell>{budget.amount}</Table.Cell>
//       </Table.Row>
//     )}
//   ></Table.Body>
// </Table>
