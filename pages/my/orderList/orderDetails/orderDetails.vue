<template>
	<view>
		<view class="container">
			<view class="bold flexRowStart title">
				<view class="flexRowStart" v-if="orderInfo.isFree==1 && orderInfo.status!=3 && orderInfo.status!=2 && oss">
					<image class="titleImg" :src="oss+'icon_order_payed.png'"></image>
					<view class="color_3CD489">免费</view>
				</view>
				<view class="flexRowStart" v-else-if="orderInfo.status==0 && oss">
					<image class="titleImg" :src="oss+'icon_order_waitPay.png'"></image>
					<view class="color_F74437">待支付</view>
				</view>
				<view class="flexRowStart" v-else-if="orderInfo.isFree==0 && orderInfo.status==1 && oss">
					<image class="titleImg" :src="oss+'icon_order_payed.png'"></image>
					<view class="color_3CD489">交易成功</view>
				</view>
				<view class="flexRowStart" v-else-if="orderInfo.status==3 && oss">
					<image class="titleImg" :src="oss+'icon_order_payed.png'"></image>
					<view class="color_3CD489">已评价</view>
				</view>
				<view class="flexRowStart" v-else-if="orderInfo.status==2 && oss">
					<image class="titleImg" :src="oss+'icon_order_cancelPay.png'"></image>
					<view class="color_919397" >交易取消</view>
				</view>
				<view class="flexRowStart" v-else-if="orderInfo.status==4 && oss">
					<image class="titleImg" :src="oss+'icon_order_payMoney.png'"></image>
					<view class="color_F74437">待联系</view>
				</view>
				<view class="flexRowStart" v-else-if="orderInfo.status==5 && oss">
					<image class="titleImg" :src="oss+'icon_order_waitPay.png'"></image>
					<view class="color_F74437">退款中</view>
				</view>
				<view class="flexRowStart" v-else-if="orderInfo.status==6 && oss">
					<image class="titleImg" :src="oss+'icon_order_payed.png'"></image>
					<view class="color_F74437">退款成功</view>
				</view>
				<view class="flexRowStart" v-else-if="orderInfo.status==7 && oss">
					<image class="titleImg" :src="oss+'icon_order_cancelPay.png'"></image>
					<view class="color_F74437">退款失败</view>
				</view>
			</view>
			<view class="consigneeInfo">
				<view class="color_303031 bold consigneeName">
					<text style="margin-right: 10rpx;">{{$isEmpty(orderInfo.consignee)?'':orderInfo.consignee}}</text>
					<text>{{$isEmpty(orderInfo.contact)?'':orderInfo.contact}}</text>
				</view>
				<view class="consigneeName">
					{{$isEmpty(orderInfo.address)?'':orderInfo.address}}
				</view>
				<view class="flexRowStart color_919397 mail">
					{{getAddress(orderInfo)}}
				</view>
			</view>
			<view class="orderInfo">
				<view class="flexRowStart" style="margin-bottom: 60rpx;">
					<image :src="orderInfo.goodsImg" class="goodsImg" mode="aspectFill"></image>
					<view class="flexColumnStart" style="flex: 1;height: 180rpx;justify-content: space-between;">
						<view class="color_303031 goods">
							{{$isEmpty(orderInfo.goods)?'':orderInfo.goods}}
						</view>
						<!-- 线下支付 或者微信支付 -->
						<view class="flexRow" style="width: 100%;" v-if="orderInfo.paymentMethod== 2 || orderInfo.paymentMethod== 9">
							<text class="color_F74437 bold iconTitle">{{$isEmpty(orderInfo.goodsCash)?'0':orderInfo.goodsCash}}元</text>
							<text class="color_919397 icon">X{{$isEmpty(orderInfo.goodsAmount)?'0':orderInfo.goodsAmount}}</text>
						</view>
						<!-- 能贝支付 -->
						<view class="flexRow" style="width: 100%;" v-else-if="orderInfo.paymentMethod== 1">
							<text class="color_F74437 bold iconTitle">{{$isEmpty(orderInfo.goodsPrice)?'0':orderInfo.goodsPrice}}贝</text>
							<text class="color_919397 icon">X{{$isEmpty(orderInfo.goodsAmount)?'0':orderInfo.goodsAmount}}</text>
						</view>
						<!-- 暂未支付 -->
						<view class="flexRow" style="width: 100%;" v-else>
							<text class="color_F74437 bold iconTitle" v-if="orderInfo.payCurrency==9">{{$isEmpty(orderInfo.goodsPrice)?'0':orderInfo.goodsPrice}}贝/{{$isEmpty(orderInfo.goodsCash)?'0':orderInfo.goodsCash}}元</text>
							<text class="color_F74437 bold iconTitle" v-else-if="orderInfo.payCurrency==1">{{$isEmpty(orderInfo.goodsPrice)?'0':orderInfo.goodsPrice}}贝</text>
							<text class="color_F74437 bold iconTitle" v-else-if="orderInfo.payCurrency==2">{{$isEmpty(orderInfo.goodsCash)?'0':orderInfo.goodsCash}}元</text>
							<text class="color_919397 icon">X{{$isEmpty(orderInfo.goodsAmount)?'0':orderInfo.goodsAmount}}</text>
						</view>
					</view>
				</view>
				<!-- 线下支付 或者微信支付 -->
				<view class="moneyInfo" v-if="orderInfo.paymentMethod== 2 || orderInfo.paymentMethod== 9">
					<view class="flexRow" style="margin-bottom: 20rpx;">
						<text class="color_303031 iconTitle">商品总价</text>
						<text class="color_919397 icon">{{$isEmpty(orderInfo.cashAmount)?'0':orderInfo.cashAmount}}元</text>
					</view>
					<view class="flexRow" style="margin-bottom: 20rpx;">
						<text class="color_303031 iconTitle">合伙人优惠</text>
						<text class="color_F74437 icon">{{$isEmpty(orderInfo.deductibleCash)?'0':orderInfo.deductibleCash}}元</text>
					</view>
					<view class="flexRow" style="margin-bottom: 20rpx;">
						<text class="color_303031 iconTitle">订单总价</text>
						<text class="color_919397 icon">{{$isEmpty(orderInfo.discountCash)?'0':orderInfo.discountCash}}元</text>
					</view>
					<view class="flexRow" v-if="orderInfo.status==1 ||orderInfo.status==3">
						<text class="color_303031 iconTitle">实付款</text>
						<text class="color_F74437 bold iconTitle">{{$isEmpty(orderInfo.discountCash)?'0':orderInfo.discountCash}}元</text>
					</view>
				</view>
				<!-- 能贝支付 -->
				<view class="moneyInfo" v-else-if="orderInfo.paymentMethod == 1">
					<view class="flexRow" style="margin-bottom: 20rpx;">
						<text class="color_303031 iconTitle">商品总价</text>
						<text class="color_919397 icon">{{$isEmpty(orderInfo.priceAmount)?'0':orderInfo.priceAmount}}贝</text>
					</view>
					<view class="flexRow" style="margin-bottom: 20rpx;">
						<text class="color_303031 iconTitle">合伙人优惠</text>
						<text class="color_F74437 icon">{{$isEmpty(orderInfo.deductiblePrice)?'0':orderInfo.deductiblePrice}}贝</text>
					</view>
					<view class="flexRow" style="margin-bottom: 20rpx;">
						<text class="color_303031 iconTitle">订单总价</text>
						<text class="color_919397 icon">{{$isEmpty(orderInfo.discountPrice)?'0':orderInfo.discountPrice}}贝</text>
					</view>
					<view class="flexRow" v-if="orderInfo.status==1 ||orderInfo.status==3">
						<text class="color_303031 iconTitle">实付款</text>
						<text class="color_F74437 bold iconTitle">{{$isEmpty(orderInfo.discountPrice)?'0':orderInfo.discountPrice}}贝</text>
					</view>
				</view>
				<!-- 暂未支付 -->
				<view class="moneyInfo" v-else>
					<view class="flexRow" style="margin-bottom: 20rpx;">
						<text class="color_303031 iconTitle">商品总价</text>
						<text class="color_919397 icon" v-if="orderInfo.payCurrency==9">{{$isEmpty(orderInfo.priceAmount)?'0':orderInfo.priceAmount}}贝/{{(orderInfo.cashAmount)?'0':orderInfo.cashAmount}}元</text>
						<text class="color_919397 icon" v-else-if="orderInfo.payCurrency==1">{{$isEmpty(orderInfo.priceAmount)?'0':orderInfo.priceAmount}}贝</text>
						<text class="color_919397 icon" v-else-if="orderInfo.payCurrency==2">{{$isEmpty(orderInfo.cashAmount)?'0':orderInfo.cashAmount}}元</text>
					</view>
					<view class="flexRow" style="margin-bottom: 20rpx;">
						<text class="color_303031 iconTitle">合伙人优惠</text>
						<text class="color_F74437 icon" v-if="orderInfo.payCurrency==9">{{$isEmpty(orderInfo.deductiblePrice)?'0':orderInfo.deductiblePrice}}贝/{{$isEmpty(orderInfo.deductibleCash)?'0':orderInfo.deductibleCash}}元</text>
						<text class="color_F74437 icon" v-else-if="orderInfo.payCurrency==1">{{$isEmpty(orderInfo.deductiblePrice)?'0':orderInfo.deductiblePrice}}贝</text>
						<text class="color_F74437 icon" v-else-if="orderInfo.payCurrency==2">{{$isEmpty(orderInfo.deductibleCash)?'0':orderInfo.deductibleCash}}元</text>
					</view>
					<view class="flexRow" style="margin-bottom: 20rpx;">
						<text class="color_303031 iconTitle">订单总价</text>
						<text class="color_919397 icon" v-if="orderInfo.payCurrency==9">{{$isEmpty(orderInfo.discountPrice)?'0':orderInfo.discountPrice}}贝/{{$isEmpty(orderInfo.discountCash)?'0':orderInfo.discountCash}}元</text>
						<text class="color_919397 icon" v-else-if="orderInfo.payCurrency==1">{{$isEmpty(orderInfo.discountPrice)?'0':orderInfo.discountPrice}}贝</text>
						<text class="color_919397 icon" v-else-if="orderInfo.payCurrency==2">{{$isEmpty(orderInfo.discountCash)?'0':orderInfo.discountCash}}元</text>
					</view>
					<view class="flexRow" v-if="orderInfo.status==1 ||orderInfo.status==3">
						<text class="color_303031 iconTitle">实付款</text>
						<text class="color_F74437 bold iconTitle" v-if="orderInfo.payCurrency==9">{{$isEmpty(orderInfo.discountPrice)?'0':orderInfo.discountPrice}}贝/{{$isEmpty(orderInfo.discountCash)?'0':orderInfo.discountCash}}元</text>
						<text class="color_F74437 bold iconTitle" v-else-if="orderInfo.payCurrency==1">{{$isEmpty(orderInfo.discountPrice)?'0':orderInfo.discountPrice}}贝</text>
						<text class="color_F74437 bold iconTitle" v-else-if="orderInfo.payCurrency==2">{{$isEmpty(orderInfo.discountCash)?'0':orderInfo.discountCash}}元</text>
					</view>
				</view>
			</view>
			<view class="orderNumberInfo">
				<view class="flexRow">
					<text class="color_303031 iconTitle">订单编号</text>
					<text class="color_919397 icon">{{$isEmpty(orderInfo.orderNumber)?'':orderInfo.orderNumber}}</text>
				</view>
				<view class="flexRow" style="margin-top: 20rpx;">
					<text class="color_303031 iconTitle">创建时间</text>
					<text class="color_919397 icon">{{$isEmpty(orderInfo.createTime)?'':orderInfo.createTime}}</text>
				</view>
				<view class="flexRow" style="margin-top: 20rpx;" v-if="!isEmpty(orderInfo.finishTime)">
					<text class="color_303031 iconTitle">付款时间</text>
					<text class="color_919397 icon">{{$isEmpty(orderInfo.finishTime)?'':orderInfo.finishTime}}</text>
				</view>
			</view>
		</view>
		<view v-if="orderInfo.status==0 && orderInfo.isFree==0" class="wrapBtn">
			<view class="flexRow btn">
				<view class="button cancelBtn" @tap="cancelOrder">
					取消订单
				</view>
				<view class="button payBtn" @tap="goCheckoutCounter(orderInfo.orderNumber)">
					立即付款
				</view>
			</view>
		</view>
		<view v-if="orderInfo.status==1 && orderInfo.orderType == 1" class="wrapBtn">
			<view class="flexRow btn">
				<view class="button" style="flex: 1;" @tap="applyMagic">
					评论
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		isEmpty,
		goCheckoutCounter
	} from '@/common/utils.js'
	export default {
		data() {
			return {
				orderInfo: {},
				oss: '',
				status: false,
				num: ''
			};
		},
		onLoad(options) {
			uni.$on("orderRefresh", data => {
				this.status = data
			})
			const {
				orderNumber
			} = options
			this.oss = this.$oss
			this.num = orderNumber
			this.$http.get('fms/order/' + orderNumber).then(res => {
				this.orderInfo = res.data.data
			})
		},
		onShow() {
			if (this.status == true) {
				this.$http.get('fms/order/' + this.num).then(res => {
					this.orderInfo = res.data.data
				})
			}
		},
		onUnload() {
			uni.$off()
		},
		methods: {
			goCheckoutCounter,
			applyMagic() {
				uni.navigateTo({
					url: `/pages/my/orderList/orderDetails/magicApply/magicApply?id=${this.orderInfo.orderId}&type=${this.orderInfo.orderType}`
				})
			},
			cancelOrder() {
				let that = this
				uni.showModal({
					content: "你确定要取消该订单吗？",
					success: function(res) {
						if (res.confirm) {
							that.$http.get('dms/order/cancel/' + that.orderInfo.orderNumber).then(res => {
								// console.log(res)
								if (res.data.code == 1) {
									uni.showToast({
										title: res.data.message,
										icon: "none"
									})
								} else {
									uni.showToast({
										title: "取消成功",
										icon: "none",
										duration: 1000,
										success: () => {
											setTimeout(() => {
												uni.$emit("orderRefresh", true)
												uni.navigateBack({
													delta: 1
												})
											}, 1000)
										}
									})
								}
							})
						} else if (res.cancel) {}
					}
				})
			},
			isEmpty,
			getAddress (order) {
				let address = ''
				if (!this.$isEmpty(order.zipCode)) {
					address += order.zipCode
				}
				if (!this.$isEmpty(order.mail)) {
					address += address ? ` | ${order.mail}` : order.mail
				}
				// console.log(address)
				return address
			}
		}
	}
