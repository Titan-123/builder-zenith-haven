// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { MapPin, DollarSign, Bookmark } from "lucide-react";

// interface JobCardProps {
//   job: any; // Ideally type this as your Job type
//   onSave: (jobId: string) => void;
// }

// export default function JobCard({ job, onSave }: JobCardProps) {

   
//   return (
//     <Card key={job._id} className="hover:shadow-lg transition-shadow">
//       <CardHeader className="pb-4">
//         <div className="flex justify-between items-start mb-2">
//           <Badge variant="secondary" className="text-xs">
//             {job.portal || "N/A"}
//           </Badge>
//           <Button
//             variant="ghost"
//             size="sm"
//             className="p-1"
//             onClick={() => onSave(job._id)}
//           >
//             <Bookmark className="w-4 h-4" />
//           </Button>
//         </div>
//         <CardTitle className="text-lg">{job.title || "Untitled"}</CardTitle>
//         <p className="text-gray-600 font-medium">
//           {job.company || "Unknown Company"}
//         </p>
//       </CardHeader>
//       <CardContent className="pt-0">
//         <div className="space-y-3">
//           <div className="flex items-center text-gray-600 text-sm">
//             <MapPin className="w-4 h-4 mr-2" />
//             {job.location?.raw ||
//               job.location?.locations?.join(", ") ||
//               "Location not specified"}
//           </div>
//           <div className="flex items-center text-gray-600 text-sm">
//             <DollarSign className="w-4 h-4 mr-2" />
//             {job.salary?.raw ||
//               (job.salary?.min && job.salary?.max
//                 ? `${job.salary.min} - ${job.salary.max}`
//                 : "Not specified")}
//           </div>
//           <p className="text-gray-600 text-sm line-clamp-2">
//             Posted: {job.datePosted || "N/A"}
//           </p>
//           <div className="flex gap-2 mt-4">
//             <a
//               href={job.link}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="flex-1"
//             >
//               <Button variant="outline" size="sm" className="w-full">
//                 View Details
//               </Button>
//             </a>
//             <Button
//               size="sm"
//               className="flex-1"
//               onClick={() => onSave(job._id)}
//             >
//               Save Job
//             </Button>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }























import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, Bookmark } from "lucide-react";

interface JobCardProps {
  job: any; // Ideally type this as your Job type
  onSave: (jobId: string) => void;
  onViewDetails?: (job: any) => void; // Added this prop
}

export default function JobCard({ job, onSave, onViewDetails }: JobCardProps) {
  const handleViewDetails = () => {
    window.open(job.link, "_blank");
    if (onViewDetails) onViewDetails(job);
  };

  return (
    <Card key={job._id} className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary" className="text-xs">
            {job.portal || "N/A"}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={() => onSave(job._id)}
          >
            <Bookmark className="w-4 h-4" />
          </Button>
        </div>
        <CardTitle className="text-lg">{job.title || "Untitled"}</CardTitle>
        <p className="text-gray-600 font-medium">
          {job.company || "Unknown Company"}
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="w-4 h-4 mr-2" />
            {job.location?.raw ||
              job.location?.locations?.join(", ") ||
              "Location not specified"}
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <DollarSign className="w-4 h-4 mr-2" />
            {job.salary?.raw ||
              (job.salary?.min && job.salary?.max
                ? `${job.salary.min} - ${job.salary.max}`
                : "Not specified")}
          </div>
          <p className="text-gray-600 text-sm line-clamp-2">
            Posted: {job.datePosted || "N/A"}
          </p>
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleViewDetails} // Updated to use onClick handler
            >
              View Details
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={() => onSave(job._id)}
            >
              Save Job
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
