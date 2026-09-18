import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Fragment } from 'react/jsx-runtime';
import { useOutsideClick } from '../../hooks/useOutsideClick';

type Props = {
  selectedItemLabel: string;
  children: React.ReactNode;
  outsideShowList: boolean;
  usaOutsideShowList: boolean;
  outsideClicked?: () => void;
  listOpened?: () => void;
};

const ReproSearchFilter = ({
  usaOutsideShowList,
  outsideShowList,
  selectedItemLabel,
  outsideClicked,
  listOpened,
  children,
}: Props) => {
  const [showList, setShowList] = useState(
    usaOutsideShowList ? outsideShowList : false,
  );
  //   const [outsideListOpenedeState, setOutsideListOpenState] = useState(false);

  const ref = useOutsideClick<HTMLDivElement>(() => {
    if (usaOutsideShowList) {
      outsideClicked?.();
    } else {
      setShowList(false);
    }
  }, false);

  let show: boolean;

  if (usaOutsideShowList) {
    show = outsideShowList || showList;
  } else {
    show = showList;
  }

  return (
    <Fragment>
      {/* <div>{id}</div>
      {show ? <span>SHOW</span> : <span>no show</span>} */}
      <div className="relative" ref={ref}>
        <div className="flex">
          <button
            className="rounded-md border border-neutral-300 py-2 px-3 font-semibold flex cursor-pointer text-neutral-700 items-center w-45"
            onClick={() => {
              if (usaOutsideShowList) {
                listOpened?.();
              } else {
                setShowList((prev) => !prev);
              }
            }}
          >
            <div className="grow">{selectedItemLabel}</div>
            <div>
              {usaOutsideShowList && outsideShowList && <ChevronUp></ChevronUp>}
              {usaOutsideShowList && !outsideShowList && (
                <ChevronDown></ChevronDown>
              )}
              {!usaOutsideShowList && (
                <ChevronUp
                  className={`${!showList ? 'hidden' : ''}`}
                ></ChevronUp>
              )}
              {!usaOutsideShowList && (
                <ChevronDown
                  className={`${showList ? 'hidden' : ''}`}
                ></ChevronDown>
              )}
              {/* <ChevronDown
                className={`${!showList ? 'hidden' : ''}`}
              ></ChevronDown> */}
            </div>
          </button>
        </div>
        <div className={`${show ? '' : 'hidden'}`}>{children}</div>
      </div>
    </Fragment>
  );
};
export default ReproSearchFilter;
