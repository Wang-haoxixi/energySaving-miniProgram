<template>
	<view>
		<view class="wrapSearch">
			<view class="flexRowStart search">
				<image class="searchImg" :src="$ossUrl('icon_search_gray.png')"></image>
				<input v-model="searchText" placeholder-class="inputDefault" confirm-type="search" placeholder="根据行业搜索" focus="true" @confirm="search" @blur="blur" @focus="focus"/>
			</view>
		</view>
		<view v-show="searchShow || !dataShow" class="default">
			<view v-if="searchHistory.length>0">
				<view class="title">
					<view class="left">最近搜索</view>
					<image class="icon" :src="$ossUrl('icon_delect.png')" @tap="clearHistory"></image>
				</view>
				<view class="content">
					<view v-for="(item,index) in searchHistory" :key="index" class="content-item singleEllipsis" @tap="goSearch(item)">
						{{$isEmpty(item)?'':item}}
					</view>
				</view>
			</view>
		</view>
		<view v-show="dataShow && !searchShow" class="safe-bottom">
			<view class="content-list">
				<view v-for="item in talentList" :key="item.userId" class="content-item">
					<so-recruit-talent-item :user="item" @tap="toCannerCard(item.userId)"/>
				</view>
				<image v-if="dataInit && talentList.length == 0" :src="$ossUrl('pic_nothing_show.png')" mode="aspectFit" style="width: 100%;"></image>
			</view>
			<uni-load-more v-show="moreShow" :status="moreStatus"></uni-load-more>
		</view>
	</view>
</template>

<script>
	import {
		soRecruitTalentItem
	} from '../soRecruitItem/soRecruitTalentItem.vue';
	export default {
		components: {
			soRecruitTalentItem
		},
		data() {
			return {
				orgId: '',
				searchText: '',
				name: '',
				dataShow: false,
				searchShow: true,
				page: {
					current: 1,
					size: 20
				},
				dataInit: false,
				talentList: [],
				moreShow: false,
				moreStatus: 'more',
				searchHistory: [],
				stopBlur: false,
			};
		},
		onLoad({orgId}) {
			this.orgId = orgId
			if (this.$isEmpty(uni.getStorageSync('talentSearchHistory'))) {
				uni.setStorageSync('talentSearchHistory', []);
			}
			this.searchHistory = uni.getStorageSync('talentSearchHistory');
		},
		watch: {
			searchText (val) {
				if (!val.trim()) {
					this.searchShow = true
					
				}
			}
		},
		onReachBottom () {
			this.more()
		},
		methods: {
			focus () {
				this.stopBlur = false
			},
			blur () {
				if (!this.stopBlur) {
					this.searchShow = false
					this.searchText = this.name || this.searchText
				}
			},
			goSearch(item) {
				this.stopBlur = true
				this.moreShow = false
				this.searchText = item;
				this.name = item;
				this.getData(true);
			},
			getData(refresh = false) {
				this.dataShow = true
				this.searchShow = false
				this.searchText = this.name
				this.$http.post('admin/talent_pool/app_page/v2', {
					orgId: this.orgId,
					...this.page,
					name: this.name
				}).then(({data}) => {
					if (refresh) {
						this.talentList = data.data.records 
						this.moreShow = this.talentList.length > 0
					} else {
						this.talentList = [...this.talentList, ...data.data.records]
					}
					if (this.page.current < data.data.pages) {
						this.moreStatus = 'more';
					} else {
						this.moreStatus = 'noMore'
					}
				}).finally(() => {
					this.dataInit = true
				})
			},
			more() {
				if (this.moreStatus == 'more') {
					this.page.current = this.page.current + 1
					this.moreStatus = 'loading'
					this.getData()
				}
			},
			search() {
				this.stopBlur = true
				if (this.searchText.trim()) {
					this.moreShow = false
					this.name = this.searchText.trim()
					this.getData(true)
					let searchList = uni.getStorageSync('talentSearchHistory');
					searchList.unshift(this.name);
					searchList = Array.from(new Set(searchList));
					if (searchList.length > 9) {
						searchList = searchList.slice(0, 9);
					}
					this.searchHistory = searchList;
					uni.setStorageSync('talentSearchHistory', searchList);
				} else {
					uni.showToast({
						icon: 'none',
						title: '搜索内容不能为空'
					})
				}
			},
			clearHistory() {
				this.searchHistory = []
				uni.setStorageSync('talentSearchHistory', []);
			},
			toCannerCard(userId) {
				uni.navigateTo({
					url: `/pages/find/cannerCard/cannerCard?id=${userId}&fromSo=true&orgId=${this.orgId}`
				})
			}
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
		position: sticky;
		top: 0;
		padding: 16rpx 0;
		background-color: #FFFFFF;
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
				text-align: center;
			}
		}
	}
	
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
</style>
