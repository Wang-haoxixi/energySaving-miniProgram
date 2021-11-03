<template>
	<scroll-view style="height: 100vh;" scroll-y="true" @scrolltolower="more">
		<view class="title">TA也在用我能</view>
		<scroll-view class="recommend" scroll-x="true">
			<view class="recommend-item" v-for="(item,index) in recommend" :key="index" @tap="goCannerCard(item)">
				<image lazy-load="true" :src="item.avatar" mode="aspectFill" class="avatar"></image>
				<view class="center">
					<view class="name singleEllipsis">{{ $isEmpty(item.realName)?'':item.realName }}</view>
				</view>
				<view class="center">
					<view class="company singleEllipsis">{{getCompanyStation(item.company,item.station)}}</view>
				</view>
				<view class="center">
					<view class="attention" @tap.stop="attention(item,index)">+关注</view>
				</view>
			</view>
		</scroll-view>
		<view class="talk">
			<view class="talk-item" v-for="(item,index) in talk.records" :key="index" @tap="detail(item)">
				<view class="talk-item-title" @tap.stop="goCannerCard(item)">
					<image lazy-load="true" class="avatar" :src="item.avatar" mode="aspectFill"></image>
					<view class="talk-item-title-text">
						<view class="name">{{ $isEmpty(item.userName)?'':item.userName }}</view>
						<view class="company">{{getCompanyStation(item.company,item.station)}}</view>
					</view>
				</view>
				<view class="talk-text ellipsis">
					{{ $isEmpty(item.content)?'':item.content }}
				</view>
				<view v-if="item.images.length == 1" class="talk-imgs">
					<image lazy-load="true" mode="aspectFill" class="talk-img-single" :src="item.images[0]" @tap.stop="previewImage(item.images,0)"></image>
				</view>
				<view v-else class="talk-imgs">
					<image lazy-load="true" mode="aspectFill" class="talk-img" :src="item2" v-for="(item2,index2) in item.images" :key="index2"
					 @tap.stop="previewImage(item.images,index2)"></image>
				</view>
				<view class="reply" v-if="!isEmpty(item.transmittedThoughts)">
					<view class="talk-item-title" @tap.stop="goCannerCard(item.transmittedThoughts)">
						<image lazy-load="true" class="avatar" :src="item.transmittedThoughts.avatar"></image>
						<view class="talk-item-title-text">
							<view class="name">{{ item.transmittedThoughts.userName}}</view>
						</view>
					</view>
					<view class="talk-text ellipsis">
						{{item.transmittedThoughts.content}}
					</view>
					<view v-if="item.transmittedThoughts.images.length == 1" class="talk-imgs">
						<image lazy-load="true" mode="aspectFill" class="talk-img-single" :src="item.transmittedThoughts.images[0]" @tap.stop="previewImage(item.transmittedThoughts.images,0)"></image>
					</view>
					<view v-else class="talk-imgs">
						<image lazy-load="true" mode="aspectFill" class="talk-img" :src="item2" v-for="(item2,index2) in item.transmittedThoughts.images"
						 :key="index2" @tap.stop="previewImage(item.transmittedThoughts.images,index2)"></image>
					</view>
				</view>
				<view class="talk-end">
					<view>{{$isEmpty(item.createTime)?'':item.createTime.substring(0,16)}}</view>
					<view class="center">
						<view class="center" v-if="isEmpty(item.transmittedThoughts)">
							<image v-if="oss" class="talk-icon" :src="oss+'thought_share.png'"></image>
							<view class="talk-end-text">{{ $isEmpty(item.transmittedTimes)?'0':item.transmittedTimes}}</view>
						</view>
						<view class="center">
							<image v-if="oss" class="talk-icon" :src="oss+'thought_comment.png'"></image>
							<view class="talk-end-text">{{ $isEmpty(item.commentNum)?'0':item.commentNum}}</view>
						</view>
						<view class="center" @tap.stop="addThumbsUp(item)">
							<image v-if="oss && item.praiseStatus == 1" class="talk-icon" :src="oss+'thought_praise.png'"></image>
							<image v-if="oss && item.praiseStatus == 0" class="talk-icon" :src="oss+'thought_unPraise.png'"></image>
							<view class="talk-end-text">{{ $isEmpty(item.thumbsUpCount)?0:item.thumbsUpCount}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<uni-load-more :status="moreStatus"></uni-load-more>
		<view class="addImg" @tap="addThoughts">
			<image class="img" v-if="oss" :src="oss+'icon_find_attention_add.png'"></image>
		</view>
		<uni-popup ref="popup" type="bottom">
			<view class="popup_input">
				<textarea :placeholder="placeholder" placeholder-class="inputDefault" v-model="input" fixed="true" show-confirm-bar="false"
				 cursor-spacing="80"></textarea>
				<view v-if="input.length>0" style="margin-left: 20rpx;color: #F74437;" @tap="sendInput">发送</view>
				<view v-else style="margin-left: 20rpx;color: #F7443780;">发送</view>
			</view>
		</uni-popup>
	</scroll-view>
</template>

<script>
	import {
		getCompanyStation,
		isEmpty,
		previewImage,
		imageError
	} from '@/common/utils.js';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	export default {
		components: {
			uniPopup,
		},
		data() {
			return {
				recommend: [],
				talk: '',
				moreStatus: 'more',
				input: '',
				placeholder: '请输入分享内容',
				inputType: 'forward',
				thoughtsId: '',
				commentId: 0,
				reReplyId: 0,
				oss: ''
			};
		},
		methods: {
			sendInput() {
				if (this.inputType == 'forward') {
					this.$http.post('dms/thoughts/create', {
						content: this.input,
						transmitId: this.thoughtsId,
						status: 0
					}).then(res => {
						this.$refs.popup.close();
						this.refresh();
					});
				}
			},
			refresh() {
				this.input = ''
				this.$http.get('dms/thoughts/follow_page', {
					params: {
						current: 1,
						size: 20,
					}
				}).then(res => {
					this.talk = res.data.data;
					uni.showToast({
						title: "分享成功",
						icon: "none",
						duration: 1000
					})
					uni.pageScrollTo({
						scrollTop: 0,
						duration: 300
					});
				});
			},
			commentsOpen(type, commentId, reReplyId, item) {
				// console.log(userName)
				// this.placeholder = '请输入分享内容';
				// this.inputType = type;
				// this.commentId = commentId;
				// this.reReplyId = reReplyId;
				this.thoughtsId = item.thoughtsId
				this.$refs.popup.open()
			},
			addThoughts() {
				uni.navigateTo({
					url: 'addThoughts/addThoughts'
				})
			},
			attention(item, index) {
				this.$http.post('admin/follow/user', {
					userId: uni.getStorageSync('userinfo').user_id,
					followId: item.userId,
					type: 1,
					sign: 0,
				}).then(res => {
					if (res.data.data == true) {
						this.recommend.splice(index, 1);
						if (this.recommend.length == 0) {
							this.$http.get('admin/follow/recommend').then(res => {
								this.recommend = res.data.data;
								this.recommend.forEach(item => {
									item.avatar=imageError(item.avatar, this.oss)
								})
							});
						}
					}
				});
			},
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
			detail(item) {
				uni.navigateTo({
					url: 'detail/detail?id=' + item.thoughtsId
				})
			},
			previewImage,
			goCannerCard(item) {
				// console.log(item)
				uni.navigateTo({
					url: '../cannerCard/cannerCard?id=' + item.userId
				})
			},
			more() {
				let that = this;
				if (that.talk.current < that.talk.pages) {
					that.moreStatus = 'loading';
					that.$http.get('dms/thoughts/follow_page', {
						params: {
							current: that.talk.current + 1,
							size: 20,
						}
					}).then(res => {
						that.talk.current = res.data.data.current;
						that.talk.records = that.talk.records.concat(res.data.data.records);
						that.moreStatus = 'more';
					});
				} else {
					that.moreStatus = 'noMore';
				}
			},
			getCompanyStation,
			isEmpty
		},
		onLoad() {
			this.oss = this.$oss
			this.$http.get('admin/follow/recommend').then(res => {
				this.recommend = res.data.data;
				this.recommend.forEach(item => {
					imageError(item.avatar, this.oss)
				})
			});
		},
		onShow() {
			this.$http.get('dms/thoughts/follow_page', {
				params: {
					current: 1,
					size: 20,
				}
			}).then(res => {
				// console.log(res)
				this.talk = res.data.data;
				if (this.talk.current == this.talk.pages) {
					this.moreStatus = 'noMore';
				} else if (this.talk.pages == 0) {
					this.moreStatus = 'noMore';
				}
			});
		}
	}
</script>

<style lang="scss">
	.ellipsis {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
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

	.reply {
		background-color: #F4F5F6;
		padding: 40rpx 0;
	}

	.center {
		display: flex;
		justify-content: center;
	}

	.title {
		padding-top: 40rpx;
		font-size: 28rpx;
		color: #666769;
		line-height: 40rpx;
		margin-left: 40rpx;
	}

	.recommend {
		margin-top: 40rpx;
		margin-left: 40rpx;
		white-space: nowrap;
		width: 100%;
		// width: 100%;

		.recommend-item {
			display: inline-block;
			margin-right: 30rpx;
			height: 340rpx;
			text-align: center;
			background-color: #F4F5F6;
			border-radius: 30rpx;

			.avatar {
				margin: 30rpx 70rpx 0;
				width: 100rpx;
				height: 100rpx;
				border-radius: 30rpx;
			}

			.name {
				width: 200rpx;
				margin-top: 20rpx;
				color: #303031;
				font-size: 28rpx;
				line-height: 38rpx;
			}

			.company {
				width: 200rpx;
				color: #919397;
				line-height: 28rpx;
				margin-top: 22rpx;
				font-size: 20rpx;
			}

			.attention {
				margin-top: 30rpx;
				font-size: 24rpx;
				color: #F74437;
				line-height: 32rpx;
				padding: 5rpx 10rpx;
				background-color: #f744371A;
				border-radius: 10rpx;
			}
		}
	}

	.talk {
		padding: 20rpx 0;

		.talk-item {
			margin-top: 40rpx;

			.talk-item-title {
				padding: 0 40rpx;
				display: flex;
				align-items: center;

				.avatar {
					width: 76rpx;
					height: 76rpx;
					border-radius: 20rpx;
				}

				.talk-item-title-text {
					margin-left: 20rpx;

					.name {
						color: #303031;
						font-size: 28rpx;
						line-height: 38rpx;
					}

					.company {
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
				margin-top: 4rpx;
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

	.addImg {
		position: fixed;
		bottom: 170rpx;
		right: 6rpx;

		.img {
			height: 152rpx;
			width: 152rpx;
		}
	}
</style>
