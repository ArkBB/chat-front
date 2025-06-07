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
                      :class="['chat-message', msg.senderEmail === this.senderEmail ? 'sent' : 'received']"
                  >
                    <strong>{{msg.senderEmail}}: </strong> {{msg.message}}

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
//import axios from 'axios';


export default{
    data(){
        return {
            ws: null,
            messages : [],
            newMessage: "",
            stompClient: null,
            token: "",
            senderEmail: null,
        }
    },
    created(){
        this.connectWebsocket();
        this.senderEmail = localStorage.getItem("email");
    },
    // 사용자가 현재 라우트에서 다른 라우트로 이동하려고 할 때 호출되는 훅함수
    // 채팅 화면에서 다른 화면으로 넘어갈 때 -> disconnect 필요하다.
    beforeRouteLeave(to, from, next){
      this.disconnectWebSocket();
      next();
    },
    //화면을 완전히 꺼버렸을 때
    beforeUnmount() {
        this.disconnectWebSocket();
    },
  methods: {
        connectWebsocket(){
          if(this.stompClient && this.stompClient.connected) return;
          // sockJs는 websocket을 내장한 라이브러리. http 엔드포인트 사용
          const sockJs = new SockJs(`${process.env.VUE_APP_API_BASE_URL}/connect`);
          this.stompClient = Stomp.over(sockJs)
          this.token = localStorage.getItem("token");
            this.stompClient.connect({
              Authorization: `Bearer ${this.token}`
                },
                ()=>{
                    this.stompClient.subscribe(`/topic/1`,(message) => {
                      const parseMessage = JSON.parse(message.body);
                      this.messages.push(parseMessage);
                      this.scrollToBottom();
                    })
                }
            )
          // subscribe 역할 : 백엔드 서버의 STOMP 메시지 브로커에게 /topic/1 구독 요청을 보내는 것.
        },
        sendMessage(){
            if(this.newMessage.trim() === "") return;
            const message= {
              senderEmail : this.senderEmail,
              message : this.newMessage
            } // 자바 스크립트 객체
            this.stompClient.send(`/publish/1`, JSON.stringify(message)); //JSON 객체로

            this.newMessage = ""

          //public/1으로 메시지 발행, 서버의 Inbound Channel을 거쳐 @MessageMapping 컨트롤러로 전달됨.
        },
        scrollToBottom(){
          this.$nextTick(()=>{
            const chatBox = this.$el.querySelector(".chat-box");
            chatBox.scrollTop = chatBox.scrollHeight;
          },)
        },
        disconnectWebSocket(){
            if(this.stompClient && this.stompClient.connected){
              this.stompClient.unsubscribe(`/topic/1`);
              this.stompClient.disconnect();
            }
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

.chat-message{
  margin-bottom:10px;
}

.sent{
  text-align:right;
}

.received{
  text-align:left;
}

</style>