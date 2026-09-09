import React from 'react';

type Props = {
  id: number;
  status: number;
  created: boolean;
};

const SAVED = 2;
const POSTED = 3;

const IdHeader = React.memo(({ id, status, created }: Props) => {
  return (
    <div className={`flex gap-10 ${created ? '' : 'animate-page-fade-in'}`}>
      <div className="flex gap-3 ml-3">
        <span className="font-semibold text-neutral-500">ID</span>
        <div>
          {id == 0 ? (
            <div className="font-semibold">-</div>
          ) : (
            <div className="font-semibold">{id}</div>
          )}
        </div>
      </div>
      <div className="flex gap-3 font-semibold">
        <span className=" text-neutral-500">STATUS</span>
        {id == 0 ? (
          <div>Draft</div>
        ) : status === POSTED ? (
          <div>Posted</div>
        ) : status === SAVED ? (
          <div>Saved</div>
        ) : (
          <div>Editing</div>
        )}
      </div>
    </div>
  );
});
export default IdHeader;
