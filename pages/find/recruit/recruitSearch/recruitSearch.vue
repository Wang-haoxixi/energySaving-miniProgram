<template>
	<view>
		<view id="top" class="wrapSearch">
			<view class="flexRowStart search">
				<image class="searchImg" v-if="oss" :src="oss+'icon_search_gray.png'"></image>
				<input placeholder="搜索" placeholder-class="inputDefault" v-model="searchText" @input="inputChange" @confirm="search"
				 confirm-type="search" focus="true" />
			</view>
			<view class="search-title">
				<view class="wrap-title">
					<view class="title" @tap="recruitClick()">
						<view :class="[{ active: item_id == 0 }]">职位</view>
					</view>
					<view class="title" @tap="partnerClick()">
						<view :class="[{ active: item_id == 1 }]">合伙人</view>
					</view>
				</view>
				<view class="filter-item" @tap="city">
					<view class="filter-text">
						{{$isEmpty(recruitCitySelection.secondaryCityName)?'全国':recruitCitySelection.secondaryCityName}}
					</view>
					<image class="filter-icon" v-if="oss" :src="oss+ 'icon_triangle_gray.png'"></image>
				</view>
			</view>
		</view>
		<view v-if="show" class="default">
			<view v-if="searchHistory.length>0">
				<view class="title">
					<view class="left">最近搜索</view>
					<image @tap="clearHistory" class="icon" v-if="oss" :src="oss+'icon_delect.png'"></image>
				</view>
				<view class="content">
					<view class="content-item singleEllipsis" v-for="(item,index) in searchHistory" :key="index" @tap="goSearch(item)">
						{{$isEmpty(item)?'':item}}
					</view>
				</view>
			</view>
		</view>
		<swiper v-if="!show" circular @change="swiperChange" observer observerParents :current-item-id="item_id" ref="swiper"
		 :style="{height: swiperHeight + 'px'}">
			<swiper-item item-id="0">
				<scroll-view scroll-y="true" :style="{height:swiperHeight + 'px'}" @scrolltolower="more">
					<recruit-item v-for="(item,index) in recruit.records" :key="index" :itemData="item"></recruit-item>
					<image v-if="!recruit.records.length > 0 && oss" :src="oss + 'pic_nothing_show.png'" mode="aspectFit" style="width: 100%;"></image>
					<uni-load-more :status="recruitStatus"></uni-load-more>
				</scroll-view>
			</swiper-item>
			<swiper-item item-id="1">
				<scroll-view scroll-y="true" :style="{height:swiperHeight + 'px'}" @scrolltolower="more">
					<recruit-item v-for="(item,index) in partner.records" :key="index" :itemData="item"></recruit-item>
					<image v-if="!partner.records.length > 0 && oss" :src="oss + 'pic_nothing_show.png'" mode="aspectFit" style="width: 100%;"></image>
					<uni-load-more :status="partnerStatus"></uni-load-more>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: true,
				oss: this.$oss,
				recruitCitySelection: {},
				item_id: 0,
				swiperHeight: 0,
				recruit: '',
				partner: '',
				searchText: '',
				recruitStatus: 'more',
				partnerStatus: 'more',
				searchHistory: [],
				timeout: null,
			};
		},
		watch: {
			searchText (val) {
				clearTimeout(this.timeout)
				if (val.trim()) {
					this.debounce()
				}
			}
		},
		methods: {
			debounce() {
				this.timeout = setTimeout(() => {
					this.getData(0, 1);
					this.getData(1, 1);
				}, 1000)
			},
			goSearch(item) {
				this.searchText = item;
				this.getData(0, 1);
				this.getData(1, 1);
			},
			inputChange(e) {
				if (e.detail.value == "") {
					this.show = true;
				}
			},
			getData(type, current) {
				this.show = false;
				this.$http.post('dms/recruit_query/page/v2', {
					type: type,
					current: current,
					size: 20,
					name: this.searchText,
					// conditions: this.filterJson,
					workplace: this.recruitCitySelection.secondaryCityName,
				}).then(res => {
					if (type == 0) {
						if (current > 1) {
							this.recruit.current = res.data.data.current;
							res.data.data.records.forEach(item => {
								item.avatar = imageError(item.avatar, this.oss)
							})
							this.recruit.records = this.recruit.records.concat(res.data.data.records);
							this.recruitStatus = 'more';
						} else {
							this.recruit = res.data.data;
							if (!(this.recruit.current < this.recruit.pages)) {
								this.recruitStatus = 'noMore';
							}
						}
					} else if (type == 1) {
						if (current > 1) {
							this.partner.current = res.data.data.current;
							res.data.data.records.forEach(item => {
								item.avatar = imageError(item.avatar, this.oss)
							})
							this.partner.records = this.partner.records.concat(res.data.data.records);
							this.partnerStatus = 'more';
						} else {
							this.partner = res.data.data;
							if (!(this.partner.current < this.partner.pages)) {
								this.partnerStatus = 'noMore';
							}
						}
					}
				})
			},
			more() {
				if (this.item_id == 0) {
					let that = this;
					if (that.recruit.current < that.recruit.pages) {
						that.recruitStatus = 'loading';
						that.getData(0, that.recruit.current + 1)
					} else {
						that.recruitStatus = 'noMore';
					}
				} else if (this.item_id == 1) {
					let that = this;
					if (that.partner.current < that.partner.pages) {
						that.partnerStatus = 'loading';
						that.getData(1, that.partner.current + 1)
					} else {
						that.partnerStatus = 'noMore';
					}
				}
			},
			swiperChange(e) {
				if (e.detail.current == 0) {
					this.recruitClick();
				} else if (e.detail.current == 1) {
					this.partnerClick();
				}
			},
			recruitClick() {
				this.item_id = 0;
			},
			partnerClick() {
				this.item_id = 1;
			},
			city() {
				if (this.recruitCitySelection.cityIndex) {
					uni.navigateTo({
						url: `../citySelection/citySelection?cityIndex=${this.recruitCitySelection.cityIndex}&secondaryCityIndex=${this.recruitCitySelection.secondaryCityIndex}`
					})
				} else {
					uni.navigateTo({
						url: '../citySelection/citySelection'
					})
				}
			},
			search() {
				this.show = false;
				this.getData(0, 1);
				this.getData(1, 1);
				let searchList = uni.getStorageSync('recruitSearchHistory');
				searchList.unshift(this.searchText);
				searchList = Array.from(new Set(searchList));
				if (searchList.length > 9) {
					searchList = searchList.slice(0, 9);
				}
				this.searchHistory = searchList;
				uni.setStorageSync('recruitSearchHistory', searchList);
			},
			cityChange(city) {
				this.recruitCitySelection = city
				if (this.searchText.trim()) {
					this.getData(0, 1);
					this.getData(1, 1);
				}
			},
			clearHistory () {
				this.searchHistory = []
				uni.setStorageSync('recruitSearchHistory', []);
			}
		},
		onLoad() {
			uni.createSelectorQuery()
				.in(this)
				.select('#top')
				.boundingClientRect()
				.exec(ret => {
					let height = uni.getSystemInfoSync().windowHeight;
					this.swiperHeight = height - ret[0].height;
				});
			if (this.$isEmpty(uni.getStorageSync('recruitSearchHistory'))) {
				uni.setStorageSync('recruitSearchHistory', []);
			}
			this.searchHistory = uni.getStorageSync('recruitSearchHistory');
		},
	}
