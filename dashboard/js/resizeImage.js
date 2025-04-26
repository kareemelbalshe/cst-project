export function resizeImage(file, maxWidth = 600, maxHeight = 600) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
  
        img.onload = () => {
          let width = img.width;
          let height = img.height;
  
          if (width > maxWidth || height > maxHeight) {
            const scale = Math.min(maxWidth / width, maxHeight / height);
            width = width * scale;
            height = height * scale;
          }
  
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
  
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
  
          const resizedBase64 = canvas.toDataURL("image/jpeg", 0.8); // 80% quality
          resolve(resizedBase64);
        };
      };
      reader.readAsDataURL(file);
    });
  }
  