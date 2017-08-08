<template>
  <div class="page-bubble">
    <h6>仿QQ气泡拖拽演示</h6>
    <div style = "color:#FFF;font-size:14px;background-color:#000;" v-for="item in list">
      <span class="photo">
        <img src= "./images/photo.jpg" />
      </span>
      <div class="content">
        <em>小黄</em>
        <span>vue升级2.0后，自定义指令部分的API全部变化了！你怎么看？</span>
      </div>
      <i v-bubble="{show:item.show,afterHide: (hide.bind(this,item)),value : item.count}" class="msg"></i>
    </div>
    <button @click="change()">重置数据</button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        list: [
          {
            count: 10,
            show: true
          },
          {
            count: 6,
            show:true
          },{
            count:0,
            show:false
          },
          {
            count: 10,
            show: true
          },
          {
            count: 6,
            show:true
          },{
            count:0,
            show:false
          }
        ]
      }
    },
    methods:{
      hide(data) {
        data['count'] = 0
        data['show'] = false
      },
      change(){
        this.list = [
          {
            count: 10,
            show: true
          },
          {
            count: 6,
            show:true
          },{
            count:0,
            show:false
          },
          {
            count: 10,
            show: true
          },
          {
            count: 6,
            show:true
          },{
            count:0,
            show:false
          }
        ]
      }
    }
  }
</script>

<style>
*{
  box-sizing: border-box;
}
html,body{
  margin:0;
  padding:0;
  background: #EEE
}
.page-bubble{
  padding: 15px;
  max-width: 440px;
  width: 100%;
  margin: 0 auto;
  font-family:Helvetica Neue,Microsoft Yahei,sans-serif;
  background: #000;
  box-shadow: 0 0 3px #000
}
h6{
  color: #FFF;
  text-align: center;
  font-size: 20px;
  margin-bottom: 10px;
}
.page-bubble >div{
  overflow: hidden;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid #EEE;
  padding:15px 15px 30px;
}

i.msg{
  float: right;
  display: inline-block;
  height: 24px;
  min-width: 24px;
  background: red;
  color:#FFF;
  border:1px solid red;
  line-height: 24px;
  text-align: center;
  border-radius: 24px;
  font-style: normal;
  position: relative;
  z-index: 1;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.photo {
  width: 60px;
  height: 60px;
  border-radius: 100%;
  overflow: hidden;
}
.photo img{
  width: 60px;
  height: 60px;
}

.content{
  margin-left: 15px;
  flex:1;
  margin-right: 15px;
}
.content span,.content em{
  font-style:normal;display: block;margin-top: 10px
}
button {
  margin-top:20px;
  font-size: 20px;
  width:100%;height: 60px;line-height: 60px;
  border-radius:5px;
  color:#FFF;
  border: 0;
  appearance: none;
  background-color:#C60A1E;
}
</style>
