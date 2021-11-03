<template>
	<view>
		<textarea class="text-area" v-model="ability" :maxlength="500" placeholder="请填写能力与优势"></textarea>
		<view class="bottom-button-box safe-bottom">
			<view class="bottom-button" @tap="saveAbility">确定</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				ability: ''
			};
		},
		onLoad ({ability}) {
			this.ability = ability
		},
		methods: {
			saveAbility () {
				if (this.ability.trim()) {
					let pages = getCurrentPages()
					let beforePage = pages[pages.length - 2]
					uni.navigateBack({
						success: () => {
							beforePage.$vm.abilityChange(this.ability)
						}
					});
				} else {
					uni.showToast({
						icon: 'none',
						title: '请填写能力与优势'
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.text-area {
		box-sizing: border-box;
		width: 100%;
		padding: 40rpx;
		line-height: 48rpx;
	}
	.bottom-button-box {
		padding: 0 40rpx;
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
</style>
