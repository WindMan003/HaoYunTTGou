import Vue from 'vue'
import App from './App'

App.mpType = 'app'

import store from './store'
Vue.prototype.$S = store
// 引入request库
import $H from '@/common/lib/request.js';
Vue.prototype.$H = $H
// 引入md5库
import $md5 from '@/common/lib/md5.js';
Vue.prototype.$md5 = $md5
//引入公共函数库
import $Common from '@/common/lib/common.js';
Vue.prototype.$Common = $Common

import $Time from '@/common/lib/time.js';
Vue.prototype.$Time = $Time


const app = new Vue({
	store,
    ...App
})
app.$mount()
