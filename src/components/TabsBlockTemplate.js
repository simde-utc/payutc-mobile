/**
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import BlockTemplate from './BlockTemplate';
import colors from '../styles/colors';

export default class TabsBlockTemplate extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = { selected: props.default || 0 };
	}

	onTabChange(index) {
		this.setState({ selected: index });
	}

	render() {
		const {
			tabs,
			text,
			style,
			roundedTop,
			roundedBottom,
			shadow,
			disabled,
			tintColor,
			onChange,
		} = this.props;
		const { selected } = this.state;

		return (
			<BlockTemplate
				roundedTop={roundedTop}
				roundedBottom={roundedBottom}
				shadow={shadow}
				style={[{ padding: 0, backgroundColor: colors.backgroundBlock }, style]}
			>
				{text ? (
					<Text
						style={{
							fontSize: 14,
							fontWeight: 'bold',
							color: colors.secondary,
							margin: 10,
							marginBottom: 0,
						}}
					>
						{text}
					</Text>
				) : null}
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{
						margin: 5,
						padding: 5,
						marginRight: 0,
						paddingRight: 0,
						flexGrow: 1,
						flexDirection: 'row',
						justifyContent: 'space-between',
						flexWrap: 'nowrap',
						backgroundColor: colors.backgroundBlock,
						borderTopLeftRadius: roundedTop ? 10 : 0,
						borderTopRightRadius: roundedTop ? 10 : 0,
						borderBottomLeftRadius: roundedBottom ? 10 : 0,
						borderBottomRightRadius: roundedBottom ? 10 : 0,
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
							style={{ marginRight: 10 }}
							onPress={() => {
								this.onTabChange(index);
								if (onChange) onChange(index);
							}}
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
				</ScrollView>
				<View
					style={{
						borderBottomWidth: tabs.filter(tab => tab.children).length ? 1 : 0,
						borderBottomColor: colors.backgroundLight,
					}}
				/>
				{tabs[selected].children ? tabs[selected].children() : null}
			</BlockTemplate>
		);
	}
}
