<template>
	<view>
		<view class="countdown">
			<text v-if="data.remainingTime>3600">{{parseInt(data.remainingTime/3600)}}小时</text>
			<text v-if="data.remainingTime>60">{{parseInt(data.remainingTime%3600/60)}}分钟</text>
			<text v-if="data.remainingTime>0">{{data.remainingTime%60}}秒后将取消此订单</text>
			<text v-else>订单已取消</text>
		</view>
		<view class="amount-view" v-show="cashPay==true">
			<view class="amount-num">
				{{$isEmpty(data.discountCash)?'0':data.discountCash}}
			</view>
			<view class="amount-unit">
				元
			</view>
		</view>
		<view class="amount-view" v-show="icanPay==true">
			<view class="amount-num">
				{{$isEmpty(data.discountPrice)?'0':data.discountPrice}}
			</view>
			<view class="amount-unit">
				贝
			</view>
		</view>
		<view class="sub-item">
			<view class="sub-item-title">
				商品名
			</view>
			<view class="sub-item-content">
				{{$isEmpty(data.goods)?'':data.goods}}
			</view>
		</view>
		<view class="sub-item">
			<view class="sub-item-title">
				数量
			</view>
			<view class="sub-item-content">
				x {{$isEmpty(data.amount)?'':data.amount}}
			</view>
		</view>
		<view class="paymentMethod">
			<view class="title">
				支付方式
			</view>
			<view class="">
				<radio-group name="" @change="checkPay">
					<label class="flexRow paymentMethod-item" v-if="data.payCurrency==9 ||data.payCurrency==1">
						<view class="flexRowStart">
							<image :src="$ossUrl('pic_taskList_reward.png')" class="paymentMethod-icon"></image>
							<view class="paymentMethod-name">
								宝贝支付
							</view>
						</view>
						<radio value="ican" style="transform: scale(0.7)" :checked="icanPay" />
					</label>
					<label class="flexRow paymentMethod-item" v-if="data.payCurrency==9 || data.payCurrency==2">
						<view class="flexRowStart">
							<image :src="$ossUrl('icon_checkCounter_weixin.png')" class="paymentMethod-icon"></image>
							<view class="paymentMethod-name" style="margin-right: 24rpx;">
								微信支付
							</view>
							<view class="" style="display: flex;align-items: center;" v-if="!$isEmpty(data.rechargeAmount) && data.rechargeAmount>0">
								<view class="" style="margin-right: 8rpx;color: #F74437;font-size: 26rpx;line-height: 38rpx;">
									奖励
								</view>
								<image :src="$ossUrl('pic_taskList_reward.png')" class="paymentMethod-icon"></image>
							</view>
						</view>
						<radio value="cash" style="transform: scale(0.7)" :checked="cashPay" />
					</label>
				</radio-group>
				<!-- <image :src="$ossUrl('icon_checkCounter_checked.png')" class="paymentMethod-check"></image> -->
			</view>
		</view>
		<bottom-button>
			<view class="total">
				合计：
				<text v-show="cashPay==true" class="color_F74437 bold">{{$isEmpty(data.discountCash)?'0':data.discountCash}}元</text>
				<text v-show="icanPay==true" class="color_F74437 bold">{{$isEmpty(data.discountPrice)?'0':data.discountPrice}}贝</text>
				<text v-show="cashPay==true && !$isEmpty(data.rechargeAmount) && data.rechargeAmount>0" style="color: #2B579F;"> （赠送{{data.rechargeAmount}}贝） </text>
			</view>
			<view style="flex: 1;">

			</view>
			<button v-if="data.remainingTime>0" class="button" @tap="wxPay" style="width: 204rpx;">
				立即支付
			</button>
			<button v-else class="button cancelBtn" :disabled="data.remainingTime<1" style="width: 204rpx;">
				立即支付
			</button>
		</bottom-button>
		<jpPwd ref="jpPwds" @completed="completed" @forget="forget"></jpPwd>
		<uni-popup ref="dialog" type="center">
			<view class="popDialog">
				<view class="" style="justify-content: center;">
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
	import bottomButton from '@/components/bottomButton/bottomButton.vue'
	export default {
		components: {
			bottomButton,
			jpPwd
		},
		data() {
			return {
				data: '',
				timer: '',
				provider: '',
				timeStamp: '',
				nonceStr: '',
				package: '',
				sign: '',
				paySign: '',
				icanPay: true,
				cashPay: false,
				password: ''
			};
		},
		onLoad(option) {
			this.$http.get('fms/order/show/' + option.id).then(res => {
				this.data = res.data.data;
				if(this.data.payCurrency == 9){
					this.icanPay =true
					this.cashPay=false
				}else if(this.data.payCurrency==1){
					this.icanPay =true
					this.cashPay=false
				}else if(this.data.payCurrency==2){
					this.icanPay =false
					this.cashPay=true
				}
				this.timer = setInterval(() => {
					this.data.remainingTime--;
				}, 1000)
			});
		},
		onShow() {
			this.password = uni.getStorageSync('user').safePassword
		},
		methods: {
			cancel() {
				this.$refs.dialog.close()
			},
			pass() {
				uni.navigateTo({
					url: '/pages/my/payPassword/payPassword'
				})
				this.$refs.dialog.close()
			},
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
			completed(e) {
				// this.$refs.jpPwds.toCancel()
				//分享收费拿不到，所以二次获取
				this.password = uni.getStorageSync('user').safePassword
				this.userId = uni.getStorageSync('userinfo').user_id
				// console.log(this.password)
				var CryptoJS = require('../../../common/crypto.js');
				if (this.$isEmpty(this.password)) {

				} else {
					let key = 'gdscloudprisbest';
					key = CryptoJS.enc.Latin1.parse(key);
					const iv = key
					this.password = (this.Encrypt(e, key, iv))
					// console.log(this.password)
					this.$http.post('fms/order/pay', {
						safePassword: this.password,
						paymentMethod: 1,
						orderNumber: this.data.orderNumber,
						source: 'mini'
					}).then(res => {
						// console.log(res)
						if (res.data.data.status == 0) {
							this.$refs.jpPwds.backs()
							this.$refs.jpPwds.toCancel()
							uni.showToast({
								title: res.data.data.message,
								icon: "none"
							})
						} else {
							let that = this
							let type = that.data.orderType
							let orderNumber = that.data.orderNumber
							uni.showToast({
								title: "支付成功",
								icon: "none",
								duration: 1000,
								success() {
									setTimeout(() => {
										if (type == 2) {
											// 活动
											uni.redirectTo({
												url: `/pages/contacts/soWorkbench/soInfo/soActivity/soActivityDetails/chooseTicket/applyForm/confirmOrder/applyResult/applyResult?id=${orderNumber}`
											})
										} else {
											// 魔方
											uni.redirectTo({
												url: `/pages/find/checkoutCounter/success/success?orderNumber=${orderNumber}`
											})
										}
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
			checkPay(e) {
				// console.log(e)
				if (e.detail.value == 'cash') {
					this.icanPay = false
					this.cashPay = true
				} else if (e.detail.value == 'ican') {
					this.icanPay = true
					this.cashPay = false
				}
			},
			wxPay() {
				if (this.cashPay == true) {
					this.$http.get('fms/order/wx_pay', {
						params: {
							orderNumber: this.data.orderNumber
						}
					}).then(res => {
						// console.log(res)
						this.package = res.data.data.package
						// console.log(this.package)
						this.timeStamp = res.data.data.timeStamp
						// console.log(this.timeStamp)
						this.nonceStr = res.data.data.nonceStr
						// console.log(this.nonceStr)
						this.sign = res.data.data.sign
						// console.log(this.sign)
						// console.log(this.data)
						//里面拿不到，故在外面赋值后带进去
						let type = this.data.orderType
						let orderNumber = this.data.orderNumber
						uni.requestPayment({
							provider: 'wxpay',
							timeStamp: this.timeStamp,
							nonceStr: this.nonceStr,
							package: this.package,
							signType: 'MD5',
							paySign: this.sign,
							success: function(res) {
								// console.log('success:' + JSON.stringify(res));
								// 支付成功
								if (type == 2) {
									// 活动
									uni.redirectTo({
										url: `/pages/contacts/soWorkbench/soInfo/soActivity/soActivityDetails/chooseTicket/applyForm/confirmOrder/applyResult/applyResult?id=${orderNumber}`
									})
								} else {
									// 魔方
									uni.redirectTo({
										url: `/pages/find/checkoutCounter/success/success?orderNumber=${orderNumber}`
									})
								}
							},
							fail: function(err) {
								console.log(err)
								// console.log('fail:' + JSON.stringify(err));
								// 支付失败	
								// console.log(type)
								// if (type== 2) {
								// 	uni.redirectTo({
								// 		url:`/pages/find/checkoutCounter/activitySuccess/activitySuccess?orderNumber=${orderNumber}`
								// 	})
								// }
							}
						});
					})
				} else if (this.icanPay == true) {
					if (this.$isEmpty(this.password)) {
						this.$refs.dialog.open()
					} else {
						this.$refs.jpPwds.toOpen()
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	.cancelBtn{
		background: #FFD6D6 !important;
		color: #FFFFFF !important;
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

	.button {
		// padding: 16rpx 46rpx;
	}

	.countdown {
		background-color: #f744371a;
		color: #F74437;
		font-size: 28rpx;
		font-weight: bold;
		line-height: 88rpx;
		text-align: center;
	}

	.total {
		line-height: 34rpx;
		font-size: 28rpx;
	}

	.amount-view {
		margin-top: 60rpx;
		display: flex;
		align-items: flex-end;
		justify-content: center;

		.amount-num {
			color: #303031;
			font-size: 76rpx;
			line-height: 90rpx;
			font-weight: bold;
		}

		.amount-unit {
			color: #919397;
			font-size: 28rpx;
		}
	}

	.sub-item {
		margin: 32rpx 32rpx 0;
		padding-bottom: 24rpx;
		border-bottom: 0.3rpx solid #EFF0F1;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 28rpx;

		.sub-item-title {
			color: #303031;
			font-weight: bold;
		}

		.sub-item-content {
			color: #919397;
		}
	}

	.paymentMethod {
		margin-top: 32rpx;
		padding: 32rpx;

		.title {
			font-weight: bold;
			color: #303031;
			font-size: 32rpx;
			line-height: 44rpx;
		}

		.paymentMethod-item {
			margin-top: 32rpx;
			height: 40rpx;;
			padding: 32rpx;
			background-color: #F5f7f8;
			border-radius: 10rpx;
			font-size: 28rpx;
			line-height: 40rpx;
			display: flex;
			color: #666769;
			align-items: center;

			.paymentMethod-name {
				flex: 1;
				margin-left: 18rpx;
			}

			.paymentMethod-icon {
				width: 36rpx;
				height: 36rpx;
			}

			.paymentMethod-check {
				width: 32rpx;
				height: 32rpx;
			}
		}
	}
</style>
