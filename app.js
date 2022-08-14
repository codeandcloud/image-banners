window.addEventListener('DOMContentLoaded', (event) => {
  const app = bannerCreatorApp();
  app.init();
});

const bannerCreatorApp = () => {
  const allowedExtensions = ['jpg', 'jpeg', 'png'];
  const filePicker = document.querySelector('#file-picker');
  const imageUploadButton = document.querySelector('#upload-images-button');

  const bannerWrapper = document.querySelector('#banner-wrapper');

  const createElementWithProps = (tag, props) =>
    Object.assign(document.createElement(tag), props);

  const downloadAsImage = (imageData, fileName) => {
    var link = createElementWithProps('a', {
      download: `with-banner-${fileName}`,
      href: imageData,
      // href: imageData.replace('image/png', 'image/octet-stream'),
    });
    link.click();
  };

  const uploadImagehandler = () => {
    imageUploadButton.addEventListener('click', (e) => {
      e.preventDefault();
      if (!filePicker.files.length) {
        alert('No files in the folder');
        return;
      }

      const imageFiles = Array.from(filePicker.files).filter((file) =>
        allowedExtensions.includes(file.name.split('.').pop().toLowerCase())
      );
      if (!imageFiles.length) {
        alert('No image files in the folder');
        return;
      }

      const bannerWrappers = [];
      for (let i = 0; i < imageFiles.length; i++) {
        const imageObj = createElementWithProps('img', {
          alt: imageFiles[i].name,
          className: 'banner-image',
          crossOrigin: 'anonymous',
          id: `banner-image-${i + 1}`,
          src: URL.createObjectURL(imageFiles[i]),
        });
        const bannerObj = createElementWithProps('span', {
          contentEditabe: true,
          className: 'banner-text',
          id: `banner-text-${i + 1}`,
          type: 'text',
        });
        bannerObj.innerText = 'My Banner Text';
        const bannerSection = createElementWithProps('div', {
          id: `banner-section-${i + 1}`,
          className: 'banner-section',
        });
        bannerSection.appendChild(imageObj);
        bannerSection.appendChild(bannerObj);

        const buttonObj = createElementWithProps('input', {
          className: 'banner-button',
          id: `banner-button-${i + 1}`,
          type: 'button',
          value: 'Generate Banner',
        });
        const bannerWrapper = createElementWithProps('div', {
          id: `banner-wrapper-${i + 1}`,
          className: 'banner-wrapper',
        });
        bannerWrapper.appendChild(bannerSection);
        bannerWrapper.appendChild(buttonObj);

        bannerWrappers.push(bannerWrapper.outerHTML);
      }

      bannerWrapper.innerHTML = bannerWrappers.join('');
    });
  };

  const generateBannerClickHandler = () => {
    document.addEventListener('click', (e) => {
      if (e.target && e.target.className === 'banner-button') {
        e.preventDefault();
        const i = e.target.id.split('-')[2];
        const selectedSection = document.querySelector(`#banner-section-${i}`);
        const selectedImage = document.querySelector(`#banner-image-${i}`);
        html2canvas(selectedSection).then((canvas) => {
          const imageData = canvas.toDataURL('image/png');
          downloadAsImage(imageData, selectedImage.alt);
        });
      }
    });
  };

  const init = () => {
    uploadImagehandler();
    generateBannerClickHandler();
  };
  return {
    init: init,
  };
};
