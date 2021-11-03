<template>
	<view class="bottom">
		<view class="bottom-item">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">
	.bottom {
		width: 750rpx;
		position: fixed;
		// height: 112rpx;
		bottom: 0rpx;
		background-color: #FFFFFF;
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

		/* #endif */
		.bottom-item {
			display: flex;
			align-items: center;
			margin: 24rpx 32rpx; 
		}
	}
</style>
