<template>
	<view>
		<view v-if="loaded || list.itemIndex < 15" class="uni-indexed-list__title-wrapper">
			<text v-if="list.items && list.items.length > 0" class="uni-indexed-list__title" >{{ list.key }}</text>
		</view>
		<view v-if="(loaded || list.itemIndex < 15) && list.items && list.items.length > 0" class="uni-indexed-list__list">
			<view v-for="(item, index) in list.items" :key="index" @click="goNext(item)" class="uni-indexed-list__item" hover-class="uni-indexed-list__item--hover">
				<view class="uni-indexed-list__item-container" @click="onClick(idx, index)">
					<view class="uni-indexed-list__item-border" :class="{'uni-indexed-list__item-border--last':index===list.items.length-1}">
						<view v-if="showSelect" style="margin-right: 20rpx;">
							<uni-icons :type="item.checked ? 'checkbox-filled' : 'circle'" :color="item.checked ? '#007aff' : '#aaa'" size="24" />
						</view>
						<view class="" style="display: flex;align-items: center">
							<view class="" style="position: relative;margin-right: 24rpx;">
								<image class="avatarImg" :src="item.dataList.avatar" mode="aspectFill"></image>
								<image class="onwer" v-if="item.dataList.isAdmin==2 && oss" :src="oss+'soCard_owner.png'" mode="aspectFit"></image>
								<image class="manager" v-if="item.dataList.isAdmin==1 && oss" :src="oss+'soCard_manager.png'" mode="aspectFit"></image>
							</view>
							<view class="flexColumnStart wrapInfo" v-if="item.dataList.realName">
								<text class="uni-indexed-list__item-content" style="font-size: 32rpx;line-height: 44rpx; color:#272727;">{{ item.dataList.realName }}</text>
								<text class="uni-indexed-list__item-content" style="color:#919397;font-size: 24rpx;line-height: 34rpx;">{{getCompanyStation(item.dataList.company,item.dataList.station)}}</text>
							</view>
							<view class="flexColumnStart" v-else style="justify-content: center;flex: 1;min-width: 0;">
								<text class="uni-indexed-list__item-content" style="font-size: 28rpx;">{{ item.dataList.name }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getCompanyStation
	} from '@/common/utils.js';
	import { isEmpty } from '@/common/utils.js'
	import uniIcons from '../uni-icons/uni-icons.vue'
	export default {
		name: 'UniIndexedList',
		components: {
			uniIcons
		},
		data(){
			return{
				oss:''
			}
		},
		props: {
			loaded: {
				type: Boolean,
				default: false
			},
			idx: {
				type: Number,
				default: 0
			},
			list: {
				type: Object,
				default () {
					return {}
				}
			},
			showSelect: {
				type: Boolean,
				default: false
			}
		},
		onReady() {
			this.oss=this.$oss
		},
		methods: {
			getCompanyStation,
			onClick(idx, index) {
				this.$emit("itemClick", {
					idx,
					index
				})
			},
			goNext(item){
				// console.log(isEmpty(item.dataList.userId))
				// // console.log(isEmpty(item.dataList.orgId))
				// if(isEmpty(item.dataList.userId)){
				// 	uni.navigateTo({
				// 		url:`/pages/contacts/soWorkbench/soWorkbench?id=${item.dataList.orgId}`
				// 	})
				// }
				// if(isEmpty(item.dataList.orgId)){
				// 	console.log(item.dataList.userId)
				// 	uni.navigateTo({
				// 		url:`/pages/find/cannerCard/cannerCard?id=${item.dataList.userId}`
				// 	})
				// }
				// console.log(item.dataList)
				uni.$emit('list', {
					info: JSON.stringify(item.dataList)
				})
				uni.navigateBack({
					delta: 1
				})
				// console.log(item);
				
				// console.log(item)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.uni-indexed-list__list {
		background-color: $uni-bg-color;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		border-top-width: 1px;
		border-top-color: $uni-border-color;
	}

	.uni-indexed-list__item {
		font-size: $uni-font-size-lg;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex: 1;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
	}

	.uni-indexed-list__item-container {
		padding-left: $uni-spacing-row-lg;
		flex: 1;
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.uni-indexed-list__item-border {
		flex: 1;
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 50px;
		padding: $uni-spacing-row-lg;
		padding-left: 0;
		border-bottom-width: 1px;
		border-bottom-color: $uni-border-color;
	}

	.uni-indexed-list__item-border--last {
		border-bottom-width: 0px;
	}

	.uni-indexed-list__item-content {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.uni-indexed-list {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	.uni-indexed-list__title-wrapper {
		/* #ifndef APP-NVUE */
		display: flex;
		width: 100%;
		/* #endif */
	}

	.uni-indexed-list__title {
		padding: 6px 12px;
		line-height: 24px;
		font-size: $uni-font-size-sm;
	}
	.avatarImg{
		width: 88rpx;
		height: 88rpx;
		border-radius: 50%;
	}
	.onwer{
		width: 70rpx;
		height: 26rpx;
		position: absolute;
		top: -8rpx;
		right: -44rpx;
	}
	.manager{
		width: 60rpx;
		height: 26rpx;
		position: absolute;
		top: -8rpx;
		right: -36rpx;
	}
	.wrapInfo{
		flex: 1;
		min-width: 0;
		justify-content: space-between;
		height: 112rpx;
	}
</style>
