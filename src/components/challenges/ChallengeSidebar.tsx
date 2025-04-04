
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarInput,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Flame, Crown, Users, Clock, Award, Sword, Trophy, Filter, CalendarDays } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/hooks';

interface ChallengeSidebarProps {
  onFilterChange: (filter: string) => void;
  selectedFilter: string;
}

const ChallengeSidebar: React.FC<ChallengeSidebarProps> = ({
  onFilterChange,
  selectedFilter
}) => {
  const profile = useAppSelector(state => state.user.profile);
  
  const menuItems = [
    { id: 'all', label: 'All Challenges', icon: Trophy },
    { id: 'active', label: 'Active Now', icon: Flame },
    { id: 'popular', label: 'Popular', icon: Crown },
    { id: 'friends', label: 'Friends', icon: Users },
    { id: 'upcoming', label: 'Upcoming', icon: CalendarDays },
    { id: 'recent', label: 'Recent', icon: Clock },
    { id: 'weekly', label: 'Weekly Contests', icon: Award },
    { id: 'battle', label: 'Battles', icon: Sword },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="pb-0">
        {profile && (
          <div className="flex items-center gap-3 mb-4 px-2">
            <Avatar className="h-9 w-9">
              <AvatarImage src={profile.avatarURL || profile.profileImage} alt={profile.userName} />
              <AvatarFallback>{profile.firstName?.[0]}{profile.lastName?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{`${profile.firstName} ${profile.lastName}`}</p>
              <p className="text-xs text-zinc-500 truncate">@{profile.userName}</p>
            </div>
          </div>
        )}
        <SidebarInput placeholder="Search challenges..." />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Challenges</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(item => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    isActive={selectedFilter === item.id}
                    onClick={() => onFilterChange(item.id)}
                    tooltip={item.label}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel>Difficulty</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="flex flex-col gap-2 p-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="justify-start gap-2 bg-green-500/10 border-green-500/20 hover:bg-green-500/20"
              >
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Easy
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="justify-start gap-2 bg-yellow-500/10 border-yellow-500/20 hover:bg-yellow-500/20"
              >
                <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                Medium
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="justify-start gap-2 bg-red-500/10 border-red-500/20 hover:bg-red-500/20"
              >
                <span className="h-2 w-2 rounded-full bg-red-500"></span>
                Hard
              </Button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <Button className="w-full justify-start gap-2">
          <Filter className="h-4 w-4" />
          Advanced Filters
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default ChallengeSidebar;
