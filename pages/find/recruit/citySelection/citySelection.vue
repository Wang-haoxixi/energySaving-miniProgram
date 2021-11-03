<template>
	<view class="container">
		<scroll-view class="city" scroll-y>
			<view class="safe-bottom">
				<view class="item" v-for="(item,index) in city" :class="{active: index == cityIndex}" :key="index" @tap="cityTap(index)">
					{{item.name}}
				</view>
			</view>
		</scroll-view>
		<scroll-view class="secondaryCity" scroll-y>
			<view class="safe-bottom">
				<view class="item" v-for="(item,index) in city[cityIndex].children" :class="{active: index == secondaryCityIndex}"
				 :key="index" @tap="secondaryCityTap(index)">
					{{item.name}}
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import city from '@/common/city.js'
	export default {
		data() {
			return {
				city: '',
				cityIndex: 0,
				secondaryCityIndex: 0,
				scrollHeight: 0,
			};
		},
		methods: {
			cityTap(index) {
				if (index == 0) {
					let pages = getCurrentPages()
					let beforePage = pages[pages.length - 2]
					uni.navigateBack({
						success: () => {
							beforePage.$vm.cityChange({
								cityIndex: 0,
								secondaryCityIndex: 0,
								cityName: this.city[index].name,
								secondaryCityName: ''
							})
						}
					});
				} else {
					this.cityIndex = index;
					this.secondaryCityIndex = null
				}
			},
			secondaryCityTap(index) {
				let pages = getCurrentPages()
				let beforePage = pages[pages.length - 2]
				uni.navigateBack({
					success: () => {
						beforePage.$vm.cityChange({
							cityIndex: this.cityIndex,
							secondaryCityIndex: index,
							cityName: this.city[this.cityIndex].name,
							secondaryCityName: this.city[this.cityIndex].children[index].name
						})
					}
				});
			}
		},
		onLoad(options) {
			let json = {
				name: "全国"
			}
			//deepcopy
			let cityStr = JSON.stringify(city);
			this.city = JSON.parse(cityStr);
			this.city.splice(0, 0, json);
			if (options.cityIndex && !this.$isEmpty(options.cityIndex)) {
				this.cityIndex = options.cityIndex;
				this.secondaryCityIndex = options.secondaryCityIndex;
			} else {
				this.cityIndex = 0;
				this.secondaryCityIndex = 0;
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FFFFFF;
	}

	.active {
		background-color: #F4F5F6 !important;
		color: #303031 !important;
		font-weight: bold !important;
	}

	.container {
		display: flex;
		height: 100vh;
		flex: 1;
	}

	.item {
		height: 108rpx;
		font-size: 28rpx;
		color: #919397;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.city {
		flex: 1;
		border-right: 0.3rpx solid #EFF0F1;
	}

	.secondaryCity {
		flex: 2;
	}
</style>
