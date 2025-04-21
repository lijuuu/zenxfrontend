
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserProfile } from "@/api/types";
import { Users } from "lucide-react";

interface FollowersModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  users: UserProfile[] | null | undefined;
  title: string;
}

const FollowersModal: React.FC<FollowersModalProps> = ({ open, onOpenChange, users, title }) => {
  // Ensure users is an array or default to empty array
  const usersList = Array.isArray(users) ? users : [];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 bg-background rounded-2xl shadow-xl">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription>
            {usersList.length === 0 ? "No users yet." : `Total: ${usersList.length}`}
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[350px] overflow-y-auto px-3">
          {usersList.length === 0 && (
            <div className="py-12 flex flex-col items-center text-muted-foreground">
              <Users className="w-10 h-10 mb-2" />
              <span>No users found.</span>
            </div>
          )}
          <ul className="divide-y divide-border">
            {usersList.map((u) => (
              <li
                key={u.userID}
                className="flex items-center gap-3 p-3 group hover:bg-accent/70 transition rounded-md"
              >
                <Avatar className="h-9 w-9 flex-shrink-0 shadow">
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FollowersModal;
