<template>
	<view>
		<view class="color_303031 title bold">
			<text :class="{color_F74437:optionList.isRequire==1}"><text class="color_F74437" v-if="optionList.isRequire==1">*</text>
				{{$isEmpty(optionList.orderNumber)?'0':optionList.orderNumber}}、</text><text>{{$isEmpty(optionList.title)?'':optionList.title}}<text
				 class="color_919397">(多选题<text v-if="optionList.minNum">:最少{{$isEmpty(optionList.minNum)?'0':optionList.minNum}}个</text><text
					 v-if="optionList.maxNum">,最多{{$isEmpty(optionList.maxNum)?'0':optionList.maxNum}}个</text><text>)</text></text></text>
		</view>
		<view class="uni-list">
			<checkbox-group class="checkboxGroup" @change="checkboxChange">
				<label v-for="(item,index) of showList" :key="index" class="uni-list-cell uni-list-cell-pd showList">
					<view class="flexRow" style="align-items: flex-start;">
						<view class="titleName">{{index+1}}、{{$isEmpty(item.name)?'':item.name}}</view>
						<view class="content">
							<checkbox color="#FF6034" :value="item.name" :disabled="status" v-if="isLogin==false && status==true"/>
							<checkbox color="#FF6034" :value="item.name" :disabled="item.checked || status==true" :checked="item.isSelected==1 && status==true" v-else/>
						</view>
					</view>
					<view class="" style="text-align: center;">
						<image class="img" :src="item.url"></image>
					</view>
				</label>
			</checkbox-group>
		</view>
		<view class="uni-list analyze" v-if="status==true">
			<view class="color_666769 analyzeList" v-for="(item,index) of showList" :key="index">
				<view class="flexRow">
					<view class="color_F74437 mark" v-if="item.isSelected==1 && isLogin"><text>{{index+1}}、</text> <text>{{$isEmpty(item.count)?'0':item.count}}</text></view>
					<view v-else class="mark"><text class="color_666769">{{index+1}}、</text> <text class="color_919397">{{$isEmpty(item.count)?'0':item.count}}</text></view>
					<view v-if="item.isSelected==1 && isLogin" class="color_F74437 totalMark">
						{{$isEmpty(item.total)?'0': item.total}}
					</view>
					<view v-else class="color_666769 totalMark">
						{{$isEmpty(item.total)?'0': item.total}}
					</view>
				</view>
				<progress v-if="item.isSelected==1 && isLogin" :percent="item.progress" border-radius="2px" stroke-width="3px"
				 activeColor="#F74437" backgroundColor="#F4F5F6" />
				<progress v-else :percent="item.progress" border-radius="2px" stroke-width="3px" activeColor="#BABEC0"
				 backgroundColor="#F4F5F6" />
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
			status: Boolean,
			isLogin:{
				type:Boolean,
				default:false
			}
		},
		data() {
			return {
				showList: [],
				maxNum: 0,
				answerList: {
					content: '',
					optionId: '',
					questionId: '',
					questionnaireId: ''
				},
				showAnswerList: [],
				nameList: [],
				idList: [],
				copyOptionList: []
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
				// console.log("optionList",this.optionList)
				this.showList = n.optionListVO.map(item => {
					return { ...item,
						checked: false,
						progress:item.total.replace('%','')
					}
				})
				this.maxNum = this.optionList.maxNum
				deep:true
			}
		},
		onReady() {
			this.copyOptionList = JSON.parse(JSON.stringify(this.optionList))
			// console.log("optionList",this.optionList)
			if(this.status ==true){
				this.showList = this.optionList.optionListVO.map(item => {
					return { ...item,
						checked: false,
						progress:item.total.replace('%','')
					}
				})
			}else{
				this.showList = this.optionList.optionListVO.map(item => {
					return { ...item,
						checked: false
					}
				})
			}
			this.maxNum = this.optionList.maxNum
			// console.log(this.showList)
			// console.log(this.maxNum)
		},
		methods: {
			checkboxChange(e) {
				// console.log(666)
				this.nameList = []
				this.idList = []
				// console.log(e)
				// this.optionList.isRequire=1
				this.showAnswerList = []
				// console.log(this.showList)
				if (e.detail.value.length > this.maxNum) {
					// console.log(666)
					let values = e.detail.value
					this.showList.forEach(item => {
						if (!values.includes(item.name)) {
							item.checked = true
						}
					})
					if (values.length != this.showList.length) {
						uni.showToast({
							icon: "none",
							title: `最多只能选${this.maxNum}个`,
							duration: 1000
						})
					}
				} else {
					this.showList.forEach(item => {
						item.checked = false
					})
				}
				// this.answerList
				e.detail.value.forEach(res => {
					// console.log(res)
					this.showList.forEach(resp => {
						if (res == resp.name) {
							// console.log(666)
							this.showAnswerList.push(resp)
						}
					})
				})
				// console.log(this.showAnswerList)
				this.showAnswerList.forEach(item => {
					this.nameList.push(item.name)
					this.idList.push(item.id)
					// console.log(this.nameList)
					// console.log(this.idList)
					this.answerList.content = this.nameList.join(",")
					this.answerList.optionId = this.idList.join(",")
					// console.log(this.answerList)
				})
				if(this.showAnswerList.length>0){
					this.answerList.questionId = this.showAnswerList[0].questionId
					this.answerList.questionnaireId = this.showAnswerList[0].questionnaireId
				}
				if (this.copyOptionList.isRequire == 1 && e.detail.value.length >= this.optionList.minNum) {
					this.optionList.isRequire = 2
					this.$emit('click', this.answerList, this.optionList)
				} else if (this.copyOptionList.isRequire == 1 && e.detail.value.length < this.optionList.minNum) {
					this.optionList.isRequire = 1
					this.$emit('click', this.answerList, this.optionList)
					// console.log(666)
				} else if (this.copyOptionList.isRequire == 0 && e.detail.value.length != 0 && e.detail.value.length >= this.optionList
					.minNum) {
					this.optionList.isRequire = 2
					this.$emit('click', this.answerList, this.optionList)
				} else if (this.copyOptionList.isRequire == 0 && e.detail.value.length != 0 && e.detail.value.length < this.optionList
					.minNum) {
					this.optionList.isRequire = 1
					this.$emit('click', this.answerList, this.optionList)
				} else if (this.copyOptionList.isRequire == 0 && e.detail.value.length == 0) {
					this.optionList.isRequire = 0
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.analyze {
		margin-bottom: 60rpx;

		.analyzeList {
			margin-top: 40rpx;
			position: relative;
			font-size: 28rpx;
			font-weight: 400;
			line-height: 48rpx;

			.flexRow {
				.mark {
					margin-bottom: 10rpx
				}

				.totalMark {
					font-size: 24rpx;
					line-height: 34rpx;
				}
			}
		}
	}

	::v-deep .uni-checkbox-input {
		border-radius: 24rpx;
		// background-color:#FF6034;
	}

	.title {
		font-size: 28rpx;
		line-height: 2;
		margin-bottom: 30rpx;
	}

	.checkboxGroup {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;

		.showList {
			position: relative;
			font-size: 28rpx;
			color: #666769;
			font-weight: 400;
			width: 320rpx;
			line-height: 48rpx;
			background-color: #F4F5F6;
			border-radius: 20rpx;
			margin-bottom: 30rpx;
			padding: 20rpx 0;

			.titleName {
				word-break: break-all;
				padding-left: 30rpx;
				word-break: break-all
			}

			.content {
				padding-right: 25rpx;

				checkbox {
					transform: scale(0.7)
				}
			}

			.img {
				width: 260rpx;
				height: 260rpx;
				border-radius: 20rpx;
			}
		}
	}
</style>
