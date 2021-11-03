<template>
	<view class="container">
		<view class="flexRowStart search">
			<image v-if="oss" class="searchImg" :src="oss+'icon_search_gray.png'"></image>
			<input maxlength="50" placeholder="搜索" placeholder-class="inputDefault" :value="searchText" @confirm="getValue"></input>
		</view>
		<view class="" v-if="!searchText.length>0">
			<view class="flexRow" style="margin: 0 40rpx;">
				<view class="color_303031 bold searchTitle">
					历史搜索
				</view>
				<image v-if="oss" :src="oss+'icon_delect.png'" mode="" class="deleteImg" @tap="deleteSearch"></image>
			</view>
			<view v-if="searchList.length>0" class="flexRowStart searchList">
				<view @tap="chooseSearch(item)" class="searchItem color_919397 singleEllipsis" v-for="(item,index) of searchList"
				 :key="index" :class="index==2 || index==5 ||index==8?'':'searchItemChoose'">
					{{$isEmpty(item)?'':item}}
				</view>
			</view>
			<image class="emptyImg" v-else-if="oss" :src="oss+'pic_search.png'" mode="aspectFit"></image>
		</view>
		<view class="" v-else>
			<view class="examList" v-for="(item,index) of examList.records" :key="index" @tap="goDetails(item)">
				<view class="doubleEllipsis bold color_303031 examName">
					{{$isEmpty(item.examName)?'':item.examName}}
				</view>
				<view class="flexRow examInfo color_919397">
					<view class="time">
						<view class="">
							{{$isEmpty(item.appShowTime)?'长期有效':item.appShowTime}}
						</view>
					</view>
					<view class="member">
						{{$isEmpty(item.testNumber)?'0':item.testNumber}}人已考
					</view>
				</view>
				<view class="flexRow examOrg color_2F80FF">
					<view class="flexRowStart color_666769">
						<image v-if="oss" class="soAvatarImg" :src="oss+'icon_soExamination_soAvatar.png'"></image>
						<view class="">
							{{$isEmpty(item.orgName)?'':item.orgName}}
						</view>
					</view>
					<view v-if="item.beginStatus==1" class="btn color_F74437" style="background: rgba(247, 68, 55, 0.1);">
						立即参加
					</view>
					<view v-if="item.beginStatus==2" class="btn color_919397" style="background-color: #E3E4E5;">
						未开始
					</view>
					<view v-if="item.beginStatus==3" class="btn color_2F80FF" style="background: rgba(224, 233, 246, 0.9);">
						已参加
					</view>
				</view>
				<view class="freeStatus"  v-if="item.chargeStatus==2 || item.chargeStatus==3">
					<image v-if="oss" :src="oss+'icon_soExamination_notFree.png'" mode=""></image>
				</view>
			</view>
			<image class="emptyImg" v-if="!examList.records.length > 0 && oss" :src="oss+'pic_emptyExam.png'" mode="aspectFit"></image>
			<uni-load-more :status="examListStatus" v-if="examList.records.length > 0"></uni-load-more>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				oss: '',
				searchText: '',
				examList: [],
				examListStatus: '',
				searchList: [],
				isLogin: '',
				url: ''
			};
		},
		onLoad(options) {
			this.oss = this.$oss
			this.isLogin = this.$isEmpty(uni.getStorageSync('token'));
			if (this.isLogin) {
				this.url = 'qms/exam_examination/visitor_app_page';
			} else {
				this.url = 'qms/exam_examination/app_page';
			}
			if (this.$isEmpty(uni.getStorageSync('examSearch'))) {
				uni.setStorageSync('examSearch', [])
			} else {
				this.searchList = uni.getStorageSync('examSearch')
			}
		},
		onReachBottom() {
			let that = this
			if (that.examList.current < that.examList.pages) {
				that.examListStatus = 'loading';
				that.$http.get(this.url, {
					params: {
						source: '2',
						examName: that.searchText,
						current: that.examList.current + 1
					}
				}).then(res => {
					that.examList.current = res.data.data.current;
					that.examList.records = that.examList.records.concat(res.data.data.records);
					that.examListStatus = 'more';
				});
			} else {
				that.examListStatus = 'noMore';
			}
		},
		methods: {
			goDetails(item) {
				// console.log(item.id)
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/soInfo/soExamination/soExaminationDetails/soExaminationDetails?id=${item.id}&examName=${item.examName}`
				})
			},
			getValue(e) {
				this.searchText = e.detail.value
				if (this.searchText == '') {
					this.examList = {}
					this.examListStatus = "noMore"
				} else {
					this.$http.get(this.url, {
						params: {
							source: '2',
							examName: this.searchText
						}
					}).then(res => {
						// console.log(res)
						this.examList = res.data.data
						if (!this.examList.current < this.examList.pages) {
							this.examListStatus = 'noMore'
						}
					})
					let searchList = uni.getStorageSync('examSearch')
					searchList.unshift(this.searchText);
					searchList = Array.from(new Set(searchList));
					if (searchList.length > 9) {
						searchList = searchList.slice(0, 9);
					}
					this.searchList = searchList;
					uni.setStorageSync('examSearch', this.searchList)
				}
			},
			deleteSearch() {
				uni.setStorageSync('examSearch', [])
				this.searchList = []
			},
			chooseSearch(item) {
				this.searchText = item
				this.$http.get(this.url, {
					params: {
						source: '2',
						examName: this.searchText
					}
				}).then(res => {
					// console.log(res)
					this.examList = res.data.data
					if (!this.examList.current < this.examList.pages) {
						this.examListStatus = 'noMore'
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.soAvatarImg{
		width: 48rpx;
		height: 48rpx;
		margin-right: 10rpx;
	}
	.memberImg {
		width: 26rpx;
		height: 26rpx;
		margin-right: 10rpx;
	}

	.searchList {
		flex-wrap: wrap;
		margin-left: 40rpx;
		margin-right: 38rpx;
	}

	.container {
		.examList {
			padding: 30rpx;
			margin: 0 40rpx;
			background-color: #F4F5F6;
			border-radius: 30rpx;
			position: relative;
			margin-bottom: 40rpx;

			.examName {
				font-size: 32rpx;
				line-height: 48rpx;
				margin-bottom: 20rpx;
			}

			.examInfo {
				font-size: 22rpx;
				line-height: 32rpx;
				margin-bottom: 30rpx;
			}

			.examOrg {
				font-size: 24rpx;
				line-height: 34rpx;

				.btn {
					width: 156rpx;
					height: 50rpx;
					line-height: 50rpx;
					text-align: center;
					border-radius: 26rpx;
				}
			}

			.freeStatus {
				width: 60rpx;
				height: 36rpx;
				position: absolute;
				top: -6rpx;
				left: -8rpx;

				image {
					width: 60rpx;
					height: 36rpx;
				}
			}
		}
	}

	.searchItem {
		font-size: 24rpx;
		width: 168rpx;
		height: 34rpx;
		text-align: center;
		line-height: 34rpx;
		border-radius: 10rpx;
		background-color: #F4F5F6;
		margin-top: 30rpx;
		padding: 16rpx 16rpx 16rpx 20rpx;
	}

	.searchItemChoose {
		margin-right: 30rpx;
	}

	.searchTitle {
		font-size: 28rpx;
		line-height: 40rpx;
	}

	.deleteImg {
		width: 44rpx;
		height: 44rpx;
	}

	.search {
		margin: 16rpx 32rpx;
		padding: 18rpx 32rpx;
		border-radius: 60rpx;
		background-color: #F5f7f8;

		.searchImg {
			height: 32rpx;
			width: 32rpx;
			margin-right: 16rpx;
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

	.bottom-safe {
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}
</style>
