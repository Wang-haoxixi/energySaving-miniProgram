<template>
	<view>
		<view id="top" class="wrapSearch">
			<view class="flexRowStart search">
				<image class="searchImg" v-if="oss" :src="oss+'icon_search_gray.png'"></image>
				<input placeholder="搜索" placeholder-class="inputDefault" v-model="searchText" @input="inputChange" @confirm="search"
				 confirm-type="search" focus="true" />
			</view>
		</view>
		<view v-if="show">
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
			<view>
				<view class="title">
					<view class="left">热门搜索</view>
					<view class="right" @tap="changePopular">换一批</view>
				</view>
				<view class="content">
					<view class="content-item singleEllipsis" v-for="(item,index) in popular.records" :key="index" @tap="goSearch(item)">
						{{$isEmpty(item)?'':item}}
					</view>
				</view>
			</view>
			<view>
				<view class="title">
					<view class="left">热门标签</view>
					<view class="right" @tap="changeHotTag">换一批</view>
				</view>
				<view class="content">
					<view @tap="goTagMore(item)" class="content-item singleEllipsis" v-for="(item,index) in hot_tag.records" :key="index">
						{{$isEmpty(item)?'':item}}
					</view>
				</view>
			</view>
		</view>
		<scroll-view v-if="!show" :style="{height:scrollHeight + 'px'}" :scroll-top="30" scroll-y @scrolltolower="more">
			<view class="scroll-item" v-for="(item,index) in data.records" :key="index" @tap="gomagicBox(item.id)">
				<image lazy-load="true" class="avatar" :src="item.imageUrl"></image>
				<view class="item-content">
					<view class="item-content-start">
						<view class="item-content-name singleEllipsis">{{$isEmpty(item.name)?'':item.name}}</view>
						<view class="item-content-score">
							<image v-if="oss" class="icon" :src="oss+'icon_star.png'"></image>{{$isEmpty(item.score)?'暂无评分':item.score}}
						</view>
						<view class="item-content-tag">
							<text v-for="(item2,index) in item.tagKeywords" :key="index"> {{$isEmpty(item2)?'':item2}} <text v-if="index<item.tagKeywords.length-1"
								 style="margin: 0 6rpx;">·</text>
							</text>
						</view>
					</view>
					<view class="item-content-end">
						<view class="official" v-if="item.isOfficial==1">
							<image v-if="oss" class="icon" :src="oss+'icon_official_mini.png'"></image>官方认证
						</view>
						<view style="flex: 1;"></view>
						<view v-if="!item.collect" class="follow" @tap.stop="follow(item)">收藏</view>
						<view v-if="item.collect" class="followed" @tap.stop="followed(item)">已收藏</view>
					</view>
				</view>
			</view>
			<image class="emptyImg" v-if="!data.records.length>0 && oss" :src="oss+'pic_energy_default_wuxinxi.png'" mode="aspectFit"></image>
			<uni-load-more :status="status" v-if="data.records.length>0"></uni-load-more>
		</scroll-view>
	</view>
</template>

