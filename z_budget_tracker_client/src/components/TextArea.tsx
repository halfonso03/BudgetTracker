interface CustomInputProps extends React.ComponentPropsWithoutRef<'textarea'> {
  additionalclasses?: string;
}

const TextArea = (props: CustomInputProps) => {
  const defaultClasses = `w-full p-2 rounded-sm border border-neutral-300 focus:outline-none focus:border-neutral-400 dark:focus:border-indigo-400 disabled:bg-neutral-300 
     dark:disabled:bg-neutral-950 dark:text-neutral-100 dark:bg-slate-800 dark:border-slate-500`;

  return (
    <textarea
      className={defaultClasses + ' ' + (props.additionalclasses ?? '')}
      {...props}
    />
  );
};
export default TextArea;
