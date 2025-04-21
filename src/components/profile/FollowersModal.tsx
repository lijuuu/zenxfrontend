
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserProfile } from "@/api/types";

interface FollowersModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  users: UserProfile[];
  title: string;
}

const FollowersModal: React.FC<FollowersModalProps> = ({ open, onOpenChange, users, title }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {users.length === 0 ? "No users yet." : null}
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[300px] overflow-y-auto">
          {users.map((u) => (
            <div key={u.userID} className="flex items-center gap-3 p-2 hover:bg-muted rounded">
              <Avatar className="h-8 w-8">
                <AvatarImage src={u.profileImage || u.avatarURL} />
                <AvatarFallback>
                  {(u.firstName?.charAt(0) || "") + (u.lastName?.charAt(0) || u.userName?.charAt(0) || "U")}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-foreground">@{u.userName}</span>
              <span className="ml-auto text-xs text-muted-foreground">{u.firstName} {u.lastName}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FollowersModal;
