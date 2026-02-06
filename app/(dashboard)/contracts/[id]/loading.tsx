export default function ContractLoading() {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] -m-6 md:-m-8 font-mono animate-pulse">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          {/* Back button */}
          <div className="w-7 h-7 bg-gray-200 rounded-sm" />
          <div className="min-w-0">
            {/* Breadcrumb */}
            <div className="h-3 w-56 bg-gray-200 rounded-sm mb-2" />
            {/* Title */}
            <div className="h-6 w-72 bg-gray-200 rounded-sm" />
          </div>
        </div>

        {/* Workflow Steps */}
        <div className="hidden md:flex items-center gap-1">
          {['w-14', 'w-16', 'w-14', 'w-20'].map((w, i) => (
            <div key={i} className="flex items-center">
              <div className={`h-7 ${w} bg-gray-100 rounded-sm`} />
              {i < 3 && <div className="w-4 h-px bg-gray-200 mx-1" />}
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-24 bg-gray-200 rounded-sm" />
          <div className="h-9 w-20 bg-gray-100 border border-gray-200 rounded-sm" />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden bg-white relative">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-100 pointer-events-none z-0" />

        {/* Left Sidebar */}
        <div className="relative z-10 h-full border-r border-gray-200 bg-white w-[340px] shrink-0">
          <div className="p-5 space-y-6 overflow-hidden">
            {/* Sidebar header */}
            <div className="flex items-center justify-between">
              <div className="h-4 w-28 bg-gray-200 rounded-sm" />
              <div className="w-6 h-6 bg-gray-100 rounded-sm" />
            </div>

            {/* Contract title field */}
            <div className="space-y-2">
              <div className="h-3 w-24 bg-gray-200 rounded-sm" />
              <div className="h-9 w-full bg-gray-100 border border-gray-200 rounded-sm" />
            </div>

            {/* Status field */}
            <div className="space-y-2">
              <div className="h-3 w-16 bg-gray-200 rounded-sm" />
              <div className="h-9 w-full bg-gray-100 border border-gray-200 rounded-sm" />
            </div>

            {/* People fields */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-32 bg-gray-200 rounded-sm" />
                <div className="h-9 w-full bg-gray-100 border border-gray-200 rounded-sm" />
              </div>
            ))}

            {/* Summary field */}
            <div className="space-y-2">
              <div className="h-3 w-20 bg-gray-200 rounded-sm" />
              <div className="h-24 w-full bg-gray-100 border border-gray-200 rounded-sm" />
            </div>

            {/* Conditions field */}
            <div className="space-y-2">
              <div className="h-3 w-24 bg-gray-200 rounded-sm" />
              <div className="h-16 w-full bg-gray-100 border border-gray-200 rounded-sm" />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 relative z-10">
          {/* Tabs */}
          <div className="bg-white border-b border-gray-200 px-6 pt-2 flex items-center gap-1">
            <div className="px-4 py-2 border-b-2 border-[#CCFF00]">
              <div className="h-4 w-28 bg-gray-200 rounded-sm" />
            </div>
            <div className="px-4 py-2 border-b-2 border-transparent">
              <div className="h-4 w-20 bg-gray-100 rounded-sm" />
            </div>
          </div>

          {/* Toolbar */}
          <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="px-2 py-0.5 bg-gray-100 text-transparent text-[10px] font-bold uppercase rounded-sm">FILE</div>
              <div className="h-3 w-48 bg-gray-200 rounded-sm" />
              <div className="flex gap-1 border-l border-gray-200 pl-2 ml-2">
                <div className="w-5 h-5 bg-gray-100 rounded-sm" />
                <div className="w-5 h-5 bg-gray-100 rounded-sm" />
              </div>
            </div>
          </div>

          {/* Document Content */}
          <div className="flex-1 overflow-hidden bg-gray-50 p-6">
            <div className="bg-white border border-gray-200 shadow-sm w-full h-full flex flex-col items-center justify-center gap-4">
              {/* Document skeleton lines */}
              <div className="w-full max-w-2xl px-12 space-y-4 py-16">
                <div className="h-5 w-3/4 bg-gray-200 rounded-sm mx-auto" />
                <div className="h-3 w-full bg-gray-100 rounded-sm mt-8" />
                <div className="h-3 w-full bg-gray-100 rounded-sm" />
                <div className="h-3 w-5/6 bg-gray-100 rounded-sm" />
                <div className="h-3 w-full bg-gray-100 rounded-sm mt-6" />
                <div className="h-3 w-full bg-gray-100 rounded-sm" />
                <div className="h-3 w-4/6 bg-gray-100 rounded-sm" />
                <div className="h-3 w-full bg-gray-100 rounded-sm mt-6" />
                <div className="h-3 w-full bg-gray-100 rounded-sm" />
                <div className="h-3 w-full bg-gray-100 rounded-sm" />
                <div className="h-3 w-3/4 bg-gray-100 rounded-sm" />
                <div className="h-3 w-full bg-gray-100 rounded-sm mt-6" />
                <div className="h-3 w-5/6 bg-gray-100 rounded-sm" />
                <div className="h-3 w-full bg-gray-100 rounded-sm" />
                <div className="h-3 w-2/3 bg-gray-100 rounded-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
