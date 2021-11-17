<template>
	<view class="">
		<view class="container">
			<view class="commentInfo">
				<view class="flexRowStart commentWrap">
					<image class="avatarImg" v-if="commentInfo.avatar" :src="imageError(commentInfo.avatar,$oss)" mode="aspectFill"></image>
					<view class="info">
						<view class="color_303031 bold name">
							{{$isEmpty(commentInfo.name)?'':commentInfo.name}}
						</view>
						<view class="color_BABEC0 createTime">
							{{$isEmpty(commentInfo.createTime)?'':commentInfo.createTime.substring(0,16)}}
						</view>
					</view>
				</view>
			</view>
			<view class="color_303031 contentDetail">
				{{$isEmpty(commentInfo.content)?'':commentInfo.content}}
			</view>
			<view class="commentBtn" @tap="reply">
				<image class="commentBtnImg" v-if="oss" :src="oss+'icon_find_action_comment.png'"></image>
				<text class="color_919397" style="font-size: 20rpx;line-height: 28rpx;">评论</text>
			</view>
			<view>
				<view class="wrapCommentList">
					<view class="commentList" v-for="(item,index) of commentList" :key="index" @tap.stop="replyPerson(item)">
						<text class="color_2F80FF">{{$isEmpty(item.createName)?'':item.createName}}</text> <text class="color_666769">回复</text>
						<text class="color_2F80FF">{{$isEmpty(item.replyName)?'':item.replyName}} :</text><text class="color_666769 text-content">{{$isEmpty(item.content)?'':item.content}}</text>
					</view>
				</view>
				<!-- <view class="" v-if="!commentList.length>0">
					<image v-if="oss" :src="oss+'pic_energy_default_wuxinxi.png'" mode="aspectFit" style="width: 100%;"></image>
				</view> -->
				<uni-load-more :status="commentStatus" v-if="commentList.length>0"></uni-load-more>
				<view class="bottom-safe" style="height: 112rpx;"></view>
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
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import {
		imageError
	}from '../../../../common/utils.js'
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				commentInfo: {},
				commentListInfo: {},
				commentList: [],
				commentStatus: "",
				id: '',
				oss: '',
				input: '',
				placeholder: '我来说两句',
				commentId: ''
			};
		},
		onLoad(options) {
			this.oss = this.$oss
			const {
				id
			} = options
			// console.log(id)
			this.id = id
			this.$http.get('qms/cooperation_comment/comment_detatils', {
				params: {
					commentId: id,
					size: 40
				}
			}).then(res => {
				this.commentListInfo=res.data.data
				this.commentList=res.data.data.records
				if (!this.commentListInfo.current < this.commentListInfo.pages) {
					this.commentStatus = 'noMore';
				}
			})
			this.$http.get('qms/cooperation_comment/select_id', {
				params: {
					id: id
				}
			}).then(res => {
				this.commentInfo = res.data.data
			})
		},
		onReachBottom() {
			// console.log(666)
			let that = this;
			if (that.commentListInfo.current < that.commentListInfo.pages) {
				// console.log(6)
				that.commentStatus = 'loading';
				that.$http.get('qms/cooperation_comment/comment_detatils', {
					params: {
						commentId: that.id,
						size: 40,
						current: that.commentListInfo.current + 1
					}
				}).then(res => {
					// console.log(res)
					that.commentListInfo.current = res.data.data.current;
					// console.log(that.joinCurrent)
					that.commentList = that.commentList.concat(res.data.data.records);
					that.commentStatus = 'more';
				});
			} else {
				that.commentStatus = 'noMore';
			}
		},
		methods: {
			imageError,
			reply(type, commentId, reReplyId, info) {
				// console.log(info)
				this.placeholder = `回复@${this.commentInfo.name}`
				this.commentId = this.commentInfo.id
				this.input = ''
				this.$refs.popup.open()
			},
			replyPerson(info) {
				// console.log(info)
				this.placeholder = `回复@${info.createName}`
				this.commentId = info.id
				this.input = ''
				this.$refs.popup.open()
			},
			sendInput() {
				let that = this
				that.$http.post('qms/cooperation_comment/reply', {
					commentId: that.commentId,
					content: that.input
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
									that.$http.get('qms/cooperation_comment/comment_detatils', {
										params: {
											commentId: that.id,
											size: 40
										}
									}).then(res => {
										// console.log(res)
										that.commentListInfo = res.data.data
										that.commentList = res.data.data.records
										if (!that.commentListInfo.current < that.commentListInfo.pages) {
											that.commentStatus = 'noMore';
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
	.bottom-safe {
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
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

	.inputDefault {
		color: #919397;
		padding: 20rpx;
		line-height: 48rpx;
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

	.commentBtn {
		padding-bottom: 30rpx;
		padding-top: 30rpx;
		display: flex;
		align-items: center;
		justify-content: flex-end;

		.commentBtnImg {
			width: 32rpx;
			height: 32rpx;
			margin-right: 8rpx;
		}
	}

	.container {
		padding:32rpx;

		.commentInfo {
			display: flex;
			justify-content: flex-start;
			align-items: flex-start;

			.commentWrap {
				margin-bottom: 26rpx;

				.avatarImg {
					width: 92rpx;
					height: 92rpx;
					border-radius: 50%;
					margin-right: 24rpx
				}

				.info {
					.name {
						font-size: 28rpx;
						line-height: 40rpx;
						margin-bottom: 20rpx;
					}

					.createTime {
						font-size: 20rpx;
						line-height: 28rpx;
					}
				}
			}
		}

		.contentDetail {
			font-size: 28rpx;
			line-height: 48rpx;
			flex: 1;
		}
	}

	.wrapCommentList {
		border-top: 0.3rpx solid #EFF0F1;
		font-size: 28rpx;
		padding-top: 28rpx;

		.commentList {
			margin-bottom: 20rpx;
			line-height: 48rpx;

			.text-content {
				margin-left: 20rpx;
			}
		}
	}
</style>
