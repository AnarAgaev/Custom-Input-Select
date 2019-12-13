// 📁 main.js

const _jsonDataPath = 'fonts.json';

class DataList {
  constructor(inputId, listId, url) {
    this.input = document.getElementById(inputId);
    this.list = document.getElementById(listId);
    this.url = url;
  }

  createList(filter = '') {
    $.getJSON(this.url)
      .done( data => this.filterList(data, filter) )
      .fail( () => {
        console.log( new Error("Error path or date of the JSON file!") );
      });
  }

  filterList(data, filter) {
    const filtered = data.filter( element => {
      const str = element.name.toLowerCase();
      const filterStr = filter.toLowerCase();

      return str.indexOf(filterStr) !== -1;
    });

    this.list.innerHTML = filtered
      .map( currentItem =>
        `<li class="input-list__item" id=${currentItem.id}>
            ${ this.highlightMatch(currentItem.name, filter) }
          </li>`
      ).join('');
  }

  addListeners(datalist) {

    // Listening when the user enters data in the input
    this.input.addEventListener('input', () => {
      datalist.createList(
        this.input.value.trim()
      );
    });

    // Listening when the user clicks on some item of the list
    this.list.addEventListener('click', event =>  {
      if (event.target.nodeName.toLowerCase() === 'li') {
        this.input.value = event.target.innerText;
      }
    });

    // Remove the active item when the mouse is over the list
    this.list.addEventListener('mouseover', event =>  {
      this.cleanActiveItem(
        this.list.getElementsByTagName('li')
      );
    });

    // Listening to keyboard events like up arrow, down arrow and push enter
    document.body.addEventListener('keydown', event => {
      if ( document.activeElement === this.input ) {
        if (event.code === 'ArrowUp') this.changeActiveItem(-1);
        else if (event.code === 'ArrowDown') this.changeActiveItem(1);
        else if (event.code === 'Enter') this.changeActiveItem(0);
      }
    });
  }

  paintItem(activeItem, list) {
    [].forEach.call(list, (elem, id) => {
      if (id === activeItem) {
        elem.classList.add('active');
      }
    });
  };

  getActiveItem(direction = 0, list) {
    let itemIndex = [].findIndex.call(list, (elem, id) => {
      return elem.classList.contains('active');
    });

    itemIndex = itemIndex !== -1
      ? itemIndex + direction
      : itemIndex;

    return itemIndex;
  }

  cleanActiveItem(list) {
    [].forEach.call(list, (elem, id) => {
        elem.classList.remove('active');
    });
  }

  changeActiveItem(direction) {
    const list = this.list.getElementsByTagName('li');
    const activeItem = this.getActiveItem(direction, list);

    this.cleanActiveItem(list);

    switch( direction ) {
      case -1:
        if (activeItem === -1) {
          this.paintItem(--list.length, list);
        } else this.paintItem(activeItem, list);
        break;

      case 1:
        if (activeItem === -1 || activeItem === list.length) {
          this.paintItem(0, list);
        } else this.paintItem(activeItem, list);
        break;

      case 0:
        this.input.value = list[activeItem].innerText;
        this.input.blur();
        break;
    }
  }

  highlightMatch(str, substr) {
    if (!substr) return str;

    const start = str.toLowerCase().indexOf( substr.toLowerCase() );
    const startString = str.slice(0, start);
    const overlapString = str.slice(start, start + substr.length);
    const endString = str.slice(start + substr.length);

    return `${startString}<b>${overlapString}</b>${endString}`;
  }
}

const fontList = new DataList(
  'datalist-input',
  'datalist-ul',
  _jsonDataPath
);
fontList.createList();
fontList.addListeners(fontList);