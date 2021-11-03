<template>
	<view class="container">
		<view class="title bold color_303031">
			<text :class="{color_F74437:optionList.isRequire==1}"><text class="color_F74437" v-if="optionList.isRequire==1">*</text>{{$isEmpty(optionList.orderNumber)?'0':optionList.orderNumber}}、</text><text>{{$isEmpty(optionList.title)?'':optionList.title}}<text class="color_919397">(下拉选择题)</text></text>
		</view>
		<picker mode="selector" :disabled="status" v-if="isLogin==false && status==true">
			<view class="flexRow picker">
				<view>
					<text class="color_666769 txtTitle">当前选择:</text>
					<text class="color_666769 txt">请选择</text>
				</view>
				<image class="pulldownImg" v-if="oss" :src="oss+'icon_ican_pulldown.png'"></image>
			</view>
		</picker>
		<picker mode="selector" @change="bindPickerChange" :range="pickerList" :value="value" :disabled="status" v-else>
			<view class="flexRow picker">
				<view>
					<text class="color_666769 txtTitle">当前选择:</text>
					<text class="color_666769 txt" v-if="value==''">请选择</text>
					<text class="color_666769 txt" v-else>{{value}}</text>
				</view>
				<image class="pulldownImg" v-if="status==false && oss" :src="oss+'icon_ican_pulldown.png'"></image>
			</view>
		</picker>
		<view class="uni-list analyze" v-if="status==true">
			<view class="analyzeList" v-for="(item,index) of showList" :key="index" >
				<view class="flexRow">
					<view v-if="item.isSelected==1 && isLogin" class="color_F74437 mark"><text>{{index+1}}、</text> <text>{{$isEmpty(item.count)?'0':item.count}}</text></view>
					<view v-else class="mark"><text class="color_666769">{{index+1}}、</text> <text class="color_919397">{{$isEmpty(item.count)?'0':item.count}}</text></view>
					<view v-if="item.isSelected==1 && isLogin" class="color_F74437 totalMark">
						{{$isEmpty(item.total)?'0': item.total}}
					</view>
					<view v-else class="color_666769 totalMark">
						{{$isEmpty(item.total)?'0': item.total}}
					</view>
				</view>
				<progress v-if="item.isSelected==1 && isLogin" :percent="item.progress" border-radius="2px"  stroke-width="3px" activeColor="#F74437" backgroundColor="#F4F5F6"/>
				<progress v-else :percent="item.progress" border-radius="2px"  stroke-width="3px" activeColor="#BABEC0" backgroundColor="#F4F5F6"/>
			</view>
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
		data() {
			return {
				value:"",
				pickerList:[],
				answerList:{
					content:'',
					optionId:'',
					questionId:'',
					questionnaireId:''
				},
				showList:[],
				oss:''
			};
		},
		watch:{
			status:function(n,o){
				this.status = n
			},
			isLogin:function(n,o){
				this.isLogin = n
			},
			optionList:function(n,o){
				if(this.status==true){
					this.value=n.contentBySelf
				}
				this.showList=n.optionListVO.map(item=>{
					return {
						...item,
						progress:item.total.replace('%','')
					}
				})
				// console.log("optionList",this.optionList)
				this.pickerList=n.optionListVO.map(item=>{
					return item.name
				})
			}
		},
		onReady() {
			// console.log(this.optionList)
			this.oss=this.$oss
			if(this.status==true){
				this.value=this.optionList.contentBySelf
				this.showList=this.optionList.optionListVO.map(item=>{
					return {
						...item,
						progress:item.total.replace('%','')
					}
				})
			}else{
				this.showList=this.optionList.optionListVO
			}
			// console.log("optionList",this.optionList)
			this.pickerList=this.optionList.optionListVO.map(item=>{
				return item.name
			})
			// console.log(this.pickerList)
		},
		methods: {
			bindPickerChange(e) {
				// console.log(e)
				let index = e.detail.value
				this.value=this.optionList.optionListVO[index].name
				this.showList=this.optionList.optionListVO.filter(item=>{
					return item.name==this.pickerList[index]
				})
				// console.log(this.showList)
				// let index = e.detail.value
				// console.log(this.optionList)
				// this.value=e.target.value[0]+"-"+e.target.value[1]+"-"+e.target.value[2]
				// this.value=e.target.
				this.answerList.content=this.showList[0].name
				this.answerList.optionId=this.showList[0].id
				this.answerList.questionId=this.showList[0].questionId
				this.answerList.questionnaireId=this.showList[0].questionnaireId
				if(this.optionList.isRequire==1){
					this.optionList.isRequire=2
					this.$emit('click',this.answerList,this.optionList)
				}else if(this.optionList.isRequire==0){
					this.$emit('click',this.answerList,this.optionList)
				}
				// console.log(this.optionList)
			}
		}
	}
</script>

<style lang="scss" scoped>
.container{
	margin-bottom: 30rpx;
	.title{
		font-size: 28rpx;
		line-height: 2;
		margin-bottom: 30rpx;
	}
	.picker{
		border-radius: 20rpx; 
		padding: 20rpx 30rpx;
		background-color: #F4F5F6;
		.txtTitle{
			font-size: 28rpx;
			line-height: 2;
			padding-right: 20rpx;
		}
		.txt{
			font-size: 28rpx;
			line-height: 2;
		}
		.pulldownImg{
			width: 32rpx;
			height: 32rpx;
			border:2rpx dotted #000000;
			float: right;
		}
	}
	.analyze{
		margin-bottom: 60rpx;
		.analyzeList{
			margin-top: 40rpx; 
			position: relative;
			font-size: 28rpx;
			color: #666769;
			line-height: 80rpx;
			.mark{
				margin-bottom: 10rpx;
			}
			.totalMark{
				font-size: 24rpx;
				line-height: 34rpx;
			}
		}
	}
}
</style>
