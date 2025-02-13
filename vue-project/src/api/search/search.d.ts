export type User = {
    id: number;
    firstname: string;
    lastname: string;
    profilePicture?: string;
  };
  
  export type SearchQuery = string; 
  
  export type SearchUsersResponse = User[]; 
  
  