<template>
	<view>
		<textarea focus="true" placeholder="请输入动态内容" placeholder-class="inputDefault" v-model="input" auto-height="true" maxlength="200"></textarea>
		<sunui-upimg @change="getImageInfo" :upload_auto="true" ref="upimg" :upimg_preview="serviceArr" :header="header"></sunui-upimg>
		<view class="bottom">
			<button @tap="upload" class="button">发布</button>
		</view>
	</view>
</template>

<script>
	import sunUiUpimg from '@/components/sunui-upimg/sunui-upimg.vue';
	export default {
		components: {
			sunUiUpimg
		},
		data() {
			return {
				serviceArr: [],
				input: '',
				header: {}
			};
		},
		methods: {
			getImageInfo(e) {
				this.serviceArr = e;
			},
			upload() {
				this.$http.post('dms/thoughts/create', {
					content: this.input,
					images: this.serviceArr,
				}).then(res => {
					if (res.data.code == 0) {
						uni.showToast({
							icon: 'none',
							title: '发布成功！',
							success() {
								setTimeout(function() {
									uni.$emit('fresh', true)
									uni.navigateBack();
								}, 1000)
							}
						});
					} else {
						uni.showToast({
							title: res.data.message,
							icon: "none"
						})
					}
				});
			}
		},
		onShow() {
			this.header = {
				Authorization: uni.getStorageSync('token')
			};
		}
	}
</script>

<style lang="scss">
	.bottom {
		position: fixed;
		bottom: 40rpx;
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}

	.button {
		width: 670rpx;
		margin-left: 40rpx;
	}

	.inputDefault {
		color: #BABEC0;
		padding: 32rpx;
		line-height: 48rpx;
		font-size: 28rpx;
	}

	textarea {
		flex: 1;
		width: 686rpx;
		padding: 32rpx;
		font-size: 28rpx;
		line-height: 48rpx;
		color: #666769;
		min-height: 200rpx;
	}
</style>
