<template>
	<view class="container">
		<view class="contentWrap">
			<view class="search" @tap="goSearch">
				<image v-if="oss" class="search-icon" :src="oss+'icon_search_gray.png'"></image>
				<input class="search-text" placeholder="搜索" placeholder-class="inputDefault" @input="search" v-model="searchText"
				 disabled="true" />
			</view>
			<view class="taskList" v-for="(item,index) of taskList" :key="index" @tap="goTskDetail(item)">
				<view class="flexRowStart">
					<image :src="item.avatar" class="avatarImg"></image>
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
				<view class="line">
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
			<image class="emptyImg" v-if="!taskList.length>0 && oss" :src="oss+'pic_energy_default_wuxinxi.png'" mode="aspectFit"></image>
			<uni-load-more :status="taskStatus" v-if="taskList.length>0"></uni-load-more>
			<view class="bottom-safe" style="height: 112rpx;"></view>
		</view>
		<view class="flexRow wrapBtns">
			<view class="button joinTask" @tap="createTask" style="flex: 1;">
				发布任务
			</view>
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
				taskInfo: {},
				taskList: [],
				taskStatus: 'more',
				oss: ''
			};
		},
		onLoad() {
			this.oss = this.$oss
			this.$http.get('qms/cooperation_list/task_work/page').then(res => {
				// console.log(res)
				this.taskInfo = res.data.data
				this.taskList = this.taskInfo.records
				this.taskList.forEach(item => {
					item.avatar = imageError(item.avatar, this.oss)
				})
				if (this.taskInfo.current == this.taskInfo.pages) {
					this.taskStatus = 'noMore'
				} else if (this.taskInfo.pages == 0) {
					this.taskStatus = 'noMore'
				}
			})
		},
		onReachBottom() {
			let that = this
			if (that.taskInfo.current < that.taskInfo.pages) {
				that.taskStatus = 'loading';
				that.$http.get('qms/cooperation_list/task_work/page', {
					params: {
						current: that.taskInfo.current + 1
					}
				}).then(res => {
					// console.log(res)
					that.taskInfo.current = res.data.data.current;
					that.taskList = that.taskList.concat(res.data.data.records);
					that.taskList.forEach(item => {
						item.avatar = imageError(item.avatar, that.oss)
					})
					that.taskStatus = 'more';
				});
			} else {
				that.taskStatus = 'noMore';
			}
		},
		methods: {
			goSearch() {
				// console.log(666)
				uni.navigateTo({
					url: "/pages/find/taskList/searchTask/searchTask"
				})
			},
			createTask() {
				uni.navigateTo({
					url: "/pages/ican/createTask/createTask"
				})
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
	page {
		background-color: #F5f7f8;
	}

	.contentWrap {
		margin: 0 32rpx;

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

	.wrapBtns {
		background-color: #F4F5F6;
		height: 120rpx;
		width: 670rpx;
		padding: 20rpx 40rpx;
		position: fixed;
		bottom: 0rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}

	.search {
		margin: 16rpx 0;
		padding: 18rpx 32rpx;
		border-radius: 60rpx;
		background-color: #F5f7f8;
		display: flex;
		flex-direction: row;
		align-items: center;
		background-color: #FFFFFF;

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

	.bottom-safe {
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}
</style>
