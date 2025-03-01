export type User = {
    id: number;
    firstname: string;
    lastname: string;
    email:string;
    profilePicture: string;
  };
  
  export type SearchQuery = {
    param: string; 
  };

  export type SearchQueryResponse={
    array: User[];
  }
  
  
  
  