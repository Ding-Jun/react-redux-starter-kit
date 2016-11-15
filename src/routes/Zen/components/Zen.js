/**
 * Created by admin on 2016/11/10.
 */
import React from 'react'

export const Zen = (props) => (
  <div style={{ margin: '0 auto' }} >
    <h2>Zen</h2>

    {' '}
    <button className='btn btn-default' onClick={props.fetchZen}>
      Fetch a wisdom

    </button>
    <ul>
      {props.zens.map(zen =>
        <li key={zen.id}>
          {zen.value}
        </li>
      )}
    </ul>
  </div>
)

Zen.propTypes = {
  fetchZen: React.PropTypes.func.isRequired,
  zens: React.PropTypes.array.isRequired
}

export default Zen
