function init_menu() {
  const $menu_open = $('.js_menu_open'),
    $menu_close = $('.js_menu_close'),
    $main_nav = $('.main-nav');

  $menu_open.on('click', function (evt) {
    evt.preventDefault();

    if ($main_nav.is('.open')) {
      $main_nav.removeClass('open');
      // $('html').removeClass('modal-open');
    } else {
      $main_nav.addClass('open');
      // $('html').addClass('modal-open');
    }

    $main_nav.on('click', main_nav_click_handler);
  });

  $menu_close.on('click', function (evt) {
    evt.preventDefault();

    $main_nav.removeClass('open');
    // $('html').removeClass('modal-open');
    $main_nav.off('click', main_nav_click_handler);
  });

  function main_nav_click_handler(evt) {
    if (!$(evt.target).is('.main-nav__content') && !$(evt.target).closest('.main-nav__content').length) {
      $main_nav.removeClass('open');
      $('html').removeClass('modal-open');
      $main_nav.off('click', main_nav_click_handler);
    }
  }
}

function init_modals() {
  $.fn.modal = function (action) {
    return this.each(function () {
      var $modal = $(this);

      function show_modal() {
        $modal.fadeIn(0, function () {
          $modal.addClass('show');
        });
        $('body').addClass('modal_open'); // можно потом использовать для блокировки скролла
      }

      function hide_modal() {
        $modal.removeClass('show');
        setTimeout(function () {
          $modal.fadeOut(0);
          $('body').removeClass('modal_open');
        }, 300);
      }

      if (action === 'show') {
        show_modal();
      } else if (action === 'hide') {
        hide_modal();
      }

      // Поддержка кликов на кнопки и фон
      if (!$modal.data('modal_initialized')) {
        $modal.on('click', function (e) {
          if ($(e.target).is('.modal')) hide_modal();
        });
        $modal.on('click', '[data-dismiss="modal"]', hide_modal);
        $modal.data('modal_initialized', true);
      }
    });
  };

  $(document).on('click', '[data-dismiss="modal"]', function () {
    var $modal = $(this).closest('.modal');
    $modal.modal('hide');
  });

  // Открытие через data-атрибуты (bootstrap-стиль)
  $(document).on('click', '[data-toggle="modal"]', function (evt) {
    evt.preventDefault();
    var target = $(this).data('target');
    $(target).modal('show');
  });

  // Закрытие по Esc
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') {
      $('.modal.show').each(function () {
        $(this).modal('hide');
      });
    }
  });
}

function init_custom_select() {
  const $selects = $('.js_custom_select');

  if (!$selects.length) {
    return false;
  }

  $selects.each(function () {
    const $select = $(this);

    $select.hide();

    const $wrapper = $('<div class="custom-select"></div>'),
      $current = $('<div class="custom-select__current"></div>'),
      $list = $('<ul class="custom-select__list"></ul>');

    function toggle_placeholder(value) {
      $current.toggleClass('placeholder', value === '');
    }

    $select.find('option').each(function () {
      const $option = $(this),
        $item = $('<li class="custom-select__item"></li>');

      $item.text($option.text()).attr('data_value', $option.val());

      if ($option.is(':selected')) {
        $current.text($option.text());
        toggle_placeholder($option.val());
      }

      $list.append($item);
    });

    $wrapper.append($current).append($list);
    $select.before($wrapper);

    // открыть/закрыть
    $current.on('click', function () {
      $('.custom-select').not($wrapper).removeClass('open');
      $wrapper.toggleClass('open');
    });

    // выбор
    $list.on('click', '.custom-select__item', function () {
      const value = $(this).attr('data_value'),
        text = $(this).text();

      $current.text(text);
      toggle_placeholder(value);
      $wrapper.removeClass('open');

      $select.val(value).trigger('change');
    });

    // синхронизация если меняют оригинальный select
    $select.on('change', function () {
      const value = $select.val(),
        $item = $list.find('[data_value="' + value + '"]');

      if ($item.length) {
        $current.text($item.text());
      }

      toggle_placeholder(value);
    });

    // закрытие при клике вне
    $(document).on('click', function (e) {
      if (!$(e.target).closest('.custom-select').length) {
        $('.custom-select').removeClass('open');
      }
    });
  });
}

function init_form() {
  $('.js_phone_input').on('keydown', function (evt) {
    $(this).mask('+7 (000) 000-00-00');
  });
}

function init_cookie() {
  const $cookie = $('.js_cookie');

  if (!$cookie.length) {
    return false;
  }

  $cookie.find('.js_apply_cookie').on('click', function (evt) {
    evt.preventDefault();

    $cookie.remove();
  });
}

function init_sliders() {
  const $slider = $('.js_slider');

  if (!$slider.length) {
    return false;
  }

  const $slider_prev = $slider.find('.js_slider_prev'),
    $slider_next = $slider.find('.js_slider_next');

  var thumbs_slider = new Swiper($slider[0], {
    loop: true,
    slidesPerView: 1,
    effect: 'fade',
    speed: 750,
    fadeEffect: {
      crossFade: true,
    },
    navigation: {
      nextEl: $slider_next[0],
      prevEl: $slider_prev[0],
    },
  });
}

function init_accordion() {
  const $accordions = $('.js_accordion');

  if (!$accordions.length) {
    return false;
  }

  $accordions.each(function () {
    const $accordion = $(this);

    $accordion.on('click', '.js_accordion_toggle', function (e) {
      const $item = $(this).closest('.js_accordion_item'),
        $content = $item.find('.js_accordion_content');

      if ($(e.target).closest('.js_accordion_content').length) {
        return;
      }

      if ($item.hasClass('active')) {
        $item.removeClass('active');
        $content.slideUp(300);
      } else {
        $accordion.find('.js_accordion_item.active').removeClass('active').find('.js_accordion_content').slideUp(300);

        $item.addClass('active');
        $content.slideDown(300);
      }
    });
  });
}

function init_filter() {
  const $filter = $('.js_filter');

  if (!$filter.length) {
    return false;
  }

  const $toggle = $filter.find('.js_filter_toggle'),
    $current = $filter.find('.js_filter_current'),
    $list = $filter.find('.js_filter_list'),
    $links = $list.find('a');

  $toggle.on('click', function (evt) {
    evt.preventDefault();

    if ($filter.hasClass('open')) {
      close_filter();
    } else {
      open_filter();
    }
  });

  $links.on('click', function (evt) {
    evt.preventDefault();

    $links.removeClass('active');
    $(this).addClass('active');

    if ($(window).width() <= 768) {
      close_filter();
    }
  });

  function close_filter() {
    $filter.removeClass('open');
    $list.slideUp(300);
  }

  function open_filter() {
    $filter.addClass('open');
    $list.slideDown(300);
  }

  if ($(window).width() <= 768) {
    close_filter();
  }
}

function init_pricing() {
  const $pricing = $('.js_pricing');

  if (!$pricing.length) {
    return false;
  }

  const $schedule = $pricing.find('.js_pricing_schedule'),
  $amount = $pricing.find('.js_pricing_amount');

  $schedule.on('click', '.btn', function(evt) {
    evt.preventDefault();

    $schedule.hide();
    $amount.fadeIn(300).css('display', 'flex');
  })
}

$(document).ready(function () {
  init_menu();
  init_form();
  init_modals();
  init_custom_select();
  init_cookie();
  init_sliders();
  init_accordion();
  init_filter();
  init_pricing();
});
