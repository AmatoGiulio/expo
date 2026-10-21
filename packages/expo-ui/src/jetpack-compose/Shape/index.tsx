import { requireNativeView } from 'expo';
import { type ColorValue } from 'react-native';

import type { ExpoModifier } from '../../types';
import { createViewModifierEventListener } from '../modifiers/utils';

type ShapeType =
  | 'star'
  | 'pillStar'
  | 'pill'
  | 'circle'
  | 'rectangle'
  | 'polygon'
  | 'roundedCorner';

/**
 * Corner radii for RoundedCorner shape.
 */
export type CornerRadii = {
  /**
   * Top-start corner radius in dp.
   */
  topStart?: number;
  /**
   * Top-end corner radius in dp.
   */
  topEnd?: number;
  /**
   * Bottom-start corner radius in dp.
   */
  bottomStart?: number;
  /**
   * Bottom-end corner radius in dp.
   */
  bottomEnd?: number;
};

export interface ShapeProps {
  /**
   * Corner rounding percentage. Multiplied by the shorter dimension of the view to produce pixel values.
   * @default 0.0
   */
  cornerRounding?: number;
  /**
   * Number between `0.0` and `1.0` that determines how much each line between vertices is "smoothed".
   * @default 0.0
   */
  smoothing?: number;
  /**
   * Number of vertices. For `'POLYGON'` it must be at least `3.0`. For `'STAR'` and `'PILL_STAR'` it is a number of vertices for each of two radii (A 5-pointed star has 10 vertices.)
   * @default 6.0
   */
  verticesCount?: number;
  /**
   * Inner radius of star-related shapes (`'STAR'` and `'PILL_STAR'`). Multiplied by the shorter dimension of the view to produce pixel values.
   * @default 1.0
   */
  innerRadius?: number;
  /**
   * Radius of the circular shape. Multiplied by the shorter dimension of the view to produce pixel values.
   * @default 1.0
   */
  radius?: number;
  /**
   * Corner radii for RoundedCorner shape. Values are in dp.
   */
  cornerRadii?: CornerRadii;
  /** Color of the shape */
  color?: ColorValue;
  /**
   * Modifiers for the component.
   */
  modifiers?: ExpoModifier[];
}

type NativeShapeProps = Omit<ShapeProps, 'modifiers'> & {
  type: ShapeType;
  modifiers?: unknown;
};

export type ShapeRecordProps = Pick<
  NativeShapeProps,
  | 'cornerRounding'
  | 'smoothing'
  | 'verticesCount'
  | 'innerRadius'
  | 'radius'
  | 'cornerRadii'
  | 'type'
>;

const ShapeNativeView: React.ComponentType<NativeShapeProps> = requireNativeView(
  'ExpoUI',
  'ShapeView'
);

function transformProps(props: ShapeProps): Omit<NativeShapeProps, 'type'> {
  const { modifiers, ...restProps } = props;
  return {
    modifiers,
    ...(modifiers ? createViewModifierEventListener(modifiers) : undefined),
    ...restProps,
  };
}

export type ShapeJSXElement = React.ReactElement<NativeShapeProps> & {
  __expo_shape_jsx_element_marker: true;
};

function Star(props: ShapeProps) {
  return (<ShapeNativeView {...transformProps(props)} type="star" />) as ShapeJSXElement;
}

function PillStar(props: ShapeProps) {
  return (<ShapeNativeView {...transformProps(props)} type="pillStar" />) as ShapeJSXElement;
}

function Pill(props: Pick<ShapeProps, 'smoothing' | 'color' | 'modifiers'>) {
  return (<ShapeNativeView {...transformProps(props)} type="pill" />) as ShapeJSXElement;
}

function Circle(props: Pick<ShapeProps, 'radius' | 'verticesCount' | 'color' | 'modifiers'>) {
  return (<ShapeNativeView {...transformProps(props)} type="circle" />) as ShapeJSXElement;
}

function Rectangle(
  props: Pick<ShapeProps, 'smoothing' | 'cornerRounding' | 'color' | 'modifiers'>
) {
  return (<ShapeNativeView {...transformProps(props)} type="rectangle" />) as ShapeJSXElement;
}

function Polygon(
  props: Pick<ShapeProps, 'smoothing' | 'cornerRounding' | 'verticesCount' | 'color' | 'modifiers'>
) {
  return (<ShapeNativeView {...transformProps(props)} type="polygon" />) as ShapeJSXElement;
}

function RoundedCorner(props: Pick<ShapeProps, 'cornerRadii' | 'color' | 'modifiers'>) {
  return (<ShapeNativeView {...transformProps(props)} type="roundedCorner" />) as ShapeJSXElement;
}

/**
 * Props for `Shape.Morph`, which interpolates between two polygonal shapes using
 * Android Graphics Shapes and Jetpack Compose animation.
 */
export interface ShapeMorphProps {
  /** Starting shape, expressed as one of the `Shape.*` elements. */
  from: ShapeJSXElement;
  /** Destination shape, expressed as one of the `Shape.*` elements. */
  to: ShapeJSXElement;
  /**
   * Target morph progress from 0 (from) to 1 (to).
   * Changes are animated on the native side unless `animated` is false.
   * @default 0
   */
  progress?: number;
  /**
   * Animate progress changes using a native spring.
   * Set to false for manually driven progress, such as gestures.
   * @default true
   */
  animated?: boolean;
  /** Fill color of the interpolated shape. */
  color?: ColorValue;
  /** Compose modifiers for layout and interaction. */
  modifiers?: ExpoModifier[];
}

type NativeShapeMorphProps = Omit<ShapeMorphProps, 'from' | 'to' | 'modifiers'> & {
  from: ShapeRecordProps;
  to: ShapeRecordProps;
  modifiers?: unknown;
};

const ShapeMorphNativeView: React.ComponentType<NativeShapeMorphProps> = requireNativeView(
  'ExpoUI',
  'ShapeMorphView'
);

/**
 * Morphs between two Shape primitives. The entire shape interpolation is
 * rendered in Compose; JS only updates the target progress.
 *
 * @example
 * <Shape.Morph
 *   from={Shape.Circle({ radius: 1 })}
 *   to={Shape.Star({ radius: 1, innerRadius: 0.45, verticesCount: 8 })}
 *   progress={expanded ? 1 : 0}
 *   color="#6750A4"
 *   modifiers={[size(160, 160)]}
 * />
 */
function Morph({ from, to, modifiers, ...props }: ShapeMorphProps) {
  return (
    <ShapeMorphNativeView
      {...props}
      from={parseJSXShape(from)}
      to={parseJSXShape(to)}
      modifiers={modifiers}
      {...(modifiers ? createViewModifierEventListener(modifiers) : undefined)}
    />
  );
}

export const Shape = {
  Star,
  Morph,
  PillStar,
  Pill,
  Circle,
  Rectangle,
  Polygon,
  RoundedCorner,
};

export function parseJSXShape(shape: ShapeJSXElement): ShapeRecordProps;
export function parseJSXShape(shape?: ShapeJSXElement): ShapeRecordProps | undefined;
export function parseJSXShape(shape?: ShapeJSXElement): ShapeRecordProps | undefined {
  if (!shape) return undefined;
  const { cornerRounding, smoothing, verticesCount, innerRadius, radius, cornerRadii, type } =
    shape.props;
  return { cornerRounding, smoothing, verticesCount, innerRadius, radius, cornerRadii, type };
}
