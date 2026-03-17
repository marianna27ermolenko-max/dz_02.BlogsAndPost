import { Response, Request } from "express"; 
import { HttpStatus } from "../../../common/types/http.status";
import { PostsQueryInput } from "../input/posts-query.input";
import { mapToPostListPaginatedOutput } from "../mappers/map-to-post-list-paginated-output.util"; 
import { matchedData } from "express-validator";
import { PostSortField } from "../input/post-sort-field";
import { setDefaultPostPagination } from "../../../common/helpers/set-default-post-sort-and-pagination";
import { postsQwRepository } from "../../repositories/post-query.repositories";

export async function getPostListHandler(req: Request<{}, {}, {}, PostsQueryInput>, res: Response){ 
try{
    
const sanitazedQuery = matchedData<PostsQueryInput>(req, {  
      locations: ['query'], // - "Бери данные только из req.query"
      includeOptionals: true, // - Верни даже необязательные поля, если они есть
    }); 
  
const pagination = setDefaultPostPagination<PostSortField>(sanitazedQuery); 

const { items, totalCount } = await postsQwRepository.findMany(pagination);

const postListOutput = mapToPostListPaginatedOutput(items, {
   pageNumber: pagination.pageNumber,
   pageSize: pagination.pageSize,
   totalCount,
})

res.status(HttpStatus.OK).json(postListOutput);   
} catch (err: any){
  res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
}} 