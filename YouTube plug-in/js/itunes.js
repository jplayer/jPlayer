var iTunesStoreSearch;
(function($){
	iTunesStoreSearch = function(options){
		var placeholder = $(this);
		var settings = $(this).data('itunesstoresearchsettings');
		if(!settings){
			settings = {
				'term':'',
				'country':'',
				'media':'',
				'entity':'',
				'attribute':'',
				'limit':'',
				'lang':'',
				'version':'',
				'explicit':'',
				'callback':function(data){}
			}
		};
		var IntFunc = {
		};
		
		if(typeof(options)=='string'){
			if(IntFunc[options])IntFunc[options].apply(null,Array.prototype.slice.call(arguments,1));
		}else if(options){
			settings = $.extend(settings,options||{});
			$(this).data('itunesstoresearchsettings',settings);
			
			var pars = $.extend({},settings);
			delete pars['callback'];
			$.getJSON('https://itunes.apple.com/search?callback=?',pars,function(data){
				settings.callback(data)
			});
		}
	};
	$.fn.extend({
		itunesstoresearch:function(){
			var args = arguments;
			this.each(function(){iTunesStoreSearch.apply(this,args)});
		}
	});
})(jQuery);