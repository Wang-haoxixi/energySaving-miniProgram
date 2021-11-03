<template>
	<view class="" v-if="showAllStatus">
		<view class="container" v-if="showStatus">
			<view class="containerWrap">
				<view class="materialNameInfo">
					<view class=" bold materialName">
						{{$isEmpty(materialDetails.materialName)?'':materialDetails.materialName}}
					</view>
				</view>
				<view class="countInfo">
					<view class="color_919397 flexRowStart createTime" style="align-items: flex-start;">
						<view class="" v-if="materialDetails.isOriginal==1">
							<view class="color_2F80FF mark">
								原创
							</view>
						</view>
						<view style="margin-right: 10rpx;">作者:</view>
						<view class="color_516B8D" style="margin-right: 10rpx;flex: 1;">{{$isEmpty(materialDetails.createUser)?'':materialDetails.createUser}}</view>
						<view style="">{{$isEmpty(materialDetails.createTime)?'':materialDetails.createTime}}</view>
					</view>
				</view>
				<view class="summary">
					<view class="" style="" v-if="!$isEmpty(summary)">
						<jyf-parser class="color_666769 txt" :html="summary" :tag-style="tagStyle" img-mode="widthFix"></jyf-parser>
					</view>
					<view class="color_666769 flexColumn" v-if="isPay==0 && isSoPay==0" style="margin-top: 40rpx;">
						<view class="color_919397" style="font-size: 28rpx;line-height: 40rpx;">
							试读已结束，购买可继续阅读
						</view>
						<view class="" style="margin: 40rpx 0rpx;">
							<text class="color_F74437" style="font-size: 76rpx;line-height: 40rpx;">{{materialDetails.downloadCost}}</text>
							<text class="color_919397" style="font-size: 28rpx;line-height: 40rpx;">贝</text>
						</view>
						<view class="button payBtn" style="margin-bottom: 288rpx;" @tap="payMaterial">
							立即支付
						</view>
					</view>
				</view>
				<view class="flexRowStart tagInfo" v-if="!isEmpty(materialDetails.tag)" style="flex-wrap: wrap;">
					<view v-for="(item,index) of materialDetails.tag" :key="index" class="color_F74437 tags">
						<view class="eachTag">{{$isEmpty(item)?'':item}}</view>
					</view>
				</view>
				<view class="" v-if="(materialDetails.isPay!=0 ||materialDetails.isSoPay!=0) && (materialDetails.attachMultiFileList &&materialDetails.attachMultiFileList.length>0)">
					<view class="attachFileList" v-for="(item,index) of materialDetails.attachMultiFileList" :key="index">
						<view class="flexRowStart" style="width: 100%;">
							<view class="documentInfo">
								<image v-if="oss" class="documentImg" :src="oss+'icon_material_details_ducoment.png'" mode="aspectFill"></image>
							</view>
							<view class="accessory">
								<view class="color_303031 bold title">
									附件
								</view>
								<view class="color_919397 original singleEllipsis">
									{{$isEmpty(item.original)?'':item.original}}
								</view>
							</view>
						</view>
						<view class="color_2F80FF bold downloadBtn">
							下载
						</view>
					</view>
					<view class="color_919397 remarkInfo" v-if="materialDetails.attachMultiFileList &&materialDetails.attachMultiFileList.length>0">
						小程序端暂不支持下载附件，请在APP端下载
					</view>
				</view>
				<view class="color_919397" style="font-size: 24rpx;line-height: 34rpx;">
					<view class="" v-if="$isEmpty(materialDetails.orgId) || materialDetails.orgId==0">
						<!-- 文章 -->
						<view class="" v-if="materialDetails.isOriginal==1">
							<!-- 原创 -->
							本文由<text>{{$isEmpty(materialDetails.realName)?'':materialDetails.realName}}</text>发布于我能平台，未经许可，禁止转载。
						</view>
						<view class="" v-else>
							<!-- 转载 -->
							<text class="color_2F80FF" @tap="goOriginal">原文</text>由<text>{{$isEmpty(materialDetails.createUser)?'':materialDetails.createUser}}</text>发布于<text>{{$isEmpty(materialDetails.platformSource)?'其他平台': materialDetails.platformSource}}</text>，
							由<text>{{$isEmpty(materialDetails.realName)?'':materialDetails.realName}}</text>转载至我能平台，未经许可，禁止转载。如涉及作品内容、版权和其它问题，请在30日内与本平台联系，我们将在第一时间处理。
						</view>
					</view>
					<view class="" v-else>
						<!-- 材料 -->
						<view class="" v-if="materialDetails.isOriginal==1">
							<!-- 原创 -->
							<view class="" v-if="materialDetails.beenModifiedTwice==1">
								<!-- 原本转载，经过了二次编辑 -->
								<text class="color_2F80FF" @tap="goOriginal">原文</text>由<text>{{$isEmpty(materialDetails.oldCreateUploadName)?'':materialDetails.oldCreateUploadName}}</text>转载至我能平台，由<text
								 class="color_2F80FF" @tap="goCannerCard">{{$isEmpty(materialDetails.realName)?'':materialDetails.realName}}</text>
								二次创作后发布,未经许可，禁止转载。如涉及作品内容、版权和其它问题，请在30日内与本平台联系，我们将在第一时间处理。
							</view>
							<view class="" v-else-if="materialDetails.beenModifiedTwice==2">
								<!-- 原本原创，经过了二次编辑 -->
								<text class="color_2F80FF" @tap="goOriginal">原文</text>由<text>{{$isEmpty(materialDetails.oldCreateUploadName)?'':materialDetails.oldCreateUploadName}}</text>发布于我能平台，由<text
								 class="color_2F80FF" @tap="goCannerCard">{{$isEmpty(materialDetails.realName)?'':materialDetails.realName}}</text>
								二次创作后发布,未经许可，禁止转载。如涉及作品内容、版权和其它问题，请在30日内与本平台联系，我们将在第一时间处理。
							</view>
							<view class="" v-else>
								<!-- 原创未二次编辑 -->
								本文由<text class="color_2F80FF" @tap="goCannerCard">{{$isEmpty(materialDetails.realName)?'':materialDetails.realName}}</text>发布于我能平台，未经许可，禁止转载.
							</view>
						</view>
						<view class="" v-else>
							<!-- 转载 -->
							<text class="color_2F80FF" @tap="goOriginal">原文</text>由<text>{{$isEmpty(materialDetails.createUser)?'':materialDetails.createUser}}</text>发布于<text>{{$isEmpty(materialDetails.platformSource)?'其他平台': materialDetails.platformSource}}</text>，
							由<text class="color_2F80FF" @tap="goCannerCard">{{$isEmpty(materialDetails.realName)?'':materialDetails.realName}}</text>转载至我能平台，未经许可，禁止转载。如涉及作品内容、版权和其它问题，请在30日内与本平台联系，我们将在第一时间处理。
						</view>
					</view>
				</view>
				<view class="">
					<view class="color_919397 flexRowStart viewsInfo">
						<view class="" style="margin-right: 10rpx;">
							阅读
						</view>
						<view class="">
							{{$isEmpty(materialDetails.views)?'0':materialDetails.views}}
						</view>
					</view>
					<!-- <view class="color_919397 flexRowStart downloadTimesInfo">
						<image v-if="oss" class="downloadImg" :src="oss+'icon_material_details_download.png'"></image>
						<text>{{$isEmpty(materialDetails.downloadTimes)?'0':materialDetails.downloadTimes}}</text>
					</view> -->
				</view>
				<view class="bottom-safe" style="height: 112rpx;"></view>
			</view>
			<view class="btns">
				<view class="flexRow wrapBtn">
					<!-- <view class="commentBtn flexColumn" @tap="materialComment" style="justify-content: space-between;margin-right:72rpx;margin-left: 36rpx;height: 92rpx;">
						<image v-if="oss" :src="$ossUrl('materialDetail_comment.png')" style="width: 44rpx;height: 44rpx;margin-right:2rpx;"></image>
						<text class="color_666769" style="font-size: 28rpx;line-height: 40rpx;margin-right: 6rpx;">评论</text>
						<view style="color: #272727; font-size: 20rpx;line-height: 28rpx;">{{$isEmpty(materialDetails.commentCount)?'0':materialDetails.commentCount>999?'999+':materialDetails.commentCount}}</view>
					</view> -->
					<!-- <view class="collectBtn button" style="flex: 1;" v-show="materialDetails.collect==false" @tap="collectBtn">
						收藏
					</view>
					<view class="cancelCollectBtn button" style="flex: 1;" v-show="materialDetails.collect==true" @tap="cancelCollectBtn">
						已收藏
					</view> -->
					<view class="flexRowStart" style="margin-right:68rpx;margin-left: 36rpx;">
						<button open-type="share">
							<view class="flexColumn" style="height:92rpx;justify-content: space-between;margin-right:72rpx;">
								<image :src="$ossUrl('serviceDetail_share.png')" mode="" style="width: 44rpx;height: 44rpx;"></image>
								<view class="" style="color: #272727;font-size: 20rpx;line-height: 28rpx;">
									分享
								</view>
							</view>
						</button>
						<view class="flexColumn" style="height:92rpx;justify-content: space-between;" @tap="collectBtn">
							<image v-if="materialDetails.collect==false" :src="$ossUrl('materialDetail_collect.png')" mode="" style="width: 44rpx;height: 44rpx;"></image>
							<image v-else :src="$ossUrl('home_star.png')" mode="" style="width: 44rpx;height: 44rpx;"></image>
							<view class="" style="color: #272727;font-size: 20rpx;line-height: 28rpx;">
								收藏
							</view>
						</view>
					</view>
					<view class="button" style="flex: 1;" @tap="materialComment">
						去评论
					</view>
				</view>
			</view>
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
		<view class="" v-else>
			<image class="emptyImg" v-if="oss" :src="oss+'pic_noMessage.png'" mode="aspectFit"></image>
		</view>
	</view>
