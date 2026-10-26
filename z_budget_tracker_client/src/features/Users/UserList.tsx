// components/UserList.tsx
import React from 'react';
import { useUsersQuery } from '../../api/hooks/users/useUsersQuery';
import MenuIdProvider from '../../contexts/MenuIdContext';
import Menus from '../../components/menus/Menus';
import { EllipsisVertical } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserMutations } from '../../api/hooks/users/useUserMutations';
import toast from 'react-hot-toast';

export const UserList: React.FC = () => {
  const { data: users, isLoading, error } = useUsersQuery();
  const navigate = useNavigate();
  const { changeAccountLockStatus, forceResetPassword } = useUserMutations();

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
    <MenuIdProvider>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-neutral-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Is Locked
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Failed Logins
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 ">
            {users?.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-neutral-200 cursor-pointer transition-all duration-200"
                onClick={() => navigate(`${user.id.toString()}`)}
              >
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap  text-gray-600">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap  text-gray-600">
                  {user.lastLoginDate
                    ? new Date(user.lastLoginDate).toLocaleString()
                    : 'Never'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap  text-gray-600">
                  {user.isLocked ? 'Yes' : 'No'}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap ${user.accessFailedCount > 0 ? ' text-red-500' : 'text-gray-600'}`}
                >
                  {user.accessFailedCount}
                </td>
                <td>
                  <Menus>
                    <Menus.Toggler id={user.id.toString()}>
                      <EllipsisVertical
                        size={20}
                        className="text-neutral-500"
                      ></EllipsisVertical>
                    </Menus.Toggler>
                    <Menus.List
                      topPos="translate-y-0"
                      leftPos="translate-x-5"
                      id={user.id.toString()}
                    >
                      <Menus.MenuItem>
                        <Link to={`${user.id}`} className="px-1">
                          Details
                        </Link>
                      </Menus.MenuItem>
                      <Menus.MenuItem>
                        <div
                          className="px-1"
                          onClick={() =>
                            onLockAccountStatus(user.id, user.isLocked)
                          }
                        >
                          {user.isLocked ? 'Unlock Account' : 'Lock Account'}
                        </div>
                      </Menus.MenuItem>
                      <Menus.MenuItem>
                        <div
                          className="px-1"
                          onClick={() => onForceResetPassword(user.id)}
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
    </MenuIdProvider>
  );
};
