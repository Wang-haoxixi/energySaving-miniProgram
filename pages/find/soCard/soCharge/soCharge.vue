<template>
	<view class="container">
		<view class="flexRowStart" style="margin-bottom: 72rpx;justify-content: center;align-items: flex-end;">
			<view class="color_303031 bold" style="font-size: 76rpx;line-height: 76rpx;">{{$isEmpty(cost)?'0': cost}}</view><view class="color_919397" style="font-size: 28rpx;line-height: 28rpx;">贝</view>
		</view>
		<view class="" style="margin-bottom: 80rpx;padding-bottom: 36rpx;border-bottom: 2rpx solid #EFF0F1;">
			<textarea v-model="txt" placeholder="请输入申请理由(五十字以内)" auto-height="true" maxlength="50" style="width: 100%;"/>
		</view>
		<view class="button" style="width: 642rpx;" @tap="goDonate">
			立即支付
		</view>
		<jpPwd ref="jpPwds" @completed="completed" @forget="forget"></jpPwd>
		<uni-popup ref="dialog" type="center">
			<view class="popDialog">
				<view class="">
					<view class="color_303031 bold title">
						提示
					</view>
					<view class="color_666769 message">
						您未设置支付密码
					</view>
				</view>
				<view class="flexRow">
					<view class="button noRepeat" @tap="cancel">
						取消
					</view>
					<view class="button repeatNow" @tap="pass">
						确定
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import jpPwd from '@/components/jp-pwd/jp-pwd.vue';
	export default {
		components: {
			jpPwd
		},
		data() {
			return {
				cost:'',
				password:'',
				txt:'',
				orgId:''
			};
		},
		onLoad(options) {
			this.cost = options.cost
			this.orgId =options.orgId
			console.log(this.orgId)
		},
		onShow() {
			this.password = uni.getStorageSync('user').safePassword
		},
		methods:{
			cancel(){
				this.$refs.dialog.close()
			},
			pass(){
				uni.navigateTo({
					url:'/pages/my/payPassword/payPassword'
				})
				this.$refs.dialog.close()
			},
			goDonate(){
				if(this.$isEmpty(this.password)){
					this.$refs.dialog.open()
				}
				else{
					this.$refs.jpPwds.toOpen()	
				}
			},
			Encrypt(word, key, iv) {
				var CryptoJS = require('../../../../common/crypto.js');
				console.log(CryptoJS)
				let srcs = CryptoJS.enc.Utf8.parse(word);
				let encrypted = CryptoJS.AES.encrypt(srcs, key, {
					iv: iv,
					mode: CryptoJS.mode.CBC,
					padding: CryptoJS.pad.Pkcs7
				});
				return encrypted.toString()
			},
			completed(e) {
				// this.$refs.jpPwds.toCancel()
				//分享收费拿不到，所以二次获取
				this.password = uni.getStorageSync('user').safePassword
				this.userId =uni.getStorageSync('userinfo').user_id
				// console.log(this.password)
				var CryptoJS = require('../../../../common/crypto.js');
				if (this.$isEmpty(this.password)) {
					
				} else {
					let key = 'gdscloudprisbest';
					key = CryptoJS.enc.Latin1.parse(key);
					const iv = key
					this.password = (this.Encrypt(e, key, iv))
					console.log(this.password)
					this.$http.post('admin/org/apply', {
						orgId:this.orgId,
						message:this.txt,
						safePassword:this.password,
						cost:this.cost,
						inviter:0
					}).then(res => {
						// console.log(res)
						if (res.data.code == 1) {
							this.$refs.jpPwds.backs()
							this.$refs.jpPwds.toCancel()
							uni.showToast({
								title: res.data.message,
								icon: "none"
							})
						} else {
							let that = this
							uni.showToast({
								title: "申请成功,等待管理员审核",
								icon: "none",
								duration: 1000,
								success() {
									setTimeout(() => {
										uni.navigateBack({
											delta:1
										})
									}, 1000)
								}
							})
							this.$refs.jpPwds.backs()
							this.$refs.jpPwds.toCancel()
						}
					})
				}
			},
			forget() {
				// console.log('忘记密码')
				uni.navigateTo({
					url: "/pages/my/payPassword/payPassword"
				})
			},
		}
	}
</script>

<style lang="scss">
.container{
	padding: 80rpx 32rpx;
}
	.popDialog {
		padding: 32rpx 32rpx 48rpx;
		width: 590rpx;
		background-color: #FFFFFF;
		// box-shadow: 0px -2rpx 4rpx 0px rgba(0, 0, 0, 0.03);
		.title {
			font-size: 36rpx;
			line-height: 52rpx;
			text-align: center;
			margin-top: 32rpx;
		}
		.message {
			font-size: 28rpx;
			line-height: 52rpx;
			text-align: center;
			margin: 48rpx 0;
		}
	
		.noRepeat {
			flex: 1;
			background: #F5f7f8;
			color: #565B5F;
			margin-right: 30rpx;
		}
	
		.repeatNow {
			flex: 1;
		}
	}
</style>
