<template>
	<view>
		<view class="top">
			<image :src="$ossUrl('ican_questionnaireResult_success.png')" class="icon"></image>
			<view class="result">
				支付成功
			</view>
			<view class="price">
				您已成功支付{{$isEmpty(data.price)?'':data.price}}<text v-if="data.paymentMethod==1">贝</text><text v-if="data.paymentMethod==2">元</text>
			</view>
		</view>
		<view class="item">
			<view class="item-title">
				订单编号
			</view>
			<view class="item-content">
				{{$isEmpty(data.orderNumber)?'':data.orderNumber}}
			</view>
		</view>
		<view class="item">
			<view class="item-title">
				支付时间
			</view>
			<view class="item-content">
				{{$isEmpty(data.finishTime)?'':data.finishTime}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data: ""
			};
		},
		onLoad(option) {
			this.$http.get('fms/order/complete/' + option.orderNumber).then(res => {
				this.data = res.data.data;
			})
		}
	}
</script>

<style lang="scss">
	.top {
		margin-top: 100rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.icon {
		width: 150rpx;
		height: 150rpx;
	}

	.result {
		margin-top: 40rpx;
		color: #666769;
		font-size: 28rpx;
		line-height: 48rpx;
	}

	.price {
		color: #666769;
		font-size: 28rpx;
		line-height: 48rpx;
	}

	.item {
		font-size: 28rpx;
		line-height: 40rpx;
		display: flex;
		align-items: center;
		padding: 44rpx 0 24rpx;
		margin: 0 40rpx;
		border-bottom: 0.3rpx solid #EFF0F1;

		.item-title {
			color: #303031;
			font-weight: bold;
		}

		.item-content {
			color: #919397;
			flex: 1;
			margin-left: 80rpx;
			text-align: right;
		}

		.item-end {
			height: 44rpx;
			width: 44rpx;
		}
	}
</style>
