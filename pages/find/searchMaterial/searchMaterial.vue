<template>
	<view class="container">
		<view class="flexRowStart search">
			<image v-if="oss" class="img" :src="oss+'icon_search_gray.png'"></image>
			<input maxlength="500" placeholder="搜索" placeholder-class="inputDefault" @input="search" v-model="searchText" focus="true"></input>
		</view>
		<view class="taskList" v-for="(item,index) of materialList" :key="index" @tap="goMaterialDetail(item)">
			<view class="taskListItem">
				<view class="color_303031 bold doubleEllipsis itemName">
					{{$isEmpty(item.materialName)?'':item.materialName}}
				</view>
				<view class="flexRow">
					<view class="flexRowStart">
						<image class="avatarImg" :src="imageError(item.avatar,$oss)"></image>
						<view class="color_919397" style="font-size: 28rpx; line-height: 40rpx;">
							{{$isEmpty(item.realName)?'':item.realName}}
						</view>
					</view>
					<view class="color_919397" style="font-size: 24rpx;line-height: 34rpx;">
						{{$isEmpty(item.createTime)?'':item.createTime.split(' ')[0]}}
					</view>
				</view>
			</view>
		</view>
		<image class="emptyImg" v-if="!materialList.length>0 && oss" :src="oss+'pic_search.png'" mode="aspectFit"></image>
		<uni-load-more :status="materialStatus" v-if="materialList.length>0"></uni-load-more>
		<view class="bottom-safe" style="height: 112rpx;"></view>
	</view>
</template>

<script>
	import {
		imageError
	} from '@/common/utils.js';
	export default {
		data() {
			return {
				materialInfo: {},
				materialList: [],
				materialStatus: '',
				oss: ''
			};
		},
		onLoad() {
			this.oss = this.$oss
		},
		onReachBottom() {
			// console.log(666)
			let that = this
			if (that.materialInfo.current < that.materialInfo.pages) {
				that.materialStatus = 'loading';
				that.$http.get('dms/material/search_material', {
					params: {
						keyword: that.searchText,
						type:1,
						current: that.materialInfo.current + 1
					}
				}).then(res => {
					// console.log(res)
					that.materialInfo.current = res.data.data.current;
					that.materialList = that.materialList.concat(res.data.data.records);
					that.materialStatus = 'more';
				});
			} else {
				that.materialStatus = 'noMore';
			}
		},
		methods: {
			imageError,
			search() {
				if (this.searchText.length == 0) {
					this.materialInfo = {}
					this.materialList = []
				} else {
					this.$http
						.get('dms/material/search_material', {
							params: {
								keyword: this.searchText,
								type:1
							}
						})
						.then(res => {
							// console.log(res)
							this.materialInfo = res.data.data
							this.materialList = this.materialInfo.records
							if(!(this.materialInfo.current<this.materialInfo.pages)){
								this.materialStatus='noMore'
							}else{
								this.materialStatus='more'
							}
					});
				}
			},
			goMaterialDetail(item){
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/soInfo/soMaterial/materialKind/materialDetails/materialDetails?id=${item.id}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.avatarImg{
		width: 40rpx;
		height:40rpx;
		border-radius: 50%;
		margin-right: 20rpx;
	}
	.inputDefault {
		font-size: 28rpx;
		color: #919397;
	}

	input {
		flex: 1;
		font-size: 28rpx;
		padding: 0 14rpx;
		color: #666769;
	}

	.container {
		padding: 0 32rpx;

		.search {
			margin: 16rpx 0;
			padding: 18rpx 32rpx;
			border-radius: 60rpx;
			background-color: #F5f7f8;

			.img {
				height: 32rpx;
				width: 32rpx;
			}
		}
	}
	.taskListItem{
		margin-bottom: 30rpx;
		border-bottom: 2rpx solid #F4F5F6;
		padding-bottom: 30rpx;
		.itemName{
			font-size: 32rpx;
			line-height: 52rpx;
			margin-bottom: 20rpx;
		}
	}
	.typeInfo {
		font-size: 28rpx;
		line-height: 40rpx;
	}

	.bottom-safe {
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}
</style>
