/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { connect } from 'react-redux';
import SpinnerOverlay from 'react-native-loading-spinner-overlay';

class Spinner extends React.PureComponent {
	render() {
		const { config } = this.props;

		return <SpinnerOverlay {...config.spinner} />;
	}
}

const mapStateToProps = ({ config }) => ({ config });

export default connect(mapStateToProps)(Spinner);