</script>

<style lang="scss">
	.cancelBtn {
		color: #f73737;
		flex: 1;
		border: 2rpx solid #f73737;
		background: #FFFFFF;
	}

	.payBtn {
		flex: 1;
		margin-left: 30rpx;
	}

	.deleteBtn {
		color: #F74437;
		width: 204rpx;
		background-color: #FFFFFF;
		margin-right: 30rpx;
		border: 2rpx solid #F74437;
	}

	.wrapBtn {
		width: 100%;
		position: fixed;
		bottom: 0rpx;
		border-radius: 20rpx;
		display: flex;
		background-color: #FFFFFF;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

		.btn {
			width: 686rpx;
			margin: 24rpx 32rpx
		}
	}

	.container {
		padding: 32rpx;
		margin-bottom: 140rpx;

		.title {
			padding: 32rpx;
			background-color: #FFFFFF;
			border-radius: 30rpx;
			font-size: 32rpx;
			line-height: 44rpx;
			margin-bottom: 30rpx;

			.titleImg {
				width: 52rpx;
				height: 52rpx;
				margin-right: 14rpx;
			}
		}

		.consigneeInfo {
			padding: 32rpx;
			margin-bottom: 30rpx;
			border-radius: 30rpx;
			background-color: #FFFFFF;

			.consigneeName {
				font-size: 28rpx;
				line-height: 40rpx;
				margin-bottom: 20rpx
			}

			.mail {
				font-size: 22rpx;
				line-height: 32rpx;

				.mailImg {
					width: 26rpx;
					height: 26rpx;
					margin-right: 14rpx;
				}
			}
		}

		.orderInfo {
			padding: 32rpx;
			border-radius: 30rpx;
			margin-bottom: 30rpx;
			background-color: #FFFFFF;

			.goodsImg {
				width: 180rpx;
				height: 180rpx;
				margin-right: 20rpx;
				border-radius: 20rpx;
			}

			.goods {
				font-size: 28rpx;
				line-height: 48rpx;
				margin-bottom: 40rpx;
			}

			.icon {
				font-size: 24rpx;
				line-height: 34rpx;
			}

			.moneyInfo {
				.iconTitle {
					font-size: 28rpx;
					line-height: 40rpx;
				}
			}
		}

		.orderNumberInfo {
			padding: 32rpx;
			border-radius: 30rpx;
			background-color: #FFFFFF;

			.icon {
				font-size: 24rpx;
				line-height: 34rpx;
			}
		}
	}

	.iconTitle {
		font-size: 28rpx;
		line-height: 40rpx;
	}

	page {
		background-color: #F4F5F6;
	}
</style>
