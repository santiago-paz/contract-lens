export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="h-9 w-48 bg-gray-200 rounded-sm"></div>
          <div className="h-4 w-64 bg-gray-200 rounded-sm mt-2"></div>
        </div>
        <div className="h-9 w-36 bg-gray-200 rounded-sm"></div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-1 rounded-sm shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-2 justify-between items-center">
        <div className="w-full sm:w-96 h-10 bg-gray-100 rounded-sm"></div>
        <div className="hidden sm:block h-6 w-px bg-gray-200"></div>
        <div className="w-full sm:w-24 h-8 bg-gray-100 rounded-sm"></div>
      </div>

      {/* Contracts List */}
      <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3"><div className="h-3 w-24 bg-gray-200 rounded-sm"></div></th>
                <th className="px-6 py-3"><div className="h-3 w-16 bg-gray-200 rounded-sm"></div></th>
                <th className="px-6 py-3"><div className="h-3 w-16 bg-gray-200 rounded-sm"></div></th>
                <th className="px-6 py-3"><div className="h-3 w-24 bg-gray-200 rounded-sm"></div></th>
                <th className="px-6 py-3"><div className="h-3 w-12 bg-gray-200 rounded-sm float-right"></div></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-sm shrink-0"></div>
                      <div className="space-y-1.5 w-full">
                        <div className="h-3.5 w-48 bg-gray-200 rounded-sm"></div>
                        <div className="h-2.5 w-24 bg-gray-200 rounded-sm"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-5 w-20 bg-gray-200 rounded-sm"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-5 w-16 bg-gray-200 rounded-sm"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-3.5 w-24 bg-gray-200 rounded-sm"></div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <div className="h-8 w-8 bg-gray-200 rounded-sm"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded-sm"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
