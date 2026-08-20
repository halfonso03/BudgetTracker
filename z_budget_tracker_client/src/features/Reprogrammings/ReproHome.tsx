import { useState } from 'react';
import { Copy, Menu, Plus, Search, Trash } from 'lucide-react';
import useInitiatives from '../../api/hooks/common/useInitiatives';
import Button from '../../components/Button';
import ChooseYearModal from './ChooseYearModal';
import useGrants from '../../api/hooks/common/useGrants';
import AddLineModal from './AddLineModal';
import NumericInput from '../../components/NumericInput';
import { formatCurrency } from '../../app/util';
import Menus from '../../components/menus/Menus';
import MenuIdProvider from '../../contexts/MenuIdContext';
import ConfirmModal from '../../components/ConfirmModal';

import Dropdown, { type Option } from 'react-dropdown';
import 'react-dropdown/style.css';
import useCategories from '../../api/hooks/common/useCategories';

const ReproHome = () => {
  const [reproId, setReproId] = useState('');
  const [choosingYear, setChoosingYear] = useState(false);
  const [year, setYear] = useState<number>(0);

  const [addingLine, setAddingLine] = useState(false);
  const [isDiscarding, setIsDiscarding] = useState(false);
  const [lines, setLines] = useState<ReproLineItem[]>([]);

  const [animateOutYearSelect, setAnimateOutYearSelect] =
    useState<boolean>(false);
  const [animateOutAddLine, setAnimateOutAddLine] = useState<boolean>(false);
  const [animateOutDiscarding, setAnimateOutDiscarding] =
    useState<boolean>(false);

  const { data: initiatives } = useInitiatives();
  const { data: categories } = useCategories();
  const { data: grants } = useGrants(year);

  const [repro, setRepro] = useState<Repro | null>(null);

  const handleAccountChange = (option: Option, rowUuid: string) => {
    setLines((prev) => {
      const otherLines = prev.filter((x) => x.uuid !== rowUuid);
      const updatedLine = prev.filter((x) => x.uuid === rowUuid)[0];
      updatedLine.accountId = +option.value;
      updatedLine.accountName = option.label!.toString();
      return [...otherLines, updatedLine];
    });
  };

  function handleLineAdded(line: ReproLineItem) {
    setAnimateOutAddLine(true);
    setTimeout(() => {
      setAddingLine(false);
      setAnimateOutAddLine(false);
    }, 500);
    setLines((prev) => [...prev, line]);
  }

  function deleteRow(uuid: string) {
    setLines((prev) => {
      const newLines = prev.filter((x) => x.uuid !== uuid);
      return newLines;
    });
  }

  function duplicateRow(uuid: string) {
    const line = lines.filter((x) => x.uuid == uuid)[0];
    setLines((prev) => [
      ...prev,
      { ...line, uuid: window.crypto.randomUUID() },
    ]);
  }

  return (
    <MenuIdProvider>
      <div className="">
        <div className="flex justify-end gap-3">
          <Button
            buttonSize="small"
            variation="primary"
            onClick={() => setChoosingYear(true)}
            disabled={year > 0}
          >
            Start New...
          </Button>
          <Button
            buttonSize="small"
            variation="secondary"
            disabled={year > 0}
            onClick={() => {}}
          >
            <Search></Search>
          </Button>
          <Button
            variation="danger"
            buttonSize="small"
            disabled={year === 0}
            onClick={() => {
              setIsDiscarding(true);

              // setYear(0);
              // setLines([]);
            }}
          >
            Discard
          </Button>
        </div>
      </div>

      <div className="flex gap-10 mb-6">
        {year > 0 && (
          <div>
            <span className="text-neutral-500 font-bold mr-4">Year</span>
            <span className="font-semibold">{year}</span>
          </div>
        )}

        <div>
          {year > 0 && (
            <div>
              <span className="text-neutral-500 font-bold mr-4">ID</span>
              <span className="font-semibold">
                {reproId == '' ? '-' : reproId}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="mb-8">
        {year > 0 && (
          <Button
            buttonSize="small"
            onClick={() => {
              setAddingLine(true);
            }}
          >
            <Plus></Plus>
            Add Line
          </Button>
        )}
      </div>
      <div>
        {lines.length > 0 && (
          <div>
            <div className="grid grid-cols-[1.5fr_1fr_.8fr_1.7fr_1fr_.8fr_.8fr_.8fr_.4fr]  px-3 py-4 font-bold text-neutral-500">
              <div className="pl-1">Initiative</div>
              <div>Grant</div>
              <div>Category</div>
              <div>Account</div>
              <div className="text-center">Current Amount</div>
              <div className="text-end pr-2">Increase</div>
              <div className="text-end pr-2">Decrease</div>
              <div className="text-end pr-2">New Amount</div>
              <div></div>
            </div>
          </div>
        )}
        {lines.map((item: ReproLineItem) => {
          const isLastRow = false;

          const category = categories!.filter(
            (x: Category) => x.id == item.categoryId,
          )[0];

          const accounts = category!.accounts!.map((a) => {
            return {
              value: a.id,
              label: a.name,
            };
          });

          return (
            <div
              className="grid grid-cols-[1.5fr_1fr_.8fr_1.7fr_1fr_.8fr_.8fr_.8fr_.4fr] "
              key={item.uuid}
            >
              <div className=" pr-2">{item.initiativeName}</div>
              <div>{item.grantName}</div>
              <div>{item.categoryName}</div>
              <div>
                <Dropdown
                  aria-label="Number"
                  options={accounts}
                  renderOption={(option, { active, selected }) => (
                    <div>
                      <div>
                        <div className="flex gap-1">
                          {selected ? '✓ ' : ''}
                          <div
                            className={`text-neutral-900 ${selected} : "" : "pl-20"`}
                          >
                            {option.label}
                          </div>
                        </div>
                      </div>
                      <div className="text-neutral-500 pl-4">
                        {formatCurrency(1000)}
                      </div>
                    </div>
                  )}
                  onChange={(option) => {
                    handleAccountChange(option, item.uuid);
                  }}
                  value={item.accountId}
                  placeholder={item.accountName}
                />
              </div>
              <div className="text-center">
                {formatCurrency(item.currentBudget)}
              </div>
              <div className="flex justify-end">
                <NumericInput
                  key={item.accountId}
                  // register={amountRegister}
                  readOnly={false}
                  disabled={false}
                  className={`rounded-sm w-[98%] ml-2 p-1 pr-2 py-2  ${isLastRow ? '  font-bold text-neutral-600  ' : ' border border-neutral-200 focus:outline-none focus:ring-0 focus:ring-offset-0'}`}
                  onClick={() => {}}
                  onBlur={() => {}}
                  onFocus={() => {}}
                />
              </div>
              <div className="flex justify-end">
                <NumericInput
                  key={item.accountId}
                  // register={amountRegister}
                  readOnly={false}
                  disabled={false}
                  className={`rounded-sm w-[98%] ml-2 p-1 pr-2 py-2  ${isLastRow ? '  font-bold text-neutral-600  ' : ' border border-neutral-200 focus:outline-none focus:ring-0 focus:ring-offset-0'}`}
                  onClick={() => {}}
                  onBlur={() => {}}
                  onFocus={() => {}}
                />
              </div>
              <div className="text-end">{formatCurrency(1234.56)}</div>
              <div className="flex justify-end text-neutral-400 pr-3">
                <Menus>
                  <Menus.Toggler id={item.uuid}>
                    <Menu size={20}></Menu>
                  </Menus.Toggler>
                  <Menus.List id={item.uuid}>
                    <Menus.MenuItem onClick={() => duplicateRow(item.uuid)}>
                      <Copy></Copy>&nbsp;&nbsp;Duplicate Row
                    </Menus.MenuItem>
                    <Menus.MenuItem onClick={() => deleteRow(item.uuid)}>
                      <Trash className="text-red-500"></Trash>&nbsp;&nbsp;Delete
                      Row
                    </Menus.MenuItem>
                  </Menus.List>
                </Menus>
              </div>
            </div>
          );
        })}
      </div>
      <ChooseYearModal
        isOpen={choosingYear}
        animateOut={animateOutYearSelect}
        onYearSelected={(year: number) => {
          setAnimateOutYearSelect(true);
          setYear(year);
          setTimeout(() => {
            setChoosingYear(false);
            setAnimateOutYearSelect(false);

            setRepro(null);
          }, 500);
        }}
        onCancel={() => {
          setAnimateOutYearSelect(true);
          setTimeout(() => {
            setChoosingYear(false);
            setAnimateOutYearSelect(false);
          }, 500);
        }}
      ></ChooseYearModal>

      <AddLineModal
        key={new Date().getMilliseconds()}
        isOpen={addingLine}
        animateOut={animateOutAddLine}
        initiatives={initiatives}
        grants={grants}
        categories={categories}
        onCancel={() => {
          setAnimateOutAddLine(true);
          setTimeout(() => {
            setAddingLine(false);
            setAnimateOutAddLine(false);
          }, 500);
        }}
        onLineAdded={handleLineAdded}
      ></AddLineModal>

      <ConfirmModal
        key={new Date().getMilliseconds()}
        isOpen={isDiscarding}
        animateOut={animateOutDiscarding}
        onCancel={() => {
          setAnimateOutDiscarding(true);
          setTimeout(() => {
            setIsDiscarding(false);
            setAnimateOutDiscarding(false);
          }, 500);
        }}
        onConfirm={() => {
          setAnimateOutDiscarding(true);
          setTimeout(() => {
            setLines([]);
            setIsDiscarding(false);
            setAnimateOutDiscarding(false);
            setYear(0);
          }, 500);
        }}
        message={'Are you sure you wish to discard this reprogramming?'}
      ></ConfirmModal>
    </MenuIdProvider>
  );
};
export default ReproHome;
