<template>
	<view class="container">
		<view v-if="slogan==''" class="color_919397 slogan">
			暂无口号
		</view>
		<view v-else class="color_919397 slogan">
			{{$isEmpty(slogan)?'': slogan}}
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				slogan:''
			}
		},
		onLoad(options) {
			const{slogan}=options
			console.log(slogan)
			this.slogan=slogan
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
.container{
	padding: 40rpx;
	.slogan{
		font-size: 28rpx;
		line-height: 2;
	}
}
</style>
