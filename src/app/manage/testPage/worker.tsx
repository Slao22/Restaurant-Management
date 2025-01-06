"use client";
import React, { useEffect } from "react";

export default function TestWorker() {
  useEffect(() => {
    if (window.Worker) {
      [];
      const worker = new Worker(new URL("./worker.js", import.meta.url)); // Tạo worker
      console.log("Worker của Việt Anh");
      worker.postMessage("Start calculation"); // Gửi tin nhắn đến worker
      worker.onmessage = function (e) {
        console.log("Result from worker:", e.data); // Nhận kết quả từ worker
      };
      console.log("Worker của Việt Anh1");

      worker.onerror = function (e) {
        console.error("Worker error:", e.message);
      };
      return () => {
        worker.terminate();
      };
    } else {
      console.log("Your browser does not support Web Worker.");
    }
  }, []);

  return <div>worker</div>;
}
