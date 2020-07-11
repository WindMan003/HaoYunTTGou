<template>
	<view>
		<web-view :webview-styles="webviewStyles" :src="getLink" @message="handleMessage"></web-view>
	</view>
</template>

<script>
	import {mapState, mapMutations} from "vuex"
	export default {
		data() {
			return {
				agent: '',
				backurl: '',
				webviewStyles: {
					progress: {
						color: '#FF3333'
					}
				}
			}
		},
		onLoad:function(option) {
			let action = option.action
			let backurl = option.backurl
			if(action){
				this.agent = action
			}
			if(backurl){
				this.backurl = backurl
			}
		},
		onBackPress(options) {
			console.log('from:' + options.from)
			// if(options.from == 'backbutton'){
				uni.redirectTo({
					url: this.backurl
				})
			// }
		},
		computed:{
			...mapState({
				merchantSite:state=>state.user.merchantSite,
				token:state=>state.user.token
			}),
			getLink(){
				var link = this.merchantSite + this.agent + '?token=' + encodeURIComponent(this.token)
				console.log(link)
			
				return link
			}
		},
		methods: {
			handleMessage(evt) {  
				console.log('接收到的消息：' + JSON.stringify(evt.detail)); 
			}
		}
	}
</script>

<style>

</style>
