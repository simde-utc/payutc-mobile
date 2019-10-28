/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { View } from 'react-native';
import Modal from 'react-native-modalbox';
import * as Haptics from 'expo-haptics';
import colors from '../../styles/colors';

export default class ModalContainerView extends React.PureComponent {
	constructor(props) {
		super(props);
		this.modal = React.createRef();
	}

	open() {
		this.modal.open();
		Haptics.notificationAsync('success').catch();
	}

	close() {
		this.modal.close();
	}

	render() {
		const { style, children, modalChildren, onClosed } = this.props;

		return (
			<View style={style}>
				<Modal
					style={{
						height: 200,
						width: 300,
						flexDirection: 'column',
						borderRadius: 20,
						shadowColor: colors.shadow,
						shadowOffset: { width: 0, height: 1 },
						shadowOpacity: 0.1,
						shadowRadius: 20,
						elevation: 2,
					}}
					position="center"
					ref={ref => (this.modal = ref)}
					backdropOpacity={0.3}
					backdropColor={colors.shadow}
					coverScreen
					onClosed={onClosed}
				>
					{modalChildren}
				</Modal>

				{children}
			</View>
		);
	}
}
