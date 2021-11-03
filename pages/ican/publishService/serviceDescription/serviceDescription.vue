<template>
	<view>
		<scroll-view scroll-y :style="{height: swiperHeight + 'px'}">
			<view class="content">
				<textarea class="textarea" v-model="value" auto-height  maxlength="1000"></textarea>
				<view class="" style="position: absolute;color: #BCC4CB;bottom: 0;right: 0;">
					{{num}}/1000
				</view>
			</view>
		</scroll-view>
		<view class="bottom-button-box safe-bottom">
			<view class="botton-button-list">
				<view class="button" style="width: 100%;" @tap="save">完成</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				swiperHeight: 0,
				value: '',
			};
		},
		computed:{
			num(){
				return this.value.length
			}
		},
		onLoad(options) {
			if(options.description){
				this.value = options.description
			}
			uni.createSelectorQuery()
				.select('.bottom-button-box')
				.boundingClientRect(this)
				.exec(ret => {
					let height = uni.getSystemInfoSync().windowHeight;
					this.swiperHeight = height - ret[0].height
				})
		},
		methods: {
			save() {
				uni.$emit('description',this.value)
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss">
	.content {
		padding: 32rpx 0 88rpx;
		margin: 0 32rpx;
		// border-bottom: 1rpx solid #EFF0F1;
		position: relative;
		.input {
			line-height: 40rpx;
			min-height: 40rpx;
		}
		.textarea {
			width: 686rpx;
			font-size: 32rpx;
			line-height: 32rpx;
			min-height: 300rpx;
		}
	}

	.bottom-button-box {
		width: 100%;
		position: fixed;
		bottom: 0;
		.botton-button-list {
			padding: 24rpx 32rpx;

			.bottom-button {
				height: 72rpx;
				line-height: 72rpx;
				border-radius: 20rpx;
				background-color: #F74437;
				color: #FFFFFF;
				font-size: 32rpx;
				font-weight: bold;
				text-align: center;
			}
		}

	}
</style>
