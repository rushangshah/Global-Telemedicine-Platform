import axios from 'axios';

export default {
    namespaced: true,
    
    state: {
        user: null,
        token: localStorage.getItem('token'),
    },
    
    mutations: {
        SET_USER(state, user) {
            state.user = user;
        },
        SET_TOKEN(state, token) {
            state.token = token;
            localStorage.setItem('token', token);
        },
        CLEAR_AUTH(state) {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
        }
    },
    
    actions: {
        async login({ commit }, credentials) {
            try {
                const response = await axios.post('/api/login', credentials);
                const { user, token } = response.data;
                
                commit('SET_USER', user);
                commit('SET_TOKEN', token);
                
                return response;
            } catch (error) {
                throw error;
            }
        },
        
        async register({ commit }, userData) {
            try {
                const response = await axios.post('/api/register', userData);
                const { user, token } = response.data;
                
                commit('SET_USER', user);
                commit('SET_TOKEN', token);
                
                return response;
            } catch (error) {
                throw error;
            }
        },
        
        async logout({ commit }) {
            try {
                await axios.post('/api/logout');
                commit('CLEAR_AUTH');
            } catch (error) {
                throw error;
            }
        },
        
        async fetchUser({ commit }) {
            try {
                const response = await axios.get('/api/user');
                commit('SET_USER', response.data);
                return response;
            } catch (error) {
                throw error;
            }
        }
    },
    
    getters: {
        isAuthenticated: state => !!state.token,
        user: state => state.user,
        token: state => state.token
    }
};
