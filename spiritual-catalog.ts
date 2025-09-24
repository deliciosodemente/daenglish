/**
 * Spiritual Content Catalog Component
 * Displays available books and verses from Prabhupada's teachings
 */

import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { getSpiritualAPI, BookInfo, Verse } from './spiritual-api';

@customElement('spiritual-catalog')
export class SpiritualCatalog extends LitElement {
  @state() books: BookInfo[] = [];
  @state() selectedBook: BookInfo | null = null;
  @state() chapters: Verse[] = [];
  @state() selectedVerse: Verse | null = null;
  @state() loading = false;
  @state() error = '';
  @state() searchQuery = '';
  @state() searchResults: Verse[] = [];

  private api = getSpiritualAPI();

  static styles = css`
    :host {
      display: block;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .catalog-container {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 20px;
      height: calc(100vh - 100px);
    }

    .books-panel {
      background: rgba(0, 0, 0, 0.8);
      border-radius: 15px;
      padding: 20px;
      overflow-y: auto;
    }

    .content-panel {
      background: rgba(0, 0, 0, 0.8);
      border-radius: 15px;
      padding: 20px;
      overflow-y: auto;
    }

    .search-bar {
      margin-bottom: 20px;
    }

    .search-input {
      width: 100%;
      padding: 10px 15px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      font-size: 14px;
    }

    .search-input::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }

    .book-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .book-item {
      padding: 15px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      color: white;
    }

    .book-item:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.3);
    }

    .book-item.selected {
      background: rgba(76, 175, 80, 0.2);
      border-color: #4CAF50;
    }

    .book-title {
      font-weight: bold;
      margin-bottom: 5px;
      color: #4CAF50;
    }

    .book-description {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.8);
      line-height: 1.4;
    }

    .chapter-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
      gap: 10px;
      margin-bottom: 20px;
    }

    .chapter-button {
      padding: 10px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s ease;
    }

    .chapter-button:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .chapter-button.selected {
      background: rgba(76, 175, 80, 0.3);
      border-color: #4CAF50;
    }

    .verse-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .verse-item {
      padding: 20px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.05);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .verse-item:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.3);
    }

    .verse-reference {
      font-weight: bold;
      color: #4CAF50;
      margin-bottom: 10px;
      font-size: 14px;
    }

    .verse-text {
      color: white;
      line-height: 1.6;
      margin-bottom: 10px;
      font-style: italic;
    }

    .verse-purport {
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
      line-height: 1.5;
    }

    .loading {
      text-align: center;
      color: white;
      padding: 40px;
    }

    .error {
      color: #f44336;
      padding: 20px;
      background: rgba(244, 67, 54, 0.1);
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .empty-state {
      text-align: center;
      color: rgba(255, 255, 255, 0.6);
      padding: 40px;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .catalog-container {
        grid-template-columns: 1fr;
        height: auto;
      }

      .books-panel {
        max-height: 300px;
      }
    }
  `;

  async connectedCallback() {
    super.connectedCallback();
    await this.loadBooks();
  }

  async loadBooks() {
    this.loading = true;
    this.error = '';

    try {
      this.books = await this.api.getAvailableBooks();
    } catch (error) {
      console.error('Error loading books:', error);
      this.error = 'Failed to load spiritual books. Please check your connection and try again.';
      // Fallback to mock data for demonstration
      this.books = this.getMockBooks();
    } finally {
      this.loading = false;
    }
  }

  private getMockBooks(): BookInfo[] {
    return [
      {
        title: 'Bhagavad-gita As It Is',
        chapters: 18,
        description: 'The essence of Vedic knowledge, spoken by Lord Krishna Himself to Arjuna on the battlefield of Kurukshetra.'
      },
      {
        title: 'Srimad-Bhagavatam',
        chapters: 335,
        description: 'The ripened fruit of the tree of Vedic literature, containing the complete history of the universe.'
      },
      {
        title: 'Caitanya-caritamrta',
        chapters: 25,
        description: 'The biography of Sri Caitanya Mahaprabhu, the most recent incarnation of Krishna.'
      },
      {
        title: 'Sri Isopanisad',
        chapters: 1,
        description: 'The distilled essence of all Vedic knowledge, revealed by the Lord Himself.'
      },
      {
        title: 'Nectar of Devotion',
        chapters: 1,
        description: 'A summary study of Srila Rupa Gosvami\'s Bhakti-rasamrta-sindhu.'
      }
    ];
  }

  async selectBook(book: BookInfo) {
    this.selectedBook = book;
    this.selectedVerse = null;
    this.chapters = [];
    this.loading = true;

    try {
      // Load first chapter as preview
      this.chapters = await this.api.getChapter(book.title, 1);
    } catch (error) {
      console.error('Error loading chapter:', error);
      this.error = 'Failed to load chapter content.';
      // Fallback to mock verses
      this.chapters = this.getMockVerses(book.title, 1);
    } finally {
      this.loading = false;
    }
  }

