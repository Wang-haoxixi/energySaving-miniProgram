<template>
	<view class="container">
		<!-- <image v-if="oss" class="loginImg" :src="oss+'login_logo.png'"></image> -->
		<!-- <image :src="$ossUrl('pic_userInfo_logo.png')" mode="" style="width: 367rpx;height: 520rpx;margin-top: 300rpx;"></image> -->
		<image :src="$ossUrl('pic_login_logo.png')" mode="" style="width: 367rpx;margin-top: 300rpx;"></image>
		<!-- <view class="slogan">我能成就知识网红</view> -->
		<view class="title"><text>该程序需获得以下授权
				获取您的公开信息（昵称、头像等）</text></view>
		<view class="button-list">
			<view class="button back" @tap="back">
				拒绝
			</view>
			<button class="button" style="margin: 0; background: #46B28B" @tap="decryptUserInfo">
				允许
			</button>
		</view>

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
		getUserInfo,
		login
	} from '@/common/login.js';
	export default {
		data() {
			return {
				oss: ''
			};
		},
		onLoad() {
			this.oss = this.$oss;
			uni.setStorageSync('isGetUserInfo', true);
			uni.removeStorageSync('token')
		},
		onUnload() {
			uni.setStorageSync('isGetUserInfo', false);
		},
		methods: {
			wxGetUserProfile: function() {
				return new Promise((resolve, reject) => {
					wx.getUserProfile({
						lang: 'zh_CN',
						desc: '用于完善用户资料',
						success: (res) => {
							resolve(res)
						},
						// 失败回调
						fail: (err) => {
							uni.showModal({
								title: '提示',
								content: '需要通过授权才能继续,请重新点击并授权！',
								showCancel: false,
							})
							reject(err)
						}
					})
				})
			},
			wxSilentLogin: function() {
				return new Promise((resolve, reject) => {
					wx.login({
						success(res) {
							uni.setStorageSync('code', res.code);
							resolve(res.code)
						},
						fail(err) {
							reject(err)
						}
					})
				})
			},
			decryptUserInfo(e) {
				let that = this;
				let p1 = this.wxSilentLogin()
				let p2 = this.wxGetUserProfile()
				Promise.all([p1, p2]).then((res) => {
					let code = res[0]
					let iv = res[1].iv
					let encryptedData = res[1].encryptedData
					that.$http.post(
							'/admin/social/get_mini_user_exist', {}, {
								params: {
									encryptedData: encryptedData,
									iv: iv,
									wxMiniType: 'MINI',
									code: code
								},
								header: {
									isToken: 'false',
									TENANT_ID: 1,
									Authorization: 'Basic Z2RzOmdkcw=='
								}
							}
						)
						.then(res => {
							if (res.data.data == true) {
								login();
							} else {
								uni.redirectTo({
									url: '/pages/getPhoneNumber/getPhoneNumber'
								});
							}
						}).catch(err => {
							console.log(err)
						})
				});
			},
			back() {
				uni.navigateBack();
			},
			agreement() {
				uni.navigateTo({
					url: '../webView/webView?type=agreementEnergySaving'
				})
			},
			privacy() {
				uni.navigateTo({
					url: '../webView/webView?type=privacyEnergySaving'
				})
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

		.slogan {
			color: #303031;
			font-size: 28rpx;
			line-height: 40rpx;
			margin-top: 60rpx;
		}

		.title {
			width: 100%;
			margin-top: 48rpx;
			align-self: flex-start;
			color: #666769;
			font-size: 28rpx;
			line-height: 48rpx;
			padding-top: 40rpx;
			border-top: 0.3rpx solid #EFF0F1;
		}

		.remind {
			align-self: flex-start;
			margin-top: 36rpx;
			font-size: 24rpx;
			line-height: 34rpx;
		}
	}

	.wechatImg {
		height: 44rpx;
		width: 44rpx;
	}

	.back {
		background: #FFFFFF;
		border: 2rpx solid #46B28B;
		color: #46B28B;
		width: 316rpx !important;
		height: 88rpx;
	}

	.button-list {
		margin-top: 60rpx;
		display: flex;
		justify-content: space-between;
		width: 100%;
	}

	.button {
		width: 320rpx;
	}
</style>
