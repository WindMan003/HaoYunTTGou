<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// 初始化登录
			// this.$store.commit('initUser')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/* 公共样式 */
	@import "/common/common.css";
	/* UI基础库 */
	@import "/common/zcm-main.css";

	/*每个页面公共css */
	page,image{
		width: 100%;
		height: 100%;
	}
</style>
