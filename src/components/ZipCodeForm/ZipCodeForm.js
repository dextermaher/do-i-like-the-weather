import React, { Component } from 'react';
import styles from './ZipCodeForm.module.css'

class ZipCodeForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            zipCode: 94945,
        }
    }
    handleFormSubmit = (ev) => {
        // this.fetchZipCode(ev);
        console.log(this);
        
    }
    render() {
        const { zipCode } = this.state;
        return (
            <div className={styles.root}>
                <div className={styles.modalBox}>

                    <div className={styles.zipLabel}>
                        Zip Code: ({zipCode})
                    </div>
                    <input
                        className={styles.zipCode}
                        type="text"
                        name="zip"
                        value={zipCode}
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
