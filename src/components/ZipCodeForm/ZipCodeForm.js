import React, { Component } from 'react';
// import fetchZipCode from '../MainUI/MainUI'
import styles from './ZipCodeForm.module.css'

class ZipCodeForm extends Component {
    constructor(props) {
        super(props);
        this.bgRef = undefined;
        this.zipCodeFieldRef = undefined;
        this.state = {
            zipCode: 94945,
        }
    }
    componentDidMount() {
        document.addEventListener("keydown", this.escFunction, false);
        this.zipCodeFieldRef.focus();   
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.escFunction, false);
    }

    handleFormSubmit = (ev) => {
        this.props.onSearch && this.props.onSearch(this.state.zipCode);
        this.doClose(ev);
    }
    handleBackgroundClick = (ev) => {
        if (ev.target !== this.bgRef) {
            return;
        }
        if (this.state.clickIsOnModal) {
            this.setState({clickIsOnModal : false});
            return
        }
        else {
            this.doClose();
        }
    }

    doClose(){
        this.props.onClose && this.props.onClose();
    }

    escFunction = (event) => {
        if (event.keyCode === 27) {
            this.doClose(event);
        }
    }

    enterButtonForModal = (event) => {
        if (event.keyCode === 13) {
            this.handleFormSubmit(event);
        }
    }


    render() {
        const { zipCode } = this.state;
        return (
            <div className={styles.root}
                onClick={this.handleBackgroundClick}
                ref={elem => this.bgRef = elem}>

                <div className={styles.modalBox} >

                    <div className={styles.zipLabel}>
                        Zip Code: ({zipCode})
                    </div>

                    <input
                        className={styles.zipCode}
                        type="text"
                        name="zip"
                        value={zipCode}
                        onKeyUp={this.enterButtonForModal}
                        ref={elem => this.zipCodeFieldRef = elem}
                        onChange={(ev) => {
                            this.setState({ zipCode: ev.target.value });
                        }} />
                    <input className={styles.enterButton}
                        type="button"
                        value="Enter"
                        onClick={this.handleFormSubmit} />

                </div>
            </div>
        );
    }
}

export default ZipCodeForm;
