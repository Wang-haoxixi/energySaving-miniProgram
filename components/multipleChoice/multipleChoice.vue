<template>
	<view>
		<view class="title bold color_303031">
			<text :class="{color_F74437:optionList.isRequire==1}"><text class="color_F74437" v-if="optionList.isRequire==1">*</text>{{$isEmpty(optionList.orderNumber)?'0':optionList.orderNumber}}、</text><text>{{$isEmpty(optionList.title)?'':optionList.title}}<text
				 class="color_919397">(多选题<text v-if="optionList.minNum">:最少{{$isEmpty(optionList.minNum)?'0':optionList.minNum}}个</text><text v-if="optionList.maxNum">,最多{{$isEmpty(optionList.maxNum)?'0':optionList.maxNum}}个</text><text>)</text></text></text>
		</view>
		<view class="uni-list">
			<checkbox-group @change="checkboxChange">
				<view class="showList" :class="{active:item.type==2}" v-for="(item,index) of showList" :key="index">
					<label class="uni-list-cell uni-list-cell-pd">
						<view class="flexRow" style="align-items: flex-start;word-break: break-all;">
							<view>{{index+1}}、{{$isEmpty(item.name)?'':item.name}}</view>
							<view>
								<checkbox color="#FF6034" :value="item.name" :disabled="status" v-if="isLogin==false&&status==true"/>
								<checkbox color="#FF6034" :value="item.name" :disabled="item.checked || status==true" :checked="item.isSelected==1" v-else/>
							</view>
						</view>
					</label>
					<textarea :id="index" v-if="item.type==2 && isLogin==false&&status==true" :disabled="status==true" />
					<textarea :id="index" v-else-if="item.type==2" maxlength="50" v-model="item.info" @input.stop="getValueInfo" :disabled="item.checked ||  item.textareaStatus==true || status==true" />
				</view>
			</checkbox-group>
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
		props: {
			optionList: {
				type: Object
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
				showList:[],
				copyShowList:[],
				maxNum:0,
				answerList:{
					content:'',
					optionId:'',
					questionId:'',
					questionnaireId:''
				},
				showAnswerList:[],
				valueInfo:'',
				nameList:[],
				idList:[],
				copyOptionList:[]
			};
		},
		watch:{
			status:function(n,v){
				// console.log(this.status)
				this.status =n
			},
			isLogin:function(n,o){
				this.isLogin = n
			},
			optionList:function(n,v){
				this.copyOptionList = JSON.parse(JSON.stringify(n))
				this.showList=n.optionListVO.map(item=>{
					return {...item,checked:false,textareaStatus:true,title:'',info:''}
				})
				this.copyShowList = this.showList.map(item=>{
					return {
						...item,
						progress:item.total.replace('%','')
					}
				})
				this.maxNum=this.optionList.maxNum
				this.showList.forEach(item=>{
					if(item.isSelected==1 && this.status==true && item.contentBySelf!=''){
						let array = item.contentBySelf.split(",")
						array.forEach(items=>{
							if(items.includes(item.name)){
								item.info = items.split('^')[1]
							}
						})
					}
				})
				deep:true
			}
		},
		onReady() {
			this.copyOptionList = JSON.parse(JSON.stringify(this.optionList))
			this.showList=this.optionList.optionListVO.map(item=>{
				return {...item,checked:false,textareaStatus:true,title:'',info:''}
			})
			if(this.status == false){
				this.copyShowList = this.showList
			}else{
				this.copyShowList = this.showList.map(item=>{
					return {
						...item,
						progress:item.total.replace('%','')
					}
				})
			}
			this.maxNum=this.optionList.maxNum
			// console.log(this.optionList)
			this.showList.forEach(item=>{
				if(item.isSelected==1 && this.status==true && item.contentBySelf!=''){
					let array = item.contentBySelf.split(",")
					array.forEach(items=>{
						if(items.includes(item.name)){
							item.info = items.split('^')[1]
						}
					})
				}
			})
		},
		methods: {
			getValueInfo(e){
				// console.log(e)
				this.nameList=[]
				this.idList=[]
				this.valueInfo=e.detail.value
				this.copyShowList.forEach((item,index)=>{
					if(e.currentTarget.id==index){
						item.info=this.valueInfo
						item.title = item.name +'^'+item.info
					}
				})
				this.showAnswerList.forEach(item=>{
					this.nameList.push(item.title)
					this.idList.push(item.id)
					// console.log(this.nameList)
					// console.log(this.idList)
					this.answerList.content=this.nameList.join(",")
					this.answerList.optionId=this.idList.join(",")
				})
				// console.log(this.copyShowList)
				// console.log(this.answerList)
				// console.log(this.optionList)
				this.$emit('click',this.answerList,this.optionList)
			},
			checkboxChange(e) {
				console.log(this.optionList)
				// console.log(this.optionList)
				this.nameList=[]
				this.idList=[]
				// this.optionList.isRequire=1
				// console.log(this.optionList)
				// console.log(e)
				this.showAnswerList=[]
				let values = e.detail.value
				this.showList.forEach(item=>{
					item.textareaStatus=true
					if(values.includes(item.name)){
						item.textareaStatus=false
					}else{
						item.info=''
					}
				})
				// console.log(e)
				if(e.detail.value.length>=this.maxNum){
					this.showList.forEach(item=>{
						if(!values.includes(item.name)){
							item.checked=true
						}
					})
					if(values.length!=this.showList.length){
						uni.showToast({
							icon:"none",
							title:`最多只能选${this.maxNum}个`,
							duration:1000
						})
					}
				}
				else{
					this.showList.forEach(item=>{
						item.checked=false
					})
				}
				// console.log(this.showList)
				// console.log(this.copyShowList)
				e.detail.value.forEach(res=>{
					// console.log(res)
					this.copyShowList.forEach(resp=>{
						if(res==resp.name){
							// console.log(666)
							this.showAnswerList.push(resp)
						}
					})
				})
				// console.log(this.showAnswerList)
				this.showAnswerList.forEach(item=>{
					if(item.title==''){
						item.title=item.name
					}
					this.nameList.push(item.title)
					this.idList.push(item.id)
					// console.log(this.nameList)
					// console.log(this.idList)
					this.answerList.content=this.nameList.join(",")
					this.answerList.optionId=this.idList.join(",")
				})
				if(this.showAnswerList.length>0){
					this.answerList.questionId=this.showAnswerList[0].questionId
					this.answerList.questionnaireId=this.showAnswerList[0].questionnaireId
				}
				if(this.copyOptionList.isRequire==1 && e.detail.value.length>=this.optionList.minNum){
					// console.log(666)
					this.optionList.isRequire=2
					this.$emit('click',this.answerList,this.optionList)
				}else if(this.copyOptionList.isRequire==1 && e.detail.value.length<this.optionList.minNum){
					this.optionList.isRequire=1
					this.$emit('click',this.answerList,this.optionList)
					// console.log(666)
				}else if(this.copyOptionList.isRequire==0 && e.detail.value.length != 0 && e.detail.value.length<this.optionList.minNum){
					this.optionList.isRequire=1
					this.$emit('click',this.answerList,this.optionList)
				}else if(this.copyOptionList.isRequire==0 && e.detail.value.length != 0 && e.detail.value.length>=this.optionList.minNum){
					this.optionList.isRequire=2
					this.$emit('click',this.answerList,this.optionList)	
				}else if(this.copyOptionList.isRequire==0 && e.detail.value.length == 0 && this.optionList.isRequire==1){
					this.optionList.isRequire=0
					// console.log(this.optionList)
					this.$emit('click',this.answerList,this.optionList)	
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.title{
		font-size: 28rpx;
		line-height: 2
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
		checkbox{
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
	::v-deep .uni-checkbox-input {
		border-radius: 24rpx;
		// background-color:#FF6034;
	}
	::v-deep textarea{
		background-color: #FFFFFF; 
		width:85%;
		height:80rpx;
		border-radius:20rpx;
		line-height: 2;
		overflow: hidden;
		padding: 20rpx;
	}
	.active {
		padding-bottom: 30rpx;
	}
</style>
