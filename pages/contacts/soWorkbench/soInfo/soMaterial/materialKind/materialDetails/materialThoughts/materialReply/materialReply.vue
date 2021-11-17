<template>
	<view>
		<view class="container">
			<view class="color_303031 bold" style="font-size: 28rpx;line-height: 40rpx;">
				{{replyInfo.total}}条回复
			</view>
			<view class="" v-for="(item,index) of replyInfo.records" :key="index">
				<view class="flexRowStart" style="align-items: flex-start;padding: 32rpx 0rpx 0rpx;">
					<image :src="imageError(item.avatar,$oss)" class="avatarImg" style="margin-right: 24rpx;" @tap.stop="goCannerCard(item)"></image>
					<view class="" style="flex: 1;padding-bottom: 32rpx;border-bottom: 2rpx solid #EFF0F1;">
						<view class="flexRowStart color_303031" style="font-size: 28rpx;line-height: 40rpx;margin-bottom:20rpx;">
							<view class="color_303031">
								{{item.realName}}
							</view>
							<view class="color_919397" style="margin: 0 20rpx;" v-if="!$isEmpty(item.replyRealName)">
								回复
							</view>
							<view class="" v-if="!$isEmpty(item.replyRealName)">
								{{item.replyRealName}}
							</view>
						</view>
						<view class="color_666769" style="font-size: 28rpx;line-height: 40rpx;margin-bottom: 30rpx;">
							{{item.content}}
						</view>
						<view class="flexRow color_BABEC0" style="font-size: 24rpx;line-height: 34rpx;">
							<view class="">
								{{item.createTime.substring(0,16)}}
							</view>
							<view class="flexRowStart">
								<view class="flexRowStart" @tap="changePraiseStatus(item)">
									<image v-if="oss && item.praiseStatus == 0" :src="oss+'icon_find_action_like.png'" style="width: 30rpx;height: 30rpx;margin-right: 14rpx;"></image>
									<image v-if="oss && item.praiseStatus == 1" :src="oss+'icon_find_action_liked.png'" style="width: 30rpx;height: 30rpx;margin-right: 14rpx;"></image>
									<view class="">
										{{item.likes}}
									</view>
								</view>
								<view class="flexRowStart" style="margin-left: 62rpx;" @tap="comment(item)">
									<image v-if="oss" :src="oss+'icon_find_action_comment.png'" style="width: 28rpx;height: 24rpx;margin-right: 10rpx;"></image>
									<view class="color_919397" style="font-size: 20rpx;line-height: 28rpx;">
										评论
									</view>
								</view>
							</view>
						</view>
						<view v-if="item.status" class="" style="background-color: #F4F5F6;border-radius: 20rpx;">

						</view>
					</view>
				</view>
			</view>
			<image class="emptyImg" v-if="!replyInfo.records.length > 0 && oss" :src="oss+'pic_energy_default_wuxinxi.png'" mode="aspectFit"></image>
			<uni-load-more :status="replyStatus" v-if="replyInfo.records.length>0"></uni-load-more>
			<view class="bottom-safe" style="height: 112rpx;"></view>
		</view>
		<view class="btns">
			<view class="flexRow wrapBtn" @tap="reply">
				<input type="text" value="" :placeholder="placeholder" placeholder-style="color:#BABEC0;font-size:28rpx;line-height:40rpx;"
				 style="padding: 16rpx 30rpx;" disabled="true" />
			</view>
		</view>
		<uni-popup ref="popup" type="bottom">
			<view class="popup_input">
				<textarea :placeholder="placeholder" placeholder-class="inputDefault" v-model="input" maxlength="250" fixed="true"
				 adjust-position="true" show-confirm-bar="false" cursor-spacing="80"></textarea>
				<view class="sendBtn" v-if="input.length>0" @tap="sendInput">发送</view>
				<view class="notSendBtn" v-else>发送</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		imageError
	} from '@/common/utils.js';
	export default {
		data() {
			return {
				commentId: '',
				realName: '',
				replyInfo: {},
				replyStatus: 'more',
				oss: '',
				placeholder: '',
				input: '',
				id: '',
				parentId: '',
				dataId: ''
			};
		},
		onLoad(options) {
			this.oss = this.$oss
			const {
				commentId,
				realName,
				dataId
			} = options
			this.commentId = commentId
			this.realName = realName
			this.dataId = dataId
			this.placeholder = `回复${this.realName}`
			this.$http.get('dms/common_comment/reply_page', {
				params: {
					commentId: this.commentId
				}
			}).then(res => {
				// console.log(res)
				this.replyInfo = res.data.data
				if (!(this.replyInfo.pages > this.replyInfo.current)) {
					this.replyStatus = 'noMore'
				}
			})
		},
		onReachBottom() {
			let that = this
			if (that.replyInfo.current < that.replyInfo.pages) {
				that.replyStatus = 'loading'
				that.$http.get('dms/common_comment/reply_page', {
					params: {
						commentId: that.commentId,
						current: that.replyInfo.current + 1
					}
				}).then(res => {
					that.replyInfo.current = res.data.data.current
					that.replyInfo.records = that.replyInfo.records.concat(res.data.data.records);
					that.replyStatus = 'more';
				})
			} else {
				that.replyStatus = 'noMore'
			}
		},
		methods: {
			imageError,
			reply() {
				this.input = ''
				this.placeholder = `回复${this.realName}`
				this.$refs.popup.open()
				this.parentId = this.commentId
				this.id = this.dataId
			},
			goCannerCard(item) {
				uni.navigateTo({
					url: `/pages/find/cannerCard/cannerCard?id=${item.createBy}`
				})
			},
			comment(item) {
				this.input = ''
				this.placeholder = `回复${item.realName}`
				this.id = item.dataId
				this.parentId = item.commentId
				this.$refs.popup.open()
			},
			changePraiseStatus(item) {
				if (item.praiseStatus == 0) {
					this.$http.get('dms/common_comment/likes/' + item.commentId).then(res => {
						// console.log(res)
						if (res.data.code == 0) {
							item.likes++;
							item.praiseStatus = 1
						} else {
							uni.showToast({
								title: res.data.message,
								icon: "none"
							})
						}
					})
				} else {
					//取消点赞
					this.$http.get('dms/common_comment/dislikes/' + item.commentId).then(res => {
						// console.log(res)
						if (res.data.code == 0) {
							item.likes--;
							item.praiseStatus = 0
						} else {
							uni.showToast({
								title: res.data.message,
								icon: "none"
							})
						}
					})
				}
			},
			sendInput() {
				let that = this
				that.$http.post('dms/common_comment/create', {
					dataId: that.id,
					content: that.input,
					category: "material",
					parentId: that.parentId
				}).then(res => {
					if (res.data.code == 0) {
						uni.showToast({
							title: "评论成功",
							icon: "success",
							duration: 1000,
							success: () => {
								setTimeout(() => {
									that.input = ''
									that.$refs.popup.close()
									that.$http.get('dms/common_comment/reply_page', {
										params: {
											commentId: that.commentId
										}
									}).then(res => {
										// console.log(res)
										that.replyInfo = res.data.data
										if (!(that.replyInfo.pages > that.replyInfo.current)) {
											that.replyStatus = 'noMore';
										}
									})
								}, 1000)
							}
						})
					}
				})

			}
		}
	}
</script>

<style lang="scss">
	.avatarImg{
		height: 92rpx;
		width: 92rpx;
		border-radius: 50%;
	}
	.container {
		padding: 32rpx;
	}

	.popup_input {
		padding: 32rpx;
		background-color: #FFFFFF;
		display: flex;
		font-size: 28rpx;
		align-items: flex-end;

		.sendBtn {
			margin-left: 20rpx;
			color: #F74437;
		}

		.notSendBtn {
			margin-left: 20rpx;
			color: #F7443780;
		}
	}

	textarea {
		flex: 1;
		padding: 20rpx;
		line-height: 48rpx;
		background-color: #F4F5F6;
		color: #666769;
		border-radius: 20rpx;
		height: 184rpx;
	}

	.btns {
		width: 100%;
		background-color: #FFFFFF;
		position: fixed;
		bottom: 0rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

		.wrapBtn {
			background-color: #F4F5F6;
			border-radius: 20rpx;
			width: 670rpx;
			margin: 20rpx 40rpx;
		}
	}

	.bottom-safe {
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}
</style>
