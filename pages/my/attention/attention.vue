<template>
	<view class="page">
		<view class="title" style="background-color: #FFFFFF;margin-bottom: 16rpx;">
			<view class="title-item" @tap="soClick">
				<view :class="[{ active: isSoActive }, { unactive: !isSoActive }]">组织</view>
				<view class="title-item-bottom" v-if="isSoActive"></view>
			</view>
			<view class="title-item" @tap="cannerClick">
				<view :class="[{ active: isCanerActive }, { unactive: !isCanerActive }]">用户</view>
				<view class="title-item-bottom" v-if="isCanerActive"></view>
			</view>
		</view>
		<swiper @change="swiperChange" class="safe-bottom" style="flex: 1;background-color: #FFFFFF;" observer observerParents :current-item-id="item_id" ref="swiper">
		<swiper-item item-id="0">
			<scroll-view style="height: 100%;" :scroll-top="30" scroll-y="true" @scrolltolower="soMore">
				<view @tap="goSO(item)" @longpress="cancelAttention(item)" v-for="(item, index) in soList.records" :key="index"
				 class="canner-item">
					<image lazy-load="true" class="avatarImg" mode="aspectFill" :src="item.avatar"></image>
					<view class="color_303031" style="font-size: 28rpx; flex: 1;margin-left: 24rpx;">{{ item.name }}</view>
					<!-- <image :src="oss + 'icon_right_gray.png'" style="width: 44rpx; height: 44rpx;"></image> -->
				</view>
				<image class="emptyImg" v-if="!soList.records.length > 0&& oss " :src="oss+'pic_noAttention.png'" mode="aspectFit"></image>
				<uni-load-more :status="soStatus" v-if="soList.records.length > 0"></uni-load-more>
			</scroll-view>
		</swiper-item>
			<swiper-item item-id="1">
				<scroll-view style="height: 100%;" :scroll-top="30" scroll-y="true" @scrolltolower="cannerMore">
					<view class="canner-item" @tap="goCanner(item)" @longpress="cancelAttention(item)" v-for="(item, index) in cannerList.records"
					 :key="index">
						<image lazy-load="true" class="avatarImg" mode="aspectFill" :src="item.avatar"></image>
						<view style="flex: 1; display: flex; flex-direction: column; margin-left: 24rpx;">
							<view class="name">{{ item.realName }}</view>
							<view class="company">{{ getCompanyStation(item.company, item.position.split('-')[(item.position.split('-').length - 1)]) }}</view>
						</view>
					</view>
					<image class="emptyImg" v-if="!cannerList.records.length > 0 && oss" :src="oss+'pic_noAttention.png'" mode="aspectFit"></image>
					<uni-load-more :status="cannerStatus" v-if="cannerList.records.length > 0"></uni-load-more>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import {
		getCompanyStation,
		imageError,
		soImageError
	} from '@/common/utils.js';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				oss: '',
				cannerList: [],
				soList: [],
				cannerStatus: 'more',
				soStatus: 'more',
				magicBoxStatus: 'more',
				isCanerActive: false,
				isSoActive: true,
				item_id: 0,
				userId: ''
			};
		},
		onLoad() {
			this.oss = this.$oss;
			this.userId = uni.getStorageSync('userinfo').user_id
		},
		onShow() {
			this.$http.post('admin/follow/page', {
				size: 20,
				type: 1
			}).then(res => {
				this.cannerList = res.data.data;
				this.cannerList.records.forEach(item => {
					item.avatar = imageError(item.avatar, this.oss)
				})
				if (!(this.cannerList.current < this.cannerList.pages)) {
					this.cannerStatus = 'noMore';
				}
			});
			this.$http.post('admin/follow/page', {
				size: 20,
				type: 2
			}).then(res => {
				this.soList = res.data.data;
				this.soList.records.forEach(item => {
					item.avatar = soImageError(item.avatar, this.oss)
				})
				if (!(this.soList.current < this.soList.pages)) {
					this.soStatus = 'noMore';
				}
			});
		},
		methods: {
			cancelAttention(item) {
				let that = this
				if (that.item_id == 0) {
					uni.showModal({
						title: '提示',
						content: `你确定要取消关注"${item.realName}"吗`,
						confirmColor: "#F74437",
						success: res => {
							if (res.confirm) {
								that.$http.post('admin/follow/user', {
									userId: that.userId,
									followId: item.userId,
									sign: 1,
									type: 1
								}).then(res => {
									// console.log(res)
									if (res.data.code == 0) {
										uni.showToast({
											title: "取消关注成功",
											icon: "none",
											success: () => {
												this.$http.post('admin/follow/page', {
													size: 20,
													type: 1
												}).then(res => {
													this.cannerList = res.data.data;
													this.cannerList.records.forEach(item => {
														item.avatar = imageError(item.avatar, this.oss)
													})
													if (!(this.cannerList.current < this.cannerList.pages)) {
														this.cannerStatus = 'noMore';
													} else {
														this.cannerStatus = 'more';
													}
												});
											}
										})
									}
								})
							} else if (res.cancel) {
								// console.log('用户点击取消');
							}
						}
					});
				} else if (that.item_id == 1) {
					console.log(item)
					uni.showModal({
						title: '提示',
						content: `你确定要取消关注"${item.name}"吗`,
						confirmColor: "#F74437",
						success: res => {
							if (res.confirm) {
								that.$http.post('admin/follow/user', {
									userId: that.userId,
									followId: item.orgId,
									sign: 1,
									type: 2
								}).then(res => {
									// console.log(res)
									if (res.data.code == 0) {
										uni.showToast({
											title: "取消关注成功",
											icon: "none",
											success: () => {
												this.$http.post('admin/follow/page', {
													size: 20,
													type: 2
												}).then(res => {
													this.soList = res.data.data;
													this.soList.records.forEach(item => {
														item.avatar = soImageError(item.avatar, this.oss)
													})
													if (!(this.soList.current < this.soList.pages)) {
														this.soStatus = 'noMore';
													} else {
														this.soStatus = 'more';
													}
												});
											}
										})
									}
								})
							} else if (res.cancel) {
								// console.log('用户点击取消');
							}
						}
					});
				}
			},
			cannerMore() {
				let that = this;
				if (that.cannerList.current < that.cannerList.pages) {
					that.cannerStatus = 'loading';
					that.$http.post('admin/follow/page', {
						type: 1,
						size: 20,
						current: that.cannerList.current + 1
					}).then(res => {
						that.cannerList.current = res.data.data.current;
						res.data.data.records.forEach(item => {
							item.avatar = imageError(item.avatar, that.oss)
						})
						that.cannerList.records = that.cannerList.records.concat(res.data.data.records);
						that.cannerStatus = 'more';
					});
				} else {
					that.cannerStatus = 'noMore';
				}
			},
			soMore() {
				let that = this;
				if (that.soList.current < that.soList.pages) {
					that.soStatus = 'loading';
					that.$http.post('admin/follow/page', {
						type: 2,
						size: 20,
						current: that.soList.current + 1
					}).then(res => {
						that.soList.current = res.data.data.current;
						res.data.data.records.forEach(item => {
							item.avatar = soImageError(item.avatar, that.oss)
						})
						that.soList.records = that.soList.records.concat(res.data.data.records);
						that.soStatus = 'more';
					});
				} else {
					that.soStatus = 'noMore';
				}
			},
			getCompanyStation,
			swiperChange(e) {
				if (e.detail.current == 0) {
					this.soClick();
				} else if (e.detail.current == 1) {
					this.cannerClick();
				}
			},
			cannerClick() {
				this.isCanerActive = true;
				this.isSoActive = false;
				this.item_id = 1;
			},
			soClick() {
				this.isCanerActive = false;
				this.isSoActive = true;
				this.item_id = 0;
			},
			goCanner(item) {
				uni.navigateTo({
					url: '../../find/cannerCard/cannerCard?id=' + item.userId
				});
			},
			goSO(item) {
				uni.navigateTo({
					url: '../../find/soCard/soCard?id=' + item.orgId
				});
			},
		}
	}
