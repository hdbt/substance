jQuery(function($){

	if(!jQuery.browser)
		jQuery.browser=browser_detect();
	
	if(jQuery.browser.msie && parseInt(jQuery.browser.version) < 8)
		return;
	
	if(jQuery.browser.webkit || jQuery.browser.chrome || jQuery.browser.safari)
		jQuery('html').addClass('webkit');
	else if(jQuery.browser.msie) {
		jQuery('html').addClass('msie');
		if(parseInt(jQuery.browser.version) == 8)
			jQuery('html').addClass('msie8');
		else if(parseInt(jQuery.browser.version) >= 10)
			jQuery('html').addClass('msie10');
	}
	else if(jQuery.browser.mozilla)
		jQuery('html').addClass('mozilla');
		
	if(jQuery('html').hasClass('msie8'))
		jQuery('img').removeAttr('width').removeAttr('height');
		
	if(!!('ontouchstart' in window))
		jQuery('html').addClass('touch');
	else
		jQuery('html').addClass('no-touch');
		
	responsiveListener_init();
	
	retina_images_init();
	
	fix_placeholders();
		
	bg_overlay_init();
	
	menu_init();
	
	search_popup_init();
	
	parallax_title_init();
	
	sliced_gallery_init();
	
	lazyload_init();
	
	masonry_gallery_init();
	
	responsive_embed_init();
	
	blog_grid_init();

	gallery_init(); // important to init after all isotope initializations
	
	video_bg_container_init();
	
	waypoints_init();

	portfolio_init();	
	
	testimonials_init();
	
	/***********************************/

	function browser_detect() {
		
		var matched, browser;
	
		ua = navigator.userAgent.toLowerCase();
	
		var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
			/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
			/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
			/(msie) ([\w.]+)/.exec( ua ) ||
			ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
			[];
	
		matched = {
			browser: match[ 1 ] || "",
			version: match[ 2 ] || "0"
		};
	
		browser = {};
	
		if ( matched.browser ) {
			browser[ matched.browser ] = true;
			browser.version = matched.version;
		}
	
		if ( browser.webkit ) {
			browser.safari = true;
		}
	
		return browser;
	}
	
	/***********************************/
		
	function responsiveListener_init(){
		var lastWindowSize=jQuery(window).width();
		jQuery(window).data('mobile-view',(lastWindowSize<768));
		
		jQuery(window).resize(function(){
			var w=jQuery(this).width();
			if(
				(w>=768 && lastWindowSize < 768) ||
				(w<=767 && lastWindowSize > 767)
			){
				jQuery(window).data('mobile-view',(w<768));
			}
			lastWindowSize=w;
		});
		
	}
	
	/***********************************/
	
	function retina_images_init() {
		if(window.devicePixelRatio > 1.8) {
			$('img[data-src-retina]').each(function(){
				if($(this).data('src-retina'))
					this.src=$(this).data('src-retina');
			})
		}
	}
	
	/***********************************/
	
	function bg_overlay_init() {
		
		var wh=$(window).height();
		var $obj=$('.bg-overlay');
		if($obj.height() < wh)
			$obj.css('min-height',wh+'px');
	
	}

	/***********************************/
	
	function fix_placeholders() {
		
		var input = document.createElement("input");
	  if(('placeholder' in input)==false) { 
			jQuery('[placeholder]').focus(function() {
				var i = jQuery(this);
				if(i.val() == i.attr('placeholder')) {
					i.val('').removeClass('placeholder');
					if(i.hasClass('password')) {
						i.removeClass('password');
						this.type='password';
					}			
				}
			}).blur(function() {
				var i = jQuery(this);	
				if(i.val() == '' || i.val() == i.attr('placeholder')) {
					if(this.type=='password') {
						i.addClass('password');
						this.type='text';
					}
					i.addClass('placeholder').val(i.attr('placeholder'));
				}
			}).blur().parents('form').submit(function() {
				jQuery(this).find('[placeholder]').each(function() {
					var i = jQuery(this);
					i.addClass('placeholder-submitting');
					if(i.val() == i.attr('placeholder'))
						i.val('');
				})
			});
		}
	}
	
	/***********************************/
	
	function menu_init() {

		jQuery('ul.primary-menu-fallback.show-dropdown-symbol li').each(function(){
			if(jQuery(this).children('ul').length)
				jQuery(this).addClass('menu-parent-item');
		});

		var args={
			autoArrows: false,
			delay: 500, 
			animation: {opacity: 'show', height: 'show'},
			animationOut: {opacity: 'hide'},
			speed: 150,
			speedOut: 200,
			onBeforeHide: function(){
				jQuery(this).parent().removeClass('omHover');
			},
			onBeforeShow: function(){
				jQuery(this).parent().addClass('omHover');
			}
		};
	
		if(jQuery('html').hasClass('no-touch')) {
			args.onBeforeShow=function(){
				if(!jQuery(this).parent().hasClass('omHover')) {
					jQuery(this).parent().addClass('omHover');
					jQuery(this).children('li').stop(true).css('opacity',0);
				}
			};
			args.onShow=function(){
				var i=0;
				jQuery(this).children('li').each(function(){
					jQuery(this).fadeTo(100+100*i,1);
					i++;
				});
			};
		}
		
		jQuery('ul.primary-menu, ul.secondary-menu').superfish(args);
		
		
		jQuery('ul.header-menu-mobile').superfish({
			autoArrows: false,
			delay: 500,
			animation: {opacity: 'show', height: 'show'},
			animationOut: {opacity: 'hide', height: 'hide'},
			speed: 150,
			speedOut: 200
		});
		
		$('.mobile-header-menu-control').click(function(){
			$(this).toggleClass('active');
			$('.mobile-header-menu-container').slideToggle(300);
		});

		if($('body').hasClass('menu-position-top_fixed') && !jQuery('html').hasClass('touch') && jQuery.waypoints) {
			$('.menu-sticky-node').waypoint('sticky', {
				wrapper: '<div class="menu-sticky-node-wrapper" />',
				stuckClass: 'menu-stuck'
			});
		}
		
	}
	
	/***********************************/
	
	function search_popup_init() {
		
		$('.search-popup-link').click(function(e){
			e.preventDefault();
			var $popup=$(this).next('.search-popup');
			$(this).toggleClass('active');
			$popup.toggleClass('active');
			if($(this).hasClass('active')) {
				setTimeout(function(){
					$popup.find('#s').focus();
				},100); // delay for transition animation
			}
		});
		
	}
	
	/************************************/
	
	function parallax_title_init() {

		var $title=jQuery('.page-title-wrapper.tpl-parallax');

		if(jQuery('html').hasClass('no-touch') && $title.length) {
			var $inner=$title.find('.page-title-inner');
			
			var pw=jQuery(window).width();
			jQuery('body').mousemove(function(e){
				var k=e.pageX/pw-0.5;
				var bx=Math.round(k*600);
				var sx=Math.round(k*300);
				$title.stop(true).animate({backgroundPosition: bx+'px 0'}, 1000);
				$inner.stop(true).animate({backgroundPosition: sx+'px 0'}, 1000);
			});
		}
		
	}
	
	/*************************************/
	
	function gallery_init() {
		if(jQuery().omSlider) {
			jQuery('.custom-gallery').each(function(){
				var $items=jQuery(this).find('.items');
				var num=$items.find('.item').length;
				if(num > 1) {
					
					var active=0;
					var hash=document.location.hash.replace('#','');
					if(hash != '') {
						var $active=$items.find('.item[rel='+hash+']');
						if($active.length)
							active=$active.index();
					}
					jQuery(this).append('<div class="controls"><div class="control-prev"><a href="#" class="prev"></a></div><div class="control-next"><a href="#" class="next"></a></div><div class="control-progress"><div class="progress"></div></div></div>');
					var $controls=jQuery(this).find('.controls');
					$controls.find('.total').html(num);
					var args={
						speed: 400,
						next: $controls.find('.next'),
						prev: $controls.find('.prev'),
						active: active,
						before: function(currSlide, nextSlide, currSlideNum, nextSlideNum){
							$controls.find('.progress').css('width',Math.round(nextSlideNum/(num-1)*100)+'%');
						}
					};
					
					
					var $blog=jQuery(this).parents('.blogroll.layout-grid');
					if($blog.length) {
						var $iso=$blog.find('section');
						args.after=function(){
							$iso.isotopeOm('reLayout');
						};
					}
					$items.omSlider(args);
	
				}
			});
		}
	}
	
	
	/*************************************/
	
	function sliced_gallery_init() {
		
		jQuery(window).bind('resize load', function(){
			sliced_gallery_resize();
		});
		sliced_gallery_resize();
		
	}
	
	function sliced_gallery_resize(){
		
		$('.gallery-sliced').each(function(){
			var $cont=$(this);
			var w=$cont.width();
			
			var mar=Math.floor(w*0.01);

			//2
			var $box=$cont.find('.gallery-sliced-box-2');
			if($box.length) {
				var h1=Math.floor(w*0.66*0.66579634464751958224543080939948);
				$box.find('.img-1, .img-2').css('height',h1+'px');
			}
			
			//3
			var $box=$cont.find('.gallery-sliced-box-3');
			if($box.length) {
				$box.find('.img-2').css('margin-bottom',mar+'px');
				var h2=Math.floor(w*0.33*0.65274151436031331592689295039164);
				var h1 = h2*2+mar;
				$box.find('.img-1').css('height',h1+'px');
				$box.find('.img-2, .img-3').css('height',h2+'px');
			}
						
			//4
			var $box=$cont.find('.gallery-sliced-box-4');
			if($box.length) {
				$box.find('.img-2, .img-3').css('margin-bottom',mar+'px');
				var h2=Math.floor(w*0.33*0.56396866840731070496083550913838);
				var h1 = h2*3+mar*2;
				$box.find('.img-1').css('height',h1+'px');
				$box.find('.img-2, .img-3, .img-4').css('height',h2+'px');
			}
			
			//5
			var $box=$cont.find('.gallery-sliced-box-5');
			if($box.length) {
				var h1 = Math.floor(w*0.3266*0.6649076517150);
				var h2 = Math.floor(w*0.495*0.66550522648083);
				$box.find('.img-1, .img-2, .img-3').css('height',h1+'px');
				$box.find('.img-4, .img-5').css('height',h2+'px');
			}
		});
		
	}
	
	/******************************/
	
	function lazyload_init() {
		if(jQuery().lazyload) {
			
			$('.omsc-animation .lazyload').each(function(){
				var original=$(this).data('original');
				if(original) {
					$(this).removeClass('lazyload');
					$(this).attr('src',$(this).data('original'));
				}
			});
			
			var args={
				effect : "fadeIn",
				failure_limit: 1000,
				threshold : 200,
				placeholder : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII=",
				skip_invisible : false
			};
			
			var $lazyload=$("img.lazyload");
			$lazyload.filter('.lazyload-hidden').lazyload(args);
			args.skip_invisible = true;
			$lazyload.not('.lazyload-hidden').lazyload(args);
			
			if(jQuery.waypoints) {
				$lazyload.load(function(){
					jQuery.waypoints('refresh');
				});
			}
			
		}
	}
	
	/******************************/
	
	function masonry_gallery_init() {

		if(jQuery().isotopeOm) {
			$('.gallery-masonry').each(function() {
				
				var $container=$(this).find('.items');
				
		    var args={ 
			    itemSelector: '.item',
			    animationEngine: 'best-available',
			    layoutMode: 'masonry',
			    resizable: true
			  };
			  
				$container.isotopeOm(args);
				
				$container.find('img').load(function(){
					$container.isotopeOm('reLayout');
				});
				
				$(window).smartresize(function(){
				  $container.isotopeOm('reLayout');
				});
	
	    });
		}
	}
	
	/********************************/
	
	function responsive_embed_init() {
		$('.responsive-embed').each(function(){
			var $obj=$(this).children(':first');
			if($obj.length) {
				var w=parseInt($obj.attr('width'));
				var h=parseInt($obj.attr('height'));
				if(!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
					var r=h/w;
					$(this).css('padding-bottom',(r*100)+'%');
				}
			}
		});
	}
	
	/*********************************/
	
	function blog_grid_init() {
		if(jQuery().isotopeOm) {
			$('.blogroll.layout-grid').each(function() {
				
				var $container=$(this).find('section');
				
		    var args={ 
			    itemSelector: '.post',
			    animationEngine: 'best-available',
			    layoutMode: 'masonry',
			    resizable: true
			  };
  
				$container.isotopeOm(args);
				
				$container.find('img').load(function(){
					$container.isotopeOm('reLayout');
				});
				
				$(window).smartresize(function(){
				  $container.isotopeOm('reLayout');
				});
	
	    });
		}
	}
	
	/*********************************/
	
	function video_bg_container_init() {
		
		function video_bg_container_fit($obj) {

			var $tmp;
			if($obj)
				$tmp=$obj;
			else
				$tmp=$('.om-video-bg-container');
			$tmp.each(function(){
				
				var $video=$(this).find('video');
				if($video.length) {
					var w = $(this).width();
					var h = $(this).height();

					var r = w/h;
					var vr = $video.data('wh-ratio');
	
					if (r < vr) {
						$video
							.width(h*vr)
							.height(h);
						$video
							.css('top',0)
							.css('left',-(h*vr-w)/2)
							.css('height',h);
	
					} else {
						$video
							.width(w)
							.height(w/vr);
						$video
							.css('top',-(w/vr-h)/2)
							.css('left',0)
							.css('height',w/vr);
					}
				}
				
			});
			
		}
		
		
		$('.om-video-bg-container').each(function(){
			
			var $container=$(this);
			var $video=$container.find('video');
			if($video.length) {
				
				$video.get(0).volume=0;
				
				$video.data('wh-ratio', 16/9 );

				$video.on('loadedmetadata', function(data) {

					var videoWidth =0;
					var videoHeight=0;
					
					if(this.hasOwnProperty('videoWidth'))
						videoWidth=this.videoWidth;
					if(this.hasOwnProperty('videoHeight'))
						videoHeight=this.videoHeight;

					if(videoWidth && videoHeight) {
						var ratio = videoWidth / videoHeight;
						$video.data('wh-ratio', ratio);
					}
					
					video_bg_container_fit($container);
					
				});

			}
			
		});
		
		
		$(window).bind('resize load', function(){
			var timer=$(this).data('video_bg_container_fit_timer');
			if(timer)	{
				clearTimeout(timer);
				timer=false;
			}
			
			timer=setTimeout(video_bg_container_fit, 200);
			$(this).data('video_bg_container_fit_timer', timer);
		});
		
	}
	
	/*******************************/
	
	function waypoints_init() {

		if(!jQuery('html').hasClass('touch')) {
			if(jQuery.waypoints) {
				var $obj=$('.omsc-animation').each(function(){
					var delay=$(this).data('animation-delay');
					$(this).waypoint(function(){
						if(delay) {
							var $this=$(this);
							setTimeout(function(){
								$this.addClass('omsc-animation-start');
							}, delay);
						} else {
							$(this).addClass('omsc-animation-start');
						}
					},{
						offset: '80%',
						triggerOnce: true
					});
				});
			}
		} else {
			$('.omsc-animation').removeClass('omsc-animation');
		}
	}
	
	/*******************************/
	
	function portfolio_init() {

		var $container=$('.ompf-portfolio.ompf-preview-layout-full-hover');
		if($container.length) {
			var $nodes  = $container.find('.ompf-portfolio-thumb > a');

			var getDirection = function (ev, obj) {
				var offset=$(obj).offset();
				var width=$(obj).width();
				var height=$(obj).height();
				var darr=[
					Math.abs(ev.pageY - offset.top),
					Math.abs(ev.pageX - offset.left - width),
					Math.abs(ev.pageY - offset.top - height),
					Math.abs(ev.pageX - offset.left)
				];
				var d=darr.indexOf(Math.min.apply(Math, darr));

		    return d;
			};
			
			var addClass = function ( ev, obj, state ) {
			    var direction = getDirection( ev, obj ),
			        class_suffix = "";
			    
			    obj.className = "";
			    
			    switch ( direction ) {
			        case 0 : class_suffix = '-top';    break;
			        case 1 : class_suffix = '-right';  break;
			        case 2 : class_suffix = '-bottom'; break;
			        case 3 : class_suffix = '-left';   break;
			    }
			    
			    obj.classList.add( state + class_suffix );
			};
			
			$nodes.each(function () {
				$(this).mouseenter( function (ev) {
					addClass( ev, this, 'in' );
				});
				
				$(this).mouseleave( function (ev) {
					addClass( ev, this, 'out' );
				});
			});		
		}

	}
	
	/*******************************/
	
	function testimonials_init() 	{
		jQuery('.testimonials-slider').each(function(){
			
			var $items=jQuery(this).find('.items');
			if($items.find('.item').length > 1) {
	
				var args={
					speed: 200,
					next: jQuery(this).find('.testimonials-controls .next'),
					prev: jQuery(this).find('.testimonials-controls .prev'),
					fadePrev: true
				};
				if(jQuery(this).data('timeout') > 0)
					args.timeout = jQuery(this).data('timeout');
				if(jQuery(this).data('pause') == 1)
					args.pause = 1;
	
				$items.omSlider(args);
			
			} else {
				jQuery(this).find('.testimonials-controls').remove();
			}
			
		});
	}
	
});

