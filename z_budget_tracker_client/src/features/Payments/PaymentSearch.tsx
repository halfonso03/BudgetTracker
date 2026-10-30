import { Link } from 'react-router-dom';

const PaymentSearch = () => {
  const ids: number[] = [];

  for (let x = 1; x <= 30; x++) {
    ids.push(x);
  }

  return (
    <div>
      {ids.map((x, index) => (
        <div key={index}>
          <Link to={`/payments/${x}`} className="text-blue-500 hover:underline">
            Id {x}
          </Link>
        </div>
      ))}
    </div>
  );
};
export default PaymentSearch;
