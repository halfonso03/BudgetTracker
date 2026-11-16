import { Info } from 'lucide-react';
import { useState } from 'react';

type Props = {
  index: number;
  expandIndex: (index: number) => void;
  collapseIndex: (index: number) => void;
};

const ScoreCardExplanationExpander = (props: Props) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <Info
        size={16}
        className={`dark:text-slate-300 text-blue-500 cursor-pointer`}
        onClick={(e) => {
          if (expanded) {
            props.collapseIndex(props.index);
          } else {
            props.expandIndex(props.index);
          }
          setExpanded(!expanded);
          e.stopPropagation();
        }}
      ></Info>
    </>
  );
};
export default ScoreCardExplanationExpander;