/***********************************/

function lightbox_init(args_)
{
	var args={
		deeplinking: false,
		overlay_gallery: false
	};
	if(args_)
		jQuery.extend(args, args_);
	
	//prettyPhoto
	if(jQuery().prettyPhoto) {
		jQuery('a[rel^=prettyPhoto]').addClass('pp_worked_up').prettyPhoto(args);
		jQuery('a[data-rel^=prettyPhoto]').addClass('pp_worked_up').prettyPhoto(jQuery.extend(args, {hook: 'data-rel'}));
		var $tmp=jQuery('a').filter(function(){ return /\.(jpe?g|png|gif|bmp)$/i.test(jQuery(this).attr('href')); }).not('.pp_worked_up');
		$tmp.each(function(){
			if(typeof(jQuery(this).attr('title')) == 'undefined')
				jQuery(this).attr('title',''); 
		});
		$tmp.prettyPhoto(args); 
	}
}

/***********************************/

function sidebar_slide_init() {
	var $sidebar=jQuery('.content-column-sidebar');
	var $content=jQuery('.content-column-content');
	var menu_fixed=jQuery('body').hasClass('menu-position-top_fixed');
	var admin_bar=jQuery('body').hasClass('admin-bar');
	if(menu_fixed)
		var $top_area=jQuery('.menu-sticky-node');
	var move_delay=1200;
	if($sidebar.data('move-delay') || $sidebar.data('move-delay') == '0') {
		var tmp=parseInt($sidebar.data('move-delay'));
		if(!isNaN(tmp))
			move_delay=tmp;
	}
		
	if($sidebar.length) {

		$sidebar.mouseenter(function(){
			/*
			if($sidebar.is(':animated'))
				$sidebar.stop(true).fadeTo(300,1);
			*/
			$sidebar.addClass('hovered');
		}).mouseleave(function(){
			$sidebar.removeClass('hovered');
		});			

		var sidebar_timer=false;
		var ie8=jQuery.browser.msie && (jQuery.browser.version == 8);
		
		jQuery(window).scroll(function(){
			
			if(sidebar_timer)
				clearTimeout(sidebar_timer);				

			if(jQuery(window).data('mobile-view')) {
				$sidebar.stop(true).css({marginTop: 0, opacity: 1});
				return;
			}

			sidebar_timer=setTimeout(function(){
				//if($sidebar.hasClass('hovered'))
				//	return false;

				$sidebar.stop(true);
				
				var ch=$content.height();
				var ws=jQuery(window).scrollTop();
				var wh=jQuery(window).height();
				var top=$sidebar.offset();
		
				var sidebarh=$sidebar.height();
				if(ch > sidebarh)
				{
					var cur_mar=parseInt($sidebar.css('margin-top'));
					var max=ch-sidebarh;
					var new_mar=cur_mar;
					var gap=0;
					if(admin_bar)
						gap+=32;
					if(menu_fixed && $top_area.hasClass('menu-stuck')) {
						gap+=$top_area.height();
					}
					
					if( top.top - ws - gap > 0 ) {
						new_mar=ws-(top.top-cur_mar) + gap;
							
						if(new_mar > max)
							new_mar = max;
						if(new_mar < 0)
							new_mar = 0;
					} else if( top.top + sidebarh - ws - gap < wh ) {
						if(sidebarh < wh) {
							new_mar=ws-(top.top-cur_mar) + gap;
						}	else {
							new_mar=ws-(top.top-cur_mar) - (sidebarh - wh);
						}
						if(new_mar > max)
							new_mar = max;
						if(new_mar < 0)
							new_mar = 0;
					}

					if(new_mar != cur_mar) {
						$sidebar.fadeTo(600,0.2).fadeTo(400,1);
						$sidebar.animate({marginTop: new_mar+'px'}, {
							duration: 1000,
							easing: 'easeInOutExpo',
							queue: false
						});
					} else {
						$sidebar.fadeTo(400,1);
					}
				}
				
				
			}, move_delay);
							
		});
	}
}