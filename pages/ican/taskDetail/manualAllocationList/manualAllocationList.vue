<template>
	<view>
		<view class="container">
			<view class="" id="title" style="padding-bottom: 10rpx;">
				<view class="flexRow" style="margin-bottom: 20rpx;">
					<view class="color_303031 bold" style="font-size: 32rpx;line-height: 44rpx;">
						协作人>
					</view>
					<view v-show="!allShow" class="color_F74437" style="font-size: 28rpx;line-height: 40rpx;" @tap="changeAllShow">
						批量分配
					</view>
					<view class="color_F74437" style="font-size: 28rpx;line-height: 40rpx;margin-right: -14rpx;" v-show="allShow">
						<checkbox-group name="">
							<view class="flexRow" style="justify-content: flex-end;">
								<label class="radio flexRowStart" @tap="selectDone" v-if="showStatus==false">
									<view style="margin-right: 10rpx;">已完成</view>
									<checkbox value="" :checked="doneSelectStatus" />
								</label>
								<label class="radio flexRowStart" @tap="selectNotDone" style="margin-left: 20rpx;" v-if="showStatus==false">
									<view style="margin-right: 10rpx;">未完成</view>
									<checkbox value="" :checked="notDoneSelectStatus" />
								</label>
								<label class="radio flexRowStart" @tap="changeAllShowStatus" style="margin-left: 20rpx;">
									<view style="margin-right: 10rpx;">全选</view>
									<checkbox value="" :checked="allSelectStatus" />
								</label>
							</view>
						</checkbox-group>
					</view>
				</view>
				<view class="flexRow" style="font-size: 24rpx;line-height: 34rpx;">
					<view class="color_919397">
						账户可用{{$isEmpty(balanceValue)?'':balanceValue}}贝
					</view>
					<view class="color_F74437" v-show="payAmount>0 &&payAmount<1000">
						已分配{{$isEmpty(payAmount)?'':payAmount}}贝
					</view>
					<view class="color_F74437" v-show="payAmount>0 && payAmount>1000">
						已分配{{$isEmpty(payAmount)?'':`${payAmount/10000}w`}}贝
					</view>
				</view>
			</view>
			<scroll-view :style="{height:scrollHeight + 'px'}" :scroll-top="30" scroll-y="true">
				<view class="list" v-for="(item, index) of showlist" :key="index">
					<checkbox-group name="">
						<label class="flexRowStart" @tap="select(item)">
							<checkbox v-show="allShow" :checked="item.status" :disabled="!allShow" style="margin-right: 30rpx;" />
							<view class="flexRow" style="flex: 1;">
								<view class="flexRowStart">
									<image lazy-load="true" class="avatarImg"  mode="aspectFill" :src="imageError(item.avatar,$oss)"></image>
									<view class="flexColumnStart info">
										<view class="flexRowStart" style="margin-bottom: 16rpx;">
											<view class="name color_303031 bold">{{ $isEmpty(item.userRealName)?'':item.userRealName }}</view>
										</view>
										<view class="company color_919397" v-if="item.state == 2">
											已完成
										</view>
										<view class="company color_919397" v-if="item.state == 1">
											未完成
										</view>
									</view>
								</view>
								<view v-show="item.status==false && allShow==false" class="color_F74437 bold allocationItemBtn" @tap.stop="showAllocation(item)">
									去分配
								</view>
								<view v-show="item.status==true && allShow==false" class="color_303031 flexRowStart allocationedItem" @tap.stop="showAllocation(item)">
									<view class="">
										{{$isEmpty(item.money)?'':item.money}}贝
									</view>
									<image v-if="oss" :src="oss+'icon_right_gray.png'" mode="" style="width: 44rpx;height: 44rpx;"></image>
								</view>
							</view>
						</label>
					</checkbox-group>
				</view>
				<image class="emptyImg" v-if="!showlist.length > 0 && oss" :src="oss+'pic_energy_default_wuxinxi.png'" mode="aspectFit"></image>
				<view class="bottom-safe" style="height: 112rpx;"></view>
			</scroll-view>
		</view>
		<view class="btn" id="btn">
			<view class="flexRow" style="margin: 20rpx 40rpx" v-if="submitList.length>0  && allShow==false">
				<view class="button resetBtn" @tap="resetAll">
					清空
				</view>
				<view class="button confirmBtn" @tap="submitAllocation">
					确定
				</view>
			</view>
			<view class="flexRow" style="margin: 20rpx 40rpx" v-if="allShow==true">
				<view class="button resetBtn" @tap='cancelAll'>
					取消
				</view>
				<view class="button confirmBtn" v-if="submitList.length>0" @tap="allocation">
					去分配
				</view>
				<view class="button notConfirmBtn" v-else-if="!submitList.length>0">
					去分配
				</view>
			</view>
			<view class="button notSend" v-else-if="!submitList.length>0">
				确定
			</view>
		</view>
		<uni-popup ref="allocationDialog" type="bottom">
			<view class="popDialog flexColumn">
				<view class="color_303031 bold allocationTitle">
					设置分配金额
				</view>
				<view class="flexRow allocationItem">
					<view class="" v-for="(item,index) of allocationList" :key="index" @tap="changeAmount(item)">
						<view :class="item.status?'allocationActive':'allocationUnactive'">
							{{$isEmpty(item.amount)?'':item.amount}}贝
						</view>
					</view>
				</view>
				<view :class="importStatus?'importBorder':'notImportBorder'" class="flexRow color_303031 wrapCustom">
					<view class="" style="margin-left:30rpx ;">
						自定义金额
					</view>
					<view class="flexRowStart">
						<input type="number" v-model="importAmount" style="text-align:right;color: #303031;" :placeholder="'当前可用'+balanceValue+'贝'"
						 placeholder-style="color:#BABEC0;" @focus="chooseAllocation" @input="importAllocation" />
						<view class="" style="margin-right:30rpx ;margin-left: 10rpx;">
							贝
						</view>
					</view>
				</view>
				<view class="button" style="width: 100%;" @tap="confirmAllocation">
					确认
				</view>
			</view>
		</uni-popup>
		<jpPwd ref="jpPwds" @completed="completed" @forget="forget"></jpPwd>
		<uni-popup ref="dialog" type="center">
			<view class="popDialogPsw">
				<view class="">
					<view class="color_303031 bold title">
						提示
					</view>
					<view class="color_666769 message">
						您未设置支付密码
					</view>
				</view>
				<view class="flexRow">
					<view class="button noRepeat" @tap="cancel">
						取消
					</view>
					<view class="button repeatNow" @tap="pass">
						确定
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import jpPwd from '@/components/jp-pwd/jp-pwd.vue';
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import {
		getCompanyStation,
		imageError
	} from '@/common/utils.js';
	export default {
		components: {
			uniPopup,
			jpPwd
		},
		data() {
			return {
				oss: '',
				userId: '',
				taskId: '',
				allList: [],
				showlist: [],
				scrollHeight: '',
				//选中的单个元素
				allocationItem: '',
				//默认设置的奖励值
				allocationAmount: 1,
				importStatus: false,
				//自定义输入的奖励值
				importAmount: '',
				allShow: false,
				allSelectStatus: '',
				doneSelectStatus: '',
				notDoneSelectStatus: '',
				balanceValue: 0,
				//判断只显示全选按钮还是都显示
				showStatus: false,
				password:'',
				allocationList: [{
					amount: 1,
					status: true
				}, {
					amount: 3,
					status: false
				}, {
					amount: 5,
					status: false
				}, {
					amount: 10,
					status: false
				}, {
					amount: 20,
					status: false
				}]
			};
		},
		onLoad(options) {
			this.oss = this.$oss
			this.userId = uni.getStorageSync('userinfo').user_id
			const {
				taskId
			} = options
			this.taskId = taskId
			this.$http.get('qms/cooperation_task/task_user', {
				params: {
					taskId: this.taskId
				}
			}).then(res => {
				console.log(res)
				this.allList = res.data.data.filter(item => {
					return item.userId != this.userId
				})
				this.showlist = this.allList.map(item => {
					return {
						...item,
						status: false,
						money: 0,
						moneyType: "canMoney"
					}
				})
				let notDoneStatus = this.showlist.every(item => {
					return item.state == 1
				})
				let doneStatus = this.showlist.every(item => {
					return item.state == 2
				})
				this.showStatus = notDoneStatus || doneStatus
			})
			this.$http.get('fms/account/balance').then(res => {
				console.log(res)
				this.balanceValue = res.data.data
			})
			uni.createSelectorQuery()
				.in(this)
				.select('#title')
				.boundingClientRect()
				.select('#btn')
				.boundingClientRect()
				.exec(ret => {
					// console.log(ret)
					let height = uni.getSystemInfoSync().windowHeight;
					// console.log(height)
					// console.log(height)
					// this.swiperHeight = height - ret[1].height - ret[0].height
					this.scrollHeight = height - ret[1].height - ret[0].height
				});
		},
		onShow() {
			this.password = uni.getStorageSync('user').safePassword
		},
		computed: {
			payAmount() {
				let doneAmount = 0
				this.showlist.forEach(item => {
					doneAmount += parseInt(item.money)
				})
				return doneAmount
			},
			submitList() {
				let submitList = []
				// let submitNotDoneList = []
				submitList = this.showlist.filter(item => {
					return item.status == true
				})
				return submitList
			}
		},
		methods: {
			imageError,
			cancel(){
				this.$refs.dialog.close()
			},
			pass(){
				uni.navigateTo({
					url:'/pages/my/payPassword/payPassword'
				})
				this.$refs.dialog.close()
			},
			selectDone() {
				this.doneSelectStatus = !this.doneSelectStatus
				if (this.doneSelectStatus == true) {
					if(this.notDoneSelectStatus ==true){
						this.allSelectStatus=true
					}
					this.showlist.forEach(item => {
						if (item.state == 2) {
							item.status = true
						}
					})
				} else if (this.doneSelectStatus == false) {
					this.allSelectStatus=false
					this.showlist.forEach(item => {
						if (item.state == 2) {
							item.status = false
						}
					})
				}
			},
			selectNotDone() {
				this.notDoneSelectStatus = !this.notDoneSelectStatus
				if (this.notDoneSelectStatus == true) {
					if(this.doneSelectStatus ==true){
						this.allSelectStatus=true
					}
					this.showlist.forEach(item => {
						if (item.state == 1) {
							item.status = true
						}
					})
				} else if (this.notDoneSelectStatus == false) {
					this.allSelectStatus=false
					this.showlist.forEach(item => {
						if (item.state == 1) {
							item.status = false
						}
					})
				}
			},
			Encrypt(word, key, iv) {
				var CryptoJS = require('../../../../common/crypto.js');
				// console.log(CryptoJS)
				let srcs = CryptoJS.enc.Utf8.parse(word);
				let encrypted = CryptoJS.AES.encrypt(srcs, key, {
					iv: iv,
					mode: CryptoJS.mode.CBC,
					padding: CryptoJS.pad.Pkcs7
				});
				return encrypted.toString()
			},
			completed(e) {
				// this.$refs.jpPwds.toCancel()
				//分享收费拿不到，所以二次获取
				this.password = uni.getStorageSync('user').safePassword
				// console.log(this.password)
				var CryptoJS = require('../../../../common/crypto.js');
				if (this.$isEmpty(this.password)) {

				} else {
					let key = 'gdscloudprisbest';
					key = CryptoJS.enc.Latin1.parse(key);
					const iv = key
					this.password = (this.Encrypt(e, key, iv))
					// console.log(this.password)
					this.$http.post('qms/cooperation_task/free_distribution', {
						taskId: this.taskId,
						safePassword: this.password,
						items: this.submitList
					}).then(res => {
						console.log(res)
						if (res.data.code == 1) {
							this.$refs.jpPwds.backs()
							this.$refs.jpPwds.toCancel()
							uni.showToast({
								title: res.data.message,
								icon: "none"
							})
						} else {
							let that =this
							uni.showToast({
								title: '分配成功',
								icon: "none",
								duration: 1000,
								success() {
									setTimeout(() => {
										that.$refs.jpPwds.toCancel()
										// uni.redirectTo({
										// 	url: `/pages/ican/taskDetail/taskDetail?taskId=${that.taskId}`
										// })
										uni.navigateBack({
											delta:1
										})
									}, 1000)
								}
							})
						}
					})
				}
			},
			forget() {
				// console.log('忘记密码')
				uni.navigateTo({
					url: "/pages/my/payPassword/payPassword"
				})
			},
			stopTouchMove() {
				return false
			},
			select(item) {
				// item.status =!item.status
				//在选择状态时，才可以选中，不选中
				if (this.allShow == true) {
					item.status = !item.status
				}
				this.allSelectStatus = this.showlist.every(item2 => {
					return item2.status == true
				})
				if(this.showStatus ==false){
					let doneList = this.showlist.filter(item2=>{
						return item2.state == 2
					})
					let notDoneList = this.showlist.filter(item2=>{
						return item2.state == 1
					})
					this.doneSelectStatus = doneList.every(item2 => {
						return item2.status == true
					})
					this.notDoneSelectStatus = notDoneList.every(item2 => {
						return item2.status == true
					})
				}
			},
			changeAllShowStatus() {
				this.allSelectStatus = !this.allSelectStatus
				if (this.allSelectStatus == true) {
					this.notDoneSelectStatus =true
					this.doneSelectStatus=true
					this.showlist.forEach(item => {
						item.status = true
					})
				} else if (this.allSelectStatus == false) {
					this.notDoneSelectStatus =false
					this.doneSelectStatus=false
					this.showlist.forEach(item => {
						item.status = false
					})
				}
			},
			changeAllShow() {
				this.allShow = true
				//如果先把每个都分配了，在点击批量分配，全选框不会选中，固加此逻辑
				if (!this.showlist.length > 0) {
					this.allSelectStatus = false
					this.notDoneSelectStatus = false
					this.doneSelectStatus = false
				} else {
					this.allSelectStatus = this.showlist.every(item => {
						return item.status == true
					})
					this.doneSelectStatus = this.showlist.every(item => {
						if (item.state == 2) {
							return item.status == true
						}
					})
					this.notDoneSelectStatus = this.showlist.every(item => {
						if (item.state == 1) {
							return item.status == true
						}
					})
				}
			},
			confirmAllocation() {
				if (this.importStatus == true && this.importAmount == '') {
					uni.showToast({
						title: '分配金额不能为空',
						icon: 'none'
					})
				} else {
					if (this.allShow == true) {
						this.showlist.forEach(item => {
							if (item.money != '') {
								item.status = true
							}
							if (item.status == true) {
								item.money = this.allocationAmount
							}
						})
					} else {
						this.showlist.forEach(item => {
							if (item.id == this.allocationItem.id) {
								item.status = true
								item.money = this.allocationAmount
							}
						})
					}
					this.$refs.allocationDialog.close()
					this.allShow = false
				}
				// console.log(this.notDoneList)
			},
			chooseAllocation() {
				this.allocationAmount = 1
				this.allocationList.forEach(item => {
					item.status = false
				})
				this.importStatus = true
			},
			importAllocation() {
				this.allocationAmount = this.importAmount
			},
			changeAmount(item) {
				this.allocationAmount = 1
				this.importAmount = ''
				this.allocationList.forEach(item => {
					item.status = false
				})
				item.status = true
				this.importStatus = false
				this.allocationAmount = item.amount
			},
			showAllocation(item) {
				this.allocationItem = item
				this.allocationAmount = 1
				this.importAmount = ''
				if (item.status == true) {
					this.allocationList.forEach(item2 => {
						item2.status = false
					})
					this.allocationAmount = item.money
					if (this.allocationAmount == 1 || this.allocationAmount == 3 || this.allocationAmount == 5 || this.allocationAmount ==
						10 || this.allocationAmount == 20) {
						this.allocationList.forEach(item2 => {
							if (item2.amount == this.allocationAmount) {
								item2.status = true
							}
						})
					} else {
						this.importStatus = true
						this.allocationList.forEach(item2 => {
							item2.status = false
						})
						this.importAmount = this.allocationAmount
					}
				} else {
					// console.log(6)
					this.allocationAmount = 1
					this.importAmount = ''
					this.importStatus = false
					this.allocationList.forEach(item2 => {
						item2.status = false
						if (item2.amount == 1) {
							item2.status = true
						}
					})
					// console.log(this.notDoneList)
				}
				this.$refs.allocationDialog.open()
			},
			getCompanyStation,
			allocation() {
				if (this.allShow == true) {
					this.$refs.allocationDialog.open()
				}
			},
			submitAllocation() {
				if(this.$isEmpty(this.password)){
					this.$refs.dialog.open()
				}
				else{
					this.$refs.jpPwds.toOpen()
				}
			},
			resetAll() {
				this.showlist = this.allList.map(item => {
					return {
						...item,
						status: false,
						money: 0,
						moneyType: "canMoney"
					}
				})
				this.allocationAmount = 1
				this.importStatus = false
				this.importAmount = ''
				this.allSelectStatus = false
			},
			cancelAll() {
				this.showlist.forEach(item => {
					if (item.money == 0) {
						item.status = false
					} else {
						item.status = true
					}
				})
				this.allShow = false
			}
		}
	}
