(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-order-order"],{"0fb7":function(t,e,a){"use strict";a.r(e);var n=a("1e49"),i=a("e49b");for(var r in i)"default"!==r&&function(t){a.d(e,t,(function(){return i[t]}))}(r);a("ebdf");var s,o=a("f0c5"),c=Object(o["a"])(i["default"],n["b"],n["c"],!1,null,"7bd90a03",null,!1,n["a"],s);e["default"]=c.exports},"1e49":function(t,e,a){"use strict";var n,i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-uni-view",{on:{touchstart:function(e){arguments[0]=e=t.$handleEvent(e),t.refreshStart.apply(void 0,arguments)},touchmove:function(e){arguments[0]=e=t.$handleEvent(e),t.refreshMove.apply(void 0,arguments)},touchend:function(e){arguments[0]=e=t.$handleEvent(e),t.refreshEnd.apply(void 0,arguments)}}},[a("v-uni-view",{staticClass:"refreshBox",style:t.isTranform},[a("v-uni-view",{staticClass:"refresh",class:2==t.isEnd?"animationSmall":"",style:t.isZoom},[0==t.isEnd?a("v-uni-view",{staticClass:"refreshWord"},[t._v(t._s(t.showText))]):t._e(),1==t.isEnd?a("v-uni-view",{staticClass:"refreshCirle animation"}):t._e(),2==t.isEnd?a("v-uni-image",{staticClass:"iconYes",attrs:{src:"/static/icon-yes.png"}}):t._e()],1)],1),a("v-uni-view",[t._t("default")],2)],1)},r=[];a.d(e,"b",(function(){return i})),a.d(e,"c",(function(){return r})),a.d(e,"a",(function(){return n}))},3581:function(t,e,a){"use strict";a.r(e);var n=a("43c6"),i=a("b1b2");for(var r in i)"default"!==r&&function(t){a.d(e,t,(function(){return i[t]}))}(r);a("e1f2");var s,o=a("f0c5"),c=Object(o["a"])(i["default"],n["b"],n["c"],!1,null,"33e388fe",null,!1,n["a"],s);e["default"]=c.exports},"43c6":function(t,e,a){"use strict";var n,i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-uni-view",{},[a("refresh",{ref:"refresh",on:{isRefresh:function(e){arguments[0]=e=t.$handleEvent(e),t.refreshList.apply(void 0,arguments)}}},[a("v-uni-scroll-view",{staticClass:"border-bottom scroll-row",staticStyle:{height:"80rpx","line-height":"80rpx"},attrs:{"scroll-x":!0,"scroll-into-view":t.scrollInto}},t._l(t.tabBars,(function(e,n){return a("v-uni-view",{key:n,staticClass:"scroll-row-item tab-item",class:n===t.tabIndex?"main-text-color":"",style:n===t.tabBars.length-1?"padding-right:20rpx":"",attrs:{id:"tab"+n},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.changeTab(n)}}},[a("v-uni-text",{staticClass:"font-md",class:t.tabIndex===n?"tab-bottom":""},[t._v(t._s(e.Text))])],1)})),1),a("v-uni-swiper",{staticStyle:{"background-color":"#F5F5F5"},style:"height:"+t.scrollH+"px;",attrs:{duration:150,current:t.tabIndex},on:{change:function(e){arguments[0]=e=t.$handleEvent(e),t.onChangeTab.apply(void 0,arguments)}}},t._l(t.listItems,(function(e,n){return a("v-uni-swiper-item",{key:n},[a("v-uni-scroll-view",{style:"height:"+t.scrollH+"px;",attrs:{"scroll-y":"true"},on:{scrolltolower:function(e){arguments[0]=e=t.$handleEvent(e),t.loadMore.apply(void 0,arguments)}}},[e.list.length>0?[t._l(e.list,(function(e,n){return a("v-uni-view",{key:n,staticClass:"order-item"},[a("v-uni-view",{staticClass:"font-weight border-bottom pb-1"},[t._v(t._s(e.MerchantName)+">>")]),a("v-uni-view",{staticClass:"pt-1",on:{click:function(a){arguments[0]=a=t.$handleEvent(a),t.openOrderDetail(e.ID)}}},[a("v-uni-view",{},[a("v-uni-text",[t._v("下单时间：")]),a("v-uni-text",[t._v(t._s(e.CreateTime))])],1),a("v-uni-view",[a("v-uni-text",[t._v("订单号：")]),a("v-uni-text",[t._v(t._s(e.ID))]),a("v-uni-text",{staticClass:"ml-3"},[t._v("订单状态：")]),a("v-uni-text",[t._v(t._s(e.StatusName))])],1),a("v-uni-view",[a("v-uni-text",[t._v("订单金额：")]),a("v-uni-text",{staticClass:"main-text-color"},[t._v(t._s(e.Amount))]),a("v-uni-text",{staticClass:"ml-3"},[t._v("实付款：")]),a("v-uni-text",{staticClass:"main-text-color"},[t._v(t._s(e.PayAmount))])],1)],1),a("v-uni-view",{staticClass:"text-right"},[0==e.Status?a("v-uni-button",{attrs:{size:"mini",type:"primary"},on:{click:function(a){arguments[0]=a=t.$handleEvent(a),t.cancelOrder(e.ID)}}},[t._v("取消")]):1==e.Status||2==e.Status?a("v-uni-button",{attrs:{size:"mini",type:"primary"},on:{click:function(a){arguments[0]=a=t.$handleEvent(a),t.gotoPay(e.ID)}}},[t._v("去付款")]):t._e()],1)],1)})),a("v-uni-view",{staticClass:"d-flex a-center j-center text-light-muted font-md py-3"},[t._v(t._s(e.loadText))])]:"before"===e.loadTag||"ing"===e.loadTag?a("v-uni-view",{staticClass:"d-flex j-center a-center pt-5"},[a("v-uni-text",{staticClass:"font-md text-light-muted"},[t._v("加载中...")])],1):a("v-uni-view",{staticClass:"d-flex j-center a-center pt-5"},[a("v-uni-text",{staticClass:"font-md text-light-muted"},[t._v("暂无数据")])],1)],2)],1)})),1)],1)],1)},r=[];a.d(e,"b",(function(){return i})),a.d(e,"c",(function(){return r})),a.d(e,"a",(function(){return n}))},"6f43":function(t,e,a){"use strict";var n=a("ee27");a("99af"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var i=n(a("d0ff")),r=n(a("f3f3")),s=n(a("0fb7")),o=a("2f62"),c={token:!0},u={components:{refresh:s.default},data:function(){return{scrollInto:"",scrollH:500,tabBars:[],tabIndex:0,orderStatus:-1,listItems:[],pageSize:10,pageIndex:1,isPullRefresh:!1}},onLoad:function(){var t=this;uni.getSystemInfo({success:function(e){t.scrollH=e.windowHeight-uni.upx2px(80)}}),this.loadTabBars()},computed:(0,r.default)({},(0,o.mapState)({appConfig:function(t){return t.user.appConfig}}),{},(0,o.mapGetters)([])),methods:(0,r.default)({},(0,o.mapMutations)(["updateCartId","updateOrderID"]),{loadTabBars:function(){var t=this;this.$H.post("/api/Order/GetOrderStatus",{},c).then((function(e){t.tabBars=e.data;for(var a=0;a<t.tabBars.length;a++){var n={loadTag:"before",list:[],loadText:"上拉加载更多"};t.listItems.push(n)}t.loadList()}))},changeTab:function(t){this.tabIndex!==t&&(this.tabIndex=t,this.scrollInto="tab"+t,this.orderStatus=this.tabBars[t].Value,"after"!==this.listItems[t].loadTag&&this.loadList())},loadList:function(t){var e=this,a=this.listItems[this.tabIndex],n={pageSize:this.pageSize,status:this.orderStatus,pageIndex:this.pageIndex};a.loadTag="ing",this.$H.post("/api/Order/list",n,c).then((function(n){e.isPullRefresh?(a.list=n.data,e.isPullRefresh=!1):a.list=[].concat((0,i.default)(a.list),(0,i.default)(n.data)),n.data.length<e.pageSize?a.loadText="没有更多了":a.loadText="上拉加载更多",a.loadTag="after","function"===typeof t&&t()}))},openOrderDetail:function(t){uni.navigateTo({url:"./detail?orderID="+t,animationType:"pop-in",animationDuration:200})},loadMore:function(){this.pageIndex=this.pageIndex+1;var t=this.listItems[this.tabIndex];"上拉加载更多"===t.loadText&&(t.loadText="加载中...",this.loadList((function(){uni.showToast({title:"加载成功",icon:"none"})})))},onChangeTab:function(t){this.changeTab(t.detail.current)},cancelOrder:function(t){var e=this;uni.showModal({title:"提示",content:"确认是否取消？",success:function(a){if(a.confirm){var n={orderID:t};e.$H.post("/api/Order/CancelOrder",n,c).then((function(a){if(uni.showToast({title:a.data.message,icon:"none"}),0==a.data.status)for(var n=e.listItems[e.tabIndex].list,i=0;i<n.length;i++){var r=n[i];if(r.ID==t){e.updateCartId(0),e.updateOrderID(0),r.Status=4,r.StatusName="用户取消";break}}}))}else a.cancel}})},gotoPay:function(t){uni.navigateTo({url:"../payment/payment-order?orderID="+t})},refreshList:function(){var t=this;this.pageIndex=1,this.isPullRefresh=!0,this.loadList((function(){uni.showToast({icon:"none",title:"刷新成功"}),t.$refs.refresh.endAfter(),t.isPullRefresh=!1}))}})};e.default=u},"72be":function(t,e,a){var n=a("c6f5");"string"===typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);var i=a("4f06").default;i("1afaebac",n,!0,{sourceMap:!1,shadowMode:!1})},b1b2:function(t,e,a){"use strict";a.r(e);var n=a("6f43"),i=a.n(n);for(var r in n)"default"!==r&&function(t){a.d(e,t,(function(){return n[t]}))}(r);e["default"]=i.a},c2af:function(t,e,a){"use strict";a("a9e3"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n={name:"refresh",props:{isTop:{type:Number,default:1}},data:function(){return{isTranf:0,touchStart:"",touchMove:"",isEnd:0,showText:"下拉刷新"}},methods:{refreshStart:function(t){0==this.isEnd&&1==this.isTop&&(this.touchStart=t.changedTouches[0].pageY)},refreshMove:function(t){if(0==this.isEnd&&1==this.isTop){var e=this.touchStart,a=(this.touchMove,t.changedTouches[0].pageY);if(e<=a){var n=e>a?0:a-e;this.isTranf=n,this.touchMove=t.changedTouches[0].pageY,this.isTranf>=250&&(this.showText="松开刷新")}}else this.isTranf=0,this.isEnd=0,this.touchStart=9999},refreshEnd:function(t){0==this.isEnd&&1==this.isTop&&(this.isTranf>=250?(this.isTranf=180,this.isEnd=1,this.$emit("isRefresh"),this.showText="下拉刷新"):this.isTranf=0)},endAfter:function(){var t=this;this.isEnd=2,setTimeout((function(){t.isTranf=0,t.isEnd=0}),600)}},computed:{isTranform:function(){var t=this.isTranf>200?200:this.isTranf,e="transform: translateY(".concat(t-100,"px);");return e},isZoom:function(){var t=this.isTranf>180?180:this.isTranf,e="zoom:".concat(t/180,";");return e}}};e.default=n},c6f5:function(t,e,a){var n=a("24fb");e=n(!1),e.push([t.i,'@charset "UTF-8";\r\n/**\r\n * 这里是uni-app内置的常用样式变量\r\n *\r\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\r\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\r\n *\r\n */\r\n/**\r\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\r\n *\r\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\r\n */\r\n/* 颜色变量 */\r\n/* 行为相关颜色 */\r\n/* 文字基本颜色 */\r\n/* 背景颜色 */\r\n/* 边框颜色 */\r\n/* 尺寸变量 */\r\n/* 文字尺寸 */\r\n/* 图片尺寸 */\r\n/* Border Radius */\r\n/* 水平间距 */\r\n/* 垂直间距 */\r\n/* 透明度 */\r\n/* 文章场景相关 */.refreshBox[data-v-7bd90a03]{margin:0 auto;width:100%;height:%?100?%;overflow:hidden;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;max-height:%?300?%;position:fixed;z-index:999;top:0;left:0;-webkit-transform:translateY(%?-100?%);transform:translateY(%?-100?%)}.animationSmall[data-v-7bd90a03]{-webkit-animation:small-data-v-7bd90a03 1.1s both;animation:small-data-v-7bd90a03 1.1s both}@-webkit-keyframes small-data-v-7bd90a03{0%{-webkit-transform:scale(1);transform:scale(1)}20%{-webkit-transform:scale(1.4);transform:scale(1.4)}100%{-webkit-transform:scale(0);transform:scale(0)}}@keyframes small-data-v-7bd90a03{0%{-webkit-transform:scale(1);transform:scale(1)}20%{-webkit-transform:scale(1.4);transform:scale(1.4)}100%{-webkit-transform:scale(0);transform:scale(0)}}.refreshWord[data-v-7bd90a03]{width:%?150?%;height:%?26?%;font-size:%?24?%;line-height:%?26?%;text-align:center;-webkit-border-radius:%?26?%;border-radius:%?26?%}.refresh[data-v-7bd90a03]{min-width:%?50?%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;height:%?50?%;background:#fff;-webkit-box-shadow:0 0 %?16?% 0 rgba(0,0,0,.1);box-shadow:0 0 %?16?% 0 rgba(0,0,0,.1);-webkit-border-radius:%?50?%;border-radius:%?50?%}.refreshCirle[data-v-7bd90a03]{width:%?26?%;height:%?26?%;-webkit-border-radius:50%;border-radius:50%;display:inline-block;position:relative;border:%?6?% solid #000;border-bottom-color:transparent;border-top-color:transparent}.animation[data-v-7bd90a03]{-webkit-animation:rotate-data-v-7bd90a03 1.1s infinite;animation:rotate-data-v-7bd90a03 1.1s infinite;-webkit-animation-timing-function:cubic-bezier(.3,1.65,.7,-.65);animation-timing-function:cubic-bezier(.3,1.65,.7,-.65)}@-webkit-keyframes rotate-data-v-7bd90a03{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}100%{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}@keyframes rotate-data-v-7bd90a03{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}100%{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}.true[data-v-7bd90a03]{color:#000}.iconYes[data-v-7bd90a03]{width:%?34?%;height:%?34?%}',""]),t.exports=e},c91c:function(t,e,a){var n=a("24fb");e=n(!1),e.push([t.i,".m-l-1[data-v-33e388fe]{margin-left:%?20?%}.order-item[data-v-33e388fe]{background-color:#fff;margin:%?20?%;padding:%?20?%;-webkit-border-radius:%?10?%;border-radius:%?10?%}.tab-bottom[data-v-33e388fe]{border-bottom:1px solid #fd6801}.tab-item[data-v-33e388fe]{padding-left:%?20?%}",""]),t.exports=e},d0ff:function(t,e,a){"use strict";function n(t,e){(null==e||e>t.length)&&(e=t.length);for(var a=0,n=new Array(e);a<e;a++)n[a]=t[a];return n}function i(t){if(Array.isArray(t))return n(t)}a.r(e);a("a4d3"),a("e01a"),a("d28b"),a("a630"),a("e260"),a("d3b7"),a("3ca3"),a("ddb0");function r(t){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}a("fb6a"),a("25f0");function s(t,e){if(t){if("string"===typeof t)return n(t,e);var a=Object.prototype.toString.call(t).slice(8,-1);return"Object"===a&&t.constructor&&(a=t.constructor.name),"Map"===a||"Set"===a?Array.from(a):"Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)?n(t,e):void 0}}function o(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function c(t){return i(t)||r(t)||s(t)||o()}a.d(e,"default",(function(){return c}))},e1c5:function(t,e,a){var n=a("c91c");"string"===typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);var i=a("4f06").default;i("7be22422",n,!0,{sourceMap:!1,shadowMode:!1})},e1f2:function(t,e,a){"use strict";var n=a("e1c5"),i=a.n(n);i.a},e49b:function(t,e,a){"use strict";a.r(e);var n=a("c2af"),i=a.n(n);for(var r in n)"default"!==r&&function(t){a.d(e,t,(function(){return n[t]}))}(r);e["default"]=i.a},ebdf:function(t,e,a){"use strict";var n=a("72be"),i=a.n(n);i.a}}]);