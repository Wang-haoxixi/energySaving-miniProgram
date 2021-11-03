<template>
	<view class="container">
		<view class="color_303031 bold title" v-if="firstEntry==true">
			请获取短信验证码，并设置支付密码
		</view>
		<input v-if="!this.$isEmpty(this.phoneNum)" class="color_666769" type="number" :value="phoneNum" disabled="true"
		 style="border-bottom: 2rpx solid #EFF0F1;margin-bottom: 64rpx;padding-bottom: 24rpx;" />
		<input v-else class="color_666769" type="number" v-model="phoneNum" style="border-bottom: 2rpx solid #EFF0F1;margin-bottom: 64rpx;padding-bottom: 24rpx;" />
		<view class="flexRow color_666769" style="padding-bottom: 24rpx;border-bottom: 2rpx solid #EFF0F1;margin-bottom: 64rpx;font-size: 30rpx;line-height: 42rpx;">
			<input type="number" v-model="code" placeholder="请输入验证码" placeholder-class="txt" />
			<view class="" style="color: #F73737;" @tap="getCode" v-show="status">
				获取验证码
			</view>
			<view class="" v-show="!status">
				<text class="color_F74437">{{$isEmpty(num)?'':num}}</text>
				<text>秒后重试</text>
			</view>
		</view>
		<input class="color_666769" type="password" v-model="psw" placeholder="新密码" placeholder-class="txt" style="border-bottom: 2rpx solid #EFF0F1;margin-bottom: 60rpx;padding-bottom: 24rpx;" />
		<view class="flexRow" style="justify-content: center;">
			<view class="button"  v-if="firstEntry==true" style="width:622rpx;" @tap="changePsw">
				确定
			</view>
			<view class="button" v-else style="width:622rpx;" @tap="changePsw">
				更改
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phoneNum: '',
				num: 60,
				status: true,
				code: '',
				psw: '',
				submitPsw: '',
				firstEntry: false
			};
		},
		onLoad() {
			this.phoneNum = uni.getStorageSync('userinfo').mobile
			if (this.$isEmpty(uni.getStorageSync('user').safePassword)) {
				this.firstEntry=true
				uni.setNavigationBarTitle({
					title: "设置支付密码"
				})
			} else {
				uni.setNavigationBarTitle({
					title: "修改支付密码"
				})
			}
		},
		methods: {
			getCode() {
				this.$http.get('admin/mobile/' + this.phoneNum).then(res => {
					console.log(res)
					if (res.data.code == 0) {
						this.status = false
						let timer = setInterval(() => {
							if (this.num == 0) {
								clearInterval(timer)
								this.status = true
								this.num = 60
							} else {
								this.num--;
							}
						}, 1000)
					} else {
						uni.showToast({
							title: res.data.message,
							icon: "none"
						})
					}
				})
			},
			changePsw() {
				var CryptoJS = require('../../../common/crypto.js');
				let key = 'gdscloudprisbest';
				key = CryptoJS.enc.Latin1.parse(key);
				const iv = key
				this.submitPsw = (this.Encrypt(this.psw, key, iv))
				this.$http.post('admin/user/edit/safe/password', {
					mobile: this.phoneNum,
					code: this.code,
					newPassword: this.submitPsw
				}).then(res => {
					console.log(res)
					let that =this
					if (res.data.code == 0) {
						uni.showToast({
							title: "密码设置成功",
							icon: "none",
							icon: 1000,
							success() {
								setTimeout(() => {
									let user = uni.getStorageSync('user')
									user.safePassword = that.submitPsw
									uni.setStorageSync('user',user)
									uni.navigateBack({
										delta: 1
									})
								}, 1000)
							}
						})
					} else {
						uni.showToast({
							title: res.data.message,
							icon: "none"
						})
					}
				})
			},
			//加密方法
			Encrypt(word, key, iv) {
				var CryptoJS = require('../../../common/crypto.js');
				console.log(CryptoJS)
				let srcs = CryptoJS.enc.Utf8.parse(word);
				let encrypted = CryptoJS.AES.encrypt(srcs, key, {
					iv: iv,
					mode: CryptoJS.mode.CBC,
					padding: CryptoJS.pad.Pkcs7
				});
				return encrypted.toString()
			},
		}
	}
</script>

<style lang="scss">
	.title {
		font-size: 32rpx;
		line-height: 44rpx;
		margin-bottom: 64rpx;
	}

	.container {
		padding: 80rpx 40rpx;

		input {
			font-size: 28rpx;
			line-height: 40rpx;
		}
	}

	.txt {
		color: #BABEC0;
		font-size: 28rpx;
		line-height: 40rpx
	}
</style>
