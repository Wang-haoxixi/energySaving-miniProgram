<template>
	<view class="banner-cantainer">
		<!-- <swiper v-if="data.length>0" autoplay :indicator-dots="isDots" circular indicator-active-color="#FFFFFF" indicator-color="#FFFFFF4D" class="swiper"> -->
		<swiper v-if="data.length>0" autoplay circular indicator-active-color="#FFFFFF" indicator-color="#FFFFFF4D" @change="changeSwiper" class="swiper">
		<!-- 轮播 -->
			<swiper-item v-for="(item,index) in data" :key="index" class="content-item" @tap="go(item)">
				<image class="img" :src="item.imageUrl" mode="aspectFill"  :style="[customStyle]"></image>
			</swiper-item>
		</swiper>
		
		<!-- 轮播指示点样式修改 -->
		<view v-if="data.length>0" class="dots">
			<block v-for="(item,index) in data.length" :key="item.id">
				<view class="dot" :class="index==swiperCurrent ? ' active' : ''"></view>
			</block>
		</view>
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
			customStyle:{
				type:Object
			}
		},
		data() {
			return {
				data: [],
				isDots: false,
				swiperCurrent: 0,
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
				if (item.type === 'task') {
					goTask(item.relationId)
				} else if (item.type === 'activity') {
					goActivity(item.relationId)
				} else if (item.type === 'questionnaire') {
					goQuestionnaire(item.relationId)
				} else if (item.type === 'material') {
					goMaterial(item.relationId)
				} else if(item.type === 'h5') {
					console.log('banner-data..', item)
					uni.navigateTo({
						url: `/pages/webView/webView?type=banner&url=${encodeURIComponent(JSON.stringify(item.url))}`
					})
				} else if (item.type === 'products' || item.type === 'program') {
					if (item.jumpType === '1') {
						goMagicBox(item.relationId)
					} else if (item.jumpType === '2') {
						// gomagicBoxTag(item.keyWords)
						uni.switchTab({
							url:'/pages/tabbar/contacts'
						})
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	.banner-cantainer{
		width: 100%;
		height: 260rpx;
		padding-top: 16rpx;
		position: relative;
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
	
	.dots {
		position: absolute;
		bottom: 24rpx;
		right: 46rpx;
		transform: translate(-50% 0);
		z-index: 4;
		display: flex;
		justify-content: center;
	
		.dot {
			width: 12rpx;
			height: 12rpx;
			border-radius: 50%;
			transition: all .6s;
			background: rgba(0, 0, 0, .5);
			margin-right: 12rpx;
		}
	
		.active {
			width: 40rpx;
			height: 12rpx;
			border-radius: 12rpx;
			background: #FFFFFF;
		}
	}
</style>
