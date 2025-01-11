import indicatorApiRequest from "@/apiRequest/indicator";
import { GetOrdersQueryParamsType } from "@/schemaValidations/order.schema";
import { useQuery } from "@tanstack/react-query";

export const useDashBoardIndicator = (
  queryParams: GetOrdersQueryParamsType
) => {
  return useQuery({
    queryKey: ["dashboardIndicators", queryParams],
    queryFn: () => indicatorApiRequest.getDashBoardIndicators(queryParams),
  });
};
