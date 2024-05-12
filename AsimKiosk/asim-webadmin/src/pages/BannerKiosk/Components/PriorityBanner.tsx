import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import { CheckOutlined } from '@ant-design/icons';
import type { DragEndEvent } from '@dnd-kit/core/dist/types/index';
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Button, Modal } from 'antd';
import { useState } from 'react';

import { useTranslation } from 'react-i18next';
import AlertMess from '../../../Components/AlertMess/AlertMess';
import { TBanner } from '../../../interface/Tbanner';
import DraggableImg from './DraggableImg';

type PriorityBannerProps = {
  bannerList: TBanner[];
  isModalOpen: boolean;
  handleCancel: () => void;
  handleChangePriorityBanner: (
    bannerList: Pick<TBanner, 'imageKey' | 'priority'>[]
  ) => void;
};

const PriorityBanner = ({
  bannerList,
  isModalOpen,
  handleCancel,
  handleChangePriorityBanner,
}: PriorityBannerProps) => {
  const { t } = useTranslation('lng');
  const [bannerListPriorty, setBannerListPriorty] =
    useState<TBanner[]>(bannerList);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    // console.log('over', active, over);
    if (!over) return;
    if (active.id !== over.id) {
      setBannerListPriorty((data) => {
        const oldIndex = data.findIndex((item) => item.priority === active.id);
        const newIndex = data.findIndex((item) => item.priority === over.id);

        return arrayMove(data, oldIndex, newIndex);
      });
    }
  };

  const handleSumbit = () => {
    const newBannerList = bannerListPriorty.map((banner: TBanner, index) => ({
      imageKey: banner.imageKey,
      priority: index, // change priority === index of array of bannerListPriorty
    }));
    // console.log('con', newBannerList, bannerListPriorty);
    handleChangePriorityBanner(newBannerList);
  };

  return (
    <Modal
      title={
        <h4 className="font-bold text-2xl text-center mb-5">
          {t('UIKiosk.banner.PriorityBanner.title')}
        </h4>
      }
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      className="w-11/12 md:w-10/12 xl:w-[80%]"
    >
      <div className="mb-3">
        <AlertMess
          type="info"
          message={`${t('UIKiosk.banner.PriorityBanner.AlertMess')}`}
          showIcon={true}
        ></AlertMess>
      </div>

      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
      >
        <SortableContext
          items={bannerListPriorty}
          strategy={horizontalListSortingStrategy}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3">
            {bannerListPriorty.map((item) => (
              <DraggableImg banner={item} key={item.imageKey} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <div className="flex justify-center  lg:justify-end  items-center mt-3">
        <Button
          className="py-0 px-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 2xl:w-1/6 min-w-[150px] flex items-center justify-center "
          size="large"
          type="primary"
          shape="round"
          icon={<CheckOutlined />}
          onClick={handleSumbit}
        >
          {t('UIKiosk.banner.PriorityBanner.btnPriorityBanner')}
        </Button>
      </div>
    </Modal>
  );
};

export default PriorityBanner;
