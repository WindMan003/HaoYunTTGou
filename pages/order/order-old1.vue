<template>
	<view class="">
		<view class="w-100 d-flex flex-row a-center ml-2 flex-wrap" style="height: 70rpx;">
			<block v-for="(item, index) in orderStatusList" :key="index">
				<view class="mr-1 mt-1 mb pl pr font-26 border rounded"
				:style="item.Value == orderStatus ? 'color: #FD6801; border-color: #FD6801;':''"
				@click="switchStatus(item.Value)">
					{{item.Text}}
				</view>
			</block>
		</view>
		
		<scroll-view scroll-y :style="'height:'+(scrollH - 35)+'px;'" style="background-color: #F5F5F5;">
			<block v-for="(item, index) in orderList" :key="index">
				<view class="ml-2 mt-2">
					<order-item :item="item"></order-item>
				</view>
			</block>
		</scroll-view>
	</view>
</template>

<script>
	import orderItem from "@/components/order/order-item.vue"
	
	import {mapState,mapGetters,mapActions,mapMutations} from "vuex"
	export default {
		components: { 
			orderItem
		},
		data() {
			return {
				scrollH:0,
				pageSize: 15,
				pageIndex: 1,
				orderStatus: -1,
				orderStatusList:[],
				orderList:[]
			};
		},
		onShow() {
			uni.getSystemInfo({
				success: (res) => {
					this.scrollH = res.windowHeight
				}
			})
			this.initStatus()
		},
		methods: {
			...mapMutations([
				'updateOrderList'
			]),
			
			initStatus(){
				var _self = this
				_self.$H.post('/api/Order/GetOrderStatus',{},{
					token:true
				}).then(res=>{	
					console.log(res)
					if(res.status == 0){
						_self.orderStatusList = res.data
						_self.loadList()
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1000})
					}
				})
			},
			loadList(){
				var _self = this
				_self.$H.post('/api/Order/list',{
					pageSize: this.pageSize,
					status: this.orderStatus,
					pageIndex: this.pageIndex
				},{
					token:true
				}).then(res=>{	
					console.log(res)
					if(res.status == 0){
						_self.orderList = res.data
						_self.updateOrderList(_self.orderList)
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1000})
					}
				})
			},
			switchStatus(m_status){
				this.pageIndex = 1
				this.orderStatus = m_status
				this.loadList()
			}
		}
	};
</script>

<style>
	
</style>
