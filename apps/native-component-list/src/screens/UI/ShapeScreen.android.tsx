import { Host, Shape, Row } from '@expo/ui/jetpack-compose';
import { rotate, size } from '@expo/ui/jetpack-compose/modifiers';
import { useEffect, useState } from 'react';
import { Button, View } from 'react-native';
import Animated, {
  Easing,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Page } from '../../components/Page';

const AnimatedPolygon = Animated.createAnimatedComponent(Shape.Polygon);
const AnimatedRectangle = Animated.createAnimatedComponent(Shape.Rectangle);
const AnimatedStar = Animated.createAnimatedComponent(Shape.Star);

const pastelPalette = {
  color1: '#541388',
  color2: '#d1d646',
  color3: '#d90368',
  color4: '#2e294e',
  color5: '#ffd400',
};

export default function UIScreen() {
  const [morphActive, setMorphActive] = useState(false);
  const oneToZero = useSharedValue<number | undefined>(1);

  useEffect(() => {
    oneToZero.set(
      withRepeat(
        withSequence(
          withTiming(1, { duration: 1000, easing: Easing.cubic }),
          withTiming(0, { duration: 1000, easing: Easing.cubic })
        ),
        -1,
        true
      )
    );
  }, []);

  const zeroToPointTwo = useSharedValue<number | undefined>(1);

  useEffect(() => {
    zeroToPointTwo.set(
      withRepeat(
        withSequence(
          withTiming(0, { duration: 1000, easing: Easing.cubic }),
          withTiming(0.2, { duration: 1000, easing: Easing.cubic })
        ),
        -1,
        true
      )
    );
  }, []);

  const oneToPointEight = useSharedValue<number | undefined>(1);

  useEffect(() => {
    oneToPointEight.set(
      withRepeat(
        withSequence(
          withTiming(0.8, { duration: 1000, easing: Easing.cubic }),
          withTiming(0.6, { duration: 1000, easing: Easing.cubic })
        ),
        -1,
        true
      )
    );
  }, []);

  return (
    <Page>
      <View style={{ alignItems: 'center', gap: 12, paddingVertical: 24 }}>
        <Host style={{ width: 180, height: 180 }}>
          <Shape.Morph
            from={Shape.Circle({ radius: 1 })}
            to={Shape.Star({
              radius: 1,
              innerRadius: 0.5,
              verticesCount: 8,
              cornerRounding: 0.08,
              smoothing: 0.4,
            })}
            progress={morphActive ? 1 : 0}
            color={pastelPalette.color1}
            modifiers={[size(180, 180)]}
          />
        </Host>
        <Button
          title={morphActive ? 'Morph to circle' : 'Morph to star'}
          onPress={() => setMorphActive((current) => !current)}
        />
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}>
        <Host style={{ width: 140 * 3, height: 140 }}>
          <Row>
            <AnimatedPolygon
              modifiers={[size(140, 140)]}
              smoothing={1}
              cornerRounding={zeroToPointTwo}
              verticesCount={3}
              color={pastelPalette.color1}
            />
            <AnimatedStar
              modifiers={[size(140, 140)]}
              innerRadius={oneToPointEight}
              smoothing={1}
              radius={1}
              cornerRounding={0.1}
              verticesCount={12}
              color={pastelPalette.color2}
            />
            <Shape.PillStar
              modifiers={[size(140, 140)]}
              radius={1}
              innerRadius={0.7}
              smoothing={1}
              cornerRounding={0.05}
              verticesCount={12}
              color={pastelPalette.color3}
            />
          </Row>
        </Host>
        <Host style={{ width: 140 * 3, height: 140 }}>
          <Row>
            <AnimatedPolygon
              modifiers={[size(140, 140)]}
              cornerRounding={zeroToPointTwo}
              smoothing={1}
              verticesCount={6}
              color={pastelPalette.color4}
            />
            <AnimatedRectangle
              modifiers={[size(140, 140), rotate(45)]}
              smoothing={1}
              cornerRounding={oneToZero}
              color={pastelPalette.color5}
            />
          </Row>
        </Host>
      </View>
    </Page>
  );
}
