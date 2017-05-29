$(document).ready(function(){

	// ARRAY FOR STORING INFORMATION OF PLAYLIST TRACKS 
	var playlist = [];

	// DEFINE OUR PLAYER TO HTML TAG '#jplayer' AND INITIALIZE JPLAYER LIBRARY
	var player = new MediaElementPlayer('#player1', {

	    defaultVideoWidth: 960,
	    defaultVideoHeight: 410,
	    features: ['playpause', 'progress', 'current', 'duration', 'volume', 'fullscreen'],
	    success: function (media, domElement, player) {

			drag('#sound-bar','#sound-bar-inner',media,'volume');
			drag('#duration-bar','#duration-bar-inner',media,'duration');
			progress(media);

	    }

	});


	//localStorage.removeItem("musiclist");

	// DECLARE OUR DATA STORAGE SYSTEM INTO A VARIABLE
	var items = localStorage.getItem("musiclist");

	// IF DATA EXISTS RETRIEVE IT AND APPENDING TO HTML TAGS IN HTML PLAYLIST
	if ( items ) {

		var arr = JSON.parse(items);

		arr.forEach(function(i,j){

			$('#tracks').append(

    			'<div class="track" data-track-url="'+i.m4v+'">'+
    			'<div class="track-detail" data-track-album="'+i.album+'" data-track-country="'+i.country+'" data-track-date="'+i.date+'" data-track-gengre="'+i.gengre+'"></div>'+
    			'<div class="track-number">'+i.id+'</div>'+
    			'<div class="track-data">'+
    			'<span class="track-title">'+i.title+'</span> - '+
    			' <span class="track-artist">'+i.artist+'</span>'+
    			'</div>'+
    			'<div class="track-delete"><i class="ion-minus-round"></i></div>'+
    			'<div class="track-thumbnail"><img src="'+i.thumbnail+'" alt="track thumbnail"></div>'+
    			'<div class="star-rating" data-rate="'+i.rate+'">'+
    			'<div class="star" data-length="1"><i class="ion-android-star"></i></div>'+
    			'<div class="star" data-length="2"><i class="ion-android-star"></i></div>'+
    			'<div class="star" data-length="3"><i class="ion-android-star"></i></div>'+
    			'<div class="star" data-length="4"><i class="ion-android-star"></i></div>'+
    			'<div class="star" data-length="5"><i class="ion-android-star"></i></div>'+
    			'</div>'+
    			'</div>'

    		);

    		playlist.push(

    			{

					id: i.id-1,
					title: i.title,
					artist: i.artist,
					m4v: i.m4v,
					thumbnail: i.thumbnail,
					album: i.album,
					country: i.country,
					date: i.date,
					gengre: i.gengre,
					rate: i.rate

				}

			);

		});

	}

	$('.star-rating').children('.star').each(function(){

		var attr = $(this).parent().attr('data-rate');
		var len = $(this).attr('data-length');

		if ( len <= attr) {

			$(this).css('color','#292929');

		}
		else {

			$(this).css('color','');

		}

	});

	// ON CLICK SUBMIT TRACK BUTTON
	$('#submit-track-btn').on('click', function(){

    	// HANDLING IF ERROR EXISTS ON SUBMITTING TRACK, IF VARIABLE GREATER THAN 0 THEN EXISTS ERROR 
    	var error = 0;

    	// EACH USER INPUT VALUES HANDLE IF IS EMPTY
    	$('.track-info > input').each(function(){

    		var id = $(this).attr('id');
    		var length = $(this).val().length;

    		if ( length < 1 && id !== 'get-track-url' ) {

    			$(this).css('border-color','#f00');
    			alert('Παρακαλώ συμπλήρωσε τα πεδίο με το κόκκινο πλαίσιο');
    			error++;

    		}
    		else {

    			$(this).css('border-color','');

    		}

    		// CHECK IF URL INPUT MATCH WITH YOUTUBE ADDRESS, OTHERWISE DISABLE SUBMITTING
    		if ( id == 'get-track-url' ) {

    			var val = $(this).val();
    			var isYoutube = val.match(/(?:youtu|youtube)(?:\.com|\.be)\/([\w\W]+)/i);

    			if ( isYoutube && val.length > 1 ) {

    				$(this).css('border-color','');

    			}
    			else {

    				$(this).css('border-color','#f00');
    				alert('Τοπεθέτησε μια διεύθυνση url απο το youtube που αντιστοιχεί σε βίντεο. Για παράδειγμα: https://www.youtube.com/watch?v=TapXs54Ah3E');
	    			error++;

    			}

    		}

    	});

    	// IF THERE IS NOT ERROR ON SUBMITTING STORE TRACK IN PLAYLIST ARRAY
    	if ( error == 0 ) {

    		// GET VALUES FROM USER INPUT
    		var artist = $('#get-track-artist').val();
    		var title = $('#get-track-title').val();
    		var url = $('#get-track-url').val();
    		var listLength = $('#tracks').children().length;
    		var number = listLength+1;
    		var thumbnail, album, country, relDate, gengre;

    		$('#get-track-info').slideUp('slow');

    		// SEARCH TO ITUNES DATABASE TO RETRIEVE TRACK ARTWORK AND OTHER INFO
    		$('#get-track-info').itunesstoresearch({

		        'term': artist+' - '+title,
		        'limit': 1,
		        'callback': function(data){

		        	var check = data.results[0];

		        	if ( check === undefined ) {

			           	thumbnail = '<img src="img/cover.png" alt="track thumbnail">';
			           	album = 'Δεν υπάρχουν στοιχεία';
			           	country = 'Δεν υπάρχουν στοιχεία';
			           	relDate = 'Δεν υπάρχουν στοιχεία';
			           	gengre = 'Δεν υπάρχουν στοιχεία';

		           }
		           else {

			           	var artwork = data.results[0].artworkUrl100;
			           	var replace = artwork.replace("100x100bb", "500x500bb");
			           	thumbnail = '<img src="'+replace+'" alt="track thumbnail">';
			           	album = data.results[0].collectionName;
			           	country = data.results[0].country;
			           	relDate = data.results[0].releaseDate;
			           	relDate = relDate.substring(0, relDate.indexOf('T'));
			           	gengre = data.results[0].primaryGenreName;

		           }  

		           // APPEND TRACK TO HTML TAGS
		           $('#tracks').append(

		    			'<div class="track" data-track-url="'+url+'">'+
		    			'<div class="track-detail" data-track-album="'+album+'" data-track-country="'+country+'" data-track-date="'+relDate+'" data-track-gengre="'+gengre+'"></div>'+
		    			'<div class="track-number">'+number+'</div>'+
		    			'<div class="track-data">'+
		    			'<span class="track-title">'+title+'</span> - '+
		    			' <span class="track-artist">'+artist+'</span>'+
		    			'<span class="track-playing"></span>'+
		    			'</div>'+
		    			'<div class="track-delete"><i class="ion-minus-round"></i></div>'+
		    			'<div class="track-thumbnail">'+thumbnail+'</div>'+
		    			'<div class="star-rating" data-rate="0">'+
		    			'<div class="star" data-length="1"><i class="ion-android-star"></i></div>'+
		    			'<div class="star" data-length="2"><i class="ion-android-star"></i></div>'+
		    			'<div class="star" data-length="3"><i class="ion-android-star"></i></div>'+
		    			'<div class="star" data-length="4"><i class="ion-android-star"></i></div>'+
		    			'<div class="star" data-length="5"><i class="ion-android-star"></i></div>'+
		    			'</div>'+
		    			'</div>'

		    		);

		           // CLEAR USER INPUT VALUES
		           $('.track-info > input').each(function(){

		    			$(this).val('');

		    		});

		    		playlist = [];

		    		// PUSH TRACK TO ARRAY
		    		$('#tracks > .track').each(function(){

						playlist.push(

							{

								id: $(this).children('.track-number').text(),
								title: $(this).children('.track-data').children('.track-title').text(),
								artist: $(this).children('.track-data').children('.track-artist').text(),
								m4v: $(this).attr('data-track-url'),
								thumbnail: $(this).children('.track-thumbnail').children('img').attr('src'),
								album: $(this).children('.track-detail').attr('data-track-album'),
								country: $(this).children('.track-detail').attr('data-track-country'),
								date: $(this).children('.track-detail').attr('data-track-date'),
								gengre: $(this).children('.track-detail').attr('data-track-gengre'),
								rate: $(this).children('.star-rating').attr('data-rate')

							}

						);

				    });

				    var listString = JSON.stringify(playlist);

				    // STORAGE ARRAY TO LOCAL STORAGE SYSTEM OF BROWSER
				    localStorage.setItem("musiclist", listString);

		        }

		    });

    	}

    });	

	var click = 0;

	// ON CLICK PLAY BUTTON
	$('#player-play').on('click', function(){

		if ( $('#main-player').attr('data-track-id') == '' && click < 1 ) {

			click++;
			player.pause();
			player.setSrc( playlist[0].m4v );
			player.media.load();
			player.play();
			playerData(playlist[0].id,playlist[0].title,playlist[0].artist,playlist[0].m4v,playlist[0].thumbnail,playlist[0].album,playlist[0].country,playlist[0].date,playlist[0].gengre);
			$(this).hide();
			$('#main-player').attr('data-status','playing');
            $('#player-pause').show();
            duration();

		}

		else {

			player.play();

			$(this).hide();

			$('#main-player').attr('data-status','playing');

	    	$('#player-pause').show();

	    	$('#main-player').removeClass('pause');

	    	$('#main-player').addClass('play');

	    	duration();

	    }

	});


	// ON CLICK PAUSE BUTTON
	$('#player-pause').on('click', function(){

    	player.pause();

    	$(this).hide();

    	$('#main-player').attr('data-status','pausing');

    	$('#player-play').show();

    	$('#main-player').removeClass('play');

    	$('#main-player').addClass('pause');

    });

    // ON CLICK NEXT BUTTON
    $('#player-next').on('click', function(){

    	var id = $('#main-player').attr('data-track-id');

    	var parse = parseInt(id);

    	var minus = playlist.length - 1;

    	var sum = parse + 1;

    	var num;

    	var next;

    	var shuffleStatus = $('#player-shuffle').attr('class');

    	$('.track-number').each(function(){

    		if ( $(this).text() == sum ) {

    			next = $(this).parent().next().children('.track-number').text() - 1;

    		}

    	});

    	if ( shuffleStatus == 'shuffle-on' ) {

    		num = shufflePlay(minus);

    	}
    	else {

	    	if ( next == -1 ) {

	    		num = $('.track').first().children('.track-number').text() - 1;

	    	}
	    	else {

	    		num = next;

	    	}

        }

		player.pause();
		player.setSrc( playlist[num].m4v );
		player.media.load();
		player.play();
        playerData(playlist[num].id,playlist[num].title,playlist[num].artist,playlist[num].m4v,playlist[num].thumbnail,playlist[num].album,playlist[num].country,playlist[num].date,playlist[num].gengre);
        duration();

	});

	// ON CLICK PREVIOUS BUTTON
	$('#player-previous').on('click', function(){

    	var id = $('#main-player').attr('data-track-id');

    	var parse = parseInt(id);

    	var sum = parse + 1;

    	var minus = playlist.length - 1;

    	var num;

    	var prev;

    	var shuffleStatus = $('#player-shuffle').attr('class');

    	$('.track-number').each(function(){

    		if ( $(this).text() == sum ) {

    			prev = $(this).parent().prev().children('.track-number').text() - 1;

    		}

    	});

    	if ( shuffleStatus == 'shuffle-on' ) {

    		num = shufflePlay(minus);

    	}
    	else {

	    	
	    	if ( prev == -1 ) {

	    		num = $('.track').last().children('.track-number').text() - 1;

	    	}
	    	else {

	    		num = prev;

	    	}

        }

		player.pause();
		player.setSrc( playlist[num].m4v );
		player.media.load();
		player.play();
        playerData(playlist[num].id,playlist[num].title,playlist[num].artist,playlist[num].m4v,playlist[num].thumbnail,playlist[num].album,playlist[num].country,playlist[num].date,playlist[num].gengre);
        duration();

	});

	$('#player-shuffle').on('click', function(){

		var attr = $(this).attr('class');

		if ( attr == 'shuffle-off' ) {

			$(this).removeClass('shuffle-off').addClass('shuffle-on').css('color','#7ba2c5');

		}
		if ( attr == 'shuffle-on' ) {

			$(this).removeClass('shuffle-on').addClass('shuffle-off').css('color','');

		}

	});

	// ON CLICK IN TRACK
	$('.track').on('click', function(){

		var id = $(this).children('.track-number').text();
		var num = parseInt(id);
		var sum = num - 1;
		player.pause();
		player.setSrc( playlist[sum].m4v );
		player.media.load();
		player.play();
		playerData(playlist[sum].id,playlist[sum].title,playlist[sum].artist,playlist[sum].m4v,playlist[sum].thumbnail,playlist[sum].album,playlist[sum].country,playlist[sum].date,playlist[sum].gengre);
		$('#player-play').hide();
        $('#player-pause').show();
        $('#main-player').attr('data-status','playing');
        duration();

	});

	$('.star').on('click', function(){

		var len = $(this).attr('data-length');

		$(this).parent().children('.star').each(function(){

			var attr = $(this).attr('data-length');

			if ( attr <= len ) {

				$(this).css('color','#292929');

			}
			else {

				$(this).css('color','');

			}

		});

		$(this).parent().attr('data-rate', len);

		playlist = [];

		$('.track').each(function(index){

				$(this).children('.track-number').html(index + 1);

				playlist.push(

					{

						id: $(this).children('.track-number').text(),
						title: $(this).children('.track-data').children('.track-title').text(),
						artist: $(this).children('.track-data').children('.track-artist').text(),
						m4v: $(this).attr('data-track-url'),
						thumbnail: $(this).children('.track-thumbnail').children('img').attr('src'),
						album: $(this).children('.track-detail').attr('data-track-album'),
						country: $(this).children('.track-detail').attr('data-track-country'),
						date: $(this).children('.track-detail').attr('data-track-date'),
						gengre: $(this).children('.track-detail').attr('data-track-gengre'),
						rate: $(this).children('.star-rating').attr('data-rate')

					}

				);

			});

			var listString = JSON.stringify(playlist);

		    // STORAGE ARRAY TO LOCAL STORAGE SYSTEM OF BROWSER
		    localStorage.setItem("musiclist", listString);

	});

	$('.track-delete').on('click', function(){

		var id = $(this).parent().children('.track-number').text();
		var parID = parseInt(id);
		$(this).parent().fadeOut().remove();
		var len = $('#tracks').children().length;

		if ( len > 0 ) {

			playlist = [];

			$('.track').each(function(index){

				$(this).children('.track-number').html(index + 1);

				playlist.push(

					{

						id: $(this).children('.track-number').text(),
						title: $(this).children('.track-data').children('.track-title').text(),
						artist: $(this).children('.track-data').children('.track-artist').text(),
						m4v: $(this).attr('data-track-url'),
						thumbnail: $(this).children('.track-thumbnail').children('img').attr('src'),
						album: $(this).children('.track-detail').attr('data-track-album'),
						country: $(this).children('.track-detail').attr('data-track-country'),
						date: $(this).children('.track-detail').attr('data-track-date'),
						gengre: $(this).children('.track-detail').attr('data-track-gengre'),
						rate: $(this).children('.star-rating').attr('data-rate')

					}

				);

			});

			var listString = JSON.stringify(playlist);

		    // STORAGE ARRAY TO LOCAL STORAGE SYSTEM OF BROWSER
		    localStorage.setItem("musiclist", listString);

		}
		else {

			localStorage.removeItem("musiclist");

		}
		

	});

	// ON CLICK A SOCIAL MEDIA ICON
	$('.popup').click(function (event) {

	    event.preventDefault();
	    window.open($(this).attr("href"), "popupWindow", "width=600,height=300,scrollbars=yes");

	});

	$('#add-track-label').on('click', function(){

		$('#get-track-info').slideToggle();

	}); 

	$('#mep_0').css({
		'position':'fixed',
		'top':'-1000px'
	});

	// FUNCTIONALITY  

	// APPENDING DATA TO SPECIFIC HTML TAGS, RETRIEVING FROM TRACKS
	function playerData(id,title,artist,url,thumbnail,album,country,date,gengre) {

		$('#main-player').attr('data-track-id',id);
		$('#main-player').attr('data-track-url',url);
		var uri = $('#main-player').attr('data-track-url'); 
		$('.player-track-title').html(title);
		$('.player-track-artist').html(artist);
		$('#google-plus').attr('href','https://plus.google.com/share?url='+uri);
		$('#facebook').attr('href','https://www.facebook.com/sharer/sharer.php?u='+uri);
		$('#twitter').attr('href','https://twitter.com/home?status='+uri);
		$('#linkedin').attr('href','https://www.linkedin.com/shareArticle?mini=true&url='+uri);
		$('#playing-track-thumbnail').html('<img src="'+ thumbnail +'">');
		$(document).prop('title', artist+' - '+title);
		$('#artist-name').html('<i>Τραγουδιστής:</i> '+artist);
		$('#song-name').html('<i>Τραγούδι:</i> '+title);
		$('#album').html('<i>Αλμπουμ:</i> '+album);
		$('#country').html('<i>Χώρα:</i> '+country);
		$('#release-date').html('<i>Ημ.Κυκλοφορίας:</i> '+date);
		$('#genre').html('<i>Είδος:</i> '+gengre);

	}

	// GETTING THE DURATION AND CURRENT TIME OF EACH TRACK
	function duration() {

		var interval = setInterval(function(){

			var duration = $('.mejs-duration').text();
			var curTime = $('.mejs-currenttime').text();
			$('#duration-time').html( duration );
			$('#current-time').html( curTime );

		}, 1000);

	}

	// UPDATING PLAYER PROGRESS BAR DEPEND ON EACH TRACK
	function progress(player) {

		player.addEventListener('timeupdate', function(){

			var curTime = player.currentTime;
			var duration = player.duration;
			var sum = curTime * 100 / duration;
			var loaded = $('.mejs-time-loaded').attr('style').replace( /[^\d.]/g, '' );
			var num = loaded * 100 / 41;
			$('#duration-bar-inner').css('width',sum+'%');
			$('#duration-bar-loaded').css('width',num+'%');

		},false);		

	} 

	// AUTO PLAYING NEXT TRACK WHEN CURRENT ENDS
	function changeTrack() {

		var interval = setInterval(function(){

			var id = $('#main-player').attr('data-track-id');
			var num = parseInt(id);
			var sum;
			var next;
			var status = $('#main-player').attr('data-status');
			var duration = $('#duration-time').text();
			var curTime = $('#current-time').text();
			var length = playlist.length - 1;
			var shuffleStatus = $('#player-shuffle').attr('class');

			$('.track-number').each(function(){

	    		if ( $(this).text() == num+1 ) {

	    			next = $(this).parent().next().children('.track-number').text() - 1;

	    		}

	    	});

			if ( shuffleStatus == 'shuffle-on' ) {

				sum = shufflePlay( length );

			}
			else {

				if ( next == -1 ) {

		    		sum = $('.track').first().children('.track-number').text() - 1;

		    	}
		    	else {

		    		sum = next;

		    	}

			}

			if ( status == 'playing' && curTime >= '00:01' ) {

				if ( curTime >= duration ) {

					$('#main-player').attr('data-status','pausing');
					player.pause();
					player.setSrc( playlist[sum].m4v );
					player.media.load();
					player.play();
					playerData(playlist[sum].id,playlist[sum].title,playlist[sum].artist,playlist[sum].m4v,playlist[sum].thumbnail,playlist[sum].album,playlist[sum].country,playlist[sum].date,playlist[sum].gengre);
					timeOut();

				}

			}

		},1000);

		function timeOut() {

			setTimeout(function(){ $('#main-player').attr('data-status','playing'); }, 9000);

		}

	}

	// DRAG VOLUME AND PROGRESS ELEMENT AND THEN CHANGE VALUES DEPEND ON DRAGGING VALUE
	function drag( elem, inner, vol, active ) {

		var clicking = false;


		$(elem).mousedown(function(e) {

			clicking = true;
			updatebar(e.pageX);

		});

		$(document).mouseup(function(e) {

			clicking = false;

		});

		$(elem).mousemove(function(e) {

			if ( clicking == false ) return;

			updatebar(e.pageX);

		});


		var updatebar = function(x) {

			var progress = $(elem);
			var position = x - progress.offset().left;
			var percentage = 100 * position / progress.width();

			if(percentage > 100) {

				percentage = 100;

			}

			if(percentage < 0) {

				percentage = 0;

			}

            var decimal = percentage / 100;
            var curTime = vol.currentTime;
            var duration = vol.duration;
            var sum = percentage * duration / 100;

            if ( active == 'volume' ) {

            	vol.setVolume( decimal.toFixed(1) );
            	$(inner).css('width', percentage+'%');

            }
            else {

            	$(inner).css('width', percentage+'%');
            	vol.setCurrentTime(sum);

            }

		};

	}

	// GET CURRENT DATE AND TIME FROM BROWSER
	function date() {

		var d = new Date();
		var date = d.getDate();
		var month = d.getMonth() + 1;
		var year = d.getFullYear();
		var hours = d.getHours();
		var mins = d.getMinutes();
		var sec = d.getSeconds();
		if ( hours < 10 ) {hours = '0'+hours;}
		if ( mins < 10 ) {mins = '0'+mins;}
		if ( sec < 10 ) {sec = '0'+sec;}
		$('#time-panel').html('<i class="ion-calendar"></i> '+date+'/'+month+'/'+year+' - <i class="ion-clock"></i> '+hours+':'+mins+':'+sec);

	}

	function shufflePlay(max) {

		var playerId = $('#main-player').attr('data-track-id');
        var random = Math.floor(Math.random()*(max-0+1)+0);

        if ( random == playerId ) {

        	random = Math.floor(Math.random()*(max-0+1)+0);

        }

        return random;

	}

    $('#sort-inner').on('click', function(){

    	var attr = $(this).attr('class');

    	if ( attr == 'ascending' ) {

    		$(this).addClass('descending');
    		$(this).removeClass('ascending');
    		$(this).children('span').html('<i class="ion-arrow-up-b"></i>');

    		$('.track > .star-rating').sort(function(a,b){

				return $(a).data('rate') > $(b).data('rate')

			}).each(function(){

				$(this).parent().remove().appendTo('#tracks');

			});

    	}
    	if ( attr == 'descending' ) {

    		$(this).addClass('ascending');
    		$(this).removeClass('descending');
    		$(this).children('span').html('<i class="ion-arrow-down-b"></i>');

    		$('.track > .star-rating').sort(function(a,b){

				return $(a).data('rate') < $(b).data('rate')

			}).each(function(){

				$(this).parent().remove().appendTo('#tracks');

			});

    	}

    });

	var interval = setInterval(function(){date();},1000);

	changeTrack();

});