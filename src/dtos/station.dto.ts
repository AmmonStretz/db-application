export type StationDTO = {
  id: number;
  ds100: string[];
  ifopt: string;
  name: string;
  traffic: string;
  position: {
    latitude: number;
    longitude: number;
  };
  operator: {
    id: number;
    name: string;
  };
  status: string;
};
