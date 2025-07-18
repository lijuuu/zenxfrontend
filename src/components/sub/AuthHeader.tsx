
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface SimpleHeaderProps {
  page: string;
  name: string;
}

const SimpleHeader: React.FC<SimpleHeaderProps> = ({ page, name }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center p-6">
      <div className="flex items-center">
        <div className="text-xl font-bold text-white">zenx</div>
      </div>
      <Button
        onClick={() => navigate(page)}
        className="bg-[#2C2C2C] hover:bg-[#35a635] hover:text-[#121212] text-white rounded-lg px-8 py-2  transition-all duration-200 "
      >
        {name}
      </Button>
    </div>
  );
};

export default SimpleHeader;
