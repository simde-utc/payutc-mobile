/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { ScrollView, View } from 'react-native';
import Paragraphe from '../../components/Paragraphe';
import Dependency from '../../components/Dependencies/Dependency';
import colors from '../../styles/colors';
import { Contributors as t } from '../../utils/i18n';

export default class ContributorsScreen extends React.Component {
	static navigationOptions = () => ({
		title: t('title'),
		headerStyle: { borderBottomWidth: 0 },
		headerForceInset: { top: 'never' },
		headerTintColor: colors.primary,
	});

	static renderDependency(dependency, index, last) {
		return (
			<Dependency
				dependency={dependency}
				backgroundColor={index % 2 === 0 ? colors.backgroundBlockAlt : colors.backgroundBlock}
				roundedBottom={last}
			/>
		);
	}

	render() {
		return (
			<ScrollView style={{ backgroundColor: colors.backgroundLight, padding: 15 }}>
				<Paragraphe
					title={t('developped')}
					description={t('developped_desc')}
					titleColor={colors.transfer}
				/>
				<View style={{ height: 15 }} />
			</ScrollView>
		);
	}
}
