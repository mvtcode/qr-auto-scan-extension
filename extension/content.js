(function() {
  function detectQRCodes() {
    const images = document.getElementsByTagName('img');
    
    for (let img of images) {
      img.crossOrigin = "Anonymous";
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
        Gửi QR tới Tingbox
      </button>
    `;
    
    overlay.querySelector('.nextpay-send-button').onclick = (e) => {
      e.preventDefault();
      alert(`Đã gửi code QR tới Tingbox: ${qrData}`);
    };
    
    container.appendChild(overlay);
  }

  // detectQRCodes();

  let tInterval = null;
  const detectReadyPage = () => {
    const btnSubmit = document.getElementsByClassName('btn-submit');
    if (btnSubmit.length > 0) {
      clearInterval(tInterval);
      btnSubmit[0].addEventListener('click', () => {
        const tLoading = setInterval(() => {
          if (!btnSubmit[0].classList.contains('is-loading')) {
            clearInterval(tLoading);
            detectQRCodes();
          }
        }, 500);
      }, { once: true });
    }
  }
  tInterval = setInterval(() => {
    detectReadyPage();
  }, 1000);
  
  const observer = new MutationObserver(detectQRCodes);
  observer.observe(document.body, { 
    childList: true, 
    subtree: true 
  });
})();