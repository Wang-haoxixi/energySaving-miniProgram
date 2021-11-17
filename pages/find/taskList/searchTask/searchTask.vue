<template>
	<view class="container">
		<view class="flexRowStart search">
			<image v-if="oss" class="img" :src="oss+'icon_search_gray.png'"></image>
			<input maxlength="500" placeholder="搜索" placeholder-class="inputDefault" @input="search" v-model="searchText" focus="true"></input>
		</view>
		<view class="taskList" v-for="(item,index) of searchTaskList" :key="index" @tap="goTskDetail(item)">
			<view class="flexRowStart">
				<image :src="imageError(item.avatar,$oss)" class="avatarImg"></image>
				<view class="flexRowStart" style="flex: 1;">
					<view class="color_303031 singleEllipsis userName" style="max-width: 220rpx;">
						{{$isEmpty(item.userName)?'':item.userName}}
					</view>
					<image v-if="item.isOfficial==1 && oss" :src="oss+'find_workshop_official.png'" class="officialImg"></image>
				</view>
				<view class="color_919397 timeInfo" v-if="item.type==0">
					<text style="margin-right: 8rpx;">截止时间:</text>
					<text class="color_F74437" v-if="item.expires==true">{{$isEmpty(item.finishTime)?'':item.finishTime.split(' ')[0]}}</text>
					<text v-else>{{$isEmpty(item.finishTime)?'':item.finishTime.split(' ')[0]}}</text>
				</view>
				<view class="color_919397 timeInfo" v-else>
					<text>已重复{{$isEmpty(item.repeatTime)?'0':item.repeatTime}}次</text>
				</view>
			</view>
			<view class="color_303031 bold title" style="display: flex;">
				<image v-if="oss && item.allocationType!=0" :src="oss+'pic_taskList_reward.png'" style="width: 36rpx;height: 36rpx;margin-right: 10rpx;"></image>
				<view class="doubleEllipsis" style="flex: 1;">{{$isEmpty(item.title)?'':item.title}}</view>
			</view>
			<view class="flexRow color_919397 orgName">
				<view>
					{{$isEmpty(item.orgName)?'':item.orgName}}
				</view>
				<view class="flexRowStart">
					<text>进度:</text>
					<text class="color_3CD489" style="margin-left:8rpx;">{{$isEmpty(item.plan)?'0':item.plan}}%</text>
				</view>
			</view>
		</view>
		<image class="emptyImg" v-if="!searchTaskList.length>0 && oss" :src="oss+'pic_energy_default_wujilu.png'" mode="aspectFit"></image>
		<uni-load-more :status="taskListMoreStatus" v-if="searchTaskList.length>0"></uni-load-more>
		<view class="bottom-safe" style="height: 112rpx;"></view>
	</view>
	</view>
</template>

<script>
	import {
		imageError
	} from '@/common/utils.js';
	export default {
		data() {
			return {
				searchText: '',
				searchTaskInfo: {},
				taskListMoreStatus: '',
				searchTaskList: [],
				oss: ''
			};
		},
		onLoad() {
			this.oss = this.$oss
		},
		onReachBottom() {
			// console.log(666)
			let that = this;
			if (that.searchTaskInfo.current < that.searchTaskInfo.pages) {
				// console.log(6)
				that.taskListMoreStatus = 'loading';
				that.$http.get('qms/cooperation_list/task_work/page', {
					params: {
						name: that.searchText,
						current: that.searchTaskInfo.current + 1
					}
				}).then(res => {
					// console.log(res)
					that.searchTaskInfo.current = res.data.data.current;
					// console.log(that.joinCurrent)
					that.searchTaskList = that.searchTaskList.concat(res.data.data.records)
					that.taskListMoreStatus = 'more';
				});
			} else {
				// console.log(9)
				that.taskListMoreStatus = 'noMore';
			}
		},
		methods: {
			imageError,
			search() {
				if (this.searchText.length == 0) {
					this.searchTaskInfo = {}
					this.searchTaskList = []
				} else {
					this.$http
						.get('qms/cooperation_list/task_work/page', {
							params: {
								name: this.searchText
							}
						})
						.then(res => {
							// console.log(res)
							this.searchTaskInfo = res.data.data
							this.searchTaskList = res.data.data.records
							if (this.searchTaskInfo.current == this.searchTaskInfo.pages) {
								this.taskListMoreStatus = 'noMore'
							} else if (this.searchTaskInfo.pages == 0) {
								this.taskListMoreStatus = 'noMore'
							}
						});
				}
			},
			goTskDetail(item) {
				uni.navigateTo({
					url: `/pages/ican/taskDetail/taskDetail?taskId=${item.id}`
				})
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

			.avatarImg {
				width: 40rpx;
				height: 40rpx;
				border-radius: 50%;
				margin-right: 20rpx;
			}

			.userName {
				font-size: 28rpx;
				line-height: 40rpx;
				margin-right: 10rpx;
			}

			.officialImg {
				width: 28rpx;
				height: 28rpx;
			}

			.timeInfo {
				font-size: 24rpx;
				line-height: 34rpx;
			}

			.title {
				margin-top: 30rpx;
				margin-bottom: 30rpx;
				font-size: 28rpx;
				line-height: 36rpx;
			}

			.line {
				height: 0.3rpx;
				width: 100%;
				background-color: #EFF0F1;
				margin-bottom: 26rpx;
			}

			.orgName {
				font-size: 24rpx;
				line-height: 34rpx;
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
