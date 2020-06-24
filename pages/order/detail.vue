<template>
	<view class="p-2">
		<view class="d-flex flex-row">
			<view style="width: 50%;">
				<text>订单号：</text>
				<text>{{ item.ID }}</text>
			</view>
			<view style="width: 50%;">
				<text>订单状态：</text>
				<text class="main-text-color">{{ item.StatusName }}</text>
			</view>
		</view>
		<view class="d-flex flex-row" v-if="item.IsNeedServiceFee == 1">
			<view style="width: 50%;">
				<text>服务费：</text>
				<text>{{ item.ServiceUnitPrice }}元/人</text>
			</view>
			<view style="width: 50%;">
				<text>用餐人数：</text>
				<text class="">{{ item.UserCount }}</text>
			</view>
		</view>
		<view>
			<text>订单金额：</text>
			<text style="color: #FF582B;">{{ '￥'+item.Amount }}</text>
		</view>
		<view v-if="item.UserNote != ''">
			<text>备注：</text>
			<text>{{ item.UserNote }}</text>
		</view>
		<view v-if="item.UseVoucherAmount > 0">
			<text>使用代金券：</text>
			<text class="main-text-color">{{ item.UseVoucherAmount }}</text>
		</view>
		<view v-if="item.UseLuckyCoin > 0">
			<text>使用幸运币：</text>
			<text class="main-text-color">{{ item.UseLuckyCoin }}</text>
		</view>
		<view v-if="item.UseBuyCoin > 0">
			<text>使用代金币：</text>
			<text class="main-text-color">{{ item.UseBuyCoin }}</text>
		</view>
		<view v-if="item.Status == 3">
			<text>实付金额：</text>
			<text class="main-text-color">{{ item.PayAmount }}</text>
		</view>
		<view class="d-flex flex-row text-right" style="height: 90rpx;">
			<view class="position-absolute" style="right: 20rpx;">
				<button class="mr-2" v-if="item.Status == 0 || item.Status == 1" size="mini" type="primary"  @click="addMore(item.ID)">
					继续添加
				</button>
				<button v-if="item.Status == 1 || item.Status == 2" size="mini" type="primary" @click="goToPay(item)">
					去付款
				</button>
			</view>
		</view>

		<view class="border-bottom" style="padding-top:5rpx"></view>
		<view class="p-1" v-for="(item, index) in productList" :key="index">
			<text v-if="item.addRound > 0" class="font-weight font-md">
				第<text class="main-text-color">{{ item.addRound }}</text>轮新加
			</text>
			<text v-else class="font-weight font-md">首轮点购</text>
			<view class="d-flex flex-row text-muted">
				<view style="width: 40%;"></view>
				<view style="width: 20%;">数量</view>
				<view style="width: 20%;">金额</view>
				<view style="width: 20%;">状态</view>
			</view>
			<view class="d-flex flex-row text-muted" v-for="(p, listIndex) in item.list" :key="listIndex">
				<view style="width: 40%;">
					<template v-if="p.SpecificationID">
						{{ p.ProductName + '（' + p.SpecificationName + '）' }}
					</template>
					<template v-else>
						{{ p.ProductName }}
					</template>
				</view>
				<view style="width: 20%;">{{ p.Count }}</view>
				<view style="width: 20%;">{{ p.TotalAmount }}</view>
				<view style="width: 20%;">
					<text v-if="p.Status == 0" class="main-text-color">未上</text>
					<text v-else style="color: green;">已上</text>
				</view>
			</view>
			<view class="border-bottom" style="padding-top:5rpx"></view>
		</view>
		<view v-if="item.IsNeedServiceFee == 1">
			<view class="d-flex flex-row a-center j-end mr-5 mt">{{'￥'+item.AmountNoServiceFee}}</view>
			<view class="d-flex flex-row a-center j-end mr-5 mt">{{'服务费：￥'+item.ServiceFee}}</view>
		</view>
		<view class="d-flex flex-row a-center j-end mr-5 mt" >
			<view class="">总价：</view>
			<view style="color: #FF582B;">{{'￥'+item.Amount}}</view>
		</view>
	</view>
</template>
<script>
	import {mapState,mapGetters,mapActions,mapMutations} from "vuex"
	
	export default {
		data() {
			return {
				item: {},
				productList: []
			};
		},
		onLoad(e) {
			this.orderID = e.orderID;
			let data = { orderID: this.orderID };
			let options = {
				token: true
			};
			this.$H.post('/api/Order/detail', data, options).then(res => {
				this.item = res.data.OrderItem;
				console.log(res)
				for (var i = res.data.OrderItem.AddRound; i >= 0; i--) {
					let newItem = {
						addRound: i,
						list: []
					};
					for (var j = 0; j < res.data.ProductList.length; j++) {
						let obj = res.data.ProductList[j];
						if (obj.AddRound == i) {
							newItem.list.push(obj);
						}
					}
					this.productList.push(newItem);
				}
			});
		},
		computed:{
			...mapState({
				merchantID:state=>state.merchant.merchantID,
				tableID:state=>state.merchant.tableID
			}),
			...mapGetters([
			]),
		},
		methods: {
			...mapMutations([
				'clearCartList',
				'updateOrderID',
				'updateCartId',
				'initID'
			]),
			...mapActions([
				'updateCartIdFunc'
			]),
			
			addMore(orderID) {
				var _self = this;
				_self.$H.post('/api/Merchant/CreateShoppingCart',{
					MerchantID: _self.merchantID,
					TableID: _self.tableID
				},{
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						_self.clearCartList()
						_self.updateOrderID(orderID)
						_self.updateCartIdFunc(res.data.CartID)
						_self.initID(res.data.ID)
						uni.switchTab({
							url:'../index/index'
						})
					}else{
						_self.$Common.showToast(res)
					}
				})
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
			}
		}
	};
</script>

<style></style>
