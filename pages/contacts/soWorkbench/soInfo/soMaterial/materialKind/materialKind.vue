<template>
	<view class="container">
		<view class="search-box">
			<view class="flexRow" v-if="!ispProgress" style="justify-content: center;margin-bottom: 20rpx;">
				<view class="flexColumn" style="margin-right: 140rpx;">
					<view :class="status?'active':'unactive'" @tap="checkSoMaterial" style="margin-bottom: 10rpx;">
						组织材料
					</view>
					<view class="" v-if="status" style="width: 12rpx;height: 6rpx;background-color: #F74437;border-radius: 4rpx;">

					</view>
				</view>
				<view class="flexColumn">
					<view :class="status?'unactive':'active'" @tap="checkCollectMaterial" style="margin-bottom: 10rpx;">
						收藏
					</view>
					<view class="" v-if="!status" style="width: 12rpx;height: 6rpx;background-color: #F74437;border-radius: 4rpx;">

					</view>
				</view>
			</view>
			<view class="flexRowStart">
				<image v-if="!showAllStatus && oss" :src="oss+'icon_soMaterialMenu.png'" style="width: 64rpx;height: 64rpx;margin-right: 20rpx;"
				 @tap="showMaterialMenu"></image>
				<view class="flexRowStart search" @tap='goSearch'>
					<image class="searchImg" v-if="oss" :src="oss+'icon_search_gray.png'"></image>
					<input placeholder="搜索" placeholder-class="inputDefault" v-model="searchText" confirm-type="search" disabled="true" />
				</view>
			</view>
		</view>
		<swiper @change="swiperChange" observer observerParents :current-item-id="item_id" ref="swiper" :style="{height:scrollHeight + 'px'}">
			<swiper-item item-id="0">
				<scroll-view scroll-y="true" class="scrollList" @scrolltolower="materialMore" :style="{height: scrollHeight + 'px'}">
					<view class="safe-bottom" style="padding: 0 40rpx">
						<view>
							<view class="flexRowStart kindList" @tap="goMaterialDetails(item)" v-for="(item,index) of kindList" :key="index">
								<!-- <image :src="oss+'icon_Word.png'" v-if="item.format=='.doc' || item.format=='.docx'||item.format=='.dot' && oss"></image>
								<image :src="oss+'icon_PDF.png'" v-else-if="item.format=='.pdf' && oss"></image>
								<image :src="oss+'icon_PPT.png'" v-else-if="item.format=='.pptx' || item.format=='.pps'|| item.format=='.ppam'|| item.format=='.ppt' && oss"></image>
								<image :src="oss+'icon_Excel.png'" v-else-if="item.format=='.xlt' || item.format=='.xls'|| item.format=='.xla'|| item.format=='.xlsx' && oss"></image> -->
								<image :src="oss+'icon_TXT.png'"></image>
								<view class="singleEllipsis content">
									<view class="color_303031 singleEllipsis materialName">
										{{$isEmpty(item.materialName)?'':item.materialName}}
									</view>
									<view class="flexRowStart count">
										<view class="readCount">
											<text class="color_919397 title">浏览:</text>
											<text class="color_2F80FF">{{$isEmpty(item.views)?'0':item.views}}</text>
										</view>
									</view>
								</view>
							</view>
						</view>
						<view class="flexColumn emptyImg" style="justify-content: center;" v-if="!kindList.length>0">
							<image class="" v-if="oss" :src="oss+'pic_materialNoMessage.png'" mode="aspectFit" style="width: 160rpx;height: 146rpx;"></image>
							<view v-if="!showAllStatus" class="color_666769" style="font-size: 28rpx;line-height: 48rpx;margin-top: 44rpx;">
								暂无材料，请点击左上角子文件分类查看更多
							</view>
							<view v-else class="color_666769" style="font-size: 28rpx;line-height: 48rpx;margin-top: 44rpx;">
								暂无材料信息
							</view>
						</view>
						<uni-load-more :status="materialStatus" v-if="kindList.length>0"></uni-load-more>
					</view>
				</scroll-view>
			</swiper-item>
			<swiper-item item-id="1">
				<scroll-view scroll-y="true" class="scrollList" @scrolltolower="collectMore" :style="{height: scrollHeight + 'px'}">
					<view class="safe-bottom" style="padding: 0 40rpx">
						<view>
							<view class="flexRowStart kindList" @tap="goMaterialDetails(item)" v-for="(item,index) of collectList.records"
							 :key="index">
								<!-- <image :src="oss+'icon_Word.png'" v-if="item.format=='.doc' || item.format=='.docx'||item.format=='.dot' && oss"></image>
								<image :src="oss+'icon_PDF.png'" v-else-if="item.format=='.pdf' && oss"></image>
								<image :src="oss+'icon_PPT.png'" v-else-if="item.format=='.pptx' || item.format=='.pps'|| item.format=='.ppam'|| item.format=='.ppt' && oss"></image>
								<image :src="oss+'icon_Excel.png'" v-else-if="item.format=='.xlt' || item.format=='.xls'|| item.format=='.xla'|| item.format=='.xlsx' && oss"></image> -->
								<image :src="oss+'icon_TXT.png'"></image>
								<view class="singleEllipsis content">
									<view class="color_303031 singleEllipsis materialName">
										{{$isEmpty(item.materialName)?'':item.materialName}}
									</view>
									<view class="flexRowStart count">
										<view class="readCount">
											<text class="color_919397 title">浏览:</text>
											<text class="color_2F80FF">{{$isEmpty(item.views)?'0':item.views}}</text>
										</view>
									</view>
								</view>
							</view>
						</view>
						<image class="emptyImg" v-if="!collectList.records.length>0 && oss" :src="oss+'pic_noMessage.png'" mode="aspectFit"></image>
						<uni-load-more :status="collectStatus" v-if="collectList.records.length>0"></uni-load-more>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				kindInfo: {},
				kindList: [],
				kindTitle: "",
				materialStatus: 'more',
				materialLevelId: 0,
				orgId: 0,
				name: '',
				oss: '',
				searchText: '',
				materialName: '',
				scrollHeight: 0,
				item_id: 0,
				status: true,
				collectList: {},
				collectStatus: 'more',
				showAllStatus: ''
			}
		},
		onLoad(options) {
			uni.createSelectorQuery()
				.in(this)
				.select('.search-box')
				.boundingClientRect()
				.exec(ret => {
					let height = uni.getSystemInfoSync().windowHeight;
					this.scrollHeight = height - ret[0].height
				});
			const {
				id,
				orgId,
				name,
				showAllStatus
			} = options
			// console.log(id,orgId,name)
			this.oss = this.$oss
			this.materialLevelId = id
			this.orgId = orgId
			this.name = name
			this.showAllStatus = showAllStatus
			this.initData()
			this.$http.get('dms/material/so/share/page', {
				params: {
					orgId: this.orgId
				}
			}).then(res => {
				// console.log(res)
				this.collectList = res.data.data
				if (!(this.collectList.pages > this.collectList.current)) {
					// console.log(123)
					this.collectStatus = 'noMore'
				}
			})
		},
		methods: {
			goSearch() {
				if (this.item_id == 0) {
					//定义变量,搜索页判断是收藏搜索还是材料搜索
					let status = 0
					uni.navigateTo({
						url: `/pages/contacts/soWorkbench/soInfo/soMaterial/searchMaterial/searchMaterial?orgId=${this.orgId}&status=${status}`
					})
				} else if (this.item_id == 1) {
					let status = 1
					uni.navigateTo({
						url: `/pages/contacts/soWorkbench/soInfo/soMaterial/searchMaterial/searchMaterial?orgId=${this.orgId}&status=${status}`
					})
				}
			},
			showMaterialMenu() {
				//必须用redirectTo，一直套娃页面栈不够
				uni.redirectTo({
					url: `/pages/contacts/soWorkbench/soInfo/soMaterial/soMaterial?orgId=${this.orgId}&parentId=${this.materialLevelId}&name=${this.name}`
				})
			},
			swiperChange(e) {
				if (e.detail.current == 0) {
					this.checkSoMaterial()
				} else if (e.detail.current == 1) {
					this.checkCollectMaterial()
				}
			},
			checkSoMaterial() {
				this.status = true
				this.item_id = 0
			},
			checkCollectMaterial() {
				this.status = false
				this.item_id = 1
			},
			initData() {
				this.$http.get('dms/material/so/page', {
					params: {
						materialLevelId: this.materialLevelId,
						orgId: this.orgId,
						materialName: this.materialName.trim()
					}
				}).then(res => {
					this.kindInfo = res.data.data
					this.kindList = res.data.data.records
					this.kindTitle = this.name
					// console.log(this.kindTitle)
					if (this.kindTitle == undefined) {
						uni.setNavigationBarTitle({
							title: "全部材料"
						})
					} else {
						uni.setNavigationBarTitle({
							title: this.kindTitle
						})
					}
					if (this.kindInfo.current == this.kindInfo.pages) {
						// console.log(123)
						this.materialStatus = 'noMore'
					} else if (this.kindInfo.pages == 0) {
						this.materialStatus = 'noMore'
					}
				})
			},
			search() {
				this.materialName = this.searchText;
				this.initData();
			},
			goMaterialDetails(item) {
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/soInfo/soMaterial/materialKind/materialDetails/materialDetails?id=${item.id}&orgId=${this.orgId}`
				})
			},
			materialMore() {
				this.searchText = this.materialName
				let that = this
				if (that.kindInfo.current < that.kindInfo.pages) {
					that.materialStatus = 'loading';
					that.$http.get('dms/material/so/page', {
						params: {
							materialLevelId: that.materialLevelId,
							orgId: that.orgId,
							current: that.kindInfo.current + 1,
							materialName: this.materialName.trim()
						}
					}).then(res => {
						that.kindInfo.current = res.data.data.current;
						that.kindList = that.kindList.concat(res.data.data.records);
						that.materialStatus = 'more';
					});
				} else {
					that.materialStatus = 'noMore';
				}
			},
			collectMore() {
				if (this.collectList.current < this.collectList.pages) {
					this.collectStatus = 'loading'
					this.$http.get('dms/material/so/share/page', {
						params: {
							orgId: this.orgId,
							current: this.collectList.current + 1
						}
					}).then(res => {
						// console.log(res)
						this.collectList.current = res.data.data.current
						this.collectList.records = this.collectList.records.concat(res.data.data.records)
						if (!(this.collectList.pages > this.collectList.current)) {
							// console.log(123)
							this.collectStatus = 'noMore'
						}
					})
				} else {
					this.collectStatus = 'noMore'
				}
			},
		}
	}
</script>

<style lang="scss">
	.container {
		.search-box {
			padding: 16rpx 32rpx;

			.search {
				flex: 1;
				padding: 18rpx 22px;
				border-radius: 60rpx;
				background-color: #F5f7f8;

				input {
					flex: 1;
					font-size: 28rpx;
					padding: 0 14rpx;
					color: #666769;
				}

				.searchImg {
					height: 32rpx;
					width: 32rpx;
				}
			}
		}


		.inputDefault {
			font-size: 28rpx;
			color: #919397;
		}

		.scrollList {
			.kindList {
				padding: 30rpx 0;
				border-bottom: 0.3rpx solid #EFF0F1;

				image {
					margin-right: 32rpx;
					width: 72rpx;
					height: 72rpx;
				}

				.content {
					flex: 1;

					.materialName {
						font-size: 28rpx;
						margin-bottom: 10rpx;
					}

					.count {
						font-size: 24rpx;

						.readCount {
							margin-right: 20rpx;

							.title {
								padding-right: 10rpx;
							}
						}
					}
				}
			}
		}
	}

	.unactive {
		color: #919397;
		font-size: 28rpx;
		line-height: 40rpx;
	}

	.active {
		color: #F74437;
		font-size: 36rpx;
		line-height: 50rpx;
		font-weight: bold;
	}

	.bottom-safe {
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}
</style>
