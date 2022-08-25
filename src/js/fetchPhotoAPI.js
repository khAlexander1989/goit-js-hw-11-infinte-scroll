import axios from 'axios';
import { notFoundError, dataLimitError } from './custom-errors';

const API_KEY = '29411039-bef0e9ba05e6ae384a20b8d38';
const PHOTO_PER_PAGE = 40;

axios.defaults.baseURL = 'https://pixabay.com/api/';

export class FetchPhotoAPI {
  constructor() {
    this._page = 1;
    this._query = null;
    this._fetchedPhotoNumber = 0;
    this._photo_per_page = PHOTO_PER_PAGE;
    this._totalPhotoNumber = 0;
  }

  async fetchPhoto(keyWord) {
    if (keyWord !== undefined) {
      this.init(keyWord);
    }

    const queryParams = `?key=${API_KEY}&q=${this._query}&image_type=photo&orientation=horizontal&safesearch=true
                          &per_page=${PHOTO_PER_PAGE}&page=${this._page}`;

    const response = await axios(queryParams);
    if (!response.data.hits.length) {
      throw new notFoundError(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    this._fetchedPhotoNumber += response.data.hits.length;
    this._totalPhotoNumber = response.data.totalHits;

    if (this._fetchedPhotoNumber > this._totalPhotoNumber) {
      throw new dataLimitError(
        "We're sorry, but you've reached the end of search results."
      );
    }
    this.incrementPage();
    return response.data;
  }

  incrementPage() {
    this._page++;
  }

  init(keyWord) {
    this._query = keyWord;
    this._totalPhotoNumber = 0;
    this._fetchedPhotoNumber = 0;
    this._page = 1;
  }
}
