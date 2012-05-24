require 'ti.viewshadow'

createCoverSlider = (args) ->
	[left, cover, right] = [args.left, args.cover, args.right]

	# parameters
	ledge = cover.width * 0.8
	threshold = cover.width * 0.2 # detect swiped or not
	half = 
		width:cover.width / 2
		height:cover.height / 2
	duration = 
		slide:200 
		swipe:150
		bounce:100
		change_out:120
		change_in:300
	bounce = 8
	shadow =
		shadowRadius:2
		shadowOpacity:0.6
		shadowOffset:
			x:4
			y:0
		shadowColor:'black'

	# initialize views z-index
	[left.zIndex, cover.zIndex, right.zIndex] = [-1, 0, -2]

	current = 'cover'
	sliding = { center:0, offset:0 }

	onCurrentChanged = ->
		if current is 'left'
			shadow.shadowOffset.x = -4
			left.zIndex = -1
			right.zIndex = -2
		else if current is 'right'
			shadow.shadowOffset.x = 4
			left.zIndex = -2
			right.zIndex = -1

		cover.setShadow shadow

	slideCover = (position) ->
		delta_xs = 
			left:ledge
			cover:0
			right:-ledge

		cover.animate
			center:
				x:delta_xs[position] + half.width
				y:half.height
			duration:duration.slide

		current = position
		onCurrentChanged()

	coverTouchstart = (e) ->
		sliding.offset = e.x - half.width
		sliding.center = cover.animatedCenter.x

	coverTouchmove = (e) ->
		delta_x = (e.x - half.width) - sliding.offset + cover.animatedCenter.x 
		delta_x -= half.width # center origin
		
		if (delta_x < 0 and not right) or (delta_x > 0 and not left)
			return

		if Math.abs(delta_x) > ledge
			return

		if delta_x < 0 and current isnt 'right'
			current = 'right'
			onCurrentChanged()
		else if delta_x > 0 and current isnt 'left'
			current = 'left'
			onCurrentChanged()
		else if delta_x is 0 and current isnt 'cover'
			current = 'cover'
			onCurrentChanged()

		cover.animate
			center:
				x:delta_x + half.width
				y:half.height
			duration:1

	coverTouchend = (e) ->
		return if e.source isnt cover

		delta_x = (e.x - half.width) - sliding.offset + cover.animatedCenter.x 
		delta_x -= half.width # center-origin

		if (delta_x < 0 and not right) or (delta_x > 0 and not left)
			return

		if Math.abs(delta_x) > ledge
			return

		if Math.abs(sliding.center - cover.animatedCenter.x) > threshold
			# swiped left
			if sliding.center - cover.animatedCenter.x > 0
				if delta_x < 0
					delta_x = -ledge
					current = 'right'
				else
					delta_x = 0
					current = 'cover'
				bounce_ = -bounce
			# swiped right
			else
				if delta_x > 0
					delta_x = ledge
					current = 'left'
				else
					delta_x = 0
					current = 'cover'
				bounce_ = bounce

			animate_swipe =
				center:
					x:delta_x + half.width + bounce_
					y:half.height
				duration:duration.swipe

			animate_bounce =
				center:
					x:delta_x + half.width
					y:half.height
				duration:duration.bounce

			cover.animate animate_swipe, ->
				cover.animate animate_bounce
		else
			delta_x = sliding.center - half.width
			if delta_x is 0
				current = 'cover'
			else if delta_x > 0
				current = 'left'
			else if delta_x < 0
				current = 'right'
			cover.animate
				center:
					x:delta_x + half.width
					y:half.height
				duration:duration.swipe
		onCurrentChanged()

	changeCover = (newCover) ->
 		# center-view can be changed only swiped
		return if current is 'cover'

		if current is 'left'
			delta_x = half.width * 2
		else
			delta_x	= -half.width * 2

		unless cover is newCover
			newCover.hide()
			newCover.center =
				x:delta_x + half.width
				y:half.height
			newCover.setShadow shadow

		animate_out =
			center:
				x:delta_x + half.width
				y:half.height
			duration:duration.change_out

		animate_in = 
			center:
				x:0 + half.width
				y:half.height
			duration:duration.change_in

		cover.animate animate_out, ->
			cover.removeEventListener 'touchstart', coverTouchstart
			cover.removeEventListener 'touchmove', coverTouchmove
			cover.removeEventListener 'touchend', coverTouchend
			cover.hide()
			cover = newCover
			current = 'cover'
			cover.show()
			cover.addEventListener 'touchstart', coverTouchstart
			cover.addEventListener 'touchmove', coverTouchmove
			cover.addEventListener 'touchend', coverTouchend
			cover.animate animate_in

	cover.addEventListener 'touchstart', coverTouchstart
	cover.addEventListener 'touchmove', coverTouchmove
	cover.addEventListener 'touchend', coverTouchend

	coverSlider =
		current: -> 
			current
		changeCover:changeCover
		slideCover:slideCover

exports.createCoverSlider = createCoverSlider
