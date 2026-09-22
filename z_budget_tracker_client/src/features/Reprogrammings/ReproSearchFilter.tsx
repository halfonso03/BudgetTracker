import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Fragment } from 'react/jsx-runtime';
import { useOutsideClick } from '../../hooks/useOutsideClick';

type Props = {
  selectedItemLabel: string;
  children: React.ReactNode;
  outsideShowList: boolean;
  parentCorntrolled: boolean;
  outsideClicked?: () => void;
  listOpened?: () => void;
};

const ReproSearchFilter = ({
  parentCorntrolled,
  outsideShowList,
  selectedItemLabel,
  outsideClicked,
  listOpened,
  children,
}: Props) => {
  const [showList, setShowList] = useState(
    parentCorntrolled ? outsideShowList : false,
  );

  const ref = useOutsideClick<HTMLDivElement>(() => {
    if (parentCorntrolled) {
      outsideClicked?.();
    } else {
      setShowList(false);
    }
  }, false);

  let show: boolean;

  if (parentCorntrolled) {
    show = outsideShowList || showList;
  } else {
    show = showList;
  }

  return (
    <Fragment>
      <div className="relative" ref={ref}>
        <div className="flex">
          <button
            className="rounded-md border border-neutral-300 py-2 px-3 font-semibold flex cursor-pointer text-neutral-700 items-center w-45"
            onClick={() => {
              if (parentCorntrolled) {
                listOpened?.();
              } else {
                setShowList((prev) => !prev);
              }
            }}
          >
            <div className="grow">{selectedItemLabel}</div>
            <div>
              {parentCorntrolled && outsideShowList && (
                <ChevronUp style={{ pointerEvents: 'none' }}></ChevronUp>
              )}
              {parentCorntrolled && !outsideShowList && (
                <ChevronDown style={{ pointerEvents: 'none' }}></ChevronDown>
              )}
              {!parentCorntrolled && (
                <ChevronUp
                  style={{ pointerEvents: 'none' }}
                  className={`${!showList ? 'hidden' : ''}`}
                ></ChevronUp>
              )}
              {!parentCorntrolled && (
                <ChevronDown
                  style={{ pointerEvents: 'none' }}
                  className={`${showList ? 'hidden' : ''}`}
                ></ChevronDown>
              )}
            </div>
          </button>
        </div>
        <div className={`${show ? 'animate-repro-fade-in' : 'hidden'}`}>{children}</div>
      </div>
    </Fragment>
  );
};
export default ReproSearchFilter;
