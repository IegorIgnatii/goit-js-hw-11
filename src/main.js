import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import fetchImages from './js/pixabay-api';
import renderImages from './js/render-function';

const formEl = document.querySelector('.form');
const listImagesEl = document.querySelector('.images-list');
const loaderEl = document.querySelector('.loader');
const inputEl = document.querySelector('.input');

formEl.addEventListener('submit', event => {
  event.preventDefault();
  listImagesEl.innerHTML = '';
  loaderEl.style.display = 'block';
  const valueUser = inputEl.value.trim();

  formEl.reset();
  if (!valueUser) {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search query',
    });
    loaderEl.style.display = 'none';

    return;
  }

  fetchImages(valueUser)
    .then(data => {
      if (data.hits.length === 0) {
        iziToast.warning({
          title: 'Warning',
          message:
            'Sorry, there are no images matching your search query. Please try again!',
        });

        return;
      }

      renderImages(data.hits);
      new SimpleLightbox('.images-list a', {
        captionsData: 'alt',
        captionDelay: 250,
      }).refresh();
    })
    .catch(error => {
      iziToast.error({
        title: 'Error',
        message: `Something went wrong: ${error.message}`,
      });
    })
    .finally(() => {
      loaderEl.style.display = 'none';
    });
});
