<template>
	<view>
		<view class="container">
			<view class="flexRow avatarContent" @tap='editAvatar'>
				<view class="color_303031 bold">
					头像
				</view>
				<image :src="soInfo.org.avatar" class="avatarImg"></image>
			</view>
			<view class="flexRow soNameContent">
				<view class="color_303031 bold" style="margin-right: 10rpx;">
					名称
				</view>
				<input type="text" v-model="soInfo.org.name" maxlength="20" placeholder="请输入组织名字" class="" style="flex: 1; text-align: right;color: #919397;"
				 placeholder-style="color:#BABEC0" />
			</view>
			<view class="flexRow soNameContent" @tap="editIndustry">
				<view class="flexRow" style="flex: 1;min-width: 0rpx;">
					<view class="color_303031 bold" style="margin-right: 20rpx;">
						行业
					</view>
					<view v-if="soInfo.org.industry==''" class="color_BABEC0 industry">
						请选择行业
					</view>
					<view v-else class="singleEllipsis color_919397 industry">
						{{soInfo.org.industry}}
					</view>
				</view>
				<image v-if="oss" :src="oss+'icon_createTask_grayRight.png'" class="rightImg"></image>
			</view>
			<picker class="urgencyInfo" mode="region" @change="bindPickerChange">
				<view class="flexRow wrapUrgency">
					<view class="flexRow urgencyContent">
						<view class="color_303031 bold urgencyTitle">所在地</view>
						<view class="color_BABEC0" v-if="soInfo.org.contactAddress==''">
							请选择所在地
						</view>
						<view v-else class="uni-input color_919397 urgency">{{soInfo.org.contactAddress}}</view>
					</view>
					<image v-if="oss" :src="oss+'icon_createTask_grayRight.png'" class="rightImg"></image>
				</view>
			</picker>
			<view class="soNameContent">
				<view class="color_303031 bold" style="margin-bottom: 48rpx;">
					口号
				</view>
				<view class="flexRow" @tap="editSlogan">
					<!-- <input type="text" disabled="true" v-model="soInfo.org.slogan" class="singleEllipsis" style="flex: 1;color: #919397;"
					 placeholder-style="color:#BABEC0" /> -->
					 <view class="singleEllipsis" v-if="soInfo.org.slogan" style="flex: 1;color: #919397;">
					 	{{soInfo.org.slogan}}
					 </view>
					 <view class="" v-else style="flex: 1;color: #919397;">
					 	做APP，就上组件宝
					 </view>
					<image v-if="oss" :src="oss+'icon_createTask_grayRight.png'" class="rightImg"></image>
				</view>
			</view>
			<!-- <view class="soNameContent">
				<view class="color_303031 bold" style="margin-bottom: 48rpx;">
					介绍
				</view>
				<view class="flexRow" @tap="editIntroduction">
					<input type="text" disabled="true" v-model="soInfo.org.introduction" class="singleEllipsis" style="color: #919397;flex: 1;"
					 placeholder="请简要描述SO关注的内容和提供的服务" placeholder-style="color:#BABEC0" />
					<image v-if="oss" :src="oss+'icon_createTask_grayRight.png'" class="rightImg"></image>
				</view>
			</view> -->
			<view class="soNameContent">
				<view class="color_303031 bold" style="margin-bottom: 48rpx;">
					标签
				</view>
				<view class="flexRow" @tap="editTag">
					<view class="flexRowStart">
						<view class="color_666769 tagList" v-if="index<3" v-for="(item,index) of orgInfo.abilityTag" :key="index"
						 style="margin-right: 20rpx;">
							{{$isEmpty(item)?'': item}}
						</view>
					</view>
					<!-- <view class="color_666769 tagList" v-else>
						暂无标签
					</view> -->
					<image v-if="oss" :src="oss+'icon_createTask_grayRight.png'" class="rightImg"></image>
				</view>
			</view>
		</view>
		<view class="bottom-safe" style="height: 112rpx;"></view>
		<view class="btn">
			<view class="button freeBtn" @tap="addNotice">
				发布
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				soInfo: '',
				oss: '',
				//要报错，固添加一个对象保存标签
				orgInfo:''
				// value:'请选择所在地',
				// industryValue:'请选择行业'
			};
		},
		onLoad(options) {
			this.oss = this.$oss
			this.$http.get(`admin/app/org/workplace/v2/${options.id}`).then(res => {
				// console.log(res)
				this.soInfo = res.data.data
				this.orgInfo=this.soInfo.org
			})
			uni.$on('slogan', data => {
				// console.log(data)
				this.soInfo.org.slogan = data
			})
			uni.$on('introduction', data => {
				// console.log(data)
				this.soInfo.org.introduction = data
			})
			uni.$on('tagList', data => {
				console.log(data)
				this.soInfo.org.abilityTag = JSON.parse(data)
			})
			uni.$on('industry', data => {
				console.log(data)
				let list = JSON.parse(data)
				this.soInfo.org.industry = list.join('-')
				// this.industryValue = JSON.parse(data)
			})
		},
		onUnload() {
			uni.$off()
		},
		methods: {
			editAvatar() {
				let that = this
				uni.chooseImage({
					count: 1, //默认9
					// sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					// sourceType: ['album'], //从相册选择
					success: function(res) {
						uni.uploadFile({
							// src: res.tempFilePaths[0],
							// success: function(image) {
							// 	that.soInfo.org.avatar = image.path
							// }
							url:`${that.$http_url}admin/file/app/sftp/upload`, //开发者服务器地址
							header: {
								"Content-Type": "multipart/form-data",
								"Authorization":uni.getStorageSync('token')
							},
							filePath: res.tempFilePaths[0], //要上传文件资源的路径
							name: "file", //文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
							success: (res) => {
								// console.log(JSON.parse(res.data).data[0])
								if(res.statusCode==200){
									let url = JSON.parse(res.data).data[0]
									that.soInfo.org.avatar = url
									uni.$emit('avatarStatus',true)
								}
							}
						});
					}
				});
			},
			bindPickerChange(e) {
				// console.log(e)
				this.soInfo.org.contactAddress = e.detail.value[0] + '-' + e.detail.value[1] + '-' + e.detail.value[2]
			},
			editSlogan() {
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/editSoInfo/editSlogan/editSlogan?slogan=${this.soInfo.org.slogan}`
				})
			},
			editIntroduction() {
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/editSoInfo/editIntroduction/editIntroduction?introduction=${this.soInfo.org.introduction}`
				})
			},
			editTag() {
				let tagList = JSON.stringify(this.soInfo.org.abilityTag)
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/editSoInfo/editLag/editLag?tagList=${tagList}`
				})
			},
			editIndustry() {
				if (this.soInfo.org.industry != '') {
					uni.navigateTo({
						url: `/pages/contacts/soWorkbench/editSoInfo/editIndustry/editIndustry?titleList=${this.soInfo.org.industry}&status=false`
					})
				} else {
					uni.navigateTo({
						url: `/pages/contacts/soWorkbench/editSoInfo/editIndustry/editIndustry`
					})
				}
			},
			addNotice() {
				// console.log(this.soInfo.org.name)
				this.$http.post('admin/org/update', {
					...this.soInfo.org
				}).then(res => {
					// console.log(res)
					if (res.data.code == 0) {
						uni.navigateBack({
							delta: 1
						})
					} else {
						uni.showToast({
							title: res.data.message,
							icon: "none"
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.tagList {
		font-size: 20rpx;
		line-height: 28rpx;
		background-color: #F5f7f8;
		padding: 6rpx 14rpx;
		border-radius: 10rpx;
	}

	.rightImg {
		width: 44rpx;
		height: 44rpx;
		margin-right: -12rpx;
	}

	.soNameContent {
		border-bottom: 2rpx solid #EFF0F1;
		padding: 44rpx 0rpx 24rpx;

		.industry {
			flex: 1;
			text-align: right;
			min-width: 0rpx;
		}
	}

	.avatarContent {
		border-bottom: 2rpx solid #EFF0F1;
		padding-bottom: 24rpx;

		.avatarImg {
			width: 92rpx;
			height: 92rpx;
			border-radius: 50%;
		}
	}

	.urgencyInfo {
		.wrapUrgency {
			padding-top: 44rpx;
			padding-bottom: 24rpx;
			border-bottom: 0.3rpx solid #EFF0F1;

			.urgencyImg {
				width: 44rpx;
				height: 44rpx;
				margin-right: 20rpx;
			}

			.urgencyContent {
				flex: 1;

				.urgencyTitle {
					font-size: 28rpx;
					font-weight: 400rpx;
					line-height: 2;
				}

				.urgency {
					font-size: 28rpx;
					line-height: 40rpx;
				}
			}
		}
	}

	.container {
		padding: 32rpx;
		font-size: 28rpx;
		line-height: 40rpx;
	}

	.btn {
		width: 100%;
		background-color: #FFFFFF;
		z-index: 666;
		position: fixed;
		bottom: 0rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

		.freeBtn {
			width: 686rpx;
			margin: 24rpx 32rpx
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
