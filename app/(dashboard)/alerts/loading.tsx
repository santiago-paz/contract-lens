export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="h-9 w-40 bg-gray-200 rounded-sm" />
          <div className="h-4 w-72 bg-gray-200 rounded-sm mt-2" />
        </div>
        <div className="h-9 w-32 bg-gray-200 rounded-sm" />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex gap-0">
        {[1, 2, 3].map((i) => (
          <div key={i} className="px-5 py-3 flex items-center gap-2">
            <div className="h-4 w-4 bg-gray-200 rounded-sm" />
            <div className="h-3 w-20 bg-gray-200 rounded-sm" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {[20, 16, 28, 16, 20, 18, 14].map((w, i) => (
                <th key={i} className="px-5 py-3">
                  <div className={`h-3 bg-gray-200 rounded-sm`} style={{ width: `${w * 4}px` }} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[1, 2, 3, 4].map((row) => (
              <tr key={row}>
                <td className="px-5 py-4"><div className="h-3.5 w-24 bg-gray-200 rounded-sm" /></td>
                <td className="px-5 py-4"><div className="h-3.5 w-28 bg-gray-200 rounded-sm" /></td>
                <td className="px-5 py-4"><div className="h-3.5 w-40 bg-gray-200 rounded-sm" /></td>
                <td className="px-5 py-4"><div className="h-3.5 w-20 bg-gray-200 rounded-sm" /></td>
                <td className="px-5 py-4"><div className="h-5 w-20 bg-gray-200 rounded-sm" /></td>
                <td className="px-5 py-4"><div className="h-3.5 w-24 bg-gray-200 rounded-sm" /></td>
                <td className="px-5 py-4"><div className="h-5 w-16 bg-gray-200 rounded-sm" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
