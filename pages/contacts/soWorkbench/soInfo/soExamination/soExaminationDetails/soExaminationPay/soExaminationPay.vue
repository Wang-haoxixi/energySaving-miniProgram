<template>
	<view class="container">
		<view class="resultImg">
			<image v-if="oss" :src="oss+'ican_questionnaireResult_success.png'" class="img" mode="aspectFit"></image>
		</view>
		<view class="color_666769 resultInfo">
			支付已成功
		</view>
		<view class="resultImg" @tap="goExam">
			<view class="button" style="width: 452rpx;">
				完成
			</view>
		</view>
		<view class="examInfo">
			<view class="flexRow examInfoItem">
				<view class="bold color_303031" style="margin-right: 54rpx;">
					考试名称
				</view>
				<view class="color_919397 singleEllipsis" style="flex: 1;min-width: 0;text-align: right;">
					{{$isEmpty(examName)?'':examName}}
				</view>
			</view>
			<view class="flexRow examInfoItem">
				<view class="bold color_303031">
					支付金额
				</view>
				<view class="color_919397">
					{{$isEmpty(consume)?'':consume}}贝
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				oss:'',
				id:'',
				examName:'',
				consume:''
			};
		},
		onLoad(options) {
			const {id,examName,consume} =options
			console.log(id,examName,consume)
			this.id =id
			this.examName=examName
			this.consume =consume
			this.oss=this.$oss
		},
		methods:{
			goExam(){
				uni.redirectTo({
					url:`/pages/contacts/soWorkbench/soInfo/soExamination/soExaminationList/soExaminationList?manageId=${this.id}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.examInfo{
		font-size: 28rpx;
		line-height: 40rpx;
		.examInfoItem{
			padding: 44rpx 0 24rpx 0;
			border-bottom: 2rpx solid #EFF0F1;
		}
	}
	.resultInfo{
		text-align: center;
		font-size: 28rpx;
		line-height: 48rpx;
		margin-bottom: 40rpx;
	}
.container{
	margin: 120rpx 40rpx;
}
.resultImg{
		display: flex;
		justify-content: center;
		margin-bottom: 40rpx;
		.img{
			width: 150rpx;
			height: 150rpx;
		}
	}
</style>
