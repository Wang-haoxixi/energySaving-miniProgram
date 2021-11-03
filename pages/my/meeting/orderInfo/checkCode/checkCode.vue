<template>
	<view class="container">
		<swiper @change="swiperChange" :duration="1000" :current-item-id="item_id" circular ref="swiper" class="swiperContent">
			<swiper-item v-for="(item,index) of list" :key="index" :item-id="index">
				<view class="swiper-item">
					<view class="color_303031 bold numInfo">{{index+1}}/{{list.length}}</view>
					<view class="color_666769 orderNo">
						签到码：编号{{item.orderNo}}
					</view>
					<view class="flexRow" style="position: relative;justify-content: center;">
						<image v-if="!$isEmpty(item.codeUrl)" :src="item.codeUrl" style="width: 235px;height: 235px;margin: 20rpx;" />
						<canvas class="canvas-hide" :canvas-id="item.orderNo" style="width: 245px;height: 245px;" />
						<view v-if="item.writeOffStatus==1" class="color_FFFFFF bold flexRow codeCover">
							<view class="">
								已签到
							</view>
						</view>
					</view>
				</view>
			</swiper-item>
		</swiper>
		<image v-if="oss" :src="oss+'icon_checkCode_left.png'" mode="aspectFit" class="rightImg" @tap="left()"></image>
		<image v-if="oss" :src="oss+'icon_checkCode_right.png'" mode="aspectFit" class="leftImg" @tap="right()"></image>
		<view class="color_303031 bold wordInfo">
			到活动现场可出示签到
		</view>
	</view>
</template>

<script>
	import uQRCode from '@/common/uqrcode.js'
	export default {
		data() {
			return {
				list: [],
				img: '',
				item_id: 0,
				oss: ''
			};
		},
		onLoad(options) {
			this.oss = this.$oss
			const {
				id
			} = options
			this.$http.get('qms/conference_ticketing/sign_in_code', {
				params: {
					enrollId: id
				}
			}).then(res => {
				// console.log(res)
				this.list = res.data.data
				this.list = this.list.map(item => {
					return {
						...item,
						codeUrl: ''
					}
				})
				this.list.forEach((item) => {
					this.make(item)
				})
			})
		},
		methods: {
			make(item) {
				uQRCode.make({
					canvasId: item.orderNo,
					componentInstance: this,
					text: `signIn{${item.orderNo}}`,
					size: 245,
					margin: 0,
					backgroundColor: '#ffffff',
					foregroundColor: '#000000',
					fileType: 'jpg',
					correctLevel: uQRCode.defaults.correctLevel,
					success: res => {
						// console.log(res)
						item.codeUrl = res
						// console.log(item.codeUrl)
					}
				})
			},
			swiperChange(e) {
				// console.log(e)
				this.item_id = e.detail.current
			},
			left() {
				if (this.item_id == 0) {
					this.item_id = this.list.length - 1
				} else {
					this.item_id--;
				}
			},
			right() {
				if (this.item_id == this.list.length - 1) {
					this.item_id = 0
				} else {
					this.item_id++;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.canvas-hide {
		/* 1 */
		position: fixed;
		right: 100vw;
		bottom: 100vh;
		/* 2 */
		z-index: -9999;
		/* 3 */
		opacity: 0;
	}

	.wordInfo {
		font-size: 32rpx;
		line-height: 44rpx;
		text-align: center;
	}

	.rightImg {
		position: absolute;
		top: 520rpx;
		left: 40rpx;
		width: 30rpx;
		height: 30rpx;
	}

	.leftImg {
		position: absolute;
		top: 520rpx;
		left: 680rpx;
		width: 30rpx;
		height: 30rpx;
	}

	.codeCover {
		justify-content: center;
		font-size: 44rpx;
		line-height: 60rpx;
		position: absolute;
		z-index: 20;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		// margin: auto;
		margin: 20rpx;
		width: 235px;
		height: 235px;
		background: rgba(0, 0, 0, .8);
	}

	.swiper-item {
		.numInfo {
			font-size: 44rpx;
			line-height: 52rpx;
			margin-bottom: 40rpx;
			text-align: center;
		}

		.orderNo {
			font-size: 28rpx;
			line-height: 40rpx;
			margin-bottom: 80rpx;
			text-align: center;
		}
	}

	.container {
		padding: 80rpx 70rpx;
		position: relative;
	}

	.swiperContent {
		margin: 0 auto;
		margin-bottom: 36rpx;
		height: 722rpx;
		width: 510rpx;
	}
</style>
