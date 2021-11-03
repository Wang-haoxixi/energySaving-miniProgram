<template>
	<view class="container" ref="page">
		<view id="top" class="searchTop">
			<view class="search-open flexRow">
				<view class="search" @tap="goSearch">
					<image v-if="oss" class="search-icon" :src="oss+'icon_search_gray.png'"></image>
					<input class="search-text" placeholder="搜索" placeholder-class="inputDefault" disabled />
				</view>
				<view class="open-status" @tap="toggleStatus">
					<image class="open-icon" :src="$ossUrl(resumeStatus === 'visible' ? 'icon_recruit_resume_visible.png' : 'icon_recruit_resume_hidden.png')"></image>
					<span class="open-text color_303031">简历</span>
				</view>
			</view>
			<view class="banner">
				<banner slotNumber="app_recruit_hall"></banner>
			</view>
			<view class="link-list flexRow">
				<view class="link-item" @tap="toMyRecruit">
					<image class="item-icon" :src="$ossUrl('icon_recruit_apply_records.png')"></image>
					<view class="item-text">
						<view class="first-line">
							<text class="first-line-text bold color_30303">应聘记录</text>
							<image class="first-line-icon" :src="$ossUrl('icon_back.png')"></image>
						</view>
						<view class="second-line">求职流程跟进</view>
					</view>
				</view>
				<view class="link-item" style="margin-left: 30rpx;" @tap="toProgress">
					<image class="item-icon" :src="$ossUrl('icon_recruit_progress.png')"></image>
					<view class="item-text">
						<view class="first-line">
							<text class="first-line-text bold color_30303">进步阶梯</text>
							<image class="first-line-icon" :src="$ossUrl('icon_back.png')"></image>
						</view>
						<view class="second-line">做更好的自己</view>
					</view>
				</view>
			</view>
		</view>
		<view class="fix-area" :class="[{'fix': filterFix}]" id="title">
			<view class="wrap-title">
				<view class="title" @tap="recruitClick()">
					<view :class="[{ active: activeTitle == 'recruit' }]">正在招聘</view>
				</view>
				<view class="title" @tap="partnerClick()">
					<view :class="[{ active: activeTitle == 'partner' }]">合伙人招募</view>
				</view>
			</view>
			<view class="filter-area">
				<view class="filter-item" @tap.stop="changeFilterShow">
					<view class="filter-text">
						{{filtertext}}
					</view>
					<image class="filter-icon" v-if="oss" :src="oss+ 'icon_triangle_gray.png'"></image>
				</view>
				<view class="filter-item" @tap="city">
					<view class="filter-text">
						{{$isEmpty(recruitCitySelection.secondaryCityName)?'全国':recruitCitySelection.secondaryCityName}}
					</view>
					<image class="filter-icon" v-if="oss" :src="oss+ 'icon_triangle_gray.png'"></image>
				</view>
				<view class="filter-item" @tap="filter">
					<view class="filter-text">
						筛选
					</view>
					<image class="filter-icon" v-if="oss" :src="oss+ 'icon_triangle_gray.png'"></image>
				</view>
			</view>
		</view>
		<view class="fix-area fixed" v-show="filterFix">
			<view class="wrap-title">
				<view class="title" @tap="recruitClick()">
					<view :class="[{ active: activeTitle == 'recruit' }]">职位招聘</view>
				</view>
				<view class="title" @tap="partnerClick()">
					<view :class="[{ active: activeTitle == 'partner' }]">合伙人招募</view>
				</view>
			</view>
			<view class="filter">
				<view class="filter-area">
					<view class="filter-item" @tap="changeFilterShow">
						<view class="filter-text">
							{{filtertext}}
						</view>
						<image class="filter-icon" v-if="oss" :src="oss+ 'icon_triangle_gray.png'"></image>
					</view>
					<view class="filter-item" @tap="city">
						<view class="filter-text">
							{{$isEmpty(recruitCitySelection.secondaryCityName)?'全国':recruitCitySelection.secondaryCityName}}
						</view>
						<image class="filter-icon" v-if="oss" :src="oss+ 'icon_triangle_gray.png'"></image>
					</view>
					<view class="filter-item" @tap="filter">
						<view class="filter-text">
							筛选
						</view>
						<image class="filter-icon" v-if="oss" :src="oss+ 'icon_triangle_gray.png'"></image>
					</view>
				</view>
			</view>
		</view>
		<swiper circular @change="swiperChange" style="flex: 1;padding:16rpx 24rpx" observer observerParents :current-item-id="item_id" ref="swiper"
		 :style="{height: swiperHeight + 'px'}">
			<swiper-item item-id="0">
				<view id="recruit">
					<recruit-item v-for="(item,index) in recruit.records" :key="index" :itemData="item"></recruit-item>
					<image v-if="!recruit.records.length > 0 && oss" :src="oss+'pic_noPosition.png'" mode="aspectFit" style="width: 100%;"></image>
					<uni-load-more :status="recruitStatus" v-if="recruit.records.length > 0"></uni-load-more>
				</view>
			</swiper-item>
			<swiper-item item-id="1">
				<view id="partner">
					<recruit-item v-for="(item,index) in partner.records" :key="index" :itemData="item"></recruit-item>
					<image v-if="!partner.records.length > 0 && oss" :src="oss+'pic_noMessage.png'" mode="aspectFit" style="width: 100%;"></image>
					<uni-load-more :status="partnerStatus" v-if="partner.records.length > 0 "></uni-load-more>
				</view>
			</swiper-item>
		</swiper>
		<uni-popup ref="popup" type="top" class="popup">
			<view class="fix-area" :class="[{'fix': filterFix}]" id="title">
				<view class="wrap-title">
					<view class="title" @tap="recruitClick()">
						<view :class="[{ active: activeTitle == 'recruit' }]">职位招聘</view>
					</view>
					<view class="title" @tap="partnerClick()">
						<view :class="[{ active: activeTitle == 'partner' }]">合伙人招募</view>
					</view>
				</view>
				<view class="filter-area">
					<view class="filter-item" @tap="changeFilterShow">
						<view class="filter-text filterTrue">
							{{filtertext}}
						</view>
						<image class="filter-icon" v-if="oss" :src="oss+ 'icon_triangle_gray.png'"></image>
					</view>
					<view class="filter-item" @tap="city">
						<view class="filter-text">
							{{$isEmpty(recruitCitySelection.secondaryCityName)?'全国':recruitCitySelection.secondaryCityName}}
						</view>
						<image class="filter-icon" v-if="oss" :src="oss+ 'icon_triangle_gray.png'"></image>
					</view>
					<view class="filter-item" @tap="filter">
						<view class="filter-text">
							筛选
						</view>
						<image class="filter-icon" v-if="oss" :src="oss+ 'icon_triangle_gray.png'"></image>
					</view>
				</view>
			</view>
			<view class="filter-end" :class="{filterTrue: filtertext == '最新'}" @tap="changeFilter('最新')">
				最新
			</view>
			<view class="filter-end" :class="{filterTrue: filtertext == '热门'}" @tap="changeFilter('热门')">
				热门
			</view>
			<view class="filter-end" :class="{filterTrue: filtertext == '推荐'}" @tap="changeFilter('推荐')">
				推荐
			</view>
		</uni-popup>
		<view class="first-entry-notice" v-if="firstEntry" @tap.stop.prevent="" @touchmove.stop.prevent="" @click.stop.prevent="">
			<view class="notice-box flexRow">
				<text>开放简历可让招聘者主动联系您</text>
				<view class="button-know" @tap="firstEntryKnow">知道了</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		imageError
	} from '@/common/utils.js';
	import {
		banner
	} from '@/components/banner/banner.vue'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	export default {
		components: {
			banner,
			uniPopup
		},
		data() {
			return {
				filterJson: '',
				filterPartnerJson: '',
				recruitCitySelection: '',
				filterFix: false,
				activeTitle: 'recruit',
				oss: '',
				item_id: 0,
				topHeight: 0,
				swiperHeight: 0,
				recruit: '',
				partner: '',
				filtertext: '最新',
				recruitStatus: 'more',
				partnerStatus: 'more',
				progressId: '',
				firstEntry: false,
				resumeStatus: ''
			};
		},
		onLoad() {
			this.oss = this.$oss;
			uni.createSelectorQuery()
				.in(this)
				.select('#top')
				.boundingClientRect()
				.select('#title')
				.boundingClientRect()
				.exec(ret => {
					this.topHeight = ret[0].height;
					let height = uni.getSystemInfoSync().windowHeight;
					this.swiperHeight = height - ret[0].height - ret[1].height;
				});
			this.filterJson = uni.getStorageSync('recruitFilter');
			this.filterPartnerJson = uni.getStorageSync('recruitPartnerFilter');
			this.$http.get('admin/param/public_value_external/GDS_OPEN_MATERIALS_ORG').then(res => {
				this.progressId = res.data.data;
			})
			if (!uni.getStorageSync('notFirstEntry')) {
				this.firstEntry = true
			}
			let user = uni.getStorageSync('user') || {}
			let isRecommend = user.isRecommend || false
			this.resumeStatus = isRecommend ? 'visible' : 'hidden'
			this.getData(0, 1);
			this.getData(1, 1);
		},
		onShow() {
			if (this.activeTitle == 'recruit' && this.filterJson != uni.getStorageSync('recruitFilter')) {
				this.getData(0, 1);
			}
			if (this.activeTitle == 'partner' && this.filterPartnerJson != uni.getStorageSync('recruitPartnerFilter')) {
				this.getData(1, 1);
			}
		},
		onUnload() {
			try {
				uni.removeStorageSync('recruitFilter');
				uni.removeStorageSync('recruitPartnerFilter');
				uni.removeStorageSync('recruitCitySelection');
			} catch (e) {
				// error
			}
		},
		onReachBottom() {
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
		onPageScroll(e) {
			this.filterFix = e.scrollTop >= this.topHeight
			if (e.scrollTop >= this.topHeight) {
				this.isScroll = true;
			} else {
				this.isScroll = false;
			}
		},
		watch: {
			item_id: {
				handler: function() {
					this.changeSwiperHeight();
				},
			},
			recruit: {
				handler: function() {
					this.changeSwiperHeight();
				},
				deep: true
			},
			partner: {
				handler: function() {
					this.changeSwiperHeight();
				},
				deep: true
			},
		},
		methods: {
			toggleStatus () {
				let user = uni.getStorageSync('user') || {}
				let isRecommend = user.isRecommend || false
				this.$http.get('admin/user/card/privacy/set', {
					params: {
						isRecommend: !isRecommend
					}
				}).then(({data}) => {
					if (data.code === 0) {
						uni.setStorageSync('user', {
							...user,
							isRecommend: !isRecommend
						})
						this.resumeStatus = !isRecommend ? 'visible' : 'hidden'
						uni.showToast({
							icon: 'none',
							title: isRecommend ? '简历已隐藏' : '简历已公开'
						})
					}
				})
			},
			firstEntryKnow () {
				this.firstEntry = false
				uni.setStorageSync('notFirstEntry', true);
			},
			changeFilter(text) {
				this.getData(0, 1);
				this.getData(1, 1);
				this.$refs.popup.close();
				this.filtertext = text;
			},
			changeFilterShow() {
				this.filterScrollTo();
				this.$refs.popup.open();
			},
			goSearch() {
				uni.navigateTo({
					url: 'recruitSearch/recruitSearch'
				})
			},
			filter() {
				uni.navigateTo({
					url: 'recruitFilter/recruitFilter?type=' + this.activeTitle
				})
			},
			city() {
				if (this.recruitCitySelection.cityIndex) {
					uni.navigateTo({
						url: `citySelection/citySelection?cityIndex=${this.recruitCitySelection.cityIndex}&secondaryCityIndex=${this.recruitCitySelection.secondaryCityIndex}`
					})
				} else {
					uni.navigateTo({
						url: 'citySelection/citySelection'
					})
				}
			},
			pageScrollTo() {
				if (this.isScroll) {
					uni.pageScrollTo({
						scrollTop: this.topHeight,
						duration: 0
					});
				}
			},
			filterScrollTo() {
				if (!this.isScroll) {
					uni.pageScrollTo({
						scrollTop: this.topHeight + 1,
						duration: 0
					});
				}
			},
			changeSwiperHeight() {
				setTimeout(() => {
					if (this.item_id == 0) {
						uni.createSelectorQuery()
							.in(this)
							.select('#recruit')
							.boundingClientRect()
							.exec(ret => {
								this.swiperHeight = ret[0].height;
							});
					} else if (this.item_id == 1) {
						uni.createSelectorQuery()
							.in(this)
							.select('#partner')
							.boundingClientRect()
							.exec(ret => {
								this.swiperHeight = ret[0].height;
							});
					}
				}, 300);
			},
			recruitClick() {
				this.item_id = 0;
				this.pageScrollTo();
				this.activeTitle = 'recruit';
			},
			partnerClick() {
				this.item_id = 1;
				this.pageScrollTo();
				this.activeTitle = 'partner';
			},
			swiperChange(e) {
				if (e.detail.current == 0) {
					this.recruitClick();
				} else if (e.detail.current == 1) {
					this.partnerClick();
				}
			},
			getData(type, current) {
				let filterJson = ''
				if (type == 0) {
					this.filterJson = filterJson = uni.getStorageSync('recruitFilter')
				} else {
					this.filterPartnerJson = filterJson = uni.getStorageSync('recruitPartnerFilter')
				}
				let sortType;
				if (this.filtertext == '最新') {
					sortType = 0;
				} else if (this.filtertext == '推荐') {
					sortType = 1;
				} else if (this.filtertext == '热门') {
					sortType = 2;
				}
				let params = {}
				if (!this.$isEmpty(filterJson)) {
					filterJson.forEach((item, index) => {
						let array = []
						item.itemList.forEach((item2, index2) => {
							if (item2.check == true) {
								if (!params.hasOwnProperty(item.attribute)) {
									params[item.attribute] = []
								}
								let value = item.attribute === 'salaryScope' ? item2.key : item2.value
								params[item.attribute].push(value)
							}
						});
					})
				}
				this.$http.post('dms/recruit_query/page/v2', {
					type: type,
					current: current,
					size: 20,
					workplace: this.recruitCitySelection.secondaryCityName,
					sortType: sortType,
					...params,
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
			cityChange(city) {
				this.recruitCitySelection = city
				this.getData(0, 1)
				this.getData(1, 1)
			},
			toMyRecruit () {
				//Cross-module
				uni.navigateTo({
					url: "/pages/my/recruit/recruit"
				})
			},
			toProgress () {
				uni.navigateTo({
					url: '/pages/contacts/soWorkbench/soInfo/soMaterial/soMaterial?orgId=' + this.progressId + '&ispProgress=true'
				})
			},
		},
	}
</script>

<style lang="scss">
	page{
		background-color: #F4F5F6;
	}
	.filterTrue {
		color: #2F80FF !important;
		font-weight: bold;
	}

	.filter-end {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 108rpx;
		font-size: 28rpx;
		color: #666769;
		border-bottom: 0.3rpx solid #EFF0F1;
	}

	.container {
		.searchTop {
			padding: 32rpx 0 16rpx;
			background-color: #FFFFFF;

			.search-open {
				padding: 0 32rpx;
				.search {
					padding: 0 32rpx;
					height: 72rpx;
					border-radius: 60rpx;
					background-color: #F5f7f8;
					flex: 200rpx 1 1;
					display: flex;
					flex-direction: row;
					align-items: center;

					.search-icon {
						height: 32rpx;
						width: 32rpx;
					}

					.search-text {
						flex: 1;
						font-size: 28rpx;
						padding: 0 14rpx;
						color: #666769;
					}

					.inputDefault {
						font-size: 28rpx;
						color: #919397;
					}
				}
				.open-status {
					height: 72rpx;
					flex: 44rpx 0 0;
					margin-left: 30rpx;
					line-height: 0;
					.open-icon {
						height: 44rpx;
						width: 44rpx;
					}
					.open-text {
						line-height: 28rpx;
						font-size: 20rpx;
					}
				}
			}

			.banner {
				margin-top: 40rpx;
			}
			
			.link-list {
				margin-top: 40rpx;
				padding: 0 40rpx;
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
								font-size: 28rpx;
								line-height: 40rpx;
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
		}

		.fix-area {
			padding: 20rpx 40rpx;
			background: #FFFFFF;
			color: #919397;

			&.fixed {
				position: fixed;
				top: 0;
				left: 0;
				right: 0;
				padding: 20rpx 40rpx;
				z-index: 10;
				border-bottom: 0.3rpx solid #EFF0F1;
			}


			.wrap-title {
				display: flex;
				justify-content: flex-start;

				.title {
					position: relative;
					font-weight: bold;
					margin-right: 62rpx;
					padding-bottom: 16rpx;
					line-height: 44rpx;
					text-align: center;
					font-size: 32rpx;

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

			.filter-area {
				margin-top: 14rpx;
				display: flex;
				justify-content: flex-start;
				align-items: center;

				.filter-item {
					display: flex;
					margin-right: 30rpx;
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
			}
		}
	}
	.first-entry-notice {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(0, 0, 0, .3);
		z-index: 100;
		// pointer-events: none;
		.notice-box {
			position: absolute;
			left: 40rpx;
			right: 40rpx;
			top: 132rpx;
			height: 108rpx;
			padding: 0 40rpx;
			background-color: #FFFFFF;
			border-radius: 30rpx 0 30rpx 30rpx;
			
			&::after {
				content: '';
				position: absolute;
				top: -10rpx;
				right: 0;
				height: 0;
				width: 0;
				border-left: 80rpx solid transparent;
				// border-right: 20rpx solid transparent;
				border-bottom: 40rpx solid #FFFFFF;
			}
			text {
				color: #303031;
				font-size: 14px;
				font-weight: bold;
			}
			.button-know {
				height: 50rpx;
				line-height: 50rpx;
				width: 120rpx;
				border-radius: 50rpx;
				background-color: #F74437;
				text-align: center;
				color: #FFFFFF;
				font-size: 22rpx;
			}
		}
	}
</style>
