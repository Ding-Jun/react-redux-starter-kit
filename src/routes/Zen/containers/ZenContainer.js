/**
 * Created by admin on 2016/11/10.
 */
import { connect } from 'react-redux'
import { fetchZen } from '../modules/zen'

/*  This is a container component. Notice it does not contain any JSX,
 nor does it import React. This component is **only** responsible for
 wiring in the actions and state necessary to render a presentational
 component - in this case, the Zen:   */

import Zen from '../components/Zen'

/*  Object of action creators (can also be function that returns object).
 Keys will be passed as props to presentational components. Here we are
 implementing our wrapper around increment; the component doesn't care   */

const mapDispatchToProps = {
  fetchZen:fetchZen
}

const mapStateToProps = (state) => ({
  ...state.zen
})

/*  Note: mapStateToProps is where you should use `reselect` to create selectors, ie:

 import { createSelector } from 'reselect'
 const Zen = (state) => state.Zen
 const tripleCount = createSelector(Zen, (count) => count * 3)
 const mapStateToProps = (state) => ({
 Zen: tripleCount(state)
 })

 Selectors can compute derived data, allowing Redux to store the minimal possible state.
 Selectors are efficient. A selector is not recomputed unless one of its arguments change.
 Selectors are composable. They can be used as input to other selectors.
 https://github.com/reactjs/reselect    */

export default connect(mapStateToProps, mapDispatchToProps)(Zen)
