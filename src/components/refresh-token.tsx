"use client";

import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
} from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import jwt from "jsonwebtoken";
import authApiRequest from "@/apiRequest/auth";

//Không check refreshToken những page này
const UNAUTHENTICATED_PATH = ["/login", "/logout", "/refresh-token"];
export default function RefreshToken() {
  const pathname = usePathname();
  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return;
    let interval: any = null;
    const checkAndRefreshToken = async () => {
      // KHÔNG NÊN ĐƯA LOGIC LẤY ACCESS VÀ REFRESH RA KHỎI FUNCTION NÀY
      // VÌ MỖI LẦN MÀ CHECK ĐƯỢC GOI THÌ CHÚNG TA SẼ CÓ 1 ACC VÀ REF MỚI TRÁNH HIỆN TƯỢNG BUG
      const accessToken = getAccessTokenFromLocalStorage();
      const refreshToken = getRefreshTokenFromLocalStorage();

      if (!accessToken || !refreshToken) return;
      const decodedAccessToken = jwt.decode(accessToken) as {
        exp: number;
        iat: number;
      };
      const decodedRefreshToken = jwt.decode(refreshToken) as {
        exp: number;
        iat: number;
      };
      const now = Math.round(new Date().getTime() / 1000);
      if (decodedRefreshToken.exp <= now) return;
      //Ví dụ accessToken của chúng ta có thời gian hết hạn là 10s
      // thì mình cần kiểm tra còn 1/3 thời gian (3s) thì fminhf sẽ cho refreshToken lại
      // thời gian còn lại tính dựa trên ccoong thức decodeAccessToken.exp - now
      //
      if (
        decodedAccessToken.exp - now <
        (decodedAccessToken.exp - decodedAccessToken.iat) / 3
      ) {
        try {
          const res = await authApiRequest.refreshToken();
          setAccessTokenToLocalStorage(res.payload.data.accessToken);
          setRefreshTokenToLocalStorage(res.payload.data.accessToken);
        } catch (error) {
          clearInterval(interval);
        }
      }
    };
    //phải gọi lần đầu vì interval sẽ chạy sau thời gian timeout
    checkAndRefreshToken();
    //timeout interval phải bé hơn time hết hạn của access
    //ví dụ thời gian hết hạn của access là 10s thì 1s mình cho check 1 lần
    const TIMEOUT = 1000;
    interval = setInterval(checkAndRefreshToken, TIMEOUT);
    return () => {
      clearInterval(interval);
    };
  }, [pathname]);
  return null;
}
