import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import router from './routes/index.js';

Vue.use(Vuex);

const resourceHost = "https://spefor.ml/api/v1";
const localTokenData = JSON.parse(localStorage.getItem('tokenData'));
const localUserData = JSON.parse(localStorage.getItem('userData'));
const initialState = localTokenData?  localTokenData : null;
const initialUserData = localUserData?  localUserData : null;
function SaveToken(state){
    localStorage.setItem('tokenData',JSON.stringify(state.tokenData));
}
function SaveUser(state){
    localStorage.setItem('userData',JSON.stringify(state.userData));
}

export const store = new Vuex.Store({
    state:{
        userData:initialUserData,
        tokenData:initialState,
        showSnackbar:true,
        snackbarMessage:"",
    },
    getters:{
        getTokenData: function(state){
            return state.tokenData;
        }
    },
    mutations:{
        OnLoginSuccess(){
            router.push('/');
        },
        showSnackbar(state,payload){
            state.showSnackbar = true;
            state.snackbarMessage = payload.message;
        },
        closeSnackbar(state){
            state.showSnackbar = false;
        },
        SetTokenData(state,payload){
            state.tokenData = payload;
            SaveToken(state);
        },
        UnsetTokenData(state){
            state.tokenData = null;
        },
        SetUserData(state,payload){
            state.userData = payload;
            SaveUser(state);
        },
        UnsetUserData(state){
            state.userData = null;
        },
        SetAuthorization(state){
            axios.defaults.headers.common['Authorization'] = `Bearer ${state.tokenData.access_token}`
        }
    },
    actions:{
        fetchUser({commit}){
            axios(
                {
                method: 'get',
                url: `${resourceHost}/member/get_userinfo`,
              })
              .then((response)=>{
                  if(response.status==200){
                    commit("SetUserData",response.data.result);
                    commit("OnLoginSuccess")
                  }
              });
        },
        login({commit}, payload){
            axios(
                {
                method: 'post',
                url: `${resourceHost}/auth/login`,
                data: {
                  grant_type: 'password',
                  client_id: 'webapp',
                  user_id: payload.id,
                  password:payload.pw
                }
              })
              .then((response)=>{
                  if(response.status==200){
                    commit("SetTokenData",response.data);
                    commit("SetAuthorization");
                    this.dispatch('fetchUser');
                  }
              });
        },
        logout(){
            localStorage.removeItem('tokenData');
        },
        signup({commit}, payload){
            axios(
                {
                method: 'post',
                url: `${resourceHost}/member/register`,
                data: {
                    user_id: payload.user_id,
                    password: payload.password,
                    cadre_flag: true,
                    army_num: payload.army_num,
                    unit_id: payload.unit_id,
                    email: payload.email,
                    phone: payload.phone,
                }
              })
              .then((response)=>{
                  if(response.status==200){
                    commit("showSnackbar",{message:"fdsa"});
                  }
              });
        }
    }
    
})