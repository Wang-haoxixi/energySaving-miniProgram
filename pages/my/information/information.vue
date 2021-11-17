<template>
	<view>
		<view class="list" style="padding: 24rpx 0;" @tap="changeAvatar">
			<view class="list-title color_303031">头像</view>
			<view class="list-text">
				<image v-if="data.avatar" :src="imageError(data.avatar,$oss)" style="height: 64rpx;width: 64rpx;border-radius: 50%;" mode="aspectFill"></image>
			</view>
			<image v-if="oss" class="list-end" :src="oss + 'icon_right_gray.png'"></image>
		</view>
		<view class="list" @tap="changeName">
			<view class="list-title color_303031">姓名</view>
			<view class="list-text">{{ $isEmpty(data.realName)?'':data.realName }}</view>
			<image v-if="oss" class="list-end" :src="oss + 'icon_right_gray.png'"></image>
		</view>
		<picker @change="sexPickerChange" :value="sexIndex" :range="sexArray" range-key="name">
			<view class="list">
				<view class="list-title color_303031">性别</view>
				<view class="list-text">
					{{ $isEmpty(data.sex)?'请完善':(data.sex == 1 ?'男' : '女') }}
				</view>
				<image v-if="oss" class="list-end" :src="oss + 'icon_right_gray.png'"></image>
			</view>
		</picker>
		<view class="list" @tap="toIntreLabel">
			<view class="list-title color_303031">兴趣</view>
			<view class="list-text">
				<view v-if="index < 3" v-for="(item, index) in data.abilityTag" :key="index" style="padding: 4rpx 20rpx;background-color: #F4F5F6;color: #919397;font-size: 20rpx;border-radius: 10rpx;margin-left: 10rpx;">
					{{ item }}
				</view>
			</view>
			<image v-if="oss" class="list-end" :src="oss + 'icon_right_gray.png'"></image>
		</view>
		<view class="list" @tap="toChooseIndustry">
			<view class="list-title color_303031">行业</view>
			<view class="list-text">
				<view class="singleEllipsis"  style="width: 476rpx;text-align: right;">{{ $isEmpty(industry)?'请完善':industry }}</view>
			</view>
			<image class="list-end" :src="$ossUrl('icon_right_gray.png')"></image>
		</view>
		<view class="list" @tap="changePosition">
			<view class="list-title color_303031">头衔</view>
			<view class="list-text" style="width: 476rpx;">
				<view class=" singleEllipsis">{{ getCompanyStation(data.company,position) }}</view>
			</view>
			<image v-if="oss" class="list-end" :src="oss + 'icon_right_gray.png'"></image>
		</view>
		<view class="list" @tap="changeSign">
			<view class="list-title color_303031">个性签名</view>
			<!-- <view style="flex: 1;"></view> -->
			<view class="list-text" style="width: 476rpx">
				<view class=" singleEllipsis">{{ $isEmpty(data.sign)?'请完善':data.sign }}</view>
			</view>
			<image v-if="oss" class="list-end" :src="oss + 'icon_right_gray.png'"></image>
		</view>
		<view class="list" @tap="checkCode">
			<view class="list-title color_303031">二维码名片</view>
			<view class="list-text"><image v-if="oss" :src="oss+'icon_qrCode.png'" style="width: 32rpx;height: 32rpx;"></image></view>
			<image class="list-end" v-if="oss" :src="oss + 'icon_right_gray.png'"></image>
		</view>
		<view class="list" style="border-bottom: none;justify-content: space-between;" @tap="more">
			<view class="list-title color_303031">更多</view>
			<image v-if="oss" class="list-end" :src="oss + 'icon_right_gray.png'"></image>
		</view>
	</view>
</template>

