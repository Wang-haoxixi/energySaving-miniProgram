<template>
	<view>
		<view class="container">
			<textarea v-model="description" placeholder="请输入答案" maxlength="-1" auto-height="true" style="min-height: 300rpx; width: 670rpx; color:#BABEC0 ;line-height: 40rpx;font-size: 28rpx;"/>
			<view class="bottom-safe" style="height: 112rpx;"></view>
		</view>
		<view class="btn">
			<view class="" style="margin: 20rpx 40rpx 20rpx 40rpx;">
				<view class="button" style="width: 642rpx;" @tap="save">
					保存
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				description:'',
				mark:'',
				data:{
					description:'',
					mark:''
				}
			};
		},
		onLoad(options) {
			const {description,mark} = options
			console.log(description)
			this.description =description
			this.mark =mark
			this.data.description = this.description
			this.data.mark = this.mark
			// console.log(this.mark)
		},
		methods:{
			save(){
				// console.log(this.description)
				this.data.description =this.description
				// console.log(this.data)
				uni.$emit('addInfo',this.data)
				uni.navigateBack({
					delta:1
				})
				// console.log(this.description)
			},
		}
	}
</script>

<style lang="scss">
	.bottom-safe {
			/* iphonex 等安全区设置，底部安全区适配 */
			/* #ifndef APP-NVUE */
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);
			/* #endif */
		}
	.container{
		padding: 40rpx;
	}
.btn {
		width: 100%;
		background-color: #FFFFFF;
		z-index: 666;
		position: fixed;
		z-index: 98;
		bottom: 0rpx;
		padding-bottom: env(safe-area-inset-bottom);
		padding-bottom: constant(safe-area-inset-bottom);
	}
</style>
