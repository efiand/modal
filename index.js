const DEFAULT_CONFIG = {
	closerSelector: '.modal__closer',
	openedContainerClass: 'modal_opened',
	rootElement: document.documentElement,
	openedRootClass: 'modal-mode',
	escSupport: true,
	outClickSupport: true
};
const ACTIVE_SELECTORS = [
	'[tabindex]:not([tabindex="-1"])',
	'a[href]',
	'button:not(:disabled)',
	'input:not(:disabled)',
	'select:not(:disabled)',
	'textarea:not(:disabled)'
];
export default class Modal {
	constructor(options) {
		this._options = Object.assign({}, DEFAULT_CONFIG, options);

		this._container = options.container;
		this._activeSelectors = [...new Set([
			...ACTIVE_SELECTORS,
			...options.activeElements
		])].join(',');
		this._rootElement = options.rootElement;
		this._openedContainerClass = options.openedContainerClass;
		this._openedRootClass = options.openedRootClass;
		this._escSupport = options.escSupport;
		this._outClickSupport = options.outClickSupport;

		this._closer = null;
		if (this._options.closerSelector) {
			this._closer = this._container.querySelector(this._options.closerSelector);
		}

		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
		this._firstBlurHandler = this._firstBlurHandler.bind(this);
		this._lastBlurHandler = this._lastBlurHandler.bind(this);
	}

	get isOpened() {
		return this._container.classList.contains(this._openedContainerClass);
	}

	get _activeElements() {
		return this._container.querySelectorAll(this._activeSelectors);
	}

	get _firstActiveElement() {
		return this._activeElements[0];
	}

	get _lastActiveElement() {
		return this._activeElements[this._activeElements.length - 1];
	}

	init() {
		this._opener.addEventListener('click', this.open);
		this._addFocusListeners();
	}

	destroy() {
		this._opener.removeEventListener('click', this.open);
		this.close();
		this._removeFocusListeners();
	}

	open() {
		if (this.isOpened) {
			return;
		}

		this._container.classList.add(this._openedContainerClass);
		this._rootElement.classList.add(this._openedRootClass);
		if (this._closer) {
			this._closer.addEventListener('click', this.close());
		}
		if (this._firstActiveElement) {
			this._firstActiveElement.focus();
		}
		this._addFocusListeners();
	}

	close() {
		if (!this.isOpened) {
			return;
		}

		this._container.classList.remove(this._openedContainerClass);
		this._rootElement.classList.remove(this._openedRootClass);
		if (this._closer) {
			this._closer.removeEventListener('click', this.close());
		}
		this._removeFocusListeners();
		this._opener.focus();
	}

	resetFocusListeners() {
		// может понадобиться при динамическом изменении состава полей
		this._removeFocusListeners();
		this._addFocusListeners();
	}

	_addFocusListeners() {
		if (this._firstActiveElement) {
			this._firstActiveElement.addEventListener('blur', this._firstBlurHandler);
		}
		if (this._lastActiveElement) {
			this._lastActiveElement.addEventListener('blur', this._lastBlurHandler);
		}
	}

	_removeFocusListeners() {
		if (this._firstActiveElement) {
			this._firstActiveElement.removeEventListener('blur', this._firstBlurHandler);
		}
		if (this._lastActiveElement) {
			this._lastActiveElement.removeEventListener('blur', this._lastBlurHandler);
		}
	}

	_firstBlurHandler() {
		if (!this._container.contains(document.activeElement)) {
			this._firstActiveElement.focus();
		}
	}

	_lastBlurHandler() {
		if (!this._container.contains(document.activeElement)) {
			this._lastActiveElement.focus();
		}
	}
}