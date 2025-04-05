
export class AuthService {
    static isAuthenticated(): boolean {
      
      const userId = localStorage.getItem("userId");
      
      return !!userId; 
    }
  }
