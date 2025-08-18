import React, { useState, useRef, useCallback, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, FileCode,TriangleRight,Filter } from "lucide-react";
import MainNavbar from "@/components/common/MainNavbar";
import ProblemCard from "@/components/common/ProblemCard";
import { Problem } from "@/api/types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api/v1/problems`
  : "http://localhost:7000/api/v1/problems";

const fetchProblems = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/metadata/list`, { params: { page: 1, page_size: 100 } });
    const problemList = res.data.payload?.problems || [];
    if (!Array.isArray(problemList)) throw new Error("Expected an array of problems");

    const mappedProblems: Problem[] = problemList.map((item: any) => ({
      problemId: item.problemId || "",
      title: item.title || "Untitled",
      description: item.description || "",
      tags: item.tags || [],
      difficulty: item.difficulty || "",
      testcaseRun: item.testcaseRun || { run: [] },
      supportedLanguages: item.supportedLanguages || [],
      validated: item.validated || false,
      placeholderMaps: item.placeholderMaps || {},
    }));

    return mappedProblems;
  } catch (error) {
    console.error("Error fetching problems:", error);
    return []
  }
};

const ProblemListing: React.FC = () => {
  const [filters, setFilters] = useState({ search: "", difficulty: "all", tags: "" });
  const [showFilters, setShowFilters] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const { data: problems = [], isLoading, error, refetch } = useQuery({
    queryKey: ["problems"],
    queryFn: fetchProblems,
  });

  // Authentication check on page load
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to view problems.");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const debounce = useCallback(
    (func: (...args: string[]) => void, wait: number) => {
      let timeout: NodeJS.Timeout;
      return (...args: string[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
      };
    },
    []
  );

  const updateFilters = debounce((search: string, tags: string) => {
    setFilters((prev) => ({
      ...prev,
      search,
      tags,
    }));
  }, 300);

  const handleSearchChange = () => {
    const searchValue = searchInputRef.current?.value || "";
    updateFilters(searchValue, tagInputRef.current?.value || "");
  };

  const handleTagChange = () => {
    const tagValue = tagInputRef.current?.value || "";
    updateFilters(searchInputRef.current?.value || "", tagValue);
  };

  const clearFilters = () => {
    setFilters({ search: "", difficulty: "all", tags: "" });
    if (searchInputRef.current) searchInputRef.current.value = "";
    if (tagInputRef.current) tagInputRef.current.value = "";
  };

  // Apply filters to the problems
  const filteredProblems = problems.filter((p) => {
    if (filters.search && !p.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.difficulty !== "all" && p.difficulty !== filters.difficulty) {
      return false;
    }
    if (filters.tags && !p.tags.some((t) => t.toLowerCase().includes(filters.tags.toLowerCase()))) {
      return false;
    }
    return true;
  });

  const navigateToCompiler = (problemId: string) => {
    navigate(`/playground?problemId=${problemId}`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <MainNavbar />
      <main className="page-container py-8 pt-20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Problem Set</h1>
            <p className="text-zinc-400 mt-1">
              Practice your coding skills by solving our carefully curated problems
            </p>
          </div>
        </div>

        <div className="bg-zinc-800/40 border border-zinc-700/40 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-4 mb-4">
            <div className="relative">
              <TriangleRight className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 h-4 w-4" />
              <Input
                ref={searchInputRef}
                placeholder="Search problems by title or tag"
                defaultValue={filters.search}
                onChange={handleSearchChange}
                className="pl-10 bg-zinc-800 border-zinc-700 focus-visible:ring-green-500"
              />
            </div>
            <Select
              value={filters.difficulty}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, difficulty: value }))}
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-zinc-700 hover:bg-zinc-800"
              onClick={() => {
                setShowFilters(!showFilters);
                if (!showFilters && tagInputRef.current) {
                  tagInputRef.current.focus();
                }
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter by Tag
            </Button>
            {showFilters && (
              <div className="w-full mt-3">
                <Input
                  ref={tagInputRef}
                  placeholder="Filter by tag..."
                  defaultValue={filters.tags}
                  onChange={handleTagChange}
                  className="bg-zinc-800 border-zinc-700 focus-visible:ring-green-500"
                />
              </div>
            )}
            {(filters.search || filters.difficulty !== "all" || filters.tags) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-zinc-400 hover:text-white hover:bg-zinc-800/70"
              >
                Clear Filters
              </Button>
            )}
            <div className="ml-auto">
              <p className="text-sm text-zinc-400">
                {filteredProblems.length} {filteredProblems.length === 1 ? "problem" : "problems"} found
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-green-500" />
          </div>
        ) : error ? (
          <Card className="bg-zinc-800/40 border border-red-500/40 text-white">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center">
              <h3 className="text-xl font-semibold text-red-400 mb-2">Error loading problems</h3>
              <p className="text-zinc-400 mb-4">Please try again later</p>
              <Button onClick={() => refetch()} variant="outline" className="border-zinc-700 hover:bg-zinc-800">
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : filteredProblems.length === 0 ? (
          <Card className="bg-zinc-800/40 border border-zinc-700/40 text-white">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center">
              <FileCode className="h-12 w-12 text-zinc-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No problems found</h3>
              <p className="text-zinc-400 mb-4">Try adjusting your filters or check back later</p>
              <Button onClick={clearFilters} variant="outline" className="border-zinc-700 hover:bg-zinc-800">
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProblems.map((problem) => (
              <ProblemCard
                key={problem.problemId}
                id={problem.problemId}
                title={problem.title}
                difficulty={problem.difficulty}
                tags={problem.tags}
                solved={false} // Adjust based on your logic for solved status
                onClick={() => navigateToCompiler(problem.problemId)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProblemListing;