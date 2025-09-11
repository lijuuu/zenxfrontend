import { ChallengeDocument } from "@/api/challengeTypes"
import { UserProfile } from "@/api/types"

type UserListingProps = {
  participants: UserProfile[]
  challenge: ChallengeDocument
}

const UserListing = ({ participants, challenge }: UserListingProps) => {
  return (
    <div>
      {participants?.map((user) => (
        <div key={user.userId} className="border p-2 mb-2 rounded">
          {challenge?.participants[user.userId] && (
            <div>
              {Object.entries(challenge.participants[user.userId]).map(([key, value]) => (
                <p key={key}>
                  {key}: {String(value)}
                </p>
              ))}
            </div>
          )}

          <p>Username: {user?.userName}</p>
          <p>Name: {user?.firstName} {user?.lastName}</p>
          <img
            src={`https://flagcdn.com/24x18/${user?.country?.toLowerCase()}.png`}
            alt={user?.country}
            className="h-5 rounded"
          />
          <p>Primary Language: {user?.primaryLanguageID}</p>
          <img
            src={user?.avatarURL}
            alt="profile"
            className="h-10 w-10 rounded-full mt-1"
          />
          {user?.socials && (
            <div className="mt-2">
              {user.socials.github && (
                <a href={user.socials.github} target="_blank" rel="noreferrer">
                  Github
                </a>
              )}
              {" "}
              {user.socials.twitter && (
                <a href={user.socials.twitter} target="_blank" rel="noreferrer">
                  Twitter
                </a>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default UserListing
