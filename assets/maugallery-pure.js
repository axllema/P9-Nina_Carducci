function mauGallery(options) {
    var options = Object.assign({}, mauGallery.defaults, options);
    var tagsCollection = [];
    var galleries = document.querySelectorAll('.gallery');
    galleries.forEach(function (gallery) {
        mauGallery.methods.createRowWrapper(gallery);
        
        if (options.lightBox) {
            mauGallery.methods.createLightBox(
            gallery,
            options.lightboxId,
            options.navigation
            );
        }
    
        mauGallery.listeners(options);
    
        gallery.querySelectorAll('.gallery-item').forEach(function (item, index) {
            mauGallery.methods.responsiveImageItem(item);
            mauGallery.methods.moveItemInRowWrapper(item);
            mauGallery.methods.wrapItemInColumn(item, options.columns);
    
            var theTag = item.getAttribute('data-gallery-tag');
            if (
            options.showTags &&
            theTag !== undefined &&
            tagsCollection.indexOf(theTag) === -1
            ) {
            tagsCollection.push(theTag);
            }
        });
    
        if (options.showTags) {
            mauGallery.methods.showItemTags(
            gallery,
            options.tagsPosition,
            tagsCollection
            );
        }
    
        gallery.style.display = 'block';
        });
    }
    
    mauGallery.defaults = {
        columns: 3,
        lightBox: true,
        lightboxId: null,
        showTags: true,
        tagsPosition: 'bottom',
        navigation: true,
    };
    
    mauGallery.listeners = function (options) {
        document.addEventListener('click', function (event) {
        var target = event.target;
    
        if (target.classList.contains('gallery-item')) {
            if (options.lightBox && target.tagName === 'IMG') {
            mauGallery.methods.openLightBox(target, options.lightboxId);
            }
        }
        });
    
        document.querySelector('.gallery').addEventListener('click', function (event) {
        var target = event.target;
    
        if (target.classList.contains('nav-link')) {
            mauGallery.methods.filterByTag.call(target);
        }
    
        if (target.classList.contains('mg-prev')) {
            mauGallery.methods.prevImage(options.lightboxId);
        }
    
        if (target.classList.contains('mg-next')) {
            mauGallery.methods.nextImage(options.lightboxId);
        }
        });
    };
    
    mauGallery.methods = {
        createRowWrapper: function (element) {
        if (
            !element.children[0].classList.contains('row')
        ) {
            var rowWrapper = document.createElement('div');
            rowWrapper.classList.add('gallery-items-row', 'row');
            element.appendChild(rowWrapper);
        }
        },
        wrapItemInColumn: function (element, columns) {
        if (columns.constructor === Number) {
            var colWrapper = document.createElement('div');
            colWrapper.classList.add('item-column', 'mb-4', 'col-' + Math.ceil(12 / columns));
            element.parentNode.appendChild(colWrapper);
            colWrapper.appendChild(element);
        } else if (columns.constructor === Object) {
            var columnClasses = '';
            if (columns.xs) {
            columnClasses += ' col-' + Math.ceil(12 / columns.xs);
            }
            if (columns.sm) {
            columnClasses += ' col-sm-' + Math.ceil(12 / columns.sm);
            }
            if (columns.md) {
            columnClasses += ' col-md-' + Math.ceil(12 / columns.md);
            }
            if (columns.lg) {
            columnClasses += ' col-lg-' + Math.ceil(12 / columns.lg);
            }
            if (columns.xl) {
            columnClasses += ' col-xl-' + Math.ceil(12 / columns.xl);
            }
    
            var colWrapper = document.createElement('div');
            colWrapper.classList.add('item-column', 'mb-4', columnClasses);
            element.parentNode.appendChild(colWrapper);
            colWrapper.appendChild(element);
        } else {
            console.error(
            'Columns should be defined as numbers or objects. ' + typeof columns + ' is not supported.'
            );
        }
        },
        moveItemInRowWrapper: function (element) {
        var rowWrapper = element.closest('.gallery-items-row');
        rowWrapper.appendChild(element);
        },
        responsiveImageItem: function (element) {
        if (element.tagName === 'IMG') {
            element.classList.add('img-fluid');
        }
        },
        openLightBox: function (element, lightboxId) {
        var lightboxImage = document.querySelector(`#${lightboxId} .lightboxImage`);
        lightboxImage.src = element.src;
        document.querySelector(`#${lightboxId}`).classList.toggle('show');
        },
        prevImage: function () {
        var activeImage = null;
        document.querySelectorAll('img.gallery-item').forEach(function (img) {
            if (img.src === document.querySelector('.lightboxImage').src) {
            activeImage = img;
            }
        });
    
        var activeTag = document.querySelector('.tags-bar span.active-tag').getAttribute('data-images-toggle');
        var imagesCollection = [];
        if (activeTag === 'all') {
            document.querySelectorAll('.item-column img').forEach(function (img) {
            imagesCollection.push(img);
            });
        } else {
            document.querySelectorAll('.item-column img').forEach(function (img) {
            if (img.getAttribute('data-gallery-tag') === activeTag) {
                imagesCollection.push(img);
            }
            });
        }
    
        var index = 0;
        var next = null;
    
        imagesCollection.forEach(function (img, i) {
            if (activeImage.src === img.src) {
            index = i - 1;
            }
        });
    
        next = imagesCollection[index] || imagesCollection[imagesCollection.length - 1];
        document.querySelector('.lightboxImage').src = next.src;
        },
        nextImage: function () {
        var activeImage = null;
        document.querySelectorAll('img.gallery-item').forEach(function (img) {
            if (img.src === document.querySelector('.lightboxImage').src) {
            activeImage = img;
            }
        });
    
        var activeTag = document.querySelector('.tags-bar span.active-tag').getAttribute('data-images-toggle');
        var imagesCollection = [];
        if (activeTag === 'all') {
            document.querySelectorAll('.item-column img').forEach(function (img) {
            imagesCollection.push(img);
            });
        } else {
            document.querySelectorAll('.item-column img').forEach(function (img) {
            if (img.getAttribute('data-gallery-tag') === activeTag) {
                imagesCollection.push(img);
            }
            });
        }
    
        var index = 0;
        var next = null;
    
        imagesCollection.forEach(function (img, i) {
            if (activeImage.src === img.src) {
            index = i + 1;
            }
        });
    
        next = imagesCollection[index] || imagesCollection[0];
        document.querySelector('.lightboxImage').src = next.src;
        },
        createLightBox: function (gallery, lightboxId, navigation) {
        var modal = document.createElement('div');
        modal.classList.add('modal', 'fade');
        modal.id = lightboxId || 'galleryLightbox';
        modal.tabIndex = '-1';
        modal.role = 'dialog';
        modal.setAttribute('aria-hidden', 'true');
        modal.innerHTML = `
            <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-body">
                ${
                    navigation
                    ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>'
                    : '<span style="display:none;" />'
                }
                <img class="lightboxImage img-fluid" alt="Contenu de l'image affichée dans la modale au clique"/>
                ${
                    navigation
                    ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;}">></div>'
                    : '<span style="display:none;" />'
                }
                </div>
            </div>
            </div>
        `;
        gallery.appendChild(modal);
        },
        showItemTags: function (gallery, position, tags) {
        var tagItems = '<li class="nav-item"><span class="nav-link active active-tag"  data-images-toggle="all">Tous</span></li>';
        
        tags.forEach(function (value) {
            tagItems += `<li class="nav-item active">
            <span class="nav-link"  data-images-toggle="${value}">${value}</span>
            </li>`;
        });
    
        var tagsRow = `<ul class="my-4 tags-bar nav nav-pills">${tagItems}</ul>`;
    
        if (position === 'bottom') {
            gallery.insertAdjacentHTML('beforeend', tagsRow);
        } else if (position === 'top') {
            gallery.insertAdjacentHTML('afterbegin', tagsRow);
        } else {
            console.error(`Unknown tags position: ${position}`);
        }
        },
        filterByTag: function () {
        if (this.classList.contains('active-tag')) {
            return;
        }
    
        document.querySelector('.active.active-tag').classList.remove('active', 'active-tag');
        this.classList.add('active-tag', 'active');
    
        var tag = this.getAttribute('data-images-toggle');
    
        document.querySelectorAll('.gallery-item').forEach(function (item) {
            item.closest('.item-column').style.display = 'none';
            if (tag === 'all') {
            item.closest('.item-column').style.display = 'block';
            } else if (item.getAttribute('data-gallery-tag') === tag) {
            item.closest('.item-column').style.display = 'block';
            }
        });
        }
    };