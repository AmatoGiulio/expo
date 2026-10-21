package expo.modules.ui

import android.graphics.Color as GraphicsColor
import android.graphics.Path as AndroidPath
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.snap
import androidx.compose.animation.core.spring
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.draw.drawWithCache
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asComposePath
import androidx.graphics.shapes.Morph
import androidx.graphics.shapes.toPath
import expo.modules.kotlin.views.ComposeProps
import expo.modules.kotlin.views.FunctionalComposableScope
import expo.modules.kotlin.views.OptimizedComposeProps

@OptimizedComposeProps
data class ShapeMorphProps(
  val from: ShapeRecord = ShapeRecord(),
  val to: ShapeRecord = ShapeRecord(),
  val progress: Float = 0f,
  val animated: Boolean = true,
  val color: GraphicsColor? = null,
  val modifiers: ModifierList = emptyList()
) : ComposeProps

@Composable
fun FunctionalComposableScope.ShapeMorphContent(props: ShapeMorphProps) {
  val target = if (props.progress.isFinite()) props.progress.coerceIn(0f, 1f) else 0f
  val animatedProgress = animateFloatAsState(
    targetValue = target,
    animationSpec = if (props.animated) {
      spring(dampingRatio = Spring.DampingRatioNoBouncy, stiffness = Spring.StiffnessMedium)
    } else {
      snap()
    },
    label = "ShapeMorph"
  )

  Box(
    modifier = ModifierRegistry.applyModifiers(
      props.modifiers, appContext, composableScope, globalEventDispatcher
    )
      .drawWithCache {
        // Keep the expensive curve matching outside the per-frame draw lambda.
        val morph = runCatching {
          Morph(
            roundedPolygonFromShapeRecord(props.from, size, this),
            roundedPolygonFromShapeRecord(props.to, size, this)
          )
        }.getOrNull()
        // toPath replaces the contents of the supplied Android path every frame.
        val path = AndroidPath()

        onDrawBehind {
          if (morph != null) {
            val current = morph.toPath(
              progress = animatedProgress.value.coerceIn(0f, 1f),
              path = path
            ).asComposePath()
            drawPath(current, color = props.color.composeOrNull ?: Color.Transparent)
          }
        }
      }
      .fillMaxSize()
  )
}
