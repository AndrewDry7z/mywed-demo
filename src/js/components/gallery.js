import Blazy from "../utils/blazy";

class Gallery {
    constructor(name, src, city, id, filter) {
        this.name = name;
        this.src = src;
        this.city = city;
        this.id = id;
        this.filter = filter;
    }

    checkIsntItemHidden() {
        let hiddenItemsLocalStorage = localStorage.getItem('hidden-items'),
            checkStatus;

        if (hiddenItemsLocalStorage) {
            checkStatus = hiddenItemsLocalStorage.indexOf(this.id) <= -1;
        } else {
            checkStatus = true;
        }

        return checkStatus;
    }

    showLightbox() {
        let lightboxOverlay = document.createElement('section');

        lightboxOverlay.classList.add('lightbox-overlay');
        document.querySelector('body').appendChild(lightboxOverlay);

        lightboxOverlay.innerHTML = `
        <div class="lightbox-body">
        <span class="lightbox-close js-lightbox-close"></span>
            <picture>
                    <source type="image/webp" srcset="assets/images/${this.src}.webp">
                    <source type="image/jpeg" srcset="assets/images/${this.src}.jpg 1x,
                                assets/images/${this.src}@2x.jpg 2x,
                                assets/images/${this.src}@3x.jpg 3x">
                    <img class="lightbox-image b-lazy"
                        data-src="assets/images/${this.src}.jpg"
                        srcset="assets/images/${this.src}.jpg 1x,
                                assets/images/${this.src}@2x.jpg 2x,
                                assets/images/${this.src}@3x.jpg 3x">
            </picture>  
        </div>
        `;

        let closeLightbox = document.querySelector('.js-lightbox-close');
        closeLightbox.addEventListener('click', () => {
            lightboxOverlay.remove();
        });

    }

    createItem() {
        if (!this.filter
            || ((this.city.indexOf(this.filter) > -1)
                || (this.name.indexOf(this.filter) > -1))) {

            let newItem = document.createElement('div'),
                gallery = document.querySelector('.gallery');

            if (this.checkIsntItemHidden()) {

                newItem.classList.add('gallery-item');
                newItem.id = this.id;
                newItem.innerHTML = `
                    <picture>
                        <source type="image/webp" srcset="assets/images/${this.src}.webp">
                        <source type="image/jpeg" srcset="assets/images/${this.src}.jpg 1x,
                                assets/images/${this.src}@2x.jpg 2x,
                                assets/images/${this.src}@3x.jpg 3x">
                        <img class="gallery-item__photo b-lazy js-photo-thumbnail"
                            id=${this.src} 
                            data-src="assets/images/${this.src}.jpg"
                            srcset="assets/images/${this.src}.jpg 1x,
                                assets/images/${this.src}@2x.jpg 2x,
                                assets/images/${this.src}@3x.jpg 3x"
                            alt="${this.name}, ${this.city}"
                            title="${this.name}, ${this.city}">
                    </picture>
                    <div class="gallery-item__info">
                        <div class="gallery-item__description">
                            <b>${this.name}</b>, ${this.city}   
                        </div>
                        <div class="gallery-item__hide js-hide-item" data-id="${this.id}">
                            <img src="assets/images/eye.svg" alt="Скрыть это фото">
                        </div>
                                                                   
                    </div>
                                `;
                gallery.appendChild(newItem);
            }

        }

        // images lazy load
        let bLazy = new Blazy({});

        // dynamic h1
        let dynamicHeading = document.querySelector('.dynamic-heading');
        switch (true) {
            case (this.city.indexOf(this.filter) > -1 && this.filter.length >= 2):
                dynamicHeading.innerHTML = `Фоторафии из города ${this.city}:`;
                break;
            case (this.name.indexOf(this.filter) > -1 && this.filter.length >= 2):
                dynamicHeading.innerHTML = `Фоторафии автора ${this.name}:`;
                break;
            case (this.filter.length <= 2):
                dynamicHeading.innerHTML = `Все фотографии:`;
                break;

        }

        let allHideButtons = document.querySelectorAll('.js-hide-item'),
            hiddenElementsArray = [];

        for (let hideButton of allHideButtons)
            hideButton.addEventListener('click', () => {
                let hiddenImage = document.getElementById(hideButton.dataset.id);

                hiddenImage.classList.add('gallery-item--hidden');
                setTimeout(function () {
                    hiddenImage.style.display = 'none';
                }, 350);

                hiddenElementsArray.push(hideButton.dataset.id);
                localStorage.setItem('hidden-items', hiddenElementsArray.toString());
            });

    }
}

export default Gallery;
