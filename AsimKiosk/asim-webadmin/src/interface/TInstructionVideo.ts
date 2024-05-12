export type TInstructionVideoRes = {
  videoUrl: string;
  videoKey: string;
  productType: string;
  status: string;
  id: string;
};
export type TAddInstructionVideo = {
  ProductType: string;
  VideoFile: any;
};
export type IFormChangeInstructionVideoStatus = {
  id: string;
  status: number;
};
