import http from "@/lib/http";
import {
  CreateDishBodyType,
  DishListResType,
  DishListWithPaginationQueryType,
  DishListWithPaginationResType,
  DishResType,
  UpdateDishBodyType,
} from "@/schemaValidations/dish.schema";

const prefix = "/dishes";
const dishApiRequest = {
  getDishList: () => http.get<DishListResType>(`${prefix}`),
  getDishListWithPagination: (query: DishListWithPaginationQueryType) =>
    http.get<DishListWithPaginationResType>(`${prefix}/pagination`),

  getDish: (id: number) => http.get<DishResType>(`${prefix}/${id}`),
  addDish: (body: CreateDishBodyType) =>
    http.post<DishResType>(`${prefix}`, body),
  updateDish: (id: number, body: UpdateDishBodyType) =>
    http.put<DishResType>(`${prefix}/${id}`, body),

  deleteDish: (id: number) => http.delete<DishResType>(`${prefix}/${id}`),
};

export default dishApiRequest;
