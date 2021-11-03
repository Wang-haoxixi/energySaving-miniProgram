<template>
	<view class="container">
		<view class="wrap-area" id="so-recruit-top">
			<view class="wrap-filter">
				<view class="filter-item" :class="[filterTypeShow ? 'show' : '']" @tap="filterTypeChange">
					<view class="filter-word">{{recruitType.label}}</view>
					<image v-show="!filterTypeShow" class="filter-icon" :src="$ossUrl('icon_triangle_gray.png')"></image>
					<image v-show="filterTypeShow" class="filter-icon" :src="$ossUrl('icon_triangle_blue.png')"></image>
				</view>
				<view class="filter-item" :class="[filterStatusShow ? 'show' : '']" style="margin-left: 30rpx;" @tap="filterStatusChange">
					<view class="filter-word">{{recruitStatus.label}}</view>
					<image v-show="!filterStatusShow" class="filter-icon" :src="$ossUrl('icon_triangle_gray.png')"></image>
					<image v-show="filterStatusShow" class="filter-icon" :src="$ossUrl('icon_triangle_blue.png')"></image>
				</view>
			</view>
		</view>
		<view v-show="filterTypeShow || filterStatusShow" class="filter-shadow" @tap="filterClose">
			<view class="filter-area">
				<view class="filter-select">
					<view v-for="item in filterCurrent" :key="item.value" class="filter-select-item" :class="[isChoice(item) ? 'choice' : '']"
					 @tap="filterChosse(item)">{{item.label}}</view>
				</view>
			</view>
		</view>
		<view class="safe-bottom">
			<view class="content-list">
				<view v-for="recruit in recruitList" :key="recruit.recruitId" class="content-item">
					<so-recruit-item :recruit="recruit" @tap="viewDetail(recruit)" @view-detail="viewDelivery" @handle-stop="handleStop"
					 @handle-start="handleStart" @handle-top="handleTop"></so-recruit-item>
				</view>
				<uni-load-more v-if="moreShow" :status="loadMoreStatus"></uni-load-more>
			</view>
			<image v-if="recruitList.length == 0" style="width: 100vw" :src="$ossUrl('pic_nothing_show.png')"></image>
		</view>
		<uni-popup ref="dialog" type="bottom">
			<view>
				<view class="popDialog">
					<view class="title">
						<image class="dialog-icon" :src="$ossUrl('icon_meetting_confirm.png')"></image>
						<text class="color_666769 title-word">是否停止该岗位的招聘？</text>
					</view>
					<view class="flexRow">
						<view class="button cancel" @tap="cancelStop">
							取消
						</view>
						<view class="button ok" @tap="stopRecruit">
							确定
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		recruitTypeList,
		recruitStatusList
	} from './const.js'
	import {
		soRecruitItem
	} from '../soRecruitItem/soRecruitItem.vue'
	export default {
		components: {
			soRecruitItem,
		},
		data() {
			return {
				recruitTypeList,
				recruitStatusList,
				recruitType: recruitTypeList[0],
				recruitStatus: recruitStatusList[0],
				recruitList: [],
				filterTypeShow: false,
				filterStatusShow: false,
				filterCurrent: null,
				orgId: '',
				refreshing: false,
				loadMoreStatus: 'more',
				moreShow: false,
				page: {
					current: 1,
					size: 10,
				},
				handleRecruitId: '',
			}
		},
		computed: {
			recruitPrams() {
				let params = {
					state: this.recruitStatus.value,
				}
				if (this.recruitType.value !== 'all') {
					params.type = this.recruitType.value
				}
				return params
			}
		},
		onLoad(options) {
			this.orgId = options.orgId
			this.getRecruitList(true, () => {
				if (this.recruitList.length > 0) {
					this.moreShow = true
				}
			})
		},
		onUnload() {
			uni.removeStorageSync('soRecruitTemporary');
		},
		onPullDownRefresh () {
			this.refreshDataRecruit()
		},
		onReachBottom () {
			if (this.loadMoreStatus == 'more') {
				this.loadMoreRecruit()
			}
		},
		onShow() {
			let soRecruitTemporary = uni.getStorageSync('soRecruitTemporary')
			if (soRecruitTemporary) {
				if (soRecruitTemporary.state != this.recruitPrams.state) {
					for (let i = 0; i < this.recruitList.length; i++) {
						if (this.recruitList[i].recruitId == soRecruitTemporary.recruitId) {
							this.recruitList.splice(i, 1)
							if (this.recruitList.length === 0) {
								this.moreShow = false
							}
							return
						}
					}
				} else {
					for (let i = 0; i < this.recruitList.length; i++) {
						if (this.recruitList[i].recruitId == soRecruitTemporary.recruitId) {
							this.recruitList.splice(i, 1, {
								...this.recruitList[i],
								deliveryNum: soRecruitTemporary.deliveryNum,
								notCheckNum: soRecruitTemporary.notCheckNum
							})
							return
						}
					}
				}
			}
		},
		watch: {
			recruitPrams(val) {
				this.page.current = 1
				this.recruitList = []
				this.moreShow = false
				this.getRecruitList(true, () => {
					if (this.recruitList.length > 0) {
						this.moreShow = true
					}
				})
			},
		},
		methods: {
			getRecruitList(refresh = false, callback, page = this.page) {
				this.$http.get('dms/recruit/so_recruit', {
					params: {
						orgId: this.orgId,
						...this.recruitPrams,
						...page
					}
				}).then(({
					data
				}) => {
					if (data.code === 0) {
						if (!refresh) {
							this.recruitList = [...this.recruitList, ...data.data.records]
						} else {
							this.recruitList = data.data.records
						}
						if (this.page.current < data.data.pages) {
							this.loadMoreStatus = 'more'
							this.page.current++
						} else {
							this.loadMoreStatus = 'noMore'
						}
					}
				}).finally(() => {
					callback && callback()
				})
			},
			getRecruitCurrent () {
				let page = {
					current: 1,
					size: this.page.current * this.page.size
				}
				this.moreShow = false;
				this.getRecruitList(true, () => {
					if (this.recruitList.length > 0) {
						this.moreShow = true;
					}
				}, page)
			},
			filterTypeChange() {
				this.filterTypeShow = true
				this.filterCurrent = this.recruitTypeList
			},
			filterStatusChange() {
				this.filterStatusShow = true
				this.filterCurrent = this.recruitStatusList
			},
			filterChosse(filter) {
				if (this.filterTypeShow) {
					this.recruitType = filter
				} else if (this.filterStatusShow) {
					this.recruitStatus = filter
				}
			},
			filterClose() {
				this.filterCurrent = null
				this.filterTypeShow = false
				this.filterStatusShow = false
			},
			isChoice(filter) {
				if (this.filterTypeShow) {
					return this.recruitType.value === filter.value
				} else if (this.filterStatusShow) {
					return this.recruitStatus.value === filter.value
				}
			},
			handleStop(recruitId) {
				this.handleRecruitId = recruitId
				this.$refs.dialog.open()
			},
			cancelStop () {
				this.$refs.dialog.close()
			},
			stopRecruit() {
				this.$refs.dialog.close()
				this.$http.post('dms/recruit/stop', {
					recruitId: this.handleRecruitId,
				}).then(({
					data
				}) => {
					if (data.code === 0) {
						
						this.getRecruitCurrent()
					}
				})
			},
			handleStart(recruitId) {
				this.$http.post('dms/recruit/restart', {
					recruitId: recruitId,
				}).then(({data}) => {
					if (data.code === 0) {
						let page = {
							current: 1,
							size: this.page.current * this.page.size
						}
						this.getRecruitCurrent()
					}
				})
			},
			handleTop(recruitId) {
				this.$http.post('dms/recruit/top', {
					recruitIds: [recruitId],
					type: 'top'
				}).then(({
					data
				}) => {
					if (data.code === 0) {
						uni.showToast({
							icon: 'none',
							title: '职位刷新成功！'
						})
					}
				})
			},
			viewDelivery({
				recruitId,
				state,
				deliveryNum,
				notCheckNum,
				name
			}) {
				uni.setStorageSync('soRecruitTemporary', {
					recruitId,
					state,
					deliveryNum,
					notCheckNum
				})
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/soInfo/soRecruit/soRecruitDetail/soRecruitDetail?orgId=${this.orgId}&recruitId=${recruitId}&state=${state}&name=${name.substring(name.lastIndexOf('-') + 1)}`
				})
			},
			viewDetail({
				recruitId
			}) {
				//Cross-module
				uni.navigateTo({
					url: `/pages/find/recruit/recruitDetail/recruitDetail?id=${recruitId}`
				})
			},
			recruitChange(data) {
				for (let i = 0; i < this.recruitList.length; i++) {
					if (this.recruitList[i].recruitId == data.recruitId) {
						this.recruitList[i].state = data.state
						return
					}
				}
			},
			toCannerCard(userId) {
				uni.navigateTo({
					url: `/pages/find/cannerCard/cannerCard?id=${userId}`
				})
			},
			refreshDataRecruit() {
				this.page.current = 1;
				this.refreshing = true;
				this.moreShow = false;
				this.getRecruitList(true, () => {
					if (this.recruitList.length > 0) {
						this.moreShow = true;
					}
					this.refreshing = false;
					uni.stopPullDownRefresh();
				})
			},
			loadMoreRecruit() {
				this.loadMoreStatus = 'loading'
				this.getRecruitList()
			},
		}
	}
</script>

<style lang="scss">
	.container {
		.wrap-area { 
			display: flex;
			justify-content: space-between;
			padding: 0 40rpx;
			height: 92rpx;
			align-items: center;

			.wrap-filter {
				.filter-item {
					display: inline-block;
					vertical-align: middle;
					height: 34rpx;
					line-height: 34rpx;
					padding: 10rpx 12rpx 10rpx 20rpx;
					background-color: #F4F5F6;
					border-radius: 10rpx;
					color: #919397;

					&.show {
						color: #2F80FF;

						.filter-icon {
							transform: rotate(180deg);
						}
					}

					.filter-word {
						display: inline-block;
						vertical-align: middle;
						height: 34rpx;
						line-height: 34rpx;
						font-size: 24rpx;
					}

					.filter-icon {
						height: 34rpx;
						width: 34rpx;
						vertical-align: middle;
					}
				}
			}
		}

		.content {
			.content-list {
				padding: 40rpx;

				.content-item:not(:first-child) {
					margin-top: 40rpx;
				}
			}
		}

		.filter-shadow {
			position: absolute;
			z-index: 10;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;

			.filter-area {
				position: absolute;
				left: 0;
				right: 0;
				top: 46px;
				bottom: 0;
				overflow: hidden;
				background-color: rgba(0, 0, 0, .5);

				.filter-select {
					background-color: #FFFFFF;

					.filter-select-item {
						height: 108rpx;
						line-height: 108rpx;
						text-align: center;

						&.choice {
							color: #2F80FF;
						}

						&:not(:first-child) {
							position: relative;

							&::after {
								content: '';
								position: absolute;
								top: 0;
								left: 40rpx;
								right: 40rpx;
								border-top: 1rpx solid #EFF0F1
							}
						}
					}
				}
			}
		}

		.popDialog {
			padding: 32rpx;

			.title {
				display: flex;
				justify-content: center;
				align-items: center;

				.dialog-icon {
					height: 52rpx;
					width: 52rpx;
				}

				.title-word {
					margin-left: 20rpx;
					font-size: 28rpx;
					line-height: 52rpx;
					margin: 48rpx 0;
				}
			}

			.flexRow {
				margin-top: 80rpx;
			}

			.button.cancel {
				flex: 40rpx 1 1;
				background: #F5f7f8;
				color: #565B5F;
			}

			.button.ok {
				margin-left: 20rpx;
				flex: 40rpx 1 1;
			}
		}
	}
</style>
