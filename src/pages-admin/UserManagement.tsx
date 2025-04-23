
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { getAllUsers, verifyUser, unverifyUser, softDeleteUser, banUser, unbanUser } from "@/api/adminApi";
import { UserProfile } from "@/api/types";
import { isAuthenticated } from "@/utils/authUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Trash2, 
  ShieldCheck, 
  ShieldX, 
  Ban, 
  UserCheck, 
  MoreVertical,
  Search,
  Filter,
  RefreshCw,
  UserX,
} from "lucide-react";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";

const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>(undefined);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [banData, setBanData] = useState({
    ban_type: "TEMPORARY",
    ban_reason: "",
    ban_expiry: ""
  });

  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/admin/login");
      return;
    }

    loadUsers();
  }, [roleFilter, statusFilter, currentPage]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getAllUsers(
        nextPageToken,
        10,
        roleFilter !== "all" ? roleFilter : undefined,
        statusFilter !== "all" ? statusFilter : undefined
      );
      setUsers(data.users);
      setTotalCount(data.totalCount);
      setNextPageToken(data.nextPageToken);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyUser = async (userId: string) => {
    try {
      await verifyUser(userId);
      toast({
        title: "Success",
        description: "User has been verified",
      });
      loadUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to verify user",
        variant: "destructive",
      });
    }
  };

  const handleUnverifyUser = async (userId: string) => {
    try {
      await unverifyUser(userId);
      toast({
        title: "Success",
        description: "User has been unverified",
      });
      loadUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to unverify user",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await softDeleteUser(userId);
        toast({
          title: "Success",
          description: "User has been deleted",
        });
        loadUsers();
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to delete user",
          variant: "destructive",
        });
      }
    }
  };

  const openBanDialog = (user: UserProfile) => {
    setSelectedUser(user);
    setShowBanDialog(true);
  };

  const handleBanUser = async () => {
    if (!selectedUser) return;
    
    try {
      await banUser({
        user_id: selectedUser.userID,
        ban_type: banData.ban_type,
        ban_reason: banData.ban_reason,
        ban_expiry: banData.ban_expiry || undefined,
      });
      
      toast({
        title: "Success",
        description: "User has been banned",
      });
      
      setShowBanDialog(false);
      loadUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to ban user",
        variant: "destructive",
      });
    }
  };

  const handleUnbanUser = async (userId: string) => {
    try {
      await unbanUser(userId);
      toast({
        title: "Success",
        description: "User has been unbanned",
      });
      loadUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to unban user",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const searchMatch = 
      (user.firstName?.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.userName?.toLowerCase().includes(searchTerm.toLowerCase()));
      
    return searchMatch;
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button onClick={loadUsers} variant="outline" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-2/3">
          <div className="w-1/2">
            <Select 
              value={roleFilter} 
              onValueChange={setRoleFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="MODERATOR">Moderator</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-1/2">
            <Select 
              value={statusFilter} 
              onValueChange={setStatusFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">Loading users...</TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">No users found</TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.userID}>
                  <TableCell className="font-medium">
                    {user.firstName} {user.lastName}
                    <div className="text-xs text-muted-foreground">@{user.userName}</div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === "ADMIN" 
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                        : user.role === "MODERATOR"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    }`}>
                      {user.role || "USER"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === "banned"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" 
                          : user.isVerified
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                      }`}>
                        {user.status === "banned" ? "Banned" : user.isVerified ? "Verified" : "Unverified"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.createdAt ? format(new Date(user.createdAt), 'MMM dd, yyyy') : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {!user.isVerified ? (
                          <DropdownMenuItem onClick={() => handleVerifyUser(user.userID)}>
                            <ShieldCheck className="mr-2 h-4 w-4" /> Verify User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleUnverifyUser(user.userID)}>
                            <ShieldX className="mr-2 h-4 w-4" /> Unverify User
                          </DropdownMenuItem>
                        )}
                        {user.status === "banned" ? (
                          <DropdownMenuItem onClick={() => handleUnbanUser(user.userID)}>
                            <UserCheck className="mr-2 h-4 w-4" /> Unban User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => openBanDialog(user)}>
                            <Ban className="mr-2 h-4 w-4" /> Ban User
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleDeleteUser(user.userID)} className="text-red-600">
                          <UserX className="mr-2 h-4 w-4" /> Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {users.length} of {totalCount} users
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={!nextPageToken}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Ban User Dialog */}
      <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ban User</DialogTitle>
            <DialogDescription>
              Enter the details for banning {selectedUser?.firstName} {selectedUser?.lastName}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="ban-type" className="text-sm font-medium">Ban Type</label>
              <Select 
                value={banData.ban_type} 
                onValueChange={(value) => setBanData({...banData, ban_type: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ban type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TEMPORARY">Temporary</SelectItem>
                  <SelectItem value="PERMANENT">Permanent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {banData.ban_type === "TEMPORARY" && (
              <div className="space-y-2">
                <label htmlFor="ban-expiry" className="text-sm font-medium">Ban Expiry</label>
                <Input 
                  id="ban-expiry"
                  type="datetime-local" 
                  value={banData.ban_expiry} 
                  onChange={(e) => setBanData({...banData, ban_expiry: e.target.value})}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="ban-reason" className="text-sm font-medium">Ban Reason</label>
              <Textarea 
                id="ban-reason"
                placeholder="Explain the reason for this ban..." 
                value={banData.ban_reason} 
                onChange={(e) => setBanData({...banData, ban_reason: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBanDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleBanUser}
              disabled={!banData.ban_reason}
              className="bg-red-600 hover:bg-red-700"
            >
              Ban User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
