<template>
	<view class="page">
		<view class="search">
			<image v-if="oss" :src="oss + 'icon_search_gray.png'" class="icon-search"></image>
			<input placeholder="输入关键字搜索组织/用户" placeholder-class="inputDefault" @input="search" v-model="searchText" focus="true"/>
		</view>
		<view v-if="searchText==''" class="flexColumn" style="font-size: 28rpx;line-height: 40rpx;margin-top: 104rpx;">
			<view class="color_919397" style="margin-bottom: 40rpx;">
				搜索指定内容
			</view>
			<view class="labelList color_666769 bold">
				<!-- <view class="selectItem" @tap = "searchRecuit">
					能聘
				</view> -->
				<view class="selectItem" @tap = "searchActivity">
					活动
				</view>
				<view class="selectItem" @tap = "searchMagicBox">
					魔方
				</view>
				<view class="selectItem" @tap = "searchTask">
					任务
				</view>
				<view class="selectItem" @tap = "searchMaterial">
					文章
				</view>
				<view class="selectItem" @tap = "searchQuestionnaire">
					问卷
				</view>
				<view class="selectItem" @tap = "searchExam">
					考试
				</view>
			</view>
		</view>
		<view v-if="orgCount.length > 0 && searchText.length>0" class="list">
			<view class="title">组织</view>
			<view v-for="(item, index) in orgCount" :key="index" class="item" @tap="soCard(item)">
				<image class="avatar" :src="soImageError(item.avatar,$oss)" mode="aspectFill"></image>
				<view class="content">
					<view class="singleEllipsis name">{{ $isEmpty(item.name)?'':item.name }}</view>
					<view class="subcontent singleEllipsis">{{ $isEmpty(item.introduction)?'这是个神秘的组织':item.introduction }}</view>
				</view>
			</view>
			<!-- <view v-if="orgCount.length>9" class="more" @tap="more('so')">显示更多</view> -->
			<view v-if="orgCount.length>5" class="flexRow" style="justify-content: center;">
				<view class="more" @tap="more('so')">更多组织</view>
				<image :src="$ossUrl('contact_arrowright.png')" mode="" style="margin-left: 16rpx;width: 18rpx;height: 36rpx;"></image>
			</view>
			<view class="" style="background-color: #f5f7f8;height: 16rpx;width: 100%;">
				
			</view>
		</view>
		<view v-if="userCount.length > 0 && searchText.length>0" class="list">
			<view class="title">用户</view>
			<view v-for="(item, index) in userCount" :key="index" class="item" @tap="canerCard(item.userId)">
				<image class="avatar" :src="imageError(item.avatar,$oss)" mode="aspectFill"></image>
				<view class="content">
					<view class="singleEllipsis name">{{ $isEmpty(item.realName)?'':item.realName }}</view>
					<view class="singleEllipsis subcontent">{{ getCompanyStation(item.company, item.station) }}</view>
				</view>
			</view>
			<!-- <view v-if="userCount.length>9" class="more" @tap="more('canner')">显示更多</view> -->
			<view v-if="userCount.length>5" class="flexRow" style="justify-content: center;">
				<view class="more" @tap="more('canner')">更多用户</view>
				<image :src="$ossUrl('contact_arrowright.png')" mode="" style="margin-left: 16rpx;width: 18rpx;height: 36rpx;"></image>
			</view>
			<view class="" style="background-color: #f5f7f8;height: 16rpx;width: 100%;">
				
			</view>
		</view>
		<image class="emptyImg" v-if=" oss && (orgCount.length==0 && userCount.length==0 || !searchText.length>0) && searchText!='' " :src="oss + 'pic_search.png'"
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
				orgCount: [],
				userCount: []
			};
		},
		methods: {
			imageError,
			soImageError,
			searchRecuit(){
				uni.navigateTo({
					url:"/pages/find/recruit/recruitSearch/recruitSearch"
				})
			},
			searchActivity(){
				uni.navigateTo({
					url:"/pages/find/workShop/searchActivity/searchActivity"
				})
			},
			searchMagicBox(){
				uni.navigateTo({
					url:"/pages/find/magicBox/search/search"
				})
			},
			searchTask(){
				uni.navigateTo({
					url:"/pages/find/taskList/searchTask/searchTask"
				})
			},
			searchMaterial(){
				uni.navigateTo({
					url:"/pages/find/searchMaterial/searchMaterial"
				})
			},
			searchQuestionnaire(){
				uni.navigateTo({
					url:"/pages/find/questionnaireList/searchQuestionnaire/searchQuestionnaire"
				})
			},
			searchExam(){
				uni.navigateTo({
					url:"/pages/find/examination/searchExam/searchExam"
				})
			},
			more(item) {
				uni.navigateTo({
					url: 'more/more?type=' + item + '&searchText=' + this.searchText
				})
			},
			soCard(item) {
				// console.log(item)
				if (item.isAdmin == -1) {
					uni.navigateTo({
						url: '../soCard/soCard?id=' + item.orgId
					});
				} else {
					uni.navigateTo({
						url: '/pages/contacts/soWorkbench/soWorkbench?id=' + item.orgId
					});
				}
			},
			canerCard(id) {
				uni.navigateTo({
					url: '../cannerCard/cannerCard?id=' + id
				});
			},
			search() {
				this.$http
					.get('dms/app/search/search_list', {
						params: {
							keyWords: this.searchText,
							type: '7' //搜索包含用户  组织 产品
						}
					})
					.then(res => {
						this.orgCount = res.data.data.orgCount;
						// this.orgCount.forEach(item=>{
						// 	item.avatar=imageError(item.avatar,this.oss)
						// })
						this.userCount = res.data.data.userCount;
						// this.userCount.forEach(item2=>{
						// 	item2.avatar=imageError(item2.avatar,this.oss)
						// })
					});
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
		width: 112rpx;
		height: 112rpx;
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
			padding: 32rpx;

			.content {
				margin-left: 24rpx;
				flex: 1;
				min-width: 0;

				.name {
					font-size: 28rpx;
					color: #303031;
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
