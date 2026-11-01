type Props = {
  color?: string;
};
const Spinner = ({ color }: Props) => {
  const color2 = !color ? 'neutral' : color;

  const classes = `animate-spin h-6 w-6 border-4 border-${color2}-300 border-t-transparent border-b-transparent rounded-full`;

  return <div className={classes}></div>;
};
export default Spinner;
