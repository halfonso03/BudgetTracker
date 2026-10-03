interface CustomInputProps extends React.ComponentPropsWithoutRef<'input'> {
  additionalclasses?: string;
}

const Input = (props: CustomInputProps) => {
  const defaultClasses = `w-full p-2 rounded-sm border border-gray-300  focus:outline-none focus:border-neutral-500 disabled:bg-neutral-300 
    focus:dark:border-gray-100 dark:disabled:bg-neutral-950 dark:text-neutral-100 dark:bg-neutral-800 dark:border-gray-500`;

  return (
    <input
      className={defaultClasses + ' ' + (props.additionalclasses ?? '')}
      {...props}
    />
  );
};
export default Input;
