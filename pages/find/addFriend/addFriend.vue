<template>
	<view class="page">
		<view class="search">
			<image v-if="oss" :src="oss + 'icon_search_gray.png'" class="icon-search"></image>
			<input placeholder="搜索姓名/手机号" placeholder-class="inputDefault" @confirm="search" @input="inputChange" :value="searchText" focus="true"/>
		</view>
		<view v-if="userCount.length > 0 && searchText.length>0" class="list">
			<view v-for="(item, index) in userCount" :key="index" class="item" @tap="canerCard(item.userId)">
				<view class="" style="display: flex;align-items: center;flex: 1;min-width: 0;">
					<image class="avatar" :src="imageError(item.avatar,$oss)" mode="aspectFill"></image>
					<view class="content">
						<view class="singleEllipsis name">{{ $isEmpty(item.realName)?'':item.realName }}</view>
						<!-- <view class="singleEllipsis subcontent">{{ getCompanyStation(item.company, item.station) }}</view> -->
					</view>
				</view>
				<view class="addBtn" @tap.stop="addFriend(item)">
					加好友
				</view>
			</view>
		</view>
		<image class="emptyImg" v-if=" oss && !userCount.length>0 && searchText!=''" :src="oss + 'pic_energy_default_wuxinxi.png'"
		 mode="aspectFit"></image>
	</view>
</template>

<script>
	import {
		getCompanyStation,imageError,soImageError
	} from '@/common/utils.js';
	export default {
		data() {
			return {
				oss: '',
				searchText: '',
				userCount: []
			};
		},
		methods: {
			imageError,
			soImageError,
			addFriend(item){
				uni.navigateTo({
					url:`/pages/find/cannerCard/relationEdit/relationEdit?id=${item.id}&name=friend`
				})
			},
			canerCard(id) {
				uni.navigateTo({
					url: '/pages/find/cannerCard/cannerCard?id='+ id
				});
			},
			search(e) {
				this.searchText=e.detail.value
				this.$http
					.get('admin/app/mail/search', {
						params: {
							param: this.searchText,
						}
					})
					.then(res => {
						this.userCount = res.data.data
					});
			},
			inputChange(e){
				if (e.detail.value == "") {
					this.searchText = e.detail.value
					this.userCount = []
				}
			},
			getCompanyStation
		},
		onLoad() {
			this.oss = this.$oss;
		},
		onUnload() {
			this.searchText=''
		}
	};
</script>

<style lang="scss">
	.labelList{
		display: grid;
		grid-template-columns: repeat(4,1fr);
		grid-column-gap: 16rpx;
	}
	.avatar{
		width: 88rpx;
		height: 88rpx;
		border-radius: 50%;
	}
	.page {
		padding: 16rpx 0rpx;
	}
	.selectItem{
		padding: 20rpx 48rpx;
		border-radius: 10rpx;
		background-color: #F4F5F6;
		// margin: 0 10rpx;
		margin-bottom: 40rpx;
	}
	.search {
		margin: 0 32rpx;
		padding: 18rpx 32rpx;
		border-radius: 60rpx;
		background-color: #F5f7f8;
		display: flex;
		flex-direction: row;
		align-items: center;

		.icon-search {
			height: 32rpx;
			width: 32rpx;
		}
	}

	.list {
		.title {
			color: #272727;
			font-size: 32rpx;
			font-weight: bold;
			padding: 32rpx;
			line-height: 44rpx;
		}

		.item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 32rpx;

			.content {
				margin-left: 24rpx;
				flex: 1;
				min-width: 0;

				.name {
					font-size: 32rpx;
					line-height: 46rpx;
					color: #272727;
				}

				.subcontent {
					color: #919397;
					font-size: 22rpx;
					margin-top: 16rpx;
				}
			}
		}

		.more {
			text-align: center;
			font-size: 24rpx;
			color: #272727;
			line-height: 108rpx;
			border-top: 1px solid #F5F7F8;
		}
	}
	.addBtn{
		margin-left: 20rpx;
		color: #FFFFFF;
		width: 140rpx;
		border-radius: 42rpx;
		line-height: 52rpx;
		text-align: center;
		height: 52rpx;
		font-size: 26rpx;
		background: linear-gradient(90deg, #FF825C 0%, #FF3636 100%);
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
</style>
