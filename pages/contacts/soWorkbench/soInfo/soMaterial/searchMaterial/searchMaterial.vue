<template>
	<view class="top-area" style="position: relative;">
		<view class="flexRowStart search">
			<image class="searchImg" v-if="oss" :src="oss+'icon_search_gray.png'"></image>
			<!-- <input placeholder="搜索" placeholder-class="inputDefault" @input="search" v-model="searchText" /> -->
			<input placeholder="搜索" placeholder-class="inputDefault" @input="search" v-model="searchText" />
		</view>
		<view>
			<view class="flexRowStart kindList" @tap="goMaterialDetails(item)" v-for="(item,index) of kindInfo.records" :key="index">
			<!-- 	<image :src="oss+'icon_Word.png'" v-if="item.format=='.doc' || item.format=='.docx'||item.format=='.dot' && oss"></image>
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
		<view class="flexColumn" style="justify-content: center;margin-top: 400rpx;" v-if="!kindInfo.records.length>0">
			<image class="" v-if="oss" :src="oss+'pic_materialNoMessage.png'" mode="aspectFit" style="width: 160rpx;height: 146rpx;"></image>
			<view class="color_666769" style="font-size: 28rpx;line-height: 48rpx;margin-top: 44rpx;">
				暂无材料信息
			</view>
		</view>
		<uni-load-more :status="materialStatus" v-if="kindInfo.records.length>0"></uni-load-more>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchText: '',
				kindInfo: {
					records:[]
				},
				url: '',
				materialStatus: 'more',
				oss: '',
				orgId: '',
				status: ''
			};
		},
		onLoad(options) {
			const {
				orgId,
				status
			} = options
			this.orgId = orgId
			this.status = status
			this.oss = this.$oss
			if (this.status == 0) {
				this.url = 'dms/material/so/page'
			} else if (this.status == 1) {
				this.url = 'dms/material/so/share/page'
			}
		},
		onReachBottom() {
			if (this.kindInfo.current < this.kindInfo.pages) {
				this.materialStatus = 'loading'
				this.$http.get(this.url, {
					params: {
						orgId: this.orgId,
						current: this.kindInfo.current + 1,
						materialName: this.searchText.trim()
					}
				}).then(res => {
					// console.log(res)
					this.kindInfo.current = res.data.data.current
					this.kindInfo.records = this.kindInfo.records.concat(res.data.data.records)
					if (!(this.kindInfo.pages > this.kindInfo.current)) {
						// console.log(123)
						this.materialStatus = 'noMore'
					}
				})
			} else {
				this.materialStatus = 'noMore'
			}
		},
		methods: {
			goMaterialDetails(item) {
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/soInfo/soMaterial/materialKind/materialDetails/materialDetails?id=${item.id}&orgId=${this.orgId}`
				})
			},
			search() {
				if (this.$isEmpty(this.searchText)) {
					this.kindInfo = {}
				} else {
					this.$http.get(this.url, {
						params: {
							orgId: this.orgId,
							materialName: this.searchText.trim()
						}
					}).then(res => {
						// console.log(res)
						this.kindInfo = res.data.data
						// console.log(this.kindTitle)
						if (this.kindInfo.current == this.kindInfo.pages) {
							// console.log(123)
							this.materialStatus = 'noMore'
						} else if (this.kindInfo.pages == 0) {
							this.materialStatus = 'noMore'
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.kindList {
		padding: 32rpx 0;
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
		padding: 16rpx 32rpx;

		.search {
			// margin: 40rpx 40rpx 0;
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
</style>
