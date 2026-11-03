import { useState, type ReactNode } from 'react';
import './Tooltip.css';


type Props = {
    text:string,
    position:string
    children: ReactNode
}
export default function Tooltip({ text, children, position = 'top' }: Props) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="tooltip-container"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}  /* Accessibility for keyboard users */ 
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`tooltip-box tooltip-${position}`} role="tooltip">
          {text}
          <span className="tooltip-arrow" />
        </div>
      )}
    </div>
  );
}
