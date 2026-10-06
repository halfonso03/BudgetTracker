import { useState, useMemo } from 'react';
import { ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';

// Define the Data Type
interface Item {
  id: number;
  name: string;
  address: string;
  email: string;
  age: number;
  weight: number;
}

// Mock Data
const MOCK_DATA: Item[] = [
  {
    id: 1,
    name: 'Alex Johnson',
    address: '123 Pine St, Seattle',
    email: 'alex@example.com',
    age: 28,
    weight: 165,
  },
  {
    id: 2,
    name: 'Sarah Miller',
    address: '456 Oak Ave, Austin',
    email: 'sarah@example.com',
    age: 34,
    weight: 140,
  },
  {
    id: 3,
    name: 'Michael Chang',
    address: '789 Maple Dr, Chicago',
    email: 'michael@example.com',
    age: 41,
    weight: 195,
  },
  {
    id: 4,
    name: 'Emily Davis',
    address: '101 Birch Rd, Boston',
    email: 'emily@example.com',
    age: 25,
    weight: 125,
  },
  {
    id: 5,
    name: 'David Wilson',
    address: '202 Elm St, Denver',
    email: 'david@example.com',
    age: 52,
    weight: 180,
  },
  {
    id: 6,
    name: 'Jessica Taylor',
    address: '303 Cedar Ln, Miami',
    email: 'jess@example.com',
    age: 31,
    weight: 135,
  },
];

type SortKey = 'name' | 'address' | 'email' | 'age' | 'weight';
type SortOrder = 'asc' | 'desc' | null;

function MinimalistTable() {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Sorting Logic
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      if (sortOrder === 'asc') setSortOrder('desc');
      else if (sortOrder === 'desc') {
        setSortOrder(null);
        setSortKey(null);
      }
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedData = useMemo(() => {
    const data = [...MOCK_DATA];
    if (!sortKey || !sortOrder) return data;

    return data.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [sortKey, sortOrder]);

  // Pagination Logic
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage]);

  const RenderSortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return null;
    return sortOrder === 'asc' ? (
      <ArrowUp size={14} className="ml-1" />
    ) : (
      <ArrowDown size={14} className="ml-1" />
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-white font-sans text-neutral-800">
      {/* Table Header / Title */}
      <div className="mb-6">
        <h1 className="text-xl font-medium text-neutral-900">
          Directory
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          A clean overview of user profiles and metrics.
        </p>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto border border-neutral-100 rounded-lg">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/50 text-neutral-500 font-medium">
              {(['name', 'address', 'email', 'age', 'weight'] as SortKey[]).map(
                (col) => (
                  <th
                    key={col}
                    onClick={() => handleSort(col)}
                    className="px-6 py-3 cursor-pointer hover:text-neutral-900 duration-150 transition-colors capitalize select-none"
                  >
                    <div className="flex items-center">
                      {col}
                      <RenderSortIcon column={col} />
                    </div>
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50">
            {paginatedData.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-neutral-50/50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-neutral-900">
                  {item.name}
                </td>
                <td className="px-6 py-4 text-neutral-500">{item.address}</td>
                <td className="px-6 py-4 text-neutral-500">{item.email}</td>
                <td className="px-6 py-4 text-neutral-500">{item.age}</td>
                <td className="px-6 py-4 text-neutral-500">
                  {item.weight} lbs
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-6 px-2 text-sm text-neutral-500">
        <span>
          Showing page{' '}
          <span className="font-medium text-neutral-900">{currentPage}</span> of{' '}
          {totalPages}
        </span>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-md hover:bg-neutral-50 text-neutral-600 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1.5 rounded-md transition-colors font-medium ${
                currentPage === page
                  ? 'bg-neutral-900 text-white'
                  : 'hover:bg-neutral-50 text-neutral-600'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md hover:bg-neutral-50 text-neutral-600 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MinimalistTable;
