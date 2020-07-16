<template>
	<view>
		<web-view v-if="!isshenhe" :webview-styles="webviewStyles" :src="link" @message="handleMessage"></web-view>
		<view class="d-flex flex-column a-center j-center text-muted" :style="'height:'+windowHeight+'px;'" v-else>
			期待后续更新哦~
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
			this.link = this.appConfig.UserWebSite + '/User/Menu' + '?token=' + encodeURIComponent(this.token)
			console.log(this.link)
		},
		computed:{
			...mapState({
				appConfig:state=>state.user.appConfig,
				token:state=>state.user.token,
				isshenhe:state=>state.user.isshenhe
			}),
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
