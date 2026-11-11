import { useEffect, useState } from 'react';
import Summary from './Summary';
import Button from '../../components/Button';
import toast from 'react-hot-toast';
import CreateBudgetModal from './modals/CreateBudgetModal';
import Select from '../../components/Select';

const Budgets = () => {
  const [isCreateBudgetModalOpen, setIsCreateBudgetOpenModal] =
    useState<boolean>(false);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(+e.target.value);
  };

  const years: number[] = [];
  for (let x = 0; x <= 4; x++) {
    years.push(new Date().getFullYear() - x);
  }

  const [year, setYear] = useState<number>(years[0]);

  useEffect(() => {
    toast.dismissAll();
  }, []);

  return (
    <div className=" min-h-lvh ">
      <div className="flex mb-4 justify-between items-center">
        <div>
          <div className="p-2  dark:text-slate-400 font-semibold ">Year:</div>
          <Select value={year} onChange={handleYearChange}>
            {years.map((y) => (
              <option value={y}>{y}</option>
            ))}
          </Select>
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
      <Summary year={year} key={year}></Summary>
      {isCreateBudgetModalOpen && (
        <CreateBudgetModal
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
