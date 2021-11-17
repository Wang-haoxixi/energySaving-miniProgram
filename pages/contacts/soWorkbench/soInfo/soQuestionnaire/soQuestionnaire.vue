<template>
	<view class="container">
		<view class="title">
			<view class="title-item" @tap="allClick()">
				<view :class="[{ active: isAllActive }, { unactive: !isAllActive }]">问卷列表</view>
				<view class="title-item-bottom" v-if="isAllActive"></view>
			</view>
			<view class="title-item" @tap="joinClick()">
				<view :class="[{ active: isJoinActive }, { unactive: !isJoinActive }]">我参与的</view>
				<view class="title-item-bottom" v-if="isJoinActive"></view>
			</view>
		</view>
		<view class="search">
			<view class="flexRowStart wrapSearch">
				<image v-if="oss" class="searchImg" :src="oss+'icon_search_gray.png'"></image>
				<input maxlength="500" placeholder="请输入问卷标题" placeholder-class="inputDefault" @input="search" v-model="searchText"></input>
			</view>
		</view>
		<swiper circular @change="swiperChange" class="content" observer observerParents :current-item-id="item_id" ref="swiper">
			<swiper-item item-id="0">
				<scroll-view :scroll-top="30" scroll-y="true" class="scroll-Y" @scrolltolower="listMore">
					<questionnaireItem v-for="(item,index) in allList" :key="index" :itemData="item"></questionnaireItem>
					<image class="emptyImg" v-if="!allList.length>0" :src="$ossUrl('pic_nothing_show.png')" mode="aspectFit"></image>
					<uni-load-more :status="listStatus" v-if="allList.length>0"></uni-load-more>
					<view class="safe-bottom"></view>
				</scroll-view>
			</swiper-item>
			<swiper-item item-id="1">
				<scroll-view :scroll-top="30" scroll-y="true" class="scroll-Y" @scrolltolower="participateMore">
					<questionnaireItem v-for="(item,index) in joinList" :key="index" :itemData="item"></questionnaireItem>
					<image class="emptyImg" v-if="!joinList.length>0" :src="$ossUrl('pic_nothing_show.png')" mode="aspectFit"></image>
					<uni-load-more :status="participateStatus" v-if="joinList.length>0"></uni-load-more>
					<view class="safe-bottom"></view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				isAllActive: true,
				isJoinActive: false,
				item_id: 0,
				questionnaireList: [],
				participateList: [],
				listStatus: 'more',
				participateStatus: 'more',
				allList: [],
				joinList: [],
				searchText: '',
				orgId: 0,
				questionnaireInfo: {},
				joinInfo: {},
				status: false,
				oss: ''
			}
		},
		onLoad(options) {
			const {
				orgId
			} = options
			this.oss = this.$oss
			this.orgId = orgId
		},
		onShow() {
			// console.log(666)
			this.$http.get('qms/questionnaire/page_so', {
				params: {
					orgId: this.orgId,
					name: this.searchText
				},
			}).then(res => {
				// console.log(res)
				this.questionnaireInfo = res.data.data
				this.questionnaireList = res.data.data.records;
				this.allList = this.questionnaireList.map(item => {
					if (item.startTime && item.endTime) {
						return {
							...item,
							startTime: item.startTime.split(" ")[0],
							endTime: item.endTime.split(" ")[0]
						}
					} else {
						return {
							...item
						}
					}
				})
				if (this.questionnaireInfo.current == this.questionnaireInfo.pages) {
					this.listStatus = 'noMore';
				} else if (this.questionnaireInfo.pages == 0) {
					this.listStatus = 'noMore';
				}
			});
			this.$http.get('qms/questionnaire/participate_page', {
				params: {
					orgId: this.orgId,
					name: this.searchText
				},
			}).then(res => {
				// console.log(res)
				this.joinInfo = res.data.data
				this.participateList = res.data.data.records;
				this.joinList = this.participateList.map(item => {
					if (item.startTime && item.endTime) {
						return {
							...item,
							startTime: item.startTime.split(" ")[0],
							endTime: item.endTime.split(" ")[0]
						}
					} else {
						return {
							...item
						}
					}
				})
				if (this.joinInfo.current == this.joinInfo.pages) {
					this.participateStatus = 'noMore';
				} else if (this.joinInfo.pages == 0) {
					this.participateStatus = 'noMore';
				}
			})
		},
		methods: {
			listMore() {
				let that = this;
				if (that.questionnaireInfo.current < that.questionnaireInfo.pages) {
					that.listStatus = 'loading';
					that.$http.get('qms/questionnaire/page_so', {
						params: {
							orgId: that.orgId,
							current: that.questionnaireInfo.current + 1,
							name: this.searchText
						}
					}).then(res => {
						// console.log(res)
						that.questionnaireInfo.current = res.data.data.current;
						// console.log(that.listCurrent)
						that.allList = that.allList.concat(res.data.data.records);
						that.listStatus = 'more';
					});
				} else {
					that.listStatus = 'noMore';
				}
			},
			participateMore() {
				let that = this;
				if (that.joinInfo.current < that.joinInfo.pages) {
					// console.log(6)
					that.participateStatus = 'loading';
					that.$http.get('qms/questionnaire/participate_page', {
						params: {
							orgId: that.orgId,
							current: that.joinInfo.current + 1,
							name: this.searchText
						}
					}).then(res => {
						// console.log(res)
						that.joinInfo.current = res.data.data.current;
						// console.log(that.joinCurrent)
						that.joinList = that.joinList.concat(res.data.data.records);
						that.participateStatus = 'more';
					});
				} else {
					that.participateStatus = 'noMore';
				}
			},
			swiperChange(e) {
				if (e.detail.current == 0) {
					this.allClick();
				} else if (e.detail.current == 1) {
					this.joinClick();
				}
			},
			allClick() {
				this.isAllActive = true;
				this.isJoinActive = false;
				this.item_id = 0;
				this.$http.get('qms/questionnaire/page_so', {
					params: {
						orgId: this.orgId,
						name: this.searchText
					},
				}).then(res => {
					// console.log(res)
					this.questionnaireInfo = res.data.data
					this.questionnaireList = res.data.data.records;
					this.allList = this.questionnaireList.map(item => {
						if (item.startTime && item.endTime) {
							return {
								...item,
								startTime: item.startTime.split(" ")[0],
								endTime: item.endTime.split(" ")[0]
							}
						} else {
							return {
								...item
							}
						}
					})
					if (this.questionnaireInfo.current == this.questionnaireInfo.pages) {
						this.listStatus = 'noMore';
					} else if (this.questionnaireInfo.pages == 0) {
						this.listStatus = 'noMore';
					}
				});
			},
			joinClick() {
				this.isAllActive = false;
				this.isJoinActive = true;
				this.item_id = 1;
				this.$http.get('qms/questionnaire/participate_page', {
					params: {
						orgId: this.orgId,
						name: this.searchText
					},
				}).then(res => {
					// console.log(res)
					this.joinInfo = res.data.data
					this.participateList = res.data.data.records;
					this.joinList = this.participateList.map(item => {
						if (item.startTime && item.endTime) {
							return {
								...item,
								startTime: item.startTime.split(" ")[0],
								endTime: item.endTime.split(" ")[0]
							}
						} else {
							return {
								...item
							}
						}
					})
					if (this.joinInfo.current == this.joinInfo.pages) {
						this.participateStatus = 'noMore';
					} else if (this.joinInfo.pages == 0) {
						this.participateStatus = 'noMore';
					}
				})
			},
			search() {
				this.$http.get('qms/questionnaire/page_so', {
					params: {
						orgId: this.orgId,
						size: 20,
						name: this.searchText
					}
				}).then(res => {
					this.questionnaireList = res.data.data.records
					this.allList = this.questionnaireList.filter(item => {
						// console.log(item.realName)
						// console.log(this.searchText)
						return item.name.includes(this.searchText)
					})
				})
				this.$http.get('qms/questionnaire/participate_page', {
					params: {
						orgId: this.orgId,
						size: 20,
						name: this.searchText
					}
				}).then(res => {
					this.participateList = res.data.data.records
					this.joinList = this.participateList.filter(item => {
						// console.log(item.realName)
						// console.log(this.searchText)
						return item.name.includes(this.searchText)
					})
				})
			},
			goDetails(item) {
				// let status = this.participateList.some(res=>{
				// 	return res.id==item.id
				// })
				// if(status==true){
				// 	uni.showToast({
				// 		title:"您已答过该问卷",
				// 		duration:1000,
				// 		icon:"none"
				// 	})
				// }else{
				// 	uni.navigateTo({
				// 		url: `/pages/contacts/soWorkbench/soInfo/soQuestionnaire/questionnaireDetails/questionnaireDetails?id=${item.id}`
				// 	})
				// }
				if (item.status == 1) {
					if (item.participate == 2) {
						this.status = true
						uni.navigateTo({
							url: `/pages/contacts/soWorkbench/soInfo/soQuestionnaire/questionnaireDetails/questionnaireDetails?id=${item.id}&status=${this.status}`
						})
					} else {
						uni.navigateTo({
							url: `/pages/contacts/soWorkbench/soInfo/soQuestionnaire/questionnaireDetails/questionnaireDetails?id=${item.id}&status=${this.status}`
						})
					}
				} else if (item.status == 4) {
					uni.showToast({
						title: "问卷审核中",
						icon: "none"
					})
				} else if (item.status == 3) {
					if (item.participate == 2) {
						this.status = true
						uni.navigateTo({
							url: `/pages/contacts/soWorkbench/soInfo/soQuestionnaire/questionnaireDetails/questionnaireDetails?id=${item.id}&status=${this.status}`
						})
					} else {
						uni.showToast({
							title: "问卷已结束",
							icon: "none"
						})
					}
				} else if (item.status == 6) {
					uni.showToast({
						title: "问卷未开始",
						icon: "none"
					})
				}
			},
			goJoinDetails(item) {
				// uni.showToast({
				// 	title:"您已答过该问卷",
				// 	duration:1000,
				// 	icon:"none"
				// })
				if (item.participate == 2) {
					this.status = true
				} else {
					this.status = false
				}
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/soInfo/soQuestionnaire/questionnaireDetails/questionnaireDetails?id=${item.id}&status=${this.status}`
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F5f7f8;
	}

	.container {
		height: 100vh;
		display: flex;
		flex-direction: column;

		.title {
			display: flex;
			text-align: center;
			margin-top: 20rpx;

			.title-item {
				flex: 1;
				text-align: center;

				.title-item-bottom {
					width: 12rpx;
					height: 6rpx;
					border-radius: 3rpx;
					// background-color: #F74437;
					background-color: #46B28B;
					margin: 10rpx auto;
				}
			}
		}

		.search {
			padding: 0 32rpx;

			.wrapSearch {
				margin: 16rpx 0;
				padding: 18rpx 32rpx;
				border-radius: 60rpx;
				background-color: #FFFFFF;

				.searchImg {
					height: 32rpx;
					width: 32rpx;
				}
			}
		}

		.content {
			flex: 1;

			.scroll-Y {
				height: 100%;
			}
		}
	}

	.active {
		// color: #f74437;
		color: #46B28B;
		font-size: 36rpx;
		font-weight: bold;
		line-height: 50rpx;
	}

	.unactive {
		color: #919397;
		font-size: 28rpx;
		font-weight: normal;
		line-height: 50rpx;
	}

	.swiper-item {
		display: block;
		height: 100%;
		// line-height: 300rpx;
		text-align: center;
		background-color: #f4f5f6;
	}

	input {
		flex: 1;
		font-size: 28rpx;
		padding: 0 14rpx;
		color: #666769;
	}

	.bottom-safe {
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}
</style>
