import React, { Component } from 'react';
import { Drawer } from 'native-base';
import { Actions, DefaultRenderer } from 'react-native-router-flux';
import HeaderTop from './HeaderTop';
import FooterBtm from './FooterBtm';
import SideMenu from './SideMenu';
import IntroPage from '../comp/IntroPage';
import Service from '../comp/Service';


export default class tesDrawer extends Component {
    constructor(props){
		super(props);

		this.state = {
			showNav:true,
		}
	}

	componentDidMount() {
		this.props.onRef(this)
	  }
	  componentWillUnmount() {
		this.props.onRef(undefined)
	  }

	componentWillReceiveProps(e){
		if(
			typeof e.active1 !== 'undefined' &&
			typeof e.active2 !== 'undefined'
		){
			this.sidemenu._setActive(e.active1,e.active2);
		}
	}

	_toggleNav(val) {
		this.setState({showNav:val})
	}

	hideNav() {
		this._toggleNav(false)
	}

	showNav() {
		this._toggleNav(true)
	}


  render() {
    closeDrawer = () => {
      this.drawer._root.close()
    };
    openDrawer = () => {
      this.drawer._root.open()
    };

    console.log('Drawerr')
        // const state = this.props.navigationState;
        // const children = state.children;
				// let lastChildrenKey = children[children.length-1];
				console.log('pro',this.props)
				const state = this.props.navigation;
				console.log('pro',state)
				const children = state.children;
				console.log('pro',children)
        
    return (


      <View>
			

        {(this.state.showNav) ? <HeaderTop /> : null}

        {/* <DefaultRenderer navigationState={children[0]} onNavigate={this.props.onNavigate} /> */}
        {(this.state.showNav) ? <FooterBtm /> : null}
        <Service/>
        <IntroPage from='ik'/>
      
      </View>
    );
  }
}