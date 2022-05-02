import { userService } from '../services';
import router from '@/router'
import store from '@/store'

const state = { status: { logout: true }, token: null, user:null }

function updateToken(){
    const token = JSON.parse(localStorage.getItem('token'));
    if(!token){
        store.commit('account/logout')
    }
    else{
        if (token.expiration<Date.now()){
            store.commit('account/logout')
            userService.logout();
        }
        else{
            userService.updateToken(token.token)
            .then(
                token => {
                    store.commit('account/loginSuccess', token)
                    if(!state.user){
                        userService.getUser(token.token)
                        .then(
                            user => {
                                store.commit('account/updateUser', user)
                            },
                            error => {
                                console.log(error)
                            }
                        );
                    }
                    setTimeout(updateToken, parseInt((token.expiration-token.creation)/2));
                },
                error => {
                    console.log(error)
                }
            );
        }
    }
}
setTimeout(updateToken, 10)

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
                token => {
                    router.push('/')
                    commit('loginSuccess', token);
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
    setUser({commit}, user){
        commit('updateUser', user)
    }
};

const mutations = {
    updateUser(state, user){
        state.user = user
    },
    loginRequest(state, token) {
        state.status = { loggingIn: true };
        state.token = token;
    },
    loginSuccess(state, token) {
        state.status = { loggedIn: true };
        state.token = token;
    },
    loginFailure(state) {
        state.status = { logginError: true};
        state.token = null;
    },
    logout(state) {
        state.status = {logout: true};
        state.token = null;
        state.user = null
    },
    registerRequest(state) {
        state.status = { registering: true };
        state.token = null
    },
    registerSuccess(state) {
        state.status = {register: true};
        state.token = null

    },
    registerFailure(state) {
        state.status = {registerError: true};
        state.token = null
    }
};

export const account = {
    namespaced: true,
    state,
    actions,
    mutations,
    getters,
};