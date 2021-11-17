<template>
	<view class="container">
		<view class="containerWrap">
			<view class="content">
				<view class="userList">
					<view class="color_666769" style="margin-bottom: 40rpx;">
						请添加报名人员
					</view>
					<view class="flexRow" style="height: 100rpx;">
						<scroll-view scroll-x="true" style="width: 85%;height: 100rpx;">
							<view class="flexRowStart" style="height: 100rpx;">
								<view :class="item.status == true?'active':'unactive'" v-for="(item,index) of userList" :key="index" @tap="changeUser(item,index)">
									<view class="" style="white-space: nowrap;">
										 {{$isEmpty(item.item)?'': item.item}}
									</view>
									<image class="deleteImg" @tap.stop="deleteUser(index)" v-if="userList.length>1 && index!=0 && oss" :src="oss+'icon_activityDeleteUser.png'"></image>
								</view>
							</view>
						</scroll-view>
						<image v-if="oss" :src="oss+'icon_activityAddUser.png'" mode="aspectFit" style="width: 72rpx;height: 72rpx;" @tap="addUser"></image>
					</view>
				</view>
				<view class="" style="font-size: 28rpx;line-height: 40rpx">
					<view class="color_666769">
						联系人信息
					</view>
					<view class="" v-for="(item,index) of userInfo" :key="index">
						<view class="flexRow userInfoItem" v-if="item.type == 'input'">
							<view class="color_303031" style="margin-right: 20rpx;">
								{{$isEmpty(item.label)?'':item.label}}<text style="margin-left: 10rpx;" v-if="item.must == true" class="color_F74437">*</text>
							</view>
							<input @blur.stop="checkForm(item)" style="flex: 1;min-width: 0;" class="color_919397 singleEllipsis" v-model="item.value" :placeholder="item.placeholder"
							 placeholder-style="color:#BABEC0;" />
						</view>
						<view class="userInfoItem" v-if="item.type =='textarea'">
							<view class="color_303031" style="margin-right: 20rpx;margin-bottom: 28rpx;">
								{{$isEmpty(item.label)?'':item.label}}<text style="margin-left: 10rpx;" v-if="item.must == true" class="color_F74437">*</text>
							</view>
							<textarea @blur.stop="checkForm(item)" class="color_919397" v-model="item.value" :placeholder="item.placeholder" placeholder-style="color:#BABEC0;"
							 style="width: 100%;"></textarea>
						</view>
						<view class="" v-if="item.type == 'radio'" style="padding-top: 48rpx;">
							<view class="color_303031" style="margin-right: 20rpx;">
								{{$isEmpty(item.label)?'':item.label}}<text style="margin-left: 10rpx;" v-if="item.must == true" class="color_F74437">*</text>
							</view>
							<radio-group name="">
								<label @tap.stop="checkForm(item,item2)" class="flexRowStart" v-for="(item2,index2) of item.optionsList" :key="index2" style="margin-top: 40rpx;">
									<radio :checked="item2.select" color="#46B28B"/>
									<view class="color_666769">
										{{$isEmpty(item2.label)?'':item2.label}}
									</view>
								</label>
							</radio-group>
						</view>
						<view class="" v-if="item.type == 'checkbox'" style="padding-top: 48rpx;">
							<view class="color_303031" style="margin-right: 20rpx;">
								{{$isEmpty(item.label)?'':item.label}}<text style="margin-left: 10rpx;" v-if="item.must == true" class="color_F74437">*</text>
							</view>
							<checkbox-group name="">
								<label @tap.stop="checkForm(item,item2)" class="flexRowStart" v-for="(item2,index2) of item.optionsList" :key="index2" style="margin-top: 40rpx;">
									<checkbox :checked="item2.select"/>
									<view class=" color_666769">
										{{$isEmpty(item2.label)?'':item2.label}}
									</view>
								</label>
							</checkbox-group>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="bottom-safe" style="height: 112rpx;"></view>
		<view class="btn">
			<view class="button submitOrder bgColor_clickable" @tap="submitForm()">
				提交
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				conferenceId: '',
				ticketId: '',
				orderNum: '',
				//单人信息表单
				userInfo: [],
				//顶部名字列表
				userList: [],
				//最后提交列表
				submitList: [],
				//判断在哪一个人员信息表，方便表单验证，以及新输入信息的替换
				item_id:0,
				oss:''
			};
		},
		onLoad(options) {
			this.oss=this.$oss
			const {
				conferenceId,
				ticketId,
				ticketCount
			} = options
			this.conferenceId = conferenceId
			this.ticketId = ticketId
			this.orderNum = ticketCount
			// console.log(this.orderNum,this.conferenceId,this.ticketId)
			this.$http.get('qms/conference_config/get_form_config', {
				params: {
					activityId: this.conferenceId,
					setDefault: true
				}
			}).then(res => {
				// console.log(res)
				this.userInfo = res.data.data
				// console.log(this.userInfo)
				this.submitList.push(this.userInfo)
				// console.log(this.submitList)
				uni.setStorageSync('submitList', this.submitList)
				this.submitList = uni.getStorageSync('submitList')
				this.userList = this.submitList.map(item => {
					return item[0].value
				})
				this.userList = this.userList.map(item => {
					return {
						item,
						status: false
					}
				})
				this.userList.forEach((item, index) => {
					if (index == 0) {
						item.status = true
					}
				})
				// console.log(this.userList)
			})
			uni.$on('data', (res) => {
				// console.log(res)
				this.submitList.push(res)
				uni.setStorageSync('submitList', this.submitList)
			})
		},
		onShow() {
			this.userList = this.submitList.map(item => {
				return item[0].value
			})
			this.userList = this.userList.map(item => {
				return {
					item,
					status: false
				}
			})
			this.userList.forEach((item, index) => {
				if (index == this.userList.length-1) {
					item.status = true
					this.userInfo =  this.submitList[index]
				}
			})
			// console.log(this.userList)
		},
		methods: {
			checkForm(item,item_item){
				if (item.type == 'input') {
					this.submitList.splice(this.item_id,1,this.userInfo)
					// console.log(this.submitList)
				} else if (item.type == 'textarea') {
					this.submitList.splice(this.item_id,1,this.userInfo)
				} else if (item.type == 'radio') {
					item.optionsList.forEach(item2 => {
						item2.select = false
					})
					item_item.select = true
					this.submitList.splice(this.item_id,1,this.userInfo)
				} else if (item.type == 'checkbox') {
					item_item.select = !item_item.select
					this.submitList.splice(this.item_id,1,this.userInfo)
				}
			},
			submitForm() {
				// console.log(this.item_id)
				// console.log(this.submitList)
				for (var i =0;i<this.submitList.length;i++){
					// console.log('i',i)
					for(var j =0;j<this.submitList[i].length;j++){
						// console.log('j',j)
						if(this.submitList[i][j].type=='input' || this.submitList[i][j].type == 'textarea'){
							// console.log(item2)
							if(this.submitList[i][j].value == '' && this.submitList[i][j].must==true){
								uni.showToast({
									title:`请完善第${i+1}个人的${this.submitList[i][j].label}`,
									icon:"none"
								})
								return;
							}
							else if(this.submitList[i][j].value != ''){
								if(this.submitList[i][j].label == '手机号'){
									let myreg = /^1[3,4,5,7,8,9][0-9]{9}$/;
									// console.log(myreg.test(this.submitList[i][j].value))
									if (myreg.test(this.submitList[i][j].value) == false) {
										uni.showToast({
											title: `第${i+1}个人的手机号格式错误`,
											icon: 'none'
										})
										return;
									} else {
										this.submitList[i][j] .status =true
										// 本地以及接口调用，检查手机号是否重复
										//判断本地是否重复，是否需要进行接口判断手机号
										// let status = true
										// this.submitList.forEach(item3 => {
										// 	// console.log(item2)
										// 	item3.forEach((item4,index4)=>{
										// 		if(item4.value == this.submitList[i][j].value && j != index4){
										// 			uni.showToast({
										// 				title: `第${i+1}个人的手机号重复，请重新输入`,
										// 				icon: "none"
										// 			})
										// 			status = false
										// 			return;
										// 		}
										// 	})
										// })
										// if (status == true) {
										// 	// console.log(this.submitList[i][j])
										// 	console.log(i,j)
										// 	//返回后拿到的I,j值有误，固先赋值，在进去
										// 	let a = i
										// 	let b = j
										// 	this.$http.get('qms/conference_enrole_form/phone_valid', {
										// 		params: {
										// 			conferenceId: this.conferenceId,
										// 			phone: this.submitList[a][b].value
										// 		}
										// 	}).then(res => {
										// 		if (res.data.code == 1) {
										// 			uni.showToast({
										// 				title: `第${i+1}个人的手机号重复，请重新输入`,
										// 				icon: "none"
										// 			})
										// 			return;
										// 			// item.status = false
										// 		} else if(res.data.code == 0) {
										// 			console.log('手机号检测通过')
										// 			console.log(a,b)
										// 			this.submitList[a][b].status = true
										// 		}
										// 	})
										// }
									}
								}else if(this.submitList[i][j].label == '邮箱'){
									let str = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
									if (str.test(this.submitList[i][j].value) == false) {
										uni.showToast({
											title: `第${i+1}个人的邮箱格式错误`,
											icon: 'none'
										})
										// item.status = false
										return;
									} else {
										// console.log('邮箱检测通过')
										this.submitList[i][j].status =true
										// console.log(this.submitList[i][j])
									}
								}else{
									this.submitList[i][j].status =true
									// console.log(item2)
								}
							}
						}
						else if ((this.submitList[i][j].type=='radio' || this.submitList[i][j].type == 'checkbox') && this.submitList[i][j].must ==true){
							// console.log(item2)
							let status = this.submitList[i][j].optionsList.some(res=>{
								return res.select ==true
							})
							if(status){
								this.submitList[i][j].status =true
								// console.log(item2)
							}else{
								uni.showToast({
									title:`请完善第${i+1}个人的${this.submitList[i][j].label}`,
									icon:"none"
								})
								return;
							}
						}
					}
				}
				uni.setStorageSync('submitList',this.submitList)
				uni.redirectTo({
					url:`/pages/contacts/soWorkbench/soInfo/soActivity/soActivityDetails/chooseTicket/applyForm/confirmOrder/confirmOrder?conferenceId=${this.conferenceId}&orderNum=${this.orderNum}&ticketId=${this.ticketId}`
				})
				// console.log(this.submitList)
			},
			changeUser(item,index) {
				// console.log(index)
				this.item_id =index
				this.userList.forEach(item => {
					item.status = false
				})
				item.status = true
				this.userInfo =  this.submitList[index]
				// console.log(this.userInfo)
				// console.log(this.submitList)
			},
			addUser() {
				// console.log(this.orderNum)
				if(this.userList.length==this.orderNum){
					uni.showToast({
						title:`最多添加${this.orderNum}人信息`,
						icon:"none"
					})
				}else{
					uni.navigateTo({
						url: `/pages/contacts/soWorkbench/soInfo/soActivity/soActivityDetails/chooseTicket/applyForm/addUsers/addUsers?activityId=${this.conferenceId}`
					})
				}

			},
			deleteUser(index){
				this.userList.splice(index,1)
				let status = this.userList.some(item=>{
					return item.status ==true
				})
				if(status == false){
					this.userList[0].status =true
				}
				// console.log(this.userList)
				this.submitList.splice(index,1)
				// console.log(this.submitList)
				this.userInfo = this.submitList[0]
				uni.setStorageSync('submitList', this.submitList)
			}
		}
	}
