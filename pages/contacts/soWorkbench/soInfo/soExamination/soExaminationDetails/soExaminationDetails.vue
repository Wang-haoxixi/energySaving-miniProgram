<template>
	<view class="">
		<view class="container">
			<view class="" style="background-color: #FFFFFF;border-radius: 30rpx;padding: 30rpx 30rpx 40rpx 30rpx;">
				<view class="flexRowStart">
					<image class="examIcon" v-if="oss" :src="oss+'icon_examinationInstruction.png'"></image>
					<view class="color_303031 bold title">
						考试须知
					</view>
				</view>
				<view class="examInfo">
					<view class="flexRow examInfoItem">
						<view class="color_303031 examInfoTitle">
							时长
						</view>
						<view class="color_919397 examInfoDetail">
							{{$isEmpty(examInfo.answerTime)?'':examInfo.answerTime}}分钟
						</view>
					</view>
					<view class="flexRow examInfoItem">
						<view class="color_303031 examInfoTitle">
							难度
						</view>
						<view class="color_919397 examInfoDetail" v-if="examInfo.level=='SIMPLE'">
							简单
						</view>
						<view class="color_919397 examInfoDetail" v-if="examInfo.level=='GENERAL'">
							较难
						</view>
						<view class="color_919397 examInfoDetail" v-if="examInfo.level=='DIFFICULT'">
							很难
						</view>
					</view>
					<view class="flexRow examInfoItem">
						<view class="color_303031 examInfoTitle">
							标准
						</view>
						<view class="color_919397 examInfoDetail">
							满分{{$isEmpty(examInfo.score)?'0':examInfo.score}}分，{{$isEmpty(examInfo.passScore)?'0':examInfo.passScore}}分及格
						</view>
					</view>
					<view v-if="examInfo.chargeStatus!=1" class="flexRow examInfoItem">
						<view class="color_303031 examInfoTitle">
							费用
						</view>
						<view class="color_919397 examInfoDetail">
							{{$isEmpty(examInfo.consume)?'0':examInfo.consume}}贝
						</view>
					</view>
					<view v-if="examInfo.rewardStatus!=1" class="flexRow examInfoItem">
						<view class="color_303031 examInfoTitle">
							奖励
						</view>
						<view class="color_919397 examInfoDetail">
							考试前{{$isEmpty(examInfo.rewardScope)?'':examInfo.rewardScope}}名合格者，每人奖励{{$isEmpty(examInfo.reward)?'':examInfo.reward}}贝
						</view>
					</view>
					<view v-if="!$isEmpty(examInfo.certificateName)" class="flexRow examInfoItem">
						<view class="color_303031 examInfoTitle" style="margin-right: 106rpx;">
							证书
						</view>
						<view class="color_919397 examInfoDetail singleEllipsis" style="flex: 1;min-width: 0;text-align:right;">
							{{$isEmpty(examInfo.certificateName)?'':examInfo.certificateName}}
						</view>
					</view>
				</view>
			</view>
			<view class="" v-if="!$isEmpty(examInfo.examExplain)" style="padding: 30rpx;background-color: #FFFFFF;border-radius: 30rpx;margin-top: 40rpx;">
				<view class="flexRowStart">
					<image class="examIcon" v-if="oss" :src="oss+'icon_examinationExplain.png'"></image>
					<view class="color_303031 bold title">
						考试说明
					</view>
				</view>
				<view class="parser">
					<jyf-parser v-if="!$isEmpty(examInfo.examExplain)" class="color_303031" :html="examInfo.examExplain" :tag-style="tagStyle"
					 lazy-load></jyf-parser>
				</view>
			</view>
			<view class="" v-if="!$isEmpty(examInfo.materialList)" style="padding: 30rpx;background-color: #FFFFFF;border-radius: 30rpx;margin-top: 40rpx;">
				<view class="flexRowStart" v-if="examInfo.materialList.length != 0">
					<image v-if="oss" class="examIcon" :src="oss+'icon_examinationMaterial.png'"></image>
					<view class="color_303031 bold title">
						考试材料
					</view>
				</view>
				<view class="flexRow" v-if="examInfo.materialList.length != 0" v-for="(item,index) of examInfo.materialList" :key="index"
				 @tap="goDetail(item)" style="background-color: #F4F5F6;border-radius: 20rpx;padding: 16rpx 14rpx 16rpx 30rpx;margin-top: 40rpx;">
					<view class="singleEllipsis color_666769" style="flex: 1;min-width: 0;font-size: 28rpx;line-height: 40rpx;">
						·{{$isEmpty(item.name)?'':item.name}}
					</view>
					<image v-if="oss" :src="oss+'icon_right_gray_gray.png'" style="width: 44rpx;height: 44rpx;margin-left: 30rpx;"></image>
				</view>
			</view>
		</view>
		<view class="bottom-safe" style="height: 112rpx;"></view>
		<view class="btn ">
			<view class="flexRow" style="margin: 20rpx 40rpx 20rpx 40rpx">
				<button open-type="share">分享</button>
				<view class="button nextBtn" v-if="examInfo.beginStatus==1" @tap="benginAnswer">
					开始
				</view>
				<view class="button notNextBtn" v-if="examInfo.beginStatus==2">
					未开始
				</view>
				<view class="button nextBtn" v-if="examInfo.beginStatus==3 && examInfo.commitState==1" @tap="continuAnswer">
					继续答题
				</view>
				<view class="button nextBtn" v-if="examInfo.beginStatus==3 && examInfo.commitState==2" @tap="goCheck">
					查看试卷
				</view>
				<view class="button nextBtn" v-if="examInfo.beginStatus==3 && examInfo.commitState==3" @tap="gowait">
					查看试卷
				</view>
			</view>
		</view>
		<uni-popup ref="dialog" type="bottom">
			<view class="popDialog">
				<view class="flexRowStart" style="justify-content: center;">
					<image v-if="oss" class="confirmImg" :src="oss+'icon_meetting_confirm.png'"></image>
					<view class="color_666769 message">
						此考试为收费考试，是否进行支付
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
		<uni-popup ref="dialogWait" type="bottom">
			<view class="popDialog">
				<view class="flexRowStart" style="justify-content: center;">
					<image v-if="oss" class="confirmImg" :src="oss+'icon_meetting_confirm.png'"></image>
					<view class="color_666769 message">
						您的试卷还未阅卷，暂时无法查看
					</view>
				</view>
				<view class="flexRow">
					<view class="button noRepeat" @tap="cancelWait">
						取消
					</view>
					<view class="button repeatNow" @tap="passWait">
						确定
					</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="confirmName" type="bottom">
			<view class="popDialog">
				<view class="flexRowStart" style="justify-content: center;">
					<image v-if="oss" class="confirmImg" :src="oss+'icon_meetting_confirm.png'"></image>
					<view class="color_666769 message">
						当前考试会颁发证书，确认当前用户名称为真实姓名
					</view>
				</view>
				<view class="flexRow">
					<view class="button noRepeat" @tap="cancelName">
						取消
					</view>
					<view class="button repeatNow" @tap="passName">
						确定
					</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="payDialog" type="bottom">
			<view class="payDialog">
				<view class="title">
					考试付费
				</view>
				<view class="message">
					<text class="color_303031 bold" style="font-size: 76rpx;line-height: 90rpx;">{{$isEmpty(examInfo.consume)?'':examInfo.consume}}</text>
					<text class="color_919397" style="font-size: 28rpx;line-height: 90rpx;">贝</text>
				</view>
				<view class="flexRow" style="margin-bottom: 48rpx;">
					<view class="bold">
						付款方式
					</view>
					<view class="color_919397">
						 能贝
					</view>
				</view>
				<view class="button" style="width: 100%;" @tap="toOpen">
					确认支付
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="dialogDonate" type="center">
			<view class="popDialogDonate">
				<view class="" style="">
					<view class="color_303031 bold title">
						提示
					</view>
					<view class="color_666769 message">
						您未设置支付密码
					</view>
				</view>
				<view class="flexRow">
					<view class="button noRepeat" @tap="cancelDonate">
						取消
					</view>
					<view class="button repeatNow" @tap="passDonate">
						确定
					</view>
				</view>
			</view>
		</uni-popup>
		<jpPwd ref="jpPwds" @completed="completed" @forget="forget"></jpPwd>
	</view>
