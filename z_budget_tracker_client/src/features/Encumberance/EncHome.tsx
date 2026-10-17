import EncumbranceForm, { type Encumbrance } from './EncForm';

const EncHome = () => {

  function onAddEncumbrance(encumbrance: Encumbrance) {

    console.log('encumbrance', encumbrance)
  };

  return (
    <EncumbranceForm
      budgetCategories={[]}
      onAddEncumbrance={onAddEncumbrance}
    ></EncumbranceForm>
  );
};
export default EncHome;
