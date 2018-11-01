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

    render(){
		console.log('Drawerr')
		 const state = this.props.navigation;
		 console.log('Drawerr',state)
		 const children = state;
		 console.log('DrawerChildr',children)
		 const lastChildrenKey = state;
		//  console.log('DrawerrChild',children.length)
		//  let lastChildrenKey = children[children.length-1];
		
		// let lastChildrenKey= [];
		console.log('DrawerrKey',lastChildrenKey.state)
        // tweenHandler={(ratio) => (
        //         {
        //             main: { opacity:Math.max(0.54,1-ratio) }
        //         }
        //     )
        // }

        return(
            <Drawer
				onOpen={()=>{}}
				onOpenStart={()=>{}}
				onClose={()=>{}}
				onCloseStart={()=>{Actions.refresh({key:'IKdrawer',open:value=>false})}}
				ref={c=>this.drawer=c}
				open={state.open}
				type='overlay'
				component={<SideMenu ref={c=>this.sidemenu=c}/>}
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
				//styles={drawerStyles}
				//panCloseMask={0.25}
				//panOpenMask={0.25}
				//captureGestures={}
				//tweenHandler={}
				//tweenEasing={}
                >
					{(this.state.showNav) ? <HeaderTop /> : null}

					{/* <DefaultRenderer navigationState={lastChildrenKey} onNavigate={this.props.onNavigate}/> */}
					<DefaultRenderer navigationState={lastChildrenKey} onNavigate={this.props.onNavigate} drawerStatus={ state.open } />
					{(this.state.showNav) ? <FooterBtm /> : null}
					<Service/>
					<IntroPage from='ik'/>
            </Drawer>
        );
    }


}

//const drawerStyles = {
//	drawer:{backgroundColor:'#fff'},
//}

/*
const drawerStyles = {
    drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3, height: 313},
    drawerOverlay: {height: 313},
    main: {height: 313},
    mainOverlay: {height: 313},
    container: {height: 313},
    Views: {height: 313},
}
*/
