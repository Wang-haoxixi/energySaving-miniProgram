<template>
	<view>
		<view class="talk">
			<view class="talk-item">
				<view class="talk-item-title" @tap="goCannerCard(thoughts.userId)">
					<image class="avatar" v-if="thoughts.avatar" :src="imageError(thoughts.avatar,$oss)" mode="aspectFill"></image>
					<view class="talk-item-title-text">
						<view class="name">{{$isEmpty(thoughts.userName)?'':thoughts.userName}}</view>
						<view class="company">{{getCompanyStation(thoughts.company,thoughts.station)}}</view>
					</view>
				</view>
				<view class="talk-text">
					{{$isEmpty(thoughts.content)?'':thoughts.content}}
				</view>
				<view v-if="thoughts.images.length == 1" class="talk-imgs">
					<image mode="aspectFill" class="talk-img-single" :src="thoughts.images[0]" @tap.stop="previewImage(thoughts.images,0)"></image>
				</view>
				<view v-else class="talk-imgs">
					<image mode="aspectFill" class="talk-img" :src="item2" v-for="(item2,index2) in thoughts.images" :key="index2"
					 @tap.stop="previewImage(thoughts.images,index2)"></image>
				</view>
				<view class="attachContent" v-if="thoughts.attach" @tap.stop="goRelationDetails(thoughts)">
					<view class="flexRowStart wrapAttach" style="background-color: #F4F5F6">
						<image class="attachImg" v-if="thoughts.attach.type== 'material' && oss" :src="oss+'icon_so_material.png'"></image>
						<image class="attachImg" v-else-if="thoughts.attach.type== 'acticity' && oss" :src="oss+'icon_find_activity.png'"></image>
						<image class="attachImg" v-else-if="thoughts.attach.type=='task' && oss" :src="oss+'icon_thoughtsRelation_task.png'"></image>
						<image class="attachImg" v-else-if="thoughts.attach.type=='questionnaire' && oss" :src="oss+'icon_find_questionnaire.png'"></image>
						<image class="attachImg" v-else-if="thoughts.attach.type =='products' && oss" :src="oss+'icon_thoughtsRelation_product.png'"></image>
						<view class="attachInfo">
							<view class="color_303031 bold" v-if="thoughts.attach.type== 'material'">
								材料
							</view>
							<view class="color_303031 bold" v-else-if="thoughts.attach.type== 'acticity'">
								活动
							</view>
							<view class="color_303031 bold" v-else-if="thoughts.attach.type=='task'">
								任务
							</view>
							<view class="color_303031 bold" v-else-if="thoughts.attach.type=='questionnaire'">
								问卷
							</view>
							<view class="color_303031 bold" v-else-if="thoughts.attach.type =='products' ">
								魔方
							</view>
							<view class="singleEllipsis color_666769 attachTitle">
								{{thoughts.attach.title}}
							</view>
						</view>
					</view>
				</view>
				<view class="reply" v-if="!isEmpty(thoughts.transmittedThoughts)" @tap="goThoughts(thoughts.transmittedThoughts.thoughtsId)">
					<view class="talk-item-title" @tap="goCannerCard(thoughts.transmittedThoughts.userId)">
						<image class="avatar" v-if="thoughts.transmittedThoughts.avatar" :src="imageError(thoughts.transmittedThoughts.avatar,$oss)"></image>
						<view class="talk-item-title-text">
							<view class="name">{{$isEmpty(transmittedThoughts.userName)?'':transmittedThoughts.userName}}</view>
						</view>
					</view>
					<view class="talk-text">
						{{$isEmpty(transmittedThoughts.content)?'':transmittedThoughts.content}}
					</view>
					<view v-if="thoughts.transmittedThoughts.images.length == 1" class="talk-imgs">
						<image mode="aspectFill" class="talk-img-single" :src="thoughts.transmittedThoughts.images[0]" @tap.stop="previewImage(item.transmittedThoughts.images,0)"></image>
					</view>
					<view v-else class="talk-imgs">
						<image mode="aspectFill" class="talk-img" :src="item2" v-for="(item2,index2) in thoughts.transmittedThoughts.images"
						 :key="index2" @tap.stop="previewImage(thoughts.transmittedThoughts.images,index2)"></image>
					</view>
					<view class="attachContent" v-if="thoughts.transmittedThoughts.attach" @tap.stop="goRelationDetails(thoughts.transmittedThoughts)">
						<view class="flexRowStart wrapAttach" style="background-color: #FFFFFF;">
							<image class="attachImg" v-if="thoughts.transmittedThoughts.attach.type== 'material' && oss" :src="oss+'icon_so_material.png'"></image>
							<image class="attachImg" v-else-if="thoughts.transmittedThoughts.attach.type== 'acticity' && oss" :src="oss+'icon_find_activity.png'"></image>
							<image class="attachImg" v-else-if="thoughts.transmittedThoughts.attach.type=='task' && oss" :src="oss+'icon_thoughtsRelation_task.png'"></image>
							<image class="attachImg" v-else-if="thoughts.transmittedThoughts.attach.type=='questionnaire' && oss" :src="oss+'icon_find_questionnaire.png'"></image>
							<image class="attachImg" v-else-if="thoughts.transmittedThoughts.attach.type =='products' && oss" :src="oss+'icon_thoughtsRelation_product.png'"></image>
							<view class="attachInfo">
								<view class="color_303031 bold" v-if="thoughts.transmittedThoughts.attach.type== 'material'">
									材料
								</view>
								<view class="color_303031 bold" v-else-if="thoughts.transmittedThoughts.attach.type== 'acticity'">
									活动
								</view>
								<view class="color_303031 bold" v-else-if="thoughts.transmittedThoughts.attach.type=='task'">
									任务
								</view>
								<view class="color_303031 bold" v-else-if="thoughts.transmittedThoughts.attach.type=='questionnaire'">
									问卷
								</view>
								<view class="color_303031 bold" v-else-if="thoughts.transmittedThoughts.attach.type =='products' ">
									魔方
								</view>
								<view class="singleEllipsis color_666769 attachTitle">
									{{thoughts.transmittedThoughts.attach.title}}
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="talk-end">
					<view>{{$isEmpty(thoughts.createTime)?'':thoughts.createTime.substring(0,16)}}</view>
					<view class="center">
						<view class="center" v-if="isEmpty(thoughts.transmittedThoughts)" @tap="commentsOpen('forward',0,0)">
							<image v-if="oss" class="talk-icon" :src="oss+'thought_share.png'"></image>
							<view class="talk-end-text">{{$isEmpty(thoughts.transmittedTimes)?'0':thoughts.transmittedTimes}}</view>
						</view>
						<view class="center" @tap="commentsOpen('thoughts',commentId,0)">
							<image v-if="oss" class="talk-icon" :src="oss+'thought_comment.png'"></image>
							<view class="talk-end-text">{{$isEmpty(thoughts.commentNum)?'0':thoughts.commentNum}}</view>
						</view>
						<view v-if="thoughts.praiseStatus == 1" class="center" @tap.stop="addThumbsUp(thoughts)">
							<image v-if="oss" class="talk-icon" :src="oss+'thought_praise.png'"></image>
							<view class="talk-end-text">{{$isEmpty(thoughts.thumbsUpCount)?'0':thoughts.thumbsUpCount}}</view>
						</view>
						<view v-if="thoughts.praiseStatus == 0" class="center" @tap.stop="addThumbsUp(thoughts)">
							<image v-if="oss" class="talk-icon" :src="oss+'thought_unPraise.png'"></image>
							<view class="talk-end-text">{{$isEmpty(thoughts.thumbsUpCount)?'0':thoughts.thumbsUpCount}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="thumbsUp-item">
			<view class="thumbsUp-item-text" @tap="goLikeList">{{$isEmpty(thoughts.thumbsUpCount)?'无':thoughts.thumbsUpCount}}人点赞</view>
			<image v-if="oss" class="thumbsUp-item-right" :src="oss+'icon_right_gray.png'"></image>
		</view>
		<view class="splitLine"></view>
		<view class="thumbsUp-item">
			<view class="thumbsUp-item-text bold" style="color: #303031;">{{$isEmpty(thoughts.commentNum) || thoughts.commentNum== 0?'暂无':thoughts.commentNum+'条'}}评论</view>
		</view>
		<view class="reply-item" v-for="(item,index) in comments.records" :key="index">
			<image class="reply-item-avatar" mode="aspectFill" :src="imageError(item.avatar,$oss)" @tap="goCannerCard(item.commentUserId)"></image>
			<view class="reply-item-right">
				<view class="name" @tap="goCannerCard(item.commentUserId)">{{$isEmpty(item.realName)?'':item.realName}}</view>
				<view class="content">{{$isEmpty(item.replyMsg)?'':item.replyMsg}}</view>
				<view class="reply-time">
					<view>{{$isEmpty(item.createTime)?'':item.createTime.substring(0,16)}}</view>
					<view class="reply-time-icon" @tap="commentsOpen('thoughts_reply',item.commentId,0,item.realName)">
						<image v-if="oss" class="icon" :src="oss+'icon_find_action_comment.png'"></image>
						<view class="text">评论</view>
					</view>
				</view>
				<view class="thoughtsReply" v-if="item.thoughtsReplyAppPage.records.length>0">
					<view v-for="(item2,index2) in item.thoughtsReplyAppPage.records" :key="index2" class="thoughtsReply-item" @tap="commentsOpen('thoughts_reply_user',item.commentId,item2.replyId,item2.realName)">
						<text class="color_2F80FF" @tap.stop="goCannerCard(item2.userId)">{{$isEmpty(item2.realName)?'':item2.realName}}</text>回复<text
						 class="color_2F80FF" @tap.stop="goCannerCard(item2.repliedUserId)">{{ $isEmpty(item2.replyTo)?'':item2.replyTo }}</text>：{{ $isEmpty(item2.replyMsg)?'':item2.replyMsg}}
					</view>
					<view class="thoughtsReply-item" style="display: flex;justify-content: flex-end;" v-if="item.thoughtsReplyAppPage.total > item.thoughtsReplyAppPage.records.length"
					 @tap="commentDetail(item.commentId,index)">
						<text class="color_2F80FF">查看全部{{item.thoughtsReplyAppPage.total}}条回复 > </text>
					</view>
				</view>
			</view>
		</view>
		<view class="bottom">
			<view style="background-color: #F4F5F6;font-size: 28rpx;padding: 16rpx 30rpx;color: #BABEC0;border-radius: 20rpx;line-height: 40rpx;margin: 0 30rpx;"
			 @tap="commentsOpen('thoughts',commentId,0,0)">
				我也来说两句
			</view>
		</view>
		<view style="height: 152rpx">

		</view>
		<uni-popup ref="popup" type="bottom">
			<view class="popup_input">
				<textarea :placeholder="placeholder" placeholder-class="inputDefault" v-model="input" fixed="true" show-confirm-bar="false"
				 cursor-spacing="80"></textarea>
				<view v-if="input.length>0" style="margin-left: 20rpx;color: #F74437;" @tap="sendInput">发送</view>
				<view v-else style="margin-left: 20rpx;color: #F7443780;">发送</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		getCompanyStation,
		isEmpty,
		previewImage,
		goCannerCard,
		goThoughts,
		imageError
	} from '@/common/utils.js';
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	export default {
		components: {
			uniPopup,
		},
		data() {
			return {
				thoughts: '',
				transmittedThoughts: '',
				comments: '',
				input: '',
				placeholder: '请输入评论内容',
				inputType: 'thoughts',
				commentId: 0,
				reReplyId: 0,
				oss: ''
			};
		},
		methods: {
			addThumbsUp(item) {
				this.$http.get('dms/app/add_thumbs_up/' + item.thoughtsId).then(res => {
					if (res.data.data == true) {
						if (item.praiseStatus == 0) {
							item.praiseStatus = 1;
							item.thumbsUpCount++
						} else if (item.praiseStatus == 1) {
							item.praiseStatus = 0;
							item.thumbsUpCount--
						}

					}
				});
			},
			sendInput() {
				if (this.inputType == 'thoughts_reply') {
					this.$http.post('dms/thoughts_reply/create', {
						commentId: this.commentId,
						replyMsg: this.input,
						thoughtsId: this.thoughts.thoughtsId
					}).then(res => {
						this.$refs.popup.close();
						if (res.data.code == 1) {
							uni.showToast({
								icon: 'none',
								title: res.data.message
							})
						} else {
							this.refresh();
						}
					});
				} else if (this.inputType == 'thoughts_reply_user') {
					this.$http.post('dms/thoughts_reply/create', {
						commentId: this.commentId,
						reReplyId: this.reReplyId,
						replyMsg: this.input,
						thoughtsId: this.thoughts.thoughtsId
					}).then(res => {
						this.$refs.popup.close();
						if (res.data.code == 1) {
							uni.showToast({
								icon: 'none',
								title: res.data.message
							})
						} else {
							this.refresh();
						}
					});
				} else if (this.inputType == 'thoughts') {
					this.$http.post('dms/thoughts_comment/mobile_create', {
						replyMsg: this.input,
						thoughtsId: this.thoughts.thoughtsId
					}).then(res => {
						this.$refs.popup.close();
						console.log(res)
						if (res.data.code == 1) {
							uni.showToast({
								icon: 'none',
								title: res.data.message
							})
						} else {
							this.refresh();
						}
					});
				} else if (this.inputType == 'forward') {
					this.$http.post('dms/thoughts/create', {
						content: this.input,
						transmitId: this.thoughts.thoughtsId,
						status: 0
					}).then(res => {
						this.$refs.popup.close();
						if (res.data.code == 1) {
							uni.showToast({
								icon: 'none',
								title: res.data.message
							})
						} else {
							this.refresh();
							uni.showToast({
								title: "分享成功",
								icon: "success",
								duration: 1000
							});
						}
					});
				}
			},
			commentsOpen(type, commentId, reReplyId, userName) {
				// console.log(userName)
				if (type == 'thoughts') {
					this.placeholder = '请输入评论内容';
				} else if (type == 'thoughts_reply') {
					this.placeholder = '回复@' + userName;
				} else if (type == 'thoughts_reply_user') {
					this.placeholder = '回复@' + userName;
				} else if (type == 'forward') {
					this.placeholder = '请输入分享内容';
				}
				this.inputType = type;
				this.commentId = commentId;
				this.reReplyId = reReplyId;
				this.$refs.popup.open()
			},
			refresh() {
				this.input = ''
				this.$http.get('dms/thoughts/' + this.thoughts.thoughtsId).then(res => {
					this.thoughts = res.data.data;
					if (this.$isEmpty(this.thoughts.transmittedThoughts)) {
						this.thoughts.transmittedThoughts = '';
					} else {
						this.transmittedThoughts = this.thoughts.transmittedThoughts;
					}
				});
				this.$http.get('dms/app/get_comments', {
					params: {
						thoughtsId: this.thoughts.thoughtsId
					}
				}, ).then(res => {
					this.comments = res.data.data
				});
			},
			commentDetail(commentId, index) {
				this.$http.get('dms/app/thoughts_reply/page', {
					params: {
						commentId: commentId,
						size: 9999
					}
				}).then(res => {
					this.comments.records[index].thoughtsReplyAppPage = res.data.data;
				});
			},
			goLikeList() {
				if (this.thoughts.thumbsUpCount > 0) {
					uni.navigateTo({
						url: 'likeList/likeList?id=' + this.thoughts.thoughtsId
					})
				}
			},
			goRelationDetails(item){
				if(item.attach.type=='activity'){
					uni.navigateTo({
						url:`/pages/contacts/soWorkbench/soInfo/soActivity/soActivityDetails/soActivityDetails?id=${item.attach.relationId}`
					})
				}else if(item.attach.type=='questionnaire'){
					uni.navigateTo({
						url:`/pages/contacts/soWorkbench/soInfo/soQuestionnaire/questionnaireDetails/questionnaireDetails?id=${item.attach.relationId}`
					})
				}else if(item.attach.type=='material'){
					uni.navigateTo({
						url:`/pages/contacts/soWorkbench/soInfo/soMaterial/materialKind/materialDetails/materialDetails?id=${item.attach.relationId}`
					})
				}else if(item.attach.type=='products'){
					uni.navigateTo({
						url:`/pages/find/magicBox/detail/detail?id=${item.attach.relationId}`
					})
				}else if(item.attach.type=='task'){
					uni.navigateTo({
						url:`/pages/ican/taskDetail/taskDetail?taskId=${item.attach.relationId}`
					})
				}
			},
			getCompanyStation,
			isEmpty,
			goCannerCard,
			goThoughts,
			previewImage,
			imageError
		},
		onLoad(option) {
			this.oss = this.$oss
			this.$http.get('dms/thoughts/' + option.id).then(res => {
				this.thoughts = res.data.data;
				if (this.$isEmpty(this.thoughts.transmittedThoughts)) {
					this.thoughts.transmittedThoughts = '';
				} else {
					this.transmittedThoughts = this.thoughts.transmittedThoughts;
				}
			});
			this.$http.get('dms/app/get_comments', {
				params: {
					thoughtsId: option.id
				}
			}, ).then(res => {
				this.comments = res.data.data
			});
		}
	}
