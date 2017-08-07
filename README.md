## 消息气泡拖拽插件 && a plugin based vuejs which can let message dom like bubble to drag into disappeared
基于vue实现的仿QQ消息气泡拖拽插件。
#### 效果图

![](http://ifanqi.me/img/vue-bubble/qipao.gif)

#### 安装 && install
```
npm install vue-bubble
```
#### 如何使用 && Usage
1. 引入
```
const vueBubble from 'vue-bubble'
Vue.use(vueBubble)
```
2. 使用
v-bubble指令对应的是一个对象。该对象有如下可选值：
* value
> 必选，消息气泡显示的内容，value为0的时候，气泡默认是不显示的。

* show
> 可选，是否显示消息气泡，true为显示，false为隐藏。需要注意的是，该属性优先级大于value
比如，value=0，show为true，这种情况show起作用，value忽略，所以气泡显示。

* afterHide
> 可选，回调函数，气泡拖拽消失之后执行的回调，一般用于重置value。afterHide如果想带参数的话，可以使用下面的方式来配置，利用Function.prototype.bind函数把要携带的参数传递过去。

下面代码是github仓库中的demo代码片段。

```
<i v-bubble="{show:item.show,afterHide: (hide.bind(this,item)),value : item.count}" class="msg"></i>
```
