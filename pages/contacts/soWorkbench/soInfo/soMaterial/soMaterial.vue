<template>
	<view style="height: 100vh">
		<view class="containerTitle">
			<view id="so-material-top-area" class="top-area">
				<view class="banner" v-if="ispProgress">
					<banner slotNumber="app_recruit_ladder" :customStyle="{width:'702rpx',margin:'0 24rpx'}"></banner>
				</view>
				<view class="flexRow" v-if="!ispProgress" style="justify-content: center;margin-bottom: 20rpx;">
					<view class="flexColumn" style="margin-right: 140rpx;">
						<view :class="status?'active':'unactive'" @tap="checkSoMaterial" style="margin-bottom: 10rpx;">
							组织材料
						</view>
						<view class="" v-if="status" style="width: 12rpx;height: 6rpx;background-color: #46B28B;border-radius: 4rpx;">

						</view>
					</view>
					<view class="flexColumn">
						<view :class="status?'unactive':'active'" @tap="checkCollectMaterial" style="margin-bottom: 10rpx;">
							收藏
						</view>
						<view class="" v-if="!status" style="width: 12rpx;height: 6rpx;background-color: #46B28B;border-radius: 4rpx;">

						</view>
					</view>
				</view>
				<view class="flexRowStart search" @tap='goSearch'>
					<image class="searchImg" v-if="oss" :src="oss+'icon_search_gray.png'"></image>
					<input placeholder="搜索" placeholder-class="inputDefault" disabled="true" />
				</view>
			</view>
		</view>
		<swiper @change="swiperChange" observer observerParents :current-item-id="item_id" ref="swiper" :style="{height:scrollHeight + 'px'}">
			<swiper-item item-id="0">
				<scroll-view scroll-y class="container" :style="{height:scrollHeight + 'px'}">
					<view class="container-inner safe-bottom">
						<view class="flexRow" v-if="showAll" @tap="showAllMaterials()" style="padding: 36rpx 0;border-bottom: 2rpx solid #EFF0F1;">
							<view class="flexRowStart">
								<image v-if="oss" class="materialImg" :src="oss+'icon_so_material.png'"></image>
								<text class="color_303031 title" style="font-size: 28rpx;padding-left: 32rpx;">全部材料</text>
							</view>
							<image v-if="oss" class="rightImg" :src="oss+'icon_right_gray.png'"></image>
						</view>
						<view class="flexRow materialList" @tap="goMaterialKind(item)" v-for="(item,index) of materialList" :key="index">
							<view class="flexRowStart">
								<image v-if="oss" class="materialImg" :src="oss+'icon_so_material.png'"></image>
								<view class="info">
									<text class="color_303031 levelName">{{$isEmpty(item.levelName)?'':item.levelName}}</text>
									<view class="color_919397 createTime">{{$isEmpty(item.createTime)?'':item.createTime.substring(0,16)}}</view>
								</view>
							</view>
							<image v-if="oss" class="rightImg" :src="oss+'icon_right_gray.png'"></image>
						</view>
						<view class="flexColumn emptyImg" style="justify-content: center;" v-if="!materialList.length>0 && !showAll">
							<image class="" v-if="oss" :src="oss+'pic_materialNoMessage.png'" mode="aspectFit" style="width: 160rpx;height: 146rpx;"></image>
							<view class="color_666769" style="font-size: 28rpx;line-height: 48rpx;margin-top: 44rpx;">
								暂无文件夹
							</view>
							<!-- 	<view v-else class="color_666769" style="font-size: 28rpx;line-height: 48rpx;margin-top: 44rpx;">
								暂无材料信息
							</view> -->
						</view>
					</view>
				</scroll-view>
			</swiper-item>
			<swiper-item item-id="1">
				<scroll-view scroll-y class="container" :style="{height:scrollHeight + 'px'}" @scrolltolower="collectMore">
					<view class="container-inner safe-bottom">
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
								<view class="count">
									<view class="readCount">
										<text class="color_919397 title">浏览:</text>
										<text class="color_2F80FF">{{$isEmpty(item.views)?'0':item.views}}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
					<image class="emptyImg" v-if="!collectList.records.length>0 && oss" :src="oss+'pic_energy_default_wuxinxi.png'" mode="aspectFit"></image>
					<uni-load-more :status="materialStatus" v-if="collectList.records.length>0"></uni-load-more>
				</scroll-view>
				<view class="bottom-safe" style="height: 112rpx;"></view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import {
		banner
	} from '@/components/banner/banner.vue'
	export default {
		components: {
			banner
		},
		data() {
			return {
				materialList: [],
				showAll: true,
				orgId: 0,
				name: '',
				parentId: '',
				ispProgress: false,
				oss: '',
				scrollHeight: 0,
				searchText: '',
				item_id: 0,
				status: true,
				collectList: {},
				showAllStatus: true,
				materialStatus: 'more'
			}
		},
		onLoad(options) {
			const {
				orgId,
				name,
				parentId,
				ispProgress
			} = options
			this.orgId = orgId;
			this.name = name;
			this.parentId = parentId;
			this.ispProgress = ispProgress;
			this.oss = this.$oss;
			if (ispProgress) {
				uni.setNavigationBarTitle({
					title: '进步阶梯'
				});
			}
			this.$nextTick(() => {
				uni.createSelectorQuery()
					.in(this)
					.select('#so-material-top-area')
					.boundingClientRect()
					.exec(ret => {
						let height = uni.getSystemInfoSync().windowHeight;
						this.scrollHeight = height - ret[0].height
					});
			})
			this.getData()
			this.$http.get('dms/material/so/share/page', {
				params: {
					orgId: this.orgId
				}
			}).then(res => {
				// console.log(res)
				this.collectList = res.data.data
				if (!(this.collectList.pages > this.collectList.current)) {
					// console.log(123)
					this.materialStatus = 'noMore'
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
			collectMore() {
				if (this.collectList.current < this.collectList.pages) {
					this.materialStatus = 'loading'
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
							this.materialStatus = 'noMore'
						}
					})
				} else {
					this.materialStatus = 'noMore'
				}
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
			goMaterialDetails(item) {
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/soInfo/soMaterial/materialKind/materialDetails/materialDetails?id=${item.id}&orgId=${this.orgId}`
				})
			},
			getData() {
				if (this.orgId && this.name && this.parentId) {
					this.$http.get('dms/material_level/page', {
						params: {
							orgId: this.orgId,
							parentId: this.parentId,
							levelName: this.searchText.trim(),
						}
					}).then(res => {
						// console.log(res)
						this.materialList = res.data.data.records
						uni.setNavigationBarTitle({
							title: this.name
						})
						this.showAll = false
					})
				} else if (this.orgId) {
					this.$http.get('dms/material_level/page', {
						params: {
							orgId: this.orgId,
							levelName: this.searchText.trim(),
						}
					}).then(res => {
						// console.log(res)
						this.materialList = res.data.data.records
					})
				}
			},
			search() {
				this.getData()
			},
			showAllMaterials() {
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/soInfo/soMaterial/materialKind/materialKind?orgId=${this.orgId}&showAllStatus=${this.showAllStatus}`
				})
			},
			goMaterialKind(item) {
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/soInfo/soMaterial/materialKind/materialKind?orgId=${item.orgId}&id=${item.id}&name=${item.levelName}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.unactive {
		color: #919397;
		font-size: 28rpx;
		line-height: 40rpx;
	}

	.active {
		// color: #F74437;
		color: #46B28B;
		font-size: 36rpx;
		line-height: 50rpx;
		font-weight: bold;
	}

	.containerTitle {}

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

	.top-area {
		padding: 16rpx 0;

		.search {
			margin: 32rpx 32rpx 0;
			padding: 18rpx 32rpx;
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

		.inputDefault {
			font-size: 28rpx;
			color: #919397;
		}
	}




	.container {
		.container-inner {
			padding: 0 32rpx;
		}

		.allKind {
			padding-bottom: 30rpx;
			border-bottom: 0.3rpx solid #EFF0F1;

			.title {
				font-size: 28rpx;
				padding-left: 32rpx;
			}
		}

		.materialList {
			padding: 36rpx 0;
			border-bottom: 2rpx solid #EFF0F1;

			.info {
				display: flex;
				flex-direction: column;
				padding-left: 32rpx;

				.levelName {
					font-size: 28rpx;
					padding-bottom: 10rpx;
				}

				.createTime {
					font-size: 24rpx;
				}
			}
		}
	}

	.materialImg {
		width: 72rpx;
		height: 72rpx;
	}

	.rightImg {
		width: 44rpx;
		height: 44rpx;
		margin-right: -16rpx;
	}

	.bottom-safe {
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}
</style>