</script>

<style lang="scss">
	.bottom {
		height: 112rpx;
		bottom: 0;
		position: fixed;
		background-color: #FFFFFF;
		width: 100vw;
		display: flex;
		flex-direction: column;
		justify-content: center;
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

	.reply-item {
		display: flex;
		padding: 32rpx;

		.reply-item-avatar {
			height: 92rpx;
			width: 92rpx;
			border-radius: 50%;
		}

		.reply-item-right {
			margin-left: 24rpx;
			flex: 1;
		}

		.name {
			color: #303031;
			font-size: 28rpx;
			line-height: 40rpx;
			font-weight: bold;
		}

		.content {
			margin-top: 20rpx;
			color: #666769;
			line-height: 40rpx;
			font-size: 28rpx;
		}

		.reply-time {
			font-size: 20rpx;
			color: #BABEC0;
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 30rpx;

			.reply-time-icon {
				color: #919397;
				display: flex;
				align-items: center;

				.icon {
					height: 28rpx;
					width: 28rpx;
				}

				.text {
					margin-left: 8rpx;
				}
			}
		}

		.thoughtsReply {
			word-break: break-all;
			margin-top: 40rpx;
			padding: 0 20rpx 20rpx;
			background-color: #F4F5F6;
			border-radius: 20rpx;

			.thoughtsReply-item {
				padding-top: 20rpx;
				color: #666769;
				font-size: 28rpx;
				line-height: 48rpx;
				
			}
		}

	}

	.reply {
		margin-top: 30rpx;
		background-color: #F4F5F6;
		padding: 30rpx 0;
	}

	.splitLine {
		height: 0.3rpx;
		background-color: #EFF0F1;
		text-align: center;
		width: 670rpx;
		margin-left: 40rpx;
	}

	.center {
		display: flex;
		justify-content: center;
	}

	.talk {
		padding-top: 32rpx;

		.talk-item {
			// margin-top: 40rpx;

			.talk-item-title {
				padding: 0 32rpx;
				display: flex;
				align-items: center;

				.avatar {
					width: 92rpx;
					height: 92rpx;
					border-radius: 50%;
				}

				.talk-item-title-text {
					margin-left: 24rpx;

					.name {
						color: #303031;
						font-size: 28rpx;
						line-height: 38rpx;
						font-weight: bold;
					}

					.company {
						margin-top: 10rpx;
						color: #919397;
						font-size: 22rpx;
						line-height: 32rpx;
					}
				}

			}

			.talk-text {
				padding: 0 40rpx 0 20rpx;
				margin-left: 20rpx;
				margin-top: 30rpx;
				color: #303031;
				font-size: 28rpx;
				line-height: 48rpx;
			}

			.talk-imgs {
				padding-left: 40rpx;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;

				.talk-img {
					margin-top: 30rpx;
					margin-right: 29rpx;
					width: 204rpx;
					height: 204rpx;
					border-radius: 20rpx;
				}

				.talk-img-single {
					margin-top: 30rpx;
					width: 460rpx;
					height: 616rpx;
					border-radius: 20rpx;
				}
			}

			.talk-end {
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 0.3rpx solid #EFF0F1;
				margin: 0 40rpx;
				font-size: 26rpx;
				color: #565B5F;
				line-height: 36rpx;

				.talk-icon {
					margin-left: 60rpx;
					padding: 40rpx 0;
					height: 44rpx;
					width: 44rpx;
				}

				.talk-end-text {
					margin-left: 10rpx;
					padding: 40rpx 0;
				}
			}
		}
	}

	.thumbsUp-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 88rpx;
		margin-left: 40rpx;
		margin-right: 24rpx;

		.thumbsUp-item-text {
			color: #919397;
			font-size: 28rpx;
			line-height: 40rpx;
			flex: 1;
		}

		.thumbsUp-item-right {
			height: 44rpx;
			width: 44rpx;
		}
	}
	.attachContent{
		margin-top: 30rpx;
		.wrapAttach{
			margin: 0 40rpx; 
			padding: 34rpx 40rpx 30rpx 30rpx;
			border-radius: 30rpx;
			.attachImg{
				width:76rpx;
				height: 76rpx;
			}
			.attachInfo{
				margin-left: 20rpx;
				flex: 1;
				min-width: 0;
				font-size: 28rpx;
				line-height: 40rpx;
				.attachTitle{
					margin-top: 10rpx;
					font-size: 24rpx;
					line-height: 34rpx;
				}
			}
		}
	}
</style>
