/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text, View } from 'react-native';
import Modal from 'react-native-modalbox';
import colors from '../styles/colors';
import { floatToEuro } from '../utils/amount';

export default class ConfirmationModal extends React.Component {
	constructor(props) {
		super(props);
		this.modal = React.createRef();
	}

	componentDidMount() {
		this.modal.open();
	}

	render() {
		const { title, subtitle, amount, amountColor } = this.props;

		return (
			<Modal
				style={{
					height: 150,
					width: 300,
					flexDirection: 'column',
					borderRadius: 20,
				}}
				position="center"
				ref={ref => (this.modal = ref)}
				backdropOpacity={0.3}
				swipeToClose={false}
			>
				<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start' }}>
					<View
						style={{ padding: 15, borderBottomWidth: 1, borderBottomColor: colors.backgroundLight }}
					>
						<Text
							style={{
								fontSize: 18,
								fontWeight: 'bold',
								textAlign: 'center',
								color: colors.secondary,
							}}
						>
							{title}
						</Text>
						{subtitle ? (
							<Text style={{ fontSize: 14, textAlign: 'center', color: colors.secondary }}>
								{subtitle}
							</Text>
						) : null}
					</View>

					<View style={{ flex: 1, justifyContent: 'center' }}>
						<Text
							style={{
								fontSize: 50,
								fontWeight: 'bold',
								textAlign: 'center',
								color: amountColor || colors.primary,
							}}
						>
							{floatToEuro(amount)}
						</Text>
					</View>
				</View>
			</Modal>
		);
	}
}
