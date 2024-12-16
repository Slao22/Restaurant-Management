"use client";

import { MutableRefObject, useEffect, useRef, useState } from "react";
import { QRCode } from "react-qrcode-logo";
type Props = {
  data: string;
};
export const QRCodeTable: React.FC<Props> = ({ data }) => {
  const ref = useRef<QRCode>();
  const [qrSize, setQrSize] = useState(250);
  const handleDownload = () => {
    ref.current?.download();
  };

  useEffect(() => {
    const updateQrSize = () => {
      if (window.innerWidth >= 390) {
        setQrSize(250);
      } else {
        setQrSize(230);
      }
    };
    window.addEventListener("resize", updateQrSize);
    updateQrSize();
    return () => window.removeEventListener("resize", updateQrSize);
  }, []);

  return (
    <div className=" w-fit">
      <QRCode
        ref={ref as MutableRefObject<QRCode>}
        logoWidth={36}
        logoHeight={36}
        ecLevel="L"
        logoPadding={5}
        logoPaddingStyle="square"
        value={data}
        size={250}
        removeQrCodeBehindLogo
        qrStyle="fluid"
        style={{
          width: `${qrSize}px`,
          height: `${qrSize}px`,
          borderRadius: "10px",
          margin: "14px",
        }}
      />
    </div>
  );
};
