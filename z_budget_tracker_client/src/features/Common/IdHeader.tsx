import React from 'react';
import { POSTED, SAVED } from '../../app/constants';

type Props = {
  id: number;
  status: number;
  created: boolean;
};



const IdHeader = React.memo(({ id, status, created }: Props) => {
  // console.log('IdHeader render');

  return (
    <div className={`flex gap-10 ${created ? '' : 'animate-page-fade-in'}`}>
      <div className="flex gap-3 ">
        <span className="font-medium text-neutral-500">ID</span>
        <div className="w-10">
          {id == 0 ? (
            <div className="font-medium">-</div>
          ) : (
            <div className="font-medium ">{id}</div>
          )}
        </div>
      </div>
      <div className="flex gap-3 font-medium">
        <span className=" text-neutral-500">STATUS</span>
        {id == 0 ? (
          <div>Draft</div>
        ) : status === POSTED ? (
          <div>Posted</div>
        ) : status === SAVED ? (
          <div>Saved</div>
        ) : (
          <div className='text-yellow-600/90 font-semibold tracking-wider'>Editing</div>
        )}
      </div>
    </div>
  );
});
export default IdHeader;
