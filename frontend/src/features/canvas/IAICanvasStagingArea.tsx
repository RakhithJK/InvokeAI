import { createSelector } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/store';
import { GroupConfig } from 'konva/lib/Group';
import _ from 'lodash';
import { useCallback, useState } from 'react';
import { Group, Rect } from 'react-konva';
import { canvasSelector } from './canvasSlice';
import IAICanvasImage from './IAICanvasImage';

const selector = createSelector(
  [canvasSelector],
  (canvas) => {
    const {
      layerState: {
        stagingArea: { images, selectedImageIndex },
      },
    } = canvas;

    return {
      currentStagingAreaImage:
        images.length > 0 ? images[selectedImageIndex] : undefined,
      isOnFirstImage: selectedImageIndex === 0,
      isOnLastImage: selectedImageIndex === images.length - 1,
    };
  },
  {
    memoizeOptions: {
      resultEqualityCheck: _.isEqual,
    },
  }
);

type Props = GroupConfig;

const IAICanvasStagingArea = (props: Props) => {
  const { ...rest } = props;
  const { currentStagingAreaImage } = useAppSelector(selector);

  const [shouldShowStagedImage, setShouldShowStagedImage] =
    useState<boolean>(true);

  const [shouldShowStagingAreaOutline, setShouldShowStagingAreaOutline] =
    useState<boolean>(true);

  if (!currentStagingAreaImage) return null;

  const {
    x,
    y,
    image: { width, height, url },
  } = currentStagingAreaImage;

  return (
    <Group {...rest}>
      {shouldShowStagedImage && <IAICanvasImage url={url} x={x} y={y} />}
      {shouldShowStagingAreaOutline && (
        <Group>
          <Rect
            x={x}
            y={y}
            width={width}
            height={height}
            strokeWidth={1}
            stroke={'black'}
            strokeScaleEnabled={false}
          />
          <Rect
            x={x}
            y={y}
            width={width}
            height={height}
            dash={[4, 4]}
            strokeWidth={1}
            stroke={'white'}
            strokeScaleEnabled={false}
          />
        </Group>
      )}
    </Group>
  );
};

export default IAICanvasStagingArea;
