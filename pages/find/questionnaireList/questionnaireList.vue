<template>
	<view class="container">
		<view class="contentWrap">
			<view class="search" @tap="goSearch">
				<image v-if="oss" class="search-icon" :src="oss+'icon_search_gray.png'"></image>
				<input class="search-text" placeholder="搜索" placeholder-class="inputDefault" @input="search" v-model="searchText"
				 disabled="true" />
			</view>
			<view class="questionnaire">
				<questionnaireItem v-for="(item,index) in qusetionnaireList" :key="index" :itemData="item" :isLogin="isLogin"></questionnaireItem>
			</view>
			<image class="emptyImg" v-if="!qusetionnaireList.length>0 && oss" :src="oss+'pic_noMessage.png'" mode="aspectFit"></image>
			<uni-load-more :status="questionnaireStatus" v-if="qusetionnaireList.length>0"></uni-load-more>
			<view class="safe-bottom"></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				qusetionnaireInfo: {},
				qusetionnaireList: [],
				questionnaireStatus: 'more',
				status: false,
				oss: '',
				isLogin:''
			};
		},
		onLoad() {
			this.oss = this.$oss
			this.$http.get('qms/questionnaire/factory_page').then(res => {
				// console.log(res)
				this.qusetionnaireInfo = res.data.data
				this.qusetionnaireList = this.qusetionnaireInfo.records
				this.qusetionnaireList.forEach(item => {
					if (item.startTime && item.endTime) {
						item.startTime = item.startTime.split(' ')[0]
						item.endTime = item.endTime.split(' ')[0]
					}
				})
				if (this.qusetionnaireInfo.current == this.qusetionnaireInfo.pages) {
					this.questionnaireStatus = 'noMore'
				} else if (this.qusetionnaireInfo.pages == 0) {
					this.questionnaireStatus = 'noMore'
				}
			})
		},
		onShow() {
			this.isLogin = !this.$isEmpty(uni.getStorageSync('token'));
		},
		onPullDownRefresh() {
			this.$http.get('qms/questionnaire/factory_page').then(res => {
				// console.log(res)
				this.qusetionnaireInfo = res.data.data
				this.qusetionnaireList = this.qusetionnaireInfo.records
				this.qusetionnaireList.forEach(item => {
					if (item.startTime && item.endTime) {
						item.startTime = item.startTime.split(' ')[0]
						item.endTime = item.endTime.split(' ')[0]
					}
				})
				if (this.qusetionnaireInfo.current == this.qusetionnaireInfo.pages) {
					this.questionnaireStatus = 'noMore'
				} else if (this.qusetionnaireInfo.pages == 0) {
					this.questionnaireStatus = 'noMore'
				}
			})
		},
		onReachBottom() {
			let that = this
			if (that.qusetionnaireInfo.current < that.qusetionnaireInfo.pages) {
				that.questionnaireStatus = 'loading';
				that.$http.get('qms/questionnaire/factory_page', {
					params: {
						current: that.qusetionnaireInfo.current + 1
					}
				}).then(res => {
					// console.log(res)
					that.qusetionnaireInfo.current = res.data.data.current;
					let list = res.data.data.records
					list.forEach(item => {
						if (item.startTime && item.endTime) {
							item.startTime = item.startTime.split(' ')[0]
							item.endTime = item.endTime.split(' ')[0]
						}
					})
					that.qusetionnaireList = that.qusetionnaireList.concat(list);
					that.questionnaireStatus = 'more';
				});
			} else {
				that.questionnaireStatus = 'noMore';
			}
		},
		methods: {
			goSearch() {
				// console.log(666)
				uni.navigateTo({
					url: '/pages/find/questionnaireList/searchQuestionnaire/searchQuestionnaire'
				})
			},
			goTskDetail(item) {
				if (item.participate == 2) {
					this.status = true
					uni.navigateTo({
						url: `/pages/contacts/soWorkbench/soInfo/soQuestionnaire/questionnaireDetails/questionnaireDetails?id=${item.id}&status=${this.status}`
					})
				} else if (item.status == 6) {
					uni.showToast({
						title: "问卷暂未开始",
						icon: "none"
					})
				} else {
					uni.navigateTo({
						url: `/pages/contacts/soWorkbench/soInfo/soQuestionnaire/questionnaireDetails/questionnaireDetails?id=${item.id}`
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.contentWrap {
		padding: 16rpx 0;

		.taskList {
			padding: 30rpx;
			background-color: #FFFFFF;
			border-radius: 30rpx;
			margin-bottom: 40rpx;

			.name {
				font-size: 28rpx;
				line-height: 48rpx;
			}

			.status {
				margin: 30rpx 0;
				font-size: 24rpx;

				.statusInfo {
					margin-right: 80rpx;

					.statusImg {
						width: 36rpx;
						height: 36rpx;
						padding-right: 10rpx;
					}

					.txt {
						padding-right: 10rpx;
					}
				}
			}

			.countInfo {
				font-size: 20rpx;

				.txt {
					padding-right: 10rpx;
				}

				.awardInfo {
					display: none;
					height: 44rpx;
					border-radius: 22rpx;
					background-color: rgba(247, 68, 55, .1);
					padding: 0 20rpx;

					.awardImg {
						width: 28rpx;
						height: 28rpx;
						margin-left: 10rpx;
					}
				}
			}
		}
	}

	.search {
		margin: 0 32rpx;
		padding: 18rpx 32rpx;
		border-radius: 60rpx;
		background-color: #F5f7f8;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

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

	.questionnaire {
		margin-top: 20rpx;
	}
</style>
