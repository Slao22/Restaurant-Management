"use client";
import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/constants/type";
import { toast } from "@/hooks/use-toast";
import socket from "@/lib/socket";
import { formatCurrency, getVietnameseOrderStatus } from "@/lib/utils";
import { useGuestGetOrderListQuery } from "@/queries/useGuest";
import {
  PayGuestOrdersResType,
  UpdateOrderResType,
} from "@/schemaValidations/order.schema";
import Image from "next/image";
import React, { useEffect } from "react";

export default function OrderCart() {
  const { data, refetch } = useGuestGetOrderListQuery();
  const orders = data?.payload.data ?? [];

  const { waitingForPaying, paid } = (() => {
    return orders.reduce(
      (result, order) => {
        if (
          order.status === OrderStatus.Delivered ||
          order.status === OrderStatus.Processing ||
          order.status === OrderStatus.Pending
        ) {
          return {
            ...result,
            waitingForPaying: {
              price:
                result.waitingForPaying.price +
                order.dishSnapshot.price * order.quantity,
              quantity: result.waitingForPaying.quantity + order.quantity,
            },
          };
        }
        if (order.status === OrderStatus.Paid) {
          return {
            ...result,
            paid: {
              price:
                result.paid.price + order.dishSnapshot.price * order.quantity,
              quantity: result.paid.quantity + order.quantity,
            },
          };
        }
        return result;
      },
      {
        waitingForPaying: {
          price: 0,
          quantity: 0,
        },
        paid: {
          price: 0,
          quantity: 0,
        },
      }
    );
  })();

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

    function onPayment(data: PayGuestOrdersResType["data"]) {
      const { guest } = data[0];
      toast({
        description: `${guest?.name} tại bàn ${guest?.tableNumber} đã thanh toán ${data.length} đơn `,
      });
      refetch();
    }

    socket.on("update-order", onUpdateOrder);
    socket.on("payment", onPayment);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("update-order", onUpdateOrder);
      socket.off("payment", onPayment);
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
          <span>Đơn đã thanh toán · {paid.price} món</span>
          <span> {formatCurrency(paid.quantity)}</span>
        </div>
      </div>

      <div className="sticky bottom-0">
        <div className="w-full justify-between text-xl font-semibold">
          <span>Đơn chưa thanh toán · {waitingForPaying.price} món</span>
          <span> {formatCurrency(waitingForPaying.quantity)}</span>
        </div>
      </div>
    </>
  );
}
