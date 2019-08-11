/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import BlockTemplate from './BlockTemplate';
import colors from '../styles/colors';

export default class TitleParams extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = { show: false };
	}

	onTabChange(show) {
		this.setState({ show });
	}

	render() {
		const { title, settingText, children } = this.props;
		const { show } = this.state;

		return (
			<>
				<BlockTemplate
					roundedTop
					roundedBottom={!show}
					shadow
					style={{
						flex: 1,
						flexDirection: 'row',
						justifyContent: 'space-between',
						margin: 15,
						marginBottom: 0,
					}}
				>
					<Text style={{ fontSize: 22, fontWeight: 'bold', color: colors.primary }}>{title}</Text>
					<BlockTemplate
						roundedTop
						roundedBottom
						shadow
						style={{ paddingVertical: 5 }}
						onPress={() => this.setState({ show: !show })}
						customBackground={show ? colors.backgroundLight : null}
					>
						<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
							<Text
								style={{
									fontSize: 14,
									fontWeight: 'bold',
									color: colors.secondary,
									marginRight: 5,
								}}
							>
								{settingText}
							</Text>
							<FontAwesomeIcon icon={['fas', 'sliders-h']} size={14} color={colors.secondary} />
						</View>
					</BlockTemplate>
				</BlockTemplate>
				{show ? children : null}
			</>
		);
	}
}
