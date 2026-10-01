import './Switch.css';

type Props = {
  isOn: boolean;
  handleToggle: () => void;
};

const Switch = ({ isOn, handleToggle }: Props) => {
  const id = crypto.randomUUID()
  return (
    <div>
      <input
        checked={isOn}
        onChange={() => {
console.log('123', 123)
          handleToggle();
        }}
        className="react-switch-checkbox"
        id={`react-switch-new_${id}`}
        type="checkbox"
      />
      <label
        className={`react-switch-label ${isOn ? 'bg-blue-700': 'bg-neutral-500' }`}
        htmlFor={`react-switch-new_${id}`}
      >
        <span className={`react-switch-button`} />
      </label>
    </div>
  );
};

export default Switch;