<script>
	import {
		isEmpty,
		gomagicBox
	} from '@/common/utils.js'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		data() {
			return {
				show: true,
				data: '',
				scrollHeight: 0,
				status: 'more',
				searchText: '',
				hot_tag: {
					records: []
				},
				popular: {
					records: []
				},
				searchHistory: [],
				oss: ''
			};
		},
		methods: {
			goTagMore(item) {
				uni.navigateTo({
					url: '../more/more?type=2&tag=' + item
				})
			},
			follow(item) {
				this.$http.post('dms/collection/create', {
					targetId: item.id,
					type: 6,
				}).then(res => {
					if (res.data.data) {
						item.collect = true
					}
				})
			},
			followed(item) {
				this.$http.post('dms/collection/app/delete', {
					targetIds: [item.id],
					type: 6,
				}).then(res => {
					if (res.data.data) {
						item.collect = false
					}
				})
			},
			more() {
				if (this.data.current < this.data.pages) {
					this.status = 'loading';
					this.$http.get('dms/app/product/shop_page', {
						params: {
							tag: this.searchText,
							current: this.data.current + 1,
							size: 20
						}
					}).then(res => {
						this.data.current = res.data.data.current;
						this.data.records = this.data.records.concat(res.data.data.records);
						this.status = 'more';
					});
				} else {
					this.status = 'noMore';
				}
			},
			goSearch(item) {
				this.searchText = item;
				this.search();
			},
			inputChange(e) {
				if (e.detail.value == "") {
					this.show = true;
				}
			},
			clearHistory() {
				uni.setStorageSync('searchHistory', []);
				this.searchHistory = [];
			},
			search() {
				this.show = false;
				this.$http.get('dms/app/product/shop_page', {
					params: {
						tag: this.searchText,
						current: 1,
						size: 20
					}
				}).then(res => {
					this.data = res.data.data;
					if (!(this.data.current < this.data.pages)) {
						this.status = 'noMore';
					}
				});
				let searchList = uni.getStorageSync('searchHistory');
				searchList.unshift(this.searchText);
				searchList = Array.from(new Set(searchList));
				if (searchList.length > 9) {
					searchList = searchList.slice(0, 9);
				}
				this.searchHistory = searchList;
				uni.setStorageSync('searchHistory', searchList);
			},
			changeHotTag() {
				let current = ++this.hot_tag.current;
				if (current > this.hot_tag.pages) {
					current = 1;
				}
				this.$http.get('dms/search_log/hot_tag/page', {
					params: {
						current: current,
						size: 6
					}
				}).then(res => {
					this.hot_tag = res.data.data
				})
			},
			changePopular() {
				let current = ++this.popular.current;
				if (current > this.popular.pages) {
					current = 1;
				}
				this.$http.get('dms/search_log/popular/page', {
					params: {
						current: current,
						size: 9
					}
				}).then(res => {
					this.popular = res.data.data
				});
			},
			isEmpty,
			gomagicBox
		},
		onLoad() {
			this.oss = this.$oss
			uni.createSelectorQuery()
				.in(this)
				.select('#top')
				.boundingClientRect()
				.exec(ret => {
					let height = uni.getSystemInfoSync().windowHeight;
					height = height - ret[0].height;
					this.scrollHeight = height;
					console.log(height)
				});
			if (isEmpty(uni.getStorageSync('searchHistory'))) {
				uni.setStorageSync('searchHistory', []);
			}
			this.searchHistory = uni.getStorageSync('searchHistory');
			this.$http.get('dms/search_log/hot_tag/page', {
				params: {
					current: 1,
					size: 6
				}
			}).then(res => {
				this.hot_tag = res.data.data
			});
			this.$http.get('dms/search_log/popular/page', {
				params: {
					current: 1,
					size: 9
				}
			}).then(res => {
				this.popular = res.data.data
			});
		}
	}
</script>

<style lang="scss">
	.scroll-item {
		display: flex;
		padding: 32rpx 24rpx;
		border-bottom: 0.3rpx solid #EFF0F1;

		.avatar {
			height: 140rpx;
			width: 140rpx;
			border-radius: 8rpx;
		}

		.item-content {
			flex: 1;
			margin-left: 24rpx;
			height: 140rpx;
			display: flex;
			justify-content: space-between;

			.item-content-start {
				display: flex;
				flex-direction: column;
				align-items:flex-start;
				justify-content: space-between;
				.item-content-name {
					color: #272727;
					font-weight: bold;
					line-height: 40rpx;
					width: 392rpx;
				}

				.item-content-score {
					display: flex;
					align-items: center;

					.icon {
						width: 18rpx;
						height: 18rpx;
						margin-right: 14rpx;
					}

					margin-top: 10rpx;
					color: #F74437;
					font-size: 24rpx;
					font-weight: bold;
					line-height: 34rpx;
				}

				.item-content-tag {
					margin-top: 10rpx;
					color: #919397;
					font-size: 20rpx;
					line-height: 28rpx;

				}
			}

			.item-content-end {
				width: 112rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
			}

			.official {
				color: #2F80FF;
				font-size: 20rpx;
				line-height: 28rpx;
				font-weight: bold;
				display: flex;
				align-items: center;

				.icon {
					height: 24rpx;
					width: 24rpx;
					margin-right: 8rpx;
				}
			}

			.follow {
				text-align: center;
				width: 96rpx;
				background: linear-gradient(90deg, #FF825C 0%, #FF3636 100%);
				color: #FFFFFF;
				font-size: 24rpx;
				line-height: 34rpx;
				padding: 8rpx 0;
				border-radius: 25rpx;
				font-weight: bold;
			}

			.followed {
				text-align: center;
				width: 96rpx;
				background-color: #f5f7f8;
				color: #9aa1a7;
				font-size: 24rpx;
				line-height: 34rpx;
				padding: 8rpx 0;
				border-radius: 25rpx;
				font-weight: bold;
			}
		}
	}

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

	.title {
		padding: 0 40rpx;
		margin-top: 60rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.left {
			color: #272727;
			font-size: 28rpx;
			font-weight: bold;
			line-height: 40rpx;
		}

		.right {
			// color: #F74437;
			color: #46B28B;
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
			text-align: center;
		}
	}

	.wrapSearch {

		.search {
			margin: 16rpx 32rpx;
			padding: 18rpx 32rpx;
			border-radius: 60rpx;
			background-color: #F5f7f8;

			.searchImg {
				height: 32rpx;
				width: 32rpx;
			}
		}
	}
</style>
