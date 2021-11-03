<template>
	<view class="page">
		<scroll-view class="scroll" :scroll-top="30" scroll-y @scrolltolower="more">
			<view v-if="type == 2" class="list">
				<view v-for="(item, index) in data.records" class="item" :key="index" @tap="soCard(item)">
					<image lazy-load="true" class="avatarImg" :src="soImageError(item.avatar,$oss)" mode="aspectFill"></image>
					<view class="content flexColumnStart">
						<view class="singleEllipsis name">{{ $isEmpty(item.name)?'':item.name }}</view>
						<view class="subcontent singleEllipsis color_919397">{{ $isEmpty(item.introduction)?'这是个神秘的组织':item.introduction }}</view>
					</view>
				</view>
			</view>
			<view v-else-if="type == 1" class="list">
				<view v-for="(item, index) in data.records" :key="index" class="item" @tap="canerCard(item.userId)">
					<image lazy-load="true" class="avatarImg" :src="imageError(item.avatar,$oss)" mode="aspectFill"></image>
					<view class="content">
						<view class="singleEllipsis name">{{ $isEmpty(item.realName)?'':item.realName }}</view>
						<view class="singleEllipsis subcontent color_919397">{{ getCompanyStation(item.company, item.station) }}</view>
					</view>
				</view>
			</view>
			<uni-load-more :status="status"></uni-load-more>
			<view class="bottom-safe" style="height: 112rpx;"></view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		getCompanyStation,
		imageError,
		soImageError
	} from '@/common/utils.js';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				searchText: '',
				type: '',
				status: 'more',
				data: {
					records: []
				}
			};
		},
		methods: {
			soImageError,
			imageError,
			soCard(item) {
				// console.log(item)
				if (item.isAdmin == -1) {
					uni.navigateTo({
						url: '../../soCard/soCard?id=' + item.orgId
					});
				} else {
					uni.navigateTo({
						url: '/pages/contacts/soWorkbench/soWorkbench?id=' + item.orgId
					});
				}
			},
			canerCard(id) {
				uni.navigateTo({
					url: '../../cannerCard/cannerCard?id=' + id
				});
			},
			more() {
				let that = this;
				if (that.data.current < that.data.pages) {
					that.status = 'loading';
					that.$http.get('dms/app/search/search_page', {
						params: {
							keyWords: that.searchText,
							type: that.type,
							current: that.data.current + 1,
							size: 30,
						}
					}).then(res => {
						if (that.type == 2) {
							that.data.current = res.data.data.orgCount.current;
							// res.data.data.orgCount.records.forEach(item => {
							// 	item.avatar=imageError(item.avatar, this.oss)
							// })
							that.data.records = that.data.records.concat(res.data.data.orgCount.records)
						} else if (that.type == 1) {
							that.data.current = res.data.data.userCount.current;
							// res.data.data.userCount.records.forEach(item => {
							// 	item.avatar=imageError(item.avatar, this.oss)
							// })
							that.data.records = that.data.records.concat(res.data.data.userCount.records)
						}
						that.status = 'more';
					});
				} else {
					that.status = 'noMore';
				}
			},
			getCompanyStation,
			getType(option) {
				// public static final int SEARCH_PERSONAL = 1; //搜人
				// public static final int SEARCH_SO = 2; //搜搜SO
				// public static final int SEARCH_ALL = 0; //搜所有
				// public static final int SEARCH_TASK = 3; //搜索任务
				// public static final int SEARCH_NEWS = 5; //搜头条
				// public static final int SEARCH_TOPIC = 4; //搜话题
				// public static final int SEARCH_PRODUCT = 6; //搜魔方产品
				if (option.type == 'so') {
					this.type = 2;
					return
				}
				if (option.type == 'canner') {
					this.type = 1
					return
				}
			}
		},
		onLoad(option) {
			this.getType(option);
			this.searchText = option.searchText;
			this.$http
				.get('dms/app/search/search_page', {
					params: {
						keyWords: this.searchText,
						type: this.type,
						current: 1,
						size: 30
					}
				})
				.then(res => {
					if (this.type == 2) {
						this.data = res.data.data.orgCount
						// this.data.records.forEach(item => {
						// 	item.avatar=imageError(item.avatar, this.oss)
						// })
						if(!this.data.current<this.data.pages){
							this.status='noMore'
						}
					} else if (this.type == 1) {
						this.data = res.data.data.userCount
						// this.data.records.forEach(item2 => {
						// 	item2.avatar=imageError(item2.avatar, this.oss)
						// })
						if(!this.data.current<this.data.pages){
							this.status='noMore'
						}
					}
				});
		}
	}
</script>

<style lang="scss">
	.avatarImg{
		width: 112rpx;
		height: 112rpx;
		border-radius: 50%;
		margin-right: 24rpx;
	}
	.singleEllipsis {
	}

	.page {
		height: 100vh;

		.scroll {
			height: 100%;

			.list {
				padding:0 32rpx;

				.item {
					display: flex;
					padding: 32rpx 0;

					.content {
						flex: 1;
						min-width: 0;
						height: 112rpx;
						.name {
							font-size: 32rpx;
							line-height: 44rpx;
							flex: 1;
							color: #272727;
						}

						.subcontent {
							flex: 1;
							font-size: 24rpx;
							line-height: 34rpx;
							margin-top: 10rpx;
						}
					}
				}
			}
		}
	}

	.bottom-safe {
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}
</style>
