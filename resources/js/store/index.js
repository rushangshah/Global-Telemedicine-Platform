import { createStore } from 'vuex';
import auth from './modules/auth';
import appointments from './modules/appointments';
import medicalRecords from './modules/medical-records';
import prescriptions from './modules/prescriptions';

export default createStore({
    modules: {
        auth,
        appointments,
        medicalRecords,
        prescriptions
    }
});
