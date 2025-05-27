<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="4" md="6">
        <v-card>
          <v-card-title class="text-h5 text-center">로그인</v-card-title>
          <v-card-text>
            <v-form @submit.prevent ="login">
              <v-text-field
                  label="email"
                  v-model="email"
                  type="email"
                  required>
              </v-text-field>
              <v-text-field
                  label="password"
                  v-model="password"
                  type="password"
                  required>
              </v-text-field>
              <v-btn type ="submit" color = "god" block>
                로그인
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
export default{
  data(){
    return{
      email:"",
      password:""
    }

  },
  methods:{
    async login(){
      const data = {
        email: this.email,
        password: this.password
      }
      const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member/login`,data);
      console.log(response);
      const jwtToken = response.data.jwtToken;
      localStorage.setItem("token",jwtToken);
      window.location.href="/";
    }
  }
}
</script>