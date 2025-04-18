import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ToolItemProps {
  id: string;
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export default function ToolItem({ id, icon, label, isActive, onClick }: ToolItemProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`tool-item cursor-pointer ${isActive ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'} p-2 rounded text-center transition-colors`}
          onClick={onClick}
          data-tool={id}
        >
          <i className={`${icon} ${isActive ? 'text-white' : 'text-primary'} text-xl`}></i>
          <p className="text-xs mt-1">{label}</p>
        </div>
      </TooltipTrigger>
      <TooltipContent side="right" className="bg-gray-800 text-white">
        <p>{label} tool</p>
      </TooltipContent>
    </Tooltip>
  );
}
