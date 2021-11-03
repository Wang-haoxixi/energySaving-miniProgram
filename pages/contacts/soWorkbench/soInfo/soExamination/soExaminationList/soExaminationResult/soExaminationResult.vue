<template>
	<view class="container">
		<view class="" v-if="code==1">
			<view class="resultImg">
				<image v-if="oss && status==false" :src="oss+'icon_questionnaireResult_fail.png'" class="img" mode="aspectFit"></image>
				<image v-if="oss && status==true" :src="oss+'ican_questionnaireResult_success.png'" class="img" mode="aspectFit"></image>
			</view>
			<view v-if="result=='不及格'" class="color_666769 resultInfo">
				<text>考试</text>
				<text>{{$isEmpty(result)?'': result}}</text>,
				<text>{{$isEmpty(msg)?'':msg}}</text>
			</view>
			<view v-if="result=='及格'" class="color_666769 resultInfo">
				<text>考试</text>
				<text>{{$isEmpty(result)?'': result}}</text>,
				<text>{{$isEmpty(msg)?'':msg}}</text>
			</view>
			<view v-if="result=='优秀'" class="color_666769 resultInfo">
				<text>成绩</text>
				<text>{{$isEmpty(result)?'': result}}</text>,
				<text>{{$isEmpty(msg)?'':msg}}</text>
			</view>
			<view class="flexRowStart resultScore">
				<view class="color_303031">{{score}}</view>
				<view class="color_303031">分</view>
			</view>
			<view class="button" style="width: 452rpx;" @tap="goCheck">
				查看试卷
			</view>
		</view>
		<view class="" v-else-if="code==2">
			<view class="resultImg">
				<image v-if="oss" :src="oss+'ican_questionnaireResult_success.png'" class="img" mode="aspectFit"></image>
			</view>
			<view class="color_666769 resultInfo" style="margin-top: 40rpx;margin-bottom: 60rpx;">
				交卷成功，成绩由人工阅卷最终确定
			</view>
			<view class="button" style="width: 452rpx;" @tap="goBackList">
				返回考试列表
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				oss:'',
				result:'',
				msg:'',
				score:'0.0',
				status:'',
				id:'',
				code:'',
				manageId:''
			};
		},
		onLoad(options) {
			this.oss=this.$oss
			const {id , result ,msg ,score,status,manageId} =options
			console.log(options)
			// console.log(status)
			this.id =id
			this.manageId=manageId
			// console.log(this.id)
			this.result =result
			this.msg =msg
			this.score =score
			this.code = status
			if(this.result=='不及格'){
				this.status =false
			}else if(this.result=='及格' || this.result=='优秀'){
				this.status =true
			}
		},
		methods:{
			goCheck(){
				this.$http.get('qms/exam_answer/check_state_v2/1',{
					params:{
						id:this.id,
						manageId:this.manageId
					}
				}).then(res=>{
					// console.log(res)
					if(res.data.data.code == 20){
						uni.showToast({
							title:res.data.data.hint,
							icon:'none',
							duration:1000
						})
					}else{
						uni.redirectTo({
							url:`/pages/contacts/soWorkbench/soInfo/soExamination/soExaminationList/soExaminationResult/soExaminationAnalyze/soExaminationAnalyze?id=${this.manageId}`
						})
					}
				})
			},
			goBackList(){
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style lang="scss">
.container{
	margin-top: 120rpx;
	display: flex;
	justify-content: center;
	.resultImg{
		display: flex;
		justify-content: center;
		.img{
			margin-bottom: 40rpx;
			width: 150rpx;
			height: 150rpx;
		}
	}
	.resultScore{
		font-size: 76rpx;
		line-height: 106rpx;
		font-weight: 600;
		align-items: flex-end;
		margin-top: 70rpx;
		margin-bottom: 60rpx;
		justify-content: center;
	}
	.resultInfo{
		font-size: 28rpx;
		line-height: 40rpx;
		text-align: center;
	}
}
</style>