</script>

<style lang="scss">
	.avatarImg{
		width: 88rpx;
		height: 88rpx;
		border-radius: 50%;
	}
	.page {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: #f5f7f8;
	}

	.title {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 88rpx;

		.title-item {
			width: 160rpx;
			text-align: center;
			height: 88rpx;
			display: flex;
			align-items: center;
			justify-content:space-between;
			flex-direction: column;

			.title-item-bottom {
				width: 20rpx;
				height: 6rpx;
				border-radius: 10rpx;
				background: linear-gradient(180deg, #FF825C 0%, #FF3636 100%);
				margin-bottom: 6rpx;
			}
		}
	}

	.canner-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-top: 32rpx;
		padding-bottom: 32rpx;
		margin: 0 32rpx;

		.name {
			color: #303031;
			font-size: 28rpx;
		}

		.company {
			font-size: 24rpx;
			margin-top: 16rpx;
			color: #919397;
		}
	}

	.active {
		color: #272727;
		font-size: 36rpx;
		font-weight: bold;
		line-height: 76rpx;
	}

	.unactive {
		color: #565B5F;
		font-size: 28rpx;
		font-weight: normal;
		line-height: 88rpx;
	}

	.swiper-item {
		display: block;
		height: 100%;
		// line-height: 300rpx;
		text-align: center;
		background-color: #f4f5f6;
	}
</style>
