import { useDrag } from "react-dnd";
import { Plant } from "@/types/garden";

interface PlantCardProps {
  plant: Plant;
}

export default function PlantCard({ plant }: PlantCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "PLANT",
    item: plant,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`plant-card bg-white rounded-lg shadow-sm p-3 mb-3 border border-gray-100 flex gap-3 cursor-move transition-transform duration-200 ${isDragging ? 'opacity-50' : ''}`}
      style={{ transform: isDragging ? 'scale(0.95)' : 'scale(1)' }}
    >
      <div 
        className="w-16 h-16 rounded bg-cover bg-center"
        style={{ backgroundImage: `url(${plant.imageUrl})` }}
      />
      <div>
        <h3 className="font-medium text-sm">{plant.name}</h3>
        <div className="flex flex-wrap gap-1 mt-1">
          {plant.goodCompanions.slice(0, 2).map((companion, index) => (
            <span key={`good-${index}`} className="bg-compatible text-white text-xs py-0.5 px-1.5 rounded-full">
              {companion}
            </span>
          ))}
          
          {plant.badCompanions.slice(0, 1).map((companion, index) => (
            <span key={`bad-${index}`} className="bg-incompatible text-white text-xs py-0.5 px-1.5 rounded-full">
              {companion}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
