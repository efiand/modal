# modal
Логика модального блока, приспосабливаемая под произвольную вёрстку

## Пример подключения

```js
import Modal from 'modal';

const modal = new Modal({
	container: document.querySelector('.modal'),
	opener: document.querySelector('.modal-opener'),
	openedRootClass: 'page_modal'
});
```