<template>
	<view class="container">
		<view class="status">
			<image v-if="oss" class="successImg" :src="oss+'pic_energy_activity_purchasesucceeded.png'" mode="aspectFit"></image>
		</view>
		<view class="orgName color_303031 bold" v-if="resultInfo.ticketingType==2 && !this.$isEmpty(resultInfo.money)">
			您已支付{{resultInfo.money}}<text v-if="resultInfo.paymentMethod==2">元</text><text v-if="resultInfo.paymentMethod==1">贝</text>
		</view>
		<view class="color_666769 orgName" v-if="resultInfo.auditStatus==1">
			<!-- 您已成功报名"{{$isEmpty(resultInfo.activityName)?'':resultInfo.activityName}}" -->
			稍后将由主办方审核确认
		</view>
		<view class="color_666769 orgName" v-if="resultInfo.auditStatus==3 || resultInfo.auditStatus==0 ||resultInfo.auditStatus==2 ">
			<!-- 您已成功报名"{{$isEmpty(resultInfo.activityName)?'':resultInfo.activityName}}" -->
			感谢您的参与
		</view>
		<view class="flexRow btns" v-if="resultInfo.organizationInvited==1 && resultInfo.orgAddFlag == 1">
			<view class="button checkInfo" @tap="checkResult">
				查看报名记录
			</view>
			<view class="button goSo" @tap="goSoWorkbench">
				前往活动圈子
			</view>
		</view>
		<view class="checkBtn" v-else>
			<view class="button check"  @tap="checkResult">
				查看报名记录
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				resultInfo:{},
				oss:''
			}
		},
		onLoad(options) {
			const {id}=options
			this.oss=this.$oss
			this.$http.get('qms/conference_ticketing/pay_callback_number/'+ options.id).then(res=>{
				// console.log(res)
				this.resultInfo=res.data.data
			})
		},
		methods:{
			goSoWorkbench(){
				uni.redirectTo({
					url:`/pages/contacts/soWorkbench/soWorkbench?id=${this.resultInfo.orgId}`
				})
			},
			checkResult(){
				uni.redirectTo({
					url:"/pages/my/meeting/meeting"
				})
			}
		}
	}
</script>

<style lang="scss">
.container{
	margin: 100rpx 40rpx;
	.status{
		width: 150rpx;
		height: 150rpx;
		margin: 0 auto;
		margin-bottom: 40rpx;
		.successImg{
			width: 100%;
			height: 100%;
		}
	}
	.orgName{
		margin-bottom: 60rpx;
		font-size: 28rpx; 
		line-height: 48rpx;
		text-align: center;
	}
	.btns{
		width: 100%;
		.checkInfo{
			background:#FFFFFF;
			width: 316rpx;
			// color: #F74437;
			color: #46B28B;
			// border: 2rpx solid #F74437;
			border: 2rpx solid #46B28B;
			margin-right: 30rpx;
		}
		.goSo{
			width: 320rpx;
		}
	}
	.checkBtn{
		display: flex; 
		justify-content: center; 
		align-items: center; 
		width: 100%;
		.check{
			width: 480rpx;
		}
	}
}
</style>
