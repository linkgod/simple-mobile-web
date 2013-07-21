var common = {
	"config": {
		"dataFormPrefix" : "file",
		"uploadUrl": window.location.href
	},
	//唯一序列产生器
	"seqer": (function (){
		var prefix = "file",
			seq = 1;
		return {
			setPrefix: function (p){
				prefix = String(p);
			},
			setSeq: function (s){
				seq = s;
			},
			gensym: function (){
				var result = prefix + seq;
				seq++;
				return result;
			}
		};
	}())
};