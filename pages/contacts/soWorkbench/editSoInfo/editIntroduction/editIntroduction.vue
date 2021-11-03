<template>
	<view>
		<view class="container color_919397">
			<textarea maxlength="1000" v-model="txt" placeholder="请简要描述组织关注的内容和提供的服务" auto-height="true" placeholder-style="color:#BABEC0;" style="width: 100%;padding-bottom: 24rpx;"/>
			<view class="color_BABEC0 numInfo">
				你还可以输入{{$isEmpty(num)?'0':num}}字
			</view>
		</view>
		<view class="bottom-safe" style="height: 112rpx;"></view>
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
			this.txt =options.introduction
		},
		computed:{
			num(){
				if(this.txt.length>=1000){
					return 0
				}else{
					return 1000-this.txt.length	
				}
			}
		},
		methods:{
			addNotice(){
				if(this.txt.length == 0){
					uni.showToast({
						title:"请输入简介内容",
						icon:"none"
					})
				}else{
					uni.$emit('introduction',this.txt)
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
		padding: 40rpx;
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
	.bottom-safe {
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}
</style>
