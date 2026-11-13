interface CustomInputProps extends React.ComponentPropsWithoutRef<'input'> {
  additionalclasses?: string;
}

const Input = ({ ...props }: CustomInputProps) => {
  const defaultClasses = `bg-white dark:border-slate-700/80 text-neutral-900 dark:text-slate-300 dark:bg-slate-800 backdrop-blur dark:border-slate-700 border border-neutral-300 w-full p-2 rounded-sm   focus:outline-none focus:border-blue-400 disabled:bg-slate-200/60 
    focus:dark:border-indigo-500 dark:disabled:bg-slate-950 `;

  return (
    <input 
      className={defaultClasses + ' ' + (props.additionalclasses ?? '')}
      {...props}
    />
  );
};
export default Input;
