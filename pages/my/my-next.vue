<template>
	<view class="d-flex flex-column a-center" style="background-color: #F5F5F5;" :style="'height:'+ windowHeight + 'px'">
		<view class="d-flex flex-column bg-white rounded-10 mt-3" style="width: 94%;">
			<block v-for="(item, index) in menuList" :key="index">
				<uni-list-item :title="item.Name" @click="jumpPageView(item)"></uni-list-item>
			</block>
		</view>
	</view>
</template>

<script>
	import {mapState,mapGetters,mapActions,mapMutations} from "vuex"
	
	export default {
		data() {
			return {
				windowHeight: 0,
				menuList: [],
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res) => {
					this.windowHeight = res.windowHeight
				}
			})
			this.menuList = JSON.parse(decodeURIComponent(option.list))
		},
		computed:{
			...mapState({
				userWebSite:state=>state.user.userWebSite,
				isshenhe:state=>state.user.isshenhe
			}),
		},
		methods: {
			jumpPageView(m_item){
				if(this.isshenhe){
					uni.showToast({title: "后续开放，尽请期待！", icon: "none", duration: 1500});
					return false
				}
				var nextList = this.getNextMenu(m_item.ID)
				if(nextList.length > 0){
					uni.navigateTo({
						url: './prize-next?list=' + encodeURIComponent(JSON.stringify(nextList))
					})
				}else{
					if(m_item.IsWebView == 1){
						var link = this.userWebSite + m_item.PagePath
						uni.navigateTo({
							url: '../webview/webview-jump?jumpurl=' + link + '&wvid=' + m_item.WVID
						})
					}else{
						
					}
				}
			},
			getNextMenu(m_id){
				var temp = this.menuList
				var nextList = []
				for (let i = 0; i < temp.length; i++) {
					if(temp[i].ParentID != 0 && m_id == temp[i].ParentID){
						nextList.push(temp[i])
					}
				}
				return nextList
			}
		}
	}
</script>

<style>

</style>
