<template>
	<view>
		<view class="color_303031 title">
			<text :class="{color_F74437:optionList.isRequire==1}"><text class="color_F74437" v-if="optionList.isRequire==1">*</text> {{$isEmpty(optionList.orderNumber)?'0':optionList.orderNumber}}、</text><text>{{$isEmpty(optionList.title)?'':optionList.title}}<text class="color_919397">(填空题)</text></text>
		</view>
			<textarea v-if="isLogin==false && status==true" :disabled="status==true"/>
			<textarea v-else v-model="optionList.contentBySelf" @input.stop="getValueInfo" maxlength="150" :disabled="status==true"/>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			optionList:{
				type:Object
			},
			status:Boolean,
			isLogin:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return{
				answerList:{
					content:'',
					questionId:'',
					questionnaireId:''
				},
				valueInfo:''
			}
		},
		watch:{
			status:function(n,o){
				this.status = n
			},
			isLogin:function(n,o){
				this.isLogin = n
			}
		},
		onReady() {
			// console.log(this.status)
		},
		methods:{
			getValueInfo(e){
				this.valueInfo=e.detail.value
				this.answerList.content=this.valueInfo
				this.answerList.questionId=this.optionList.id
				this.answerList.questionnaireId=this.optionList.questionnaireId
				if(this.optionList.isRequire==1 && this.valueInfo!=''){
					this.optionList.isRequire=2
					this.$emit('click',this.answerList,this.optionList)
				}else if(this.optionList.isRequire==2 && this.valueInfo==''){
					this.optionList.isRequire=1
					this.$emit('click',this.answerList,this.optionList)
				}else if(this.optionList.isRequire==0 && this.valueInfo!=''){
					this.$emit('click',this.answerList,this.optionList)
				}
				// console.log(this.optionList)
			}
		}
	}
</script>

<style lang="scss" scoped>
.title{
	font-size: 28rpx;
	line-height: 2;
}
::v-deep textarea{
		border-radius:20rpx;
		padding: 26rpx; 
		height: 100rpx;
		width: 93%; 
		margin: 30rpx 0;
		background-color:#F4F5F6;
		color:#666769 ;
		font-size:28rpx;
		line-height: 2;
	}
</style>
