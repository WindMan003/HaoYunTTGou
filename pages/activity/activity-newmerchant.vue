<template>
	<view>
		<web-view :webview-styles="webviewStyles" :src="getLink" @message="handleMessage"></web-view>
	</view>
</template>

<script>
	import {mapState,mapGetters,mapActions,mapMutations} from "vuex"
	
	export default {
		data() {
			return {
				webviewStyles: {
					progress: {
						color: '#FF3333'
					}
				},
				merchantID: ''
			}
		},
		onLoad:function(option) {
			console.log(option)
			this.merchantID = option.merchantID
		},
		computed:{
			...mapState({
				appConfig:state=>state.user.appConfig,
				token:state=>state.user.token,
			}),
			getLink(){
				let link = this.appConfig.UserWebSite + '/Merchant/Activity/' + this.merchantID + '?token=' + encodeURIComponent(this.token)
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
