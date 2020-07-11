<template>
	<view>
		<web-view v-if="!isshenhe" :webview-styles="webviewStyles" :src="getLink" @message="handleMessage"></web-view>
		<view class="d-flex flex-column a-center j-center text-muted" :style="'height:'+windowHeight+'px;'" v-else>
			暂无开启活动哦~
		</view>
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
				link: '',
				windowHeight: 0
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res) => {
					this.windowHeight = res.windowHeight
				}
			})
		},
		computed:{
			...mapState({
				appConfig:state=>state.user.appConfig,
				token:state=>state.user.token,
				merchantID:state=>state.merchant.merchantID,
				isshenhe:state=>state.user.isshenhe
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
