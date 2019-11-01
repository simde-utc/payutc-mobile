/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import BlockTemplate from '../BlockTemplate';
import colors from '../../styles/colors';

export default class ModalBlockTemplate extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
		};
	}

	open() {
		this.setState({ visible: true });
		Haptics.notificationAsync('success').catch();
	}

	close() {
		const { onClose } = this.props;

		this.setState({ visible: false });
		if (onClose) onClose();
	}

	render() {
		const { children } = this.props;
		const { visible } = this.state;

		return (
			<TouchableOpacity
				onPress={() => this.close()}
				activeOpacity={1}
				style={{
					display: visible ? 'flex' : 'none',
					position: 'absolute',
					top: 0,
					bottom: 0,
					left: 0,
					right: 0,
					backgroundColor: `${colors.shadow}55`,
					justifyContent: 'center',
				}}
			>
				<BlockTemplate
					shadow
					style={{
						flexDirection: 'column',
						marginHorizontal: 40,
						shadowColor: colors.shadow,
						shadowOffset: { width: 0, height: 1 },
						shadowOpacity: 0.1,
						shadowRadius: 20,
						elevation: 2,
						borderTopLeftRadius: 15,
						borderTopRightRadius: 15,
						borderBottomLeftRadius: 15,
						borderBottomRightRadius: 15,
					}}
				>
					<BlockTemplate
						roundedTop
						roundedBottom
						style={{ alignSelf: 'flex-end', position: 'absolute', borderTopRightRadius: 15 }}
						onPress={() => this.close()}
					>
						<FontAwesomeIcon icon={['fa', 'times']} size={25} style={{ color: colors.secondary }} />
					</BlockTemplate>
					{children}
				</BlockTemplate>
			</TouchableOpacity>
		);
	}
}
