export default function Loading() {
  return (
    <div className="space-y-12 animate-pulse">
      {/* Header Greeting */}
      <div>
        <div className="h-9 w-2/3 bg-gray-200 rounded-md"></div>
        <div className="h-5 w-1/3 bg-gray-200 rounded-md mt-2"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="h-7 w-48 bg-gray-200 rounded-md"></div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 min-h-[300px]">
            <div className="relative pl-4 space-y-8">
              {/* Vertical Line */}
              <div className="absolute left-[21px] top-3 bottom-3 w-0.5 bg-gray-200" />

              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="relative flex items-center gap-6">
                  {/* Dot */}
                  <div className="absolute left-0 w-11 h-11 flex items-center justify-center bg-white z-10">
                    <div className="w-3 h-3 rounded-full bg-gray-200 ring-4 ring-gray-50" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex items-center justify-between ml-12">
                    <div className="h-5 w-3/4 bg-gray-200 rounded-md"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded-md"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-7 w-32 bg-gray-200 rounded-md"></div>
            <div className="h-5 w-16 bg-gray-200 rounded-md"></div>
          </div>

          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
                <div className="h-1 w-full bg-gray-200 absolute top-0" />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div className="h-6 w-2/3 bg-gray-200 rounded-md"></div>
                    <div className="h-5 w-16 bg-gray-200 rounded-md"></div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="h-4 w-1/2 bg-gray-200 rounded-md"></div>
                    <div className="h-4 w-1/4 bg-gray-200 rounded-md"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contracts Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-7 w-40 bg-gray-200 rounded-md"></div>
          <div className="h-5 w-24 bg-gray-200 rounded-md"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="bg-gray-200 rounded-xl h-32 mb-4"></div>
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 w-3/4">
                    <div className="h-5 w-full bg-gray-200 rounded-md"></div>
                    <div className="h-3 w-1/2 bg-gray-200 rounded-md"></div>
                  </div>
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                </div>
                <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
                  <div className="h-4 w-20 bg-gray-200 rounded-md"></div>
                  <div className="h-4 w-12 bg-gray-200 rounded-md"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
