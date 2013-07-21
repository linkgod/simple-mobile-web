function UploadListView(){
	//app又这4个事件驱动
	$(document).on("add", addHandler);
	$(document).on("del", delHandler);
	$(document).on("upload", uploadHandler);
	$(document).on("reupload", reuploadHandler);

	function addHandler(evt, img){
		var tpl = makeTpl(img);
		$("#uploadList").append(tpl);
	}

	function delHandler(evt, img){
		$("#"+img.id).remove();
	}

	function uploadHandler(evt, img){
		var $img = $("#" + img.id),
			$progressBar = $img.find(".progress-bar"),
			$status = $img.find(".status"),
			$abort = $img.find(".abort"),
			$delete = $img.find(".delete"),
			$reupload = $img.find(".reupload");

		if (img.status === "not upload"){
			throw new Error("uploaded, but img.status is 'not upload'");
		}
		else if(img.status === "upload start"){
			$status.html('<span aria-hidden="true" class="icon-info"></span> 正在上传');
		}
		else if((/\d+/).test(img.status)){
			$progressBar.width(img.status);
		}
		else if(img.status === "upload success"){
			$progressBar.width("100%");
			$status.html('<span aria-hidden="true" class="icon-info"></span> 完成');
			$abort.hide();
		}
		else if(img.status === "upload abort"){
			$progressBar.width(0);
			$status.html('<span aria-hidden="true" class="icon-info"></span> 上传已取消');
			$abort.hide();
			$reupload.show();
		}
		else if(img.status === "upload error"){
			$progressBar.width(0);
			$status.html('<span aria-hidden="true" class="icon-info"></span> 上传错误');
			$abort.hide();
			$reupload.show();
		}
		else if(img.status === "upload timeout"){
			$progressBar.width(0);
			$status.html('<span aria-hidden="true" class="icon-info"></span> 上传超时');
			$abort.hide();
			$reupload.show();
		}
		else if(img.status === "upload fail"){
			$progressBar.width(0);
			$status.html('<span aria-hidden="true" class="icon-info"></span> 上传失败');
			$abort.hide();
			$reupload.show();
		}
		else{
			throw new Error("img.status is" + img.status);
		}
	}

	function reuploadHandler(evt, img){
		var $img = $("#" + img.id),
			$abort = $img.find(".abort"),
			$reupload = $img.find(".reupload"),
			$status = $img.find(".status");
		$reupload.hide();
		$abort.show();
		$status.html('<span aria-hidden="true" class="icon-info"></span> 等待上传');
	}

	function makeTpl(img){
		var tpl = "";
		tpl += '<li id="'+ img.id +'" class="upload">';
		tpl += '	<div class="imgWrap">';
		tpl += '		<img class="uploadImg" src="'+ img.src +'">';
		tpl += '	</div>';
		tpl += '	<div class="statusWrap">';
		tpl += '		<div class="progress-bar-container">';
		tpl += '			<div class="progress-bar"></div>';
		tpl += '		</div>';
		tpl += '		<div class="status"><span aria-hidden="true" class="icon-info"></span> 等待上传</div>';
		tpl += '		<a aria-hidden="true" class="icon-stop abort"></a>';
		tpl += '		<a aria-hidden="true" class="icon-cloud-upload reupload" style="display: none;"></a>';
		tpl += '		<a aria-hidden="true" class="icon-cancel-circle delete"></a>';
		tpl += '	</div>';
		tpl += '</li>';

		return tpl;
	}
}