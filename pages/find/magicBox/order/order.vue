<template>
	<view>
		<!-- <view class="warning">软件类和报告类产品不支持退款</view> -->
		<view class="body">
			<view class="title" @tap="goEdit">
				<view class="title-top" v-if="!$isEmpty(userReceiveAddress)">
					<view class="name">{{$isEmpty(userReceiveAddress.consignee)?'':userReceiveAddress.consignee}} </view>
					<view class="phone-view">
						<text class="phone">{{$isEmpty(userReceiveAddress.phone)?'':userReceiveAddress.phone}}
						</text>
						<image class="right" :src="$ossUrl('icon_right_gray.png')"></image>
					</view>
				</view>
				<view class="address doubleEllipsis" v-if="!$isEmpty(userReceiveAddress)">
					{{$isEmpty(userReceiveAddress.cityArea)?'':userReceiveAddress.cityArea}}
					{{$isEmpty(userReceiveAddress.address)?'':userReceiveAddress.address}}
				</view>
				<!-- <view class="other" v-if="!$isEmpty(userReceiveAddress)">
					{{$isEmpty(userReceiveAddress.zipCode )?'':userReceiveAddress.zipCode}} |
					{{$isEmpty(userReceiveAddress.mail)?'':userReceiveAddress.mail}}
				</view> -->
				<view class="empty" v-else>
					<view>
						请添加收货地址
					</view>
					<image class="right" :src="$ossUrl('icon_right_gray.png')"></image>
				</view>
			</view>
			<view class="content">
				<view class="top">
					<image class="avatar" :src="data.productImg" mode="aspectFit"></image>
					<view>
						<view class="name">{{$isEmpty(data.goods)?'':data.goods}}</view>
						<view class="detail">
							<view class="money">
								<!-- <text v-if="data.goodsPrice>0&&data.goodsCash>0">{{data.goodsPrice}}贝/{{data.goodsCash}}元</text> -->
								<text v-if="data.isFree==0">{{getMoney(data)}}</text>
								<!-- <text v-else-if="data.goodsCash>0">{{data.goodsCash}}元</text> -->
								<text class="free" v-else>免费</text>
							</view>
							<view class="count">x1</view>
						</view>
					</view>
				</view>
				<view class="discount">
					<view class="left">合伙人优惠</view>
					<view class="right">
						<!-- <text v-if="data.deductible>0&&data.reducedCash>0">{{data.deductible}}贝/{{data.reducedCash}}元</text> -->
						<text v-if="data.payCurrency==1">{{$isEmpty(data.deductible)?'0':data.deductible}}贝</text>
						<text v-else-if="data.payCurrency==2">{{$isEmpty(data.reducedCash)?'0':data.reducedCash}}元</text>
						<text v-else-if="data.payCurrency==9">{{$isEmpty(data.deductible)?'0':data.deductible}}贝/{{$isEmpty(data.reducedCash)?'0':data.reducedCash}}元</text>
						<!-- <text v-else-if="data.reducedCash>0">{{data.reducedCash}}元</text> -->
						<text v-else>0</text>
					</view>
				</view>
				<view class="subtotal">
					<view class="left">小计</view>
					<view class="right">
						<!-- <text v-if="data.discountPrice>0&&data.discountCash>0">{{data.discountPrice}}贝/{{data.discountCash}}元</text> -->
						<text v-if="data.payCurrency==1">{{$isEmpty(data.discountPrice)?'0':data.discountPrice}}贝</text>
						<text v-else-if="data.payCurrency==2">{{$isEmpty(data.discountCash)?'0':data.discountCash}}元</text>
						<text v-else-if="data.payCurrency==9">{{$isEmpty(data.discountPrice)?'0':data.discountPrice}}贝/{{$isEmpty(data.discountCash)?'0':data.discountCash}}元</text>
						<!-- <text v-if="data.isFree==0">{{ data.discountPrice}}元</text> -->
						<!-- <text v-else-if="data.discountCash>0">{{data.discountCash}}元</text> -->
						<text class="free" v-else>免费</text>
					</view>
				</view>
			</view>
			<!-- <view class="explanation">报告类产品将通过邮件的形式发送至您的邮箱，请正确填写邮箱地址</view> -->
		</view>
		<view class="bottom">
			<view class="bottom-item">
				<view>
					<text class="count">共1件，合计：</text>
					<!-- <text class="money" v-if="data.discountPrice>0&&data.discountCash>0">{{data.discountPrice}}贝/{{data.discountCash}}元</text> -->
					<!-- <text class="money" v-if="data.discountPrice>0">{{data.discountPrice}}元</text> -->
					<text class="money" v-if="data.payCurrency==1">{{$isEmpty(data.discountPrice)?'0':data.discountPrice}}贝</text>
					<text class="money" v-else-if="data.payCurrency==2">{{$isEmpty(data.discountCash)?'0':data.discountCash}}元</text>
					<text class="money" v-else-if="data.payCurrency==9">{{$isEmpty(data.discountPrice)?'0':data.discountPrice}}贝/{{$isEmpty(data.discountCash)?'0':data.discountCash}}元</text>
					<!-- <text class="money" v-else-if="data.discountCash>0">{{data.discountCash}}元</text> -->
					<text class="free" v-else>免费</text>
				</view>
				<view @tap="submit" class="button">提交订单</view>
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
				data: "",
				userReceiveAddress: {}
			};
		},
		methods: {
			getMoney(ticket) {
				if (ticket.price != 0 && ticket.cash==0) {
					return `${ticket.price}贝`;
				} else if (ticket.cash!=0&& ticket.price == 0) {
					return `${ticket.cash}元`;
				} else if (ticket.cash != 0 && ticket.price != 0) {
					return `${ticket.price}贝/${ticket.cash}元`;
				}else{
					return `0`;
				}
			},
			goEdit() {
				uni.navigateTo({
					url: '/pages/my/information/detail/shippingAddress/shippingAddress?type=order'
				})
			},
			submit() {
				if (isEmpty(this.userReceiveAddress)) {
					uni.showToast({
						icon: 'none',
						title: '请添加收货信息'
					});
				} else {
					this.$http.post('dms/product/shop/create_order', {
						id: this.data.goodsId,
						amount: 1,
						source: 2,
						contactId: this.userReceiveAddress.id,
					}).then(res => {
						if (res.data.code == 0) {
							if (res.data.data.isFree == 1) {
								uni.redirectTo({
									url: '../../checkoutCounter/success/success?orderNumber=' + res
										.data.data.orderNumber
								})
							} else {
								goCheckoutCounter(res.data.data.orderNumber);
							}
						}
					})
				}
			}
		},
		onLoad(option) {
			this.$http.get('dms/product/pre_build', {
				params: {
					goodsId: option.id,
					// type: option.type,
					amount: 1
				}
			}).then(res => {
				this.data = res.data.data;
				this.userReceiveAddress = res.data.data.userReceiveAddress;
			});
		},
		onShow() {
			let address = {};
			try {
				address = uni.getStorageSync('userReceiveAddress');
			} catch (e) {}
			if (!this.$isEmpty(address)) {
				this.userReceiveAddress = address;
				uni.removeStorageSync('userReceiveAddress');
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F4F5F6;
	}

	.free {
		font-weight: bold;
		color: #F74437;
	}

	.bottom {
		background-color: #FFFFFF;
		position: fixed;
		width: 750rpx;
		bottom: 0;
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

		/* #endif */
		.bottom-item {
			padding: 20rpx 40rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.button {
			width: 204rpx;
		}

		.count {
			color: #919397;
			font-size: 24rpx;
			line-height: 34rpx;
		}

		.money {
			color: #F74437;
			font-size: 28rpx;
			line-height: 34rpx;
			font-weight: bold;
		}

	}

	.warning {
		text-align: center;
		height: 60rpx;
		line-height: 60rpx;
		color: #F74437;
		background-color: #f743361a;
		font-size: 24rpx;
	}

	.body {
		padding: 40rpx;

		.title {
			background-color: #FFFFFF;
			border-radius: 30rpx;
			padding: 30rpx 14rpx 30rpx 30rpx;

			.title-top {
				display: flex;
				justify-content: space-between;
			}

			.address {
				margin-top: 20rpx;
				color: #303031;
				font-size: 28rpx;
				line-height: 48rpx;
			}

			.other {
				margin-top: 20rpx;
				font-size: 24rpx;
				line-height: 34rpx;
				color: #919397;
			}

			.empty {
				display: flex;
				justify-content: space-between;
				color: #303031;
				font-weight: bold;
				padding: 26rpx 0;
			}

			.name {
				color: #303031;
				font-size: 36rpx;
				font-weight: bold;
				line-height: 50rpx;
			}

			.phone-view {
				display: flex;
				align-items: center;

				.phone {
					color: #919397;
					font-size: 24rpx;
					line-height: 34rpx;
				}
			}

			.right {
				height: 44rpx;
				width: 44rpx;
			}

		}

		.content {
			margin-top: 30rpx;
			background-color: #FFFFFF;
			border-radius: 30rpx;
			height: 420rpx;
			padding: 30rpx;

			.top {
				display: flex;

				.avatar {
					width: 180rpx;
					height: 180rpx;
				}

				.name {
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					width: 410rpx;
					height: 96rpx;
					font-size: 28rpx;
					margin-left: 20rpx;
					color: #303031;
					line-height: 48rpx;
				}

				.detail {
					margin-left: 20rpx;
					margin-top: 40rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.money {
						color: #F74437;
						font-weight: bold;
						font-size: 32rpx;
						line-height: 44rpx;
					}

					.count {
						color: #919397;
						font-size: 24rpx;
						line-height: 34rpx;
					}
				}
			}

			.discount {
				margin-top: 60rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.left {
					font-weight: bold;
					color: #303031;
					line-height: 40rpx;
					font-size: 28rpx;
				}

				.right {
					color: #919397;
					font-size: 24rpx;
					line-height: 34rpx;
				}
			}

			.subtotal {
				margin-top: 40rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.left {
					font-weight: bold;
					color: #303031;
					line-height: 40rpx;
					font-size: 28rpx;
				}

				.right {
					font-weight: bold;
					color: #F74437;
					font-size: 28rpx;
					line-height: 40rpx;
				}
			}
		}

		.explanation {
			margin-top: 40rpx;
			font-size: 24rpx;
			line-height: 44rpx;
			color: #919397;
		}
	}
</style>
