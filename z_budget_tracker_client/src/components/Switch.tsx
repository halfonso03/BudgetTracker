import './Switch.css';

type Props = {
  isOn: boolean;
  handleToggle: () => void;
};

const Switch = ({ isOn, handleToggle }: Props) => {
  return (
    <div>
      <input
        checked={isOn}
        onChange={handleToggle}
        className="react-switch-checkbox"
        id={`react-switch-new`}
        type="checkbox"
      />
      <label
        className={`react-switch-label ${isOn ? 'bg-blue-700': 'bg-neutral-500' }`}
        htmlFor={`react-switch-new`}
      >
        <span className={`react-switch-button`} />
      </label>
    </div>
  );
};

export default Switch;
