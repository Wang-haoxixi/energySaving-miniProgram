<template>
	<swiper v-if="data.length>0" autoplay :indicator-dots="isDots" circular indicator-active-color="#FFFFFF" indicator-color="#FFFFFF4D" class="content">
		<swiper-item v-for="(item,index) in data" :key="index" class="content-item" @tap="go(item)">
			<image class="img" :src="item.imageUrl" mode="aspectFill"  :style="[customStyle]"></image>
		</swiper-item>
	</swiper>
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
				isDots: false
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
			getBanner() {
				this.$http.get('cms/info_ad/2/list', {
					params: {
						slotNumber: this.slotNumber
					}
				}).then(res => {
					this.data = res.data.data;
					if (this.data && this.data.length > 1) {
						this.isDots = true;
					} else {
						this.isDots = false;
					}
				});
			},
			go(item) {
				console.log(item)
				if (item.type === 'task') {
					goTask(item.relationId)
				} else if (item.type === 'activity') {
					goActivity(item.relationId)
				} else if (item.type === 'questionnaire') {
					goQuestionnaire(item.relationId)
				} else if (item.type === 'material') {
					goMaterial(item.relationId)
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
	.content {
		padding-top: 16rpx;
		.content-item {
			.img {
				width: 100%;
				height: 100%;
				border-radius: 30rpx;
			}
		}
	}
</style>
