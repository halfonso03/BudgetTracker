type Props = {
  color?: string;
};
const Spinner = ({ color }: Props) => {
  const color2 = !color ? 'neutral' : color;

  return (
    <div
      className={`animate-spin h-6 w-6 border-4 border-${color2}-400 border-t-transparent border-b-transparent rounded-full`}
    ></div>
  );
};
export default Spinner;