</template>

<script>
	import jpPwd from '@/components/jp-pwd/jp-pwd.vue';
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import jyfParser from "@/components/jyf-parser/jyf-parser";
	export default {
		components: {
			jyfParser,
			uniPopup,
			jpPwd
		},
		data() {
			return {
				oss: '',
				examInfo: {},
				tagStyle: {
					body: 'line-height: 2;',
					img: 'background-size: contain|cover;width:100%;height:auto;'
				},
				isLogin: '',
				id: '',
				examName: '',
				password: '',
				routeSource: ''
			};
		},
		onLoad(options) {
			this.oss = this.$oss
			const {
				id
			} = options
			// this.examName =examName
			this.id = id
		},
		onShow() {
			var pages = getCurrentPages();
			//判断路由来源，从而决定使用navigate还是redirect，避免分享出问题
			this.routeSource = pages.length
			// console.log(pages)
			// console.log(this.routeSource)
			this.isLogin = this.$isEmpty(uni.getStorageSync('token'));
			console.log(this.isLogin)
			let url = '';
			if (this.isLogin) {
				url = `qms/exam_examination/get_detail_for_visitor/${this.id}`;
			} else {
				url = `qms/exam_examination/get_detail_v2/${this.id}/1`;
			}
			this.$http.get(url).then(res => {
				this.password = uni.getStorageSync('user').safePassword
				this.examInfo = res.data.data
				this.examName = this.examInfo.examName
				uni.setNavigationBarTitle({
					title: this.examInfo.examName
				})
			})
		},
		onShareAppMessage(res) {
			this.$http.post('admin/mark/save', {
				section: 'exam', //板块
				relationId: this.id,
				// #ifdef  MP-WEIXIN
				markSource: 'wechat', //留痕来源
				// #endif
				// #ifdef  MP-QQ
				markSource: 'qq',
				// #endif
				markTarget: 'wechat', //留痕目标
				markType: 'share', //留痕类型
				remark: '',
			}).then(res => {
				console.log(res)
			});
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: '我分享了【' + this.examName + '】考试，快去看看吧',
				path: `/pages/contacts/soWorkbench/soInfo/soExamination/soExaminationDetails/soExaminationDetails?id=${this.id}&examName=${this.examName}`
			}
		},
		onShareTimeline(res) {
			this.$http.post('admin/mark/save', {
				section: 'exam', //板块
				relationId: this.id,
				// #ifdef  MP-WEIXIN
				markSource: 'wechat', //留痕来源
				// #endif
				// #ifdef  MP-QQ
				markSource: 'qq',
				// #endif
				markTarget: 'moments', //留痕目标
				markType: 'share', //留痕类型
				remark: '',
			}).then(res => {
				console.log(res)
			});
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: '我分享了【' + this.examName + '】考试，快去看看吧',
				path: `/pages/contacts/soWorkbench/soInfo/soExamination/soExaminationDetails/soExaminationDetails?id=${this.id}&examName=${this.examName}`
			}
		},
		methods: {
			// 解密方法
			// Decrypt(word,key,iv) {
			// 	let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
			// 	let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
			// 	let decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
			// 	let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
			// 	return decryptedStr.toString();
			// },
			//加密方法
			cancelDonate() {
				this.$refs.dialogDonate.close()
			},
			passDonate() {
				uni.navigateTo({
					url: '/pages/my/payPassword/payPassword'
				})
				this.$refs.dialogDonate.close()
			},
			Encrypt(word, key, iv) {
				var CryptoJS = require('../../../../../../common/crypto.js');
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
				// console.log(this.password)
				var CryptoJS = require('../../../../../../common/crypto.js');
				if (this.$isEmpty(this.password)) {

				} else {
					let key = 'gdscloudprisbest';
					key = CryptoJS.enc.Latin1.parse(key);
					const iv = key
					this.password = (this.Encrypt(e, key, iv))
					// console.log(this.password)
					this.$http.post('qms/exam_answer/create_test_pager', {
						examinationId: this.id,
						pwd: this.password
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
							if (this.routeSource == 1) {
								uni.navigateTo({
									url: `/pages/contacts/soWorkbench/soInfo/soExamination/soExaminationDetails/soExaminationPay/soExaminationPay?id=${res.data.data.id}&examName=${res.data.data.examName}&consume=${this.examInfo.consume}`
								})
							} else {
								uni.redirectTo({
									url: `/pages/contacts/soWorkbench/soInfo/soExamination/soExaminationDetails/soExaminationPay/soExaminationPay?id=${res.data.data.id}&examName=${res.data.data.examName}&consume=${this.examInfo.consume}`
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
			toOpen() {
				this.$refs.dialog.close()
				this.$refs.payDialog.close()
				if (this.$isEmpty(this.password)) {
					this.$refs.dialogDonate.open()
				} else {
					this.$refs.jpPwds.toOpen()
				}
			},
			goDetail(item) {
				// console.log(item)
				//Cross-module
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/soInfo/soMaterial/materialKind/materialDetails/materialDetails?id=${item.id}`
				})
			},
			benginAnswer() {
				if (this.isLogin == true) {
					// if(this.routeSource == 1){
					// 	uni.navigateTo({
					// 		url:`/pages/contacts/soWorkbench/soInfo/soExamination/soExaminationList/soExaminationList?id=${this.examInfo.id}`
					// 	})
					// }else{
					// 	uni.redirectTo({
					// 		url:`/pages/contacts/soWorkbench/soInfo/soExamination/soExaminationList/soExaminationList?id=${this.examInfo.id}`
					// 	})
					// }
					uni.navigateTo({
						url: "/pages/getUserInfo/getUserInfo"
					})
				} else {
					if (!this.$isEmpty(this.examInfo.certificateName)) {
						this.$refs.confirmName.open()
					} else {
						if (this.examInfo.chargeStatus == 2 || this.examInfo.chargeStatus == 3) {
							//付费考试开放后打开
							this.$refs.dialog.open()
							// uni.showToast({
							// 	title:"小程序暂不支持付费考试，请至APP付费参与",
							// 	icon:'none'
							// })
						} else {
							//routeSource判断成绩，避免分享进来后点击返回出错
							if (this.routeSource == 1) {
								uni.navigateTo({
									url: `/pages/contacts/soWorkbench/soInfo/soExamination/soExaminationList/soExaminationList?id=${this.examInfo.id}`
								})
							} else {
								uni.redirectTo({
									url: `/pages/contacts/soWorkbench/soInfo/soExamination/soExaminationList/soExaminationList?id=${this.examInfo.id}`
								})
							}
						}
					}
				}
			},
			continuAnswer() {
				this.$http.get('qms/exam_answer/check_state_v2/2', {
					params: {
						id: this.examInfo.id,
						manageId: this.examInfo.manageId
					}
				}).then(res => {
					console.log(res)
					//已经测试，正常
					if (res.data.data.code == 4) {
						uni.showToast({
							title: res.data.data.msg,
							icon: "none"
						})
					}else if(res.data.data.code == 2){
						uni.showToast({
							title: '交卷成功，成绩由人工阅卷最终确定',
							icon: 'none',
							duration: 1000
						})
					} else if (res.data.data.code == 1){
						//测试正常
						uni.redirectTo({
							url:`/pages/contacts/soWorkbench/soInfo/soExamination/soExaminationList/soExaminationResult/soExaminationResult?id=${this.examInfo.manageId}&result=${res.data.data.result}&msg=${res.data.data.msg}&score=${res.data.data.score}`
						})
					}
					 else {
						if (this.routeSource == 1) {
							uni.navigateTo({
								url: `/pages/contacts/soWorkbench/soInfo/soExamination/soExaminationList/soExaminationList?manageId=${this.examInfo.manageId}`
							})
						} else {
							uni.redirectTo({
								url: `/pages/contacts/soWorkbench/soInfo/soExamination/soExaminationList/soExaminationList?manageId=${this.examInfo.manageId}`
							})
						}
					}
				})
			},
			goCheck() {
				this.$http.get('qms/exam_answer/check_state_v2/1',{
					params: {
						id: this.examInfo.id,
						manageId: this.examInfo.manageId,
						}
					}).then(res => {
					console.log(res)
					if (res.data.data.code == 20) {
						uni.showToast({
							title: res.data.data.hint,
							icon: 'none',
							duration: 1000
						})
					}else {
						uni.redirectTo({
							url: `/pages/contacts/soWorkbench/soInfo/soExamination/soExaminationList/soExaminationResult/soExaminationAnalyze/soExaminationAnalyze?id=${this.examInfo.manageId}`
						})
					}
				})
			},
			cancel() {
				this.$refs.dialog.close()
			},
			pass() {
				this.$refs.dialog.close()
				this.$refs.payDialog.open()
			},
			gowait() {
				this.$refs.dialogWait.open()
			},
			cancelWait() {
				this.$refs.dialogWait.close()
			},
			passWait() {
				this.$refs.dialogWait.close()
			},
			cancelName() {
				this.$refs.confirmName.close()
			},
			passName() {
				if (this.examInfo.chargeStatus == 2 || this.examInfo.chargeStatus == 3) {
					//付费考试开放后打开
					this.$refs.confirmName.close()
					this.$refs.dialog.open()
					// uni.showToast({
					// 	title:"小程序暂不支持付费考试，请至APP付费参与",
					// 	icon:'none'
					// })
				} else {
					// console.log(666)
					this.$refs.confirmName.close()
					if (this.routeSource == 1) {
						uni.navigateTo({
							url: `/pages/contacts/soWorkbench/soInfo/soExamination/soExaminationList/soExaminationList?id=${this.examInfo.id}`
						})
					} else {
						uni.redirectTo({
							url: `/pages/contacts/soWorkbench/soInfo/soExamination/soExaminationList/soExaminationList?id=${this.examInfo.id}`
						})
					}
				}
			},
		}
	}
</script>

<style lang="scss">
	.popDialogDonate {
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

	page {
		background-color: #F4F5F6;
	}

	.popDialog {
		padding:32rpx;
		width: 590rpx;
		background-color: #FFFFFF;
		// box-shadow: 0px -2rpx 4rpx 0px rgba(0, 0, 0, 0.03);

		.title {
			font-size: 36rpx;
			line-height: 52rpx;
			text-align: center;
			margin-top: 32rpx;
		}
		.message{
			font-size: 28rpx;
			line-height: 52rpx;
			// text-align: center;
			margin: 48rpx 0;
		}

		.noRepeat {
			width: 288rpx;
			background-color: #FFFFFF;
			color: #F74437;
			border: 2rpx solid #F74437;
			margin-right: 30rpx;
		}

		.repeatNow {
			width: 292rpx;
		}
	}

	.payDialog {
		padding: 32rpx;
		background-color: #FFFFFF;
		// box-shadow: 0px -2rpx 4rpx 0px rgba(0, 0, 0, 0.03);
		
		.title {
			font-size: 36rpx;
			line-height: 52rpx;
			text-align: center;
			margin-top: 32rpx;
		}
		.message{
			font-size: 28rpx;
			line-height: 52rpx;
			// text-align: center;
			margin: 48rpx 0;
		}
	}

	.confirmImg {
		width: 52rpx;
		height: 52rpx;
		margin-right: 20rpx;
	}

	::v-deep button {
		background-color: #FFFFFF;
		color: #F74437;
		border-radius: 20rpx;
		border: 2rpx solid #F74437;
		margin-right: 30rpx;
		padding: 14rpx 73rpx;
		font-size: 28rpx;
		line-height: 40rpx;
		font-weight: bold;
	}

	.container {
		padding: 60rpx 40rpx;

		.examInfo {
			.examInfoItem {
				margin-top: 40rpx;

				// padding: 20rpx 0px;
				.examInfoTitle {
					font-size: 28rpx;
					line-height: 40rpx;
				}

				.examInfoDetail {
					font-size: 24rpx;
					line-height: 34rpx;
				}
			}
		}

		.parser {
			color: #666769;
			font-size: 28rpx;
			line-height: 48rpx;
			margin-top: 30rpx;
		}
	}

	.examIcon {
		width: 36rpx;
		height: 36rpx;
		margin-right: 10rpx;
	}

	.title {
		font-size: 32rpx;
		line-height: 44rpx;
	}

	.btn {
		width: 100%;
		background-color: #FFFFFF;
		// z-index: 666; 
		position: fixed;
		bottom: 0rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

		.nextBtn {
			flex: 1;
		}
	}

	::v-deep .notNextBtn {
		background-color: #919397;
		color: #FFFFFF;
		flex: 1;
	}

	.bottom-safe {
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}
</style>
