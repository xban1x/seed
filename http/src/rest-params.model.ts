export interface RestParams {
  [key: string]: string | number;
  q?: number;
  page?: number;
  limit?: number;
  sort?: string;
}
