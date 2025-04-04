import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { createChallenge } from "@/api/challengeApi";
import { useNavigate } from "react-router-dom";
import { Challenge } from "@/api/types";

interface CreateChallengeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (challenge: Challenge) => void;
}

const CreateChallengeForm: React.FC<CreateChallengeFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Easy");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [loading, setLoading] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !startDate || !endDate) return;
    
    setLoading(true);
    try {
      const result = await createChallenge({
        title: title.trim(),
        description: description.trim(),
        difficulty: difficulty,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        isPrivate: isPrivate
      });
      
      if (result.success) {
        toast({
          title: "Challenge Created",
          description: `Successfully created challenge: ${title}`,
        });
        
        if (onSuccess && result.challenge) {
          onSuccess(result.challenge);
        }
        
        onClose();
        navigate('/challenges');
      } else {
        toast({
          title: "Error",
          description: "Failed to create challenge. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to create challenge:", error);
      toast({
        title: "Error",
        description: "Failed to create challenge. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDifficulty("Easy");
    setStartDate(new Date());
    setEndDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    setIsPrivate(false);
  };
  
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const difficultyOptions = [
    { value: "Easy", label: "Easy" },
    { value: "Medium", label: "Medium" },
    { value: "Hard", label: "Hard" }
  ];
  
  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) {
          resetForm();
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Challenge</DialogTitle>
          <DialogDescription>
            Design a new coding challenge for the community.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter challenge title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter challenge description"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="difficulty" className="text-sm font-medium">
              Difficulty
            </Label>
            <Select onValueChange={(value) => setDifficulty(value as "Easy" | "Medium" | "Hard")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficultyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date" className="text-sm font-medium">
                Start Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    {startDate ? format(startDate, "PPP") : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    disabled={(date) =>
                      date < new Date()
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="end-date" className="text-sm font-medium">
                End Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) =>
                      startDate && date < startDate
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Input
              id="private"
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
            <Label htmlFor="private" className="text-sm font-medium">
              Private Challenge
            </Label>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Create Challenge"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChallengeForm;
