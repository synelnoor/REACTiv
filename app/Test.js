import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  TouchableHighlight
} from 'react-native';
import { Provider, connect } from 'react-redux';
import * as actions from  './comp/redux/Action'
import store from './comp/redux/Store'


class Test extends Component{

componentDidMount(){
  console.log(this.props)
}

componentWillReceiveProps(nextProps){
  console.log("nextProps => ",nextProps)
  console.log(this.props)
}

customCount(name){
  let count = this.props.count + 5
  this.props.updateCounts({ name:name, data:count })
}

 render(){
   return(
     <TouchableHighlight onPress={()=>{
       this.customCount("count")
   }}>
       <View>
        <Text>{this.props.count} test</Text>
       </View>
     </TouchableHighlight>
   );
 }

}


function mapStateToProps(state) {
  return {
    count: state.count
  }
}
function mapDispatchToProps(dispatch) {
  return {
    updateCounts: (data) => {
        dispatch(actions.update(data))
    },
    updateCount: (data) => {
      console.log(data);
      console.log(data);
    },
  }
}

export default connect( mapStateToProps, mapDispatchToProps )(Test);
