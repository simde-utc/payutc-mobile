/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text, View } from 'react-native';
import BlockTemplate from './BlockTemplate';
import colors from '../styles/colors';

export default class TabsBlockTemplate extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = { selected: 0 };
	}

	onTabChange(index) {
		this.setState({ selected: index });
	}

	render() {
		const { tabs, style, roundedTop, roundedBottom, shadow, disabled, tintColor } = this.props;
		const { selected } = this.state;

		return (
			<BlockTemplate
				roundedTop={roundedTop}
				roundedBottom={roundedBottom}
				shadow={shadow}
				style={[{ paddingHorizontal: 0, paddingBottom: 0 }, style]}
			>
				<View
					style={{
						flex: 1,
						flexDirection: 'row',
						justifyContent: 'space-between',
						flexWrap: 'nowrap',
						borderBottomWidth: 1,
						borderBottomColor: colors.backgroundLight,
						paddingHorizontal: 10,
						paddingBottom: 10,
					}}
				>
					{tabs.map((tab, index) => (
						<BlockTemplate
							roundedTop
							roundedBottom
							shadow
							key={tab.title}
							disabled={disabled}
							customBackground={selected === index && !disabled ? tintColor : null}
							onPress={() => this.onTabChange(index)}
						>
							<Text
								style={{
									fontSize: 14,
									fontWeight: 'bold',
									color: disabled
										? colors.disabled
										: selected === index
										? colors.backgroundBlock
										: tintColor,
								}}
							>
								{tab.title}
							</Text>
						</BlockTemplate>
					))}
				</View>
				{tabs[selected].children}
			</BlockTemplate>
		);
	}
}
