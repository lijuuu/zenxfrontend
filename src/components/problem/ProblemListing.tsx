
import React, { useState, useRef, useCallback } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Filter, Search, Loader2, FileCode } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MainNavbar from "@/components/MainNavbar";

// Define the Problem interface based on ProblemMetadata
interface Problem {
  problem_id: string;
  title: string;
  description: string;
  tags: string[];
  difficulty: string;
  testcase_run: { run: { input: string; expected: string }[] };
  supported_languages: string[];
  validated: boolean;
  placeholder_maps: { [key: string]: string };
}

const BASE_URL = "http://localhost:7000/api/v1/problems";

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
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
    case "M":
    case "Medium":
      return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
    case "H":
    case "Hard":
      return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
    default:
      return "bg-zinc-500/10 text-zinc-500 hover:bg-zinc-500/20";
  }
};

const fetchProblems = async () => {
  try {
    // For production/deployed app
    const res = await axios.get(`${BASE_URL}/metadata/list`, { params: { page: 1, page_size: 100 } });
    const problemList = res.data.payload?.problems || [];
    
    if (!Array.isArray(problemList)) throw new Error("Expected an array of problems");
    
    const mappedProblems: Problem[] = problemList.map((item: any) => ({
      problem_id: item.problem_id || '',
      title: item.title || 'Untitled',
      description: item.description || '',
      tags: item.tags || [],
      difficulty: item.difficulty || '',
      testcase_run: item.testcase_run || { run: [] },
      supported_languages: item.supported_languages || [],
      validated: item.validated || false,
      placeholder_maps: item.placeholder_maps || {},
    }));
    
    return mappedProblems;
  } catch (error) {
    console.error("Error fetching problems:", error);
    // In case of error, fallback to the mock data from problemApi.ts
    const { getProblems } = await import('@/api/problemApi');
    const mockProblems = await getProblems();
    
    // Map the mock data to match the Problem interface
    return mockProblems.map(p => ({
      problem_id: p.id,
      title: p.title,
      description: p.description,
      tags: p.tags,
      difficulty: p.difficulty,
      testcase_run: { 
        run: p.examples.map(ex => ({ 
          input: ex.input, 
          expected: ex.output 
        })) 
      },
      supported_languages: ['javascript', 'python', 'java', 'cpp', 'go'],
      validated: true,
      placeholder_maps: {
        javascript: '// Write your solution here',
        python: '# Write your solution here'
      }
    }));
  }
};

const ProblemListing: React.FC = () => {
  const [filters, setFilters] = useState({ search: "", difficulty: "all", tags: "" });
  const [showFilters, setShowFilters] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { data: problems = [], isLoading, error, refetch } = useQuery({
    queryKey: ['problems'],
    queryFn: fetchProblems,
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

  // Apply filters to the problems
  const filteredProblems = problems.filter(p => {
    // Search filter
    if (filters.search && !p.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Difficulty filter
    if (filters.difficulty !== "all" && mapDifficulty(p.difficulty) !== filters.difficulty) {
      return false;
    }
    
    // Tags filter
    if (filters.tags && !p.tags.some(t => t.toLowerCase().includes(filters.tags.toLowerCase()))) {
      return false;
    }
    
    return true;
  });

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
