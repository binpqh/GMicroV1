import { useSortable } from '@dnd-kit/sortable';
import { Image, Tag } from 'antd';
import type { FC } from 'react';

import { TBanner } from '../../../interface/Tbanner';

type DraggableTagProps = {
  banner: TBanner;
};

const DraggableImg: FC<DraggableTagProps> = (props) => {
  const { banner } = props;
  const { listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: banner.id });

  const commonStyle = {
    cursor: 'move',
    transition: 'unset', // Prevent element from shaking after drag
  };

  const style = transform
    ? {
        ...commonStyle,

        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition: isDragging ? 'unset' : transition, // Improve performance/visual effect when dragging
      }
    : commonStyle;

  return (
    <Tag
      style={style}
      ref={setNodeRef}
      {...listeners}
      // bordered={false}
      color="processing"
      className=" m-0 text-center "
    >
      <h3 className="text-ellipsis overflow-hidden">{banner.imageKey}</h3>
      <Image
        width={'100%'}
        src={`${banner?.imageKey}`}
        preview={false}
        className={`${!banner?.isActive && 'grayscale'}`}
      />
    </Tag>
  );
};
export default DraggableImg;
