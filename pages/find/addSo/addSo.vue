<template>
	<view class="flexColumn" style="padding:0 32rpx;">
		<view hover-class="sunui-uploader-hover" class="sunui-uploader-inputbox">
			<view class="flexColumn" v-if="$isEmpty(imgUrl)" style="width: 100%;height: 100%;">
				<image @click="chooseImage" v-if="oss" :src="oss+'create_soImg.png'" style="width: 240rpx;height: 240rpx;border-radius: 50%;"></image>
				<view class="" style="color: #BCC4CB;font-size: 26rpx;line-height: 40rpx;margin-top: 22rpx;">
					请上传组织头像
				</view>
			</view>
			<image @click="chooseImage" v-else-if="!$isEmpty(imgUrl)" :src="imgUrl" mode="" style="width: 240rpx;height: 240rpx;border-radius: 50%;"></image>
		</view>
		<input type="text" class="txt" placeholder="请输入组织名称" v-model="name" maxlength="15"
			placeholder-style="color: #BABEC0;line-height: 40rpx;font-size: 28rpx;" />
		<view class="bottom">
			<button @tap="upload" class="button">完成</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name: '',
				oss: '',
				imgUrl:'',
				orgId:'',
				login:false
			};
		},
		methods: {
			chooseImage(){
				let that = this
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
							url:`${that.$http_url}admin/file/app/sftp/upload`, //开发者服务器地址
							header: {
								"Content-Type": "multipart/form-data",
								"Authorization":uni.getStorageSync('token')
							},
							filePath: res.tempFilePaths[0], //要上传文件资源的路径
							name: "file", //文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
							success: (res) => {
								// console.log(JSON.parse(res.data))
								if(res.statusCode == 200){
									let url = JSON.parse(res.data).data[0]
									that.imgUrl = url
								}
								// console.log(that.imgUrl)
							}
						});
					}
				});
			},
			upload() {
				let that = this
				if(that.$isEmpty(that.name)){
					uni.showToast({
						title:'组织名称不能为空',
						icon:"none"
					})
				}else{
					that.$http.post('admin/org/create', {
						name: that.name,
						avatar: that.imgUrl,
						isOpen:true
					}).then(res => {
						if (res.data.code == 0) {
							that.orgId = res.data.data.orgId
							// console.log(that.orgId)
							uni.showToast({
								icon: 'none',
								title: '创建成功',
								success:()=> {
									setTimeout(function() {
										uni.redirectTo({
											url:'/pages/contacts/soWorkbench/soWorkbench?id=' + that.orgId
										})
									}, 1000)
								}
							});
						} else {
							uni.showToast({
								title: res.data.message,
								icon: "none"
							})
						}
					});
				}
			}
		},
		onLoad() {
			this.oss = this.$oss
			this.login = !this.$isEmpty(uni.getStorageSync('token'))
			if(this.login){
				
			}else{
				uni.navigateTo({
					url:'/pages/getUserInfo/getUserInfo'
				})
			}
		},
		onShow() {}
	}
</script>

<style lang="scss" scoped>
	.txt {
		width: 622rpx;
		margin-top: 80rpx;
		color: #272727;
		font-size: 28rpx;
		line-height: 40rpx;
		background-color: #f5f7f8;
		padding: 32rpx;
		border-radius: 16rpx;
	}

	.bottom {
		position: fixed;
		bottom: 40rpx;
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}

	.button {
		width: 670rpx;
	}

	.sunui-uploader-hover {
		box-shadow: 0 0 0 #e5e5e5;
		background: #e5e5e5;
	}

	.sunui-uploader-inputbox {
		position: relative;
		margin-top:88rpx;
		box-sizing: border-box;
		// background-color: #F4F5F6;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		// width: 400rpx;
		// height: 400rpx;
		// border-radius: 20rpx;
		// margin-right: 29rpx;
		// margin-top: 30rpx;
	}
</style>
