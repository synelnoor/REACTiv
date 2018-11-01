/*
 * @Author: artha prihardana 
 * @Date: 2017-02-22 17:01:31 
 * @Last Modified by: artha prihardana
 * @Last Modified time: 2017-02-22 17:44:43
 */
import React, { Component } from 'react';
import { 
    WebView,
    Animated
 } from 'react-native';

class WebHtmlView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: props.height || 0
        }
    }
    
    _handleNavigationStateChange(navState) {
        if (this.state.height !== navState.title) {
            const contentHeight = parseInt(navState.title, 10) || 0;
            this.setState({
                height: Number(contentHeight)
            })
        }
        if (typeof this.props.onNavigationStateChange === 'function') {
            this.props.onNavigationStateChange()
        }
    }

    render() {
        let {source, autoHeight, style, innerCSS} = this.props;

        if (!source) {
            return null
        }

        const injectScript = `
        <script>
            (function() {
            var wrapper = document.createElement("div");
            wrapper.id = "height-wrapper";
            while (document.body.firstChild) {
                wrapper.appendChild(document.body.firstChild);
            }
            document.body.appendChild(wrapper);
            var i = 0;
            function updateHeight() {
                document.title = wrapper.clientHeight;
                window.location.hash = ++i;
            }
            updateHeight();
            window.addEventListener("load", function() {
                updateHeight();
                setTimeout(updateHeight, 1000);
            });
            window.addEventListener("resize", updateHeight);
            }());
        </script>
        `
        const startHtmlDoc = `
        <html><head>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>${innerCSS}</style></head><body>
        `
        const endHtmlDoc = '</body></html>'

        if (source.html && autoHeight) {
            //console.log('html==>', source.html);
            let finalHtmlDoc = startHtmlDoc +
                                '<div style="word-break:break-word">' +
                                source.html +
                                '</div>' +
                                injectScript +
                                endHtmlDoc
            //console.log('finalhtml==>', finalHtmlDoc);
            source = Object.assign({}, source, {
                html: finalHtmlDoc
            });
            
        }

        return (
            <WebView
                source={source}
                style={[style, autoHeight ? {height: this.state.height + 25} : {height: 0} ]}
                automaticallyAdjustContentInsets={false}
                scrollEnabled={!autoHeight}
                javaScriptEnabled={autoHeight}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                onNavigationStateChange={this._handleNavigationStateChange.bind(this)} />
        )
    }
}

WebHtmlView.defaultProps = {
    innerCSS: '',
    autoHeight: true
};

export default WebHtmlView