<template>	<view>		<view class="">			<view class="uni-list">				<view v-for="(item,index) of list" :key="index" v-if="taskStatus=='1'?index<=19:index<=9" @click.stop="goTaskDetail(item)" class="container">
					<image class="topMark" v-if="oss && item.isTop==1" :src="oss+'icon_taskList_topMark.png'"></image>					<view>						<Your_Exios-Circle :size="15" :percent="item.plan" :direction="180" circleWidth="2" :circleColor="item.taskState==2?'#666769':'#32CDA5'">							<image class="img" slot="content" v-show="item.taskState==1 && oss" :src="$ossUrl('icon_ican_checked.png')" mode="aspectFit"></image>
							<image class="img" slot="content" v-show="item.taskState==2 && oss" :src="$ossUrl('icon_ican_closed.png')" mode="aspectFit"></image>						</Your_Exios-Circle>					</view>					<view class="wrap">						<view class="flexRowStart">							<image v-if="item.isOfficial!=0 && oss" :src="oss+'icon_taskList_official.png'" style="width: 60rpx;height: 32rpx;margin-right: 10rpx;"></image>
							<image v-if="oss && item.allocationType!=0" :src="oss+'pic_taskList_reward.png'" style="width: 36rpx;height: 36rpx;margin-right: 6rpx;"></image>							<view class="singleEllipsis bold title" :class="item.taskState==1||item.taskState==2?'active':'unactive'">								{{$isEmpty(item.title)?'':item.title}}							</view>						</view>						<view class="color_919397 flexRowStart wrapFinishTime">							<view class="urgencyStatus flexRowStart" v-if="item.urgency==1 || item.urgency==2">								<!-- <image v-if="oss" :src="oss+'pic_taskList_urgency.png'" style="width: 28rpx;height: 28rpx;margin-right: 4rpx;"></image> -->								<view class="color_F74437" v-if="item.urgency==1">紧急</view>								<view class="color_F74437" v-if="item.urgency==2">非常紧急</view>							</view>							<view class="" v-if="item.type==0">								<view class="color_F74437" v-if="item.expires">{{$isEmpty(item.finishTime)?'':item.finishTime}}</view>								<view v-else>{{$isEmpty(item.finishTime)?'':item.finishTime}}</view>							</view>							<view class="" v-else>								<view class="">									已重复{{$isEmpty(item.repeatTime)?'0':item.repeatTime}}次								</view>							</view>						</view>					</view>					<image :src="item.avatar" class="imgAvatar">					</image>					<view v-if="item.haveRead==0" class="readMark">											</view>				</view>				<view class="color_2F80FF checkMore" v-if="taskStatus=='1'? countNum>20:countNum>10" @click="goTaskList">					查看更多>				</view>			</view>		</view>	</view></template><script>	export default {		props: {			list: Array,			countNum:Number,			status:Number,
			taskStatus:String		},		data() {			return {				oss:''			};		},		onReady() {			this.oss=this.$oss		},		methods: {			goTaskDetail(item) {				// console.log(item)				uni.navigateTo({					url: `/pages/ican/taskDetail/taskDetail?taskId=${item.id}`				})			},			goTaskList(){
				let code = ''
				if(this.taskStatus == 1){
					code = 'for'
				}else if (this.taskStatus == 2){
					code = 'complete'
				}else if (this.taskStatus == 3){
					code = 'close'
				}else if (this.taskStatus == 4){
					code = 'over'
				}				uni.navigateTo({					url:`/pages/ican/taskList/taskList?state=${code}&status=${this.status}`				})			}		}	}</script><style lang="scss" scoped>
	.topMark{
		width: 60rpx;
		height: 32rpx;
		position: absolute;
		top: 0rpx;
		left: 0rpx;
	}	.active {		color: #919397	}
	.unactive{
		color: #303031;
	}	.container{		position: relative;		border-radius:30rpx ; 		width: 100%;		height: 136rpx;		background-color: #F4F5F6;		margin-bottom: 30rpx;		display: flex;		justify-content:center;		align-items: center;	}	.img{		width: 100%;		height: 100%;	}	.wrap{		width: 432rpx;		margin-left: 34rpx;		margin-right:20rpx;		.title{			flex: 1;			font-size: 28rpx;		}		.wrapFinishTime{			font-size: 20rpx;			font-weight: 400;			padding-top:12rpx;			.urgencyStatus{				font-size: 20rpx;				line-height: 28rpx;				margin-right: 30rpx;			}			.line{				font-size: 18rpx; 				margin-right: 20rpx;				margin-left: 20rpx;			}		}	}	.imgAvatar{		width: 92rpx;		height: 92rpx;		border-radius: 50%;	}	.readMark{		width: 16rpx;		height: 16rpx;		background-color: #F74437;		border-radius: 50%; 		position: absolute;		right: 34rpx;		top: 28rpx;	}	.checkMore{		font-size: 24rpx;		text-align: center;	}</style>