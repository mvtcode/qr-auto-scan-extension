(function() {
  function detectQRCodes() {
    const images = document.getElementsByTagName('img');
    
    for (let img of images) {
      if (img.complete) {
        processImageForQR(img);
      } else {
        img.addEventListener('load', () => processImageForQR(img));
      }
    }
  }

  function processImageForQR(img) {
    if (img.qrProcessed) return;
    img.qrProcessed = true;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    try {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      
      if (code) {
        // addNextpayButton(img, code.data);
        addQROverlay(img, code.data)
      }
    } catch (error) {
      console.error('QR detection error:', error);
    }
  }

  // function addNextpayButton(imgElement, qrData) {
  //   if (imgElement.nextSibling && imgElement.nextSibling.classList.contains('qr-nextpay-container')) {
  //     return;
  //   }

  //   imgElement.classList.add('qr-code-image');

  //   const container = document.createElement('div');
  //   container.className = 'qr-nextpay-container';
    
  //   const button = document.createElement('button');
  //   button.className = 'nextpay-send-button';
  //   button.innerHTML = `Send to Nextpay `;
    
  //   button.onclick = () => {
  //     alert(`Đã gửi code QR tới Nextpay: ${qrData}`);
  //   };
    
  //   container.appendChild(button);
  //   imgElement.parentNode.insertBefore(container, imgElement.nextSibling);
  // }

  function addQROverlay(imgElement, qrData) {
    // Tạo container bao quanh ảnh
    const container = document.createElement('div');
    container.className = 'qr-detection-container';
    
    // Wrap ảnh trong container
    imgElement.parentNode.insertBefore(container, imgElement);
    container.appendChild(imgElement);

    // Tạo overlay button
    const overlay = document.createElement('div');
    overlay.className = 'qr-nextpay-overlay';
    overlay.innerHTML = `
      <button class="nextpay-send-button">
        Send to Nextpay
      </button>
    `;
    
    overlay.querySelector('.nextpay-send-button').onclick = () => {
      // sendToNextpay(qrData);
      alert(`Đã gửi code QR tới Nextpay: ${qrData}`);
    };
    
    container.appendChild(overlay);
  }

  detectQRCodes();

  const observer = new MutationObserver(detectQRCodes);
  observer.observe(document.body, { 
    childList: true, 
    subtree: true 
  });
})();