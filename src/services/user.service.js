import axios from "axios";
const base = axios.create({
    baseURL: process.env.VUE_APP_ROOT_API
});


export const userService = {
    login,
    logout,
    register,
    updateToken,
    getUser
};


function updateToken(token){
    console.log('update token')
    const headers =  {
            headers: {'Authorization': 'Bearer ' + token}
        }
    return base.get('account/auth/update', headers)
        .then(handleResponse)
        .then(user => {
            // login successful if there's a jwt token in the response
            if (user.user.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('token', JSON.stringify(user.user));
            }

            return user.user;
        });
}

function getUser(token){
    const headers =  {
        headers: {'Authorization': 'Bearer ' + token}
    }
    return base.get('account/view', headers)
    .then(handleResponse)
    .then(user => {
        return user.user;
    });
}

function login(email, password) {
    return base.post('account/auth/signin', {'account':{ email, password }})
        .then(handleResponse)
        .then(user => {
            // login successful if there's a jwt token in the response
            if (user.user.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('token', JSON.stringify(user.user));
            }

            return user.user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('token');
}

function register(user) {
    return base.post(`account/auth/signup`, {'account':user}).then(handleResponse);
}

function handleResponse(response) {
    const data = response.data
    if (response.status!=200 && response.status!=201) {
        if (response.status === 401) {
            logout();
            location.reload(true);
        }
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
    }
    return data;
}