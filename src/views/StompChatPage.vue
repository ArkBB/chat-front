<template>
    <v-container>
        <v-row justify="center">
          <v-col cols="12" md = "8">
            <v-card>
              <v-card-title class="text-center text-h5">
                채팅
              </v-card-title>
              <v-card-text>
                <div class="chat-box">
                  <div
                      v-for="(msg,index) in messages"
                      :key="index"
                  >
                    {{msg}}

                  </div>
                </div>
                <v-text-field
                    v-model="newMessage"
                    label="메시지 입력"
                    @keyup.enter="sendMessage"
                ></v-text-field>
                <v-btn color="primary" block @click="sendMessage">전송</v-btn>
              </v-card-text>

            </v-card>
          </v-col>
        </v-row>
    </v-container>
</template>

<script>
import SockJs from 'sockjs-client'
import Stomp from 'webstomp-client'


export default{
    data(){
        return {
            ws: null,
            messages : [],
            newMessage: "",
            stompClient: null,
            token: ""
        }
    },
    created(){
        this.connectWebsocket();
    },
    beforeUnmount() {
        this.disconnectWebSocket();
    },
  methods: {
        connectWebsocket(){
          // sockJs는 websocket을 내장한 라이브러리. http 엔드포인트 사용
          const sockJs = new SockJs(`${process.env.VUE_APP_API_BASE_URL}/connect`);
          this.stompClient = Stomp.over(sockJs)
          this.token = localStorage.getItem("token");
            this.stompClient.connect({
              Authorization: `Bearer ${this.token}`
                },
                ()=>{
                    this.stompClient.subscribe(`/topic/1`,(message) => {
                      this.messages.push(message.body);
                      this.scrollToBottom();
                    })
                }
            )

        },
        sendMessage(){
            if(this.newMessage.trim() === "") return;
            this.stompClient.send(`/publish/1`, this.newMessage);

            this.newMessage = ""
        },
        scrollToBottom(){
          this.$nextTick(()=>{
            const chatBox = this.$el.querySelector(".chat-box");
            chatBox.scrollTop = chatBox.scrollHeight;
          },)
        },
        disconnectWebSocket(){

        }

    },

}
</script>
<style>
.chat-box{
  height: 450px;
  overflow-y: auto;
  border: 1px solid #42b983;
  margin-bottom: 10px;
}
</style>