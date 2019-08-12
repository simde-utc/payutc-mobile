/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { ScrollView, View, Text, Linking } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import List from '../../components/List';
import BlockTemplate from '../../components/BlockTemplate';
import colors from '../../styles/colors';
import { Dependencies as t } from '../../utils/i18n';
import PackageJson from '../../../package.json';

const NPM_PACKAGE_URL = 'https://www.npmjs.com/package';

export default class DependenciesScreen extends React.Component {
	static navigationOptions = () => ({
		title: t('title'),
		headerStyle: { borderBottomWidth: 0 },
		headerForceInset: { top: 'never' },
		headerTintColor: colors.primary,
	});

	static renderDependency(dependency, index, last) {
		const description = t(`descriptions.${dependency}`, { defaultValue: '' });

		return (
			<BlockTemplate
				customBackground={index % 2 === 0 ? colors.backgroundBlockAlt : colors.backgroundBlock}
				roundedBottom={last}
				onPress={() => Linking.openURL(`${NPM_PACKAGE_URL}/${dependency}`)}
			>
				<View
					style={{
						flex: 1,
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<View>
						<Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.secondary }}>
							{dependency}
						</Text>
						{description ? (
							<Text style={{ fontSize: 10, color: colors.secondary }}>{description}</Text>
						) : null}
					</View>
					<FontAwesomeIcon icon={['fas', 'angle-right']} size={20} color={colors.secondary} />
				</View>
			</BlockTemplate>
		);
	}

	render() {
		return (
			<ScrollView style={{ backgroundColor: colors.backgroundLight, padding: 15 }}>
				<BlockTemplate roundedTop roundedBottom shadow>
					<View style={{ flex: 1, flexDirection: 'column' }}>
						<Text
							style={{
								fontSize: 16,
								fontWeight: 'bold',
								color: colors.secondary,
							}}
						>
							{t('react_native_app')}
						</Text>
						<Text
							style={{
								fontSize: 13,
								color: colors.secondary,
							}}
						>
							{t('license_info')}
						</Text>
					</View>
				</BlockTemplate>
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
