// components/UserList.tsx
import React from 'react';
import { useUsersQuery } from '../../../api/hooks/users/useUsersQuery';
import Menus from '../../../components/menus/Menus';
import { EllipsisVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserMutations } from '../../../api/hooks/users/useUserMutations';
import toast from 'react-hot-toast';
import Button from '../../../components/Button';
import SortBySelector from '../../../components/SortBySelector';
import { useSortingContext } from '../../../contexts/useSortingContext';

export const UserList: React.FC = () => {
  const { data: users, isLoading, error } = useUsersQuery();
  const navigate = useNavigate();
  const { changeAccountLockStatus, forceResetPassword } = useUserMutations();
  const { sortByValue } = useSortingContext();

  async function onLockAccountStatus(id: number, locked: boolean) {
    await changeAccountLockStatus.mutateAsync(
      { id: id.toString(), locked: !locked },
      {
        onSuccess: () => {
          if (locked) {
            toast.success('Account unlocked.');
          } else {
            toast.success('Account locked.');
          }
        },
        onError: () => {
          toast.error('Account lock/unlock failed.');
        },
      },
    );
  }
  // const { close } = useMenuId();

  async function onForceResetPassword(id: number) {
    await forceResetPassword.mutateAsync(id.toString(), {
      onSuccess: () => {
        toast.success('Password reset successfull.');
      },
      onError: () => {
        toast.error('Password reset failed.');
      },
    });
  }

  if (isLoading) return <p className="text-gray-500">Loading users...</p>;
  if (error)
    return <p className="text-red-600">Error loading users: {error.message}</p>;

  return (
    <>
      <div className="mb-8 flex justify-end">
        <Button
          buttonSize="small"
          additionalclasses="py-2"
          variation="primary"
          onClick={() => navigate('new')}
        >
          Create User
        </Button>
      </div>

      <div className="overflow-x-auto rounded-md border border-neutral-300/60 dark:border-slate-700/80">
        <table className="min-w-full ">
          <thead className=" bg-gray-50 text-neutral-600 dark:text-slate-700/80 dark:bg-slate-800/80 border-b border-b-neutral-300/60 dark:border-b-slate-700/80">
            <th className="p-3 flex justify-start  ">
              <SortBySelector
                label="NAME"
                value="name"
                currentSortValue={sortByValue}
              ></SortBySelector>
            </th>
            <th className="p-3 ">
              <SortBySelector
                label="EMAIL"
                value="email"
                currentSortValue={sortByValue}
              ></SortBySelector>
            </th>
            <th className="p-3 ">
              <SortBySelector
                label="LAST LOGIN"
                value="lastLogin"
                currentSortValue={sortByValue}
              ></SortBySelector>
            </th>
            <th className="p-3 flex justify-center">
              <div className="flex justify-center">
                <SortBySelector
                  label="IS LOCKED"
                  value="isLocked"
                  currentSortValue={sortByValue}
                ></SortBySelector>
              </div>
            </th>
            <th className=" dark:text-white">
              <div className="flex justify-center">
                <div className="flex justify-center">
                  <SortBySelector
                    label="ACCESS FAILED COUNT"
                    value="accessFailedCount"
                    currentSortValue={sortByValue}
                  ></SortBySelector>
                </div>
              </div>
            </th>
            <th></th>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr
                key={user.id}
                className="cursor-pointer dark:text-white hover:bg-neutral-200/60 dark:hover:bg-slate-700 border-b border-b-neutral-300/60 dark:border-slate-700/80 last:border-0 transition-all"
                onClick={() => navigate(`${user.id.toString()}`)}
              >
                <td className=" p-3 ">
                  {user.firstName} {user.lastName}
                </td>
                <td className=" p-3 ">{user.email}</td>
                <td className=" p-3 ">
                  {user.lastLoginDate
                    ? new Date(user.lastLoginDate).toLocaleString()
                    : 'Never'}
                </td>
                <td className="text-center">{user.isLocked ? 'Yes' : 'No'}</td>
                <td
                  className={`dark:text-white text-center whitespace-nowrap ${user.accessFailedCount > 0 ? ' text-red-500 dark:text-rose-500' : 'text-gray-600'}`}
                >
                  {user.accessFailedCount}
                </td>
                <td className='p-3 flex justify-center items-center '>
                  <Menus>
                    <Menus.Toggler id={user.id.toString()}>
                      <EllipsisVertical
                        size={20}
                        className="text-neutral-500 dark:text-slate-300"
                      ></EllipsisVertical>
                    </Menus.Toggler>
                    <Menus.List
                      topPos="translate-y-16"
                      leftPos="translate-x-28"
                      id={user.id.toString()}
                    >
                      <Menus.MenuItem>
                        <div
                          className="pl-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(user.id.toString());
                          }}
                        ></div>
                        Details
                      </Menus.MenuItem>
                      <Menus.MenuItem>
                        <div
                          className="px-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            close();
                            onLockAccountStatus(user.id, user.isLocked);
                          }}
                        >
                          {user.isLocked ? 'Unlock Account' : 'Lock Account'}
                        </div>
                      </Menus.MenuItem>
                      <Menus.MenuItem>
                        <div
                          className="px-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            onForceResetPassword(user.id);
                          }}
                        >
                          Force Password Reset
                        </div>
                      </Menus.MenuItem>
                    </Menus.List>
                  </Menus>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
