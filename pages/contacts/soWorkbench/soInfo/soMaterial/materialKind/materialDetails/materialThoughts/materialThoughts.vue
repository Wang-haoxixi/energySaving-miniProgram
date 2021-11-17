<template>
	<view>
		<view class="container">
			<view class="color_303031 bold" style="font-size: 28rpx;line-height: 40rpx;">
				{{$isEmpty(commentInfo.total)?'0':commentInfo.total}}条评论
			</view>
			<view class="" v-for="(item,index) of commentInfo.records" :key="index">
				<view class="flexRowStart" style="align-items: flex-start;padding: 32rpx 0rpx 0rpx;">
					<image v-if="item.avatar" :src="imageError(item.avatar,$oss)" class="avatarImg" style="margin-right: 24rpx;" @tap.stop="goCannerCard(item)"></image>
					<image v-else src="https://woneng-oss.oss-cn-hangzhou.aliyuncs.com/wxapp/moduleStore/default_personAvatar.png" class="avatarImg" style="margin-right: 24rpx;" @tap.stop="goCannerCard(item)"></image>
					<view class="" style="flex: 1;padding-bottom: 32rpx;border-bottom: 2rpx solid #EFF0F1;">
						<view class="color_303031" style="font-size: 28rpx;line-height: 40rpx;margin-bottom:20rpx;">
							{{$isEmpty(item.realName)?'':item.realName}}
						</view>
						<view class="color_666769" style="font-size: 28rpx;line-height: 40rpx;margin-bottom: 30rpx;">
							{{$isEmpty(item.content)?'':item.content}}
						</view>
						<view class="flexRow color_BABEC0" style="font-size: 24rpx;line-height: 34rpx;">
							<view class="">
								{{$isEmpty(item.createTime)?'': item.createTime.substring(0,16)}}
							</view>
							<view class="flexRowStart">
								<view class="flexRowStart" @tap="changePraiseStatus(item)">
									<image v-if="oss && item.praiseStatus == 0" :src="oss+'icon_energy_attention_dianzan.png'" style="width: 30rpx;height: 30rpx;margin-right: 14rpx;"></image>
									<image v-if="oss && item.praiseStatus == 1" :src="oss+'icon_energy_attention_dianzan_selected.png'" style="width: 30rpx;height: 30rpx;margin-right: 14rpx;"></image>
									<view class="">
										{{$isEmpty(item.likes)?'0':item.likes}}
									</view>
								</view>
								<view class="flexRowStart" style="margin-left: 62rpx;" @tap='goReplyDetails(item)'>
									<image v-if="oss" :src="oss+'icon_find_action_comment.png'" style="width: 28rpx;height: 24rpx;margin-right: 10rpx;"></image>
									<view class="color_919397" style="font-size: 20rpx;line-height: 28rpx;">
										{{$isEmpty(item.times)?'0':item.times}}
									</view>
								</view>
							</view>
						</view>
						<view v-if="item.status" class="" style="background-color: #F4F5F6;border-radius: 20rpx;">

						</view>
					</view>
				</view>
			</view>
			<image class="emptyImg" v-if="!commentInfo.records.length > 0 && oss" :src="oss+'pic_energy_default_wuxinxi.png'" mode="aspectFit"></image>
			<uni-load-more :status="commentStatus" v-if="commentInfo.records.length>0"></uni-load-more>
			<view class="bottom-safe" style="height: 112rpx;"></view>
		</view>
		<view class="btns">
			<view class="flexRow wrapBtn" @tap="comment">
				<input type="text" value="" placeholder="我也来说两句" placeholder-style="color:#BABEC0;font-size:28rpx;line-height:40rpx;"
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
				id: '',
				oss: '',
				commentInfo: {},
				commentStatus: 'more',
				placeholder: '',
				input: '',
				commentId: ''
			};
		},
		onLoad(options) {
			const {
				id
			} = options
			this.oss = this.$oss
			this.id = id
			this.$http.get('dms/common_comment/page', {
				params: {
					category: 'material',
					dataId: this.id
				}
			}).then(res => {
				// console.log(res)
				this.commentInfo = res.data.data
				if (!(this.commentInfo.pages > this.commentInfo.current)) {
					this.commentStatus = 'noMore'
				}
			})
		},
		computed: {
			total() {
				//先判断不为空，否则会报错
				if (!this.$isEmpty(this.commentInfo.records)) {
					return this.commentInfo.records.length
				} else {
					return 0
				}
			}
		},
		onReachBottom() {
			let that = this
			if (that.commentInfo.current < that.commentInfo.pages) {
				that.commentStatus = 'loading'
				that.$http.get('dms/common_comment/page', {
					params: {
						category: 'material',
						dataId: that.id,
						current: that.commentInfo.current + 1
					}
				}).then(res => {
					that.commentInfo.current = res.data.data.current
					that.commentInfo.records = that.commentInfo.records.concat(res.data.data.records);
					that.commentStatus = 'more';
				})
			} else {
				that.commentStatus = 'noMore'
			}
		},
		methods: {
			imageError,
			goReplyDetails(item) {
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/soInfo/soMaterial/materialKind/materialDetails/materialThoughts/materialReply/materialReply?commentId=${item.commentId}&realName=${item.realName}&dataId=${item.dataId}`
				})
			},
			goCannerCard(item) {
				uni.navigateTo({
					url: `/pages/find/cannerCard/cannerCard?id=${item.createBy}`
				})
			},
			comment() {
				this.input = ''
				this.placeholder = '我来说两句'
				this.$refs.popup.open()
			},
			reply(item) {
				this.input = ''
				this.placeholder = `回复@${item.realName}`
				this.commentId = item.commentId
				this.$refs.popup.open()
			},
			sendInput() {
				let that = this
				if (that.placeholder == "我来说两句") {
					that.$http.post('dms/common_comment/create', {
						category: 'material',
						content: that.input,
						dataId: that.id
					}).then(res => {
						// console.log(res)
						if (res.data.code == 0) {
							uni.showToast({
								title: "评论成功",
								icon: "success",
								duration: 1000,
								success: () => {
									setTimeout(() => {
										that.input = ''
										that.$refs.popup.close()
										that.$http.get('dms/common_comment/page', {
											params: {
												category: 'material',
												dataId: that.id
											}
										}).then(res => {
											// console.log(res)
											that.commentInfo = res.data.data
											if (!(that.commentInfo.pages > that.commentInfo.current)) {
												that.commentStatus = 'noMore'
											}
										})
									}, 1000)
								}
							})
						}
					})
				} else if (this.placeholder.includes('回复')) {
					that.$http.post('dms/common_comment/create', {
						dataId: that.id,
						content: that.input,
						category: "material",
						parentId: that.commentId
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
										that.$http.get('dms/common_comment/page', {
											params: {
												category: 'material',
												dataId: that.id
											}
										}).then(res => {
											// console.log(res)
											that.commentInfo = res.data.data
											if (!(that.commentInfo.pages > that.commentInfo.current)) {
												that.commentStatus = 'noMore';
											}
										})
									}, 1000)
								}
							})
						}
					})
				}
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
			}
		}
	}
</script>

<style lang="scss">
	.avatarImg{
		width: 92rpx;
		height: 92rpx;
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
