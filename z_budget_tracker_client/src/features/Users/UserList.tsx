// components/UserList.tsx
import React from 'react';
import { useUsersQuery } from '../../api/hooks/users/useUsersQuery';

export const UserList: React.FC = () => {
  const { data: users, isLoading, error } = useUsersQuery();

  if (isLoading) return <p className="text-gray-500">Loading users...</p>;
  if (error)
    return <p className="text-red-600">Error loading users: {error.message}</p>;

  return (
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
              Lockout Enabled
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
              Failed Logins
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users?.map((user) => (
            <tr key={user.id}>
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
                {user.isLockoutEnabled ? 'Yes' : 'No'}
              </td>
              <td
                className={`px-6 py-4 whitespace-nowrap ${user.accessFailedCount > 0 ? ' text-red-500' : 'text-gray-600'}`}
              >
                {user.accessFailedCount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