</script>

<style lang="scss">
	.inputDefault {
		font-size: 28rpx;
		color: #919397;
	}

	input {
		flex: 1;
		font-size: 28rpx;
		padding: 0 14rpx;
		color: #666769;
	}

	.wrapSearch {
		padding: 16rpx 0;

		.search {
			margin: 0 32rpx;
			padding: 18rpx 32rpx;
			border-radius: 60rpx;
			background-color: #F5f7f8;

			.searchImg {
				height: 32rpx;
				width: 32rpx;
			}
		}
	}


	.search-title {
		margin: 30rpx 40rpx 0;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.wrap-title {
			display: flex;
			justify-content: flex-start;

			.title {
				position: relative;
				font-weight: bold;
				margin-right: 40rpx;
				padding-bottom: 16rpx;
				line-height: 44rpx;
				text-align: center;
				font-size: 32rpx;
				color: #919397;

				.active {
					color: #f74437;

					&::after {
						content: '';
						position: absolute;
						bottom: 0;
						left: 50%;
						margin-left: -6rpx;
						width: 12rpx;
						height: 6rpx;
						border-radius: 3rpx;
						background-color: #F74437;
					}
				}
			}
		}
	}

	.filter-item {
		display: flex;
		padding: 10rpx 12rpx 10rpx 20rpx;
		line-height: 36rpx;
		height: 34rpx;
		background-color: #F4F5F6;
		border-radius: 10rpx;
		font-size: 24rpx;
		color: #919397;

		.filter-icon {
			margin-left: 2rpx;
			height: 34rpx;
			width: 34rpx;
		}
	}

	.default {
		.title {
			padding: 0 40rpx;
			margin-top: 30rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.left {
				color: #303031;
				font-size: 28rpx;
				font-weight: bold;
				line-height: 40rpx;
			}

			.right {
				color: #F74437;
				font-size: 24rpx;
				line-height: 34rpx;
			}

			.icon {
				height: 44rpx;
				width: 44rpx;
			}

		}

		.content {
			display: flex;
			flex-wrap: wrap;
			padding: 0 9rpx;

			.content-item {
				width: 168rpx;
				background-color: #F4F5F6;
				margin-left: 30rpx;
				margin-top: 30rpx;
				border-radius: 10rpx;
				color: #919397;
				font-size: 24rpx;
				line-height: 34rpx;
				padding: 16rpx 16rpx 16rpx 20rpx;
			}
		}
	}
</style>
