import React, {Component} from 'react';

import './LanguageModal.css';
import Modal from '../Modal'

class LanguageModal extends Component {
    render () {
        let self=this;
        return (
            <Modal show={this.props.show} classe="language-modal">
                {this.props.languages.map(function(language){
                    return (
                        <div key={language.key}>
                            <button className="btn" onClick={()=>self.props.changeFn(language.key)}>{language.name}</button>
                        </div>
                    )
                })}
            </Modal>
        )
    }
}

export default LanguageModal;