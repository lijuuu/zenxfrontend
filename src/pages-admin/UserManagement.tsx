import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { getAllUsers, verifyUser, unverifyUser, softDeleteUser, banUser, unbanUser } from "@/api/adminApi";
import { UserProfile } from "@/api/types";
import { isAdminAuthenticated } from "@/utils/authUtils";
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
  RefreshCw,
  UserX,
} from "lucide-react";
import { formatDate } from "@/utils/formattedDate";
import { Textarea } from "@/components/ui/textarea";
import { useDebounce } from "use-debounce";

// Utility to handle API errors
const handleApiError = (error: any): string => {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        return "Unauthorized: Please log in again.";
      case 403:
        return "Forbidden: You lack permission to perform this action.";
      case 404:
        return "Resource not found.";
      default:
        return error.response.data.message || "An unexpected error occurred.";
    }
  }
  return error.message || "Network error. Please try again.";
};

const UserManagement = () => {
  // State declarations
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fromDateFilter, setFromDateFilter] = useState("");
  const [toDateFilter, setToDateFilter] = useState("");
  const [pagination, setPagination] = useState<{
    currentPage: number;
    nextPageToken?: string;
    prevPageToken?: string;
    totalCount: number;
    totalPages: number;
  }>({
    currentPage: 1,
    nextPageToken: undefined,
    prevPageToken: undefined,
    totalCount: 0,
    totalPages: 1,
  });
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [banData, setBanData] = useState({
    ban_type: "TEMPORARY",
    ban_reason: "Failed to comply with T&C",
  });
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});
  const debouncedSearchTerm = useDebounce(searchTerm, 300)[0];
  const [lastNavigation, setLastNavigation] = useState<number>(0);

  const { toast } = useToast();
  const navigate = useNavigate();

  // Function to load users from the API
  const loadUsers = async (nextToken?: string, prevToken?: string, reset = false) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const parseDate = (date?: string) => date ? Math.floor(new Date(date).getTime() / 1000) : undefined;

      const fromDate = parseDate(fromDateFilter);
      const toDate = parseDate(toDateFilter);

      if (fromDate && toDate && fromDate > toDate) {
        throw new Error("From date cannot be later than to date");
      }

      const data = await getAllUsers(
        nextToken,
        prevToken,
        10,
        roleFilter !== "all" ? roleFilter : undefined,
        statusFilter !== "all" ? statusFilter : undefined,
        debouncedSearchTerm || undefined,
        debouncedSearchTerm || undefined,
        fromDate,
        toDate
      );

      if (!data?.users || typeof data.totalCount !== "number") {
        throw new Error("Invalid API response format");
      }

      const newPage = reset
        ? 1
        : nextToken
          ? pagination.currentPage + 1
          : prevToken
            ? pagination.currentPage - 1
            : pagination.currentPage;

      setUsers(data.users);
      setPagination({
        currentPage: newPage,
        nextPageToken: data.nextPageToken || undefined,
        prevPageToken: data.prevPageToken || undefined,
        totalCount: data.totalCount,
        totalPages: Math.max(1, Math.ceil(data.totalCount / 10)),
      });
    } catch (error: any) {
      console.error("Load users error:", error);
      toast({
        title: "Error",
        description: handleApiError(error),
        variant: "destructive",
      });
      if (reset) {
        setUsers([]);
        setPagination({ currentPage: 1, totalCount: 0, totalPages: 1 });
      }
    } finally {
      setIsLoading(false);
    }
  };


  // Initial load and filter changes
  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate("/admin/login");
      return;
    }
    loadUsers(undefined, undefined, true);
  }, []);

  // Generic handler for user actions
  const handleAction = async (action: () => Promise<void>, userId: string) => {
    setActionLoading((prev) => ({ ...prev, [userId]: true }));
    try {
      await action();
      await loadUsers(undefined, undefined, true); // Reset to first page after action
    } catch (error) {
      toast({
        title: "Error",
        description: handleApiError(error),
        variant: "destructive",
      });
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // User action handlers
  const handleVerifyUser = (userId: string) => {
    handleAction(async () => {
      await verifyUser(userId);
      toast({ title: "Success", description: "User has been verified" });
    }, userId);
  };

  const handleUnverifyUser = (userId: string) => {
    handleAction(async () => {
      await unverifyUser(userId);
      toast({ title: "Success", description: "User has been unverified" });
    }, userId);
  };

  const handleDeleteUser = (userId: string) => {
    handleAction(async () => {
      await softDeleteUser(userId);
      toast({ title: "Success", description: "User has been deleted" });
      setShowDeleteDialog(false);
    }, userId);
  };

  const handleBanUser = async () => {
    if (!selectedUser) return;

    setActionLoading((prev) => ({ ...prev, [selectedUser.userID]: true }));
    try {
      await banUser({
        userId: selectedUser.userID,
        banType: banData.ban_type,
        banReason: banData.ban_reason,
      });
      toast({ title: "Success", description: "User has been banned" });
      setShowBanDialog(false);
      await loadUsers(undefined, undefined, true);
    } catch (error) {
      toast({
        title: "Error",
        description: handleApiError(error),
        variant: "destructive",
      });
    } finally {
      setActionLoading((prev) => ({ ...prev, [selectedUser.userID]: false }));
    }
  };

  const handleUnbanUser = (userId: string) => {
    handleAction(async () => {
      await unbanUser(userId);
      toast({ title: "Success", description: "User has been unbanned" });
    }, userId);
  };

  const closeBanDialog = () => {
    setShowBanDialog(false);
    setBanData({ ban_type: "TEMPORARY", ban_reason: "Failed to comply with T&C" });
    setSelectedUser(null);
  };

  // Pagination handlers
  const handleNextPage = () => {
    const now = Date.now();
    if (now - lastNavigation < 300) return; // Debounce navigation
    setLastNavigation(now);

    if (pagination.nextPageToken && !isLoading) {
      loadUsers(pagination.nextPageToken, undefined);
    }
  };

  const handlePreviousPage = () => {
    const now = Date.now();
    if (now - lastNavigation < 300) return; // Debounce navigation
    setLastNavigation(now);

    if (pagination.prevPageToken && !isLoading) {
      loadUsers(undefined, pagination.prevPageToken);
    }
  };

  // Skeleton row for loading state
  const SkeletonRow = () => (
    <TableRow>
      {[...Array(7)].map((_, i) => (
        <TableCell key={i}>
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
        </TableCell>
      ))}
    </TableRow>
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button
          onClick={() => loadUsers(undefined, undefined, true)}
          variant="outline"
          size="icon"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-2/3">
          <div className="w-full md:w-1/4">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
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

          <div className="w-full md:w-1/4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
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

          <div className="w-full md:w-1/4">
            <Input
              type="date"
              placeholder="From Date"
              value={fromDateFilter}
              onChange={(e) => setFromDateFilter(e.target.value || "")}
            />
          </div>

          <div className="w-full md:w-1/4">
            <Input
              type="date"
              placeholder="To Date"
              value={toDateFilter}
              onChange={(e) => setToDateFilter(e.target.value || "")}
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Verification</TableHead>
              <TableHead>Ban</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  No users found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.userID}>
                  <TableCell className="font-medium">
                    <div>
                      {(user.firstName || user.lastName)
                        ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                        : "N/A"}
                    </div>
                    <div className="text-xs text-muted-foreground">@{user.userName || "N/A"}</div>
                  </TableCell>
                  <TableCell>{user.email || "N/A"}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === "ADMIN"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                          : user.role === "MODERATOR"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                    >
                      {user.role.toUpperCase() || "USER"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {user.isVerified ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                        Unverified
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.isBanned ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                        Banned
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        Active
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={actionLoading[user.userID]}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {!user.isVerified ? (
                          <DropdownMenuItem
                            onClick={() => handleVerifyUser(user.userID)}
                            disabled={actionLoading[user.userID]}
                          >
                            <ShieldCheck className="mr-2 h-4 w-4" /> Verify User
                            {actionLoading[user.userID] && (
                              <RefreshCw className="ml-2 h-4 w-4 animate-spin" />
                            )}
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => handleUnverifyUser(user.userID)}
                            disabled={actionLoading[user.userID]}
                          >
                            <ShieldX className="mr-2 h-4 w-4" /> Unverify User
                            {actionLoading[user.userID] && (
                              <RefreshCw className="ml-2 h-4 w-4 animate-spin" />
                            )}
                          </DropdownMenuItem>
                        )}
                        {user.isBanned ? (
                          <DropdownMenuItem
                            onClick={() => handleUnbanUser(user.userID)}
                            disabled={actionLoading[user.userID]}
                          >
                            <UserCheck className="mr-2 h-4 w-4" /> Unban User
                            {actionLoading[user.userID] && (
                              <RefreshCw className="ml-2 h-4 w-4 animate-spin" />
                            )}
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user);
                              setShowBanDialog(true);
                            }}
                            disabled={actionLoading[user.userID]}
                          >
                            <Ban className="mr-2 h-4 w-4" /> Ban User
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDeleteDialog(true);
                          }}
                          className="text-red-600"
                          disabled={actionLoading[user.userID]}
                        >
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

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {users.length} of {pagination.totalCount} users (Page {pagination.currentPage} of {pagination.totalPages})
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={pagination.currentPage === 1 || isLoading}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={!pagination.nextPageToken || isLoading}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Ban Dialog */}
      <Dialog open={showBanDialog} onOpenChange={closeBanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ban User</DialogTitle>
            <DialogDescription>
              Enter the details for banning{" "}
              {selectedUser
                ? `${selectedUser.firstName || ""} ${selectedUser.lastName || ""}`.trim() ||
                selectedUser.userName
                : "user"}
              .
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="ban-type" className="text-sm font-medium">
                Ban Type
              </label>
              <Select
                value={banData.ban_type}
                onValueChange={(value) => setBanData({ ...banData, ban_type: value })}
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

            <div className="space-y-2">
              <label htmlFor="ban-reason" className="text-sm font-medium">
                Ban Reason
              </label>
              <Textarea
                id="ban-reason"
                placeholder="Explain the reason for this ban..."
                value={banData.ban_reason}
                onChange={(e) => setBanData({ ...banData, ban_reason: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeBanDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleBanUser}
              disabled={!banData.ban_reason || actionLoading[selectedUser?.userID || ""]}
              className="bg-red-600 hover:bg-red-700"
            >
              {actionLoading[selectedUser?.userID || ""] ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                "Ban User"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={() => setShowDeleteDialog(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              {selectedUser
                ? `${selectedUser.firstName || ""} ${selectedUser.lastName || ""}`.trim() ||
                selectedUser.userName
                : "this user"}
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => selectedUser && handleDeleteUser(selectedUser.userID)}
              disabled={actionLoading[selectedUser?.userID || ""]}
              className="bg-red-600 hover:bg-red-700"
            >
              {actionLoading[selectedUser?.userID || ""] ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                "Delete User"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;