<template>
	<view class="">
		<view>
			<view class="content" :class="item.isTop?'bg':''" v-for="(item,index) of notice.records" :key="index" @tap="goDetails(item)"
			 @longpress="showModal(item)">
				<view class="flexRowStart senderInfo">
					<image :src="imageError(item.senderAvatar,$oss)" class="senderAvatarImg"></image>
					<view class="" style="flex: 1;min-width: 0;">
						<view class="color_303031 singleEllipsis nameInfo">
							{{$isEmpty(item.name)?'':item.name}}
						</view>
						<view class="color_919397" style="font-size: 22rpx;line-height: 32rpx;">
							{{$isEmpty(item.time)?'':item.time.substring(5,10)}}
						</view>
					</view>
					<image v-if="oss" :src="oss+'icon_createTask_grayRight.png'" class="rightImg"></image>
				</view>
			</view>
			<uni-load-more :status="moreStatus"></uni-load-more>
			<view class="bottom-safe" style="height: 112rpx;"></view>
		</view>
		<view class="btn" v-if="adminStatus!=0">
			<view class="button freeBtn" @tap="addNotice">
				发布
			</view>
		</view>
	</view>
</template>

<script>
	import {
		imageError
	} from '@/common/utils.js';
	export default {
		data() {
			return {
				notice: {},
				moreStatus: 'true',
				orgId: '',
				oss: '',
				adminStatus: ''
			};
		},
		onLoad(options) {
			const {
				orgId,
				adminStatus
			} = options
			this.oss = this.$oss
			this.orgId = orgId
			// console.log(this.orgId)
			this.adminStatus = adminStatus
			// console.log(this.adminStatus)
		},
		onShow() {
			this.$http.get('ims/sys_msg/page', {
				params: {
					orgId: this.orgId
				}
			}).then(res => {
				console.log(res)
				this.notice = res.data.data
				if (!this.notice.current < this.notice.pages) {
					this.moreStatus = 'noMore';
				}
			})
		},
		onReachBottom() {
			let that = this
			if (that.notice.current < that.notice.pages) {
				that.moreStatus = 'loading';
				that.$http.get('ims/sys_msg/page', {
					params: {
						orgId: that.orgId,
						current: that.notice.current + 1
					}
				}).then(res => {
					that.notice.current = res.data.data.current;
					res.data.data.records.forEach(item => {
						item.senderAvatar = imageError(item.senderAvatar, that.oss)
					})
					that.notice.records = that.notice.records.concat(res.data.data.records);
					that.moreStatus = 'more';
				});
			} else {
				that.moreStatus = 'noMore';
			}
		},
		methods: {
			imageError,
			showModal(item) {
				let that = this
				let btn = ''
				let topStatus = ''
				if (item.isTop == true) {
					btn = '取消置顶'
					topStatus = false
				} else {
					btn = '置顶'
					topStatus = true
				}
				if (that.adminStatus != 0) {
					uni.showActionSheet({
						itemList: [btn, '删除'],
						success: function(res) {
							if (res.tapIndex == 0) {
								//置顶或取消置顶
								that.$http.post('ims/sys_msg/update', {
									isTop: topStatus,
									sysInfoId: item.id
								}).then(res => {
									if (res.data.code == 0) {
										that.$http.get('ims/sys_msg/page', {
											params: {
												orgId: that.orgId
											}
										}).then(res => {
											console.log(res)
											that.notice = res.data.data
											if (!that.notice.current < that.notice.pages) {
												that.moreStatus = 'noMore';
											}
										})
									} else {
										uni.showToast({
											title: res.data.message,
											icon: 'none'
										})
									}
								})
							} else {
								//删除
								that.$http.post('ims/sys_msg/delete?id=' + item.id).then(res => {
									console.log(res)
									if (res.data.code == 0) {
										that.$http.get('ims/sys_msg/page', {
											params: {
												orgId: that.orgId
											}
										}).then(res => {
											console.log(res)
											that.notice = res.data.data
											if (!that.notice.current < that.notice.pages) {
												that.moreStatus = 'noMore';
											}
										})
									} else {
										uni.showToast({
											title: res.data.message,
											icon: 'none'
										})
									}
								})
							}
						},
						fail: function(res) {
							console.log(res.errMsg);
						}
					});
				}
			},
			goDetails(item) {
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/soNotice/soNotice?orgId=${this.orgId}&adminStatus=${this.adminStatus}&id=${item.id}`
				})
			},
			addNotice() {
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/addNotice/addNotice?id=${this.orgId}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.content{
		padding: 32rpx;
		.senderInfo{
			border-bottom: 0.3rpx solid #EFF0F1;
			padding-bottom: 30rpx;
			.senderAvatarImg{
				width: 92rpx;
				height: 92rpx;
				border-radius: 50%;
				margin-right: 24rpx;
			}
			.rightImg{
				width: 44rpx;
				height: 44rpx;
				margin-right: -12rpx;
			}
			.nameInfo{
				font-size: 28rpx;
				line-height: 40rpx;
				margin-bottom: 10rpx;
				flex: 1;
				min-width: 0;
			}
		}
	}
	.bg {
		background-color: #F5f7f8;
	}

	.bottom-safe {
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}

	.btn {
		width: 100%;
		background-color: #FFFFFF;
		z-index: 666;
		position: fixed;
		bottom: 0rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

		.freeBtn {
			width: 686rpx;
			margin: 24rpx 32rpx 
		}
	}
</style>
