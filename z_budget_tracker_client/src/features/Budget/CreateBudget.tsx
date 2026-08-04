import { useParams } from 'react-router-dom';

const CreateBudget = () => {
  const { year, initiativeId, grantId } = useParams();

  console.log( year, initiativeId, grantId)

  return <div></div>;
};
export default CreateBudget;
