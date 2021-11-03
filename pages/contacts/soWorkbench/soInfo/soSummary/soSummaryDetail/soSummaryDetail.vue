<template>
	<view class="container">
		<view class="color_303031 bold title">
			{{$isEmpty(summaryInfo.title)?'':summaryInfo.title}}
		</view>
		<view class="color_919397 time">
			<text>{{$isEmpty(summaryInfo.creatorRealName)?'':summaryInfo.creatorRealName}}</text>
			<text>{{$isEmpty(summaryInfo.createTime)?'':summaryInfo.createTime}}</text>
		</view>
		<view class="flexRowStart wrapTag">
			<view class="color_919397 tag" v-for="(item,index) of summaryInfo.tagKeyWords" :key="index">
				{{$isEmpty(item)?'':item}}
			</view>
		</view>
		<view class="color_303031 bold contentTitle">
			会议内容
		</view>
		<jyf-parser v-if="!$isEmpty(summaryInfo.meetingContent)" class="color_666769" :html="summaryInfo.meetingContent" :tag-style="tagStyle" img-mode="widthFix" style="margin-bottom: 40rpx;"></jyf-parser>
		<view class="color_303031 bold contentTitle">
			会议总结
		</view>
		<view class="color_666769 meetingCon">
			{{$isEmpty(summaryInfo.meetingCon)?'':summaryInfo.meetingCon}}
		</view>
		<view class="color_303031 bold contentTitle">
			感想与困惑
		</view>
		<view class="color_666769 thoughtsProblem">
			{{$isEmpty(summaryInfo.thoughtsProblem)?'':summaryInfo.thoughtsProblem}}
		</view>
		<view class="color_303031 bold contentTitle">
			基本信息
		</view>
		<view class="color_666769 info">
			<view class="wrapInfo">
				<text class="wrapInfoTitle">
					主持人:
				</text>
				<text class="">
					{{$isEmpty(host.name)?'':host.name}}
				</text>
			</view>
			<view class="wrapInfo">
				<text class="wrapInfoTitle">
					参会人:
				</text>
				<text class="">
					<text style="margin-right: 10rpx;" v-for="(item,index) of attendee" :key="index">{{$isEmpty(item.name)?'':item.name}}</text>
				</text>
			</view>
			<view class=" wrapInfo">
				<text class="wrapInfoTitle">
					抄送人:
				</text>
				<text class="">
					<text style="margin-right: 10rpx;" v-for="(item,index) of receiver" :key="index">{{$isEmpty(item.name)?'':item.name}}</text>
				</text>
			</view>
			<view class=" wrapInfo">
				<text class="wrapInfoTitle">
					会议地点:
				</text>
				<text class="">
					{{$isEmpty(summaryInfo.meetingLocation)?'':summaryInfo.meetingLocation}}
				</text>
			</view>
		</view>
		<view class="bottom-safe" style="height: 112rpx;"></view>
	</view>
</template>

<script>
	import jyfParser from "@/components/jyf-parser/jyf-parser"; 	export default {
		components: {
			jyfParser
		},
		data() {
			return {
				summaryInfo:{},
				host:{},
				receiver:[],
				attendee:[],
				tagStyle: {
					body: 'line-height: 2;',
					img: 'background-size: contain|cover;width:100%;height:auto;'
				}
			};
		},
		onLoad(options) {
			const {id}=options
			this.$http.get('dms/meeting_summary/'+id).then(res=>{
				console.log(res)
				if(res.data.code == 1){
					uni.showToast({
						title:res.data.message,
						icon:"none",
						duration:1000,
						success: () => {
							setTimeout(()=>{
								uni.navigateBack({
									delta:1
								})
							},1000)
						}
					})
				}else{
					this.summaryInfo=res.data.data
					this.host=this.summaryInfo.host
					this.receiver=this.summaryInfo.receiver.users
					this.attendee=this.summaryInfo.attendee.users
				}
			})
		}
	}
</script>

<style lang="scss">
.container{
	padding: 40rpx 36rpx;
	.title{
		font-size: 32rpx;
		line-height: 44rpx;
		margin-bottom: 40rpx;
	}
	.time{
		font-size: 24rpx;
		line-height: 34rpx;
		margin-bottom: 30rpx;
	}
	.wrapTag{
		margin-bottom: 40rpx;
		.tag{
			margin-right: 20rpx;
			padding: 6rpx 16rpx;
			background-color: #F4F5F6;
			border-radius: 10rpx;
			font-size: 22rpx;
			line-height: 32rpx;
		}
	}
	.contentTitle{
		font-size: 32rpx;
		line-height: 44rpx;
		margin-bottom: 34rpx;
	}
	.meetingCon{
		font-size: 28rpx;
		line-height: 40rpx;
		margin-bottom: 40rpx;
	}
	.thoughtsProblem{
		font-size: 28rpx;
		line-height: 40rpx;
		margin-bottom: 40rpx;
	}
	.info{
		font-size: 28rpx;
		line-height: 40rpx;	
		.wrapInfo{
			margin-bottom: 12rpx;
			.wrapInfoTitle{
				margin-right: 14rpx;
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
