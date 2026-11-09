import { LogOutIcon, User } from 'lucide-react';
import { useState } from 'react';
import { useOutsideClick } from '../hooks/useOutsideClick';
import useTheme from '../contexts/useTheme';

interface Props {
  loginId: string;
  logOut: () => void;
}

const AccountToggler = ({ loginId, logOut }: Props) => {
  const [isOpenerClass, setIsOpenerClass] = useState<string>('');
  const { isDark, setIsDark } = useTheme();

  const close = () => {
    setIsOpenerClass('');
  };

  const ref = useOutsideClick<HTMLDivElement>(close, false);

  return (
    <div className="relative" ref={ref}>
      <div>
        <User
          onClick={() =>
            setIsOpenerClass((prev) => (prev == ' open ' ? '' : ' open '))
          }
          className="text-neutral-600 dark:text-slate-200 cursor-pointer"
        ></User>
      </div>

      <div
        className={` absolute flex flex-col w-60 right-0 top-8  z-100 menu ${isOpenerClass} border  dark:border-slate-700/60 bg-neutral-50 dark:bg-slate-800 border-neutral-100 shadow-lg`}
      >
        <div className="border border-neutral-300 text-[1rem] dark:border-neutral-700 p-2 rounded-t-md">
          {loginId}
        </div>
        <div className="border border-neutral-200 dark:border-slate-700/60 border-t-0 p-2">
          <div className="text-sm text-gray-700 dark:text-neutral-300 mb-2">
            Theme:
          </div>
          <div>
            <div className="flex gap-2 pl-3 rounded-sm dark:text-neutral-300 dark:hover:bg-slate-700/80 hover:bg-gray-300 transition-alll duration-300">
              <div className="text-sm text-gray-700 dark:text-neutral-300 flex items-center ">
                {!isDark ? (
                  <div className="rounded-full p-[.2rem]  bg-neutral-500 border-3 border-neutral-500 dark:bg-slate-800  dark:border-neutral-400 "></div>
                ) : (
                  <div className="rounded-full border border-transparent p-[.2rem]"></div>
                )}
              </div>
              <div
                onClick={() => {
                  setIsDark(false);
                  setIsOpenerClass('');
                }}
                className="text-sm self-center cursor-pointer text-gray-700 dark:text-neutral-300 transition-all duration-300 p-1 flex-1"
              >
                Light
              </div>
            </div>
            <div className="flex gap-2 pl-3 rounded-sm dark:text-neutral-300 dark:hover:bg-slate-700/80 hover:bg-gray-300 transition-alll duration-300">
              <div className="text-sm text-gray-700 dark:text-neutral-300 flex items-center ">
                {isDark ? (
                  <div className="rounded-full p-[.2rem]  bg-neutral-500 border-3 border-neutral-500 dark:bg-slate-800  dark:border-neutral-400 "></div>
                ) : (
                  <div className="rounded-full border border-transparent p-[.2rem]"></div>
                )}
              </div>
              <div
                onClick={() => {
                  setIsDark(true);
                  setIsOpenerClass('');
                }}
                className="text-sm self-center cursor-pointer text-gray-700 dark:text-neutral-300 transition-all duration-300 p-1 flex-1"
              >
                Dark
              </div>
            </div>
          </div>
        </div>
        <div className="border border-neutral-300 dark:border-neutral-700 border-t-0 p-2 rounded-b-md ">
          <div
            className="flex items-center cursor-pointer gap-1 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-300 dark:hover:bg-slate-700/80   duration-350 transition-all p-1 rounded-sm pl-2"
            onClick={() => logOut()}
          >
            <LogOutIcon size={15}></LogOutIcon>
            <div>Log Out</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AccountToggler;
