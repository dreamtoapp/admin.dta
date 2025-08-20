import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { FaEnvelope, FaQuestionCircle, FaUsers } from 'react-icons/fa';

export default function DashboardLoading() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">
        <Skeleton className="w-52 h-8 rounded" />
      </h1>

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {[0,1,2].map(i => (
          <Card key={i} className="rounded-2xl shadow p-6 flex items-center gap-4">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div>
              <Skeleton className="w-16 h-6 mb-2 rounded" />
              <Skeleton className="w-24 h-4 rounded" />
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs Skeleton */}
      <Tabs defaultValue="project-requests">
        <TabsList className="mb-6">
          <TabsTrigger value="project-requests" className="flex items-center gap-2">
            <FaEnvelope /> <Skeleton className="w-24 h-5 rounded" />
          </TabsTrigger>
          <TabsTrigger value="express-queries" className="flex items-center gap-2">
            <FaQuestionCircle /> <Skeleton className="w-24 h-5 rounded" />
          </TabsTrigger>
          <TabsTrigger value="visitors" className="flex items-center gap-2">
            <FaUsers /> <Skeleton className="w-24 h-5 rounded" />
          </TabsTrigger>
        </TabsList>

        {/* Table Skeleton */}
        <TabsContent value="project-requests">
          <section className="mb-8">
            <Skeleton className="w-44 h-7 mb-4 rounded" />
            <div className="overflow-x-auto rounded-xl shadow">
              <table className="min-w-full divide-y divide-gray-200 bg-card">
                <thead>
                  <tr>
                    {[...Array(9)].map((_,i) => (
                      <th key={i} className="px-4 py-2">
                        <Skeleton className="w-20 h-4 rounded" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_,i) => (
                    <tr key={i}>
                      {[...Array(9)].map((_,j) => (
                        <td key={j} className="px-4 py-2">
                          <Skeleton className="w-full h-6 rounded" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
