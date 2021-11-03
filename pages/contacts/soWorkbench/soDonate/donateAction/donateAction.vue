<template>
	<view class="container">
		<view class="flexColumn" style="margin-bottom: 120rpx;">
			<image :src="avatar" mode="" style="width: 136rpx;height: 136rpx;border-radius: 30rpx;"></image>
			<view class="bold" style="font-size: 28rpx;line-height: 40rpx;margin-top: 26rpx;">
				{{$isEmpty(name)?'': name}}
			</view>
		</view>
		<view class="" style="margin-bottom: 60rpx;font-size: 28rpx;line-height: 40rpx;">
			<view class="" style="margin-bottom: 24rpx;" v-if="type=='donate'">
				捐赠宝贝给组织
			</view>
			<view class="" style="margin-bottom: 24rpx;" v-if="type=='transfer'">
				转赠金额
			</view>
			<view class="flexRowStart" style="padding: 24rpx 0rpx;border-bottom: 2rpx solid #EFF0F1;margin-bottom: 20rpx;">
				<input type="digit" :maxlength="maxlength" v-model="num" placeholder="0" style="flex: 1;" @input="checkNum" />
				<text>贝</text>
			</view>
			<view class="flexRowStart" style="padding: 24rpx 0rpx;border-bottom: 2rpx solid #EFF0F1;">
				<textarea type="text" maxlength="30" v-model="txt" placeholder="添加备注(30字以内)" auto-height="true" style="font-size: 28rpx;line-height: 28rpx;"></textarea>
			</view>
		</view>
		<view class="button" v-if="type=='donate'" style="width: 686rpx;" @tap="goDonate">
			捐赠
		</view>
		<view class="button" v-if="type=='transfer'" style="width: 686rpx;" @tap="goDonate">
			转账
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
				avatar: '',
				name: '',
				num: '',
				txt: '',
				password: '',
				id: '',
				userId: '',
				type: '',
				kind: '',
				maxlength: 50,
				role:'',
				senderId:''
			};
		},
		onLoad(options) {
			this.avatar = options.avatar
			this.name = options.name
			this.id = options.id
			this.type = options.type
			this.kind = options.kind
			if(options.senderId){
				this.senderId = options.senderId
			}
			this.role=options.role
			console.log(this.role)
			if (this.type == 'donate') {
				uni.setNavigationBarTitle({
					title: "捐赠"
				})
			} else if (this.type == 'transfer') {
				uni.setNavigationBarTitle({
					title: "转账"
				})
			}
		},
		onShow() {
			this.password = uni.getStorageSync('user').safePassword
		},
		methods: {
			checkNum(e) {
				let price = e.detail.value;
				this.maxlength = price.indexOf('.') + 3;
				if (this.maxlength == 2) {
					this.maxlength = 50;
				}
			},
			cancel() {
				this.$refs.dialog.close()
			},
			pass() {
				uni.navigateTo({
					url: '/pages/my/payPassword/payPassword'
				})
				this.$refs.dialog.close()
			},
			goDonate() {
				if (this.num == 0) {
					uni.showToast({
						title: "请输入有效金额",
						icon: "none"
					})
				} else if (this.$isEmpty(this.password)) {
					this.$refs.dialog.open()
				} else {
					this.$refs.jpPwds.toOpen()
				}
			},
			Encrypt(word, key, iv) {
				var CryptoJS = require('../../../../../common/crypto.js');
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
				this.userId = uni.getStorageSync('userinfo').user_id
				// console.log(this.password)
				var CryptoJS = require('../../../../../common/crypto.js');
				if (this.$isEmpty(this.password)) {

				} else {
					let key = 'gdscloudprisbest';
					key = CryptoJS.enc.Latin1.parse(key);
					const iv = key
					this.password = (this.Encrypt(e, key, iv))
					// console.log(this.password)
					let category = ''
					let receiverPayType = ''
					let senderPayType=''
					if (this.type == 'donate') {
						category = 71
						receiverPayType = 3
						senderPayType=4
						this.senderId=this.userId
					} else if (this.type == 'transfer') {
						category = 1
						if(this.role == 'user'){
							this.senderId=this.userId
							if (this.kind == 'so') {
								receiverPayType = 3
								senderPayType=4
							} else if (this.kind == 'person')
								receiverPayType = 4
								senderPayType=4
						}else if(this.role == 'so'){
							if (this.kind == 'so') {
								receiverPayType = 3
								senderPayType=3
							} else if (this.kind == 'person')
								receiverPayType = 4
								senderPayType=3
						}
					}
					this.$http.post('fms/account/transaction', {
						senderPayType: senderPayType,
						safePassword: this.password,
						senderId: this.senderId,
						receiverId: this.id,
						remarks: this.txt,
						amount: this.num,
						category: category,
						receiverPayType: receiverPayType
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
							if (that.type == 'donate') {
								uni.showToast({
									title: "支付成功",
									icon: "none",
									duration: 1000,
									success() {
										setTimeout(() => {
											uni.navigateBack({
												delta: 1
											})
										}, 1000)
									}
								})
							} else if (that.type == 'transfer') {
								uni.showToast({
									title: "转账成功",
									icon: "none",
									duration: 1000,
									success() {
										setTimeout(() => {
											uni.navigateBack({
												delta: 2
											})
										}, 1000)
									}
								})
							}
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
	.popDialog {
		padding: 32rpx;
		width: 590rpx;
		background-color: #FFFFFF;
		// box-shadow: 0px -2rpx 4rpx 0px rgba(0, 0, 0, 0.03);

		.title {
			font-size: 36rpx;
			line-height: 52rpx;
			margin-top: 32rpx;
			text-align: center;
		}
		.message{
			font-size: 28rpx;
			line-height: 52rpx;
			text-align: center;
			margin: 48rpx 0;
		}

		.noRepeat {
			flex: 1;
			background: #F5F7F8;
			color: #565B5F;
			margin-right: 30rpx;
		}

		.repeatNow {
			flex: 1;
		}
	}

	.container {
		padding: 32rpx;
	}
</style>
