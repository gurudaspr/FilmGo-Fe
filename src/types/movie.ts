export interface Movie {
    _id: string;
    type: string;
    name: string;
    popularity: number;
    locationName: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  
  export interface SearchResponse {
    data: Movie[];
    total: number;
  }