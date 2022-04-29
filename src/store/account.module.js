import { userService } from '../services';
import router from '@/router'

const user = JSON.parse(localStorage.getItem('user'));
const state = user
    ? { status: { loggedIn: true }, 'user':user.user }
    : { status: { logout: true }, user: null };

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
                    setTimeout(() => {
                        // display success message after route change completes
                        dispatch('alert/success', 'Registration successful', { root: true });
                    })
                },
                error => {
                    commit('registerFailure');
                    dispatch('alert/error', error.response.data.errors, { root: true });
                }
            );
    }
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
        state.status = {logout: true};
        state.user = null

    },
    registerFailure(state) {
        state.status = {logout: true};
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