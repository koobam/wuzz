package com.margelo.nitro.com.wuzz.shimmer

import android.animation.ValueAnimator
import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.LinearGradient
import android.graphics.Matrix
import android.graphics.Outline
import android.graphics.Paint
import android.graphics.RectF
import android.graphics.Shader
import android.graphics.drawable.GradientDrawable
import android.view.View
import android.view.ViewOutlineProvider
import android.view.animation.LinearInterpolator

class HybridShimmerView(context: Context) : HybridShimmerViewSpec() {

  private val shimmerView = ShimmerSurfaceView(context)

  override val view: View
    get() = shimmerView

  override var duration: Double = 1800.0
    set(value) {
      field = value
      shimmerView.duration = value
    }

  override var borderRadius: Double = 0.0
    set(value) {
      field = value
      shimmerView.borderRadius = value
    }

  override var shimmerColor: String = "#E0E0E0"
    set(value) {
      field = value
      shimmerView.shimmerColor = value
    }

  override var highlightOpacity: Double = 0.7
    set(value) {
      field = value
      shimmerView.highlightOpacity = value
    }

  private class ShimmerSurfaceView(context: Context) : View(context) {

    private val paint = Paint(Paint.ANTI_ALIAS_FLAG)
    private val matrix = Matrix()
    private val drawRect = RectF()

    private var gradient: LinearGradient? = null
    private var offset = 0f

    private val backgroundDrawable = GradientDrawable()

    var duration: Double = 1800.0
      set(value) {
        field = value
        restartAnimation()
      }

    var borderRadius: Double = 0.0
      set(value) {
        field = value

        val radius = dp(value.toFloat())

        backgroundDrawable.cornerRadius = radius

        invalidateOutline()
        invalidate()
      }

    var shimmerColor: String = "#E0E0E0"
      set(value) {
        field = value
        try {
          backgroundDrawable.setColor(Color.parseColor(value))
        } catch (_: Exception) {
        }
        invalidate()
      }

    var highlightOpacity: Double = 0.7
      set(value) {
        field = value
        buildGradient()
        invalidate()
      }

    private val shimmerWidthPx: Float
      get() = dp(160f)

    private var animator: ValueAnimator? = null

    init {
      setLayerType(LAYER_TYPE_HARDWARE, null)

      backgroundDrawable.setColor(Color.parseColor(shimmerColor))
      background = backgroundDrawable

      clipToOutline = true

      outlineProvider = object : ViewOutlineProvider() {
        override fun getOutline(view: View, outline: Outline) {
          outline.setRoundRect(
            0,
            0,
            view.width,
            view.height,
            dp(borderRadius.toFloat())
          )
        }
      }
    }

    private fun dp(value: Float): Float {
      return value * resources.displayMetrics.density
    }

    override fun onSizeChanged(w: Int, h: Int, oldw: Int, oldh: Int) {
      super.onSizeChanged(w, h, oldw, oldh)
      buildGradient()
      invalidateOutline()
      restartAnimation()
    }

    private fun buildGradient() {
      if (width <= 0) return

      val op = highlightOpacity.toFloat()

      gradient = LinearGradient(
        0f,
        0f,
        shimmerWidthPx,
        0f,
        intArrayOf(
          Color.argb(0, 255, 255, 255),
          Color.argb((op * 0.4f * 255).toInt(), 255, 255, 255),
          Color.argb((op * 255).toInt(), 255, 255, 255),
          Color.argb((op * 0.4f * 255).toInt(), 255, 255, 255),
          Color.argb(0, 255, 255, 255),
        ),
        floatArrayOf(0f, 0.2f, 0.5f, 0.8f, 1f),
        Shader.TileMode.CLAMP,
      )

      paint.shader = gradient
    }

    private fun restartAnimation() {
      animator?.cancel()

      if (width <= 0) return

      val sw = shimmerWidthPx

      animator = ValueAnimator.ofFloat(-sw, width + sw).apply {
        duration = this@ShimmerSurfaceView.duration.toLong()
        repeatCount = ValueAnimator.INFINITE
        repeatMode = ValueAnimator.RESTART
        interpolator = LinearInterpolator()

        addUpdateListener { animation ->
          offset = animation.animatedValue as Float
          matrix.setTranslate(offset, 0f)
          gradient?.setLocalMatrix(matrix)
          invalidate()
        }

        start()
      }
    }

    override fun onDraw(canvas: Canvas) {
      super.onDraw(canvas)

      val shader = gradient ?: return

      paint.shader = shader

      drawRect.set(
        0f,
        0f,
        width.toFloat(),
        height.toFloat()
      )

      val radius = dp(borderRadius.toFloat())

      if (radius > 0f) {
        canvas.drawRoundRect(drawRect, radius, radius, paint)
      } else {
        canvas.drawRect(drawRect, paint)
      }
    }

    override fun onAttachedToWindow() {
      super.onAttachedToWindow()
      restartAnimation()
    }

    override fun onDetachedFromWindow() {
      super.onDetachedFromWindow()
      animator?.removeAllUpdateListeners()
      animator?.cancel()
      animator = null
    }
  }
}