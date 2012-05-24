var createCoverSlider;
require('ti.viewshadow');
createCoverSlider = function(args) {
  var bounce, changeCover, cover, coverSlider, coverTouchend, coverTouchmove, coverTouchstart, current, duration, half, ledge, left, onCurrentChanged, right, shadow, slideCover, sliding, threshold, _ref, _ref2;
  _ref = [args.left, args.cover, args.right], left = _ref[0], cover = _ref[1], right = _ref[2];
  ledge = cover.width * 0.8;
  threshold = cover.width * 0.2;
  half = {
    width: cover.width / 2,
    height: cover.height / 2
  };
  duration = {
    slide: 200,
    swipe: 150,
    bounce: 100,
    change_out: 120,
    change_in: 300
  };
  bounce = 8;
  shadow = {
    shadowRadius: 2,
    shadowOpacity: 0.6,
    shadowOffset: {
      x: 4,
      y: 0
    },
    shadowColor: 'black'
  };
  _ref2 = [-1, 0, -2], left.zIndex = _ref2[0], cover.zIndex = _ref2[1], right.zIndex = _ref2[2];
  current = 'cover';
  sliding = {
    center: 0,
    offset: 0
  };
  onCurrentChanged = function() {
    if (current === 'left') {
      shadow.shadowOffset.x = -4;
      left.zIndex = -1;
      right.zIndex = -2;
    } else if (current === 'right') {
      shadow.shadowOffset.x = 4;
      left.zIndex = -2;
      right.zIndex = -1;
    }
    return cover.setShadow(shadow);
  };
  slideCover = function(position) {
    var delta_xs;
    delta_xs = {
      left: ledge,
      cover: 0,
      right: -ledge
    };
    cover.animate({
      center: {
        x: delta_xs[position] + half.width,
        y: half.height
      },
      duration: duration.slide
    });
    current = position;
    return onCurrentChanged();
  };
  coverTouchstart = function(e) {
    sliding.offset = e.x - half.width;
    return sliding.center = cover.animatedCenter.x;
  };
  coverTouchmove = function(e) {
    var delta_x;
    delta_x = (e.x - half.width) - sliding.offset + cover.animatedCenter.x;
    delta_x -= half.width;
    if ((delta_x < 0 && !right) || (delta_x > 0 && !left)) {
      return;
    }
    if (Math.abs(delta_x) > ledge) {
      return;
    }
    if (delta_x < 0 && current !== 'right') {
      current = 'right';
      onCurrentChanged();
    } else if (delta_x > 0 && current !== 'left') {
      current = 'left';
      onCurrentChanged();
    } else if (delta_x === 0 && current !== 'cover') {
      current = 'cover';
      onCurrentChanged();
    }
    return cover.animate({
      center: {
        x: delta_x + half.width,
        y: half.height
      },
      duration: 1
    });
  };
  coverTouchend = function(e) {
    var animate_bounce, animate_swipe, bounce_, delta_x;
    if (e.source !== cover) {
      return;
    }
    delta_x = (e.x - half.width) - sliding.offset + cover.animatedCenter.x;
    delta_x -= half.width;
    if ((delta_x < 0 && !right) || (delta_x > 0 && !left)) {
      return;
    }
    if (Math.abs(delta_x) > ledge) {
      return;
    }
    if (Math.abs(sliding.center - cover.animatedCenter.x) > threshold) {
      if (sliding.center - cover.animatedCenter.x > 0) {
        if (delta_x < 0) {
          delta_x = -ledge;
          current = 'right';
        } else {
          delta_x = 0;
          current = 'cover';
        }
        bounce_ = -bounce;
      } else {
        if (delta_x > 0) {
          delta_x = ledge;
          current = 'left';
        } else {
          delta_x = 0;
          current = 'cover';
        }
        bounce_ = bounce;
      }
      animate_swipe = {
        center: {
          x: delta_x + half.width + bounce_,
          y: half.height
        },
        duration: duration.swipe
      };
      animate_bounce = {
        center: {
          x: delta_x + half.width,
          y: half.height
        },
        duration: duration.bounce
      };
      cover.animate(animate_swipe, function() {
        return cover.animate(animate_bounce);
      });
    } else {
      delta_x = sliding.center - half.width;
      if (delta_x === 0) {
        current = 'cover';
      } else if (delta_x > 0) {
        current = 'left';
      } else if (delta_x < 0) {
        current = 'right';
      }
      cover.animate({
        center: {
          x: delta_x + half.width,
          y: half.height
        },
        duration: duration.swipe
      });
    }
    return onCurrentChanged();
  };
  changeCover = function(newCover) {
    var animate_in, animate_out, delta_x;
    if (current === 'cover') {
      return;
    }
    if (current === 'left') {
      delta_x = half.width * 2;
    } else {
      delta_x = -half.width * 2;
    }
    if (cover !== newCover) {
      newCover.hide();
      newCover.center = {
        x: delta_x + half.width,
        y: half.height
      };
      newCover.setShadow(shadow);
    }
    animate_out = {
      center: {
        x: delta_x + half.width,
        y: half.height
      },
      duration: duration.change_out
    };
    animate_in = {
      center: {
        x: 0 + half.width,
        y: half.height
      },
      duration: duration.change_in
    };
    return cover.animate(animate_out, function() {
      cover.removeEventListener('touchstart', coverTouchstart);
      cover.removeEventListener('touchmove', coverTouchmove);
      cover.removeEventListener('touchend', coverTouchend);
      cover.hide();
      cover = newCover;
      current = 'cover';
      cover.show();
      cover.addEventListener('touchstart', coverTouchstart);
      cover.addEventListener('touchmove', coverTouchmove);
      cover.addEventListener('touchend', coverTouchend);
      return cover.animate(animate_in);
    });
  };
  cover.addEventListener('touchstart', coverTouchstart);
  cover.addEventListener('touchmove', coverTouchmove);
  cover.addEventListener('touchend', coverTouchend);
  return coverSlider = {
    current: function() {
      return current;
    },
    changeCover: changeCover,
    slideCover: slideCover
  };
};
exports.createCoverSlider = createCoverSlider;