</script>

<style lang="scss">
	.userInfoItem{
		border-bottom: 2rpx solid #EFF0F1;
		padding-top: 48rpx;
		padding-bottom: 26rpx;
	}
	.deleteImg{
		position: absolute;
		width: 28rpx;
		height: 28rpx;
		top: -14rpx;
		right: 0rpx;
	}
	.userList{
		font-size: 28rpx;
		line-height: 40rpx;
		border-bottom:2rpx solid #EFF0F1;
		padding-top: 40rpx;
		margin-bottom: 60rpx;
	}
	.active {
		padding: 14rpx 36rpx;
		border-radius: 20rpx;
		// color: #F74437;
		color: #FFFFFF;
		// background: rgba(247, 68, 55, 0.1);
		background: #46B28B;
		border: 2rpx solid #46B28B;
		margin-right: 28rpx;
		position: relative;
	}

	.unactive {
		padding: 14rpx 36rpx;
		border-radius: 20rpx;
		border: 2rpx solid #46B28B;
		background-color: #ECF7F3;
		margin-right: 28rpx;
		position: relative;
	}

	.container {
		height: 100%;

		.containerWrap {
			padding: 0 32rpx;

			.content {
				.info {
					padding: 44rpx 0 24rpx 0;

					.title {
						font-size: 28rpx;
						line-height: 40rpx;

						.txt {
							padding-left: 10rpx;
						}
					}

					textarea {
						width: 100%;
						font-size: 28rpx;
						line-height: 40rpx;
						margin-top: 36rpx;
					}
				}
			}
		}

		.btn {
			width: 100%;
			background-color: #FFFFFF;
			z-index: 666;
			position: fixed;
			bottom: 0rpx;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);

			.submitOrder {
				width: 686rpx;
				margin: 24rpx 32rpx
			}
		}
	}

	input {
		flex: 1;
		text-align: right;
		font-size: 28rpx;
		line-height: 40rpx;
	}

	.line {
		height: 0.3rpx;
		border-radius: 20rpx;
		background-color: #EFF0F1;
		width: 670rpx;
	}

	radio {
		transform: scale(0.7)
	}

	checkbox {
		transform: scale(0.7)
	}

	.bottom-safe {
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}
</style>
