import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from '@/router/index.js'
import axios from 'axios'

const app = createApp(App);

axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem("token");
        if(token){
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config;
    },
    error => {
        //인터셉터를 무시하고 사용자의 본래요청인 화면을 라우팅
        return Promise.reject(error);
    }
    //로그인이 안된 경우 오류 터짐. 로그인 하라고 안내 표시.

)

app.use(router);
app.use(vuetify);
app.mount('#app')