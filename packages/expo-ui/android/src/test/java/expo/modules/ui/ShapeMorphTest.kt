package expo.modules.ui

import androidx.compose.ui.geometry.Size
import androidx.compose.ui.unit.Density
import androidx.graphics.shapes.Morph
import androidx.graphics.shapes.toPath
import com.google.common.truth.Truth.assertThat
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [28])
class ShapeMorphTest {
  private val size = Size(160f, 160f)
  private val density = Density(1f)

  @Test
  fun `morph accepts each Shape primitive at the start middle and end`() {
    val shapes = listOf(
      ShapeRecord(type = ShapeType.CIRCLE, radius = 1f),
      ShapeRecord(type = ShapeType.STAR, radius = 1f, innerRadius = 0.45f, verticesCount = 8),
      ShapeRecord(type = ShapeType.PILL_STAR, innerRadius = 0.5f, verticesCount = 6),
      ShapeRecord(type = ShapeType.PILL),
      ShapeRecord(type = ShapeType.RECTANGLE, cornerRounding = 0.1f),
      ShapeRecord(type = ShapeType.POLYGON, verticesCount = 6),
      ShapeRecord(
        type = ShapeType.ROUNDED_CORNER,
        cornerRadii = CornerRadii(
          topStart = 12f,
          topEnd = 24f,
          bottomStart = 8f,
          bottomEnd = 16f
        )
      )
    )

    val polygons = shapes.map { roundedPolygonFromShapeRecord(it, size, density) }
    for (index in polygons.indices) {
      val morph = Morph(polygons[index], polygons[(index + 1) % polygons.size])
      for (progress in listOf(0f, 0.5f, 1f)) {
        assertThat(morph.toPath(progress).isEmpty).isFalse()
      }
    }
  }

  @Test
  fun `morph creates different outlines at its endpoints`() {
    val circle = roundedPolygonFromShapeRecord(
      ShapeRecord(type = ShapeType.CIRCLE, radius = 1f), size, density
    )
    val star = roundedPolygonFromShapeRecord(
      ShapeRecord(type = ShapeType.STAR, radius = 1f, innerRadius = 0.45f, verticesCount = 8),
      size,
      density
    )
    val morph = Morph(circle, star)

    assertThat(morph.asCubics(0f)).isNotEmpty()
    assertThat(morph.asCubics(0.5f)).isNotEmpty()
    assertThat(morph.asCubics(1f)).isNotEmpty()
    assertThat(morph.toPath(0f).isEmpty).isFalse()
    assertThat(morph.toPath(1f).isEmpty).isFalse()
  }
}
