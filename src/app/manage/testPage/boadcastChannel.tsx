"use client";
import { useEffect, useRef } from "react";

export default function BroadcastChannelComponent() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const bc = new BroadcastChannel("myChannel");

    buttonRef.current?.addEventListener("click", () => {
      console.log("click me");
      bc.postMessage("Hello from the other side!");
      bc.postMessage({ prop: "value" });
      bc.postMessage(
        new File(["content"], "filename.txt", { type: "text/plain" })
      );
    });

    bc.addEventListener("message", (e) => {
      console.log("Received message", e.data);
    });

    return () => {
      bc.close();
    };
  }, []);

  return (
    <>
      <div>
        <h1>BroadcastChannel</h1>
        <button ref={buttonRef}>Send message</button>
      </div>
    </>
  );
}
