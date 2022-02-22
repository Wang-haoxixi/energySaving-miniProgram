<template>
	<view class="banner-cantainer" v-if="data.length>0">
		<uni-swiper-dot :info="data" :current="current" mode="round" :dotsStyles="dotsStyles">
			<swiper class="swiper" autoplay circular @change="change">
				<swiper-item class="content-item" v-for="(item ,index) in data" :key="index" @tap="go(item)">
					<image class="img" :src="item.imageUrl" mode="aspectFill" :style="[customStyle]"></image>
				</swiper-item>
			</swiper>
		</uni-swiper-dot>
	</view>
</template>

<script>
	import {
		goTask,
		goActivity,
		goQuestionnaire,
		gomagicBox,
		goMaterial,
		gomagicBoxTag,
	} from '@/common/utils.js'
	export default {
		props: {
			slotNumber: {
				type: String
			},
			isFresh: {
				type: String
			},
			customStyle: {
				type: Object
			}
		},
		data() {
			return {
				data: [],
				isDots: false,
				swiperCurrent: 0,

				current: 0,
				dotsStyles: {
					width: 6,
					bottom: 12,
					height: 6,
				}
			};
		},
		watch: {
			isFresh: {
				handler: function() {
					this.getBanner();
				},
			}
		},
		onReady() {
			this.getBanner();
		},
		methods: {
			changeSwiper(e) {
				this.swiperCurrent = e.detail.current;
			},
			getBanner() {
				this.$http.get('cms/info_ad/2/list', {
					params: {
						slotNumber: this.slotNumber
					}
				}).then(res => {
					console.log('res..', res)
					this.data = res.data.data;
					if (this.data && this.data.length > 1) {
						this.isDots = true;
					} else {
						this.isDots = false;
					}
				});
			},
			go(item) {
				console.log('item..', item)
				if (item.type === 'task') {
					goTask(item.relationId)
				} else if (item.type === 'activity') {
					goActivity(item.relationId)
				} else if (item.type === 'questionnaire') {
					goQuestionnaire(item.relationId)
				} else if (item.type === 'material') {
					goMaterial(item.relationId)
				} else if (item.type === 'h5') {
					console.log('banner-data..', item)
					uni.navigateTo({
						url: `/pages/webView/webView?type=banner&name=${item.name}&url=${encodeURIComponent(JSON.stringify(item.url))}`
					})
				} else if (item.type === 'products' || item.type === 'program') {
					if (item.jumpType === '1') {
						goMagicBox(item.relationId)
					} else if (item.jumpType === '2') {
						// gomagicBoxTag(item.keyWords)
						uni.switchTab({
							url: '/pages/tabbar/contacts'
						})
					}
				}
			},

			change(e) {
				this.current = e.detail.current;
			}
		}
	}
</script>

<style lang="scss">
	.banner-cantainer {
		width: 100%;
		height: 260rpx;
		padding-top: 16rpx;
		// position: relative;
	}

	.swiper {
		height: 260rpx;

		.content-item {
			.img {
				width: 100%;
				height: 100%;
				border-radius: 16rpx;
			}
		}
	}

	// .dots {
	// 	position: absolute;
	// 	bottom: 24rpx;
	// 	right: 46rpx;
	// 	// right: 5%;
	// 	transform: translate(-50% 0);
	// 	z-index: 4;
	// 	display: flex;
	// 	justify-content: center;

	// 	.dot {
	// 		width: 12rpx;
	// 		height: 12rpx;
	// 		border-radius: 50%;
	// 		transition: all .6s;
	// 		background: rgba(0, 0, 0, .5);
	// 		margin-right: 12rpx;
	// 	}

	// 	.active {
	// 		width: 40rpx;
	// 		height: 12rpx;
	// 		border-radius: 12rpx;
	// 		background: #FFFFFF;
	// 	}
	// }
</style>
