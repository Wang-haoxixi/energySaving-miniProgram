<template>
	<view>
		<view class="title bold color_303031">
			<text :class="{color_F74437:optionList.isRequire==1}"><text class="color_F74437" v-if="optionList.isRequire==1">*</text>{{$isEmpty(optionList.orderNumber)?'0':optionList.orderNumber}}、</text><text>{{$isEmpty(optionList.title)?'':optionList.title}}<text
				 class="color_919397">(单选题)</text></text>
		</view>
		<view class="uni-list">
			<radio-group @change="changeRadio">
				<view class="showList" :class="{active:item.type==2}" v-for="(item,index) of copyShowList" :key="index">
					<label class="uni-list-cell uni-list-cell-pd">
						<view class="flexRow" style="align-items: flex-start;word-break: break-all;">
							<view>{{index+1}}、{{$isEmpty(item.name)?'':item.name}}</view>
							<view>
								<radio :value="item.name" color="#FF6034" :disabled="status" v-if="isLogin==false&&status==true"/>
								<radio :value="item.name" color="#FF6034" :disabled="status" :checked="status==true&&item.isSelected==1" v-else />
							</view>
						</view>
					</label>
					<textarea :id="index" v-if="item.type==2 && isLogin==false && status==true" :disabled="status==true" />
					<textarea :id="index" v-else-if="item.type==2" maxlength="50" v-model="item.info" @input.stop="getValueInfo" :disabled="status==true || item.textareaStatus==true" />
				</view>
			</radio-group>
		</view>
		<view class="uni-list analyze" v-if="status==true">
			<view class="analyzeList" v-for="(item,index) of copyShowList" :key="index">
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
			status:{
				type:Boolean,
				default:false
			},
			isLogin:{
				type:Boolean,
				default:false
			}
		},
		data() {
			return {
				answerList:{
					content:'',
					optionId:'',
					questionId:'',
					questionnaireId:''
				},
				showList:[],
				copyShowList:[],
				valueInfo:''
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
				this.copyShowList=n.optionListVO.map(item=>{
					return {...item,checked:false,info:'',textareaStatus:true,progress:item.total.replace('%','')}
				})
				this.copyShowList.forEach(item=>{
					if(item.isSelected==1 && this.status==true && item.contentBySelf!=''){
						item.info = item.contentBySelf.split("^")[1]
					}
				})
			}
		},
		onReady() {
			if(this.status == false){
				this.copyShowList=this.optionList.optionListVO.map(item=>{
					return {...item,checked:false,info:'',textareaStatus:true}
				})
			}else{
				this.copyShowList=this.optionList.optionListVO.map(item=>{
					return {...item,checked:false,info:'',textareaStatus:true,progress:item.total.replace('%','')}
				})
			}
			this.copyShowList.forEach(item=>{
				if(item.isSelected==1 && this.status==true && item.contentBySelf!=''){
					item.info = item.contentBySelf.split("^")[1]
				}
			})
		},
		methods:{
			getValueInfo(e){
				// console.log(e)
				this.valueInfo=e.detail.value
				this.showList.forEach((item,index)=>{
					if(e.currentTarget.id==index){
						item.info=this.valueInfo
					}
				})
				// console.log(this.showList)
				this.answerList.content=this.showList[0].name+'^'+this.showList[0].info
				this.$emit('click',this.answerList,this.optionList)
			},
			changeRadio(e){
				// console.log(e)
				// console.log(this.copyShowList)	
				this.copyShowList.forEach(item=>{
					item.info=''
					item.textareaStatus=true
					if(item.name==e.detail.value){
						item.textareaStatus=false
					}
				})
				// console.log(this.copyShowList)
				this.showList=this.copyShowList.filter(item=>{
					return item.name==e.detail.value
				})
				// console.log(this.showList)
				// console.log(this.showList)
				// console.log(this.optionList)
				// console.log(this.valueInfo)
				this.answerList.content=e.detail.value
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
	.title{
		font-size: 28rpx;
		line-height: 2;;
	}
	.showList{
		margin-top: 30rpx; 
		position: relative;
		font-size: 28rpx;
		color: #666769;
		line-height: 48rpx;
		background-color: #F4F5F6;
		border-radius:20rpx;
		padding: 20rpx 30rpx;
		radio{
			transform:scale(0.7)
		}
	}
	.analyze{
		margin-bottom: 60rpx;
		.analyzeList{
			margin-top: 40rpx; 
			position: relative;
			font-size: 28rpx;
			color: #666769;
			line-height: 48rpx;
			.mark{
				margin-bottom: 10rpx;
			}
			.totalMark{
				font-size: 24rpx;
				line-height: 34rpx;
			}
		}
	}
	.active{
		padding-bottom: 30rpx;
	}
	::v-deep textarea{
		background-color: #FFFFFF; 
		width:85%;
		height:80rpx;
		border-radius:20rpx;
		line-height: 2;
		padding: 20rpx;
		overflow: hidden;
	}
</style>
