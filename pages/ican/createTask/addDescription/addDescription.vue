<template>
	<view class="container">
		<view class="content">
			<view class="wrap">
				<textarea focus v-model="description" placeholder-class="contentInfoDefault" 
				placeholder="您可以添加任务的背景，目的，质量要求和一些特殊要求的内容。精准、客观的需求描述更利于相互协作哦～" 
				@input="checkInfo" maxlength="500"/>
				<view class="color_BABEC0 remark">
				你还可以输入{{limitNum}}字
				</view>
			</view>
		</view>
		<view class="btn">
			<view class="button save" @tap="checkDescription">
				保存
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				limitNum:500,
				description:''
			};
		},
		onLoad(options) {
			const{description} = options
			this.description = description
			this.limitNum = 500 - this.description.length
		},
		methods:{
			checkDescription(){
				uni.$emit('add',this.description)
				uni.navigateBack({
					delta:1
				})
				// console.log(this.description)
			},
			checkInfo(e){
				// console.log(e)
				this.limitNum=500-e.detail.cursor
			},
		}
	}
</script>

<style lang="scss">
	.contentInfoDefault{
		font-size:28rpx;
		line-height:56rpx;
		color:#BCC4CB;
	}
.container{
	.content{
		margin: 60rpx 40rpx;
		.wrap{
			position: relative;
			textarea{
				width: 610rpx; 
				color: #666769; 
				padding:26rpx 30rpx 80rpx 30rpx;
				background-color: #F4F5F6;
				border-radius:30rpx;
				height:888rpx;
				font-size: 28rpx;
				line-height: 48rpx;
			}
			.remark{
				font-size: 24rpx;
				line-height: 48rpx; 
				position:absolute;
				bottom: 16rpx;right: 40rpx;
			}
		}
	}
	.btn{
		width: 100%; 
		background-color: #FFFFFF;
		z-index: 666; 
		position: fixed;
		bottom: 0rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		.save{
			width:686rpx;
			margin: 24rpx 32rpx
		}
	}
}
</style>
