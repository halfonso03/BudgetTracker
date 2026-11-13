import React from 'react';
import { POSTED, SAVED } from '../../app/constants';
import Label from '../../components/Label';

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
        <Label>ID</Label>
        <div className="w-10 dark:text-white font-medium">
          {id == 0 ? <div>-</div> : <div>{id}</div>}
        </div>
      </div>
      <div className="flex gap-3 font-medium dark:text-indigo-100">
        <Label>STATUS</Label>
        {id == 0 ? (
          <div>Draft</div>
        ) : status === POSTED ? (
          <div>Posted</div>
        ) : status === SAVED ? (
          <div>Saved</div>
        ) : (
          <div className="text-blue-700 font-semibold tracking-wider dark:text-indigo-400">
            EDITING
          </div>
        )}
      </div>
    </div>
  );
});
export default IdHeader;
