<template>
	<view>
		<scroll-view scroll-y :style="{height: swiperHeight + 'px'}">
			<view class="content">
				<textarea v-if="inputType == 'textarea'" class="textarea" v-model="value" auto-height></textarea>
				<input v-else class="input" v-model="value"/>
			</view>
		</scroll-view>
		<view class="bottom-button-box safe-bottom">
			<view class="botton-button-list">
				<view class="button" style="width: 100%;" @tap="save">保存</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				swiperHeight: 0,
				attribute: '',
				value: '',
				inputType: ''
			};
		},
		onLoad({
			title,
			attribute,
			value,
			inputType
		}) {
			uni.createSelectorQuery()
				.select('.bottom-button-box')
				.boundingClientRect(this)
				.exec(ret => {
					let height = uni.getSystemInfoSync().windowHeight;
					this.swiperHeight = height - ret[0].height
				})
			this.inputType = inputType
			this.attribute = attribute
			this.value = value
			uni.setNavigationBarTitle({
				title
			});
		},
		methods: {
			save() {
				this.$http.post('admin/user/app/update', {
					[this.attribute]: this.value
				}).then(({
					data
				}) => {
					if (data.code === 0) {
						const eventChannel = this.getOpenerEventChannel()
						eventChannel.emit('update', data.data);
						uni.navigateBack()
					}
				});

			}
		}
	}
</script>

<style lang="scss">
	.content {
		padding: 44rpx 0 24rpx;
		margin: 0 32rpx;
		border-bottom: 1rpx solid #EFF0F1;
		.input {
			line-height: 40rpx;
			min-height: 40rpx;
		}
		.textarea {
			width: 686rpx;
			line-height: 40rpx;
			min-height: 160rpx;
		}
	}

	.bottom-button-box {
		width: 100%;
		.botton-button-list {
			margin: 24rpx 32rpx;

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