  private getMockVerses(bookTitle: string, chapter: number): Verse[] {
    const mockVerses: { [key: string]: Verse[] } = {
      'Bhagavad-gita As It Is': [
        {
          book: 'Bhagavad-gita As It Is',
          chapter: 1,
          verse: 1,
          sanskrit: 'dhṛtarāṣṭra uvāca\ndharma-kṣetre kuru-kṣetre\nsamavetā yuyutsavaḥ\nmāmakāḥ pāṇḍavāś caiva\nkim akurvata sañjaya',
          translation: 'Dhritarashtra said: O Sanjaya, after assembling in the place of pilgrimage at Kurukshetra, what did my sons and the sons of Pandu do, being desirous to fight?',
          purport: 'This first verse of the Bhagavad-gita sets the scene for the great dialogue between Lord Krishna and Arjuna...'
        },
        {
          book: 'Bhagavad-gita As It Is',
          chapter: 2,
          verse: 13,
          sanskrit: 'dehino \'smin yathā dehe\nkaumāraṁ yauvanaṁ jarā\ntathā dehāntara-prāptir\ndhīras tatra na muhyati',
          translation: 'As the embodied soul continuously passes, in this body, from boyhood to youth to old age, the soul similarly passes into another body at death. A sober person is not bewildered by such a change.',
          purport: 'This verse explains the eternal nature of the soul and the temporary nature of the material body...'
        }
      ],
      'Srimad-Bhagavatam': [
        {
          book: 'Srimad-Bhagavatam',
          chapter: 1,
          verse: 1,
          sanskrit: 'janmādy asya yato \'nvayād itarataś cārtheṣv abhijñaḥ svarāṭ\ntene brahma hṛdā ya ādi-kavaye muhyanti yat sūrayaḥ',
          translation: 'O my Lord, Sri Krishna, son of Vasudeva, O all-pervading Personality of Godhead, I offer my respectful obeisances unto You. I meditate upon Lord Sri Krishna because He is the Absolute Truth and the primeval cause of all causes of the creation, sustenance and destruction of the manifested universes.',
          purport: 'This is the first verse of Srimad-Bhagavatam, which begins with prayers to the Supreme Lord...'
        }
      ]
    };

    return mockVerses[bookTitle] || [];
  }

  async loadChapter(chapter: number) {
    if (!this.selectedBook) return;

    this.loading = true;
    try {
      this.chapters = await this.api.getChapter(this.selectedBook.title, chapter);
    } catch (error) {
      console.error('Error loading chapter:', error);
      this.chapters = this.getMockVerses(this.selectedBook.title, chapter);
    } finally {
      this.loading = false;
    }
  }

  selectVerse(verse: Verse) {
    this.selectedVerse = verse;
  }

  async handleSearch() {
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      return;
    }

    this.loading = true;
    try {
      const results = await this.api.searchVerses(this.searchQuery, 10);
      this.searchResults = results.verses;
    } catch (error) {
      console.error('Error searching verses:', error);
      this.searchResults = [];
      this.error = 'Search failed. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  render() {
    return html`
      <div class="catalog-container">
        <div class="books-panel">
          <div class="search-bar">
            <input
              type="text"
              class="search-input"
              placeholder="Search spiritual teachings..."
              .value=${this.searchQuery}
              @input=${(e: Event) => this.searchQuery = (e.target as HTMLInputElement).value}
              @keydown=${(e: KeyboardEvent) => e.key === 'Enter' && this.handleSearch()}
            >
          </div>

          ${this.error ? html`<div class="error">${this.error}</div>` : ''}

          <div class="book-list">
            ${this.books.map(book => html`
              <div
                class="book-item ${this.selectedBook?.title === book.title ? 'selected' : ''}"
                @click=${() => this.selectBook(book)}
              >
                <div class="book-title">${book.title}</div>
                <div class="book-description">${book.description}</div>
                <div style="font-size: 12px; color: rgba(255, 255, 255, 0.6); margin-top: 5px;">
                  ${book.chapters} chapters
                </div>
              </div>
            `)}
          </div>
        </div>

        <div class="content-panel">
          ${this.loading ? html`
            <div class="loading">Loading spiritual teachings...</div>
          ` : this.selectedBook ? html`
            <h2 style="color: #4CAF50; margin-bottom: 20px;">${this.selectedBook.title}</h2>

            ${this.selectedBook.chapters > 1 ? html`
              <div class="chapter-grid">
                ${Array.from({ length: Math.min(this.selectedBook.chapters, 50) }, (_, i) => i + 1).map(chapter => html`
                  <button
                    class="chapter-button"
                    @click=${() => this.loadChapter(chapter)}
                  >
                    ${chapter}
                  </button>
                `)}
              </div>
            ` : ''}

            <div class="verse-list">
              ${(this.searchResults.length > 0 ? this.searchResults : this.chapters).map(verse => html`
                <div class="verse-item" @click=${() => this.selectVerse(verse)}>
                  <div class="verse-reference">
                    ${verse.book} ${verse.chapter}.${verse.verse}
                  </div>
                  <div class="verse-text">"${verse.translation}"</div>
                  ${verse.purport ? html`
                    <div class="verse-purport">${verse.purport}</div>
                  ` : ''}
                </div>
              `)}
            </div>

            ${this.chapters.length === 0 && this.searchResults.length === 0 ? html`
              <div class="empty-state">
                Select a book or search for spiritual teachings to begin your journey.
              </div>
            ` : ''}
          ` : html`
            <div class="empty-state">
              <h2 style="color: #4CAF50; margin-bottom: 20px;">Welcome to Spiritual Catalog</h2>
              <p>Select a book from the left panel to explore Srila Prabhupada's teachings on Krishna consciousness.</p>
              <p>Or use the search bar to find specific verses and topics.</p>
            </div>
          `}
        </div>
      </div>
    `;
  }
}