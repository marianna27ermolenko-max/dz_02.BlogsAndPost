import { PaginationAndSorting } from "../../../core/types/pagination_and_sorting";
import { BlogSortField } from "./blogs-sort-field";


export type BlogsQueryDto =
  PaginationAndSorting<BlogSortField> & {
    searchNameTerm?: string;
  };