</template>

<script>
	import jpPwd from '@/components/jp-pwd/jp-pwd.vue';
	import jyfParser from "@/components/jyf-parser/jyf-parser"
	import {
		isEmpty,
		getCompanyStation
	} from "@/common/utils.js"
	export default {
		components: {
			jyfParser,
			jpPwd
		},
		data() {
			return {
				materialDetails: {},
				summary: '',
				isPay: '',
				isSoPay: '',
				tagStyle: {
					body: 'line-height: 2;',
					img: 'background-size: contain|cover;width:100%;height:auto;'
				},
				id: '',
				userId: '',
				oss: '',
				password: '',
				//判断文章不存在时页面显示
				showStatus: true,
				orgId: '',
				url: '',
				isLogin: '',
				showAllStatus: false
			}
		},
		onLoad(options) {
			const {
				id,
				orgId
			} = options
			this.oss = this.$oss
			this.orgId = orgId
			this.id = id
			// console.log(id)
		},
		onShow() {
			this.userId = uni.getStorageSync('userinfo').user_id
			this.isLogin = this.$isEmpty(uni.getStorageSync('token'));
			// this.$http.get(`dms/material/content/${this.id}`).then(res => {
			// 	// console.log(res)
			// 	// this.materialList=res.data.data.records
			// 	this.summary=res.data.data
			// })
			if (this.isLogin) {
				this.url = `dms/material/tourist/${this.id}`
			} else {
				if (this.$isEmpty(this.orgId)) {
					this.url = `dms/material/${this.id}`
				} else {
					this.url = `dms/material/${this.id}?orgId=${this.orgId}`
				}
			}
			this.$http.get(this.url).then(res => {
				//获取密码放在这里，放在前面有延迟获取不到
				this.password = uni.getStorageSync('user').safePassword
				// console.log(res)
				// this.materialList=res.data.data.records
				if (res.data.code == 0) {
					this.materialDetails = res.data.data
					this.summary = res.data.data.materialContent
					this.isPay = res.data.data.isPay
					this.isSoPay = res.data.data.isSoPay
					this.showAllStatus = true
					this.showStatus = true
				} else {
					this.showAllStatus = true
					this.showStatus = false
					uni.showToast({
						title: res.data.data.message,
						icon: "none"
					})
				}
			})
		},
		onShareAppMessage(res) {
			this.$http.post('admin/mark/save', {
				section: 'material', //板块
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
				// console.log(res.target)
			}
			return {
				title: this.materialDetails.materialName,
				path: '/pages/contacts/soWorkbench/soInfo/soMaterial/materialKind/materialDetails/materialDetails?id=' + this.id
			}
		},
		onShareTimeline(res) {
			this.$http.post('admin/mark/save', {
				section: 'material', //板块
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
				title: this.materialDetails.materialName,
			}
		},
		methods: {
			materialComment() {
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/soInfo/soMaterial/materialKind/materialDetails/materialThoughts/materialThoughts?id=${this.materialDetails.id}`
				})
			},
			Encrypt(word, key, iv) {
				var CryptoJS = require('../../../../../../../common/crypto.js');
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
				var CryptoJS = require('../../../../../../../common/crypto.js');
				if (this.$isEmpty(this.password)) {

				} else {
					let key = 'gdscloudprisbest';
					key = CryptoJS.enc.Latin1.parse(key);
					const iv = key
					this.password = (this.Encrypt(e, key, iv))
					// console.log(this.password)
					this.$http.post('dms/material/payment', {
						id: this.materialDetails.id,
						safePassWord: this.password
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
								title: "支付成功",
								icon: "none",
								duration: 1000,
								success() {
									setTimeout(() => {
										that.$http.get(that.url).then(res => {
											// console.log(res)
											// this.materialList=res.data.data.records
											that.materialDetails = res.data.data
											that.summary = res.data.data.materialContent
											that.isPay = res.data.data.isPay
											that.isSoPay = res.data.data.isSoPay
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
			payMaterial() {
				if (this.isLogin) {
					uni.navigateTo({
						url: "/pages/getUserInfo/getUserInfo"
					})
				} else if (this.$isEmpty(this.password)) {
					this.$refs.dialog.open()
				} else {
					this.$refs.jpPwds.toOpen()
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
			collectBtn() {
				if(this.materialDetails.collect == false){
					this.$http.post('dms/collection/create', {
						type: this.materialDetails.materialType,
						targetId: this.materialDetails.id,
						name: this.materialDetails.materialName
					}).then(res => {
						if (res.data.code == 0) {
							this.materialDetails.collect = true
						} else {
							uni.showToast({
								title: res.data.message,
								icon: 'none'
							})
						}
					})
				}else{
					this.$http.post('dms/collection/app/delete', {
						type: this.materialDetails.materialType,
						targetIds: [this.materialDetails.id]
					}).then(res => {
						// console.log(res)
						if (res.data.code == 0) {
							this.materialDetails.collect = false
						} else {
							uni.showToast({
								title: res.data.message,
								icon: 'none'
							})
						}
					})
				}
			},
			goCannerCard(materialDetails) {
				uni.navigateTo({
					url: `/pages/find/cannerCard/cannerCard?id=${this.materialDetails.userId}`
				})
			},
			goOriginal() {
				if (this.materialDetails.originalMaterialId == 0 && !this.$isEmpty(this.materialDetails.originalLink)) {
					uni.setClipboardData({
						data: `${this.materialDetails.originalLink}`,
						success: function() {
							// console.log('success');
							uni.showToast({
								title: "已复制原文链接，请到浏览器打开",
								icon: "none"
							})
						}
					});
				} else if (this.materialDetails.originalMaterialId == 0 && this.$isEmpty(this.materialDetails.originalLink)) {
					return false
				} else {
					uni.navigateTo({
						url: `/pages/contacts/soWorkbench/soInfo/soMaterial/materialKind/materialDetails/materialDetails?id=${this.materialDetails.originalMaterialId}&orgId=${this.orgId}`
					})
				}
			},
			isEmpty,
			getCompanyStation
		}
	}
</script>

<style lang="scss">
	::v-deep button{
		margin: 0;
		padding: 0;
		background-color: #FFFFFF;
	}
	.popDialog {
		padding: 32rpx;
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
			margin: 48rpx;
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

	.payBtn {
		color: #F74437;
		background: #FFFFFF;
		border: 2rpx solid #F74437;
		width: 288rpx;
	}

	.mark {
		border: 2rpx solid #2F80FF;
		padding: 0rpx 12rpx;
		font-size: 22rpx;
		border-radius: 10rpx;
		margin-right: 20rpx;
	}

	.viewsInfo {
		margin: 32rpx 0px;
		font-size: 24rpx;
		line-height: 34rpx;
	}

	.container {
		height: 100%;

		.containerWrap {
			margin: 32rpx;

			.materialNameInfo {
				.materialName {
					flex: 1;
					margin-bottom: 24rpx;
					font-size: 40rpx;
					line-height: 56rpx;
					word-break: break-word;
				}
			}

			.countInfo {
				height: 100%;
				flex: 1;
				word-break: break-word;
				margin-bottom: 32rpx;

				.createTime {
					flex: 1;
					height: 100%;
					font-size: 24rpx;
					line-height: 48rpx;
				}
			}

			.tagInfo {
				margin-bottom: 32rpx;

				.tags {
					margin-right: 20rpx;
					border-radius: 10rpx;
					background: rgba(247, 68, 55, 0.1);
					height: 44rpx;
					line-height: 26rpx;

					.eachTag {
						font-size: 22rpx;
						padding: 10rpx;
					}
				}
			}

			.personInfo {
				margin-bottom: 40rpx;
				background-color: #F4F5F6;
				border-radius: 30rpx;
				padding: 30rpx;

				.avatarImg {
					width: 76rpx;
					height: 76rpx;
					margin-right: 20rpx;
					border-radius: 20rpx;
				}

				.realName {
					margin-bottom: 10rpx;
					font-size: 28rpx;
				}

				.company {
					font-size: 22rpx;
				}

				.attentionBtn {
					font-size: 24rpx;
					background-color: rgba(247, 68, 55, .1);
					padding: 4rpx 10rpx;
					border-radius: 10rpx;
				}
			}

			.content {
				margin-bottom: 40rpx;

				.title {
					margin-bottom: 30rpx;
					font-size: 32rpx;
				}

				.materialIntro {
					width: 610rpx;
					font-size: 24rpx;
					background-color: #F4F5F6;
					border-radius: 30rpx;
					padding: 30rpx;
					line-height: 2;
					word-wrap: break-word;
				}
			}

			.summary {
				margin-bottom: 32rpx;

				.title {
					margin-bottom: 30rpx;
					font-size: 32rpx;
				}

				.txt {
					font-size: 28rpx;
					line-height: 56rpx;
					font-weight: bold;
				}

				.remark {}
			}

			.attachFileList {
				margin-bottom: 30rpx;
				background-color: #F4F5F6;
				border-radius: 30rpx;
				padding: 30rpx;

				.documentInfo {
					margin-right: 20rpx;

					.documentImg {
						width: 76rpx;
						height: 76rpx;
						border-radius: 20rpx;
					}
				}

				.accessory {
					flex: 1;
					min-width: 0;

					.title {
						margin-bottom: 10rpx;
						font-size: 28rpx;
					}

					.original {
						font-size: 22rpx;
					}
				}

				.downloadBtn {
					font-size: 24rpx;
					background-color: rgba(47, 128, 255, .1);
					padding: 4rpx 22rpx;
					border-radius: 10rpx;
					display: none;
				}
			}

			.remarkInfo {
				font-size: 20rpx;
				line-height: 34rpx;
			}

			.disclaimer {
				border-radius: 30rpx;
				background-color: #F4F5F6;
				margin-top: 60rpx;
				padding: 30rpx;
				font-size: 24rpx;
				line-height: 44rpx;
			}
		}

		.btns {
			width: 100%;
			background-color: #FFFFFF;
			position: fixed;
			bottom: 0rpx;
			box-shadow: 0px -4rpx 6rpx rgba(174, 191, 211, 0.13);
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);

			.wrapBtn {
				margin: 24rpx 32rpx 32rpx;

				.collectBtn {
					margin: 0 30rpx;
				}

				.cancelCollectBtn {
					margin: 0 30rpx;
					background-color: #F4F5F6;
					color: #919397;
				}
			}
		}
	}

	::v-deep .btn {
		background: linear-gradient(90deg, #FF825C 0%, #FF3636 100%);
		color: #FFFFFF;
		flex: 1;
		height: 92rpx;
		line-height: 92rpx;
		border-radius: 64rpx;
		font-size: 30rpx;
		text-align: center;
	}

	::v-deep .btn::after {
		border: none;
	}

	.bottom-safe {
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}
</style>
