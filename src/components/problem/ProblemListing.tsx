import React, { useState, useRef, useCallback, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, FileCode, TriangleRight, Filter, Grid3X3, List, ChevronLeft, ChevronRight, X, Tag, ChevronDown, ChevronUp } from "lucide-react";
import MainNavbar from "@/components/common/MainNavbar";
import ProblemCard from "@/components/common/ProblemCard";
import { Problem } from "@/api/types";

import { LEETCODE_TAGS } from "@/constants/problemTags"

const BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api/v1/problems`
  : "http://localhost:7000/api/v1/problems";

interface FetchProblemsParams {
  page?: number;
  pageSize?: number;
  tags?: string[];
  difficulty?: string;
  searchTitle?: string;
  searchTags?: string[];
}

const fetchProblems = async (params: FetchProblemsParams = {}) => {
  try {
    const {
      page = 1,
      pageSize = 20,
      tags = [],
      difficulty,
      searchTitle,
      searchTags = []
    } = params;

    const queryParams: Record<string, any> = {
      page,
      page_size: pageSize
    };

    // Add optional parameters only if they have values
    if (tags.length > 0) {
      // For Gin's QueryArray, we need to pass tags as repeated parameters
      // This will create: ?tags=Array&tags=String&tags=Hash%20Table
      queryParams.tags = tags;
    }
    if (difficulty && difficulty !== 'all') {
      queryParams.difficulty = difficulty;
    }
    if (searchTitle) {
      queryParams.search_title = searchTitle;
    }
    if (searchTags.length > 0) {
      queryParams.search_tags = searchTags;
    }

    // Handle tags array separately for Gin's QueryArray
    const { tags: tagsArray, ...otherParams } = queryParams;

    const res = await axios.get(`${BASE_URL}/metadata/list`, {
      params: otherParams,
      paramsSerializer: (params) => {
        const searchParams = new URLSearchParams();

        // Add regular parameters
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });

        // Add tags as repeated parameters for Gin's QueryArray
        if (tagsArray && Array.isArray(tagsArray)) {
          tagsArray.forEach(tag => {
            searchParams.append('search_tags', tag);
          });
        }

        return searchParams.toString();
      }
    });

    const payload = res.data.payload;
    const problemList = payload?.problems || [];
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

    const totalCount = payload?.total_count || 0;
    const currentPage = payload?.page || page;
    const currentPageSize = payload?.page_size || pageSize;

    // Calculate if there are more pages
    const totalPages = Math.ceil(totalCount / currentPageSize);
    const hasMore = currentPage < totalPages;

    return {
      problems: mappedProblems,
      totalCount,
      currentPage,
      totalPages,
      hasMore,
    };
  } catch (error) {
    console.error("Error fetching problems:", error);
    return {
      problems: [],
      totalCount: 0,
      currentPage: 1,
      totalPages: 0,
      hasMore: false,
    };
  }
};

const ProblemListing: React.FC = () => {
  const [filters, setFilters] = useState({
    searchTitle: "",
    difficulty: "all",
    searchTags: "",
    tags: [] as string[]
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Debounced search state
  const [debouncedSearchTitle, setDebouncedSearchTitle] = useState("");
  const [debouncedSearchTags, setDebouncedSearchTags] = useState("");

  const { data: problemsData, isLoading, error, refetch } = useQuery<{
    problems: Problem[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasMore: boolean;
  }>({
    queryKey: ["problems", currentPage, pageSize, debouncedSearchTitle, debouncedSearchTags, filters.difficulty, selectedTags],
    queryFn: () => fetchProblems({
      page: currentPage,
      pageSize,
      searchTitle: debouncedSearchTitle || undefined,
      searchTags: debouncedSearchTags ? [debouncedSearchTags] : undefined,
      difficulty: filters.difficulty !== 'all' ? filters.difficulty : undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined
    }),
    staleTime: 0, // No caching - always consider data stale
    gcTime: 0, // No caching - don't keep data in cache
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnReconnect: true, // Refetch when reconnecting
  });

  const problems = problemsData?.problems || [];
  const totalCount = problemsData?.totalCount || 0;
  const totalPages = problemsData?.totalPages || 0;
  const hasMore = problemsData?.hasMore || false;

  // Debounce search title
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTitle(filters.searchTitle);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.searchTitle]);

  // Debounce search tags
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTags(filters.searchTags);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.searchTags]);

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, searchTitle: value }));
    setCurrentPage(1); // Reset to first page on search
  };

  const handleTagChange = (value: string) => {
    setFilters(prev => ({ ...prev, searchTags: value }));
    setCurrentPage(1); // Reset to first page on search
  };

  const clearFilters = () => {
    setFilters({ searchTitle: "", difficulty: "all", searchTags: "", tags: [] });
    setSelectedTags([]);
    setCurrentPage(1);
    if (searchInputRef.current) searchInputRef.current.value = "";
    if (tagInputRef.current) tagInputRef.current.value = "";
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      // Remove tag if already selected
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      // Add tag if not selected
      setSelectedTags(prev => [...prev, tag]);
    }
    setCurrentPage(1);
  };

  const removeTag = (tag: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
    setCurrentPage(1);
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.difficulty, selectedTags, pageSize]);

  // Pagination handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Calculate pagination info
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalCount);

  const navigateToCompiler = (problemId: string) => {
    navigate(`/playground?problemId=${problemId}`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <MainNavbar />
      <main className="page-container py-6 pt-16">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-2xl font-bold">Problem Set</h1>
          </div>
        </div>

        {/* Enhanced Filter Section */}
        <div className="bg-gradient-to-r from-zinc-800/60 to-zinc-900/60 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-6 mb-6 shadow-2xl">
          {/* Main Search Bar */}
          <div className="relative mb-4">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 h-5 w-5">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
              <Input
                ref={searchInputRef}
              placeholder="Search problems by title..."
              value={filters.searchTitle}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-12 pr-4 bg-zinc-800/80 border-zinc-600/50 focus-visible:ring-green-500/50 focus-visible:border-green-500/50 h-12 text-base rounded-xl transition-all duration-200"
            />
            {filters.searchTitle && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {/* Difficulty Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-300 font-medium">Difficulty:</span>
            <Select
              value={filters.difficulty}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, difficulty: value }))}
            >
                <SelectTrigger className="bg-zinc-800/80 border-zinc-600/50 focus:ring-green-500/50 focus:border-green-500/50 h-9 w-32 rounded-lg">
                  <SelectValue />
              </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-600">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Easy" className="text-green-400">Easy</SelectItem>
                  <SelectItem value="Medium" className="text-yellow-400">Medium</SelectItem>
                  <SelectItem value="Hard" className="text-red-400">Hard</SelectItem>
              </SelectContent>
            </Select>
            </div>

            {/* Page Size */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-300 font-medium">Show:</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => setPageSize(Number(value))}
            >
                <SelectTrigger className="bg-zinc-800/80 border-zinc-600/50 focus:ring-green-500/50 focus:border-green-500/50 h-9 w-24 rounded-lg">
                  <SelectValue />
              </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-600">
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 ml-auto">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                className="h-9 w-9 p-0 rounded-lg"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                className="h-9 w-9 p-0 rounded-lg"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
              </div>

          {/* Advanced Filters */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              className="border-zinc-600/50 hover:bg-zinc-700/50 h-9 rounded-lg transition-all duration-200"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Hide' : 'Show'} Tag Filter
            </Button>

            {/* Clear Filters */}
            {(filters.searchTitle || filters.difficulty !== "all" || filters.searchTags || selectedTags.length > 0) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-zinc-400 hover:text-white hover:bg-zinc-700/50 h-9 rounded-lg transition-all duration-200"
              >
                Clear All Filters
              </Button>
            )}
          </div>

          {/* Tag Filter */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-zinc-700/50 space-y-4">

              {/* Tag Search Input */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <Input
                  ref={tagInputRef}
                  placeholder="Search by tag..."
                  value={filters.searchTags}
                  onChange={(e) => handleTagChange(e.target.value)}
                  className="pl-10 pr-4 bg-zinc-800/80 border-zinc-600/50 focus-visible:ring-green-500/50 focus-visible:border-green-500/50 h-10 rounded-lg transition-all duration-200"
                />
              </div>

              {/* All Tags */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-zinc-400" />
                    <span className="text-sm text-zinc-300 font-medium">Tags:</span>
                    {selectedTags.length > 0 && (
                      <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
                        {selectedTags.length} selected
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllTags(!showAllTags)}
                    className="text-zinc-400 hover:text-white hover:bg-zinc-700/50 h-7 px-2 text-xs"
                  >
                    {showAllTags ? (
                      <>
                        <ChevronUp className="h-3 w-3 mr-1" />
                        Hide
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3 w-3 mr-1" />
                        Show All
                      </>
                    )}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(showAllTags ? LEETCODE_TAGS : LEETCODE_TAGS.slice(0, 12)).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${selectedTags.includes(tag)
                        ? 'bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 hover:border-green-500/50'
                        : 'bg-zinc-700/50 border border-zinc-600/50 text-zinc-300 hover:bg-zinc-600/50 hover:border-zinc-500/50 hover:text-white'
                        }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results Summary */}
          <div className="mt-4 pt-4 border-t border-zinc-700/50">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="text-zinc-300">
                  <span className="font-semibold text-white">{totalCount}</span> problems found
                </span>
                {totalPages > 1 && (
                  <span className="text-zinc-400">
                    Page <span className="font-semibold text-white">{currentPage}</span> of <span className="font-semibold text-white">{totalPages}</span>
                  </span>
                )}
              </div>
              {isLoading && (
                <div className="flex items-center gap-2 text-green-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Searching...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-10 w-10 animate-spin text-green-500" />
          </div>
        ) : error ? (
          <Card className="bg-zinc-800/40 border border-red-500/40 text-white">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <h3 className="text-lg font-semibold text-red-400 mb-2">Error loading problems</h3>
              <p className="text-zinc-400 mb-3 text-sm">Please try again later</p>
              <Button onClick={() => refetch()} variant="outline" className="border-zinc-700 hover:bg-zinc-800 h-8">
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : problems.length === 0 ? (
          <Card className="bg-gradient-to-br from-zinc-800/40 to-zinc-900/40 border border-zinc-700/40 text-white rounded-xl">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-zinc-700/50 rounded-full flex items-center justify-center mb-4">
                <FileCode className="h-8 w-8 text-zinc-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No problems found</h3>
              <p className="text-zinc-400 mb-4 text-sm max-w-md">
                {filters.searchTitle || filters.searchTags || filters.difficulty !== "all" || selectedTags.length > 0
                  ? "Try adjusting your search criteria or filters"
                  : "No problems are available at the moment"}
              </p>
              {(filters.searchTitle || filters.searchTags || filters.difficulty !== "all" || selectedTags.length > 0) && (
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="border-zinc-600/50 hover:bg-zinc-700/50 h-9 rounded-lg transition-all duration-200"
                >
                  Clear All Filters
              </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            <div className={viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              : "space-y-3"
            }>
              {problems.map((problem) => (
                <ProblemCard
                  key={problem.problemId}
                  id={problem.problemId}
                  title={problem.title}
                  difficulty={problem.difficulty}
                  tags={problem.tags}
                  solved={false} // Adjust based on your logic for solved status
                  onClick={() => navigateToCompiler(problem.problemId)}
                  viewMode={viewMode}
                />
              ))}
            </div>
          </>
        )}

        {/* Enhanced Pagination */}
        {!isLoading && !error && problems.length > 0 && totalPages > 1 && (
          <div className="mt-8 pt-6 border-t border-zinc-700/40">
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-sm text-zinc-400">
                  Showing <span className="font-semibold text-white">{startIndex}</span> to <span className="font-semibold text-white">{endIndex}</span> of <span className="font-semibold text-white">{totalCount}</span> problems
              </p>
            </div>

              <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                  className="h-10 px-4 border-zinc-600/50 hover:bg-zinc-700/50 rounded-lg transition-all duration-200"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

                <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-lg">
                  <span className="text-sm text-zinc-300">
                    Page <span className="font-semibold text-white">{currentPage}</span> of <span className="font-semibold text-white">{totalPages}</span>
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                  className="h-10 px-4 border-zinc-600/50 hover:bg-zinc-700/50 rounded-lg transition-all duration-200"
                onClick={handleNextPage}
                disabled={!hasMore}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProblemListing;