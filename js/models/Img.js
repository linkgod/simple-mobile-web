/**
 *	input是DOM对象, 
 *	opt = {
 *		"prefix": String,
 *		"url": String
 *	}
 *	
 *	file必须是图片
 *
 *	在上传过程中
 *	当xhr状态改变时，就会触发全局upload事件
 *	并且传送当前img作为参数
 */
function Img(input, opt){
	var that = this;
	this.file = null;
	this.size = "";
	this.src = "";
	this.id = common.seqer.gensym(); // 获取唯一id
	this.status = this.statusCode[0]; // 图片默认状态：not upload
	this.xhr = new XMLHttpRequest();
	this.data = new FormData();

	$.extend(this.uploadOpt, opt);

	// 初始 this.file
	if(input.files && input.files.length === 1){
		this.file = input.files[0];
	}
	else if(input.files.length < 1) {
		throw new Error('Must select a file to upload');
	}
	else{
		throw new Error('Can only upload one file at a time');
	}
	if( !(/image/i).test(this.file.type) ){
		throw new Error('the file must be a image');
	}

	// 初始this.size
	if (this.file.size > 1024 * 1024){
		this.size = (Math.round(this.file.size * 100 / (1024 * 1024)) / 100) + 'MB';
	}
	else{
		this.size = (Math.round(this.file.size * 100 / 1024) / 100) + 'KB';
	}

	// 初始 this.data
	this.data.append(this.uploadOpt.prefix, this.file);

	//为xhr创建监听器，动态改变this.status
	this.xhr.upload.addEventListener('loadstart', onloadstartHandler,false);
	this.xhr.upload.addEventListener('progress', onprogressHandler,false);
	this.xhr.upload.addEventListener("abort", onabortHandler, false);
	this.xhr.upload.addEventListener("error", onerrorHandler, false);
	this.xhr.upload.addEventListener("timeout", ontimeoutHandler, false);

	function onloadstartHandler(){
		that.status = that.statusCode[1];
		// alert("loadstart");
		$(document).triggerHandler("upload", that);
	}
	function onprogressHandler(evt){
		if (evt.lengthComputable) {
			that.status = (evt.loaded / evt.total) * 100 + "%"; //that.statusCode[2]
			$(document).triggerHandler("upload", that);
		}
	}
	function onabortHandler(){
		that.status = that.statusCode[4];
		$(document).triggerHandler("upload", that);
	}
	function onerrorHandler(){
		that.status = that.statusCode[5];
		$(document).triggerHandler("upload", that);
	}
	function ontimeoutHandler(){
		that.status = that.statusCode[6];
		$(document).triggerHandler("upload", that);
	}
}

Img.prototype =  {
	statusCode: [
		"not upload",
		"upload start",
		"uploading",// "0%~100%"
		"upload success",
		"upload abort",
		"upload error",
		"upload timeout",
		"upload fail"
	],

	// 上传的一些设置选项
	uploadOpt: {
		"prefix": "file",
		"url": window.location.href
	},

	// 读取图片，读取完成执行回调
	read: function (callback){
		var that = this;
			reader = new FileReader();
		/* event listners */
		reader.onload = function (evt){
			that.src = evt.target.result;
			callback(evt);
		};
		reader.onerror = function (){
			console.log("img read error");
		};
		reader.readAsDataURL(this.file);

		return this;
	},

	// 开始上传
	upload: function (callback, url){
		var that = this,
			xhr = that.xhr;
		//当xhr response后执行callback
		xhr.onreadystatechange = function(ev){
			if(xhr.readyState == 4) {
				console.log('done!');
				if(xhr.status == 200 && xhr.status < 300 || xhr.status === 304) {
					that.status = that.statusCode[3];
					$(document).triggerHandler("upload", that);
					callback(that.status);
				}
				else {
					that.status = that.statusCode[7];
					$(document).triggerHandler("upload", that);
					callback(that.status);
				}
			}
		};
		if (url) {
			xhr.open('POST',url, true);
		}
		else{
			xhr.open('POST',that.uploadOpt.url, true);
		}
		xhr.send(that.data);

		return that;
	},

	// 中止上传
	abort: function (){
		this.xhr.abort();
		return this;
	}
};