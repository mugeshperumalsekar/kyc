// import HttpClientWrapper from "../../api/http-client-wrapper";

// class LoginApiService {

//   private httpClientWrapper: HttpClientWrapper;

//   constructor() {
//     this.httpClientWrapper = new HttpClientWrapper();
//   }

//   async login(userCredentials: { email: string; password: string,username:string }): Promise<{ userId: string ,username:string} | string> {
//     try {
//       const response = await this.httpClientWrapper.get("/api/v1/users");
//       const users = response;
//       console.log('res',response)
//       const user = users.find((u: any) => u.email === userCredentials.email);
//       if (user) {
//         if (user.password === userCredentials.password) {
//           return { userId: user.id ,username:user.username};
//         } else {
//           return "Incorrect password!";
//         }
//       } else {
//         return "Invalid emailId!";
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       return "An error occurred during login";
//     }
//   };

//   async accessPermission(uid: string): Promise<any> {
//     try {
//       const response = await this.httpClientWrapper.get(`/api/v1/accessPermission?uid=${uid}`);
//       return response;
//     } catch (error) {
//       console.error("Error fetching accessPermission:", error);
//       throw error;
//     }
//   };

// }

// export default LoginApiService;

import HttpClientWrapper from "../../api/http-client-wrapper";

class LoginApiService {

  private httpClientWrapper: HttpClientWrapper;

  constructor() {
    this.httpClientWrapper = new HttpClientWrapper();
  }

  async login(userCredentials: { email: string; password: string }): Promise<{ userId: string; username: string } | string> {
    try {
      const response = await this.httpClientWrapper.get("/api/v1/users");
      const users = response;
      const user = users.find((u: any) => u.email === userCredentials.email);
      if (user) {
        if (user.password === userCredentials.password) {
          return { userId: user.id, username: user.userName };
        } else {
          return "Incorrect password!";
        }
      } else {
        return "Invalid emailId!";
      }
    } catch (error) {
      console.error("Error:", error);
      return "An error occurred during login";
    }
  };

  async generateToken(user: any): Promise<string> {
    const token = '';
    return token;
  };

  async logout() {
    localStorage.removeItem('token');
  };

  async accessPermission(uid: string): Promise<any> {
    try {
      const response = await this.httpClientWrapper.get(`/api/v1/accessPermission?uid=${uid}`);
      return response;
    } catch (error) {
      console.error("Error fetching accessPermission:", error);
      throw error;
    }
  };

}

export default LoginApiService;