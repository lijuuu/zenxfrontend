import { BulkProblemMetadata } from "@/api/problem"
import ProblemCard from "@/components/common/ProblemCard"
import { useNavigate } from "react-router"

type ProblemListingProps = {
  problemsMetadata: BulkProblemMetadata[]
}

const ProblemListing = ({ problemsMetadata }: ProblemListingProps) => {
  const navigate = useNavigate();
  
  if (!problemsMetadata || problemsMetadata.length === 0) {
    return <p className="text-gray-400 text-sm">No problems available.</p>
  }

  const navigateToCompiler = (problemId: string) => {
    navigate(`/playground?problemId=${problemId}`);
  };

  return (
    <div className="grid gap-4">
      {problemsMetadata.map((problem) => (
        <ProblemCard
          key={problem.problemId}
          id={problem.problemId}
          title={problem.title}
          difficulty={problem.difficulty}
          tags={problem.tags}
          solved={false}
          onClick={() => navigateToCompiler(problem?.problemId)}
        />
      ))}
    </div>
  )
}

export default ProblemListing
