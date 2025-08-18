import { UserProfile } from "@/api/types"

type UserListingProps = {
  participants: UserProfile[]
}

const UserListing = ({ participants }: UserListingProps) => {
  return (
    <div>
      {participants && (
        <pre className="bg-gray-900 text-white p-2 rounded text-xs whitespace-pre-wrap">
          {JSON.stringify(participants, null, 2)}
        </pre>
      )}
    </div>
  )
}

export default UserListing
