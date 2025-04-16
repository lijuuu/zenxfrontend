import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  useProblems,
  ProblemsFilters 
} from '@/hooks';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const ProblemListing = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ProblemsFilters>({});
  const { data: problems, isLoading, error } = useProblems(filters);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleDifficultyChange = (value: string) => {
    setFilters(prev => ({ ...prev, difficulty: value }));
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, tags: e.target.value }));
  };

  useEffect(() => {
    console.log("Problems data:", problems);
  }, [problems]);

  if (isLoading) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-4">Problems</h1>
        <div className="grid gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="container py-8 text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Problems</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="md:col-span-1">
          <Label htmlFor="search">Search</Label>
          <Input
            type="text"
            id="search"
            placeholder="Search by title or tag..."
            onChange={handleSearchChange}
          />
        </div>

        <div className="md:col-span-1">
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select onValueChange={handleDifficultyChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-1">
          <Label htmlFor="tags">Tags</Label>
          <Input
            type="text"
            id="tags"
            placeholder="Filter by tags..."
            onChange={handleTagChange}
          />
        </div>
      </div>

      <Table>
        <TableCaption>A list of your recent problems.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Problem ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Tags</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {problems?.map((problem) => (
            <TableRow key={problem.problem_id} onClick={() => navigate(`/problems/${problem.problem_id}`)} className="cursor-pointer hover:bg-zinc-700/50">
              <TableCell className="font-medium">{problem.problem_id}</TableCell>
              <TableCell>{problem.title}</TableCell>
              <TableCell>
                <Badge variant="secondary">{problem.difficulty}</Badge>
              </TableCell>
              <TableCell>{problem.tags.join(', ')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProblemListing;
