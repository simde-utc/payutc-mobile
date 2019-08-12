/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { ScrollView, View } from 'react-native';
import List from '../../components/List';
import Paragraphe from '../../components/Paragraphe';
import Dependency from '../../components/Dependencies/Dependency';
import colors from '../../styles/colors';
import { Dependencies as t } from '../../utils/i18n';
import PackageJson from '../../../package.json';

export default class DependenciesScreen extends React.Component {
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
					title={t('react_native_app')}
					description={t('license_info')}
					titleColor={colors.transfer}
				/>
				<View style={{ height: 15 }} />
				<List
					title={t('dependencies')}
					items={Object.keys(PackageJson.dependencies)}
					keyExtractor={item => item}
					renderItem={DependenciesScreen.renderDependency}
				/>
				<View style={{ height: 15 }} />
				<List
					title={t('dev_dependencies')}
					items={Object.keys(PackageJson.devDependencies)}
					keyExtractor={item => item}
					renderItem={DependenciesScreen.renderDependency}
				/>
				<View style={{ height: 30 }} />
			</ScrollView>
		);
	}
}
