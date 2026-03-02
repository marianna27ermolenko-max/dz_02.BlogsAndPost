import { Response, Request } from "express"; 
import { HttpStatus } from "../../../core/types/http.status";
import { postsService } from "../../application/posts.service";
import { PostsQueryInput } from "../input/posts-query.input";
import { mapToPostListPaginatedOutput } from "../mappers/map-to-post-list-paginated-output.util"; 
import { matchedData } from "express-validator";
import { PostSortField } from "../input/post-sort-field";
import { setDefaultSortAndPaginationIfNotExist } from "../../../core/helpers/set-default-sort-and-pagination";
import { setDefaultPostPagination } from "../../../core/helpers/set-default-post-sort-and-pagination";

export async function getPostListHandler(req: Request<{}, {}, {}, PostsQueryInput>, res: Response){ 
try{


const sanitazedQuery = matchedData<PostsQueryInput>(req, {  
      locations: ['query'], // - "Бери данные только из req.query"
      includeOptionals: true, // - Верни даже необязательные поля, если они есть
    }); 
  
const pagination = setDefaultPostPagination<PostSortField>(sanitazedQuery); 

const { items, totalCount } = await postsService.findMany(pagination);

const postListOutput = mapToPostListPaginatedOutput(items, {
   pageNumber: pagination.pageNumber,
   pageSize: pagination.pageSize,
   totalCount,
})

res.status(HttpStatus.OK).json(postListOutput);   
} catch (err: any){
  res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
}} 