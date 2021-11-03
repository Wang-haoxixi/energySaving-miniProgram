<template>
	<view class="container">
		<view class="contentWrap">
			<view class="" style="padding: 16rpx 32rpx;background-color: #FFFFFF;display: flex;align-items: center;justify-content: space-between;">
				<view class="search" @tap="goSearch" style="flex: 1;">
					<image v-if="oss" class="search-icon" :src="oss+'icon_search_gray.png'"></image>
					<input class="search-text" placeholder="搜索" placeholder-class="inputDefault" @input="search" v-model="searchText"
					 disabled="true" />
				</view>
				<image :src="$ossUrl('square_taskList.png')" mode="" style="width: 72rpx;height: 72rpx;margin-left: 24rpx;" @tap="goTaskList"></image>
			</view>
			<view class="" style="padding: 0rpx 24rpx 16rpx;">
				<banner slotNumber="demand_hall_banner" :customStyle="{width:'702rpx'}"></banner>
				<view class="" style="position: relative;">
					<view class="taskList" v-for="(item,index) of taskList" :key="index" @tap="goTskDetail(item)">
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
						<view class="bold title" style="display: flex;align-items: center;">
							<image v-if="oss && item.allocationType!=0" :src="oss+'pic_taskList_reward.png'" style="width: 36rpx;height: 36rpx;margin-right: 10rpx;"></image>
							<view class="doubleEllipsis" style="flex: 1;">{{$isEmpty(item.title)?'':item.title}}</view>
						</view>
						<view class="description doubleEllipsis" v-if="!$isEmpty(item.description)">
							{{item.description}}
						</view>
						<view class="flexRow orgName">
							<view>
								{{$isEmpty(item.orgName)?'':item.orgName}}
							</view>
							<view class="flexRowStart">
								<text style="color:#9AA1A7">进度:</text>
								<text style="color: #57DBB1; margin-left:8rpx;">{{$isEmpty(item.plan)?'0':item.plan}}%</text>
							</view>
						</view>
					</view>
					<image class="emptyImg" v-if="!taskList.length>0 && oss" :src="oss+'pic_noMessage.png'" mode="aspectFit" style="position: relative;"></image>
					<uni-load-more :status="taskStatus" v-if="taskList.length>0"></uni-load-more>
				</view>
				<view class="bottom-safe" style="height: 112rpx;"></view>
			</view>
		</view>
		<view class="addImg" @tap="createTask">
			<image class="img" v-if="oss" :src="oss+'icon_find_attention_add.png'"></image>
		</view>
	</view>
</template>

<script>
	import {
		imageError,
		soImageError
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
		},
		onShow() {
			const page = this.$mp.page
			if (typeof page.getTabBar === 'function' &&  
			    page.getTabBar()) {  
			    page.getTabBar().setData({  
			        selected: 2
			    })  
			}
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
			imageError,
			soImageError,
			goTaskList(){
				uni.navigateTo({
					url: "/pages/find/cooperation/cooperation"
				})
			},
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
	.description{
		margin-bottom: 24rpx;
		color: #9AA1A7;
		font-size: 26rpx;
		line-height: 40rpx;
	}
	page{
		background-color: #F5F7F8;
	}
	.addImg {
		position: fixed;
		bottom: 170rpx;
		right: 6rpx;
	
		.img {
			height: 136rpx;
			width: 136rpx;
		}
	}

	.contentWrap {

		.taskList {
			padding: 32rpx 24rpx;
			background-color: #FFFFFF;
			margin-top: 16rpx;
			margin-bottom: 16rpx;
			border-radius: 16rpx;

			.avatarImg {
				width: 36rpx;
				height: 36rpx;
				border-radius: 50%;
				margin-right: 8rpx;
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
				margin: 24rpx 0;
				font-size: 30rpx;
				line-height: 44rpx;
				color: #272727;
			}

			// .line {
			// 	height: 0.3rpx;
			// 	width: 100%;
			// 	background-color: #EFF0F1;
			// 	margin-bottom: 26rpx;
			// }

			.orgName {
				color: #565B5F;
				font-size: 22rpx;
				line-height: 32rpx;
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
		padding: 18rpx 32rpx;
		border-radius: 60rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		background-color: #F5F7F8;
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
