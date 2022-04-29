import axios from "axios";
const base = axios.create({
    baseURL: process.env.VUE_APP_ROOT_API
});

export const userService = {
    login,
    logout,
    register
};

function login(email, password) {
    return base.post('account/auth/signin/', {'account':{ email, password }})
        .then(handleResponse)
        .then(user => {
            // login successful if there's a jwt token in the response
            if (user.user.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
            }

            return user.user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function register(user) {
    const requestData = JSON.stringify(user)

    return base.post(`account/auth/signup/`, requestData).then(handleResponse);
}

function handleResponse(response) {
        const data = response.data
        if (response.statusText!="OK") {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                location.reload(true);
            }
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    // return response.text().then(text => {
    //     const data = text && JSON.parse(text);
    //     if (!response.ok) {
    //         if (response.status === 401) {
    //             // auto logout if 401 response returned from api
    //             logout();
    //             location.reload(true);
    //         }

    //         const error = (data && data.message) || response.statusText;
    //         return Promise.reject(error);
    //     }
    //     return data;
    // });
}