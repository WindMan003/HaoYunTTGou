<template>
	<view>
		<web-view :webview-styles="webviewStyles" :src="jumpurl" @message="handleMessage"></web-view>
	</view>
</template>

<script>
	import {mapState, mapMutations} from "vuex"
	
	export default {
		data() {
			return {
				jumpurl: '',
				wvid: '',
				webviewStyles: {
					progress: {
						color: '#FF3333'
					}
				}
			}
		},
		onLoad:function(option) {
			console.log(option)
			
			this.jumpurl = option.jumpurl
			this.wvid = option.wvid
			
			// #ifdef APP-PLUS
			var _self = this
			var currentWebview = this.$scope.$getAppWebview()
			//此对象相当于html5plus里的plus.webview.currentWebview()。
			//在uni-app里vue页面直接使用plus.webview.currentWebview()无效，非v3编译模式使用this.$mp.page.$getAppWebview()
			setTimeout(function() {
				let wv = currentWebview.children()[0]
				let data = {}
				data.wvid = _self.wvid
				data.webview = wv
				_self.initWebview(data)
			}, 1000); //如果是页面初始化调用时，需要延时一下
			// #endif
		},
		computed:{
			...mapState({
				webview:state=>state.user.webview
			}),
		},
		methods: {
			...mapMutations([
				'initWebview',
			]),
			handleMessage(evt) {
				console.log('接收到的消息：' + JSON.stringify(evt.detail)); 
				// #ifdef APP-PLUS
				let data = evt.detail.data[0]
				if(data.action == 'js'){
					let m_webview = this.getWebview(data.wvid)
					if(m_webview){
						m_webview.evalJS(data.data)
					}
				}else if(data.action == 'back'){
					let m_webview = this.getWebview(data.wvid)
					if(m_webview){
						m_webview.close()
						m_webview.onclose = function(){
							uni.navigateBack({
								delta: Number(data.data)
							})	
						}
					}
				}
				// #endif
			},
			getWebview(wvid){
				for (let i = 0; i < this.webview.length; i++) {
					console.log(this.webview[i].wvid)
					console.log(wvid)
					if(this.webview[i].wvid == wvid){
						return this.webview[i].webview
					}
				}
				return null
			}
		}
	}
</script>

<style>

</style>
