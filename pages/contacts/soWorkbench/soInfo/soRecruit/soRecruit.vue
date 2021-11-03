<template>
	<view class="container">
		<view id="so-recruit-top">
			<view class="search-box">
				<view class="flexRowStart search" @tap="search">
					<image class="searchImg" :src="$ossUrl('icon_search_gray.png')"></image>
					<input placeholder="搜索" placeholder-class="search-placeholder" disabled/>
				</view>
			</view>
			<view class="link-list flexRow">
				<view class="link-item" @tap="toRecruitManage">
					<image class="item-icon" :src="$ossUrl('icon_recruit_manage.png')"></image>
					<view class="item-text">
						<view class="first-line">
							<text class="first-line-text bold color_30303">职位管理</text>
							<image class="first-line-icon" :src="$ossUrl('icon_back.png')"></image>
						</view>
						<view class="second-line">管理招聘新情况</view>
					</view>
				</view>
				<view class="link-item" style="margin-left: 30rpx;" @tap="toRecuirtInterview">
					<image class="item-icon" :src="$ossUrl('icon_recruit_interview.png')"></image>
					<view class="item-text">
						<view class="first-line">
							<text class="first-line-text bold color_30303">面试日程</text>
							<image class="first-line-icon" :src="$ossUrl('icon_back.png')"></image>
						</view>
						<view class="second-line">合理规划时间</view>
					</view>
				</view>
			</view>
		</view>
		<view style=""></view>
		<view class="wrap-box flexRow">
			<view class="wrap-title color_303031">人才库</view>
			<view class="wrap-filter">
				<view class="filter-item" @tap="chooseCity">
					<view class="filter-word">{{$isEmpty(recruitCitySelection.secondaryCityName)?'全国':recruitCitySelection.secondaryCityName}}</view>
					<image class="filter-icon" :src="$ossUrl('icon_triangle_gray.png')"></image>
				</view>
				<view class="filter-item" @tap="chooseFilter" style="margin-left: 30rpx">
					<view class="filter-word">筛选</view>
					<image class="filter-icon" :src="$ossUrl('icon_triangle_gray.png')"></image>
				</view>
			</view>
		</view>
		<view class="content safe-bottom">
			<view class="content-list">
				<view class="content-item" v-for="talent in talentList" :key="talent.userId">
					<so-recruit-talent-item :user="talent" @tap="toCannerCard(talent.userId)"></so-recruit-talent-item>
				</view>
				<uni-load-more v-if="moreShow" :status="loadMoreStatus"></uni-load-more>
			</view>
			<image v-if="talentList.length == 0" style="width: 100vw" :src="$ossUrl('pic_nothing_show.png')"></image>
		</view>

		<!-- <view class="content"
			scroll-y
			refresher-enabled
			:refresher-triggered="refreshing"
			@refresherrefresh="refreshData"
			@scrolltolower="loadMore"
			:style="{height: scrollHeight + 'px'}">
			
		</view> -->
	</view>
</template>

