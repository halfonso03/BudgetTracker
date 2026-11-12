import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import useGrants from '../../../api/hooks/common/useGrants';
import useInitiatives from '../../../api/hooks/common/useInitiatives';
import Button from '../../../components/Button';
import Select from '../../../components/Select';
import Modal2 from '../../../components/Modal2';
import Label from '../../../components/Label';

interface Props {
  isOpen: boolean;
  onCancel: () => void;
  year: number;
}

const CreateBudgetModal = ({ year, ...props }: Props) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { initiatives: inits = [], loadingInit } = useInitiatives();
  const [initiativeId, setInitiativeId] = useState<number>(0);
  let sortedInitiatives: Initiative[] = [];
  const [animateOut, setAnimateOut] = useState(false);

  const { grants = [], loadingGrants } = useGrants(year);
  const [grantId, setGrantId] = useState<number>(0);
  let grantsList: Grant[] = [];

  const [error, setError] = useState<string>('');

  if (inits) {
    sortedInitiatives = [{ id: 0, name: 'Choose an initiative ...' }, ...inits];
  }

  if (grants) {
    grantsList = [{ id: 0, name: 'Choose a grant ...' }, ...grants];
  }

  function handleContinue() {
    const cachedBudgets: Budget[] =
      queryClient.getQueryData(['budgets', year]) ?? [];

    if (
      cachedBudgets.some(
        (b) => b.initiative_id == initiativeId && b.grant_id == grantId,
      )
    ) {
      setError('A budget already exists for the selections made.');
    } else {
      navigate(`/budget/new/${year}/${initiativeId}/${grantId}`);
    }
  }

  function closeModal() {
    props.onCancel();
    setAnimateOut(true);
    setTimeout(() => {
      setAnimateOut(false);
    }, 500);
  }
  return (
    <Modal2
      size="md"
      title="Create Budget"
      animateOut={animateOut}
      isOpen={props.isOpen}
      onCancel={props.onCancel}
    >
      <div className="p-3 pt-1">
        <div className="flex flex-col gap-4 mb-4 ">
          <div>
            <Label>
              <div className="self-center ">YEAR</div>
            </Label>
            <div className="self-center dark:text-white ">{year}</div>
          </div>
          <div>
            <div className="self-center ">
              <Label>Initiative</Label>
            </div>
            <div>
              {loadingInit ? (
                <div className="dark:text-white">Loading inits</div>
              ) : (
                <Select
                  value={initiativeId}
                  additionalclasses="rounded-sm "
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    if (+e.target.value == 0) return;
                    setInitiativeId(+e.target.value);
                    setError('');
                  }}
                >
                  {sortedInitiatives.map((i) => (
                    <option value={i.id} key={i.id}>
                      {i.name}
                    </option>
                  ))}
                </Select>
              )}
            </div>
          </div>

          <div>
            <div className="self-center">
              <Label>Award</Label>
            </div>
            <div>
              {loadingGrants ? (
                <div>Loading grants</div>
              ) : (
                <Select
                  value={grantId}
                  additionalclasses="rounded-sm "
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    if (+e.target.value == 0) return;
                    setGrantId(+e.target.value);
                    setError('');
                  }}
                >
                  {grantsList.map((i) => (
                    <option value={i.id} key={i.id}>
                      {i.id == 0 ? `${i.name}` : `${i.name} - ${i.fiduciary}`}
                    </option>
                  ))}
                </Select>
              )}
            </div>
          </div>
        </div>

        {/* <div>message</div> */}
        {error && <div className="text-red-500 my-3">{error}</div>}
        <div className="flex justify-end gap-2 mt-6">
          <Button
            variation="primary"
            disabled={initiativeId == 0 || grantId == 0}
            onClick={handleContinue}
          >
            Continue...
          </Button>
          <Button onClick={closeModal} variation="secondary">
            Cancel
          </Button>
        </div>
      </div>
    </Modal2>
  );
};
export default CreateBudgetModal;
