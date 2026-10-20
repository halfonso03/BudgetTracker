import { Link } from 'react-router-dom';

const PaymentSearch = () => {
  const ids: number[] = [];

  for (let x = 1030; x <= 1050; x++) {
    ids.push(x);
  }

  return (
    <div>
      {ids.map((x) => (
        <div>
          <Link to={`/payments/${x}`} className="text-blue-500 hover:underline">
            Id {x}
          </Link>
        </div>
      ))}
    </div>
  );
};
export default PaymentSearch;
