<template>
	<view>
		<view class="">
			<view class="uni-list">
				<view class="wrap" v-for="(item,index) of searchTaskList" :key="index" @click="goTaskDetail(item)">
					<image class="topMark" v-if="oss && item.isTop==1" :src="oss+'icon_taskList_topMark.png'"></image>
					<view>
						<Your_Exios-Circle :size="15" :percent="item.plan" :direction="180" circleWidth="2" :circleColor="item.taskState==2?'#919397':'#32CDA5'">
							<image class="img" v-show="item.taskState==1" slot="content" :src="oss+'icon_ican_checked.png'" mode="aspectFit"></image>
							 <image class="img" v-show="item.taskState==2" slot="content" :src="oss+'icon_ican_closed.png'" mode="aspectFit"></image>
						</Your_Exios-Circle>
					</view>
					<view class="titleWrap">
						<view class="flexRowStart">
							<image v-if="item.isOfficial!=0 && oss" :src="oss+'icon_taskList_official.png'" style="width: 60rpx;height: 32rpx;margin-right: 10rpx;"></image>
							<image v-if="oss && item.allocationType!=0" :src="oss+'pic_taskList_reward.png'" style="width: 36rpx;height: 36rpx;margin-right: 6rpx;"></image>
							<view class="color_303031 singleEllipsis bold title" :class="{active:item.taskState==1}">
								{{$isEmpty(item.title)?'':item.title}}
							</view>
						</view>
						<view class="color_919397 flexRowStart wrapFinishTime">
							<view class="urgencyStatus flexRowStart" v-if="item.urgency==1 || item.urgency==2">
								<!-- <image v-if="oss" :src="oss+'pic_taskList_urgency.png'" style="width: 28rpx;height: 28rpx;margin-right: 4rpx;"></image> -->
								<view class="color_F74437" v-if="item.urgency==1">紧急</view>
								<view class="color_F74437" v-if="item.urgency==2">非常紧急</view>
							</view>
							<view class="" v-if="item.type==0">
								<view class="color_F74437" v-if="item.expires">{{$isEmpty(item.finishTime)?'':item.finishTime}}</view>
								<view v-else>{{$isEmpty(item.finishTime)?'':item.finishTime}}</view>
							</view>
							<view class="" v-else>
								<view class="">
									已重复{{$isEmpty(item.repeatTime)?'0':item.repeatTime}}次
								</view>
							</view>
						</view>
					</view>
					<image class="imgAvatar" :src="item.avatar">
					</image>
					<view class="readMark" v-if="item.haveRead==0">
						
					</view>
				</view>
			</view>
			<image class="emptyImg" v-if="!searchTaskList.length > 0 && oss" :src="oss+'pic_energy_default_wujilu.png'" mode="aspectFit"></image>
			<uni-load-more :status="taskListMoreStatus" v-if="searchTaskList.length > 0"></uni-load-more>
			<view class="bottom-safe" style="height: 112rpx;"></view>
		</view>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		props: {
			searchTaskList: Array,
			taskListMoreStatus:{
				default:'more'
			}
		},
		components: {
			uniLoadMore
		},
		data() {
			return {
				oss:''
			};
		},
		onReady() {
			// console.log(this.searchTaskList)
			this.oss=this.$oss
		},
		methods: {
			goTaskDetail(item) {
				// console.log(item)
				uni.navigateTo({
					url: `/pages/ican/taskDetail/taskDetail?taskId=${item.id}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.topMark{
		width: 60rpx;
		height: 32rpx;
		position: absolute;
		top: 0rpx;
		left: 0rpx;
	}
	.active {
		text-decoration: line-through;
		color: #919397
	}
	.wrap{
		position: relative; 
		border-radius:30rpx ; 
		// width: 670rpx;
		height: 136rpx;
		background-color: #F4F5F6;
		margin-bottom: 30rpx;
		display: flex;
		justify-content:center;
		align-items: center;
		.titleWrap{
			width: 432rpx;
			margin-left: 34rpx;
			margin-right:20rpx;
			.title{
				flex: 1;
				font-size: 28rpx
			}
			.wrapFinishTime{
				font-size: 20rpx;
				font-weight: 400;
				padding-top:12rpx;
				.urgencyStatus{
					font-size: 20rpx;
					line-height: 28rpx;
					margin-right: 30rpx;
				}
				.line{
					font-size: 18rpx; 
					margin-right: 20rpx;
					margin-left: 20rpx;
				}
			}
		}
	}
	.img{
		width: 100%;
		height: 100%;
	}
	.imgAvatar{
		width: 92rpx;
		height: 92rpx;
		border-radius: 100%;
	}
	.readMark{
		width: 16rpx;
		height: 16rpx;
		background-color: #F74437;
		border-radius: 50%; 
		position: absolute;
		right: 34rpx;
		top: 28rpx;
	}
	.emptyImg{
		width: 100%;
	}
	.bottom-safe {
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}
	
</style>
