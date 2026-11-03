import { Link } from 'react-router-dom';

const PaymentSearch = () => {
  const ids: number[] = [];

  for (let x = 1; x <= 80; x++) {
    ids.push(x);
  }

  return (
    <div className="flex gap-4 text-lg flex-wrap">
      {ids.map((x, index) => (
        <div key={index}>
          <Link to={`/payments/${x}`} className="text-blue-500 hover:underline">
            {x}
          </Link>
        </div>
      ))}
    </div>
  );
};
export default PaymentSearch;
