import { Link } from 'react-router-dom';
import useBudgetSummary from '../../api/hooks/useBudgetSummay';
import { formatCurrency } from '../../app/util';
import { Glasses } from 'lucide-react';

const Budgets = () => {
  const { data } = useBudgetSummary();

  if (!data) return null;

  return (
    <>
      <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] font-semibold p-3 gap-4">
        <div>Year</div>
        <div>Initiative</div>
        <div>Grant</div>
        <div>Amount</div>
        <div></div>
      </div>
      {data.map((budget, index) => (
        <div key={index}>
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr]  gap-4 mb-5 border border-neutral-300 p-3">
            <div>{budget.year}</div>
            <div>{budget.initiative_name}</div>
            <div>{budget.grant_name}</div>
            <div>{formatCurrency(budget.amount)}</div>
            <div className="text-center">
              <Link to={`${budget.initiative_id}/${budget.grant_id}`} className='text-blue-600'>
                <Glasses></Glasses>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </>
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
