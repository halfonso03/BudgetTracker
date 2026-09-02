type Props = {
  results: ReproSearchResult[];
};

const ReproSearchReults = ({ results }: Props) => {
  return (
    <div>
      {results.map((r) => (
        <div key={r.id}>{r.id}</div>
      ))}
    </div>
  );
};
export default ReproSearchReults;
