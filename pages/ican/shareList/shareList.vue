<template>
	<view>
		<view class="searchWrap">
			<view class="flexRowStart search">
				<image class="searchImg" v-if="oss" :src="oss + 'icon_search_gray.png'"></image>
				<input maxlength="500" placeholder="搜索" style="flex: 1;" placeholder-style="color:#BCC4CB" @input="search" v-model="searchText"></input>
			</view>
		</view>
		<view class="" style="padding: 16rpx 24rpx;">
			<view v-for="(item,index) of articleInfo.records" :key="index" class="articleList" @tap="goArticleDetails(item)">
				<view class="color_303031 bold doubleEllipsis articleName">
					{{$isEmpty(item.materialName)?'':item.materialName}}
				</view>
				<view class="share_list_item_info doubleEllipsis">
					{{item.materialIntro}}
				</view>
				<view class="flexRow wrapArticleInfo">
					<view class="flexRowStart">
						<image lazy-load="true" :src="item.avatar" class="avatarImg"></image>
						<view class="color_919397 publisherName">
							{{$isEmpty(item.realName)?'暂无':item.realName}}
						</view>
					</view>
					<view class="color_919397 articleCreateTime">
						{{$isEmpty(item.createTime)?'':item.createTime.split(' ')[0]}}
					</view>
				</view>
			</view>
			<image class="emptyImg" v-if="!articleInfo.records.length>0 && oss" :src="oss+'pic_energy_default_wuxinxi.png'" mode="aspectFit"></image>
			<uni-load-more :status="articleStatus" v-if="articleInfo.records.length>0"></uni-load-more>
			<view class="safe-bottom"></view>
		</view>
	</view>
</template>

<script>
	import {
		imageError
	} from '@/common/utils.js';
	export default {
		data() {
			return {
				articleInfo: {
					records: []
				},
				oss: '',
				articleStatus: '',
				searchText:''
			};
		},
		onLoad() {
			this.oss = this.$oss
			this.$http.get('dms/material/page',{
				params:{
					materialType:1,
					materialName:this.searchText.trim()
				}
			}).then(res => {
				// console.log(res)
				if (res.data.code == 0) {
					this.articleInfo = res.data.data
					this.articleInfo.records.forEach(item => {
						item.avatar = imageError(item.avatar, this.oss)
					})
					if (!this.articleInfo.current < this.articleInfo.pages) {
						this.articleStatus = 'noMore';
					}
				} else {
					this.articleInfo = {}
				}
			})
		},
		onReachBottom() {
			let that = this;
			if (that.articleInfo.current < that.articleInfo.pages) {
				that.articleStatus = 'loading';
				that.$http.get('dms/material/page', {
					params: {
						materialType:1,
						current: that.articleInfo.current + 1,
						materialName:this.searchText.trim()
					}
				}).then(res => {
					that.articleInfo.current = res.data.data.current;
					res.data.data.records.forEach(item => {
						item.avatar=imageError(item.avatar, that.oss)
					});
					that.articleInfo.records = that.articleInfo.records.concat(res.data.data.records);
					that.articleStatus = 'more';
				});
			} else {
				that.articleStatus = 'noMore';
			}
		},
		methods:{
			search(){
				this.$http.get('dms/material/page',{
					params:{
						materialType:1,
						materialName:this.searchText.trim()
					}
				}).then(res => {
					// console.log(res)
					if (res.data.code == 0) {
						this.articleInfo = res.data.data
						this.articleInfo.records.forEach(item => {
							item.avatar = imageError(item.avatar, this.oss)
						})
						if (!this.articleInfo.current < this.articleInfo.pages) {
							this.articleStatus = 'noMore';
						}
					} else {
						this.articleInfo = {}
					}
				})
			},
			imageError,
			goArticleDetails(item) {
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/soInfo/soMaterial/materialKind/materialDetails/materialDetails?id=${item.id}`
				})
			},
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F5F7F8;
	}
	.searchWrap{
		background-color: #FFFFFF;
		padding: 16rpx 32rpx;
	}
	.search {
		padding: 18rpx 32rpx;
		border-radius: 60rpx;
		background-color: #F5f7f8;
	
		.searchImg {
			height: 32rpx;
			width: 32rpx;
			margin-right: 10rpx;
		}
	}
	.share_list_item_info{
		font-size: 26rpx;
		line-height: 40rpx;
		color: #9AA1A7;
		margin-bottom: 32rpx;
	}
.articleList {
			padding: 32rpx 24rpx;
			background-color: #FFFFFF;
			margin-bottom: 16rpx;
			border-radius: 16rpx;

			.articleName {
				font-size: 32rpx;
				line-height: 52rpx;
				margin-bottom: 20rpx;
			}

			.wrapArticleInfo {
				.avatarImg {
					width: 40rpx;
					height: 40rpx;
					border-radius: 10rpx;
					margin-right: 20rpx;
				}

				.publisherName {
					font-size: 28rpx;
					line-height: 40rpx;
				}

				.articleCreateTime {
					font-size: 24rpx;
					line-height: 34rpx;
				}
			}
		}
</style>
