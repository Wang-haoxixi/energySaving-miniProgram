<template>
	<view class="recruit-detail">
		<view id="so-recruit-detail-top" class="wrap-title">
			<view class="title-item" :class="[titleType == 'all' ? 'active' : '']" @tap="typeChange('all')">全部</view>
			<view class="title-item" :class="[titleType == '1' ? 'active' : '']" @tap="typeChange('1')" style="margin-left: 42rpx">已查看</view>
			<view class="title-item" :class="[titleType == '0' ? 'active' : '']" @tap="typeChange('0')" style="margin-left: 42rpx">未查看</view>
		</view>
		<swiper observer observerParents :current-item-id="titleType" @change="swiperChange" :style="{height: swiperHeight + 'px'}">
			<swiper-item item-id="all">
				<scroll-view class="content" scroll-y refresher-enabled :refresher-triggered="refreshingAll" @refresherrefresh="refreshDataAll"
				 @scrolltolower="loadMoreAll" :style="{height: swiperHeight + 'px'}">
					<view class="safe-bottom">
						<view class="content-list">
							<detail-item v-for="applyUser in applyUserListAll" :key="applyUser.applyId" :apply-user="applyUser" @to-reject="toReject(applyUser)"
							 @send-notice="sendNotice(applyUser)" @tap="toCannerCard(applyUser)"></detail-item>
							<uni-load-more v-if="moreShowAll" :status="loadMoreStatusAll"></uni-load-more>
						</view>
						<image v-if="applyUserListAll.length == 0" style="width: 100vw" :src="$ossUrl('pic_nothing_show.png')"></image>
					</view>
				</scroll-view>

			</swiper-item>
			<swiper-item item-id="1">
				<scroll-view class="content" scroll-y refresher-enabled :refresher-triggered="refreshingCheck" @refresherrefresh="refreshDataCheck"
				 @scrolltolower="loadMoreCheck" :style="{height: swiperHeight + 'px'}">
					<view class="safe-bottom">
						<view class="content-list">
							<view v-for="applyUser in applyUserListCheck" :key="applyUser.applyId" class="content-item">
								<detail-item :apply-user="applyUser" @to-reject="toReject(applyUser)" @send-notice="sendNotice(applyUser)"
								 @tap="toCannerCard(applyUser)"></detail-item>
							</view>
							<uni-load-more v-if="moreShowCheck" :status="loadMoreStatusCheck"></uni-load-more>
						</view>
						<image v-if="applyUserListCheck.length == 0" style="width: 100vw" :src="$ossUrl('pic_nothing_show.png')"></image>
					</view>
				</scroll-view>
			</swiper-item>
			<swiper-item item-id="0">
				<scroll-view class="content" scroll-y refresher-enabled :refresher-triggered="refreshingNotCheck" @refresherrefresh="refreshDataNotCheck"
				 @scrolltolower="loadMoreNotCheck" :style="{height: swiperHeight + 'px'}">
					<view class="safe-bottom">
						<view class="content-list">
							<view v-for="applyUser in applyUserListNotCheck" :key="applyUser.applyId" class="content-item">
								<detail-item :apply-user="applyUser" @to-reject="toReject(applyUser)" @send-notice="sendNotice(applyUser)"
								 @tap="toCannerCard(applyUser)"></detail-item>
							</view>
							<uni-load-more v-if="moreShowNotCheck" :status="loadMoreStatusNotCheck"></uni-load-more>
						</view>
						<image v-if="applyUserListNotCheck.length == 0" style="width: 100vw" :src="$ossUrl('pic_nothing_show.png')"></image>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import {
		detailItem
	} from './detailItem.vue'
	export default {
		components: {
			detailItem
		},
		data() {
			return {
				swiperHeight: 0,
				recruitId: '',
				orgId: '',
				titleType: 'all',
				applyUserListAll: [],
				applyUserListCheck: [],
				applyUserListNotCheck: [],
				refreshingAll: false,
				refreshingCheck: false,
				refreshingNotCheck: false,
				loadMoreStatusAll: 'more',
				loadMoreStatusCheck: 'more',
				loadMoreStatusNotCheck: 'more',
				moreShowAll: false,
				moreShowCheck: false,
				moreShowNotCheck: false,
				pageAll: {
					current: 1,
					size: 10,
				},
				pageCheck: {
					current: 1,
					size: 10,
				},
				pageNotCheck: {
					current: 1,
					size: 10,
				},
			}
		},
		onLoad(options) {
			console.log(options)
			uni.setNavigationBarTitle({
				title: options.name
			});
			this.recruitId = options.recruitId
			this.orgId = options.orgId
			this.getApplyUserListAll(true, () => {
				if (this.applyUserListAll.length > 0) {
					this.moreShowAll = true
				}
			})
			this.getApplyUserListCheck(true, () => {
				if (this.applyUserListCheck.length > 0) {
					this.moreShowCheck = true
				}
			})
			this.getApplyUserListNotCheck(true, () => {
				if (this.applyUserListNotCheck.length > 0) {
					this.moreShowNotCheck = true
				}
			})
			uni.createSelectorQuery()
				.in(this)
				.select('#so-recruit-detail-top')
				.boundingClientRect()
				.exec(ret => {
					let height = uni.getSystemInfoSync().windowHeight;
					this.swiperHeight = height - ret[0].height;
				});
		},
		computed: {
			params() {
				return {
					recruitId: this.recruitId,
					type: 'all',
				}
			}
		},
		methods: {
			getApplyUserListAll(refresh = false, callback) {
				this.$http.get('dms/recruit_query/apply_user', {
					params: {
						...this.params,
						isCheck: 'all',
						...this.pageAll
					},
				}).then(({
					data
				}) => {
					if (!refresh) {
						this.applyUserListAll = [...this.applyUserListAll, ...data.data.records]
					} else {
						this.applyUserListAll = data.data.records
					}
					if (this.pageAll.current < data.data.pages) {
						this.loadMoreStatusAll = 'more'
					} else {
						this.loadMoreStatusAll = 'noMore'
					}
				}).finally(() => {
					callback && callback()
				})
			},
			getApplyUserListCheck(refresh = false, callback) {
				this.$http.get('dms/recruit_query/apply_user', {
					params: {
						...this.params,
						isCheck: '1',
						...this.pageCheck
					},
				}).then(({
					data
				}) => {
					if (!refresh) {
						this.applyUserListCheck = [...this.applyUserListCheck, ...data.data.records]
					} else {
						this.applyUserListCheck = data.data.records
					}
					if (this.pageCheck.current < data.data.pages) {
						this.loadMoreStatusCheck = 'more'
					} else {
						this.loadMoreStatusCheck = 'noMore'
					}
				}).finally(() => {
					callback && callback()
				})
			},
			getApplyUserListNotCheck(refresh = false, callback) {
				this.$http.get('dms/recruit_query/apply_user', {
					params: {
						...this.params,
						isCheck: '0',
						...this.pageNotCheck
					}
				}).then(({
					data
				}) => {
					if (!refresh) {
						this.applyUserListNotCheck = [...this.applyUserListNotCheck, ...data.data.records]
					} else {
						this.applyUserListNotCheck = data.data.records
					}
					if (this.pageNotCheck.current < data.data.pages) {
						this.loadMoreStatusNotCheck = 'more'
					} else {
						this.loadMoreStatusNotCheck = 'noMore'
					}
				}).finally(() => {
					callback && callback()
				})
			},
			refreshDataAll() {
				this.pageAll.current = 1
				this.refreshingAll = true
				this.moreShowAll = false
				this.getApplyUserListAll(true, () => {
					if (this.applyUserListAll.length > 0) {
						this.moreShowAll = true
					}
					this.refreshingAll = false
				})
			},
			refreshDataCheck() {
				this.pageCheck.current = 1
				this.refreshingCheck = true
				this.moreShowCheck = false
				this.getApplyUserListCheck(true, () => {
					if (this.applyUserListCheck.length > 0) {
						this.moreShowCheck = true
					}
					this.refreshingCheck = false
				})
			},
			refreshDataNotCheck() {
				this.pageNotCheck.current = 1
				this.refreshingNotCheck = true
				this.moreShowNotCheck = false
				this.getApplyUserListNotCheck(true, () => {
					if (this.applyUserListNotCheck.length > 0) {
						this.moreShowNotCheck = true
					}
					this.refreshingNotCheck = false
				})
			},
			loadMoreAll() {
				if (this.loadMoreStatusAll == 'more') {
					this.loadMoreStatusAll = 'loading'
					this.pageAll.current++
					this.getApplyUserListAll()
				}
			},
			loadMoreCheck() {
				if (this.loadMoreStatusCheck == 'more') {
					this.loadMoreStatusCheck = 'loading'
					this.pageCheck.current++
					this.getApplyUserListCheck()
				}
			},
			loadMoreNotCheck() {
				if (this.loadMoreStatusNotCheck == 'more') {
					this.loadMoreStatusNotCheck = 'loading'
					this.pageNotCheck.current++
					this.getApplyUserListNotCheck()
				}
			},
			reloadDataAll() {
				let page = {
					current: 1,
					size: this.pageAll.current * this.pageAll.size
				}
				this.moreShowAll = false
				this.$http.get('dms/recruit_query/apply_user', {
					params: {
						recruitId: this.recruitId,
						isCheck: 'all',
						type: 'all',
						...page,
					}
				}).then(({
					data
				}) => {
					if (data.code === 0) {
						this.applyUserListAll = data.data.records
						if (page.current < data.data.pages) {
							this.loadMoreStatusAll = 'more'
						} else {
							this.loadMoreStatusAll = 'noMore'
						}
						if (this.applyUserListAll.length > 0) {
							this.moreShowAll = true
						}
					}
				})
			},
			reloadDataCheck() {
				let page = {
					current: 1,
					size: this.pageCheck.current * this.pageCheck.size
				}
				this.moreShowCheck = false
				this.$http.get('dms/recruit_query/apply_user', {
					params: {
						recruitId: this.recruitId,
						isCheck: '1',
						type: 'all',
						...page,
					}
				}).then(({
					data
				}) => {
					if (data.code === 0) {
						this.applyUserListCheck = data.data.records
						if (page.current < data.data.pages) {
							this.loadMoreStatusCheck = 'more'
						} else {
							this.loadMoreStatusCheck = 'noMore'
						}
						if (this.applyUserListCheck.length > 0) {
							this.moreShowCheck = true
						}
					}
				})
			},
			reloadDataNotCheck() {
				let page = {
					current: 1,
					size: this.pageNotCheck.current * this.pageNotCheck.size
				}
				this.moreShowNotCheck = false
				this.$http.get('dms/recruit_query/apply_user', {
					params: {
						recruitId: this.recruitId,
						isCheck: '0',
						type: 'all',
						...page,
					}
				}).then(({
					data
				}) => {
					if (data.code === 0) {
						this.applyUserListNotCheck = data.data.records
						if (page.current < data.data.pages) {
							this.loadMoreStatusNotCheck = 'more'
						} else {
							this.loadMoreStatusNotCheck = 'noMore'
						}
						if (this.applyUserListNotCheck.length > 0) {
							this.moreShowNotCheck = true
						}
					}
				})
			},
			typeChange(type) {
				this.titleType = type
			},
			toReject(apply) {
				uni.showModal({
					content: '是否拒绝该求职者？',
					success: res => {
						if (res.confirm) {
							this.reject(apply)
						}
					}
				})
			},
			reject(apply) {
				this.$http.post('dms/recruit_operation/reject', {
					orgId: this.orgId,
					applyObj: [{
						applyId: apply.applyId,
						type: apply.type
					}]
				}).then(({
					data
				}) => {
					if (data.code === 0) {
						if (apply.isCheck == '0') {
							this.reloadDataAll()
							this.reloadDataCheck()
							this.reloadDataNotCheck()
							let soRecruitTemporary = uni.getStorageSync('soRecruitTemporary')
							uni.setStorageSync('soRecruitTemporary', { ...soRecruitTemporary,
								notCheckNum: (soRecruitTemporary.notCheckNum - 1 > 0 ? soRecruitTemporary.notCheckNum - 1 : 0)
							})
						} else {
							for (let i = 0; i < this.applyUserListAll.length; i++) {
								if (this.applyUserListAll[i].applyId == apply.applyId) {
									this.applyUserListAll.splice(i, 1, {
										...this.applyUserListAll[i],
										status: '3'
									})
								}
							}
							for (let i = 0; i < this.applyUserListCheck.length; i++) {
								if (this.applyUserListCheck[i].applyId == apply.applyId) {
									this.applyUserListCheck.splice(i, 1, {
										...this.applyUserListCheck[i],
										status: '3'
									})
								}
							}
						}
					}
				})
			},
			sendNotice(user) {
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/soInfo/soRecruit/soRecruitNotice/soRecruitNotice?orgId=${this.orgId}&receiveId=${user.createBy}&receiveName=${user.realName}&recruitId=${user.recruitId}&recruitName=${user.name}`
				})
			},
			toCannerCard({
				createBy,
				applyId,
				type,
				isCheck
			}, check = false) {
				if (isCheck == '0') {
					this.$http.post('dms/recruit_operation/check', {
						applyId,
						type
					}).then(({
						data
					}) => {
						if (data.code === 0) {
							let soRecruitTemporary = uni.getStorageSync('soRecruitTemporary')
							uni.setStorageSync('soRecruitTemporary', {
								...soRecruitTemporary,
								deliveryNum: data.data.deliveryNum,
								notCheckNum: data.data.notCheckNum,
							})
							// for (let i = 0; i < this.applyUserList.length; i++) {
							// 	if (this.applyUserList[i].applyId == applyId) {
							// 		this.applyUserList[i].isCheck = '1'
							// 		return
							// 	}
							// }
							this.reloadDataAll()
							this.reloadDataCheck()
							this.reloadDataNotCheck()
						}
					})
				}
				uni.navigateTo({
					url: `/pages/find/cannerCard/cannerCard?id=${createBy}&fromRecruit=true`
				})
			},
			swiperChange({
				detail
			}) {
				this.titleType = detail.currentItemId
			},
		},
	}
</script>

<style lang="scss">
	.recruit-detail {
		.wrap-title {
			display: flex;
			justify-content: space-around;
			align-items: center;
			padding: 0 40rpx;

			.title-item {
				display: inline-block;
				position: relative;
				padding: 16rpx 0;
				height: 44rpx;
				line-height: 44rpx;
				font-size: 32rpx;
				color: #919397;

				&.active {
					color: #F74437;

					&::after {
						content: '';
						position: absolute;
						bottom: 0;
						left: 50%;
						margin-left: -6rpx;
						height: 6rpx;
						width: 12rpx;
						border-radius: 3rpx;
						background-color: #F74437;
					}
				}
			}
		}

		.content {
			.content-list {
				.content-item:not(:first-child) {
					margin-top: 40rpx;
				}
			}
		}

		.button-bottom-box {
			padding: 20rpx 40rpx;

			.button-bottom {
				height: 72rpx;
				line-height: 72rpx;
				background-color: #F74437;
				border-radius: 20rpx;
				font-size: 28rpx;
				color: #FFFFFF;
				font-weight: bold;
				text-align: center;
			}
		}

		.popDialog {
			border-radius: 20rpx 20rpx 0 0;
			padding: 80rpx 40rpx 20rpx;

			.title {
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 32rpx;

				.dialog-icon {
					height: 52rpx;
					width: 52rpx;
				}

				.title-word {
					margin-left: 20rpx;
					line-height: 44rpx;
				}
			}

			.flexRow {
				margin-top: 80rpx;
			}

			.button.cancel {
				flex: 40rpx 1 1;
				background-color: #FFFFFF;
				color: #F74437;
				border: 2rpx solid #F74437;
			}

			.button.ok {
				margin-left: 20rpx;
				flex: 40rpx 1 1;
			}
		}
	}
</style>
