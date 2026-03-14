export default function DashboardLoading() {
    return (
        <div className="max-w-6xl mx-auto animate-pulse">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                <div className="w-full md:w-1/2">
                    <div className="h-9 bg-gray-200 rounded-lg w-3/4 mb-3"></div>
                    <div className="h-5 bg-gray-100 rounded-md w-1/2"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded-xl w-32"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Managed Groups Skeleton */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div className="h-7 bg-gray-200 rounded-md w-1/3"></div>
                        <div className="h-6 w-8 bg-gray-100 rounded-full"></div>
                    </div>

                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-2 w-full">
                                    <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-4 bg-gray-100 rounded w-1/3"></div>
                                </div>
                                <div className="h-6 bg-gray-200 rounded w-16 shrink-0"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Joined Groups Skeleton */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div className="h-7 bg-gray-200 rounded-md w-1/3"></div>
                        <div className="h-6 w-8 bg-gray-100 rounded-full"></div>
                    </div>

                    <div className="space-y-4">
                         {[1, 2, 3].map((i) => (
                            <div key={i} className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-2 w-full">
                                    <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-4 bg-gray-100 rounded w-1/3"></div>
                                </div>
                                <div className="space-y-2 w-24 shrink-0 flex flex-col items-end">
                                    <div className="h-3 bg-gray-100 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
