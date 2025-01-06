import http from "@/lib/http";
import { DashboardIndicatorResType } from "@/schemaValidations/indicator.schema";
import { GetOrdersQueryParamsType } from "@/schemaValidations/order.schema";
import queryString from "query-string";

const indicatorApiRequest = {
  getDashBoardIndicators: (queryParams: GetOrdersQueryParamsType) =>
    http.get<DashboardIndicatorResType>(
      `/indicators/dashboard?${queryString.stringify({
        fromDate: queryParams.fromDate?.toISOString(),
        toDate: queryParams.toDate?.toISOString(),
      })}`
    ),
};
export default indicatorApiRequest;
