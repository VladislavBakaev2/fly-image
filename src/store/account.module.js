import { userService } from '../services';
import router from '@/router'

const state = { status: { logout: true }, user: null }

function updateToken(){
    const user = JSON.parse(localStorage.getItem('user'));
    if(!user){
        state.status = { logout: true }
        state.user = null
    }
    else{
        if (user.expiration<Date.now()){
            state.status = { logout: true }
            state.user = null
            userService.logout();
        }
        else{
            userService.updateToken(user.token)
            .then(
                user => {
                    state.status = {loggedIn: true}
                    state.user = user
                },
                error => {
                    console.log(error)
                }
            );
            setTimeout(updateToken, parseInt((user.expiration-user.creation)/2));
            state.status = { loggedIn: true }
            state.user = user
        }
    }
}

updateToken()

const getters = {
    STATE: state => {
        return state
    }
}

const actions = {
    login({ dispatch, commit }, { email, password }) {
        commit('loginRequest', { email });
        userService.login(email, password)
            .then(
                user => {
                    router.push('/')
                    commit('loginSuccess', user);
                    updateToken()
                },
                error => {
                    commit('loginFailure');
                    dispatch('alert/error', error.response.data.errors, { root: true });
                }
            );
    },
    logout({ commit }) {
        userService.logout();
        router.push('/')
        commit('logout');
    },
    register({ dispatch, commit }, user) {
        commit('registerRequest');
        userService.register(user)
            .then(
                user => {
                    commit('registerSuccess', user);
                    dispatch('alert/success', 'Registration successful', { root: true });
                    setTimeout(() => {
                        router.push('/')
                        commit('logout');
                    },1000)
                },
                error => {
                    console.log(error)
                    commit('registerFailure');
                    dispatch('alert/error', error.response.data.errors, { root: true });
                }
            );
    },
};

const mutations = {
    loginRequest(state, user) {
        state.status = { loggingIn: true };
        state.user = user;
    },
    loginSuccess(state, user) {
        state.status = { loggedIn: true };
        state.user = user;
    },
    loginFailure(state) {
        state.status = { logginError: true};
        state.user = null;
    },
    logout(state) {
        state.status = {logout: true};
        state.user = null;
    },
    registerRequest(state) {
        state.status = { registering: true };
        state.user = null
    },
    registerSuccess(state) {
        state.status = {register: true};
        state.user = null

    },
    registerFailure(state) {
        state.status = {registerError: true};
        state.user = null
    }
};

export const account = {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
};