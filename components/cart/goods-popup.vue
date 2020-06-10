<template>
	<uni-popup type="center" ref="popup" className="uni-popup__wrapper-box-goods-spec">
		<view class="d-flex a-center j-center w-100" style="height: 100%;">
			<view class="border w-100" style="height: 100%; background-color: #FFFFFF; border-radius: 3%;">
				<view class="ml-3 mr-3">
					<view class="mt-2 font-38 font-weight">{{goodsList.Name}}</view>
					<block v-if="goodsList.TasteList">
						<view class="mt-2 font-24">口味</view>
						<view class="mt-1 d-flex flex-wrap">
							<view class="mb-2 mr-3 p-1 border span24-6 font-24 text-center" style="border-radius: 10rpx;"
							v-for="(item,index) in goodsList.TasteList" :key="index"
							:style="tasteIndex === index ? getChooseColor:''" @click="tasteChoose(index)">
								<text class="d-flex a-center j-center">{{item.Name}}</text>
							</view>
						</view>
					</block>
					<block v-if="goodsList.Specifications">
						<view class="mt-2 font-24">规格</view>
						<view class="mt-1 d-flex flex-wrap">
							<view class="mb-2 mr-3 p-1 border span24-6 font-24 text-center" style="border-radius: 10rpx;"
							v-for="(item,index) in goodsList.Specifications" :key="index"
							:style="specificationIndex === index ? getChooseColor:''" @click="specificationChoose(index)">
								<text class="d-flex a-center j-center">{{item.Name}}</text>
							</view>
						</view>
					</block>
				</view>
				<view class="mt-3 border-bottom border-top w-100 d-flex a-center" style="height: 80rpx; background: #EEEEEE;">
					<text class="ml-3 font-28">{{getSelectedStr}}</text>
				</view>
				<view class="pb-1 mt-3 mb-2 d-flex a-center position-relative w-100">
					<view class="ml-3">
						<price>{{getGoodsPrice}}</price>
					</view>
					<view class="position-absolute border pl-2 pr-2" 
					style="right: 10rpx; background: #FFA500; border-radius: 10rpx;" 
					v-if="nowChooseCount === 0" @click="addGoodsTouch">
						<text class="font-28">加入购物车</text>
					</view>
					<view class="position-absolute pl-2 pr-2" style="right: 10rpx;" v-else>
						<hx-number-box :value="nowChooseCount" :nameid="goodsId" :tasteId="tasteId" :specId="specId"></hx-number-box>
					</view>
				</view>			
			</view>
		</view>
	</uni-popup>
</template>

<script>
	import hxNumberBox from "@/components/uni-number-box/uni-number-box.vue";
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import price from "@/components/common/price.vue"
	
	import {mapState,mapGetters,mapActions,mapMutations} from "vuex"
	
	export default{
		components:{
			uniPopup,
			price,
			hxNumberBox
		},
		props:{
		},
		data() {
			return {
				//商品信息
				goodsList:{},
				goodsId:0,
				tasteId:0,
				specId:0,
				tasteIndex:0,
				specificationIndex:0,
				//当前选中是否已有
				chooseState:false
			}
		},
		computed:{
			...mapState({
				nowChooseCount:state=>state.cart.nowChooseCount,
				chooseTotalPrice:state=>state.cart.chooseTotalPrice,
				isManyPeople:state=>state.merchant.isManyPeople,
				cartId:state=>state.cart.cartId,
				merchantID:state=>state.merchant.merchantID,
				tableID:state=>state.merchant.tableID
			}),
			...mapGetters([
				'getGoodsCount',
				'getGoodsIdList',
			]),
			
			getChooseColor(){
				return 'background: #FFEFD5; border-color: #FF8C00; color: #FF8C00;'
			},
			getSelectedStr(){
				let tasteStr = null
				let specStr = null
				
				if(this.goodsList){
					if(this.goodsList.TasteList){
						tasteStr = this.goodsList.TasteList[this.tasteIndex].Name
					}
					if(this.goodsList.Specifications){
						specStr = this.goodsList.Specifications[this.specificationIndex].Name
					}
				}
				
				if(tasteStr && specStr){
					return `已选规格：${tasteStr}  ${specStr}`
				}else if(specStr && !tasteStr){
					return `已选规格：${specStr}`
				}else{
					return `已选口味：${tasteStr}`
				}
			},
			getGoodsPrice(){
				if(this.chooseTotalPrice !== 0){
					return this.chooseTotalPrice
				}
				if(this.goodsList){
					if(this.goodsList.Specifications){
						return this.goodsList.Specifications[this.specificationIndex].Price
					}
					if(!this.goodsList.Specifications && this.goodsList.TasteList){
						return this.goodsList.Price
					}
				}
			}
		},
		methods:{
			...mapMutations([
				'initID'
			]),
			...mapActions([
				'operationCartGoods',
				'updateSpecDateFunc',
				'updateCartIdFunc'
			]),
			
			tasteChoose(index){
				this.tasteId = this.goodsList.TasteList[index].ID
				this.tasteIndex = index
				this.updateGoodsCountBySpec()
			},
			specificationChoose(index){
				this.specId = this.goodsList.Specifications[index].ID
				this.specificationIndex = index
				this.updateGoodsCountBySpec()
			},
			showPopup(goodsId){
				//初始化数据
				this.tasteIndex = 0
				this.specificationIndex = 0
				this.tasteId = 0
				this.specId = 0
				
				this.goodsId = goodsId
				this.goodsList = this.getGoodsIdList(goodsId)
				
				if(this.goodsList.TasteList){
					this.tasteId = this.goodsList.TasteList[this.tasteIndex].ID
				}
				if(this.goodsList.Specifications){
					this.specId = this.goodsList.Specifications[this.specificationIndex].ID
				}
				this.updateGoodsCountBySpec()
				
				this.$refs.popup.open()
			},
			//更新商品数量
			updateGoodsCountBySpec(){
				this.updateSpecDateFunc({
					"goodsId":this.goodsId,
					"tasteId":this.tasteId,
					"specId":this.specId
				})
			},
			addGoodsTouch(){
				this.operationResult('plus')
			},
			subGoodsTouch(){
				this.operationResult('minus')
			},
			operationResult(string){
				//判断是否是多人点单，如果是：判断是否创建了购物车ID
				if(this.isManyPeople && this.cartId === 0){
					this.$emit("createid")
					return
				}else if(!this.isManyPeople && this.cartId === 0){
					this.$H.post('/api/Merchant/CreateShoppingCart',{
						MerchantID:this.merchantID,
						TableID:this.tableID
					},{
						token:true
					}).then(res=>{
						if(res.status == 0){
							this.updateCartIdFunc(res.data.CartID)
							this.initID(res.data.ID)
							this.addOrSunGoodsCount(string)
						}else{
							_self.$Common.showToast(res)
						}
					})
				}else{
					this.addOrSunGoodsCount(string)
				}
			},
			addOrSunGoodsCount(string){
				this.operationCartGoods({
					operationStr:string,
					nameid:this.goodsList.ID,
					tasteId:this.tasteId,
					specId:this.specId,
					merchantID:this.merchantID
				})
			},
		}
	}
</script>

<style>

</style>
