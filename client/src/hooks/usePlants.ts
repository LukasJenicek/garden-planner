import { useQuery } from "@tanstack/react-query";
import { Plant } from "@shared/schema";

export function usePlants() {
  const { data: plants, isLoading, error } = useQuery<Plant[]>({ 
    queryKey: ['/api/plants']
  });

  return { plants, isLoading, error };
}
