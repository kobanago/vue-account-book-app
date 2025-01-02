export type LogEntry = {
  id: number;
  category_id: number;
  subcategory_id: number;
  price: number;
};
export type DateLogs = {
  id: number;
  timestamp: string;
  registered_date: string;
  logs: LogEntry[];
};
export type CategoryEntry = {
  id: number;
  category: string;
};
export type Category = {
  id: number;
  category: CategoryEntry[];
};
export type SubCategoryEntry = {
  id: number;
  category: string;
};
export type SubCategory = {
  id: number;
  subcategories: SubCategoryEntry[];
};
export type SetRecordEmits = (evt: 'setRecord', removeId: number, record?: LogEntry) => void;
