import { createStore } from 'vuex'
import { account } from './account.module';
import { alert } from './alert.module';

export default createStore({
  modules: {
    account,
    alert
  }
})
