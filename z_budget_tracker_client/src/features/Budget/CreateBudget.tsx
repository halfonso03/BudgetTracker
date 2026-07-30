import { useParams } from 'react-router-dom';

const CreateBudget = () => {
  const { initiativeId, grantId } = useParams();

  return <div>CreateBudget</div>;
};
export default CreateBudget;
