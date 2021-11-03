<template>
	<view>
		<view class="container color_919397">
			<textarea maxlength="50" v-model="txt" placeholder="请输入口号" auto-height="true" placeholder-style="color:#BABEC0;" style="width: 100%;border-bottom: 2rpx solid #EFF0F1;padding-bottom: 24rpx;"/>
			<view class="color_BABEC0 numInfo">
				你还可以输入{{$isEmpty(num)?'0':num}}字
			</view>
		</view>
		<view class="btn">
			<view class="button freeBtn" @tap="addNotice">
				保存
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				txt:''
			};
		},
		onLoad(options) {
			this.txt =options.slogan
		},
		computed:{
			num(){
				if(this.txt.length>=50){
					return 0 
				}else{
					return 50-this.txt.length
				}
			}
		},
		methods:{
			addNotice(){
				if(this.txt.length == 0){
					uni.showToast({
						title:"口号不能为空",
						icon:"none"
					})
				}else{
					uni.$emit('slogan',this.txt)
					uni.navigateBack({
						delta:1
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.numInfo{
		float: right;
		margin-top: 20rpx;
		font-size: 24rpx;
		line-height: 48rpx;
	}
	.container {
		padding: 32rpx;
		position: relative;
	}

	.btn {
		width: 100%;
		background-color: #FFFFFF;
		z-index: 666;
		position: fixed;
		bottom: 0rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

		.freeBtn {
			width: 686rpx;
			margin: 24rpx 32rpx
		}
	}
</style>
