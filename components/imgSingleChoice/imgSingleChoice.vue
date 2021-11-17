<template>
	<view>
		<view class="title bold color_303031">
			<text :class="{color_F74437:optionList.isRequire==1}"><text class="color_F74437" v-if="optionList.isRequire==1">*</text>{{$isEmpty(optionList.orderNumber)?'0':optionList.orderNumber}}、</text><text>{{$isEmpty(optionList.title)?'':optionList.title}}<text
				 class="color_919397">(单选题)</text></text>
		</view>
		<view class="uni-list">
			<radio-group class="select" @change="changeRadio" :name="optionList.id">
				<label v-for="(item,index) of optionList.optionListVO" :key="index" class="uni-list-cell uni-list-cell-pd showList">
					<view class="flexRow" style="align-items: flex-start;">
						<view class="titleName">{{index+1}}、{{$isEmpty(item.name)?'':item.name}}</view>
						<view class="content">
							<radio :value="item.name" color="#46B28B" :disabled="status" v-if="isLogin==false && status==true"/>
							<radio :value="item.name" color="#46B28B" :checked="item.isSelected == 1 && status == true" :disabled="status==true" v-else/>
						</view>
					</view>
					<view class="" style="text-align: center;">
						<image class="img" :src="item.url"></image>
					</view>
				</label>
			</radio-group>
		</view>
		<view class="uni-list analyze" v-if="status==true">
			<view class="analyzeList" v-for="(item,index) of showList" :key="index">
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
				answerList: {
					content: '',
					optionId: '',
					questionId: '',
					questionnaireId: ''
				}
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
				this.optionList = n
				this.showList = n.optionListVO.map(item => {
					return { ...item,
						checked: false,
						progress:item.total.replace('%','')
					}
				})
				deep:true
			}
		},
		onReady() {
			// console.log(this.optionList)
			if(this.status == false){
				this.showList = this.optionList.optionListVO.map(item => {
					return { ...item,
						checked: false
					}
				})
			}else{
				this.showList = this.optionList.optionListVO.map(item => {
					return { ...item,
						checked: false,
						progress:item.total.replace('%','')
					}
				})
			}
		},
		methods: {
			changeRadio(e) {
				// console.log(e)
				this.showList = this.optionList.optionListVO.filter(item => {
					return item.name == e.detail.value
				})
				// console.log(this.showList)
				// console.log(this.valueInfo)
				this.answerList.content = e.detail.value
				this.answerList.optionId = this.showList[0].id
				this.answerList.questionId = this.showList[0].questionId
				this.answerList.questionnaireId = this.showList[0].questionnaireId
				if (this.optionList.isRequire == 1) {
					this.optionList.isRequire = 2
					this.$emit('click', this.answerList, this.optionList)
				} else if (this.optionList.isRequire == 0) {
					this.$emit('click', this.answerList, this.optionList)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.title {
		font-size: 28rpx;
		line-height: 2;
		margin-bottom: 30rpx;
	}

	.select {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;

		.showList {
			position: relative;
			font-size: 28rpx;
			color: #666769;
			width: 320rpx;
			line-height: 48rpx;
			background-color: #F4F5F6;
			border-radius: 20rpx;
			margin-bottom: 30rpx;
			padding: 20rpx 0rpx;

			.titleName {
				word-break: break-all;
				padding-left: 30rpx;
				word-break: break-all
			}

			.content {
				padding-right: 25rpx;

				radio {
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

	.analyze {
		margin-bottom: 60rpx;

		.analyzeList {
			margin-top: 40rpx;
			position: relative;
			font-size: 28rpx;
			color: #666769;
			line-height: 48rpx;

			.mark {
				margin-bottom: 10rpx;
			}

			.totalMark {
				font-size: 24rpx;
				line-height: 34rpx;
			}
		}
	}
</style>
