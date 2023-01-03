import axios from "axios";

const API_URL = "https://data.ede.finance/auth/";

const register = (username, email, password) => {
    return axios.post(API_URL + "signup", {
        username,
        email,
        password,
    });
};

const login = (username, password) => {
    return axios
        .post(API_URL + "signin", {
            username,
            password,
        })
        .then((response) => {
            console.log("login response", response);
            const { code, data } = response.data;
            if (data.username) {
                localStorage.setItem("user", JSON.stringify(data));
            }
            return { code, data };
        });
};

const logout = () => {
    localStorage.removeItem("user");
    // return axios.post(API_URL + "signout").then((response) => {
    //     return response.data;
    // });
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
    register,
    login,
    logout,
    getCurrentUser,
}

export default AuthService;