<template>
	<view class="container">
		<!-- <image :src="$ossUrl('pic_userInfo_logo.png')" mode="" style="width: 367rpx;height: 520rpx;margin-top: 300rpx;"></image> -->
		<image :src="$ossUrl('pic_login_logo.png')" mode="" style="width: 367rpx;margin-top: 300rpx;"></image>
		<button class="button" style="background: #46B28B;height: 92rpx;border-radius: 64rpx;" open-type="getPhoneNumber" @getphonenumber="decryptPhoneNumber">
			手机号注册/登录
		</button>
		<view class="color_919397 remind">
			登录代表您已同意节能保
			<text class="color_2F80FF" @tap="agreement">《用户协议》</text>
			和
			<text class="color_2F80FF" @tap="privacy">《隐私政策》</text>
		</view>
	</view>
</template>

<script>
	import {
		getPhoneNumber
	} from '@/common/login.js';
	export default {
		data() {
			return {
				oss: ''
			};
		},
		onLoad() {
			this.oss = this.$oss
		},
		methods: {
			agreement() {
				uni.navigateTo({
					url: '../webView/webView?type=agreementEnergySaving'
				})
			},
			privacy() {
				uni.navigateTo({
					url: '../webView/webView?type=privacyEnergySaving'
				})
			},
			decryptPhoneNumber(e) {
				getPhoneNumber(e);
			}
		}
	};
</script>

<style lang="scss" scoped>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100vh;
		padding: 0 40rpx;

		.loginImg {
			margin-top: 300rpx;
			height: 96rpx;
			width: 270rpx;
		}

		.title {
			font-size: 24rpx;
			line-height: 34rpx;
			margin-top: 256rpx;
		}

		.remind {
			align-self: flex-start;
			margin-top: 40rpx;
			font-size: 24rpx;
			line-height: 34rpx;
		}
	}

	.wechatImg {
		height: 44rpx;
		width: 44rpx;
	}

	::v-deep button {
		width: 100%;
		margin-top: 48rpx;
	}
</style>
