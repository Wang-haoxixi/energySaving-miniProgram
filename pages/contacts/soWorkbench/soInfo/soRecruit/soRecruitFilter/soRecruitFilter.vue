<template>
	<view class="page">
		<view class="container">
			<view class="filter" v-for="(item,index) in data" :key="index">
				<view class="title">
					{{item.conditionName}} <text v-if="item.choice==0" class="subtitle">(单选)</text>
				</view>
				<view class="content">
					<view @tap="tap(item,item2,index)" class="content-item" :class="{active:item2.check}" v-for="(item2,index2) in item.itemList"
					 :key="index2">{{item2.value}}</view>
				</view>
			</view>
			<bottom-button>
				<view class="bottom-item button hollow" @tap="clean">清除</view>
				<view class="bottom-item button solid" @tap="confirm">确定</view>
			</bottom-button>
		</view>
	</view>
</template>

<script>
	import bottomButton from '@/components/bottomButton/bottomButton.vue'
	export default {
		components: {
			bottomButton
		},
		data() {
			return {
				data: '',
				otherType: '',
			};
		},
		methods: {
			tap(list, item, index) {
				if (list.choice == 0 || item.key == 0) {
					list.itemList.forEach(item => {
						item.check = false;
					})
				} else {
					list.itemList[0].check = false;
				}
				item.check = !item.check;
				let json = list.itemList;
				this.data.splice(index, 1, { ...this.data[index],
					itemList: json
				})
			},
			clean() {
				this.data.forEach((item, index) => {
					item.itemList.forEach(item2 => {
						if (item2.key == 0) {
							item2.check = true;
						} else {
							item2.check = false;
						}
					})
					this.data.splice(index, 1, item);
				})
			},
			confirm() {
				uni.setStorageSync('soRecruitTalentFilter', this.data);
				uni.navigateBack();
			}
		},
		onLoad(option) {
			let deFilter = uni.getStorageSync('soRecruitTalentFilter');
			this.$http.get('dms/recruit_query/talent_pool/condition').then(res => {
				if (this.$isEmpty(deFilter)) {
					res.data.data.forEach(item => {
						item.itemList[0].check = true;
					})
					this.data = res.data.data;
				} else {
					this.data = deFilter;
					//TODO 将和deFilter中相同的标记为true
				}
			});
		}
	}
</script>

<style lang="scss">
	.page {
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

		/* #endif */
	}

	.bottom-item {
		display: flex;
		align-items: center;


		.hollow {
			flex: 1;
			color: #F74437;
			background-color: #FFFFFF;
			box-sizing: border-box;
			border: 1px solid #F74437;
			height: 72rpx;
		}

		.solid {
			margin-left: 30rpx;
			flex: 2;
		}
	}

	.container {
		padding: 40rpx 0 92rpx;
	}

	.filter {
		padding-bottom: 60rpx;

		.title {
			margin-left: 40rpx;
			color: #303031;
			font-weight: bold;
			font-size: 32rpx;
			line-height: 44rpx;

			.subtitle {
				font-size: 28rpx;
				color: #919397;
				font-weight: normal;
			}
		}

		.content {
			display: flex;
			flex-wrap: wrap;
			margin-top: 10rpx;
			margin-left: 10rpx;

			.content-item {
				display: flex;
				justify-content: center;
				align-items: center;
				text-align: center;
				width: 184rpx;
				height: 68rpx;
				padding: 0 10rpx;
				font-size: 24rpx;
				line-height: 34rpx;
				background-color: #F4F5F6;
				border-radius: 10rpx;
				margin: 30rpx 0 0 30rpx;
			}

			.active {
				font-weight: bold;
				background-color: #F744371A;
				color: #F74437;
			}
		}
	}
</style>
