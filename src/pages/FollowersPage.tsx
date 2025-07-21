
import { useParams, useNavigate } from "react-router-dom";
import { useFollowers } from "@/hooks/useFollow";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const FollowersPage: React.FC = () => {
  const { userid } = useParams();
  const navigate = useNavigate();
  const { data: users = [], isLoading, error } = useFollowers(userid, true);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-10">
      <div className="w-full max-w-2xl px-3 animate-fade-in">
        <div className="flex items-center mb-7 gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-extrabold tracking-tight">Followers</h1>
        </div>
        <div className="rounded-2xl bg-zinc-900/70 glassmorphic shadow-xl p-6 min-h-[350px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-40 gap-2 w-full">
              <span className="w-8 h-8 rounded-full bg-zinc-700 animate-pulse mb-2" />
              <span className="text-muted-foreground">Loading followers...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center py-20 text-red-400">
              <Users className="w-12 h-12 mb-2" />
              <span>Failed to load. Try again later.</span>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-muted-foreground">
              <Users className="w-12 h-12 mb-2" />
              <span>No followers found.</span>
            </div>
          ) : (
            <ul className="space-y-4 transition-all">
              {users.map((u) => (
                <li
                  key={u.userId}
                  className="flex items-center gap-4 bg-zinc-800/80 border border-zinc-700 hover:scale-[1.02] hover:shadow-lg transition rounded-xl p-4 group"
                >
                  <Avatar className="h-12 w-12 flex-shrink-0 shadow ring-2 ring-green-500/20">
                    <AvatarImage src={u.profileImage || u.avatarURL} />
                    <AvatarFallback className="bg-muted-foreground text-white text-md font-semibold">
                      {(u.firstName?.charAt(0) || "") + (u.lastName?.charAt(0) || u.userName?.charAt(0) || "U")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-foreground text-lg truncate group-hover:text-green-400 transition">
                      {u.firstName} {u.lastName}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">@{u.userName || 'unnamed'}</span>
                  </div>
                  {u.country && (
                    <span className="ml-auto flex items-center gap-1.5 text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full font-medium group-hover:bg-green-500/40">
                      <img alt={u.country} src={`https://flagcdn.com/24x18/${u.country.toLowerCase()}.png`} className="h-4 rounded shadow" />
                      <span>{u.country?.toUpperCase()}</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowersPage;
