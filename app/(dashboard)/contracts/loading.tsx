export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="h-9 w-40 bg-gray-200 rounded-md"></div>
          <div className="h-5 w-64 bg-gray-200 rounded-md mt-2"></div>
        </div>
        <div className="h-11 w-36 bg-gray-200 rounded-lg"></div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="w-full sm:w-96 h-10 bg-gray-200 rounded-lg"></div>
        <div className="w-full sm:w-24 h-10 bg-gray-200 rounded-lg"></div>
      </div>

      {/* Contracts List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4"><div className="h-4 w-32 bg-gray-200 rounded"></div></th>
                <th className="px-6 py-4"><div className="h-4 w-20 bg-gray-200 rounded"></div></th>
                <th className="px-6 py-4"><div className="h-4 w-16 bg-gray-200 rounded"></div></th>
                <th className="px-6 py-4"><div className="h-4 w-24 bg-gray-200 rounded"></div></th>
                <th className="px-6 py-4"><div className="h-4 w-12 bg-gray-200 rounded float-right"></div></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-200 rounded-lg shrink-0"></div>
                      <div className="space-y-1.5 w-full">
                        <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                        <div className="h-3 w-1/3 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-6 w-24 bg-gray-200 rounded-md"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="h-8 w-8 bg-gray-200 rounded-lg inline-block"></div>
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