</script>

<style lang="scss">
	.avatarImg{
		width: 112rpx;
		height: 112rpx;
		border-radius: 50%;
		margin-right: 24rpx;
	}
	.popDialogPsw {
		padding: 32rpx 32rpx 48rpx;
		width: 590rpx;
		background-color: #FFFFFF;
		// box-shadow: 0px -2rpx 4rpx 0px rgba(0, 0, 0, 0.03);
		.title {
			font-size: 36rpx;
			line-height: 52rpx;
			text-align: center;
			margin-top: 32rpx;
		}
		.message{
			font-size: 28rpx;
			line-height: 52rpx;
			text-align: center;
			margin: 48rpx 0 ;
		}
	
		.noRepeat {
			flex: 1;
			background: #F5f7f8;
			color: #565B5F;
			margin-right: 30rpx;
		}
	
		.repeatNow {
			flex: 1;
		}
	}
	.wrapCustom {
		padding: 34rpx 0rpx;
		font-size: 28rpx;
		line-height: 40rpx;
		width: 100%;
		border-radius: 20rpx;
		margin-bottom: 48rpx;
	}

	.allocationItem {
		margin: 48rpx;
		font-size: 24rpx;
		width: 100%;
	}

	.allocationTitle {
		margin-top: 32rpx;
		font-size: 36rpx;
		line-height: 52rpx;
	}

	.confirmBtn {
		width: 408rpx;
		margin-left: 30rpx;
	}

	.notConfirmBtn {
		width: 408rpx;
		margin-left: 30rpx;
		color: #FFFFFF;
		background-color: #919397;
	}

	.resetBtn {
		flex: 1;
		background: #FFFFFF;
		color: #F73737;
		border: 2rpx solid #F73737;
	}

	.allocationedItem {
		font-size: 28rpx;
		line-height: 40rpx;
		margin-right: -12rpx;
	}

	.allocationItemBtn {
		font-size: 24rpx;
		line-height: 34rpx;
		padding: 8rpx 16rpx;
		background: rgba(247, 68, 55, .1);
		border-radius: 26rpx;
	}

	.info {
		flex: 1;
		height: 112rpx;
		// justify-content: space-between;
	}

	.list {
		padding: 32rpx 0rpx;
		border-bottom: 2rpx solid #EFF0F1;
	}


	.active {
		padding: 8rpx 20rpx;
		background: rgba(247, 68, 55, .1);
		border-radius: 26rpx;
		color: #F74437;
	}

	.unactive {
		padding: 8rpx 20rpx;
		border-radius: 26rpx;
		background-color: #F4F5F6;
		color: #919397;
	}

	.allocationActive {
		width: 110rpx;
		height: 54rpx;
		line-height: 54rpx;
		background: rgba(247, 68, 55, .1);
		color: #F74437;
		border-radius: 10rpx;
		text-align: center;
	}

	.allocationUnactive {
		width: 110rpx;
		height: 54rpx;
		line-height: 54rpx;
		background-color: #F4F5F6;
		color: #919397;
		border-radius: 10rpx;
		text-align: center;
	}

	.popDialog {
		padding: 32rpx;
		background-color: #FFFFFF;
	}

	.admingMark {
		font-size: 20rpx;
		background-color: rgba(247, 68, 55, 0.1);
		border-radius: 4rpx;
		padding: 4rpx 10rpx;
	}

	.managerMark {
		font-size: 20rpx;
		background-color: rgba(47, 128, 255, 0.1);
		border-radius: 4rpx;
		padding: 4rpx 10rpx;
	}

	.name {
		font-size: 28rpx;
		line-height: 40rpx;
	}

	.company {
		font-size: 24rpx;
		line-height: 34rpx;
	}

	.container {
		padding: 32rpx;
	}

	.btn {
		position: fixed;
		bottom: 0rpx;
		background-color: #FFFFFF;
		width: 100%;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

		.send {
			width: 686rpx;
			margin: 24rpx 32rpx
		}

		.notSend {
			width: 686rpx;
			margin: 24rpx 32rpx;
			color: #FFFFFF;
			background-color: #919397;
		}
	}

	.notImportBorder {
		border: 2rpx solid #F4F5F6
	}

	.importBorder {
		border: 2rpx solid #F74437
	}

	.bottom-safe {
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}

	checkbox {
		transform: scale(0.7)
	}
</style>
