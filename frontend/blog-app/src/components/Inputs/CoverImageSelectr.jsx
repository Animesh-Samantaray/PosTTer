import React, { useRef, useState } from "react";

const CoverImageSelectr = ({
  image,
  setImage,
  preview,
  setPriview,
}) => {

    const inputRef = useRef(null);
    const [previewurl , setPreviewurl] = useState(null);

    const handleImageChange=(event)=>{
        const file = event.target.files[0];
    }
  return <div>

  </div>;
};

export default CoverImageSelectr;
