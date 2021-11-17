<template>
	<view class="container" @tap="hide()">
		<view id="top" class="flexRow contentWrap">
			<view class="flexRow" @tap.stop="show()">
				<view class="color_303031 bold typeName">{{ $isEmpty(typeName)?'':typeName }}</view>
				<image v-if="oss" class="pulldownImg" :src="oss+'icon_ican_pulldown.png'"></image>
			</view>
			<view class="showList" v-show="isPullDown">
				<view class="flexColumn" style="padding: 18rpx;">
					<view v-for="(item,index) in typeList" :key="index" class="color_666769 typeList" @tap="changeType(item)">{{ $isEmpty(item.name)?'':item.name}}</view>
				</view>
			</view>
			<view class="search flexRowStart">
				<image v-if="oss" class="search-icon" :src="oss+'icon_search_gray.png'"></image>
				<input class="search-text" placeholder="搜索" placeholder-class="inputDefault" @input="search" v-model="searchText"
				 focus="true" />
			</view>
		</view>
		<scroll-view :style="{height:scrollHeight + 'px'}" :scroll-top="30" scroll-y="true" @scrolltolower="soMore">
			<view class="flexRowStart records" v-for="(item,index) in data.records" :key="index" @tap="detail(item)">
				<image lazy-load="true" :src="item.poster" class="posterImg" mode="aspectFit"></image>
				<view class="info flexColumnStart" style="justify-content: space-between;">
					<view class="bold doubleEllipsis name">{{ $isEmpty(item.name)?'':item.name}}</view>
					<view class="flexColumnStart">
						<view class="color_3CD489 typeInfo" v-if="item.ticketingManagements && item.ticketingManagements[0].ticketingType === '1'">免费</view>
						<view class="color_F74437 typeInfo" v-if="item.ticketingManagements &&item.ticketingManagements[0].ticketingType === '2'">{{ getMoney(item.ticketingManagements[0])}}</view>
						<view class="color_919397 city">{{$isEmpty(item.startTime)?'':item.startTime.substring(0,10)}}
							|
							{{ $isEmpty(item.city)?'':item.city }}</view>
					</view>
				</view>
			</view>
			<image class="emptyImg" v-if="!data.records.length>0 && oss" :src="oss+'pic_energy_default_wuxinxi.png'" mode="aspectFit"></image>
			<uni-load-more :status="moreStatus" v-if="data.records.length>0"></uni-load-more>
			<view class="safe-bottom">
				
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				typeName: '',
				scrollHeight: 0,
				isPullDown: false,
				typeList: [],
				status: '',
				moreStatus: '',
				data: '',
				searchText: '',
				oss: ''
			};
		},
		methods: {
			search() {
				this.$http
					.get('qms/conference_publish/activitie_page', {
						params: {
							status: this.status,
							name: this.searchText
						}
					})
					.then(res => {
						this.data = res.data.data;
					});
			},
			getdata() {
				this.$http
					.get('qms/conference_publish/activitie_page', {
						params: {
							status: this.status,
							name: this.searchText
						}
					})
					.then(res => {
						this.data = res.data.data;
					});
			},
			soMore() {
				let that = this;
				if (that.data.current < that.data.pages) {
					that.moreStatus = 'loading';
					this.$http
						.get('qms/conference_publish/activitie_page', {
							params: {
								status: this.status,
								name: this.searchText,
								current: that.data.current + 1
							}
						})
						.then(res => {
							that.data.current = res.data.data.current;
							that.data.records = that.data.records.concat(res.data.data.records);
							that.moreStatus = 'more';
						});
				} else {
					that.moreStatus = 'noMore';
				}
			},
			changeType(item) {
				this.status = item.type;
				this.typeName = item.name;
				this.getdata();
			},
			getMoney(ticket) {
				if (ticket.canMoney != '' && ticket.money == '') {
					return `${ticket.canMoney}贝`;
				} else if (ticket.money != '' && ticket.canMoney == '') {
					return `${ticket.money}元`;
				} else if (ticket.money != '' && ticket.canMoney != '') {
					return `${ticket.canMoney}贝/${ticket.money}元`;
				}else{
					return `0`;
				}
			},
			show() {
				this.isPullDown = !this.isPullDown;
			},
			hide() {
				this.isPullDown = false;
			},
			detail(item) {
				uni.navigateTo({
					url: '../../../contacts/soWorkbench/soInfo/soActivity/soActivityDetails/soActivityDetails?id=' + item.id,
				})
			},
		},
		onLoad(option) {
			this.oss = this.$oss
			this.typeName = option.typeName;
			this.status = option.status;
			this.$http
				.get('qms/conference_publish/activity_type')
				.then(res => {
					this.typeList = res.data.data;
				});
			this.getdata();
			uni.createSelectorQuery()
				.in(this)
				.select('#top')
				.boundingClientRect()
				.exec(ret => {
					let height = uni.getSystemInfoSync().windowHeight;
					height = height - ret[0].height;
					this.scrollHeight = height;
				});
		}
	}
</script>

