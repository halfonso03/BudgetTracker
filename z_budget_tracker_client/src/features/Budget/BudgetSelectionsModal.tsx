import { useState } from 'react';
import Button from '../../components/Button';
import Modal, { type ModalSize } from '../../components/Modal';
import Select from '../../components/Select';
import useInitiatives from '../../api/hooks/useInitiatives';

interface Props {
  year: number;
  size?: ModalSize;
  onCancelForm: () => void;
}

const BudgetSelectionsModal = ({ onCancelForm, year, size = 'lg' }: Props) => {
  const { data: inits = [], isLoading } = useInitiatives();

  const [initiativeId, setInitiativeId] = useState<number>(0);
  //   const [initiatives, setInitiatives] = useState<Initiative[]>([]);

  //   const { data } = useAvailableGrants(initiativeId);

  const [grants, setGrants] = useState<Grant[]>([]);

  return (
    <Modal
      isOpen={true}
      onClose={onCancelForm}
      size={size}
      title="Create Budget"
    >
      <div className="px-5 pt-1">
        <div className="grid grid-rows-2 grid-cols-[.3fr_1fr_1fr] gap-2">
          <div className='mb-1'>
            <div className="self-center font-bold text-neutral-400">YEAR</div>
            <div className="self-center ">{year}</div>
          </div>
          <div></div>
          <div></div>
          <div>Select Initiative</div>
          <div>
            {isLoading ? (
              <div>Loading inits</div>
            ) : (
              <Select
                value={initiativeId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setInitiativeId(+e.target.value)
                }
              >
                {inits.map((i) => (
                  <option value={i.id} key={i.id}>
                    {i.name}
                  </option>
                ))}
              </Select>
            )}
          </div>
          <div className="row-span-2 ">message</div>
          <div>Select Award</div>
          <div>
            <Select disabled={initiativeId === 0}>
              {grants.length > 0 && (
                <>
                  <option value="1">1</option>
                  <option value="2">2</option>
                </>
              )}
            </Select>
          </div>
        </div>
      </div>
      <div className="flex justify-end p-4">
        <Button onClick={onCancelForm} variation="secondary">
          Cancel
        </Button>
      </div>
    </Modal>
  );
};
export default BudgetSelectionsModal;
