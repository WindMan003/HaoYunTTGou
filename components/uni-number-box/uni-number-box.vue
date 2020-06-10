<template>
	<view class="uni-numbox" :id="'UniNumberBox'+nameid">
		<view @click="operationResult('minus')" class="uni-numbox__minus">
			<text class="uni-numbox--text" :class="{ 'uni-numbox--disabled': inputValue <= min || disabled }">-</text>
		</view>
		<input :disabled="true" @blur="_onBlur" class="uni-numbox__value" type="number" v-model="inputValue" />
		<view @click="operationResult('plus')" class="uni-numbox__plus">
			<text class="uni-numbox--text" :class="{ 'uni-numbox--disabled': inputValue >= max || disabled }">+</text>
		</view>
	</view>
</template>

<script>
	/**
	 * NumberBox 数字输入框
	 * @description 带加减按钮的数字输入框
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=31
	 * @property {Number} value 输入框当前值
	 * @property {Number} min 最小值
	 * @property {Number} max 最大值
	 * @property {Number} step 每次点击改变的间隔大小
	 * @property {Boolean} disabled = [true|false] 是否为禁用状态
	 * @event {Function} change 输入框值改变时触发的事件，参数为输入框当前的 value
	 */
	import {mapState,mapGetters,mapActions,mapMutations} from "vuex"
	
	export default {
		name: "UniNumberBox",
		props: {
			value: {
				type: [Number, String],
				default: 0
			},
			min: {
				type: Number,
				default: 0
			},
			max: {
				type: Number,
				default: 100
			},
			step: {
				type: Number,
				default: 1
			},
			disabled: {
				type: Boolean,
				default: false
			},
			nameid: {
				type: Number,
				default: 0
			},
			tasteId: {
				type: Number,
				default: 0
			},
			specId: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				clickTime:100,
				inputValue:0,
				touchType:'',
				productsList:[]
			};
		},
		watch: {
			value(val) {
				this.inputValue = +val;
			},
			inputValue(newVal, oldVal) {
				if (+newVal !== +oldVal) {
					this.$emit("change", this.productsList)
				}
			}
		},
		created() {
			this.inputValue = +this.value;
		},
		computed:{
			...mapState({
				cartId:state=>state.cart.cartId,
				isManyPeople:state=>state.merchant.isManyPeople,
				merchantID:state=>state.merchant.merchantID,
				tableID:state=>state.merchant.tableID
			}),
			...mapGetters([
		
			]),
			
		},
		methods: {
			...mapMutations([
				'initID'
			]),
			...mapActions([
				'operationCartGoods',
				'updateCartIdFunc'
			]),
			operationResult(string){
				var _self = this
				//判断是否是多人点单，如果是：判断是否创建了购物车ID
				if(_self.isManyPeople && _self.cartId == 0){
					_self.$emit("createid")
					return
				}else if(!_self.isManyPeople && _self.cartId == 0){
					console.log("tableID === ")
					console.log(_self.tableID)
					_self.$H.post('/api/Merchant/CreateShoppingCart',{
						MerchantID:_self.merchantID,
						TableID:_self.tableID
					},{
						token:true
					}).then(res=>{
						if(res.status == 0){
							_self.updateCartIdFunc(res.data.CartID)
							_self.initID(res.data.ID)
							_self.addOrSunGoodsCount(string)
						}else{
							_self.$Common.showToast(res)
						}
					})
				}else{
					_self.addOrSunGoodsCount(string)
				}
			},
			addOrSunGoodsCount(string){
				if(this.inputValue <= 0 && string === 'minus'){
					return
				}
				this.operationCartGoods({
					operationStr:string,
					nameid:this.nameid,
					tasteId:this.tasteId,
					specId:this.specId,
					merchantID:this.merchantID
				})
			},
			_calcValue(type) {
				if (this.disabled) {
					return;
				}
				const scale = this._getDecimalScale();
				let value = this.inputValue * scale;
				let step = this.step * scale;
				if (type === "minus") {
					value -= step;
					if (value < (this.min * scale)) {
						return;
					}
					if (value > (this.max * scale)) {
						value = this.max * scale
					}
				} else if (type === "plus") {
					value += step;
					if (value > (this.max * scale)) {
						return;
					}
					if (value < (this.min * scale)) {
						value = this.min * scale
					}
				}

				this.inputValue = String(value / scale);
			},
			_getDecimalScale() {
				let scale = 1;
				// 浮点型
				if (~~this.step !== this.step) {
					scale = Math.pow(10, (this.step + "").split(".")[1].length);
				}
				return scale;
			},
			_onBlur(event) {
				let value = event.detail.value;
				if (!value) {
					// this.inputValue = 0;
					return;
				}
				value = +value;
				if (value > this.max) {
					value = this.max;
				} else if (value < this.min) {
					value = this.min;
				}
				this.inputValue = value;
			}
		}
	};
</script>
<style scoped>
	/* #ifdef APP-NVUE */
	/* #endif */

	.uni-numbox {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		height: 25px;
		line-height: 25px;
		width: 90px;
	}

	.uni-numbox__value {
		background-color: #ffffff;
		width: 30px;
		height: 25px;
		text-align: center;
		font-size: 28rpx;
		border-width: 1rpx;
		border-style: solid;
		border-color: #e5e5e5;
		border-left-width: 0;
		border-right-width: 0;
	}

	.uni-numbox__minus {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 25px;
		height: 25px;
		/* line-height: $box-line-height;
 */
		/* text-align: center;
 */
		font-size: 18px;
		color: #333;
		background-color: #f8f8f8;
		border-width: 1rpx;
		border-style: solid;
		border-color: #e5e5e5;
		border-top-left-radius: 6rpx;
		border-bottom-left-radius: 6rpx;
		border-right-width: 0;
	}

	.uni-numbox__plus {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 25px;
		height: 25px;
		border-width: 1rpx;
		border-style: solid;
		border-color: #e5e5e5;
		border-top-right-radius: 6rpx;
		border-bottom-right-radius: 6rpx;
		background-color: #f8f8f8;
		border-left-width: 0;
	}

	.uni-numbox--text {
		font-size: 38rpx;
		color: #333;
	}

	.uni-numbox--disabled {
		color: #c0c0c0;
	}
</style>