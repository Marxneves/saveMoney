import React from 'react';
import './App.css';
import List from './component/List';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      wishList: [],
      needList: [],
      insert: true,
      insertNeed: true,
      money: 0,
      inputMoney: '',
      meta: 0,
    };

    this.addElement = this.addElement.bind(this);
    this.exclude = this.exclude.bind(this);
    this.addElementNeed = this.addElementNeed.bind(this);
    this.excludeNeed = this.excludeNeed.bind(this);
    this.addMoney = this.addMoney.bind(this);
    this.removeMoney = this.removeMoney.bind(this);
    this.inputAddMoney = this.inputAddMoney.bind(this);
  }

  async componentDidMount() {
    if (localStorage.items) {
      const wishList = JSON.parse(localStorage.items);
      this.setState({ wishList });
    }

    if (localStorage.itemsNeed) {
      const needList = JSON.parse(localStorage.itemsNeed);
      const meta = needList.reduce((acc, curr) => acc + Number(curr.value), 0);
      await this.setState({ needList, meta });
    }

    if (localStorage.money) {
      const money = JSON.parse(localStorage.money);
      this.setState({ money });
      const footer = document.querySelector('.footer-totalValue');
      if (money <= this.state.meta) {
        const porcentagem = (money * 100) / this.state.meta;
        footer.style.height = `${porcentagem}%`;
      } else {
        footer.style.height = `100%`;
      };
    }

  }

  addMoney() {
    const { money, inputMoney, meta } = this.state;
    const result = money + Number(inputMoney);
    this.setState({ money: result, inputMoney: '' });
    localStorage.money = JSON.stringify(result);
    document.querySelector('#addValueMoney').value = '';
    const footer = document.querySelector('.footer-totalValue');
    if (result <= meta) {
      const porcentagem = (result * 100) / meta;
      footer.style.height = `${porcentagem}%`;
    } else {
      footer.style.height = `100%`;
    }
  };

  removeMoney() {
    const { money, inputMoney, meta } = this.state;
    const result = money - Number(inputMoney);
    this.setState({ money: result, inputMoney: '' });
    localStorage.money = JSON.stringify(result);
    document.querySelector('#addValueMoney').value = '';
    const footer = document.querySelector('.footer-totalValue');
    if (result <= meta) {
      const porcentagem = (result * 100) / meta;
      footer.style.height = `${porcentagem}%`;
    } else {
      footer.style.height = `100%`;
    }
  };

  inputAddMoney({ target }) {
    const { value } = target;
    this.setState({ inputMoney: value });
  };

  addElement(item, valor, event) {
    const itemLista = document.querySelector(`#${item}`).value;
    const { value } = document.querySelector(`#${valor}`);
    const enterOrClick = (event.key === 'Enter' || event.target.innerText === '+');
    if ((itemLista && value) && enterOrClick) {
      const obj = { itemLista, value };
      const { wishList } = this.state;
      this.setState({ wishList: [...wishList, obj], insert: true }, () => (localStorage.items = JSON.stringify(this.state.wishList)));
      document.querySelector(`#${item}`).value = '';
      document.querySelector(`#${valor}`).value = '';
    }
  };

  addElementNeed(item, valor, event) {
    const itemLista = document.querySelector(`#${item}`).value;
    const { value } = document.querySelector(`#${valor}`);
    const enterOrClick = (event.key === 'Enter' || event.target.innerText === '+');
    if ((itemLista && value) && enterOrClick) {
      const obj = { itemLista, value };
      const { needList, meta, money } = this.state;
      const total = meta;
      this.setState({ needList: [...needList, obj], insertNeed: true, meta: total + Number(value) },
        () => {
          localStorage.itemsNeed = JSON.stringify(this.state.needList);
          localStorage.meta = JSON.stringify(this.state.meta);
          const footer = document.querySelector('.footer-totalValue');
          if (money <= this.state.meta) {
            const porcentagem = (money * 100) / this.state.meta;
            footer.style.height = `${porcentagem}%`;
          } else {
            footer.style.height = `100%`;
          }
        });
      document.querySelector(`#${item}`).value = '';
      document.querySelector(`#${valor}`).value = '';
    }
  };

  exclude(value) {
    const { wishList } = this.state;
    const newWishList = wishList.filter(li => li !== value);
    this.setState({ wishList: newWishList });
    localStorage.items = JSON.stringify(newWishList);
  };

  excludeNeed(value) {
    const { needList, money } = this.state;
    const newNeedList = needList.filter(li => li !== value);
    const newMeta = newNeedList.reduce((acc, curr) => acc + Number(curr.value), 0);
    this.setState({ needList: newNeedList, meta: newMeta });
    localStorage.itemsNeed = JSON.stringify(newNeedList);
    localStorage.meta = JSON.stringify(newMeta);
    const footer = document.querySelector('.footer-totalValue');
    if (money <= newMeta) {
      const porcentagem = (money * 100) / newMeta;
      footer.style.height = `${porcentagem}%`;
    } else {
      footer.style.height = `100%`;
    }
  };

  render() {
    const { meta, money, wishList } = this.state;
    const result = wishList.reduce((acc, curr) => acc + Number(curr.value), 0);
    return (
      <div className="App">
        <div className="column">
          <h2>Wish list</h2>
          <div className="div-list">
            { (this.state.wishList.length > 0)
              ? <List elements={ this.state.wishList } exclude={ this.exclude } />
              : ''
            }
          </div>
          { this.state.insert
            ? <div className="div-openBtn"><button className="btnAdd" onClick={ () => this.setState({ insert: false, insertNeed: true }) }>+</button></div>
            : <div className="inputs-add">
              <input id="addItem" placeholder="What We Wish" type="text" />
              <input id="addValue" onKeyPress={ (event) => { this.addElement("addItem", "addValue", event) } } placeholder="R$" type="text" />
              <button className="btnAdd" onClick={ (event) => { this.addElement("addItem", "addValue", event) } }>+</button>
            </div>
          }
          <footer className="footer-value">Total: { result }</footer>
        </div>

        <div className="column">
          <h2>Need!!1</h2>
          <div className="div-list">
            { (this.state.needList.length > 0)
              ? <List elements={ this.state.needList } exclude={ this.excludeNeed } />
              : ''
            }
          </div>
          { this.state.insertNeed
            ? <div className="div-openBtn"><button className="btnAdd" onClick={ () => this.setState({ insert: true, insertNeed: false }) }>+</button></div>
            :
            <div className="inputs-add">
              <input id="addItemNeed" placeholder="What We Need" type="text" />
              <input id="addValueNeed" onKeyPress={ (event) => { this.addElementNeed("addItemNeed", "addValueNeed", event) } } placeholder="R$" type="text" />
              <button className="btnAdd" onClick={ (event) => { this.addElementNeed("addItemNeed", "addValueNeed", event) } }>+</button>
            </div>
          }
        </div>
        <div className="column">
          <div className="div-absolute">

            {
              (money >= meta)
                ? <h2>Money :)</h2>
                : <h2>Money :(</h2>
            }
            <h2>Meta: { meta }</h2>
            <h2>Save: { this.state.money }</h2>
            <div className="inputs-add">
              <button className="btnMinus" onClick={ this.removeMoney }>-</button>
              <input id="addValueMoney" onKeyUp={ this.inputAddMoney } placeholder="R$" type="text" />
              <button className="btnAdd" onClick={ this.addMoney }>+</button>
            </div>
          </div>
          <footer className="footer-totalValue"></footer>
        </div>
      </div>
    );
  }
}

export default App;
