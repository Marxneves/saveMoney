import React from 'react';
import { Trash2 } from 'react-feather';

function List(props) {
  const { elements, exclude } = props;
  console.log(elements);
  return (
    <ul>
      {elements.map((element) => (
        <div key={ element.itemLista } className='lista'>
          <li >{ element.itemLista }</li>
          <li className="li-value">R$ { element.value }</li>
          <Trash2 size={ 24 } className="img-trash" onClick={ () => { exclude(element) } } />
        </div>
      )) }
    </ul>
  )
}

export default List;