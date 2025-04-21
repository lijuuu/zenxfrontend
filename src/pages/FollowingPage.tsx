
import { useParams, useNavigate } from "react-router-dom";
import { useFollowing } from "@/hooks/useFollow";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const FollowingPage: React.FC = () => {
  const { userid } = useParams();
  const navigate = useNavigate();
  const { data: users = [], isLoading } = useFollowing(userid, true);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-10">
      <div className="w-full max-w-xl">
        <div className="flex items-center mb-6 gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Following</h1>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-40 text-muted-foreground">Loading...</div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-muted-foreground">
            <Users className="w-12 h-12 mb-2" />
            <span>No users found.</span>
          </div>
        ) : (
          <ul className="divide-y divide-border bg-card rounded-xl shadow p-0">
            {users.map((u) => (
              <li
                key={u.userID}
                className="flex items-center gap-4 p-4 group hover:bg-accent/70 transition rounded-md"
              >
                <Avatar className="h-10 w-10 flex-shrink-0 shadow">
                  <AvatarImage src={u.profileImage || u.avatarURL} />
                  <AvatarFallback className="bg-muted-foreground text-white">
                    {(u.firstName?.charAt(0) || "") + (u.lastName?.charAt(0) || u.userName?.charAt(0) || "U")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-foreground text-base truncate">
                    {u.firstName} {u.lastName}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">@{u.userName || 'unnamed'}</span>
                </div>
                <span className="ml-auto text-xs bg-green-500/20 text-green-500 px-3 py-0.5 rounded-full font-medium group-hover:bg-green-500/40">
                  {u.country?.toUpperCase() || ''}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
export default FollowingPage;
