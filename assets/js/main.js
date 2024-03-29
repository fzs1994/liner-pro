$(function ($) {
  'use strict';

  // Smooth Parallax Effect for background image
  $(document).on('scroll', function () {
    const $movebg = $(window).scrollTop() * -0.3;
    $('.background-image').css('background-positionY', $movebg + 'px');
  });

  // Responsive Background Hero Video
  scaleVideoContainer();

  initBannerVideoSize('.video-container .poster img');
  initBannerVideoSize('.video-container .filter');
  initBannerVideoSize('.video-container video');

  $(window).on('resize', function () {
    scaleVideoContainer();
    scaleBannerVideoSize('.video-container .poster img');
    scaleBannerVideoSize('.video-container .filter');
    scaleBannerVideoSize('.video-container video');
  });

  // Smooth Scroll on navigation link clicks
  $(document).on('click', '.nav-link', function (event) {
    event.preventDefault();

    $('html, body').animate(
      {
        scrollTop: $($.attr(this, 'href')).offset().top
      },
      500
    );
  });

  // Scroll To Top
  // browser window scroll (in pixels) after which the "back to top" link is shown
  const offset = 300,
    //browser window scroll (in pixels) after which the "back to top" link opacity is reduced
    offset_opacity = 1200,
    //duration of the top scrolling animation (in ms)
    scroll_top_duration = 700,
    //grab the "back to top" link
    $back_to_top = $('.cd-top');

  //hide or show the "back to top" link
  $(window).on('scroll', function () {
    $(this).scrollTop() > offset ? $back_to_top.addClass('cd-is-visible') : $back_to_top.removeClass('cd-is-visible cd-fade-out');
    if ($(this).scrollTop() > offset_opacity) {
      $back_to_top.addClass('cd-fade-out');
    }
  });

  //smooth scroll to top
  $back_to_top.on('click', function (event) {
    event.preventDefault();
    $('body,html').animate(
      {
        scrollTop: 0
      },
      scroll_top_duration
    );
  });

  // Close collapse navbar in small device when any link is clicked
  $(document).on('click', '.navbar-collapse.in', function (e) {
    if ($(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle') {
      $(this).collapse('hide');
    }
  });

  // Stop youtube video on modal close

  // If YouTube Video
  $('.corporateVideo').on('hide.bs.modal', function (e) {
    const $if = $(e.delegateTarget).find('iframe');
    const src = $if.attr('src');
    $if.attr('src', '/empty.html');
    $if.attr('src', src);
  });

  // If local video file
  $('.corporateVideo').on('hide.bs.modal', function (e) {
    $(this).find('video')[0]?.pause();
  });

  // Send contact form email. Change your email in mail.php
  $('#contact').on('submit', function (e) {
    e.preventDefault();

    $('#submit').attr('disabled', true);

    const $action = $(this).prop('action');
    const $data = $(this).serialize();
    const $this = $(this);

    $this.prevAll('.alert').remove();

    $.post(
      $action,
      $data,
      function (data) {
        if (data.response == 'error') {
          $this.before(
            '<div class="alert alert-danger alert-dismissable"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' +
              data.message +
              '</div>'
          );
          $('#submit').attr('disabled', false);
        }

        if (data.response == 'success') {
          $this.before(
            '<div class="alert alert-success alert-dismissable"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' +
              data.message +
              '</div>'
          );
          $this.find('input, textarea').val('');
          $('#submit').attr('disabled', false);
        }
      },
      'json'
    );
  });
});

// For responsive hero background video
function scaleVideoContainer() {
  const height = $(window).height() + 5;
  const unitHeight = parseInt(height) + 'px';
  $('.homepage-hero-module').css('height', unitHeight);
}

function initBannerVideoSize(element) {
  $(element).each(function () {
    $(this).data('height', $(this).height());
    $(this).data('width', $(this).width());
  });

  scaleBannerVideoSize(element);
}

function scaleBannerVideoSize(element) {
  let windowWidth = $(window).width(),
    windowHeight = $(window).height() + 5,
    videoWidth,
    videoHeight;

  $(element).each(function () {
    const videoAspectRatio = $(this).data('height') / $(this).data('width');

    $(this).width(windowWidth);

    if (windowWidth < 1620) {
      videoHeight = windowHeight;
      videoWidth = videoHeight / videoAspectRatio;
      $(this).css({ 'margin-top': 0, 'margin-left': -(videoWidth - windowWidth) / 2 + 'px' });

      $(this).width(videoWidth).height(videoHeight);
    }

    $('.homepage-hero-module .video-container video').addClass('fadeIn animated');
  });
}

/**
 * Transparent navbar on hero section. Listen to scroll to change header opacity class
 */
function checkScroll() {
  var startY = $('.navbar').height() * 2; //The point where the navbar changes in px

  if ($(window).scrollTop() > startY) {
    $('.navbar').addClass('scrolled');
  } else {
    $('.navbar').removeClass('scrolled');
  }
}

if ($('.navbar').length > 0) {
  $(window).on('scroll load resize', function () {
    checkScroll();
  });
}
