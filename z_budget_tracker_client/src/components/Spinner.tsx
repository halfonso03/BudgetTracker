type Props = {
  color?: string;
};
const Spinner = ({ color = 'neutral' }: Props) => {
  return (
    <div
      className={`animate-spin h-6 w-6 border-4 border-${color}-400 border-t-transparent border-b-transparent rounded-full`}
    ></div>
  );
};
export default Spinner;
