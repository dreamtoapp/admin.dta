import Image from "next/image";
import React from "react";

function Crombo() {
  return (
    <div className="relative w-8 h-8 image-container" style={{ aspectRatio: '1/1' }}>
      <Image
        src={"/assets/crombo.png"} // Removed due to missing file
        alt="crombo"
        width={32} // Specify the width
        height={32} // Specify the height
        loading="eager"
        priority
        className="object-contain w-full h-full"
        sizes="(max-width: 400px) 32px, 32px"
        style={{ aspectRatio: '1/1' }}
      />
    </div>
  );
}

export default Crombo;
