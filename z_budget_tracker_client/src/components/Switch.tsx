import './Switch.css';
import { v4 as uuidv4 } from 'uuid';

type Props = {
  isOn: boolean;
  handleToggle: () => void;
};

const Switch = ({ isOn, handleToggle }: Props) => {
  const id = uuidv4();
  return (
    <div>
      <input
        checked={isOn}
        onChange={() => {
          handleToggle();
        }}
        className="react-switch-checkbox"
        id={`react-switch-new_${id}`}
        type="checkbox"
      />
      <label
        className={`react-switch-label ${isOn ? 'bg-blue-700' : 'bg-neutral-500'}`}
        htmlFor={`react-switch-new_${id}`}
      >
        <span className={`react-switch-button`} />
      </label>
    </div>
  );
};

export default Switch;
