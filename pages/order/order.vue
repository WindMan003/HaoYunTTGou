<template>
	<view class="">
		<refresh ref="refresh" @isRefresh="refreshList">
			<scroll-view scroll-x class="border-bottom scroll-row" style="height: 80rpx;line-height: 80rpx;" :scroll-into-view="scrollInto">
				<view
					class="scroll-row-item tab-item"
					v-for="(item, index) in tabBars"
					:key="index"
					:class="index === tabIndex ? 'main-text-color' : ''"
					:id="'tab' + index"
					@click="changeTab(index)"
					:style="index === tabBars.length - 1 ? 'padding-right:20rpx' : ''"
				>
					<text class="font-md" :class="tabIndex === index ? 'tab-bottom' : ''">{{ item.Text }}</text>
				</view>
			</scroll-view>
			<swiper :duration="150" :current="tabIndex" :style="'height:' + scrollH + 'px;'" style="background-color: #F5F5F5;" @change="onChangeTab">
				<swiper-item v-for="(item, listItemIndex) in listItems" :key="listItemIndex">
					<scroll-view :style="'height:' + scrollH + 'px;'" scroll-y="true" @scrolltolower="loadMore">
						<template v-if="item.list.length > 0">
							<view class="order-item" v-for="(data, index) in item.list" :key="index">
								<view class="font-weight border-bottom pb-1">{{ data.MerchantName }}>></view>
		
								<view @click="openOrderDetail(data.ID)" class="pt-1">
									<view class="">
										<text>下单时间：</text>
										<text>{{ data.CreateTime }}</text>
									</view>
									<view>
										<text>订单号：</text>
										<text>{{ data.ID }}</text>
										<text class="ml-3">订单状态：</text>
										<text>{{ data.StatusName }}</text>
									</view>
									<view>
										<text>订单金额：</text>
										<text class="main-text-color">{{ data.Amount }}</text>
										<text class="ml-3">实付款：</text>
										<text class="main-text-color">{{ data.PayAmount }}</text>
									</view>
								</view>
								<view class="text-right">
									<button v-if="data.Status == 0" size="mini" type="primary" @click="cancelOrder(data.ID)">取消</button>
									<button v-else-if="data.Status == 1 || data.Status == 2" size="mini" type="primary" 
									@click="goToPay(data)">去付款</button>
								</view>
							</view>
							<view class="d-flex a-center j-center text-light-muted font-md py-3">{{ item.loadText }}</view>
						</template>
						<view v-else-if="item.loadTag === 'before' || item.loadTag === 'ing'" class="d-flex j-center a-center pt-5">
							<text class="font-md text-light-muted">加载中...</text>
						</view>
						<!-- 空数据 -->
						<view v-else class="d-flex j-center a-center pt-5"><text class="font-md text-light-muted">暂无数据</text></view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</refresh>
	</view>
</template>

<script>
import refresh from '@/components/common/refresh.vue';

import {mapState,mapGetters,mapActions,mapMutations} from "vuex"
let options = {
	token: true
};
export default {
	components: { refresh },
	data() {
		return {
			scrollInto: '',
			scrollH: 500,
			tabBars: [],
			tabIndex: 0,
			orderStatus: -1,
			listItems: [],
			pageSize: 10,
			pageIndex: 1,
			isPullRefresh: false
		};
	},
	onLoad() {
		uni.getSystemInfo({
			success: res => {
				this.scrollH = res.windowHeight - uni.upx2px(80)
			}
		});
		this.loadTabBars();
	},
	computed:{
		...mapState({
			appConfig:state=>state.user.appConfig
		}),
		...mapGetters([
		]),
	},
	methods: {
		...mapMutations([
			'updateCartId',
			'updateOrderID'
		]),
		loadTabBars() {
			this.$H.post('/api/Order/GetOrderStatus', {}, options).then(res => {
				this.tabBars = res.data;
				for (var i = 0; i < this.tabBars.length; i++) {
					let item = {
						loadTag: 'before',
						list: [],
						loadText: '上拉加载更多'
					};
					this.listItems.push(item);
				}
				//加载首屏
				this.loadList();
			});
		},
		changeTab(index) {
			if (this.tabIndex === index) {
				return;
			}
			this.tabIndex = index;
			this.scrollInto = 'tab' + index;
			this.orderStatus = this.tabBars[index].Value;
			if (this.listItems[index].loadTag === 'after') {
				return;
			}
			this.loadList();
		},
		loadList(callback) {
			let item = this.listItems[this.tabIndex];
			let postData = {
				pageSize: this.pageSize,
				status: this.orderStatus,
				pageIndex: this.pageIndex
			};
			item.loadTag = 'ing';
			this.$H.post('/api/Order/list', postData, options).then(res => {
				if (this.isPullRefresh) {
					item.list = res.data;
					this.isPullRefresh = false;
				} else {
					item.list = [...item.list, ...res.data];
				}

				if (res.data.length < this.pageSize) {
					item.loadText = '没有更多了';
				} else {
					item.loadText = '上拉加载更多';
				}
				item.loadTag = 'after';
				//执行回调函数
				if (typeof callback === 'function') {
					callback();
				}
			});
		},
		openOrderDetail(orderID) {
			uni.navigateTo({
				url: './detail?orderID=' + orderID,
				animationType: 'pop-in',
				animationDuration: 200
			});
		},
		//上拉加载更多
		loadMore() {
			this.pageIndex = this.pageIndex + 1;
			let item = this.listItems[this.tabIndex];
			if (item.loadText !== '上拉加载更多') {
				return;
			}
			item.loadText = '加载中...';
			this.loadList(() => {
				uni.showToast({
					title: '加载成功',
					icon: 'none'
				});
			});
		},
		// 监听滑动列表
		onChangeTab(e) {
			this.changeTab(e.detail.current);
		},
		cancelOrder(orderID) {
			var _self = this
			uni.showModal({
				title: '提示',
				content: '确认是否取消？',
				success: res => {
					if (res.confirm) {
						let postData = {
							orderID: orderID
						};
						_self.$H.post('/api/Order/CancelOrder', postData, options).then(res => {
							console.log(res)
							if (res.status == 0) {
								//取消成功
								let lists = _self.listItems[_self.tabIndex].list;
								//找到当前数据对象
								for (var i = 0; i < lists.length; i++) {
									let curObj = lists[i];
									if (curObj.ID == orderID) {
										_self.updateCartId(0)
										_self.updateOrderID(0)
										//用户取消
										curObj.Status = 4;
										curObj.StatusName = '用户取消';
										break;
									}
								}
							}
						});
					} else if (res.cancel) {
					}
				}
			});
		},
		goToPay(m_item) {
			let m_price = m_item.Amount
			if(m_item.Status == 2){
				m_price = m_item.PayAmount
				console.log(m_price)
			}
			uni.navigateTo({
				url:'../payment/payment-pay?price='+m_price+'&orderID='+m_item.ID,
			})
		},
		refreshList() {
			this.pageIndex = 1;
			this.isPullRefresh = true;
			this.loadList(() => {
				uni.showToast({
					icon: 'none',
					title: '刷新成功',
					duration: 1500
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
.m-l-1 {
	margin-left: 20rpx;
}
.order-item {
	background-color: white;
	margin: 20rpx;
	padding: 20rpx;
	border-radius: 10rpx;
}
.tab-bottom {
	border-bottom: 1px solid #fd6801;
}
.tab-item {
	padding-left: 20rpx;
}
</style>
