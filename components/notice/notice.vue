<template>
	<refresh ref="refresh" @isRefresh="refreshList">
		<scroll-view scroll-y="true" :style="'height:'+(scrollH)+'px;'">
			<card :headTitle="'商家公告'" :bodyPadding="true">
				<view>
					<view class="d-flex flex-row w-100 mb-1 border-bottom" style="padding-bottom: 15rpx;"
					v-for="(item, index) in list" :key="index" @click="showDetail(item.ID)">
						<view style="width: 75%;">{{ item.Name }}</view>
						<view style="width: 25%;" class="text-right">{{ getDate(item.CreateTime) }}</view>
					</view>
					<uni-load-more
						:status="status"
						:contentText="{ contentdown: '点击加载更多', contentrefresh: '正在加载...', contentnomore: '没有更多数据了' }"
						@clickLoadMore="clickLoadMore"></uni-load-more>
				</view>
			</card>
			<view class="" style="height: 100rpx;"></view>
		</scroll-view>
	</refresh>
</template>

<script>
	import refresh from '@/components/common/refresh.vue';
	import card from '@/components/common/card.vue';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'

	import {mapState, mapGetters, mapActions, mapMutations} from "vuex"
	
	export default {
		components: {
			card,
			refresh,
			uniLoadMore
		},
		data() {
			return {
				merchantID: 0,
				status: 'more',
				pageSize: 15,
				pageIndex: 1,
				scrollH:0,
				isPullRefresh: false,
				list: []
			};
		},
		computed:{
			...mapState({
			})
		},
		methods: {
			sendSocketMessage(msg) {
				console.log(socketOpen)
				if (socketOpen) {
					uni.sendSocketMessage({
						data: msg
					});
				} else {
					socketMsgQueue.push(msg);
				}
			},
			getDate(dTime) {
				return this.$Time.dateFormat(new Date(dTime), 'yyyy-MM-dd');
			},
			initNoticeList(scrollH, merchantID, callBack){
				var _self = this
				_self.scrollH = scrollH
				_self.merchantID = merchantID
				let url = '/api/merchant/NoticeList';
				let postData = { MerchantID: _self.merchantID, pageSize: _self.pageSize, pageIndex: _self.pageIndex };
				_self.$H.post(url, postData).then(res => {
					if (_self.isPullRefresh) {
						_self.list = res.data;
					} else {
						_self.list = [..._self.list, ...res.data];
					}
					if (res.data.length + 1 < _self.pageSize) {
						_self.status = 'noMore';
					} else {
						_self.status = 'more';
					}
					if (callBack) {
						callBack()
					}
				});
			},
			showDetail(id) {
				uni.navigateTo({
					url:'../../pages/notice/detail?id='+id,
				});
			},
			clickLoadMore(e) {
				console.log("bbbbbb")
				if (e.detail.status == 'noMore') {
					return;
				}
				console.log("aaaaaaa")
				this.pageIndex = this.pageIndex + 1;
				this.status = 'loading';
				this.initNoticeList(this.scrollH, this.merchantID)
			},
			//------------------刷新touch监听------------------
			refreshList() {
				console.log('111111111111')
				this.isPullRefresh = true;
				this.pageIndex = 1;
				this.initNoticeList(this.scrollH, this.merchantID, () => {
					uni.showToast({
						icon: 'none',
						title: '刷新成功'
					});
					//刷新结束调用
					this.$refs.refresh.endAfter(); 
					this.isPullRefresh = false;
				});
			}
		}
	};
</script>

<style>
	r-item {
		background-color: white;
		margin: 20rpx;
		padding: 20rpx;
		border-radius: 10rpx;
	}

	.tab-bottom {
		border-bottom: 1px solid #fd6801;
	}
</style>
