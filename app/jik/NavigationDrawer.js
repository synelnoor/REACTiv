import React, { Component } from 'react';
import { Drawer } from 'native-base';
import { Actions, DefaultRenderer } from 'react-native-router-flux';

import HeaderTop from './HeaderTop';
import FooterBtm from './FooterBtm';
import SideMenu from './SideMenu';
import IntroPage from '../comp/IntroPage';
import Service from '../comp/Service';

export default class NavigationDrawer extends Component {
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

	  _toggleNav(val) {
		  this.setState({showNav:val})
	  }
  
	  hideNav() {
		  this._toggleNav(false)
	  }
  
	  showNav() {
		  this._toggleNav(true)
	  }

    render(){
        const state = this.props.navigationState;
        const children = state.children;

        let lastChildrenKey = children[children.length-1];

        return (
            <Drawer
				onOpen={()=>{}}
				onOpenStart={()=>{}}
				onClose={()=>{}}
				onCloseStart={()=>{Actions.refresh({key:'JIKdrawer',open:value=>false})}}
				ref={c=>this.drawer=c}
				open={state.open}
				type='overlay'
				content={<SideMenu refreshData={ state.open } />}
				tweenDuration={150}
				openDrawerOffset={0.25}
				closedDrawerOffset={0}
				tapToClose={true}
				negotiatePan={false}
				disabled={false}
				acceptDoubleTap={false}
				acceptTap={false}
				acceptPan={false}
				useInteractionManager={true}
                >
					{(this.state.showNav) ? <HeaderTop/> : null}
					<DefaultRenderer navigationState={lastChildrenKey} onNavigate={this.props.onNavigate} drawerStatus={ state.open }/>
					{(this.state.showNav) ? <FooterBtm/> : null}
					<Service/>
					<IntroPage from='jik'/>
            </Drawer>
        );
    }
}
