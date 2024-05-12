import { Divider, Image, List } from 'antd';
import { TProductItem } from '../../../interface';
import { memo } from 'react';
export interface IItemListProps {
  productContent: TProductItem[];
  colorCodePrimary: string;
  isVietNameseContent: boolean;
}

function ItemList({
  productContent,
  colorCodePrimary,
  isVietNameseContent,
}: IItemListProps) {
  return (
    <div className="w-full">
      <Divider
        className="text-base sm:text-xl md:text-2xl break-words font-semibold  "
        style={{ color: `${colorCodePrimary}` }}
      >
        {isVietNameseContent ? 'Vietnamese' : 'English'}
      </Divider>
      <List
        className="w-full"
        size="large"
        pagination={false}
        dataSource={productContent}
        renderItem={(item) => (
          <List.Item
            className=" bg-colorBgContainer mb-4 rounded-lg shadow-sm "
            key={item.codeItem}
          >
            <div className="m-auto  w-2/6 ">
              <Image width={'100%'} src={`${item.iconItem}`} />
            </div>
            <div className="flex flex-wrap xl:flex-nowrap items-center justify-between w-4/6 sm:w-full  sm:gap-0 gap-2 ">
              <div className="flex flex-wrap justify-center items-center w-full mr-5">
                <Divider
                  type="vertical"
                  className="h-24 ml-5 mr-8 text-center hidden sm:block"
                />

                <List.Item.Meta
                  className=" font-semibold text-left ml-10 sm:ml-0 "
                  title={
                    <p className="text-base font-semibold">
                      {item.codeTitle} {item?.codeItem}
                    </p>
                  }
                  description={
                    <>
                      <p className="text-base font-semibold">
                        {isVietNameseContent ? 'Giá' : 'Price'}: {item.price}{' '}
                        {isVietNameseContent ? 'VNĐ' : '$'}
                      </p>
                      <ul className="list-disc">
                        {item.description.map((desc, index) => (
                          <li key={index}>{desc}</li>
                        ))}
                      </ul>
                      {item.note && (
                        <p className="">
                          {isVietNameseContent ? 'Bao Gồm' : 'Includes'}:{' '}
                          {item.note}
                        </p>
                      )}
                    </>
                  }
                />
              </div>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
}
export default memo(ItemList);
