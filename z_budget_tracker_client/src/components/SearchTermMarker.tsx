type Props = {
  textToDisplay: string | undefined;
  textToFind: string;
};

export default function SearchTermMarker({ textToDisplay, textToFind }: Props) {
  if (!textToDisplay) return null;
  if (!textToFind) return <div>{textToDisplay}</div>;

  const textToFindLowerCase = textToFind.toLocaleLowerCase();
  const textToDisplayLowerCase = textToDisplay.toLocaleLowerCase();
  const indexOfTextToFind = textToDisplayLowerCase.indexOf(textToFindLowerCase);

  if (indexOfTextToFind == -1) return <div>{textToDisplay}</div>;

  const p1 = textToDisplay.substring(0, indexOfTextToFind);
  const p2 = () => (
    <span>
      {textToDisplay.substring(
        indexOfTextToFind,
        indexOfTextToFind + textToFind.length,
      )}
    </span>
  );
  const p3 = textToDisplay.substring(
    indexOfTextToFind + textToFind.length,
    textToDisplay.length,
  );

  return (
    <div>
      {p1}
      <mark className="font-semibold">{p2()}</mark>
      {p3}
    </div>
  );
}
