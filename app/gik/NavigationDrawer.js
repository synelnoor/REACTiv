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

	_logoPress(e){
		this.sidemenu._setActive(e);
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
				onCloseStart={()=>{Actions.refresh({key:'GIKdrawer',open:value=>false})}}
				ref={c=>this.drawer=c}
				open={state.open}
				type='overlay'
				content={<SideMenu ref={c=>this.sidemenu=c}/>}
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
					{(this.state.showNav) ? <HeaderTop logoPress={(e)=>{this._logoPress(e)}}/> : null}
                    <DefaultRenderer navigationState={lastChildrenKey} onNavigate={this.props.onNavigate}/>
                    {(this.state.showNav) ? <FooterBtm/> : null}
					<Service/>
					<IntroPage from='gik'/>
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
