
import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Filter, Search, Loader2, FileCode } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MainNavbar from "@/components/common/MainNavbar";
import { useProblems } from "@/hooks/useChallengeSystem";

const mapDifficulty = (difficulty: string): string => {
  const difficultyMap: Record<string, string> = {
    "1": "Easy",
    "2": "Medium",
    "3": "Hard",
    "E": "Easy",
    "M": "Medium",
    "H": "Hard",
  };
  return difficultyMap[difficulty] || difficulty;
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "E":
    case "Easy":
    case "1":
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
    case "M":
    case "Medium":
    case "2":
      return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
    case "H":
    case "Hard":
    case "3":
      return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
    default:
      return "bg-zinc-500/10 text-zinc-500 hover:bg-zinc-500/20";
  }
};

const ProblemListing: React.FC = () => {
  const [filters, setFilters] = useState({ search: "", difficulty: "all", tags: "" });
  const [showFilters, setShowFilters] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Use the new React Query hook for fetching problems
  const { data: problems = [], isLoading, error, refetch } = useProblems({
    search: filters.search,
    difficulty: filters.difficulty !== "all" ? filters.difficulty : undefined,
    tags: filters.tags
  });

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

  const navigateToCompiler = (problem_id: string) => {
    navigate(`/compiler?problem_id=${problem_id}`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <MainNavbar />
      
      <main className="page-container py-8 pt-20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Problem Set</h1>
            <p className="text-zinc-400 mt-1">
              Practice your coding skills by solving our carefully curated problems
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="border-zinc-700 hover:bg-zinc-800"
              onClick={() => refetch()}
            >
              <Loader2 className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
        
        <div className="bg-zinc-800/40 border border-zinc-700/40 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 h-4 w-4" />
              <Input 
                ref={searchInputRef}
                placeholder="Search problems by title or tag" 
                defaultValue={filters.search}
                onChange={handleSearchChange}
                className="pl-10 bg-zinc-800 border-zinc-700 focus-visible:ring-green-500"
              />
            </div>
            
            <Select value={filters.difficulty} onValueChange={(value) => setFilters(prev => ({ ...prev, difficulty: value }))}>
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
                {problems.length} {problems.length === 1 ? "problem" : "problems"} found
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
        ) : problems.length === 0 ? (
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
            {problems.map((problem) => (
              <Card
                key={problem.problem_id}
                className="bg-zinc-800/40 border border-zinc-700/40 hover:border-green-500/50 transition-colors cursor-pointer"
                onClick={() => navigateToCompiler(problem.problem_id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge className={`${getDifficultyColor(problem.difficulty)}`}>
                      {mapDifficulty(problem.difficulty)}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-2 text-white">{problem.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {problem.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="bg-zinc-800/60 text-zinc-300 border-zinc-700 text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {problem.tags.length > 3 && (
                      <Badge
                        variant="outline"
                        className="bg-zinc-800/60 text-zinc-300 border-zinc-700 text-xs"
                      >
                        +{problem.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProblemListing;
