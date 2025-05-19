class StorageService {

    public static setToken(token: string) {
        if (!token) {
            return;
        }
        window.localStorage.setItem('token', token);
    }

    public static getToken() {
        return window.localStorage.getItem('token');
    }

    public static isLoggedIn() {
        if (this.getToken() || this.getToken() != null) {
            return true;
        } else {
            return false;
        }
    }

    // public static clear = () => {
    //     window.localStorage.clear();
    // }

    public static saveUserData(user: any): void {
        window.localStorage.setItem("user", JSON.stringify(user));
    }

    public static getUserData(): any {
        let user: any = window.localStorage.getItem("user");
        if (user) {
            return JSON.parse(user);
        }
    }

    public static getUserType = () => {
        let user = this.getUserData();
        if (user) {
            return user.role.roleCode;
        }
    }

    public static getUserName = () => {
        let user = this.getUserData();
        if (user) {
            return user['fullName'];
        }
    }

    public static getUserId = () => {
        let user = this.getUserData();
        if (user) {
            return user['id'];
        }
    }
}

export default StorageService;