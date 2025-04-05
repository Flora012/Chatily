export type User = {
  id: number;
  firstname: string;
  lastname: string;
  email:string;
  profilePicture: string;
};

export type SearchQuery = {
  param: string; 
  loggedInUser: string;
};

export type SearchQueryResponse={
  array: User[];
}

export type Friend = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  profilePicture: string;
  nickname?: string;
};
