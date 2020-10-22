import React from 'react';
import './App.css';
import List from './component/List';

// function addItem({ target }) {
//   // const input = <input type="text" />
//   const input = document.createElement('input');
//   const input2 = document.createElement('input');
//   const lista = target.previousElementSibling;
//   input.className = 'input-list';
//   input.addEventListener('keydown', (event) => {
//     if (event.key === 'Enter') {
//       const label = document.createElement('label');
//       label.innerText = event.target.value;
//       lista.replaceChild(label, input);
//       input2.className = 'input-list';
//     }
//   })

//   input2.addEventListener('keydown', (event) => {
//     if (event.key === 'Enter') {
//       const label = document.createElement('label');
//       label.innerText = `R$ ${event.target.value}`;
//       lista.replaceChild(label, input2);
//       input2.className = 'input-list';
//       const btn = document.createElement('button');
//       btn.className = 'btnAdd';
//       btn.addEventListener('click', addItem);
//       lista.parentNode.appendChild(btn);
//     }
//   })
//   input2.className = 'input-list input-hidden';
//   // input.classList.add("input-list");
//   lista.appendChild(input);
//   lista.appendChild(input2);
//   target.remove();
// }
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
      meta: 10000,
    };

    this.addElement = this.addElement.bind(this);
    this.exclude = this.exclude.bind(this);

    this.addElementNeed = this.addElementNeed.bind(this);
    this.excludeNeed = this.excludeNeed.bind(this);
    this.addMoney = this.addMoney.bind(this);
    this.removeMoney = this.removeMoney.bind(this);
    this.inputAddMoney = this.inputAddMoney.bind(this);
  }

  componentDidMount() {
    if (localStorage.items) {
      const wishList = JSON.parse(localStorage.items);
      this.setState({ wishList });
    }

    if (localStorage.itemsNeed) {
      const needList = JSON.parse(localStorage.itemsNeed);
      this.setState({ needList });
    }

    if (localStorage.money) {
      const money = JSON.parse(localStorage.money);
      this.setState({ money });
      const footer = document.querySelector('footer');
      const porcentagem = (money * 100) / (this.state.meta - 3970);
      footer.style.marginTop = `${101 - porcentagem}%`;
      footer.style.height = `${(porcentagem * 61) / 100}%`;
    }
  }

  addMoney() {
    const { money, inputMoney } = this.state;
    const result = money + Number(inputMoney);
    this.setState({ money: result });
    localStorage.money = JSON.stringify(result);
    document.querySelector('#addValueMoney').value = '';
    const footer = document.querySelector('footer');
    const porcentagem = (result * 100) / (this.state.meta - 3970);
    footer.style.marginTop = `${101 - porcentagem}%`;
    footer.style.height = `${(porcentagem * 61) / 100}%`;
  };

  removeMoney() {
    const { money, inputMoney } = this.state;
    const result = money - Number(inputMoney);
    this.setState({ money: result });
    localStorage.money = JSON.stringify(result);
    document.querySelector('#addValueMoney').value = '';
    const footer = document.querySelector('footer');
    const porcentagem = (result * 100) / (this.state.meta - 3970);
    footer.style.marginTop = `${101 - porcentagem}%`;
    footer.style.height = `${(porcentagem * 61) / 100}%`;
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
      const { needList } = this.state;
      this.setState({ needList: [...needList, obj], insertNeed: true },
        () => {
          localStorage.itemsNeed = JSON.stringify(this.state.needList)
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
    const { needList } = this.state;
    const newNeedList = needList.filter(li => li !== value);
    this.setState({ needList: newNeedList });
    localStorage.itemsNeed = JSON.stringify(newNeedList);
  };

  render() {
    const { meta, money } = this.state;
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
          <footer></footer>
        </div>
      </div>
    );
  }
}

export default App;
