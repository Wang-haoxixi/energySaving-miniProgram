<template>
	<view>
		<view class="title bold color_303031">
			<text :class="{color_F74437:optionList.isRequire==1}"><text class="color_F74437" v-if="optionList.isRequire==1">*</text> {{$isEmpty(optionList.orderNumber)?'0':optionList.orderNumber}}、</text><text>{{$isEmpty(optionList.title)?'':optionList.title}}<text
				 class="color_919397"></text></text></text>
		</view>
		<view class="uni-list content">
			<view class="checkboxGroup">
				<view v-for="(item,index) of showList" :key="index" class="uni-list-cell uni-list-cell-pd showList">
					<view class="color_666769 titleName">{{index+1}}、{{$isEmpty(item.name)?'':item.name}}</view>
					<view>
						<view class="rates">
							<uni-rate v-if="status == true && isLogin ==false" margin="20" size="40" :disabled="status"></uni-rate>
							<uni-rate v-else margin="20" size="40" :value="item.grade" :disabled="status" @change="rankChange($event,item)"></uni-rate>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-list analyze" v-if="status==true">
			<view class="analyzeList" v-for="(item,index) of showList" :key="index" >
				<view class="flexRow">
					<view v-if="item.isSelected==1&& isLogin" class="color_F74437 mark"><text>{{index+1}}、</text> <text>{{$isEmpty(item.count)?'0':item.count}}</text></view>
					<view v-else class="mark"><text class="color_666769">{{index+1}}、</text> <text class="color_919397">{{$isEmpty(item.count)?'0':item.count}}</text></view>
					<view v-if="item.isSelected==1&& isLogin" class="color_F74437 totalMark">
						{{$isEmpty(item.total)?'0': item.total}}
					</view>
					<view v-else class="color_666769 totalMark">
						{{$isEmpty(item.total)?'0': item.total}}
					</view>
				</view>
				<progress v-if="item.isSelected==1&& isLogin" :percent="item.progress" border-radius="2px"  stroke-width="3px" activeColor="#F74437" backgroundColor="#F4F5F6"/>
				<progress v-else :percent="item.progress" border-radius="2px"  stroke-width="3px" activeColor="#BABEC0" backgroundColor="#F4F5F6"/>
			</view>
		</view>
	</view>
</template>

<script>
	import uniRate from "../uni-icons/uni-icons.vue";
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
				answerList:{
					content:'',
					optionId:'',
					questionId:'',
					questionnaireId:''
				},
				showList: [],
				nameList:[]
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
				this.showList = this.optionList.optionListVO.map(item => {
					return { ...item,checked: false,grades:'',progress:item.total.replace('%','')}
				})
				this.showList.forEach((item)=>{
					if(item.contentBySelf!='' && this.status==true){
						let array = item.contentBySelf.replace("{",'').replace("}",'').split(',')
						array.forEach(items=>{
							let name = items.split(":")[0]
							if(items.split(":")[0]==`"${item.name}"`){
								item.grade=items.split(":")[1]
							}
						})
					}
				})
				deep:true
			}
		},
		onReady() {
			if(this.status==true){
				this.showList = this.optionList.optionListVO.map(item => {
					return { ...item,checked: false,grades:'',progress:item.total.replace('%','')}
				})
			}else{
				this.showList = this.optionList.optionListVO.map(item => {
					return { ...item,checked: false,grades:''}
				})
			}
			this.showList.forEach((item)=>{
				// console.log(item.contentBySelf)
				// console.log(item)
				if(item.contentBySelf!='' && this.status==true){
					// console.log(item.contentBySelf)
					let array = item.contentBySelf.replace("{",'').replace("}",'').split(',')
					// console.log(array)
					array.forEach(items=>{
						// console.log(items.split(":")[0])
						// console.log(item.name)
						// console.log(items.split(":")[0]==`"${item.name}"`)
						// console.log(items)
						let name = items.split(":")[0]
						if(items.split(":")[0]==`"${item.name}"`){
							// console.log(666)
							item.grade=items.split(":")[1]
						}
					})
					// console.log(array[index])
				}
			})
		},
		methods:{
			rankChange(e,item) {
				// console.log(item)
				// console.log(e)
				this.nameList=[]
				this.idList=[]
				// this.optionList.isRequire=1
				this.showAnswerList=[]
				item.grade = e.value
				item.grades= `"${item.name}":${item.grade}`
				item.checked=true
				// console.log(this.optionList)
				// console.log(this.showList)
				this.showList.forEach(item=>{
					if(item.checked==true){
						// console.log(666)
						this.nameList.push(item.grades)
						this.idList.push(item.id)
					}
				})
				// console.log(this.idList)
				let all = this.showList.every(item=>{
					return item.checked==true
				})
				this.answerList.content="{"+this.nameList.join(",")+"}"
				this.answerList.optionId=this.idList.join(",")
				this.answerList.questionId=item.questionId
				this.answerList.questionnaireId=item.questionnaireId
				// console.log(this.answerList)
				if(this.optionList.isRequire==1 && all==true){
					// console.log(666)
					this.optionList.isRequire=2
					this.$emit('click',this.answerList,this.optionList)
				}else if(this.optionList.isRequire==0){
					this.optionList.isRequire=2
					this.$emit('click',this.answerList,this.optionList)
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
.title{
	font-size: 28rpx;
	line-height: 2;
	margin-bottom: 30rpx;
}
.content{
	margin-left: 30rpx;
	.titleName{
		font-size: 28rpx
	}
	.rates{
		height: 40rpx;
		display: flex;
		align-items: center;
		margin-left: -20rpx;
		margin-top: 30rpx;
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
</style>
