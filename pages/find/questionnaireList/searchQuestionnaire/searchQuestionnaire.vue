<template>
	<view class="container">
		<view class="flexRowStart search">
			<image v-if="oss" class="img" :src="oss+'icon_search_gray.png'"></image>
			<input maxlength="500" placeholder="搜索" placeholder-class="inputDefault" @input="search" v-model="searchText" focus="true"></input>
		</view>
		<view class="taskList" v-for="(item,index) of qusetionnaireList" :key="index" @tap="goTskDetail(item)">
			<view class="color_303031 doubleEllipsis name bold">
				{{$isEmpty(item.name)?'':item.name}}
			</view>
			<view class="color_919397 flexRowStart status">
				<view class="flexRow statusInfo" v-if="item.status==1">
					<image v-if="oss" class="statusImg" :src="oss+'icon_so_questionnaire_online.png'"></image>
					<text>进行中</text>
				</view>
				<view class="flexRow statusInfo" v-if="item.status==3">
					<image v-if="oss" class="statusImg" :src="oss+'icon_so_questionnaire_end.png'"></image>
					<text>已结束</text>
				</view>
				<view class="flexRow statusInfo" v-if="item.status==4">
					<image v-if="oss" class="statusImg" :src="oss+'icon_so_questionnaire_checking.png'"></image>
					<text>审核中</text>
				</view>
				<view class="flexRow statusInfo" v-if="item.status==6">
					<image v-if="oss" class="statusImg" :src="oss+'icon_so_questionnaire_wait.png'"></image>
					<text>未开始</text>
				</view>
				<view class="flexRow statusInfo">
					<image v-if="oss" class="statusImg" :src="oss+'icon_so_questionnaire_group.png'"></image>
					<text class="txt">参与人数:</text>
					<text class="color_303031">{{$isEmpty(item.joinPeople)?'0':item.joinPeople}}</text>
				</view>
			</view>
			<view class="flexRow countInfo">
				<view class="color_919397" v-if="item.startTime&&item.endTime">
					<text class="txt">截止时间:</text>
					<text>{{$isEmpty(item.startTime)?'':item.startTime}}至{{$isEmpty(item.endTime)?'':item.endTime}}</text>
				</view>
				<view class="color_919397" v-else>
					<text class="txt">截止时间:</text>
					<text>长期有效</text>
				</view>
				<view v-if="item.openAward==2" class="flexRow awardInfo">
					<image v-if="oss" class="awardImg" :src="oss+'icon_so_questionnaire_logo.png'"></image>
					<text class="color_F74437">+{{$isEmpty(item.awardNumber)?'0':item.awardNumber}}</text>
				</view>
			</view>
		</view>
		<image class="emptyImg" v-if="!qusetionnaireList.length>0 && oss" :src="oss+'pic_energy_default_wujilu.png'" mode="aspectFit"></image>
		<uni-load-more :status="questionnaireStatus" v-if="qusetionnaireList.length>0"></uni-load-more>
		<view class="bottom-safe" style="height: 112rpx;"></view>
	</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				qusetionnaireInfo: {},
				qusetionnaireList: [],
				questionnaireStatus: '',
				oss: ''
			};
		},
		onLoad() {
			this.oss = this.$oss
		},
		onReachBottom() {
			// console.log(666)
			let that = this
			if (that.qusetionnaireInfo.current < that.qusetionnaireInfo.pages) {
				that.questionnaireStatus = 'loading';
				that.$http.get('qms/questionnaire/factory_page', {
					params: {
						name: that.searchText,
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
			search() {
				if (this.searchText.length == 0) {
					this.qusetionnaireInfo = {}
					this.qusetionnaireList = []
				} else {
					this.$http
						.get('qms/questionnaire/factory_page', {
							params: {
								name: this.searchText
							}
						})
						.then(res => {
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
						});
				}
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

	.container {
		padding: 0 32rpx;

		.search {
			margin: 16rpx 0;
			padding: 18rpx 32rpx;
			border-radius: 60rpx;
			background-color: #F5f7f8;

			.img {
				height: 32rpx;
				width: 32rpx;
			}
		}

		.taskList {
			padding: 32rpx;
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

	.bottom-safe {
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}
</style>
