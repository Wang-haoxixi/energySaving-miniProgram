<template>
	<view class="container">
		<view class="content">
			<view class="" v-for="(item,index) of userInfo" :key="index">
				<view class="flexRow" v-if="item.type == 'input'" :class="index<userInfo.length-1?'borderBottom':''" style="padding-top: 48rpx;padding-bottom: 26rpx;">
					<view class="color_303031" style="margin-right: 20rpx;">
						{{item.label}}<text style="margin-left: 10rpx;" v-if="item.must == true" class="color_F74437">*</text>
					</view>
					<input style="flex: 1;min-width: 0;" class="color_919397 singleEllipsis" v-model="item.value" disabled />
				</view>
				<view class="" v-if="item.type =='textarea'" :class="index<userInfo.length-1?'borderBottom':''" style="padding-top: 48rpx;padding-bottom: 26rpx;">
					<view class="color_303031" style="margin-right: 20rpx;margin-bottom: 28rpx;">
						{{item.label}}<text style="margin-left: 10rpx;" v-if="item.must == true" class="color_F74437">*</text>
					</view>
					<textarea class="color_919397" v-model="item.value"
					 style="width: 100%;" disabled></textarea>
				</view>
				<view class="" v-if="item.type == 'radio'" style="padding-top: 48rpx;">
					<view class="color_303031" style="margin-right: 20rpx;">
						{{item.label}}<text style="margin-left: 10rpx;" v-if="item.must == true" class="color_F74437">*</text>
					</view>
					<radio-group name="">
						<label class="flexRowStart" v-for="(item2,index2) of item.optionsList" :key="index2"
						 style="margin-top: 40rpx;">
							<radio :checked="item2.select" disabled/>
							<view class="color_666769">
								{{item2.label}}
							</view>
						</label>
					</radio-group>
				</view>
				<view class="" v-if="item.type == 'checkbox'" style="padding-top: 48rpx;">
					<view class="color_303031" style="margin-right: 20rpx;">
						{{item.label}}<text style="margin-left: 10rpx;" v-if="item.must == true" class="color_F74437">*</text>
					</view>
					<checkbox-group name="">
						<label class="flexRowStart" v-for="(item2,index2) of item.optionsList" :key="index2"
						 style="margin-top: 40rpx;">
							<checkbox :checked="item2.select" disabled/>
							<view class=" color_666769">
								{{item2.label}}
							</view>
						</label>
					</checkbox-group>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id:'',
				userInfo:''
			};
		},
		onLoad(options) {
			this.oss=this.$oss
			const{id}=options
			this.id= id
			this.$http.get('qms/conference_enrole_form/contacts_info',{
				params:{
					contactsId:id
				}
			}).then(res=>{
				this.userInfo=res.data.data.formItems
				// console.log(this.userInfo)
			})
		}
	}
</script>

<style lang="scss">
page{
	background-color: #F5f7f8;
}
.container{
	margin:32rpx 32rpx;
	background-color: #FFFFFF;
	border-radius: 20rpx;
}
.content{
	padding: 0rpx 32rpx;
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
.borderBottom{
		border-bottom: 2rpx solid #EFF0F1;
	}
</style>
