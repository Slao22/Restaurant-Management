"use client";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import socket from "@/lib/socket";
import { formatCurrency, getVietnameseOrderStatus } from "@/lib/utils";
import { useGuestGetOrderListQuery } from "@/queries/useGuest";
import { UpdateOrderResType } from "@/schemaValidations/order.schema";
import Image from "next/image";
import React, { useEffect } from "react";

export default function OrderCart() {
  const { data, refetch } = useGuestGetOrderListQuery();
  const orders = data?.payload.data ?? [];

  const totalPrice = () => {
    return orders.reduce((result, order) => {
      return result + order.dishSnapshot.price * order.quantity;
    }, 0);
  };

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      console.log("", socket.id);
    }

    function onDisconnect() {
      console.log("", socket.id);
    }
    function onUpdateOrder(data: UpdateOrderResType["data"]) {
      const {
        dishSnapshot: { name },
        quantity,
      } = data;
      toast({
        description: `Món ăn ${name} (SL: ${quantity}) đã được cập nhật trạng thái ${getVietnameseOrderStatus(
          data.status
        )}`,
      });
      refetch();
    }

    socket.on("update-order", onUpdateOrder);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("update-order", onUpdateOrder);
    };
  }, [refetch]);

  return (
    <>
      {orders.map((order, index) => (
        <div key={order.id} className="flex gap-4">
          <div className="text-xs font-semibold">{index + 1}</div>
          <div className="flex-shrink-0 relative">
            <Image
              src={order.dishSnapshot.image}
              alt={order.dishSnapshot.name}
              height={100}
              width={100}
              quality={100}
              className="object-cover w-[80px] h-[80px] rounded-md"
            />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm">{order.dishSnapshot.name}</h3>
            <div className="text-xs font-semibold">
              {formatCurrency(order.dishSnapshot.price)} x{" "}
              <Badge className="px-1">{order.quantity}</Badge>
            </div>
          </div>
          <div className="flex-shrink-0 ml-auto flex justify-center items-center">
            <Badge variant={"outline"}>
              {getVietnameseOrderStatus(order.status)}
            </Badge>
          </div>
        </div>
      ))}

      <div className="sticky bottom-0">
        <div className="w-full justify-between text-xl font-semibold">
          <span>Tổng cộng · {orders.length} món</span>
          <span> {formatCurrency(totalPrice())}</span>
        </div>
      </div>
    </>
  );
}
