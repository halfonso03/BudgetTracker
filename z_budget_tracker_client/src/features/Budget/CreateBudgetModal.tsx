import { useState } from 'react';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Select from '../../components/Select';
import useInitiatives from '../../api/hooks/useInitiatives';
import useGrants from '../../api/hooks/useGrants';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

interface Props {
  year: number;
  onCancelForm: () => void;
}

const CreateBudgetModal = ({ onCancelForm, year }: Props) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: inits = [], isLoading: loadingInitiatives } = useInitiatives();
  const [initiativeId, setInitiativeId] = useState<number>(0);
  let sortedInitiatives: Initiative[] = [];

  const { data: loadedGrants = [], isLoading: loadingGrants } = useGrants(year);
  const [grantId, setGrantId] = useState<number>(0);
  let grants: Grant[] = [];

  const [error, setError] = useState<string>('');

  if (inits) {
    sortedInitiatives = [{ id: 0, name: 'Choose an initiative ...' }, ...inits];
  }

  if (loadedGrants) {
    grants = [{ id: 0, name: 'Choose a grant ...' }, ...loadedGrants];
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

  return (
    <Modal
      isOpen={true}
      onCancel={onCancelForm}
      size="md"
      title="Create Budget"
      animateOut={false}
    >
      <div className="p-5 pt-1">
        <div className="flex flex-col gap-4 mb-4 ">
          <div>
            <div className="self-center entity-label">YEAR</div>
            <div className="self-center ">{year}</div>
          </div>
          <div>
            <div className="self-center entity-label">Initiative</div>
            <div>
              {loadingInitiatives ? (
                <div>Loading inits</div>
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
            <div className="self-center entity-label">Award</div>
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
                  {grants.map((i) => (
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
          <Button onClick={onCancelForm} variation="secondary">
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
export default CreateBudgetModal;
