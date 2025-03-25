import axios from 'axios';

export default {
    namespaced: true,
    
    state: {
        appointments: [],
        currentAppointment: null,
        loading: false,
        error: null
    },
    
    mutations: {
        SET_APPOINTMENTS(state, appointments) {
            state.appointments = appointments;
        },
        SET_CURRENT_APPOINTMENT(state, appointment) {
            state.currentAppointment = appointment;
        },
        SET_LOADING(state, status) {
            state.loading = status;
        },
        SET_ERROR(state, error) {
            state.error = error;
        }
    },
    
    actions: {
        async fetchAppointments({ commit }) {
            commit('SET_LOADING', true);
            try {
                const response = await axios.get('/api/appointments');
                commit('SET_APPOINTMENTS', response.data);
                commit('SET_ERROR', null);
            } catch (error) {
                commit('SET_ERROR', error.response.data.message);
            } finally {
                commit('SET_LOADING', false);
            }
        },
        
        async createAppointment({ commit }, appointmentData) {
            commit('SET_LOADING', true);
            try {
                const response = await axios.post('/api/appointments', appointmentData);
                commit('SET_ERROR', null);
                return response.data;
            } catch (error) {
                commit('SET_ERROR', error.response.data.message);
                throw error;
            } finally {
                commit('SET_LOADING', false);
            }
        },
        
        async updateAppointment({ commit }, { id, data }) {
            commit('SET_LOADING', true);
            try {
                const response = await axios.put(`/api/appointments/${id}`, data);
                commit('SET_ERROR', null);
                return response.data;
            } catch (error) {
                commit('SET_ERROR', error.response.data.message);
                throw error;
            } finally {
                commit('SET_LOADING', false);
            }
        },
        
        async cancelAppointment({ commit }, id) {
            commit('SET_LOADING', true);
            try {
                const response = await axios.put(`/api/appointments/${id}/cancel`);
                commit('SET_ERROR', null);
                return response.data;
            } catch (error) {
                commit('SET_ERROR', error.response.data.message);
                throw error;
            } finally {
                commit('SET_LOADING', false);
            }
        }
    },
    
    getters: {
        allAppointments: state => state.appointments,
        upcomingAppointments: state => state.appointments.filter(app => new Date(app.appointment_date) >= new Date()),
        isLoading: state => state.loading,
        error: state => state.error
    }
};
