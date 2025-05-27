<template>
  <v-app-bar app dark>
    <v-container>
      <v-row align="center">
        <v-col class="d-flex justify-start">
            <v-btn :to="{path: '/member/list'}">회원목록</v-btn>
            <v-btn :to="{path: '/groupchatting/list'}">채팅방목록</v-btn>
        </v-col>
        <v-col class="text-center">
            <v-btn :to="{path: '/'}"> chat서비스</v-btn>
        </v-col>
        <v-col class="d-flex justify-end">
          <v-btn :to="{path: ''}" v-if="isLogin">MyChatPage</v-btn>
          <v-btn :to="{path: '/member/create'}" v-if="!isLogin">회원가입</v-btn>
          <v-btn :to="{path: '/member/login'}" v-if="!isLogin">로그인</v-btn>
          <v-btn v-if="isLogin" @click="doLogout">로그아웃</v-btn>
        </v-col>

      </v-row>
    </v-container>
  </v-app-bar>
</template>
<script>
export default{
  created() {
    const token = localStorage.getItem("token");
    if(token){
      this.isLogin = true;
    }

    }
  ,
  data(){
    return {
        isLogin: false,
    }

  },methods: {
      doLogout(){
        localStorage.clear();
        window.location.reload();
      }
  }
}
</script>