/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text, View } from 'react-native';
import Modal from 'react-native-modalbox';
import * as Haptics from 'expo-haptics';
import colors from '../styles/colors';
import { floatToEuro } from '../utils/amount';

export default class ConfirmationModal extends React.Component {
	constructor(props) {
		super(props);
		this.modal = React.createRef();
	}

	componentDidMount() {
		this.modal.open();
		Haptics.notificationAsync('success').catch();
	}

	render() {
		const { title, subtitle, amount, tintColor, onClose } = this.props;

		return (
			<Modal
				style={{
					height: amount ? 150 : 100,
					width: 300,
					flexDirection: 'column',
					borderRadius: 20,
					shadowColor: '#000',
					shadowOffset: { width: 0, height: 1 },
					shadowOpacity: 0.1,
					shadowRadius: 20,
					elevation: 1,
				}}
				position="center"
				ref={ref => (this.modal = ref)}
				backdropOpacity={0.3}
				coverScreen
				onClosed={onClose}
			>
				<View
					style={{
						flex: 1,
						flexDirection: 'column',
						justifyContent: amount ? 'flex-start' : 'space-around',
					}}
				>
					<View
						style={{
							padding: 15,
							borderBottomWidth: amount ? 1 : 0,
							borderBottomColor: colors.backgroundLight,
						}}
					>
						<Text
							style={{
								fontSize: 18,
								fontWeight: 'bold',
								textAlign: 'center',
								color: tintColor || colors.secondary,
							}}
						>
							{title}
						</Text>
						{subtitle ? (
							<Text
								style={{ fontSize: 14, textAlign: 'center', color: tintColor || colors.secondary }}
							>
								{subtitle}
							</Text>
						) : null}
					</View>

					{amount ? (
						<View style={{ flex: 1, justifyContent: 'center', marginBottom: 5 }}>
							<Text
								style={{
									fontSize: 55,
									fontWeight: 'bold',
									textAlign: 'center',
									color: tintColor || colors.secondary,
								}}
							>
								{floatToEuro(amount)}
							</Text>
						</View>
					) : null}
				</View>
			</Modal>
		);
	}
}