<script>
	import {
		getCompanyStation,
		imageError
	} from '@/common/utils.js';
	export default {
		data() {
			return {
				data: '',
				oss: '',
				position: '',
				sexIndex: 0,
				sexArray: [{
					name: '男',
					value: 1
				}, {
					name: '女',
					value: 2
				}],
				industry:''
			};
		},
		methods: {
			imageError,
			sexPickerChange(e) {
				this.$http.post('admin/user/app/update', {
					sex: e.detail.value - -1
				}).then(res => {
					this.data = res.data.data;
					this.sexIndex = this.data.sex - 1;
					if (this.data.position) {
						this.position = this.data.position.split('-')[(this.data.position.split('-').length - 1)]
					}
				});
			},
			toChooseIndustry () {
				//Cross-module
				uni.navigateTo({
					url: `/pages/find/recruit/industrySelection/industrySelection?industry=${this.data.industry}`,
					events: {
						industryChange: (industry) => {
							this.$http.post('admin/user/app/update', {
								industry
							}).then(res => {
								this.data = res.data.data;
								this.sexIndex = this.data.sex - 1;
								if (this.data.position) {
									this.position = this.data.position.split('-')[(this.data.position.split('-').length - 1)]
								}
							});
						}
					}
				})
			},
			toIntreLabel(){
				let tagList = JSON.stringify(this.data.abilityTag)
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/editSoInfo/editLag/editLag?tagList=${tagList}&self=mySelf&userId=${this.data.userId}`
				})
			},
			getCompanyStation,
			more() {
				uni.navigateTo({
					url: 'detail/detail?id=' + this.data.userId
				})
			},
			changeAvatar(){
				let that =this 
					uni.chooseImage({
						count: 1, //默认9
						// sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
						sourceType: ['album','camera'], //从相册选择
						success: function(res) {
							uni.uploadFile({
								// src: res.tempFilePaths[0],
								// success: function(image) {
								// 	that.soInfo.org.avatar = image.path
								// }
								url:`${that.$http_url}/admin/file/app/sftp/upload`, //开发者服务器地址
								// url:`https://www.modulestore.cn/api/admin/file/app/sftp/upload`, //开发者服务器地址
								// url:`${that.$http_url}/admin/sys_file/oss/upload`, //开发者服务器地址
								header: {
									"Content-Type": "multipart/form-data",
									"Authorization":uni.getStorageSync('token')
								},
								filePath: res.tempFilePaths[0], //要上传文件资源的路径
								name: "file", //文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
								success: (res) => {
									// console.log(res)
									if(res.statusCode ==200){
										// console.log(JSON.parse(res.data))
										let url = JSON.parse(res.data).data[0]
										// console.log(that.imgUrl)
										that.$http.post('admin/user/app/update', {
											avatar:url
										}).then(res => {
											that.data = res.data.data;
										});
									}
								}
							});
						}
				});
			},
			changeName(){
				uni.navigateTo({
					url:`/pages/my/information/changeName/changeName?name=${this.data.realName}`
				})
			},
			changePosition(){
				uni.navigateTo({
					url:`/pages/my/information/changePosition/changePosition?company=${this.data.company}&position=${this.data.position}`
				})
			},
			changeSign(){
				uni.navigateTo({
					url:`/pages/my/information/changeSignature/changeSignature?sign=${this.data.sign}`
				})
			},
			checkCode(){
				uni.navigateTo({
					url:`/pages/my/information/myCode/myCode?avatar=${this.data.avatar}&realName=${this.data.realName}&position=${this.data.position}&id=${this.data.userId}`
				})
			}
		},
		onLoad() {
			this.oss = this.$oss;
			uni.$on('industry',data=>{
				this.data.industry = JSON.parse(data)
				this.industry = this.data.industry.join('-')
				this.$http.post('admin/user/app/update', {
					industry:this.industry
				}).then(res => {
					this.data = res.data.data;
				});
			})
		},
		onShow() {
			this.$http.get('admin/app/my').then(res => {
				this.data = res.data.data;
				this.sexIndex = this.data.sex - 1;
				if (this.data.position) {
					this.position = this.data.position.split('-')[(this.data.position.split('-').length - 1)]
				}
				if(this.data.industry){
					this.industry = this.data.industry
				}
			});
		}
	};
</script>

<style lang="scss">
	.list {
		margin-left: 32rpx;
		margin-right: 32rpx;
		padding: 36rpx 0;
		display: flex;
		align-items: center;
		border-bottom: 0.3px #eff0f1 solid;

		.list-title {
			// color: #303031;
			font-size: 30rpx;
			line-height: 42rpx;
			// font-weight: bold;
		}

		.list-text {
			flex: 1;
			color: #565B5F;
			font-size: 28rpx;
			line-height: 40rpx;
			display: flex;
			justify-content: flex-end;
		}

		.list-end {
			margin-right: -16rpx;
			height: 44rpx;
			width: 44rpx;
		}
	}
</style>
