<template>
	<view class="introduction">
		{{introduction}}
	</view>
</template>

<script>
	export default {
		data() {
			return {
				introduction: ''
			};
		},
		onLoad(option) {
			this.introduction = option.introduction;
		}
	}
</script>

<style lang="scss">
	.introduction{
		padding: 32rpx;
		color: #666769;
		font-size: 28rpx;
		line-height: 48rpx;
	}
</style>