<style lang="scss" scoped>
	.search {
		padding: 18rpx 32rpx;
		border-radius: 60rpx;
		background-color: #FFFFFF;
		flex: 1;
		margin-left: 30rpx;

		.search-icon {
			height: 32rpx;
			width: 32rpx;
		}

		.search-text {
			flex: 1;
			font-size: 28rpx;
			padding: 0 14rpx;
			color: #666769;
		}

		.inputDefault {
			font-size: 28rpx;
			color: #919397;
		}
	}

	.showList {
		background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKoAAAD6CAYAAAAx+Nx1AAAIu0lEQVR4Xu3Zz28UdRzG8e9nZrbt/molMTHuDy6YGK6GeAX+AjBGLpyNevAmhD/BCDcP6B0uJAT4C8CD8cJRoyQ2MdmZqTfs/ui23Zn5mmmkgYJC7UL2ybx74tCdeeZ5XszuTs3xM/cGBoNB19Xrrv/228ncD17RA1pFr/u1XPbGxsbpWV5cD8xOlifwzv1iPvy013vnp9dywgodFKhzGvuPJPkgcvZjo9FYWVpa2jvqbHfXTba2pkWefXj8+PGf53SqSh4GqHOafRCn9xuN+pnl5eVnjrizs+O2tqYP+r3O2TmdqpKHAeocZh8MBmeCMLq/urrqzJ6t1HvvhsOhK/LsbL/ffzCH01XyEECdw+z/djd9cmjuqkcvGahH7PC/7qZPDs1d9YglO+eAesQOB3H6oNGonz742fTgYf+5q/7Q73XOHPGUlXw5UI8we5ymnwUWfNdut5/7bHrwsOVddTQaucIXn/c6ne+PcNpKvhSoh5zdex+mafpe4f0XYRh92Ww2gzAMX+koeZ67yWRS5Hn2bWB2vdPp/G5m+Su9uOK/9EKo3vtakiTnzYJz3vtTzqzjvW9XvKv9yw+CwNVqNbeysuLKfx/mpygKt7297WazmSv/XfUfMxs571Mze+h9ca/b7d41s9nBXp6DOkjTj1zhrkZReKJ8cB1F0d4YBx+7VL1grn8+DZQficr/sFmWud3dXZdl+boL3KV+p3Pn6TPsQ/XeB3Gcfh1G4Vf1esNqtWg+STgKDRyigdksc9Ppls+z/Fqv17liZntvO/tQB4Pkm6gWXWo2m4d+OztEDn6VBl7aQHmHnUwmLptlV/v97uV9qOXbfWjB7VarZYf9zPXSs/ILNPA/Giixjsdjn/vi4/JjgJVfnOJk49dWq3WCt/v/0SgveW0NlB8DxuPxeq/77kmL441Pwii4VT4L5IcGFq2B8tlzns0uWJKkN1bq9Ysv+8vKol0AearRQPkXve3p9KbFcfJbe3X1/Vd9aF2NerjKRWmg/CPJaDh8ZHGSDtfW1to8J12UacjxdAPlc9bNzc2RDeLEHzt2jHZoYGEbePz4sQPqws5DsCcNABULEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQu5BjZNkuLb2VtvMaIQGFq4B773b3PxrZHGc/NZeXX0/DMOFC0kgGsjz3I2Gw0eWJOmNlXr94vLyMq3QwMI1sLOz47an05sWx/EnYVS71W63Fy4kgWhgNBq5PJtdMO99LU42fm21WidqtYhmaGBhGpjNMjcej9d73XdP7n2DGqTpR6EFt1utlgVBsDBBCVLdBoqiKJH63Bcf9zudO/tf9QeD5JuoFl1qNpsOrNUFsghXXiKdTCYum2VX+/3u5TLTPlTvfRDH6ddhFH5VrzeMjwGLMFn1MpRv99Ppls+z/Fqv17liZsUzUJ9UUn4McIW7GkXhiaWlJRdF0d4dlues1UPzJq64fE5a3kGzLHO7u7suy/J1F7hL5dv90+d/4VP+8gtWkvx53syf896fcmYd7z2PBd7EchU7h5mNnPepmT30vrjX7XbvmtnsYA1/A9cOclFW4Q9tAAAAAElFTkSuQmCC');
		position: absolute;
		left: 0;
		top: 95rpx;
		z-index: 10;
		width: 170rpx;
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}

	.container {
		padding: 0 32rpx;
		height: 100vh;
		 background-color: #f5f7f8;

		.contentWrap {
			position: relative;
			padding: 16rpx 0;

			.typeName {
				font-size: 34rpx;
			}

			.pulldownImg {
				width: 34rpx;
				height: 34rpx;
			}

			.typeList {
				font-size: 28rpx;
				padding: 20rpx 0;
				border-bottom: 2rpx solid #E3E4E5;
			}
		}

		.records {
			padding: 24rpx;
			background-color: #FFFFFF;
			margin-bottom: 16rpx;
			border-radius: 16rpx;

			.posterImg {
				width: 300rpx;
				height: 180rpx;
				border-radius: 16rpx;
				margin-right: 24rpx;
			}

			.info {
				flex: 1;
				height: 180rpx;
				.name {
					font-size: 28rpx;
					line-height: 40rpx;
					// width: 320rpx;
					color: #272727;
				}

				.typeInfo {
					font-size: 28rpx;
					line-height: 40rpx;
					// margin-top: 20rpx;
				}

				.city {
					font-size: 24rpx;
					margin-top: 8rpx;
					line-height: 34rpx;
				}
			}
		}
	}
</style>