<script>
	import {
		soRecruitTalentItem
	} from './soRecruitItem/soRecruitTalentItem.vue'
	export default {
		components: {
			soRecruitTalentItem
		},
		data() {
			return {
				topHeight: 0,
				scrollHeight: 0,
				talentList: [],
				orgId: '',
				loadMoreStatus: 'more',
				moreShow: false,
				refreshing: false,
				page: {
					current: 1,
					size: 20,
				},
				filterJson: '',
				recruitCitySelection: {
					cityIndex: 0,
					cityName: '全国',
					secondaryCityIndex: 0,
					secondaryCityName: '',
				},
			}
		},
		onLoad(options) {
			this.filterJson = uni.getStorageSync('soRecruitTalentFilter');
			this.orgId = options.orgId
			this.getTalentList(true, () => {
				if (this.talentList.length > 0) {
					this.moreShow = true
				}
			})
			uni.createSelectorQuery()
				.in(this)
				.select('#so-recruit-top')
				.boundingClientRect()
				.exec(ret => {
					this.topHeight = ret[0].height;
					let height = uni.getSystemInfoSync().windowHeight;
					this.scrollHeight = height - this.topHeight;
				});
		},
		onShow() {
			if (this.filterJson != uni.getStorageSync('soRecruitTalentFilter')) {
				this.page.current = 1
				this.refreshing = true
				this.moreShow = false
				this.getTalentList(true, () => {
					if (this.talentList.length > 0) {
						this.moreShow = true
					}
					this.refreshing = false
				})
			}
		},
		onUnload() {
			try {
				uni.removeStorageSync('soRecruitTalentFilter');
			} catch (e) {
				// error
			}
		},
		onPullDownRefresh () {
			this.refreshData()
		},
		onReachBottom () {
			if (this.loadMoreStatus == 'more') {
				this.loadMore()
			}
		},
		methods: {
			getTalentList(refresh = false, callback) {
				let workplace = this.recruitCitySelection.secondaryCityName ? `${this.recruitCitySelection.cityName}-${this.recruitCitySelection.secondaryCityName}` : ''
				
				this.filterJson = uni.getStorageSync('soRecruitTalentFilter');
				let params = {
					orgId: this.orgId,
					workplace,
					...this.page,
				}
				if (!this.$isEmpty(this.filterJson)) {
					this.filterJson.forEach((item, index) => {
						let array = []
						item.itemList.forEach((item2, index2) => {
							if (item2.check == true) {
								array.push(item2)
							}
						});
						this.filterJson.splice(index, 1, { ...this.filterJson[index],
							itemList: array
						});
					})
					params.conditions = this.filterJson
				}
				this.$http.post('admin/talent_pool/app_page/v2', {
					...params,
				}).then(({
					data
				}) => {
					if (data.code === 0) {
						if (!refresh) {
							this.talentList = [...this.talentList, ...data.data.records]
						} else {
							this.talentList = data.data.records
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
			toCannerCard(userId) {
				uni.navigateTo({
					url: `/pages/find/cannerCard/cannerCard?id=${userId}&fromSo=true&orgId=${this.orgId}`
				})
			},
			toRecruitManage () {
				uni.navigateTo({
					url: `./soRecruitManage/soRecruitManage?orgId=${this.orgId}`
				})
			},
			toRecuirtInterview () {
				uni.navigateTo({
					url: `./soRecruitInterview/soRecruitInterview?orgId=${this.orgId}`
				})
			},
			refreshData() {
				this.page.current = 1
				this.refreshing = true
				this.moreShow = false
				this.getTalentList(true, () => {
					if (this.talentList.length > 0) {
						this.moreShow = true
					}
					this.refreshing = false
					uni.stopPullDownRefresh();
				})
			},
			loadMore() {
				this.loadMoreStatus = 'loading'
				this.getTalentList()
			},
			search() {
				uni.navigateTo({
					url: `./soRecruitTalentSearch/soRecruitTalentSearch?orgId=${this.orgId}`
				})
			},
			chooseCity() {
				uni.navigateTo({
					url: `/pages/find/recruit/citySelection/citySelection?cityIndex=${this.recruitCitySelection.cityIndex}&secondaryCityIndex=${this.recruitCitySelection.secondaryCityIndex}`
				})
			},
			cityChange(city) {
				if (city.cityIndex != this.recruitCitySelection.cityIndex || city.secondaryCityIndex != this.recruitCitySelection.secondaryCityIndex) {
					this.recruitCitySelection = city
					this.refreshData()
				}
			},
			chooseFilter() {
				uni.navigateTo({
					url: './soRecruitFilter/soRecruitFilter?haha=123'
				})
			},
		},
	}
</script>

<style lang="scss">
	.container {
		.link-list {
			margin-top: 40rpx;
			padding: 0 40rpx 40rpx;
			height: 108rpx;

			.link-item {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				flex: 100rpx 1 1;
				height: 108rpx;
				padding: 0 30rpx;
				background-color: #F4F5F6;
				border-radius: 20rpx;

				.item-icon {
					height: 60rpx;
					width: 56rpx;
					flex: 56rpx 0 0;
				}

				.item-text {
					margin-left: 20rpx;
					flex: 100rpx 1 1;

					.first-line {
						height: 40rpx;
						line-height: 40rpx;
						font-size: 0;

						.first-line-text {
							vertical-align: middle;
							line-height: 40rpx;
							font-size: 28rpx;
						}

						.first-line-icon {
							vertical-align: middle;
							height: 40rpx;
							width: 26rpx;
							transform: rotateY(180deg);
						}
					}

					.second-line {
						height: 28rpx;
						line-height: 28rpx;
						color: #BABEC0;
						font-size: 20rpx;
					}
				}
			}
		}
		
		.wrap-box {
			position: sticky !important;
			position: -webkit-sticky !important;
			top: 0;
			background-color: #FFFFFF;
			padding: 0 40rpx;
			height: 74rpx;
			
			.wrap-title {
				line-height: 44rpx;
				font-size: 32rpx;
				font-weight: bold;
			}
		
			.wrap-filter {
				.filter-item {
					display: inline-block;
					height: 34rpx;
					line-height: 34rpx;
					padding: 10rpx 12rpx 10rpx 20rpx;
					background-color: #F4F5F6;
					border-radius: 10rpx;
					color: #919397;
					font-size: 0;
		
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
				background-color: #F8F8F9;

				.content-item {
					background-color: #FFFFFF;
					padding: 40rpx 40rpx;

					&:not(:first-child) {
						margin-top: 10rpx;
					}
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

		.search-box {
			padding: 16rpx 32rpx;

			.search {
				height: 72rpx;
				padding: 0 32rpx;
				border-radius: 60rpx;
				background-color: #F5f7f8;

				.searchImg {
					height: 32rpx;
					width: 32rpx;
					flex: 32rpx 0 0;
				}

				input {
					flex: 20rpx 1 1;
					margin-left: 14rpx;
					line-height: 34rpx;
				}

				.search-placeholder {
					font-size: 24rpx;
					line-height: 34rpx;
					color: #919397;
				}
			}
		}
	}
</style>
