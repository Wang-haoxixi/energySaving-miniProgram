<template>
	<view @tap="hide">
		<view :style="{ height: systemInfo.statusBarHeight + 'px' }"></view>
		<view class="title" id =title
			:style="{height:menuButton.height +(menuButton.bottom -systemInfo.statusBarHeight -menuButton.height) *2 +'px',width:systemInfo.safeArea.width -(systemInfo.safeArea.width - menuButton.left) +'px',padding:'0 0 ' +(menuButton.bottom -systemInfo.statusBarHeight -menuButton.height +'px'),lineHeight: menuButton.height + 'px',}">
			<image :src="$ossUrl('black_back.png')" mode="" style="width: 56rpx;height: 56rpx;margin-right: 24rpx;margin-left: 16rpx;" @tap="back"></image>
			<view class="search" @tap="goSearch">
				<image class="search-icon" :src="$ossUrl('icon_search_gray.png')"></image>
				<input class="search-input" placeholder="搜索你需要的商品热⻔关键词" disabled v-model="tag"/>
			</view>
		</view>
		<view class="" style="position: relative;">
			<view class="" id="top" style="padding-top: 14rpx;">
				<view class="top">
					<view class="flexRowStart" @tap.stop="changeIsPullDown" style="margin-right: 80rpx;flex: 1;display: flex;align-items: center;justify-content: flex-end;">
						<view class="top-text">{{$isEmpty(orderFieldName)?'':orderFieldName}}</view>
						<image v-if="oss" class="icon" :src="oss+'icon_ican_pulldown.png'"></image>
					</view>
					<view class="flexRowStart" @tap.stop="changeIsTypePullDown" style="flex: 1;">
						<view class="top-text">{{$isEmpty(orderTypeName)?'全部':orderTypeName}}</view>
						<image v-if="oss" class="icon" :src="oss+'icon_ican_pulldown.png'"></image>
					</view>
				</view>
			</view>
			<view class="showList" v-show="isPullDown">
				<view class="flexColumn showListWrap">
					<view class="color_666769 show" @click="changeOrderField('create_time')">最新发布</view>
					<view class="color_666769 show" @click="changeOrderField('score')">最高评分</view>
					<view class="color_666769 show" @click="changeOrderField('pricedesc')">能贝价格降序</view>
					<view class="color_666769 show" @click="changeOrderField('priceasc')">能贝价格升序</view>
					<view class="color_666769 show" @click="changeOrderField('cashdesc')">人民币价格降序</view>
					<view class="color_666769 show" @click="changeOrderField('cashasc')">人民币价格升序</view>
				</view>
			</view>
			<view class="showTypeList" v-show="isTypePullDown">
				<view class="" style="height: 30rpx;"></view>
				<view class="" style="overflow-y: auto;height: 666rpx;">
					<view class="flexColumn showListWrap">
						<view class="color_666769 show" @tap="changeOrderAllType" style="padding-top: 0rpx;">
							全部
						</view>
						<view v-for="(item,index) of typeTree" :key="index" class="color_666769 show" @click="changeOrderType(item)">{{item.name}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="flexColumn">
			<scroll-view :style="{height:scrollHeight + 'px'}" :scroll-top="30" scroll-y @scrolltolower="more" style="background-color: #f5f7f8;">
				<view class="" style="padding: 16rpx 24rpx;">
					<view class="scroll-item" v-for="(item,index) of data.records" :key="index" @tap="gomagicBox(item.id)">
						<image lazy-load="true" class="avatar" :src="soImageError(item.imageUrl,$oss)"></image>
						<view class="item-content">
							<view class="item-content-start">
								<view class="flexRow" style="width: 100%;">
									<view class="item-content-name singleEllipsis bold">{{$isEmpty(item.name)?'':item.name}}</view>
									<view class="official" v-if="item.isOfficial==1">
										<image v-if="oss" class="icon" :src="oss+'icon_official_mini.png'"></image>官方认证
									</view>
								</view>
								<view class="item-content-tag flexRowStart" style="width: 100%;">
									<view class="item-content-tag-item singleEllipsis color_919397" v-for="(item2,index2) of item.tagKeywords" :key="index2" v-if="index2<3"> {{$isEmpty(item2)?'':item2}}</view>
								</view>
								<view class="item-content-score color_F74437 flexRow" style="width: 100%; margin-top: 16rpx;font-size: 24rpx;line-height: 34rpx;">
									<view class="" v-if="item.isFree==1" style="font-weight: 600;">
										免费
									</view>
									<view v-else class="" style="font-weight: 600;">
										{{getMoney(item)}}
									</view>
									<view class="flexRowStart">
										<!-- <image :src="$ossUrl('home_star.png')" mode="" style="width: 26rpx;height: 26rpx;margin-right: 10rpx;"></image> -->
										<view class="" style="margin-top: 10rpx;">
											<uni-rate margin="2" size="28" disabled="true" :value="item.score"></uni-rate>
										</view>
										<view class="bold" v-if="item.score>0" style="font-size: 24rpx;line-height: 40rpx;color: #9AA1A7;font-weight: normal;margin-left: 16rpx;">
											{{item.score.toFixed(1)}}
										</view>
										<view class="bold" v-else style="font-size: 24rpx;line-height: 40rpx;color: #9AA1A7;font-weight: normal;margin-left: 16rpx;">
											暂无评分
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<image class="emptyImg" v-if="!data.records.length>0 && oss" :src="oss+'pic_energy_default_wuxinxi.png'" mode="aspectFit"></image>
				<uni-load-more :status="status" v-if="data.records.length>0"></uni-load-more>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import {
		gomagicBox,
		soImageError
	} from '@/common/utils.js'
	export default {
		data() {
			return {
				systemInfo: '',
				menuButton: '',
				isPullDown: false,
				isTypePullDown:false,
				scrollHeight: 0,
				status: 'more',
				type: '',
				tag: '',
				orderFieldName: '最新发布',
				orderTypeName: '',
				orderField: 'create_time',
				orderType: 'desc',
				data: '',
				oss: '',
				typeTree:''
			};
		},
		methods: {
			soImageError,
			goSearch(){
				uni.navigateTo({
					url:'/pages/find/magicBox/search/search'
				})
			},
			back(){
				let pages = getCurrentPages()
				if(!(pages.length>1)){
					uni.switchTab({
						url:'/pages/tabbar/ican'
					})
				}else{
					uni.navigateBack({
						delta:1
					})
				}
			},
			getMoney(ticket) {
				if (ticket.price != 0 && ticket.cash==0) {
					return `${ticket.price}贝`;
				} else if (ticket.cash!=0&& ticket.price == 0) {
					return `${ticket.cash}元`;
				} else if (ticket.cash != 0 && ticket.price != 0) {
					return `${ticket.price}贝/${ticket.cash}元`;
				}else{
					return `0`;
				}
			},
			more() {
				if (this.data.current < this.data.pages) {
					this.status = 'loading';
					this.$http.get('dms/app/product/shop_page', {
						params: {
							type: this.type,
							tag: this.tag,
							current: this.data.current + 1,
							orderField: this.orderField,
							orderType: this.orderType,
							size: 20
						}
					}).then(res => {
						this.data.current = res.data.data.current;
						this.data.records = this.data.records.concat(res.data.data.records);
						this.status = 'more';
					});
				} else {
					this.status = 'noMore';
				}
			},
			changeOrderField(item) {
				if (item == 'create_time') {
					this.orderField = 'create_time'
					this.orderFieldName = '最新发布';
					this.orderType='desc'
				} else if (item == 'score') {
					this.orderField = 'score'
					this.orderFieldName = '最高评分';
					this.orderType='desc'
				} else if (item == 'pricedesc') {
					this.orderField = 'price'
					this.orderFieldName = '能贝价格降序';
					this.orderType='desc'
				} else if (item == 'priceasc') {
					this.orderField = 'price'
					this.orderFieldName = '能贝价格升序';
					this.orderType='asc'
				} else if (item == 'cashdesc') {
					this.orderField = 'cash'
					this.orderFieldName = '人民币价格降序';
					this.orderType='desc'
				} else if (item == 'cashasc') {
					this.orderField = 'cash'
					this.orderFieldName = '人民币价格升序';
					this.orderType='asc'
				}
				this.$http.get('dms/app/product/shop_page', {
					params: {
						type: this.type,
						tag: this.tag,
						current: 1,
						orderField: this.orderField,
						orderType: this.orderType,
						size: 20
					}
				}).then(res => {
					this.data = res.data.data;
					if (this.data.current == this.data.pages) {
						this.status = 'noMore';
					}
				});
			},
			changeOrderType(item){
				this.orderTypeName = item.name
				this.type =item.productType
				this.$http.get('dms/app/product/shop_page', {
					params: {
						type: this.type,
						tag: this.tag,
						current: 1,
						orderField: this.orderField,
						orderType: this.orderType,
						size: 20
					}
				}).then(res => {
					this.data = res.data.data;
					if (this.data.current == this.data.pages) {
						this.status = 'noMore';
					}
				});
			},
			changeOrderAllType(){
				this.orderTypeName = '全部'
				this.type =null
				this.$http.get('dms/app/product/shop_page', {
					params: {
						type: this.type,
						tag: this.tag,
						current: 1,
						orderField: this.orderField,
						orderType: this.orderType,
						size: 20
					}
				}).then(res => {
					this.data = res.data.data;
					if (this.data.current == this.data.pages) {
						this.status = 'noMore';
					}
				});
			},
			hide() {
				this.isPullDown = false
				this.isTypePullDown=false
			},
			changeIsPullDown() {
				this.isTypePullDown=false
				this.isPullDown = !this.isPullDown
			},
			changeIsTypePullDown(){
				this.isPullDown=false
				this.isTypePullDown = !this.isTypePullDown
			},
			gomagicBox,
		},
		onLoad(option) {
			this.oss = this.$oss
			this.menuButton = uni.getMenuButtonBoundingClientRect();
			this.systemInfo = uni.getSystemInfoSync();
			// if (option.type == 2 || option.type==7) {
			// 	this.tag = option.typeDesc;
			// }
			//  else {
			// 	this.type = option.id;
			// }
			this.tag = option.tag
			this.orderTypeName=option.orderTypeName
			// console.log(this.orderTypeName)
			this.type =option.type
			uni.createSelectorQuery()
				.in(this)
				.select('#top')
				.boundingClientRect()
				.select('#title')
				.boundingClientRect()
				.exec(ret => {
					let height = uni.getSystemInfoSync().windowHeight;
					height = height - ret[0].height- ret[1].height-140 / 750 * wx.getSystemInfoSync().windowWidth;
					this.scrollHeight = height;
				});
			this.$http.get('dms/product/type/tree').then(res => {
				let typeTree = res.data.data
				this.typeTree=typeTree
				// if(!this.orderTypeName){
				// 	this.orderTypeName = this.typeTree[0].name
				// }
				// if(!this.type){
				// 	this.type = this.typeTree[0].productType
				// }
				this.$http.get('dms/app/product/shop_page', {
					params: {
						type: this.type,
						tag: this.tag,
						current: 1,
						orderField: this.orderField,
						orderType: this.orderType,
						size: 20
					}
				}).then(res => {
					this.data = res.data.data;
					if (!(this.data.current < this.data.pages)) {
						this.status = 'noMore';
					}
				});
			});
		}
	}
</script>

<style lang="scss" scoped>
	.title{
		display: flex;
		align-items: center;
		.search {
			display: flex;
			flex: 1;
			height: 100%;
			background: #f3f7f9;
			padding: 0 32rpx;
			margin-right:32rpx;
			border-radius: 60rpx;
			align-items: center;
		
			.search-icon {
				width: 32rpx;
				height: 32rpx;
			}
		
			.search-input {
				width: 100%;
				height: 40rpx;
				min-height: 40rpx;
				padding-left: 10rpx;
				font-size: 28rpx;
				line-height: 40rpx;
			}
		}
	}
	.top {
		padding: 16rpx 0px;
		display: flex;
		justify-content: center;
		align-items: center;

		.top-text {
			color: #666769;
			font-size: 24rpx;
			line-height: 34rpx;
		}

		.icon {
			margin-left: 2rpx;
			height: 34rpx;
			width: 34rpx;
		}
	}
	
	.showList {
		background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKoAAAD6CAYAAAAx+Nx1AAAIu0lEQVR4Xu3Zz28UdRzG8e9nZrbt/molMTHuDy6YGK6GeAX+AjBGLpyNevAmhD/BCDcP6B0uJAT4C8CD8cJRoyQ2MdmZqTfs/ui23Zn5mmmkgYJC7UL2ybx74tCdeeZ5XszuTs3xM/cGBoNB19Xrrv/228ncD17RA1pFr/u1XPbGxsbpWV5cD8xOlifwzv1iPvy013vnp9dywgodFKhzGvuPJPkgcvZjo9FYWVpa2jvqbHfXTba2pkWefXj8+PGf53SqSh4GqHOafRCn9xuN+pnl5eVnjrizs+O2tqYP+r3O2TmdqpKHAeocZh8MBmeCMLq/urrqzJ6t1HvvhsOhK/LsbL/ffzCH01XyEECdw+z/djd9cmjuqkcvGahH7PC/7qZPDs1d9YglO+eAesQOB3H6oNGonz742fTgYf+5q/7Q73XOHPGUlXw5UI8we5ymnwUWfNdut5/7bHrwsOVddTQaucIXn/c6ne+PcNpKvhSoh5zdex+mafpe4f0XYRh92Ww2gzAMX+koeZ67yWRS5Hn2bWB2vdPp/G5m+Su9uOK/9EKo3vtakiTnzYJz3vtTzqzjvW9XvKv9yw+CwNVqNbeysuLKfx/mpygKt7297WazmSv/XfUfMxs571Mze+h9ca/b7d41s9nBXp6DOkjTj1zhrkZReKJ8cB1F0d4YBx+7VL1grn8+DZQficr/sFmWud3dXZdl+boL3KV+p3Pn6TPsQ/XeB3Gcfh1G4Vf1esNqtWg+STgKDRyigdksc9Ppls+z/Fqv17liZntvO/tQB4Pkm6gWXWo2m4d+OztEDn6VBl7aQHmHnUwmLptlV/v97uV9qOXbfWjB7VarZYf9zPXSs/ILNPA/Giixjsdjn/vi4/JjgJVfnOJk49dWq3WCt/v/0SgveW0NlB8DxuPxeq/77kmL441Pwii4VT4L5IcGFq2B8tlzns0uWJKkN1bq9Ysv+8vKol0AearRQPkXve3p9KbFcfJbe3X1/Vd9aF2NerjKRWmg/CPJaDh8ZHGSDtfW1to8J12UacjxdAPlc9bNzc2RDeLEHzt2jHZoYGEbePz4sQPqws5DsCcNABULEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQu5BjZNkuLb2VtvMaIQGFq4B773b3PxrZHGc/NZeXX0/DMOFC0kgGsjz3I2Gw0eWJOmNlXr94vLyMq3QwMI1sLOz47an05sWx/EnYVS71W63Fy4kgWhgNBq5PJtdMO99LU42fm21WidqtYhmaGBhGpjNMjcej9d73XdP7n2DGqTpR6EFt1utlgVBsDBBCVLdBoqiKJH63Bcf9zudO/tf9QeD5JuoFl1qNpsOrNUFsghXXiKdTCYum2VX+/3u5TLTPlTvfRDH6ddhFH5VrzeMjwGLMFn1MpRv99Ppls+z/Fqv17liZsUzUJ9UUn4McIW7GkXhiaWlJRdF0d4dlues1UPzJq64fE5a3kGzLHO7u7suy/J1F7hL5dv90+d/4VP+8gtWkvx53syf896fcmYd7z2PBd7EchU7h5mNnPepmT30vrjX7XbvmtnsYA1/A9cOclFW4Q9tAAAAAElFTkSuQmCC');
		position: absolute;
		top: 68rpx;
		left: 121rpx;
		z-index: 10;
		width: 270rpx;
		height: 465rpx;
		background-size: 100% 100%;
		background-repeat: no-repeat;

		.showListWrap {
			padding: 18rpx;

			.show {
				text-align: center;
				width: 100%;
				font-size: 24rpx;
				padding: 20rpx 0;
				border-bottom: 2rpx solid #E3E4E5;
			}
		}
	}
	.showTypeList {
		background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKoAAAD6CAYAAAAx+Nx1AAAIu0lEQVR4Xu3Zz28UdRzG8e9nZrbt/molMTHuDy6YGK6GeAX+AjBGLpyNevAmhD/BCDcP6B0uJAT4C8CD8cJRoyQ2MdmZqTfs/ui23Zn5mmmkgYJC7UL2ybx74tCdeeZ5XszuTs3xM/cGBoNB19Xrrv/228ncD17RA1pFr/u1XPbGxsbpWV5cD8xOlifwzv1iPvy013vnp9dywgodFKhzGvuPJPkgcvZjo9FYWVpa2jvqbHfXTba2pkWefXj8+PGf53SqSh4GqHOafRCn9xuN+pnl5eVnjrizs+O2tqYP+r3O2TmdqpKHAeocZh8MBmeCMLq/urrqzJ6t1HvvhsOhK/LsbL/ffzCH01XyEECdw+z/djd9cmjuqkcvGahH7PC/7qZPDs1d9YglO+eAesQOB3H6oNGonz742fTgYf+5q/7Q73XOHPGUlXw5UI8we5ymnwUWfNdut5/7bHrwsOVddTQaucIXn/c6ne+PcNpKvhSoh5zdex+mafpe4f0XYRh92Ww2gzAMX+koeZ67yWRS5Hn2bWB2vdPp/G5m+Su9uOK/9EKo3vtakiTnzYJz3vtTzqzjvW9XvKv9yw+CwNVqNbeysuLKfx/mpygKt7297WazmSv/XfUfMxs571Mze+h9ca/b7d41s9nBXp6DOkjTj1zhrkZReKJ8cB1F0d4YBx+7VL1grn8+DZQficr/sFmWud3dXZdl+boL3KV+p3Pn6TPsQ/XeB3Gcfh1G4Vf1esNqtWg+STgKDRyigdksc9Ppls+z/Fqv17liZntvO/tQB4Pkm6gWXWo2m4d+OztEDn6VBl7aQHmHnUwmLptlV/v97uV9qOXbfWjB7VarZYf9zPXSs/ILNPA/Giixjsdjn/vi4/JjgJVfnOJk49dWq3WCt/v/0SgveW0NlB8DxuPxeq/77kmL441Pwii4VT4L5IcGFq2B8tlzns0uWJKkN1bq9Ysv+8vKol0AearRQPkXve3p9KbFcfJbe3X1/Vd9aF2NerjKRWmg/CPJaDh8ZHGSDtfW1to8J12UacjxdAPlc9bNzc2RDeLEHzt2jHZoYGEbePz4sQPqws5DsCcNABULEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQu5BjZNkuLb2VtvMaIQGFq4B773b3PxrZHGc/NZeXX0/DMOFC0kgGsjz3I2Gw0eWJOmNlXr94vLyMq3QwMI1sLOz47an05sWx/EnYVS71W63Fy4kgWhgNBq5PJtdMO99LU42fm21WidqtYhmaGBhGpjNMjcej9d73XdP7n2DGqTpR6EFt1utlgVBsDBBCVLdBoqiKJH63Bcf9zudO/tf9QeD5JuoFl1qNpsOrNUFsghXXiKdTCYum2VX+/3u5TLTPlTvfRDH6ddhFH5VrzeMjwGLMFn1MpRv99Ppls+z/Fqv17liZsUzUJ9UUn4McIW7GkXhiaWlJRdF0d4dlues1UPzJq64fE5a3kGzLHO7u7suy/J1F7hL5dv90+d/4VP+8gtWkvx53syf896fcmYd7z2PBd7EchU7h5mNnPepmT30vrjX7XbvmtnsYA1/A9cOclFW4Q9tAAAAAElFTkSuQmCC');
		position: absolute;
		top: 68rpx;
		right: 155rpx;
		z-index: 10;
		width: 270rpx;
		height: 695rpx;
		background-size: 100% 100%;
		background-repeat: no-repeat;
	
		.showListWrap {
			padding: 18rpx;
	
			.show {
				text-align: center;
				width: 100%;
				font-size: 24rpx;
				padding: 20rpx 0;
				border-bottom: 2rpx solid #E3E4E5;
			}
		}
	}

	.scroll-item {
		// height: 122rpx;
		background-color: #FFFFFF;
		display: flex;
		align-items: flex-start;
		justify-content: flex-start;
		padding: 32rpx 24rpx;
		margin-bottom: 16rpx;
		border-radius: 16rpx;

		.avatar {
			height: 140rpx;
			width: 140rpx;
		}

		.item-content {
			flex: 1;
			min-width: 0;
			margin-left: 24rpx;

			.item-content-start {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: flex-start;
				height: 140rpx;
				flex: 1;
				.item-content-name {
					flex: 1;
					color: #272727;
					margin-bottom: 16rpx;
					font-size: 30rpx;
					line-height: 42rpx;
				}

				.item-content-score {
					display: flex;
					align-items: center;

					.icon {
						width: 18rpx;
						height: 18rpx;
						margin-right: 14rpx;
					}

					margin-top: 10rpx;
					color: #F74437;
					font-size: 24rpx;
					font-weight: bold;
					line-height: 34rpx;
				}

				.item-content-tag {
					color: #565B5F;
					font-size: 22rpx;
					line-height: 32rpx;
					.item-content-tag-item{
						max-width: 110rpx;
						background-color:#F5F7F8 ;
						border-radius: 4rpx;
						padding: 6rpx 12rpx;
						margin-right: 8rpx;
					}
				}
			}

}
			.official {
				color: #2F80FF;
				font-size: 20rpx;
				line-height: 28rpx;
				font-weight: bold;
				display: flex;
				align-items: center;

				.icon {
					height: 24rpx;
					width: 24rpx;
					margin-right: 8rpx;
				}
			}

			// .follow {
			// 	text-align: center;
			// 	width: 96rpx;
			// 	background-color: #F74437;
			// 	color: #FFFFFF;
			// 	font-size: 24rpx;
			// 	line-height: 34rpx;
			// 	padding: 8rpx 0;
			// 	border-radius: 25rpx;
			// 	font-weight: bold;
			// }

			// .followed {
			// 	text-align: center;
			// 	width: 96rpx;
			// 	background-color: #F4F5F6;
			// 	color: #919397;
			// 	font-size: 24rpx;
			// 	line-height: 34rpx;
			// 	padding: 8rpx 0;
			// 	border-radius: 25rpx;
			// 	font-weight: bold;
			// }
		// }
	}
</style>
