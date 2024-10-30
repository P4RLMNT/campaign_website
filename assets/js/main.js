(function($) {
	let gardenSlideIndex = 0;
	let petsSlideIndex = 0;
	let gardenInterval;
	let petsInterval;
	const SLIDE_INTERVAL = 5000; // 10 seconds

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		$main_articles = $main.children('article');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
			loadSlideshow('garden');
			loadSlideshow('pets');
		});

	// Add these functions
	function loadSlideshow(type) {
		console.log(`Loading slideshow for ${type}`);
		
		// Define image paths
		const images = {
			garden: [
				'/images/garden/20230904_193106.jpg',
				'/images/garden/20240430_181358.jpg',
				'/images/garden/20240501_131108.jpg',
				'/images/garden/20240501_131118.jpg',
				'/images/garden/20240524_183634.jpg',
				'/images/garden/20240524_183642.jpg',
				'/images/garden/20240524_183655.jpg',
				'/images/garden/20240614_121335.jpg',
				'/images/garden/20240614_121355.jpg',
				'/images/garden/20240802_205622.jpg',
				'/images/garden/20240802_205631.jpg',
				'/images/garden/20240802_205641.jpg',
				'/images/garden/20240802_205711.jpg',
				'/images/garden/20240806_203515.jpg',
				'/images/garden/Resized_Snapchat-7660473861.jpg'
			],
			pets: [
				'/images/pets/20221022_115416.jpg',
				'/images/pets/20230304_154904.jpg',
				'/images/pets/20230328_210719_001.jpg',
				'/images/pets/20230328_210843.jpg',
				'/images/pets/20230328_210853.jpg',
				'/images/pets/20230531_212124.jpg',
				'/images/pets/20230728_172911.jpg',
				'/images/pets/20230728_172933.jpg',
				'/images/pets/20240430_181358.jpg',
				'/images/pets/20240607_181713.jpg',
				'/images/pets/received_215722904498584.jpg',
				'/images/pets/received_695443248940525.jpg',
				'/images/pets/received_1265326614065229.jpg',
				'/images/pets/received_1437822390351601.jpg',
				'/images/pets/received_1507461939737981.jpg',
				'/images/pets/received_2661513223989501.jpg',
				'/images/pets/Screenshot_20240918_025716_Messenger.jpg'
			]
		};
		
		const container = document.querySelector(`.${type}-slideshow .slides-container`);
		console.log(`Container found:`, container);
		
		if (!container) {
			console.error(`Could not find container for ${type} slideshow`);
			return;
		}
		
		container.innerHTML = ''; // Clear existing slides
		
		images[type].forEach((imagePath, index) => {
			const slide = document.createElement('div');
			slide.className = 'slides fade';
			slide.innerHTML = `<img src="${imagePath}" alt="${type} Image ${index + 1}">`;
			container.appendChild(slide);
			console.log(`Added slide ${index + 1} to ${type} slideshow`);
		});
		
		showSlides(0, type); // Show first slide
		startAutoSlide(type);
	}

	function startAutoSlide(type) {
		// Clear existing interval if any
		if (type === 'garden') {
			clearInterval(gardenInterval);
			gardenInterval = setInterval(() => changeSlide(1, 'garden'), SLIDE_INTERVAL);
		} else {
			clearInterval(petsInterval);
			petsInterval = setInterval(() => changeSlide(1, 'pets'), SLIDE_INTERVAL);
		}
	}

	function changeSlide(n, type) {
		// Reset the auto-slide timer when manually changing slides
		startAutoSlide(type);
		
		if (type === 'garden') {
			showSlides(gardenSlideIndex += n, type);
		} else {
			showSlides(petsSlideIndex += n, type);
		}
	}

	function showSlides(n, type) {
		const slides = document.querySelector(`.${type}-slideshow .slides-container`).getElementsByClassName("slides");
		if (!slides.length) return;
		
		if (type === 'garden') {
			if (n >= slides.length) gardenSlideIndex = 0;
			if (n < 0) gardenSlideIndex = slides.length - 1;
			n = gardenSlideIndex;
		} else {
			if (n >= slides.length) petsSlideIndex = 0;
			if (n < 0) petsSlideIndex = slides.length - 1;
			n = petsSlideIndex;
		}
		
		// Hide all slides
		for (let i = 0; i < slides.length; i++) {
			slides[i].style.display = "none";
		}
		
		// Show current slide
		slides[n].style.display = "block";
	}

	// Initialize slideshows when the about section is shown
	$main_articles.filter('#about').on('click', function() {
		console.log('About section clicked');
		setTimeout(() => {
			console.log('Loading slideshows...');
			loadSlideshow('garden');
			loadSlideshow('pets');
		}, 500);
	});

	// Clean up intervals when leaving the about section
	$main._hide = (function(original) {
		return function() {
			clearInterval(gardenInterval);
			clearInterval(petsInterval);
			return original.apply(this, arguments);
		};
	})($main._hide);	

	// Fix: Flexbox min-height bug on IE.
		if (browser.name == 'ie') {

			var flexboxFixTimeoutId;

			$window.on('resize.flexbox-fix', function() {

				clearTimeout(flexboxFixTimeoutId);

				flexboxFixTimeoutId = setTimeout(function() {

					if ($wrapper.prop('scrollHeight') > $window.height())
						$wrapper.css('height', 'auto');
					else
						$wrapper.css('height', '100vh');

				}, 250);

			}).triggerHandler('resize.flexbox-fix');

		}

	// Nav.
		var $nav = $header.children('nav'),
			$nav_li = $nav.find('li');

		// Add "middle" alignment classes if we're dealing with an even number of items.
			if ($nav_li.length % 2 == 0) {

				$nav.addClass('use-middle');
				$nav_li.eq( ($nav_li.length / 2) ).addClass('is-middle');

			}

	// Main.
		var	delay = 325,
			locked = false;

		// Methods.
			$main._show = function(id, initial) {

				var $article = $main_articles.filter('#' + id);

				// No such article? Bail.
					if ($article.length == 0)
						return;

				// Handle lock.

					// Already locked? Speed through "show" steps w/o delays.
						if (locked || (typeof initial != 'undefined' && initial === true)) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Mark as visible.
								$body.addClass('is-article-visible');

							// Deactivate all articles (just in case one's already active).
								$main_articles.removeClass('active');

							// Hide header, footer.
								$header.hide();
								$footer.hide();

							// Show main, article.
								$main.show();
								$article.show();

							// Activate article.
								$article.addClass('active');

							// Unlock.
								locked = false;

							// Unmark as switching.
								setTimeout(function() {
									$body.removeClass('is-switching');
								}, (initial ? 1000 : 0));

							return;

						}

					// Lock.
						locked = true;

				// Article already visible? Just swap articles.
					if ($body.hasClass('is-article-visible')) {

						// Deactivate current article.
							var $currentArticle = $main_articles.filter('.active');

							$currentArticle.removeClass('active');

						// Show article.
							setTimeout(function() {

								// Hide current article.
									$currentArticle.hide();

								// Show article.
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

				// Otherwise, handle as normal.
					else {

						// Mark as visible.
							$body
								.addClass('is-article-visible');

						// Show article.
							setTimeout(function() {

								// Hide header, footer.
									$header.hide();
									$footer.hide();

								// Show main, article.
									$main.show();
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

			};

			$main._hide = function(addState) {

				var $article = $main_articles.filter('.active');

				// Article not visible? Bail.
					if (!$body.hasClass('is-article-visible'))
						return;

				// Add state?
					if (typeof addState != 'undefined'
					&&	addState === true)
						history.pushState(null, null, '#');

				// Handle lock.

					// Already locked? Speed through "hide" steps w/o delays.
						if (locked) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Deactivate article.
								$article.removeClass('active');

							// Hide article, main.
								$article.hide();
								$main.hide();

							// Show footer, header.
								$footer.show();
								$header.show();

							// Unmark as visible.
								$body.removeClass('is-article-visible');

							// Unlock.
								locked = false;

							// Unmark as switching.
								$body.removeClass('is-switching');

							// Window stuff.
								$window
									.scrollTop(0)
									.triggerHandler('resize.flexbox-fix');

							return;

						}

					// Lock.
						locked = true;

				// Deactivate article.
					$article.removeClass('active');

				// Hide article.
					setTimeout(function() {

						// Hide article, main.
							$article.hide();
							$main.hide();

						// Show footer, header.
							$footer.show();
							$header.show();

						// Unmark as visible.
							setTimeout(function() {

								$body.removeClass('is-article-visible');

								// Window stuff.
									$window
										.scrollTop(0)
										.triggerHandler('resize.flexbox-fix');

								// Unlock.
									setTimeout(function() {
										locked = false;
									}, delay);

							}, 25);

					}, delay);


			};

		// Articles.
			$main_articles.each(function() {

				var $this = $(this);

				// Close.
					$('<div class="close">Close</div>')
						.appendTo($this)
						.on('click', function() {
							location.hash = '';
						});

				// Prevent clicks from inside article from bubbling.
					$this.on('click', function(event) {
						event.stopPropagation();
					});

			});

		// Events.
			$body.on('click', function(event) {

				// Article visible? Hide.
					if ($body.hasClass('is-article-visible'))
						$main._hide(true);

			});

			$window.on('keyup', function(event) {

				switch (event.keyCode) {

					case 27:

						// Article visible? Hide.
							if ($body.hasClass('is-article-visible'))
								$main._hide(true);

						break;

					default:
						break;

				}

			});

			$window.on('hashchange', function(event) {

				// Empty hash?
					if (location.hash == ''
					||	location.hash == '#') {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Hide.
							$main._hide();

					}

				// Otherwise, check for a matching article.
					else if ($main_articles.filter(location.hash).length > 0) {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Show article.
							$main._show(location.hash.substr(1));

					}

			});

		// Scroll restoration.
		// This prevents the page from scrolling back to the top on a hashchange.
			if ('scrollRestoration' in history)
				history.scrollRestoration = 'manual';
			else {

				var	oldScrollPos = 0,
					scrollPos = 0,
					$htmlbody = $('html,body');

				$window
					.on('scroll', function() {

						oldScrollPos = scrollPos;
						scrollPos = $htmlbody.scrollTop();

					})
					.on('hashchange', function() {
						$window.scrollTop(oldScrollPos);
					});

			}

		// Initialize.

			// Hide main, articles.
				$main.hide();
				$main_articles.hide();

			// Initial article.
				if (location.hash != ''
				&&	location.hash != '#')
					$window.on('load', function() {
						$main._show(location.hash.substr(1), true);
					});

		

})(jQuery);